import {listVbeeVoices} from '../src/providers/vbee';

const main = async () => {
  if (process.argv.includes('--male') && process.argv.includes('--female')) throw new Error('Choose only one gender filter');
  const gender = process.argv.includes('--male') ? 'male' : process.argv.includes('--female') ? 'female' : undefined;
  const limitArg = process.argv.find((value) => value.startsWith('--limit='));
  const cursorArg = process.argv.find((value) => value.startsWith('--cursor='));
  const result = await listVbeeVoices({
    gender,
    limit: limitArg ? Number(limitArg.slice('--limit='.length)) : 100,
    cursor: cursorArg?.slice('--cursor='.length),
    dryRun: process.argv.includes('--dry-run'),
  });
  console.log(JSON.stringify(result, null, 2));
};
main().catch((error) => { console.error(error); process.exitCode = 1; });
