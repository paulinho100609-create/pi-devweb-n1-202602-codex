const CHAVE_PRODUTOS = "essenzya_produtos";

const produtosPadrao = [

    {
        id: "produto-1",
        nome: "Blusa feminina",
        preco: 39.99,
        categoria: ["feminino", "blusa"],
        cores: ["preto", "branco"],
        imagem: "img/blusa.fem.preta.jpeg",
        imagemPreto: "img/blusa.fem.preta.jpeg",
        imagemBranco: "img/blusa.fem.branca.jpeg",
        imagensCores: {},
        promocao: false,
        precoPromocional: 0,
        esgotado: false
    },

    {
        id: "produto-2",
        nome: "Blusa masculina",
        preco: 39.99,
        categoria: ["masculino", "blusa"],
        cores: ["preto", "branco"],
        imagem: "img/blusa.mas.preta.jpeg",
        imagemPreto: "img/blusa.mas.preta.jpeg",
        imagemBranco: "img/blusa.mas.branca.jpeg",
        imagensCores: {},
        promocao: false,
        precoPromocional: 0,
        esgotado: false
    },

    {
        id: "produto-3",
        nome: "Blusa manga longa masculina",
        preco: 45.99,
        categoria: ["masculino", "blusa"],
        cores: ["preto", "branco"],
        imagem: "img/blusa.mas.preta.long.jpeg",
        imagemPreto: "img/blusa.mas.preta.long.jpeg",
        imagemBranco: "img/blusa.mas.branca.long.jpeg",
        imagensCores: {},
        promocao: false,
        precoPromocional: 0,
        esgotado: false
    },

    {
        id: "produto-4",
        nome: "Blusa manga longa feminina",
        preco: 45.99,
        categoria: ["feminino", "blusa"],
        cores: ["preto", "branco"],
        imagem: "img/blusa.fem.preta.long.jpeg",
        imagemPreto: "img/blusa.fem.preta.long.jpeg",
        imagemBranco: "img/blusa.fem.branca.long.jpeg",
        imagensCores: {},
        promocao: false,
        precoPromocional: 0,
        esgotado: false
    },

    {
        id: "produto-5",
        nome: "Short cargo masculino",
        preco: 60,
        categoria: ["masculino", "calca"],
        cores: ["preto", "branco"],
        imagem: "img/short.cargo.mas.preto.jpeg",
        imagemPreto: "img/short.cargo.mas.preto.jpeg",
        imagemBranco: "img/short.cargo.mas.branco.jpeg",
        imagensCores: {},
        promocao: false,
        precoPromocional: 0,
        esgotado: false
    },

    {
        id: "produto-6",
        nome: "Short cargo feminino",
        preco: 60,
        categoria: ["feminino", "calca"],
        cores: ["preto", "branco"],
        imagem: "img/short.cargo.fem.preto.jpeg",
        imagemPreto: "img/short.cargo.fem.preto.jpeg",
        imagemBranco: "img/short.cargo.fem.branco.jpeg",
        imagensCores: {},
        promocao: false,
        precoPromocional: 0,
        esgotado: false
    },

    {
        id: "produto-7",
        nome: "Calça cargo feminina",
        preco: 90,
        categoria: ["feminino", "calca"],
        cores: ["preto", "branco"],
        imagem: "img/calça.cargo.fem.preta.jpeg",
        imagemPreto: "img/calça.cargo.fem.preta.jpeg",
        imagemBranco: "img/calça.cargo.fem.branca.jpeg",
        imagensCores: {},
        promocao: false,
        precoPromocional: 0,
        esgotado: false
    },

    {
        id: "produto-8",
        nome: "Calça cargo masculina",
        preco: 90,
        categoria: ["masculino", "calca"],
        cores: ["preto", "branco"],
        imagem: "img/calça.cargo.mas.preta.jpeg",
        imagemPreto: "img/calça.cargo.mas.preta.jpeg",
        imagemBranco: "img/calça.cargo.mas.branca.jpeg",
        imagensCores: {},
        promocao: false,
        precoPromocional: 0,
        esgotado: false
    },

    {
        id: "produto-9",
        nome: "Calça skinny masculina",
        preco: 70,
        categoria: ["masculino", "calca"],
        cores: [],
        imagem: "img/calça.skinny.mas.jpeg",
        imagensCores: {},
        promocao: false,
        precoPromocional: 0,
        esgotado: false
    },

    {
        id: "produto-10",
        nome: "Calça skinny feminina",
        preco: 70,
        categoria: ["feminino", "calca"],
        cores: [],
        imagem: "img/calça.skinny.fem.jpeg",
        imagensCores: {},
        promocao: false,
        precoPromocional: 0,
        esgotado: false
    }

];


