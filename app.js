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
  return parseFloat(valor
    .replace(/\s/g, "")     // Remove espaços
    .replace("R$", "")      // Remove R$
    .replace(/\./g, "")     // Remove pontos de milhar
    .replace(",", ".")); // Troca vírgula por ponto)
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(valor);
}

function adicionarRenda() {
  const mes = document.getElementById("filtroMes").value;
  const nome = document.getElementById("rendaNome").value.trim();
  const valorStr = formatarValor(document.getElementById("rendaInput").value);
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
        <span>${renda.nome}: ${formatarMoeda(renda.valor)}</span>
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
  abrirModalEditar("renda", index, rendasMes[index].nome, rendasMes[index].valor);
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

function adicionarGastoFixo() {
  const nome = document.getElementById("fixoNome").value.trim();
  const valorStr = formatarValor(document.getElementById("fixoValor").value);
  const valor = parseFloat(valorStr);

  if (!nome || isNaN(valor)) {
    alert("Preencha os campos de gastos corretamente.");
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
  abrirModalEditar("fixo", index, fixos[index].nome, fixos[index].valor);
}

function excluirGastoFixo(index) {
  const fixos = JSON.parse(localStorage.getItem("gastosFixos") || "[]");
  fixos.splice(index, 1);
  localStorage.setItem("gastosFixos", JSON.stringify(fixos));
  listarGastosFixos();
  atualizarResumo();
}


function adicionarGastoVariavel() {
  const mes = document.getElementById("filtroMes").value;
  const nome = document.getElementById("variavelNome").value.trim();
  const valorStr = formatarValor(document.getElementById("variavelValor").value);
  const valor = parseFloat(valorStr);

  if (!nome || isNaN(valor)) {
    alert("Preencha os campos de gastos variáveis corretamente.");
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
  abrirModalEditar("variavel", index, doMes[index].nome, doMes[index].valor);
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
  // document.getElementById("saldo").textContent = saldo.toFixed(2);

  const saldoSpan = document.getElementById("saldo");
  saldoSpan.textContent = "R$ " + saldo.toFixed(2);


  // Remove classes anteriores
  saldoSpan.classList.remove("saldo-positivo", "saldo-negativo", "saldo-zero");

  if (saldo > 0) {
    saldoSpan.classList.add("saldo-positivo");
  } else if (saldo < 0) {
    saldoSpan.classList.add("saldo-negativo");
  } else {
    saldoSpan.classList.add("saldo-zero");
  }


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


//controle modal
let tipoEdicao = "";
let indexEdicao = -1;

function abrirModalEditar(tipo, index, nome, valor) {
  tipoEdicao = tipo;
  indexEdicao = index;

  const inputNome = document.getElementById("modalNome");
  const inputValor = document.getElementById("modalValor");

  inputNome.value = nome;
  inputValor.value = formatarMoeda(valor);

  aplicarMascaraMonetaria(inputValor);

  const modal = new bootstrap.Modal(document.getElementById("modalEditar"));
  modal.show();
}

document.getElementById("btnSalvarEdicao").addEventListener("click", () => {
  const nome = document.getElementById("modalNome").value.trim();
  const valor = formatarValor(document.getElementById("modalValor").value);

  if (!nome || isNaN(valor)) {
    alert("Preencha corretamente.");
    return;
  }

  if (tipoEdicao === "renda") {
    const mes = document.getElementById("filtroMes").value;
    const rendas = JSON.parse(localStorage.getItem("rendas") || "[]");
    const rendasMes = rendas.filter(r => r.mes === mes);
    rendasMes[indexEdicao] = { ...rendasMes[indexEdicao], nome, valor };
    const atualizadas = rendas.filter(r => r.mes !== mes).concat(rendasMes);
    localStorage.setItem("rendas", JSON.stringify(atualizadas));
    listarRendas();
  }

  if (tipoEdicao === "fixo") {
    const fixos = JSON.parse(localStorage.getItem("gastosFixos") || "[]");
    fixos[indexEdicao] = { nome, valor };
    localStorage.setItem("gastosFixos", JSON.stringify(fixos));
    listarGastosFixos();
  }

  if (tipoEdicao === "variavel") {
    const mes = document.getElementById("filtroMes").value;
    const variaveis = JSON.parse(localStorage.getItem("gastosVariaveis") || "[]");
    const doMes = variaveis.filter(v => v.mes === mes);
    doMes[indexEdicao] = { mes, nome, valor };
    const atualizadas = variaveis.filter(v => v.mes !== mes).concat(doMes);
    localStorage.setItem("gastosVariaveis", JSON.stringify(atualizadas));
    listarGastosVariaveis();
  }

  atualizarResumo();
  bootstrap.Modal.getInstance(document.getElementById("modalEditar")).hide();
});
