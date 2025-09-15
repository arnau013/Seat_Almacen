let articulos = [];

async function cargarDatos() {
  const res = await fetch("articulos.json");
  articulos = await res.json();
}

function buscar(query) {
  query = query.toLowerCase();
  return articulos.filter(a => 
    a.nombre.toLowerCase().includes(query)
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
        <strong>${r.nombre}</strong>
        ID: ${r.id} | Precio: ${r.precio} €
      </div>
    `).join("");
  });
});
