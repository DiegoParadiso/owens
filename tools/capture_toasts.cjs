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

// 1. Snapshot estático determinista (con static=1 para deshabilitar animaciones a nivel CSS)
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

console.log('[COMPLETED] Snapshot pipeline completed successfully.');


