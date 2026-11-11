import { mkdir, readFile, writeFile } from 'node:fs/promises';
const source = await readFile(new URL('../src/zalo-custom-reaction.js', import.meta.url), 'utf8');
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/ZaloCustomReaction.user.js', import.meta.url), source);
console.log('Built dist/ZaloCustomReaction.user.js');
