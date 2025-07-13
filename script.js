let materias = [];

async function cargarMaterias() {
  const res = await fetch("data/materias.json");
  materias = await res.json();
  renderMaterias();
}

function renderMaterias() {
  const container = document.getElementById("materias-container");
  container.innerHTML = "";

  const agrupadas = {};
  materias.forEach(m => {
    const key = `Año ${m.anio} - Cuatrimestre ${m.cuatrimestre}`;
    if (!agrupadas[key]) agrupadas[key] = [];
    agrupadas[key].push(m);
  });

  let totalNotas = 0;
  let cantidadNotas = 0;

  Object.keys(agrupadas).sort().forEach(seccion => {
    const grupoDiv = document.createElement("div");
    grupoDiv.innerHTML = `<h2>${seccion}</h2>`;
    agrupadas[seccion].forEach(m => {
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
        <label><input type="radio" name="${m.codigo}" value="cursando" ${estado.estado === "cursando" ? "checked" : ""}> Cursando</label>
        <label><input type="radio" name="${m.codigo}" value="aprobada" ${estado.estado === "aprobada" ? "checked" : ""}> Aprobada</label>
        <label>Parcial 1: <input type="number" id="parcial1-${m.codigo}" value="${estado.parcial1 || ""}" min="1" max="10"></label>
        <label>Parcial 2: <input type="number" id="parcial2-${m.codigo}" value="${estado.parcial2 || ""}" min="1" max="10"></label>
        <label>Final: <input type="number" id="final-${m.codigo}" value="${estado.final || ""}" min="1" max="10"></label>
      `;

      grupoDiv.appendChild(div);

      document.getElementsByName(m.codigo).forEach(radio => {
        radio.addEventListener("change", () => {
          const parcial1 = parseInt(document.getElementById(`parcial1-${m.codigo}`).value);
          const parcial2 = parseInt(document.getElementById(`parcial2-${m.codigo}`).value);
          const final = parseInt(document.getElementById(`final-${m.codigo}`).value);
          guardarEstado(m.codigo, radio.value, parcial1, parcial2, final);
        });
      });

      ["parcial1", "parcial2", "final"].forEach(campo => {
        document.getElementById(`${campo}-${m.codigo}`).addEventListener("input", () => {
          const estadoActual = document.querySelector(`input[name="${m.codigo}"]:checked`)?.value || null;
          const parcial1 = parseInt(document.getElementById(`parcial1-${m.codigo}`).value);
          const parcial2 = parseInt(document.getElementById(`parcial2-${m.codigo}`).value);
          const final = parseInt(document.getElementById(`final-${m.codigo}`).value);
          guardarEstado(m.codigo, estadoActual, parcial1, parcial2, final);
        });
      });

      if (estado.estado === "aprobada" && estado.final) {
        totalNotas += estado.final;
        cantidadNotas++;
      }
    });
    container.appendChild(grupoDiv);
  });

  const promedio = cantidadNotas ? (totalNotas / cantidadNotas).toFixed(2) : "-";
  document.getElementById("promedio").innerText = promedio;
}

function guardarEstado(codigo, estado, parcial1, parcial2, final) {
  localStorage.setItem(codigo, JSON.stringify({ estado, parcial1, parcial2, final }));
  renderMaterias();
}

cargarMaterias();
