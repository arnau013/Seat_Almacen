let articulos = [];

async function cargarDatos() {
  const res = await fetch("articulos.json");
  articulos = await res.json();
  console.log("Cargados", articulos.length, "artículos");
}

// 🔎 búsqueda rápida (como antes)
function buscarSimple(query) {
  query = query.toLowerCase();
  return articulos.filter(a =>
    (a["Material"] && a["Material"].toLowerCase().includes(query)) ||
    (a["Descripción del material"] && a["Descripción del material"].toLowerCase().includes(query)) ||
    (a["Nº pieza fabricante"] && a["Nº pieza fabricante"].toLowerCase().includes(query)) ||
    (a["Suministrador/Fabricante"] && a["Suministrador/Fabricante"].toLowerCase().includes(query))
  );
}

// 🔎 búsqueda avanzada (filtros combinados)
function buscarAvanzado(filtros) {
  return articulos.filter(a => {
    return (!filtros.material || (a["Material"] && a["Material"].toLowerCase().includes(filtros.material))) &&
           (!filtros.proveedor || (a["Suministrador/Fabricante"] && a["Suministrador/Fabricante"].toLowerCase().includes(filtros.proveedor))) &&
           (!filtros.instalacion || (a["Instalación"] && a["Instalación"].toLowerCase().includes(filtros.instalacion))) &&
           (!filtros.pieza || (a["Nº pieza fabricante"] && a["Nº pieza fabricante"].toLowerCase().includes(filtros.pieza)));
  });
}

// render de resultados
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

document.addEventListener("DOMContentLoaded", async () => {
  await cargarDatos();

  // búsqueda rápida
  document.getElementById("search").addEventListener("input", e => {
    const query = e.target.value.trim();
    mostrarResultados(buscarSimple(query));
  });

  // abrir/cerrar panel avanzado
  const advancedDiv = document.getElementById("advancedSearch");
  document.getElementById("toggleAdvanced").addEventListener("click", () => {
    advancedDiv.style.display = advancedDiv.style.display === "none" ? "block" : "none";
  });

  // aplicar filtros avanzados
  document.getElementById("applyFilters").addEventListener("click", () => {
    const filtros = {
      material: document.getElementById("filterMaterial").value.toLowerCase().trim(),
      proveedor: document.getElementById("filterProveedor").value.toLowerCase().trim(),
      instalacion: document.getElementById("filterInstalacion").value.toLowerCase().trim(),
      pieza: document.getElementById("filterPieza").value.toLowerCase().trim()
    };
    mostrarResultados(buscarAvanzado(filtros));
  });
});

