const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"';
const OUTPUT_DIR = path.resolve(__dirname, '../docs/4_Diseno/img/toasts');
const BASE_URL = 'http://127.0.0.1:8000/dev/retroalimentaciones';

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('[INFO] Starting automated component snapshot pipeline for 14 Real Use Cases...');

const cuMatrix = [
    { cu: 'cu15', screens: ['a', 'b', 'c', 'd', 'e'] },
    { cu: 'cu24', screens: ['a', 'b', 'c', 'd', 'e'] },
    { cu: 'cu25', screens: ['a', 'c', 'f'] },
    { cu: 'cu12', screens: ['a', 'b', 'c', 'd', 'e'] },
    { cu: 'cu14', screens: ['a', 'b', 'c', 'd', 'e'] },
    { cu: 'cu13', screens: ['a', 'c', 'f'] },
    { cu: 'cu02', screens: ['a', 'b', 'c', 'e'] },
    { cu: 'cu05', screens: ['a', 'b', 'c', 'f'] },
    { cu: 'cu01', screens: ['a', 'b', 'c', 'e'] },
    { cu: 'cu03', screens: ['a', 'b', 'c', 'e'] },
    { cu: 'cu04', screens: ['a', 'b', 'c', 'e'] },
    { cu: 'cu10', screens: ['a', 'c'] },
    { cu: 'cu49', screens: ['a', 'b', 'c', 'e'] },
    { cu: 'cu29', screens: ['a', 'b', 'c'] }
];

const components = [];
cuMatrix.forEach(({ cu, screens }) => {
    screens.forEach((letter) => {
        const isModal = letter === 'e' || letter === 'f';
        components.push({
            id: `${cu}_${letter}`,
            name: `${cu}_pantalla_${letter}.png`,
            width: isModal ? 620 : 880,
            height: isModal ? 440 : 160
        });
    });
});

const onlyModals = process.argv.includes('--modals');
const targets = onlyModals
    ? components.filter((c) => c.id.endsWith('_e') || c.id.endsWith('_f'))
    : components;

// Snapshot estático determinista (con static=1 para deshabilitar animaciones a nivel CSS)
targets.forEach((c) => {
    const outPath = path.join(OUTPUT_DIR, c.name);
    const cmd = `${CHROME_PATH} --headless=new --disable-gpu --virtual-time-budget=1000 --screenshot="${outPath}" --window-size=${c.width},${c.height} "${BASE_URL}?component=${c.id}&static=1"`;
    try {
        execSync(cmd, { stdio: 'pipe' });
        console.log(`[SNAPSHOT] Success: ${c.name} (${c.width}x${c.height})`);
    } catch (e) {
        console.error(`[SNAPSHOT] Error processing ${c.id}:`, e.message);
    }
});

console.log(`[COMPLETED] Snapshot pipeline completed successfully (${targets.length} images generated).`);
