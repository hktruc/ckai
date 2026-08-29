import {loadVoiceRegistry, validateVoiceRegistry} from '../src/registry';

const registry = loadVoiceRegistry();
const result = validateVoiceRegistry(registry);
console.log(JSON.stringify({entries: Object.keys(registry).length, ...result}, null, 2));
if (result.errors.length) process.exitCode = 1;
