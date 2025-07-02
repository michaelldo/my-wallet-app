// Utilitários
function formatarValor(valor) {
    return parseFloat(valor.replace(",", "."));
}

function formatarMoeda(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

function getMesSelecionado() {
    const valor = document.getElementById("filtroMes").value;
    return valor || new Date().toISOString().slice(0, 7); // formato yyyy-mm
}

// Renda
function adicionarRenda() {
    const mes = getMesSelecionado();
    const nome = document.getElementById("rendaNome").value.trim();

    const valorInput = document.getElementById("rendaInput").value.replace("R$", "").trim();
    const valor = parseFloat(valorInput.replace(".", "").replace(",", "."));


    if (!nome || isNaN(valor)) {
        alert("Preencha os campos de renda corretamente.");
        return;
    }

    const rendas = JSON.parse(localStorage.getItem("rendas") || "[]");
    rendas.push({ mes, nome, valor });
    localStorage.setItem("rendas", JSON.stringify(rendas));

    document.getElementById("rendaInput").value = "";
    listarRendas();
    atualizarResumo();
}

function listarRendas() {
    const mes = getMesSelecionado();
    const rendas = JSON.parse(localStorage.getItem("rendas") || "[]");
    const lista = document.getElementById("listaRendas");
    lista.innerHTML = "";

    const rendasMes = rendas.filter(r => r.mes === mes);
    rendasMes.forEach((renda) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between";
        li.innerHTML = `<span>R$ ${renda.valor.toFixed(2)}</span>`;
        lista.appendChild(li);
    });
}

// Gastos Fixos
function adicionarGastoFixo() {
    
    const nome = document.getElementById("fixoNome").value.trim();
    const valorInput = document.getElementById("fixoValor").value.replace("R$", "").trim();
    const valor = parseFloat(valorInput.replace(".", "").replace(",", "."));

    if (!nome || isNaN(valor)) {
        alert("Preencha os campos de gasto fixo corretamente.");
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

    fixos.forEach((item) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between";
        li.innerHTML = `${item.nome} <span>R$ ${item.valor.toFixed(2)}</span>`;
        lista.appendChild(li);
    });
}

// Gastos Variáveis
function adicionarGastoVariavel() {
    const mes = getMesSelecionado();
    const nome = document.getElementById("variavelNome").value.trim();
    const valorInput = document.getElementById("variavelValor").value.replace("R$", "").trim();
    const valor = parseFloat(valorInput.replace(".", "").replace(",", "."));

    if (!nome || isNaN(valor)) {
        alert("Preencha os campos corretamente.");
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
    const mes = getMesSelecionado();
    const variaveis = JSON.parse(localStorage.getItem("gastosVariaveis") || "[]");
    const lista = document.getElementById("listaVariaveis");
    lista.innerHTML = "";

    const variaveisMes = variaveis.filter(v => v.mes === mes);
    variaveisMes.forEach((item) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between";
        li.innerHTML = `${item.categoria} <span>R$ ${item.valor.toFixed(2)}</span>`;
        lista.appendChild(li);
    });
}

// Resumo e gráfico
function atualizarResumo() {
    const mes = getMesSelecionado();

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

let graficoResumo;
function atualizarGrafico(renda, fixos, variaveis) {
    const ctx = document.getElementById("grafico").getContext("2d");
    if (graficoResumo) graficoResumo.destroy();

    graficoResumo = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Renda", "Gastos Fixos", "Gastos Variáveis"],
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
                        callback: (value) => "R$ " + value.toLocaleString("pt-BR")
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Ao mudar o mês, atualizar todos os dados
document.getElementById("filtroMes").addEventListener("change", () => {
    listarRendas();
    listarGastosVariaveis();
    atualizarResumo();
});

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    listarRendas();
    listarGastosFixos();
    listarGastosVariaveis();
    atualizarResumo();
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
