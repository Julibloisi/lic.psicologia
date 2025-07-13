let materias = [];

async function cargarMaterias() {
  const res = await fetch("data/materias.json");
  materias = await res.json();
  renderMaterias();
}

function renderMaterias() {
  const container = document.getElementById("materias-container");
  container.innerHTML = "";

  let totalNotas = 0;
  let cantidadNotas = 0;

  materias.forEach(m => {
    const estado = JSON.parse(localStorage.getItem(m.codigo)) || {};
    const habilitada = m.correlativas.every(cor => {
      const corr = JSON.parse(localStorage.getItem(cor)) || {};
      return corr.estado === "aprobada";
    });

    const div = document.createElement("div");
    div.className = "materia";
    if (habilitada) div.classList.add("habilitada");

    div.innerHTML = `
      <strong>${m.nombre}</strong> (${m.codigo})<br>
      <label>
        <input type="radio" name="${m.codigo}" value="cursando" ${estado.estado === "cursando" ? "checked" : ""}> Cursando
      </label>
      <label>
        <input type="radio" name="${m.codigo}" value="aprobada" ${estado.estado === "aprobada" ? "checked" : ""}> Aprobada
      </label>
      <label>
        Nota final: <input type="number" id="nota-${m.codigo}" value="${estado.nota || ""}" min="4" max="10">
      </label>
    `;

    container.appendChild(div);

    document.getElementsByName(m.codigo).forEach(radio => {
      radio.addEventListener("change", () => {
        const nota = parseInt(document.getElementById(`nota-${m.codigo}`).value);
        guardarEstado(m.codigo, radio.value, nota);
      });
    });

    document.getElementById(`nota-${m.codigo}`).addEventListener("input", e => {
      const nota = parseInt(e.target.value);
      const estadoActual = document.querySelector(`input[name="${m.codigo}"]:checked`)?.value || null;
      guardarEstado(m.codigo, estadoActual, nota);
    });

    if (estado.estado === "aprobada" && estado.nota) {
      totalNotas += estado.nota;
      cantidadNotas++;
    }
  });

  const promedio = cantidadNotas ? (totalNotas / cantidadNotas).toFixed(2) : "-";
  document.getElementById("promedio").innerText = promedio;
}

function guardarEstado(codigo, estado, nota) {
  localStorage.setItem(codigo, JSON.stringify({ estado, nota }));
  renderMaterias(); // actualizar
}

cargarMaterias();
