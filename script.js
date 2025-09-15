let articulos = [];

async function cargarDatos() {
  const res = await fetch("articulos.json");
  articulos = await res.json();
}

function buscar(query) {
  query = query.toLowerCase();
  return articulos.filter(a => 
    (a["Material"] && a["Material"].toLowerCase().includes(query)) ||
    (a["Descripción del material"] && a["Descripción del material"].toLowerCase().includes(query)) ||
    (a["Nº pieza fabricante"] && a["Nº pieza fabricante"].toLowerCase().includes(query)) ||
    (a["Suministrador/Fabricante"] && a["Suministrador/Fabricante"].toLowerCase().includes(query))
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  await cargarDatos();

  const searchInput = document.getElementById("search");
  const resultsDiv = document.getElementById("results");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    const resultados = buscar(query);

    resultsDiv.innerHTML = resultados.map(r => `
      <div class="item">
        <strong>${r["Descripción del material"] || "-"}</strong>
        Material: ${r["Material"] || "-"}<br>
        Nº pieza fabricante: ${r["Nº pieza fabricante"] || "-"}<br>
        Proveedor: ${r["Suministrador/Fabricante"] || "-"}<br>
        Ubicación: ${r["Ubic."] || "-"}<br>
        Código Ariba: ${r["Código Ariba material"] || "-"}<br>
        Ref. alt.: ${r["Ref. alt."] || "-"}<br>
        ID Fab.: ${r["ID Fab."] || "-"}
      </div>
    `).join("");
  });
});



