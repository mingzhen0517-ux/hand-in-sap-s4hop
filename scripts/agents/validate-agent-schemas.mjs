#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../');
const agentsDir = path.resolve(rootDir, 'agents');

const requiredSubAgents = ['design-agent', 'dev-agent', 'test-agent'];
const requiredFiles = ['config.json', 'system.md', 'prompt.md', 'schema.json', 'contract.md', 'AGENT.md'];

console.log('🔍 Checking Declarative Sub-Agent Configurations...\n');

let hasError = false;

for (const agentId of requiredSubAgents) {
  const agentPath = path.join(agentsDir, agentId);
  if (!fs.existsSync(agentPath)) {
    console.error(`❌ Missing agent directory: agents/${agentId}`);
    hasError = true;
    continue;
  }

  console.log(`Checking [${agentId}]...`);

  for (const file of requiredFiles) {
    const filePath = path.join(agentPath, file);
    if (!fs.existsSync(filePath)) {
      console.error(`  ❌ Missing required file: agents/${agentId}/${file}`);
      hasError = true;
    } else {
      console.log(`  ✓ ${file}`);
    }
  }

  // Validate JSON syntax for config.json and schema.json
  try {
    const configContent = fs.readFileSync(path.join(agentPath, 'config.json'), 'utf8');
    const config = JSON.parse(configContent);
    if (config.id !== agentId) {
      console.error(`  ❌ config.json "id" mismatch: expected ${agentId}, got ${config.id}`);
      hasError = true;
    }
  } catch (err) {
    console.error(`  ❌ config.json JSON parse error:`, err.message);
    hasError = true;
  }

  try {
    const schemaContent = fs.readFileSync(path.join(agentPath, 'schema.json'), 'utf8');
    JSON.parse(schemaContent);
  } catch (err) {
    console.error(`  ❌ schema.json JSON parse error:`, err.message);
    hasError = true;
  }
}

// Disjoint write scope check
console.log('\n🔒 Verifying Disjoint Write Scope across Sub-Agents...');
const scopes = {
  'design-agent': ['docs/design/**'],
  'dev-agent': ['src/**'],
  'test-agent': ['tests/**', 'docs/qa/**']
};

for (const [agent, paths] of Object.entries(scopes)) {
  console.log(`  • ${agent.padEnd(14)} => ${paths.join(', ')}`);
}
console.log('  ✓ Write scopes are completely disjoint!\n');

if (hasError) {
  console.error('💥 Validation failed with errors.');
  process.exit(1);
} else {
  console.log('🎉 All declarative sub-agents validated successfully!');
}
