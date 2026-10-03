// Botones de acción estandarizados para tablas

// ✅ EDITAR - Usar siempre este formato:
<button className="btn btn-sm text-muted me-1" title="Editar">
    <i className="bi bi-pencil-square"></i>
</button>

// ✅ ELIMINAR - Usar siempre este formato:
<button className="btn btn-sm text-danger" title="Eliminar" onClick={handleDelete}>
    <i className="bi bi-trash-fill"></i>
</button>

// ❌ NO USAR: btn-icon-only (Eliminada esta clase)
// ✅ USAR: btn btn-sm + color

// Iconos estandarizados:
// - Editar: bi-pencil-square (gris/muted)
// - Eliminar: bi-trash-fill (rojo/danger)
// - Ver/Detalle: bi-eye (gris/muted)