let categoriaCatalogoAtual = "todas";
let pesquisaCatalogoAtual = "";


/* =====================================
   FUNÇÕES AUXILIARES
===================================== */

function normalizarCatalogo(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}


function obterCategoriasProduto(produto) {
    if (Array.isArray(produto.categoria)) {
        return produto.categoria;
    }

    return produto.categoria ? [produto.categoria] : [];
}


function obterProdutos() {
    let produtos;

    try {
        produtos = JSON.parse(localStorage.getItem(CHAVE_PRODUTOS));
    } catch (erro) {
        produtos = null;
    }

    if (!Array.isArray(produtos)) {
        produtos = produtosPadrao;
        salvarProdutos(produtos);
    }

    return produtos.map(function(produto) {
        const imagensCores = { ...(produto.imagensCores || {}) };

        // Compatibilidade com produtos antigos.
        if (produto.imagemPreto && !imagensCores.preto) {
            imagensCores.preto = produto.imagemPreto;
        }

        if (produto.imagemBranco && !imagensCores.branco) {
            imagensCores.branco = produto.imagemBranco;
        }

        return {
            ...produto,
            categoria: obterCategoriasProduto(produto),
            cores: Array.isArray(produto.cores) ? produto.cores : [],
            imagensCores: imagensCores
        };
    });
}


function salvarProdutos(produtos) {
    try {
        localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));

        document.dispatchEvent(new CustomEvent("catalogoAtualizado"));

        return true;

    } catch (erro) {
        alert(
            "Não foi possível salvar. As imagens podem estar muito grandes. Escolha imagens menores."
        );

        return false;
    }
}


function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, function(caractere) {
        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return caracteres[caractere];
    });
}


function obterPrecoAtual(produto) {
    if (produto.promocao && Number(produto.precoPromocional) > 0) {
        return Number(produto.precoPromocional);
    }

    return Number(produto.preco);
}


/* =====================================
   IMAGENS DOS PRODUTOS
===================================== */

function obterImagemDaCor(produto, cor) {
    const chave = normalizarCatalogo(cor);
    const imagens = produto.imagensCores || {};

    // Produtos com duas ou mais cores usam somente as imagens individuais.
    if (produto.cores && produto.cores.length >= 2) {
        return imagens[chave] || "";
    }

    // Produtos com zero ou uma cor usam a imagem principal.
    return produto.imagem || "";
}


function obterCorVisual(cor) {
    const cores = {
        preto: "#171717",
        branco: "#ffffff",
        azul: "#1769d2",
        "azul claro": "#75c9f2",
        "azul escuro": "#123b70",
        vermelho: "#e53935",
        verde: "#269447",
        amarelo: "#f5d328",
        rosa: "#f18ab6",
        roxo: "#8849b8",
        laranja: "#f28c28",
        cinza: "#858585",
        marrom: "#805333",
        bege: "#d9c5a0",
        vinho: "#722f45",
        lilas: "#b69bd8"
    };

    return cores[normalizarCatalogo(cor)] || "#999999";
}


function criarOpcoesDeCor(produto, imagemElementoId) {
    if (!produto.cores || produto.cores.length === 0) {
        return "";
    }

    let html = '<div class="opcoes-cores">';

    produto.cores.forEach(function(cor, indice) {
        const corVisual = obterCorVisual(cor);
        const selecionada = indice === 0 ? " cor-selecionada" : "";

        html += `
            <button
                type="button"
                class="opcao-cor${selecionada}"
                title="${escaparHTML(cor)}"
                aria-label="Selecionar cor ${escaparHTML(cor)}"
                style="background-color: ${corVisual};"
                data-imagem-cor="${indice}"
            ></button>
        `;
    });

    html += "</div>";

    return html;
}


function alterarImagemProduto(idImagem, caminho, botao) {
    const imagem = document.getElementById(idImagem);

    if (imagem && caminho) {
        imagem.src = caminho;
        imagem.style.display = "block";
        imagem.parentElement.classList.remove("sem-imagem");
    }

    const grupo = botao.parentElement;

    grupo.querySelectorAll(".opcao-cor").forEach(function(opcao) {
        opcao.classList.remove("cor-selecionada");
    });

    botao.classList.add("cor-selecionada");
}


/* =====================================
   CRIAR CARD DO PRODUTO
===================================== */

