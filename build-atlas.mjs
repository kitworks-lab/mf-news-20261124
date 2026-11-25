import { writeFileSync, mkdtempSync, statSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const SANS = "'Segoe UI','Arial',sans-serif";
const SERIF = "'Georgia',serif";
const MONO = "'Consolas',monospace";
const C = { ground: '#EEF1F5', navy: '#0E1B2E', navy2: '#132238', line: '#C9D3DF', ink: '#0E1B2E', mute: '#43536A',
  emerald: '#157A4C', vermilion: '#C83226', indigo: '#264B8A', crimson: '#B91C1C', cobalt: '#1B5E7A', ochre: '#C27803' };

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function lines(arr, x, y, step, attrs) {
  return `<text x="${x}" y="${y}" ${attrs}>${arr.map((l, i) => `<tspan x="${x}" dy="${i ? step : 0}">${esc(l)}</tspan>`).join('')}</text>`;
}

function worldMap() {
  const W = 448, H = 88, top = 80, bottom = -58;
  const px = (lon) => ((lon + 180) / 360 * W).toFixed(1);
  const py = (lat) => ((top - lat) / (top - bottom) * H).toFixed(1);
  const poly = (pts) => `<polygon points="${pts.map(([lon, lat]) => `${px(lon)},${py(lat)}`).join(' ')}" fill="#34506F" stroke="#4B6A8C" stroke-width="0.6"/>`;
  const land = [
    [[-168,66],[-140,70],[-95,72],[-80,70],[-62,60],[-55,50],[-67,44],[-76,35],[-81,25],[-97,26],[-105,20],[-95,16],[-85,10],[-78,8],[-90,15],[-110,24],[-118,33],[-124,42],[-125,50],[-140,60],[-165,60]],
    [[-78,8],[-60,10],[-50,0],[-35,-6],[-40,-22],[-58,-38],[-66,-55],[-74,-50],[-72,-30],[-80,-5]],
    [[-10,36],[-9,43],[-2,48],[5,53],[10,58],[20,70],[40,68],[70,73],[110,77],[140,72],[170,69],[180,65],[160,58],[142,52],[135,43],[125,38],[122,30],[110,20],[106,10],[100,2],[98,15],[90,22],[80,8],[72,20],[58,24],[48,29],[36,36],[27,37],[22,38],[12,44],[3,43]],
    [[-17,21],[-6,36],[10,37],[32,31],[43,12],[51,12],[40,-15],[32,-28],[20,-35],[12,-17],[9,4],[-8,4],[-17,14]],
    [[114,-22],[130,-12],[142,-11],[153,-27],[146,-39],[132,-32],[115,-34]],
  ];
  const pins = [[1, -108, 32], [2, 50, 26], [3, -74, 41], [4, -125, 49], [5, 33, 48], [6, 121, 24]];
  const pinSvg = pins.map(([n, lon, lat]) => `<circle cx="${px(lon)}" cy="${py(lat)}" r="11" fill="#FF6B57" opacity="0.28"/><circle cx="${px(lon)}" cy="${py(lat)}" r="8" fill="${n === 2 || n === 4 ? '#FF6B57' : '#2BD08A'}" stroke="#fff" stroke-width="1.5"/><text x="${px(lon)}" y="${(+py(lat) + 3.8).toFixed(1)}" text-anchor="middle" font-family="${SANS}" font-size="10.5" font-weight="800" fill="#0E1B2E">${n}</text>`).join('');
  return `<g transform="translate(560,10)"><rect width="${W}" height="${H}" rx="8" fill="#0A1524" stroke="#26405F"/>${land.map(poly).join('')}${pinSvg}</g>`;
}

function heroNvidia() {
  const pts = [[14, 168], [50, 150], [84, 156], [120, 118], [156, 126], [196, 80], [232, 54], [262, 22]];
  const line = pts.map((p) => p.join(',')).join(' ');
  return `<rect width="448" height="200" rx="10" fill="#F3F7F5" stroke="#D5E3DB"/>
  <g stroke="#DCE4EC" stroke-width="1">${[40, 80, 120, 160].map((y) => `<line x1="14" y1="${y}" x2="280" y2="${y}"/>`).join('')}</g>
  <defs><linearGradient id="nvfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#157A4C" stop-opacity="0.34"/><stop offset="1" stop-color="#157A4C" stop-opacity="0.04"/></linearGradient></defs><polygon points="${line} 262,184 14,184" fill="url(#nvfill)"/>
  <polyline points="${line}" fill="none" stroke="#157A4C" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
  <polygon points="262,10 282,34 250,32" fill="#157A4C"/>
  <circle cx="120" cy="118" r="6" fill="#C83226"/><text x="132" y="146" font-family="${SANS}" font-size="12" font-weight="700" fill="#C83226">OUSTED</text>
  <text x="16" y="34" font-family="${SANS}" font-size="44" font-weight="800" fill="#157A4C">+31.5%</text>
  <text x="18" y="58" font-family="${SANS}" font-size="16" font-weight="700" fill="#0E1B2E">+$1T MARKET CAP ADDED</text>
  <g transform="translate(364,84)">
    <circle r="70" fill="#fff" stroke="#157A4C" stroke-width="5" stroke-dasharray="300 60" transform="rotate(-60)"/>
    <polygon points="30,-70 62,-52 28,-44" fill="#157A4C" transform="rotate(8)"/>
    ${[-28, -9, 10, 29].map((v) => `<line x1="${v}" y1="-36" x2="${v}" y2="-48" stroke="#0E1B2E" stroke-width="4"/><line x1="${v}" y1="36" x2="${v}" y2="48" stroke="#0E1B2E" stroke-width="4"/><line x1="-36" y1="${v}" x2="-48" y2="${v}" stroke="#0E1B2E" stroke-width="4"/><line x1="36" y1="${v}" x2="48" y2="${v}" stroke="#0E1B2E" stroke-width="4"/>`).join('')}
    <rect x="-36" y="-36" width="72" height="72" rx="8" fill="#0E1B2E"/>
    <rect x="-22" y="-22" width="44" height="44" rx="4" fill="none" stroke="#2BD08A" stroke-width="3"/>
    <path d="M-22,-8h14v-14M22,8h-14v14M-8,22v-10h16M8,-22v10h-16" stroke="#2BD08A" stroke-width="2.5" fill="none"/>
    <text y="6" text-anchor="middle" font-family="${MONO}" font-size="17" font-weight="700" fill="#fff">GPU</text>
  </g>
  <text x="364" y="186" text-anchor="middle" font-family="${SANS}" font-size="12.5" font-weight="800" fill="#0E1B2E">11-DAY OUSTER REVERSED</text>`;
}

function tanker(x, y) {
  return `<g transform="translate(${x},${y})">
  <path d="M0,-14 C-10,-30 8,-40 -2,-62 C16,-44 14,-30 6,-16 Z" fill="#7A1E18" opacity="0.8"/>
  <path d="M8,-16 C0,-30 18,-42 12,-58 C28,-42 24,-28 14,-16 Z" fill="#555" opacity="0.7"/>
  <path d="M-4,-10 L2,-24 L8,-10 Z" fill="#FF9A1F"/><path d="M-1,-10 L2,-18 L5,-10 Z" fill="#FFD23F"/>
  <path d="M-24,-8 H24 L16,6 H-16 Z" fill="#0E1B2E"/><rect x="-14" y="-16" width="9" height="8" fill="#C83226"/>
  </g>`;
}

function heroHormuz() {
  return `<rect width="448" height="200" rx="10" fill="#D8E9F3" stroke="#B9D2E2"/>
  <polygon points="0,0 448,0 448,60 380,85 330,100 290,90 230,70 160,40 90,20 0,25" fill="#E6DFCF"/>
  <polygon points="0,200 0,70 70,80 140,110 210,135 290,150 340,135 355,152 448,152 448,200" fill="#E6DFCF"/>
  <text x="250" y="28" font-family="${SANS}" font-size="12" font-weight="700" fill="#8A7F68" letter-spacing="2">IRAN</text>
  <text x="300" y="186" font-family="${SANS}" font-size="12" font-weight="700" fill="#8A7F68" letter-spacing="2">OMAN</text>
  <text x="84" y="188" font-family="${SANS}" font-size="12" font-weight="700" fill="#8A7F68" letter-spacing="2">SAUDI ARABIA</text>
  <text x="150" y="16" font-family="${SANS}" font-size="11" font-weight="700" fill="#5A86A6" letter-spacing="2">PERSIAN GULF</text>
  ${tanker(112, 64)}${tanker(200, 100)}${tanker(284, 126)}
  <g transform="translate(364,114)"><circle r="10" fill="#0E1B2E"/>${[0, 45, 90, 135].map((a) => `<line x1="-17" y1="0" x2="17" y2="0" stroke="#0E1B2E" stroke-width="3" transform="rotate(${a})"/>`).join('')}<circle r="3.5" fill="#C83226"/></g>
  <rect x="306" y="26" width="138" height="38" rx="5" fill="#fff" stroke="#C83226"/>
  <text x="375" y="42" text-anchor="middle" font-family="${SANS}" font-size="11.5" font-weight="800" fill="#C83226">STRAIT OF HORMUZ</text>
  <text x="375" y="57" text-anchor="middle" font-family="${SANS}" font-size="11.5" font-weight="700" fill="#0E1B2E">3 TANKERS HIT MINES</text>
  <path d="M26,194 Q4,130 62,92" fill="none" stroke="#C83226" stroke-width="3" stroke-dasharray="7 5"/>
  <path d="M52,196 Q40,160 62,150" fill="none" stroke="#C83226" stroke-width="3" stroke-dasharray="7 5"/>
  <polygon points="66,88 52,92 60,102" fill="#C83226"/>
  <g font-family="${SANS}" font-weight="800" font-size="12">
  <circle cx="74" cy="86" r="6" fill="#C83226" stroke="#fff" stroke-width="2"/><text x="84" y="90" fill="#0E1B2E">RAS TANURA</text>
  <circle cx="64" cy="146" r="6" fill="#C83226" stroke="#fff" stroke-width="2"/><text x="74" y="143" fill="#0E1B2E">RIYADH</text>
  <text x="74" y="158" fill="#C83226" font-size="11.5">11 INJURED</text>
  <text x="14" y="124" fill="#C83226" font-size="11" transform="rotate(-62 14 124)">HOUTHI DRONES</text></g>`;
}

function artHuawei() {
  const cells = Array.from({ length: 12 }, (_, i) => {
    const cx = 10 + (i % 6) * 26, cy = 100 + Math.floor(i / 6) * 22;
    return i < 10 ? `<rect x="${cx}" y="${cy}" width="22" height="18" rx="3" fill="#264B8A"/>` : `<rect x="${cx + 1}" y="${cy + 1}" width="20" height="16" rx="3" fill="#fff" stroke="#C83226" stroke-width="2.5"/>`;
  }).join('');
  return `<rect width="176" height="176" rx="8" fill="#F1F4FA"/>
  <rect x="82" y="22" width="6" height="58" fill="#0E1B2E"/><rect x="62" y="76" width="46" height="7" rx="2" fill="#0E1B2E"/>
  <rect x="20" y="20" width="106" height="6" rx="3" fill="#264B8A"/><circle cx="85" cy="20" r="7" fill="#C27803"/>
  <path d="M26,26 L10,58 H42 Z M26,26 L26,26" fill="none" stroke="#0E1B2E" stroke-width="1.5"/><path d="M10,58 Q26,72 42,58 Z" fill="#264B8A"/>
  <path d="M120,26 L104,58 H136 Z" fill="none" stroke="#0E1B2E" stroke-width="1.5"/><path d="M104,58 Q120,72 136,58 Z" fill="#264B8A"/>
  <g transform="translate(142,44) rotate(-35)"><rect x="-10" y="-6" width="26" height="12" rx="3" fill="#C27803"/><rect x="2" y="6" width="4" height="28" fill="#0E1B2E"/></g>
  ${cells}
  <text x="10" y="156" font-family="${SANS}" font-size="12.5" font-weight="800" fill="#264B8A">10 GUILTY</text>
  <text x="10" y="170" font-family="${SANS}" font-size="11" font-weight="800" fill="#C83226">2 ACQUITTED · RICO</text>`;
}

function artMicrosoft() {
  return `<rect width="176" height="176" rx="8" fill="#FBF1F1"/>
  <path d="M40,100 a24,24 0 0 1 8,-46 a34,34 0 0 1 64,6 a22,22 0 0 1 8,40 Z" fill="#fff" stroke="#0E1B2E" stroke-width="5" stroke-linejoin="round"/>
  <path d="M92,56 L80,78 L94,82 L82,104" fill="none" stroke="#B91C1C" stroke-width="5" stroke-linejoin="round"/>
  <g transform="translate(142,22)"><path d="M-12,16 a12,12 0 0 1 24,0 Z" fill="#B91C1C"/><rect x="-15" y="16" width="30" height="6" rx="2" fill="#0E1B2E"/>
  <path d="M-22,-4 l-8,-4 M22,-4 l8,-4 M0,-12 v-8" stroke="#B91C1C" stroke-width="3" stroke-linecap="round"/></g>
  <circle cx="30" cy="30" r="9" fill="#B91C1C"/><text x="30" y="35" text-anchor="middle" font-family="${SANS}" font-size="14" font-weight="800" fill="#fff">!</text>
  <rect x="20" y="108" width="40" height="40" fill="#B91C1C"/><rect x="108" y="140" width="40" height="8" fill="#157A4C"/>
  <path d="M64,120 H104" stroke="#0E1B2E" stroke-width="3"/><polygon points="104,114 114,120 104,126" fill="#0E1B2E" transform="translate(-4,0)"/>
  <text x="40" y="126" text-anchor="middle" font-family="${SANS}" font-size="14" font-weight="800" fill="#fff">24H</text>
  <text x="40" y="158" text-anchor="middle" font-family="${SANS}" font-size="10.5" font-weight="800" fill="#B91C1C">OUTAGE</text>
  <text x="128" y="136" text-anchor="middle" font-family="${SANS}" font-size="14" font-weight="800" fill="#157A4C">1H</text>
  <text x="128" y="158" text-anchor="middle" font-family="${SANS}" font-size="10.5" font-weight="800" fill="#157A4C">TARGET</text>`;
}

function artEurope() {
  return `<rect width="176" height="176" rx="8" fill="#EAF3F7"/>
  <circle cx="88" cy="290" r="196" fill="#1B5E7A"/><circle cx="88" cy="290" r="196" fill="none" stroke="#7FC4DC" stroke-width="5"/>
  <path d="M30,120 Q70,104 100,118 Q130,110 160,128 L160,140 Q110,128 30,144 Z" fill="#2E8AA8" opacity="0.7"/>
  <g stroke="#fff" stroke-width="2" fill="none"><circle cx="64" cy="124" r="8"/><circle cx="64" cy="124" r="16" opacity="0.8"/><circle cx="64" cy="124" r="24" opacity="0.55"/></g>
  <circle cx="64" cy="124" r="4" fill="#FFB020"/><text x="64" y="162" text-anchor="middle" font-family="${SANS}" font-size="10.5" font-weight="800" fill="#fff">BLACK SEA</text>
  <g transform="translate(100,52) rotate(-20)"><rect x="-44" y="-8" width="28" height="16" fill="#264B8A" stroke="#0E1B2E" stroke-width="2"/><rect x="16" y="-8" width="28" height="16" fill="#264B8A" stroke="#0E1B2E" stroke-width="2"/>
  <rect x="-16" y="-14" width="32" height="28" rx="4" fill="#fff" stroke="#0E1B2E" stroke-width="3"/>
  <path d="M0,-10 L10,-6 V4 Q10,10 0,13 Q-10,10 -10,4 V-6 Z" fill="#1B5E7A"/><text y="5" text-anchor="middle" font-size="12" fill="#fff" font-family="${SANS}">★</text></g>
  <path d="M60,76 Q40,96 40,112" stroke="#C27803" stroke-width="2.5" stroke-dasharray="4 4" fill="none"/>
  <text x="10" y="20" font-family="${SANS}" font-size="11" font-weight="800" fill="#1B5E7A">NATO · SPACE</text>`;
}

function artTaiwan() {
  return `<rect width="176" height="176" rx="8" fill="#FBF4E6"/>
  <polygon points="140,10 150,16 152,34 146,56 138,70 130,60 128,38 134,22" fill="#C27803" opacity="0.28" stroke="#C27803" stroke-width="2"/>
  <text x="140" y="86" text-anchor="middle" font-family="${SANS}" font-size="10.5" font-weight="800" fill="#C27803">TAIWAN</text>
  <rect x="10" y="22" width="108" height="76" rx="6" fill="#0E1B2E"/>
  <circle cx="64" cy="58" r="22" fill="none" stroke="#2BD0C8" stroke-width="2"/>
  <path d="M42,58 H86 M64,36 V80 M48,45 Q64,54 80,45 M48,71 Q64,62 80,71" stroke="#2BD0C8" stroke-width="1.5" fill="none"/>
  <circle cx="56" cy="54" r="2.5" fill="#2BD0C8"/><circle cx="72" cy="54" r="2.5" fill="#2BD0C8"/>
  <rect x="20" y="44" width="88" height="6" fill="#C83226" opacity="0.7"/><rect x="34" y="66" width="70" height="4" fill="#C83226" opacity="0.6"/>
  <polygon points="18,30 28,35 18,40" fill="#fff"/><rect x="10" y="90" width="108" height="8" fill="#26405F"/><rect x="10" y="90" width="64" height="8" fill="#C27803"/>
  <circle cx="136" cy="122" r="22" fill="#fff" stroke="#0E1B2E" stroke-width="6"/><line x1="152" y1="138" x2="166" y2="160" stroke="#0E1B2E" stroke-width="9" stroke-linecap="round"/>
  <text x="136" y="128" text-anchor="middle" font-family="${SANS}" font-size="14" font-weight="800" fill="#C83226">500+</text>
  <text x="10" y="128" font-family="${SANS}" font-size="12.5" font-weight="800" fill="#C27803">AI-GENERATED</text>
  <text x="10" y="144" font-family="${SANS}" font-size="12.5" font-weight="800" fill="#C27803">VIDEOS</text>`;
}

const hero = (x, y, accent, num, kicker, head, deck, art) => `
<g transform="translate(${x},${y})">
  <rect width="488" height="360" fill="#fff" stroke="${C.line}"/><rect width="488" height="4" fill="${accent}"/>
  <rect x="20" y="18" width="38" height="26" rx="4" fill="${accent}"/>
  <text x="39" y="37" text-anchor="middle" font-family="${MONO}" font-size="18" font-weight="700" fill="#fff">${num}</text>
  <text x="68" y="37" font-family="${SANS}" font-size="14" font-weight="800" letter-spacing="1.5" fill="${accent}">${esc(kicker)}</text>
  <text x="20" y="72" font-family="${SANS}" font-size="25" font-weight="800" fill="${C.ink}">${esc(head)}</text>
  <g transform="translate(20,86)">${art}</g>
  ${lines(deck, 20, 316, 22, `font-family="${SANS}" font-size="15.5" fill="#1E293B"`)}
</g>`;

const card = (x, y, accent, num, kicker, head, sum, art) => `
<g transform="translate(${x},${y})">
  <rect width="488" height="212" fill="#fff" stroke="${C.line}"/><rect width="488" height="4" fill="${accent}"/>
  <g transform="translate(18,22)"><rect x="-1" y="-1" width="178" height="178" rx="9" fill="none" stroke="${C.line}"/><g clip-path="url(#artclip)">${art}</g></g>
  <rect x="212" y="22" width="34" height="22" rx="4" fill="${accent}"/>
  <text x="229" y="38" text-anchor="middle" font-family="${MONO}" font-size="15" font-weight="700" fill="#fff">${num}</text>
  <text x="254" y="38" font-family="${SANS}" font-size="12" font-weight="800" letter-spacing="1" fill="${accent}">${esc(kicker)}</text>
  ${lines(head, 212, 72, 24, `font-family="${SANS}" font-size="20" font-weight="800" fill="${C.ink}"`)}
  ${lines(sum, 212, 126, 18, `font-family="${SANS}" font-size="13.5" fill="#1E293B"`)}
</g>`;

const dispatch = (x, label, color, text) => `<g transform="translate(${x},957)"><text y="12" font-family="${SANS}" font-size="12" font-weight="800" letter-spacing="1.5" fill="${color}">${label}</text>${lines(text, 0, 30, 15, `font-family="${SANS}" font-size="12.5" fill="#E6ECF4"`)}</g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><defs><clipPath id="artclip"><rect width="176" height="176" rx="8"/></clipPath></defs>
<rect width="1024" height="1024" fill="${C.ground}"/>
<rect width="1024" height="108" fill="${C.navy}"/>
<text x="24" y="62" font-family="${SANS}" font-size="44" font-weight="800" letter-spacing="1" fill="#fff">24 NOV 2026</text>
<text x="26" y="88" font-family="${SANS}" font-size="14.5" font-weight="700" letter-spacing="1.2" fill="#9FB4CE">TUESDAY, 24 NOVEMBER 2026 · WORLD NEWS IN ONE FRAME</text>
<text x="26" y="28" font-family="${SANS}" font-size="12" font-weight="800" letter-spacing="2" fill="#2BD08A">GLOBAL VISUAL BRIEFING</text>
${worldMap()}
${hero(16, 120, C.emerald, '01', 'US TECH & MARKETS', 'NVIDIA REINSTATES JENSEN HUANG', ['Board reverses 11-day ouster amid White House', 'pressure; stock surges 31.5%, adding nearly $1T.'], heroNvidia())}
${hero(520, 120, C.vermilion, '02', 'MIDDLE EAST & ENERGY', 'HORMUZ MINES & SAUDI STRIKES', ['IRGC: 3 oil tankers hit mines, burned in Hormuz.', 'Houthi strikes hit Ras Tanura, Riyadh (11 hurt).'], heroHormuz())}
${card(16, 492, C.indigo, '03', 'US–CHINA COURTS', ['HUAWEI CONVICTED', 'ON 10 OF 12 COUNTS'], ['Brooklyn jury finds Huawei guilty of', 'bank and wire fraud, Iran sanctions', 'violations, trade-secret theft;', 'acquitted of RICO racketeering.'], artHuawei())}
${card(520, 492, C.crimson, '04', 'GLOBAL CLOUD', ['MICROSOFT DECLARES', '"CODE RED"'], ['Reuters-leaked memos: emergency', 'overhaul after a 24-hour global', 'Microsoft 365 and Exchange outage;', 'goal is 1-hour recovery.'], artMicrosoft())}
${card(16, 720, C.cobalt, '05', 'EUROPE · UN & SPACE', ['UNSC BLACK SEA CLASH', '& SPACE WARNING'], ['Russia, Ukraine clash at UN over Black', 'Sea ship attacks. NATO\'s Rutte: alliance', 'will defend space amid Russia nuclear-', 'satellite reports. Seoul scrambles jets.'], artEurope())}
${card(520, 720, C.ochre, '06', 'ASIA-PACIFIC · AI', ['500+ TAIWAN AI', 'DEEPFAKES EXPOSED'], ['BBC Verify finds China-linked network', 'with 500+ AI-made videos targeting', 'Taiwan\'s ruling DPP ahead of local', 'polls.'], artTaiwan())}
<rect x="16" y="948" width="992" height="64" fill="${C.navy2}"/>
<rect x="16" y="948" width="6" height="64" fill="#2BD08A"/>
<text x="34" y="975" font-family="${SANS}" font-size="14" font-weight="800" letter-spacing="1" fill="#fff">ALSO</text>
<text x="34" y="993" font-family="${SANS}" font-size="14" font-weight="800" letter-spacing="1" fill="#fff">24 NOV</text>
${dispatch(104, 'GAZA', '#FF8A78', ['Strike kills Hamas internal', 'security chief Naeem Abu Nahel'])}
${dispatch(386, 'MARKETS', '#F2B84B', ['S&P 500 dips 0.5% as U.S.', 'readies fresh tariff plans'])}
${dispatch(650, 'JAPAN', '#7FC4DC', ['Skips UN nuclear-ban', 'treaty review conference'])}
<line x1="372" y1="958" x2="372" y2="1002" stroke="#2B3F5C"/><line x1="636" y1="958" x2="636" y2="1002" stroke="#2B3F5C"/>
</svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:${C.ground}}svg{display:block}</style></head><body>${svg}</body></html>`;
const here = fileURLToPath(new URL('.', import.meta.url));
const dir = mkdtempSync(join(tmpdir(), 'atlas-'));
const page = join(dir, 'atlas.html');
writeFileSync(page, html);
const out = join(here, 'entry.png');
const chrome = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const run = spawnSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-sandbox', '--disable-crash-reporter', '--disable-breakpad', '--disable-gpu-sandbox', '--force-device-scale-factor=1', '--window-size=1024,1024', '--virtual-time-budget=2000', `--user-data-dir=${join(dir, 'profile')}`, `--screenshot=${out}`, pathToFileURL(page).href], { windowsHide: true, stdio: 'inherit' });
if (run.status !== 0) {
  console.warn(`chrome exited ${run.status}; falling back to ImageMagick SVG renderer`);
  const svgFile = join(dir, 'atlas.svg');
  writeFileSync(svgFile, svg);
  const magick = spawnSync('magick', ['-background', C.ground, '-density', '96', svgFile, '-strip', '-define', 'png:exclude-chunk=all', `PNG24:${out}`], { windowsHide: true, stdio: 'inherit' });
  if (magick.status !== 0) throw new Error('magick failed');
}
const preview = join(here, 'preview-300.png');
const py = spawnSync('python', ['-c', `from PIL import Image\nim=Image.open(r'${out}').convert('RGB')\nprint(im.size)\nim.resize((300,300),Image.Resampling.LANCZOS).save(r'${preview}')`], { stdio: 'inherit' });
if (py.status !== 0) throw new Error('preview failed');
console.log(`entry.png ${statSync(out).size} bytes`);

