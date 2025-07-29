// Inicializa Flatpickr
flatpickr("#filtroMes", {
  locale: "pt",
  plugins: [new monthSelectPlugin({
    shorthand: false,
    dateFormat: "Y-m",
    altFormat: "F Y"
  })],
  altInput: true,
  theme: "dark"
});

// Utilitários
function formatarValor(valor) {
  return parseFloat(valor.replace(",", "."));
}

function formatarMoeda(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

// ========== RENDAS ==========
function adicionarRenda() {
  const mes = document.getElementById("filtroMes").value;
  const nome = document.getElementById("rendaNome").value.trim();
  const valorStr = document.getElementById("rendaInput").value.replace(",", ".");
  const valor = parseFloat(valorStr);

  if (!nome || isNaN(valor)) {
    alert("Preencha os campos de renda corretamente.");
    return;
  }

  const rendas = JSON.parse(localStorage.getItem("rendas") || "[]");
  rendas.push({ nome, mes, valor });
  localStorage.setItem("rendas", JSON.stringify(rendas));

  document.getElementById("rendaInput").value = "";
  listarRendas();
  atualizarResumo();
}

function listarRendas() {
  const mes = document.getElementById("filtroMes").value;
  const rendas = JSON.parse(localStorage.getItem("rendas") || "[]");
  const lista = document.getElementById("listaRendas");
  lista.innerHTML = "";

  rendas
    .filter(r => r.mes === mes)
    .forEach((renda, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between";
      li.innerHTML = `
        <span>${renda.nome}: R$ ${renda.valor.toFixed(2)}</span>
        <div>
          <button class="btn btn-sm btn-outline-light me-1" onclick="editarRenda(${index})">✏️</button>
          <button class="btn btn-sm btn-outline-danger" onclick="excluirRenda(${index})">🗑️</button>
        </div>
      `;
      lista.appendChild(li);
    });
}

function editarRenda(index) {
  const mes = document.getElementById("filtroMes").value;
  const rendas = JSON.parse(localStorage.getItem("rendas") || "[]");
  const rendasMes = rendas.filter(r => r.mes === mes);

  const nova = prompt("Novo valor:", rendasMes[index].valor.toFixed(2));
  if (nova !== null && !isNaN(parseFloat(nova))) {
    rendasMes[index].valor = parseFloat(nova);
    const atualizadas = rendas.filter(r => r.mes !== mes).concat(rendasMes);
    localStorage.setItem("rendas", JSON.stringify(atualizadas));
    listarRendas();
    atualizarResumo();
  }
}

function excluirRenda(index) {
  const mes = document.getElementById("filtroMes").value;
  let rendas = JSON.parse(localStorage.getItem("rendas") || "[]");
  const rendasMes = rendas.filter(r => r.mes === mes);
  rendasMes.splice(index, 1);
  rendas = rendas.filter(r => r.mes !== mes).concat(rendasMes);
  localStorage.setItem("rendas", JSON.stringify(rendas));
  listarRendas();
  atualizarResumo();
}

// ========== GASTOS FIXOS ==========
function adicionarGastoFixo() {
  const nome = document.getElementById("fixoNome").value.trim();
  const valor = parseFloat(document.getElementById("fixoValor").value.replace(",", "."));

  if (!nome || isNaN(valor)) {
    alert("Preencha corretamente.");
    return;
  }

  const fixos = JSON.parse(localStorage.getItem("gastosFixos") || "[]");
  fixos.push({ nome, valor });
  localStorage.setItem("gastosFixos", JSON.stringify(fixos));

  document.getElementById("fixoNome").value = "";
  document.getElementById("fixoValor").value = "";
  listarGastosFixos();
  atualizarResumo();
}

function listarGastosFixos() {
  const fixos = JSON.parse(localStorage.getItem("gastosFixos") || "[]");
  const lista = document.getElementById("listaFixos");
  lista.innerHTML = "";

  fixos.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.innerHTML = `
      <span>${item.nome}: R$ ${item.valor.toFixed(2)}</span>
      <div>
        <button class="btn btn-sm btn-outline-light me-1" onclick="editarGastoFixo(${index})">✏️</button>
        <button class="btn btn-sm btn-outline-danger" onclick="excluirGastoFixo(${index})">🗑️</button>
      </div>
    `;
    lista.appendChild(li);
  });
}

function editarGastoFixo(index) {
  const fixos = JSON.parse(localStorage.getItem("gastosFixos") || "[]");
  const nome = prompt("Novo nome:", fixos[index].nome);
  const valorStr = prompt("Novo valor:", fixos[index].valor.toFixed(2));

  if (nome && !isNaN(parseFloat(valorStr))) {
    fixos[index] = { nome, valor: parseFloat(valorStr.replace(",", ".")) };
    localStorage.setItem("gastosFixos", JSON.stringify(fixos));
    listarGastosFixos();
    atualizarResumo();
  }
}

function excluirGastoFixo(index) {
  const fixos = JSON.parse(localStorage.getItem("gastosFixos") || "[]");
  fixos.splice(index, 1);
  localStorage.setItem("gastosFixos", JSON.stringify(fixos));
  listarGastosFixos();
  atualizarResumo();
}