function criarCardProduto(produto, modoAdmin = false) {

    const idImagem = "imagem-produto-" +
        String(produto.id).replace(/[^a-zA-Z0-9_-]/g, "");

    // Em produtos com várias cores, começa mostrando a imagem da primeira cor.
    const imagem = produto.cores && produto.cores.length >= 2
        ? obterImagemDaCor(produto, produto.cores[0])
        : (produto.imagem || "");

    const precoAtual = obterPrecoAtual(produto);

    const card = document.createElement("article");

    card.className = "produto" +
        (produto.esgotado ? " produto-esgotado" : "");

    card.dataset.categorias = obterCategoriasProduto(produto).join(" ");

    let precoHTML;

    if (produto.promocao && Number(produto.precoPromocional) > 0) {
        precoHTML = `
            <p class="preco-antigo">${formatarPreco(produto.preco)}</p>
            <p class="preco preco-promocional">${formatarPreco(precoAtual)}</p>
            <span class="etiqueta-promocao">PROMOÇÃO</span>
        `;
    } else {
        precoHTML = `
            <p class="preco">${formatarPreco(produto.preco)}</p>
        `;
    }

    const coresHTML = criarOpcoesDeCor(produto, idImagem);

    const imagemHTML = imagem
        ? `
            <img
                id="${idImagem}"
                src="${escaparHTML(imagem)}"
                alt="${escaparHTML(produto.nome)}"
                onerror="this.style.display='none'; this.parentElement.classList.add('sem-imagem')"
            >
        `
        : `
            <div class="imagem-produto-placeholder"></div>
        `;

    let botoesHTML = "";

    if (modoAdmin) {
        botoesHTML = `
            <div class="controles-admin">

                <button
                    type="button"
                    class="botao-editar-admin"
                    onclick="editarProdutoAdmin('${escaparHTML(produto.id)}')"
                >
                    Editar
                </button>

                <button
                    type="button"
                    class="botao-status-admin"
                    onclick="alternarStatusProduto('${escaparHTML(produto.id)}')"
                >
                    ${produto.esgotado ? "Reativar" : "Marcar esgotado"}
                </button>

                <button
                    type="button"
                    class="botao-excluir-admin"
                    onclick="excluirProdutoAdmin('${escaparHTML(produto.id)}')"
                >
                    Excluir
                </button>

            </div>
        `;

    } else if (produto.esgotado) {
        botoesHTML = `
            <button type="button" disabled class="botao-esgotado">
                Produto esgotado
            </button>
        `;

    } else {
        botoesHTML = `
            <button type="button" class="botao-adicionar-carrinho">
                Adicionar ao carrinho
            </button>
        `;
    }

    card.innerHTML = `
        <div class="imagem-produto-container ${imagem ? "" : "sem-imagem"}">

            ${imagemHTML}

            ${produto.esgotado
                ? '<span class="etiqueta-esgotado">ESGOTADO</span>'
                : ""
            }

        </div>

        <h2>${escaparHTML(produto.nome)}</h2>

        ${precoHTML}

        ${coresHTML}

        ${botoesHTML}
    `;


    /* Seleção de cores */

    if (produto.cores && produto.cores.length) {
        card.querySelectorAll(".opcao-cor").forEach(function(botao, indice) {

            botao.addEventListener("click", function() {
                const caminho = obterImagemDaCor(
                    produto,
                    produto.cores[indice]
                );

                alterarImagemProduto(idImagem, caminho, botao);
            });

        });
    }


    /* Adicionar ao carrinho */

    const botaoCarrinho = card.querySelector(".botao-adicionar-carrinho");

    if (botaoCarrinho) {
        botaoCarrinho.addEventListener("click", function() {

            const imagemAtual = card.querySelector("img")?.src || imagem;

            if (typeof adicionarAoCarrinho === "function") {
                adicionarAoCarrinho(
                    produto.nome,
                    precoAtual,
                    imagemAtual,
                    botaoCarrinho
                );
            }

        });
    }

    return card;
}


/* =====================================
   RENDERIZAR CATÁLOGO
===================================== */

