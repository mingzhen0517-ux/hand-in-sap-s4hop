#!/usr/bin/env node

import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runner = join(projectRoot, "scripts", "sap-mcp-runner.mjs");
const expectedTools = new Set([
  "sap.repository.search",
  "sap.source.read",
  "sap.source.diagnose",
  "sap.system.inspect",
  "sap.capability.search",
  "sap.capability.invoke_write",
]);

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [
    runner,
    "serve",
    "--profile",
    "S4H100",
    "--preset",
    "adaptive",
    "--audit-log",
    "none",
  ],
  cwd: projectRoot,
  stderr: "pipe",
});
const client = new Client({ name: "sap-abap-mcp-smoke-test", version: "1.0.0" });

function resultData(result) {
  if (result.structuredContent?.data) return result.structuredContent.data;
  const text = result.content?.find((item) => item.type === "text")?.text;
  if (!text) return undefined;
  try {
    return JSON.parse(text).data;
  } catch {
    return undefined;
  }
}

async function main() {
  let diagnostics = "";
  transport.stderr?.on("data", (chunk) => {
    diagnostics += String(chunk);
  });

  try {
    await client.connect(transport);
    const listed = await client.listTools();
    const names = new Set(listed.tools.map((tool) => tool.name));
    const missing = [...expectedTools].filter((name) => !names.has(name));
    if (missing.length > 0) throw new Error(`Missing expected tools: ${missing.join(", ")}`);

    const systemsResult = await client.callTool({ name: "sap.system.list", arguments: {} });
    const systems = resultData(systemsResult)?.systems ?? [];
    const configured = systems.find((system) => system.id === "S4H100");
    if (!configured?.credentialAvailable) {
      throw new Error("S4H100 profile or credential is unavailable");
    }

    const inspectResult = await client.callTool({
      name: "sap.system.inspect",
      arguments: { systemId: "S4H100", includeComponents: false },
    });
    if (inspectResult.isError) throw new Error("Live SAP system inspection failed");
    const system = resultData(inspectResult);

    const searchResult = await client.callTool({
      name: "sap.repository.search",
      arguments: {
        systemId: "S4H100",
        pattern: "Z*",
        objectTypes: ["PROG", "DEVC", "MSAG"],
        limit: 5,
      },
    });
    if (searchResult.isError) throw new Error("Live SAP repository search failed");
    const foundObjects = resultData(searchResult)?.objects ?? [];
    if (foundObjects.length === 0) {
      throw new Error("Live SAP repository search returned no matching objects");
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          toolCount: listed.tools.length,
          profile: configured,
          repositorySearchCount: foundObjects.length,
          liveSystem: system
            ? {
                client: system.client,
                sapRelease: system.sapRelease,
                systemType: system.systemType,
                logicalSystem: system.logicalSystem,
              }
            : "connected",
        },
        null,
        2,
      ),
    );
  } catch (error) {
    if (diagnostics.trim()) console.error(diagnostics.trim());
    throw error;
  } finally {
    await client.close().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error(`MCP smoke test failed: ${error.message}`);
  process.exitCode = 1;
});
