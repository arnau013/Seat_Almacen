let articulos = [];

async function cargarDatos() {
  const res = await fetch("articulos.json");
  articulos = await res.json();
  console.log("Cargados", articulos.length, "artículos");
}

// 🔎 búsqueda rápida global
function buscarSimple(query, data) {
  query = query.toLowerCase();
  return data.filter(a =>
    (a["Material"] && a["Material"].toLowerCase().includes(query)) ||
    (a["Descripción del material"] && a["Descripción del material"].toLowerCase().includes(query)) ||
    (a["Nº pieza fabricante"] && a["Nº pieza fabricante"].toLowerCase().includes(query)) ||
    (a["Suministrador/Fabricante"] && a["Suministrador/Fabricante"].toLowerCase().includes(query)) ||
    (a["Instalación"] && a["Instalación"].toLowerCase().includes(query))
  );
}

// 🔎 búsqueda avanzada
function buscarAvanzado(filtros) {
  let data = articulos;

  // si hay búsqueda global dentro del panel → se aplica primero
  if (filtros.global) {
    data = buscarSimple(filtros.global, data);
  }

  return data.filter(a => {
    return (!filtros.material || (a["Material"] && a["Material"].toLowerCase().includes(filtros.material))) &&
           (!filtros.proveedor || (a["Suministrador/Fabricante"] && a["Suministrador/Fabricante"].toLowerCase().includes(filtros.proveedor))) &&
           (!filtros.instalacion || (a["Instalación"] && a["Instalación"].toLowerCase().includes(filtros.instalacion))) &&
           (!filtros.pieza || (a["Nº pieza fabricante"] && a["Nº pieza fabricante"].toLowerCase().includes(filtros.pieza)));
  });
}

// render resultados
function mostrarResultados(lista) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = lista.map(r => `
    <div class="item">
      <strong>${r["Descripción del material"] || "-"}</strong>
      Material: ${r["Material"] || "-"}<br>
      Nº pieza fabricante: ${r["Nº pieza fabricante"] || "-"}<br>
      Proveedor: ${r["Suministrador/Fabricante"] || "-"}<br>
      Instalación: ${r["Instalación"] || "-"}<br>
      Ubicación: ${r["Ubic."] || "-"}
    </div>
  `).join("");

  if (!lista.length) {
    resultsDiv.innerHTML = "<p>No se encontraron resultados.</p>";
  }
}

// 📸 OCR con Tesseract.js
async function ocrImagen(file) {
  document.getElementById("ocrStatus").textContent = "Procesando imagen...";
  const { data: { text } } = await Tesseract.recognize(file, 'spa+eng', {
    logger: m => console.log(m) // opcional: ver progreso en consola
  });
  document.getElementById("ocrStatus").textContent = ""; // limpiar mensaje
  return text;
}

// 🔄 eventos
document.addEventListener("DOMContentLoaded", async () => {
  await cargarDatos();

  // búsqueda rápida superior
  document.getElementById("search").addEventListener("input", e => {
    const query = e.target.value.trim();
    mostrarResultados(buscarSimple(query, articulos));
  });

  // abrir/cerrar panel avanzado
  const advancedDiv = document.getElementById("advancedSearch");
  document.getElementById("toggleAdvanced").addEventListener("click", () => {
    advancedDiv.style.display = advancedDiv.style.display === "none" ? "block" : "none";
  });

  // aplicar filtros avanzados
  document.getElementById("applyFilters").addEventListener("click", () => {
    const filtros = {
      global: document.getElementById("filterGlobal").value.toLowerCase().trim(),
      material: document.getElementById("filterMaterial").value.toLowerCase().trim(),
      proveedor: document.getElementById("filterProveedor").value.toLowerCase().trim(),
      instalacion: document.getElementById("filterInstalacion").value.toLowerCase().trim(),
      pieza: document.getElementById("filterPieza").value.toLowerCase().trim()
    };
    mostrarResultados(buscarAvanzado(filtros));
  });

  // 📸 búsqueda por foto
  const inputFoto = document.getElementById("fotoInput");
  if (inputFoto) {
    inputFoto.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const texto = await ocrImagen(file);
      mostrarResultados(buscarSimple(texto, articulos));
    });
  }
});

