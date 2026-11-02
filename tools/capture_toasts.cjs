const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"';
const OUTPUT_DIR = path.resolve(__dirname, '../docs/4_Diseno/img/toasts');
const BASE_URL = 'http://127.0.0.1:8000/dev/retroalimentaciones';

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('[INFO] Starting automated component snapshot pipeline...');

const components = [
    { id: 'toast_success', name: 'pantalla_a_exito.png', width: 850, height: 160 },
    { id: 'toast_error', name: 'pantalla_b_validacion.png', width: 850, height: 160 },
    { id: 'toast_conflict', name: 'pantalla_c_inconsistencia.png', width: 850, height: 160 },
    { id: 'toast_warning', name: 'pantalla_d_duplicado.png', width: 850, height: 160 },
    { id: 'modal_confirm', name: 'pantalla_e_confirmacion.png', width: 620, height: 440 },
    { id: 'modal_delete', name: 'pantalla_f_inactivacion.png', width: 620, height: 440 }
];

// 1. Snapshot estatico determinista (con static=1 para deshabilitar animaciones a nivel CSS)
components.forEach(c => {
    const outPath = path.join(OUTPUT_DIR, c.name);
    const cmd = `${CHROME_PATH} --headless=new --disable-gpu --virtual-time-budget=1000 --screenshot="${outPath}" --window-size=${c.width},${c.height} "${BASE_URL}?component=${c.id}&static=1"`;
    try {
        execSync(cmd, { stdio: 'pipe' });
        console.log(`[SNAPSHOT] Success: ${c.name} (${c.width}x${c.height})`);
    } catch (e) {
        console.error(`[SNAPSHOT] Error processing ${c.id}:`, e.message);
    }
});

// 2. Muestreo secuencial de animaciones (con static=0 y animate=1)
console.log('[ANIMATION] Sampling transition keyframes...');
const framesDir = path.join(__dirname, '../scratch/frames');
if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir, { recursive: true });
}

const frameBudgets = [80, 160, 240, 320, 420, 550, 700];
frameBudgets.forEach((budget, idx) => {
    const framePath = path.join(framesDir, `frame_${String(idx).padStart(2, '0')}.png`);
    const cmd = `${CHROME_PATH} --headless=new --disable-gpu --virtual-time-budget=${budget} --screenshot="${framePath}" --window-size=850,160 "${BASE_URL}?component=toast_success&animate=1"`;
    try {
        execSync(cmd, { stdio: 'pipe' });
    } catch (err) {}
});

// 3. Compilacion de animacion a WebP y GIF
try {
    const animWebp = path.join(OUTPUT_DIR, 'toast_animacion.webp');
    const animGif = path.join(OUTPUT_DIR, 'toast_animacion.gif');
    const magickCmdWebp = `/opt/homebrew/bin/magick -delay 20 -loop 0 "${framesDir}/frame_*.png" "${animWebp}"`;
    const magickCmdGif = `/opt/homebrew/bin/magick -delay 20 -loop 0 "${framesDir}/frame_*.png" "${animGif}"`;
    execSync(magickCmdWebp, { stdio: 'pipe' });
    execSync(magickCmdGif, { stdio: 'pipe' });
    console.log(`[ANIMATION] Success: toast_animacion.webp (libwebp animated format)`);
    console.log(`[ANIMATION] Success: toast_animacion.gif (standard legacy gif format)`);
} catch (e) {
    console.warn('[ANIMATION] Warning: ImageMagick execution failed:', e.message);
}

try {
    fs.rmSync(framesDir, { recursive: true, force: true });
} catch (e) {}

console.log('[COMPLETED] Snapshot pipeline completed successfully.');