function renderizarCatalogo() {
    const listaInicio = document.getElementById("listaProdutosInicio");
    const listaAlta = document.getElementById("produtosEmAlta");

    if (!listaInicio && !listaAlta) return;

    const produtos = obterProdutos();

    if (listaInicio) {
        listaInicio.innerHTML = "";

        const termo = normalizarCatalogo(pesquisaCatalogoAtual);

        const filtrados = produtos.filter(function(produto) {

            const nome = normalizarCatalogo(produto.nome);

            const categorias = obterCategoriasProduto(produto)
                .map(normalizarCatalogo);

            const correspondePesquisa =
                !termo ||
                nome.includes(termo) ||
                categorias.some(function(categoria) {
                    return categoria.includes(termo);
                });

            const correspondeCategoria =
                categoriaCatalogoAtual === "todas" ||
                categorias.includes(categoriaCatalogoAtual);

            return correspondePesquisa && correspondeCategoria;
        });

        filtrados.forEach(function(produto) {
            listaInicio.appendChild(criarCardProduto(produto));
        });

        const resultado = document.getElementById("resultadoPesquisa");

        if (resultado) {
            resultado.textContent = filtrados.length
                ? filtrados.length + " produto(s) encontrado(s)."
                : "Nenhum produto encontrado.";
        }
    }

    if (listaAlta) {
        listaAlta.innerHTML = "";

        produtos.slice(0, 3).forEach(function(produto) {
            listaAlta.appendChild(criarCardProduto(produto));
        });
    }

    atualizarTextoCategoria();
}


/* =====================================
   CATEGORIAS
===================================== */

function atualizarTextoCategoria() {
    const nomes = {
        todas: "Todas as categorias",
        feminino: "Feminino",
        masculino: "Masculino",
        blusa: "Blusa",
        calca: "Calça"
    };

    const texto = nomes[categoriaCatalogoAtual] || "Todas as categorias";

    const botao = document.getElementById("textoBotaoCategoria");
    const selecionada = document.getElementById("categoriaSelecionada");

    if (botao) {
        botao.textContent = texto;
    }

    if (selecionada) {
        selecionada.textContent = "Exibindo: " + texto;
    }

    document.querySelectorAll("#menuCategorias button").forEach(function(item) {
        item.classList.toggle(
            "selecionada",
            item.dataset.categoria === categoriaCatalogoAtual
        );
    });
}


function alternarMenuCategorias() {
    const menu = document.getElementById("menuCategorias");
    const botao = document.querySelector(".botao-categorias");
    const seta = document.getElementById("setaCategorias");

    if (!menu) return;

    menu.classList.toggle("aberto");

    const aberto = menu.classList.contains("aberto");

    if (botao) {
        botao.setAttribute("aria-expanded", String(aberto));
    }

    if (seta) {
        seta.style.transform = aberto
            ? "rotate(180deg)"
            : "rotate(0deg)";
    }
}


function selecionarCategoria(categoria) {
    categoriaCatalogoAtual = categoria;

    atualizarTextoCategoria();
    renderizarCatalogo();

    const menu = document.getElementById("menuCategorias");
    const botao = document.querySelector(".botao-categorias");
    const seta = document.getElementById("setaCategorias");

    if (menu) {
        menu.classList.remove("aberto");
    }

    if (botao) {
        botao.setAttribute("aria-expanded", "false");
    }

    if (seta) {
        seta.style.transform = "rotate(0deg)";
    }

    const lista = document.getElementById("listaProdutosInicio");

    if (lista) {
        lista.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


/* =====================================
   PESQUISA
===================================== */

function pesquisar() {
    const campo = document.getElementById("campoPesquisa");

    if (!campo) return;

    pesquisaCatalogoAtual = campo.value.trim();

    if (!document.getElementById("listaProdutosInicio")) {
        window.location.href =
            "index.html?busca=" +
            encodeURIComponent(pesquisaCatalogoAtual) +
            "#listaProdutosInicio";

        return;
    }

    renderizarCatalogo();

    const lista = document.getElementById("listaProdutosInicio");

    if (lista) {
        lista.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


/* =====================================
   INICIALIZAÇÃO
===================================== */

document.addEventListener("DOMContentLoaded", function() {

    const campo = document.getElementById("campoPesquisa");

    const parametros = new URLSearchParams(window.location.search);
    const buscaInicial = parametros.get("busca");

    if (campo) {

        if (buscaInicial) {
            campo.value = buscaInicial;
            pesquisaCatalogoAtual = buscaInicial;
        }

        campo.addEventListener("input", function() {
            pesquisaCatalogoAtual = campo.value.trim();
            renderizarCatalogo();
        });
    }

    renderizarCatalogo();

    if (parametros.has("busca")) {
        requestAnimationFrame(function() {
            const lista = document.getElementById("listaProdutosInicio");

            if (lista) {
                lista.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    }
});


document.addEventListener("catalogoAtualizado", renderizarCatalogo);