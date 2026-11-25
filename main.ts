import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';

const MAX_BYTES = 1048576;
const MAX_DIM = 1024;
const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function fail(message) {
  console.error(`entry.png invalid: ${message}`);
  process.exit(1);
}

const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

function validate(data) {
  if (data.length > MAX_BYTES) fail(`size ${data.length} exceeds ${MAX_BYTES}`);
  if (data.length < 57 || !data.subarray(0, 8).equals(SIGNATURE)) fail('bad PNG signature');
  let offset = 8;
  let index = 0;
  let header = null;
  let sawIend = false;
  const idat = [];
  while (offset < data.length) {
    if (sawIend) fail('data after IEND');
    if (offset + 12 > data.length) fail('truncated chunk header');
    const length = data.readUInt32BE(offset);
    const type = data.toString('latin1', offset + 4, offset + 8);
    const end = offset + 12 + length;
    if (end > data.length) fail(`truncated ${type} chunk`);
    const body = data.subarray(offset + 8, offset + 8 + length);
    if (crc32(data.subarray(offset + 4, offset + 8 + length)) !== data.readUInt32BE(end - 4)) {
      fail(`CRC mismatch in ${type}`);
    }
    if (index === 0) {
      if (type !== 'IHDR' || length !== 13) fail('IHDR must be first');
      header = {
        width: body.readUInt32BE(0),
        height: body.readUInt32BE(4),
        depth: body[8],
        color: body[9],
        interlace: body[12],
      };
      if (!header.width || !header.height) fail('zero dimension');
      if (header.width > MAX_DIM || header.height > MAX_DIM) {
        fail(`${header.width}x${header.height} exceeds ${MAX_DIM}x${MAX_DIM}`);
      }
      if (!(header.color in channels)) fail('bad colour type');
    } else if (type === 'IHDR') fail('duplicate IHDR');
    if (type === 'IDAT') idat.push(body);
    if (type === 'IEND') {
      if (length !== 0) fail('IEND not empty');
      sawIend = true;
    }
    offset = end;
    index++;
  }
  if (!sawIend) fail('missing IEND');
  if (!idat.length) fail('missing IDAT');
  let raw;
  try {
    raw = inflateSync(Buffer.concat(idat));
  } catch (error) {
    fail(`IDAT stream corrupt: ${error.message}`);
  }
  if (header.interlace === 0) {
    const bitsPerPixel = channels[header.color] * header.depth;
    const expected = header.height * (1 + Math.ceil((header.width * bitsPerPixel) / 8));
    if (raw.length !== expected) fail(`pixel data ${raw.length} bytes, expected ${expected}`);
  }
  return header;
}

const source = fileURLToPath(new URL('./entry.png', import.meta.url));
const data = readFileSync(source);
const header = validate(data);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), data);
console.log(`entry.png ${header.width}x${header.height} ${data.length} bytes OK`);
