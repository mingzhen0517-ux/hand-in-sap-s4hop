#!/usr/bin/env node

import { spawn } from "node:child_process";
import { chmod, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const connectionFile = resolve(
  projectRoot,
  process.env.SAP_CONNECTION_FILE ?? "SAP_CONNECTION.local.md",
);
const profileId = "S4H100";
const profileHome = join(projectRoot, ".sap-abap-mcp");
const profileFile = join(profileHome, "profiles.json");
const serverEntry = join(
  projectRoot,
  "node_modules",
  "@coaspe",
  "sap-abap-mcp",
  "dist",
  "src",
  "index.js",
);

function setting(document, label, { required = true } = {}) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.match(
    new RegExp(`^- ${escaped}[：:]\\s*\\x60([^\\x60]+)\\x60\\s*$`, "mu"),
  );
  if (match) return match[1].trim();
  if (!required) return undefined;
  throw new Error(`Missing \`${label}\` in ${connectionFile}`);
}

function parseBoolean(value, label) {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${label} must be \`true\` or \`false\``);
}

async function writeProfile(profile) {
  const content = `${JSON.stringify({ version: 1, profiles: [profile] }, null, 2)}\n`;
  let current;
  try {
    current = await readFile(profileFile, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  if (current === content) return;

  await mkdir(profileHome, { recursive: true, mode: 0o700 });
  const temporaryFile = `${profileFile}.tmp-${process.pid}`;
  await writeFile(temporaryFile, content, { mode: 0o600 });
  await rename(temporaryFile, profileFile);
  await chmod(profileFile, 0o600);
}

async function main() {
  const document = await readFile(connectionFile, "utf8");
  const fullUrl = new URL(setting(document, "URL"));
  const client = setting(document, "Client");
  const username = setting(document, "User");
  const password = setting(document, "Password");
  const language = setting(document, "Language");
  const environment = setting(document, "Environment");
  const allowedPackages = setting(document, "Writable packages")
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);
  const allowDataQueries = parseBoolean(
    setting(document, "Allow data queries"),
    "Allow data queries",
  );
  const verifyTlsCertificate = parseBoolean(
    setting(document, "TLS certificate verification"),
    "TLS certificate verification",
  );

  if (!/^\d{3}$/.test(client)) throw new Error("Client must contain three digits");
  if (!/^[A-Z]{2}$/.test(language)) throw new Error("Language must contain two uppercase letters");
  if (!["development", "quality", "production"].includes(environment)) {
    throw new Error("Environment must be development, quality, or production");
  }
  if (fullUrl.protocol !== "https:") throw new Error("SAP MCP requires an HTTPS URL");
  if (allowedPackages.length === 0) throw new Error("At least one writable package is required");

  await writeProfile({
    id: profileId,
    url: fullUrl.origin,
    client,
    language,
    environment,
    allowDataQueries,
    authType: "basic",
    username,
    allowedPackages,
  });

  const passwordEnvironmentName = `SAP_ABAP_MCP_PASSWORD_${profileId}`;
  const childEnvironment = {
    ...process.env,
    SAP_ABAP_MCP_HOME: profileHome,
    [passwordEnvironmentName]: password,
    ...(verifyTlsCertificate ? {} : { NODE_TLS_REJECT_UNAUTHORIZED: "0" }),
  };

  const argumentsForServer = process.argv.slice(2);
  if (argumentsForServer.length === 0) {
    argumentsForServer.push(
      "serve",
      "--profile",
      profileId,
      "--preset",
      "adaptive",
      "--audit-log",
      "stderr",
    );
  }

  const child = spawn(process.execPath, [serverEntry, ...argumentsForServer], {
    cwd: projectRoot,
    env: childEnvironment,
    stdio: "inherit",
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => child.kill(signal));
  }

  child.once("error", (error) => {
    console.error(`Unable to start SAP ABAP MCP: ${error.message}`);
    process.exitCode = 1;
  });
  child.once("exit", (code, signal) => {
    process.exitCode = code ?? (signal ? 1 : 0);
  });
}

main().catch((error) => {
  console.error(`SAP ABAP MCP configuration error: ${error.message}`);
  process.exitCode = 1;
});
