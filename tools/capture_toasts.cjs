const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"';
const OUTPUT_DIR = path.resolve(__dirname, '../docs/4_Diseno/img/toasts');
const BASE_URL = 'http://127.0.0.1:8000/dev/retroalimentaciones';

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🚀 Iniciando captura automatizada de pantallas de retroalimentación...');

const screens = [
    { id: 'A', name: 'pantalla_a_exito.png', width: 850, height: 160 },
    { id: 'B', name: 'pantalla_b_validacion.png', width: 850, height: 160 },
    { id: 'C', name: 'pantalla_c_inconsistencia.png', width: 850, height: 160 },
    { id: 'D', name: 'pantalla_d_duplicado.png', width: 850, height: 160 },
    { id: 'E', name: 'pantalla_e_confirmacion.png', width: 620, height: 440 },
    { id: 'F', name: 'pantalla_f_inactivacion.png', width: 620, height: 440 }
];

// 1. Capturas individuales PNG
screens.forEach(s => {
    const outPath = path.join(OUTPUT_DIR, s.name);
    const cmd = `${CHROME_PATH} --headless=new --disable-gpu --virtual-time-budget=2000 --screenshot="${outPath}" --window-size=${s.width},${s.height} "${BASE_URL}?isolate=${s.id}"`;
    try {
        execSync(cmd, { stdio: 'pipe' });
        console.log(`✅ [${s.id}] Guardada: ${s.name}`);
    } catch (e) {
        console.error(`❌ Error capturando [${s.id}]:`, e.message);
    }
});

// 2. Generación de animación WebP (Formato de estándar de industria para docs interactivos)
console.log('🎞️ Generando animaciones WebP para visualización completa de transiciones...');
const framesDir = path.join(__dirname, '../scratch/frames');
if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir, { recursive: true });
}

// Capturar secuencia de fotogramas del Toast con tiempos progresivos
const frameBudgets = [100, 200, 300, 450, 600, 800, 1000];
frameBudgets.forEach((budget, idx) => {
    const framePath = path.join(framesDir, `frame_${String(idx).padStart(2, '0')}.png`);
    const cmd = `${CHROME_PATH} --headless=new --disable-gpu --virtual-time-budget=${budget} --screenshot="${framePath}" --window-size=850,160 "${BASE_URL}?isolate=A&animate=1"`;
    try {
        execSync(cmd, { stdio: 'pipe' });
    } catch (err) {}
});

// Compilar a WebP animado y GIF mediante ImageMagick (magick)
try {
    const animWebp = path.join(OUTPUT_DIR, 'toast_animacion.webp');
    const animGif = path.join(OUTPUT_DIR, 'toast_animacion.gif');
    const magickCmdWebp = `/opt/homebrew/bin/magick -delay 25 -loop 0 "${framesDir}/frame_*.png" "${animWebp}"`;
    const magickCmdGif = `/opt/homebrew/bin/magick -delay 25 -loop 0 "${framesDir}/frame_*.png" "${animGif}"`;
    execSync(magickCmdWebp, { stdio: 'pipe' });
    execSync(magickCmdGif, { stdio: 'pipe' });
    console.log(`✅ Animación WebP generada: toast_animacion.webp`);
    console.log(`✅ Animación GIF generada: toast_animacion.gif`);
} catch (e) {
    console.warn('⚠️ Nota: error generando animación:', e.message);
}

// Limpiar frames temporales
try {
    fs.rmSync(framesDir, { recursive: true, force: true });
} catch (e) {}

console.log('🎉 Todas las capturas individuales y animaciones quedaron listas en docs/4_Diseno/img/toasts/');