// ========== GASTOS VARIÁVEIS ==========
function adicionarGastoVariavel() {
  const mes = document.getElementById("filtroMes").value;
  const nome = document.getElementById("variavelNome").value.trim();
  const valor = parseFloat(document.getElementById("variavelValor").value.replace(",", "."));

  if (!nome || isNaN(valor)) {
    alert("Preencha corretamente.");
    return;
  }

  const variaveis = JSON.parse(localStorage.getItem("gastosVariaveis") || "[]");
  variaveis.push({ mes, nome, valor });
  localStorage.setItem("gastosVariaveis", JSON.stringify(variaveis));

  document.getElementById("variavelNome").value = "";
  document.getElementById("variavelValor").value = "";
  listarGastosVariaveis();
  atualizarResumo();
}

function listarGastosVariaveis() {
  const mes = document.getElementById("filtroMes").value;
  const variaveis = JSON.parse(localStorage.getItem("gastosVariaveis") || "[]");
  const lista = document.getElementById("listaVariaveis");
  lista.innerHTML = "";

  variaveis
    .filter(v => v.mes === mes)
    .forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between";
      li.innerHTML = `
        <span>${item.nome}: R$ ${item.valor.toFixed(2)}</span>
        <div>
          <button class="btn btn-sm btn-outline-light me-1" onclick="editarGastoVariavel(${index})">✏️</button>
          <button class="btn btn-sm btn-outline-danger" onclick="excluirGastoVariavel(${index})">🗑️</button>
        </div>
      `;
      lista.appendChild(li);
    });
}

function editarGastoVariavel(index) {
  const mes = document.getElementById("filtroMes").value;
  const variaveis = JSON.parse(localStorage.getItem("gastosVariaveis") || "[]");
  const doMes = variaveis.filter(v => v.mes === mes);

  const novaCat = prompt("Nova categoria:", doMes[index].categoria);
  const novoVal = prompt("Novo valor:", doMes[index].valor.toFixed(2));

  if (novaCat && !isNaN(parseFloat(novoVal))) {
    doMes[index] = { mes, categoria: novaCat, valor: parseFloat(novoVal) };
    const atualizadas = variaveis.filter(v => v.mes !== mes).concat(doMes);
    localStorage.setItem("gastosVariaveis", JSON.stringify(atualizadas));
    listarGastosVariaveis();
    atualizarResumo();
  }
}

function excluirGastoVariavel(index) {
  const mes = document.getElementById("filtroMes").value;
  let variaveis = JSON.parse(localStorage.getItem("gastosVariaveis") || "[]");
  const doMes = variaveis.filter(v => v.mes === mes);
  doMes.splice(index, 1);
  variaveis = variaveis.filter(v => v.mes !== mes).concat(doMes);
  localStorage.setItem("gastosVariaveis", JSON.stringify(variaveis));
  listarGastosVariaveis();
  atualizarResumo();
}

// ========== RESUMO ==========
function atualizarResumo() {
  const mes = document.getElementById("filtroMes").value;

  const rendas = JSON.parse(localStorage.getItem("rendas") || "[]").filter(r => r.mes === mes);
  const variaveis = JSON.parse(localStorage.getItem("gastosVariaveis") || "[]").filter(v => v.mes === mes);
  const fixos = JSON.parse(localStorage.getItem("gastosFixos") || "[]");

  const totalRenda = rendas.reduce((s, r) => s + r.valor, 0);
  const totalVariaveis = variaveis.reduce((s, g) => s + g.valor, 0);
  const totalFixos = fixos.reduce((s, g) => s + g.valor, 0);
  const saldo = totalRenda - totalFixos - totalVariaveis;

  document.getElementById("totalRenda").textContent = totalRenda.toFixed(2);
  document.getElementById("totalFixos").textContent = totalFixos.toFixed(2);
  document.getElementById("totalVariaveis").textContent = totalVariaveis.toFixed(2);
  document.getElementById("saldo").textContent = saldo.toFixed(2);

  atualizarGrafico(totalRenda, totalFixos, totalVariaveis);
}

let grafico;
function atualizarGrafico(renda, fixos, variaveis) {
  const ctx = document.getElementById("grafico").getContext("2d");
  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Renda", "Fixos", "Variáveis"],
      datasets: [{
        label: "Resumo",
        data: [renda, fixos, variaveis],
        backgroundColor: ["#28a745", "#ffc107", "#dc3545"]
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (v) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", () => {
  const hoje = new Date();
  const mesAtual = hoje.toISOString().slice(0, 7);
  document.getElementById("filtroMes").value = mesAtual;

  listarRendas();
  listarGastosFixos();
  listarGastosVariaveis();
  atualizarResumo();

  document.getElementById("filtroMes").addEventListener("change", () => {
    listarRendas();
    listarGastosFixos();
    listarGastosVariaveis();
    atualizarResumo();
  });
});

function aplicarMascaraMonetaria(input) {
    input.addEventListener("input", () => {
        let valor = input.value.replace(/\D/g, "");
        valor = (parseInt(valor) / 100).toFixed(2) + "";
        valor = valor.replace(".", ",");
        valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        input.value = "R$ " + valor;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Aplica máscara em todos os inputs de valor
    aplicarMascaraMonetaria(document.getElementById("rendaInput"));
    aplicarMascaraMonetaria(document.getElementById("fixoValor"));
    aplicarMascaraMonetaria(document.getElementById("variavelValor"));
});