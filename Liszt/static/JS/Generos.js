const seleccionados = [];

const select = document.getElementById("genero-select");
const tags = document.getElementById("tags-container");
const countEl = document.getElementById("count");
const hidden = document.getElementById("generos-hidden");

function renderTags() {
  tags.innerHTML = "";
  seleccionados.forEach((g) => {
    const tag = document.createElement("span");
    tag.className = "genero-tag";
    tag.innerHTML = `${g.nombre} <button type="button" onclick="remove('${g.id}')">x</button>`;
    tags.appendChild(tag);
  });
  countEl.textContent = seleccionados.length;
  hidden.value = seleccionados.map((g) => g.id).join(",");
  actualizarOpciones();
}

function actualizarOpciones() {
  const idsSeleccionados = seleccionados.map((g) => g.id);
  Array.from(select.options).forEach((opt) => {
    if (opt.value === "") return;
    opt.disabled = idsSeleccionados.includes(opt.value);
  });
}

function remove(id) {
  const idx = seleccionados.findIndex((g) => g.id === id);
  if (idx !== -1) seleccionados.splice(idx, 1);
  renderTags();
}

select.addEventListener("change", () => {
  const val = select.value;
  const nombre = select.options[select.selectedIndex].text;
  if (val && !seleccionados.some((g) => g.id === val)) {
    seleccionados.push({ id: val, nombre: nombre });
    renderTags();
  }
  select.value = "";
});

function validarYEnviar() {
  console.log("géneros:", seleccionados);
  if (seleccionados.length === 0) {
    document.getElementById("error-generos").textContent =
      "Debes seleccionar al menos un género";
    return;
  }
  document.querySelector("form").submit();
}
