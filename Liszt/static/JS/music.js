/* ── FILTRO EN VIVO PARA TABLAS ─────────────────────────────────────────── */
function initLiveFilter(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);
  if (!input || !table) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    const rows = table.querySelectorAll('tbody tr');
    let visible = 0;

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const match = text.includes(q);
      row.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    const counter = document.getElementById('filter-count');
    if (counter) counter.textContent = visible + ' resultado(s)';
  });
}

/* ── COLUMNAS ORDENABLES ─────────────────────────────────────────────────── */
function initSortableTable(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const headers = table.querySelectorAll('thead th[data-sort]');

  headers.forEach((th, colIndex) => {
    th.style.cursor = 'pointer';
    th.style.userSelect = 'none';
    let asc = true;

    th.addEventListener('click', () => {
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));

      rows.sort((a, b) => {
        const aText = a.cells[colIndex].textContent.trim().toLowerCase();
        const bText = b.cells[colIndex].textContent.trim().toLowerCase();
        const aNum = parseFloat(aText.replace(/[^0-9.]/g, ''));
        const bNum = parseFloat(bText.replace(/[^0-9.]/g, ''));
        const isNum = !isNaN(aNum) && !isNaN(bNum);

        if (isNum) return asc ? aNum - bNum : bNum - aNum;
        return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
      });

      rows.forEach(row => tbody.appendChild(row));

      // Indicador visual en el header
      headers.forEach(h => {
        h.textContent = h.textContent.replace(' ↑', '').replace(' ↓', '');
      });
      th.textContent += asc ? ' ↑' : ' ↓';
      asc = !asc;
    });
  });
}

/* ── MODAL DE CONFIRMACIÓN ───────────────────────────────────────────────── */
function initDeleteModal() {
  // Crear el modal una sola vez
  const modal = document.createElement('div');
  modal.id = 'delete-modal';
  modal.innerHTML = `
    <div id="delete-overlay"></div>
    <div id="delete-box">
      <h3>¿Confirmar eliminación?</h3>
      <p id="delete-msg">Esta acción no se puede deshacer.</p>
      <div style="display:flex; gap:1rem; justify-content:center; margin-top:1.5rem">
        <button id="delete-cancel" class="btn btn-secondary">Cancelar</button>
        <button id="delete-confirm" class="btn btn-danger">Eliminar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const overlay = document.getElementById('delete-overlay');
  const cancelBtn = document.getElementById('delete-cancel');
  let pendingForm = null;

  function closeModal() {
    modal.classList.remove('active');
    pendingForm = null;
  }

  overlay.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  document.getElementById('delete-confirm').addEventListener('click', () => {
    if (pendingForm) pendingForm.submit();
  });

  // Interceptar todos los forms con data-confirm
  document.querySelectorAll('form[data-confirm]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const msg = form.dataset.confirm || 'Esta acción no se puede deshacer.';
      document.getElementById('delete-msg').textContent = msg;
      modal.classList.add('active');
      pendingForm = form;
    });
  });
}

/* ── BÚSQUEDA CON DEBOUNCE ───────────────────────────────────────────────── */
function initAutoSearch(inputId, selectId, formId, delay = 500) {
  const input = document.getElementById(inputId);
  const form = document.getElementById(formId);
  if (!input || !form) return;

  let timer;

  input.addEventListener('input', () => {
    clearTimeout(timer);
    if (input.value.trim().length === 0) return;
    timer = setTimeout(() => form.submit(), delay);
  });
}

/* ── CONTADOR DE CARACTERES ──────────────────────────────────────────────── */
function initCharCounter(inputId, maxLen) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const counter = document.createElement('small');
  counter.style.cssText = 'color:#555; float:right; margin-top:3px';
  input.insertAdjacentElement('afterend', counter);

  function update() {
    const left = maxLen - input.value.length;
    counter.textContent = `${left} caracteres restantes`;
    counter.style.color = left < 10 ? '#dc3545' : '#555';
  }
  update();
  input.addEventListener('input', update);
}

/* ── TOAST DE NOTIFICACIÓN ───────────────────────────────────────────────── */
function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
