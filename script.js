/* =========================
   MODAIS PERSONALIZADOS
========================= */

function mostrarModal(titulo, mensagem, aoFechar = null) {
    let modalExistente = document.getElementById("modalPersonalizado");

    if (modalExistente) {
        modalExistente.remove();
    }

    const fundo = document.createElement("div");
    fundo.id = "modalPersonalizado";

    fundo.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.65);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        padding: 20px;
    `;

    const caixa = document.createElement("div");

    caixa.style.cssText = `
        background: #ffffff;
        width: 100%;
        max-width: 400px;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.25);
        animation: aparecerModal 0.25s ease;
    `;

    const estilo = document.createElement("style");

    estilo.textContent = `
        @keyframes aparecerModal {
            from {
                opacity: 0;
                transform: scale(0.85);
            }

            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        #modalPersonalizado button:hover {
            background-color: #68bd43 !important;
        }
    `;

    const tituloElemento = document.createElement("h2");
    tituloElemento.textContent = titulo;

    tituloElemento.style.cssText = `
        color: #333229;
        font-size: 24px;
        margin-bottom: 15px;
    `;

    const mensagemElemento = document.createElement("p");
    mensagemElemento.textContent = mensagem;

    mensagemElemento.style.cssText = `
        color: #444;
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 25px;
    `;

    const botao = document.createElement("button");
    botao.textContent = "OK";

    botao.style.cssText = `
        background-color: #7ed957;
        color: #222;
        border: none;
        padding: 12px 35px;
        border-radius: 7px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
    `;

    botao.addEventListener("click", function() {
        fundo.remove();

        if (aoFechar) {
            aoFechar();
        }
    });

    caixa.appendChild(tituloElemento);
    caixa.appendChild(mensagemElemento);
    caixa.appendChild(botao);

    fundo.appendChild(caixa);

    document.head.appendChild(estilo);
    document.body.appendChild(fundo);

    botao.focus();
}

/* =========================
   VARIÁVEIS
========================= */

let categoriaAtual = "todas";

/* =========================
   NORMALIZAR TEXTOS
========================= */

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

/* =========================
   CORES DOS PRODUTOS
========================= */

function configurarOpcoesCores() {
    const produtos = document.querySelectorAll(
        ".pagina-produtos .produto[data-cores]"
    );

    produtos.forEach(function(produto) {
        const areaCores = produto.querySelector(".opcoes-cores");

        if (!areaCores) return;

        const cores = produto.dataset.cores
            .split(/\s+/)
            .filter(Boolean);

        areaCores.innerHTML = "";

        const titulo = document.createElement("p");

        titulo.textContent = "Escolha a cor:";
        titulo.style.cssText = `
            font-weight: bold;
            margin: 12px 0 8px;
            font-size: 14px;
        `;

        areaCores.appendChild(titulo);

        const grupo = document.createElement("div");

        grupo.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
        `;

        cores.forEach(function(cor) {
            const botao = document.createElement("button");

            const nomeCor = cor.toLowerCase();

            botao.type = "button";
            botao.title = nomeCor.charAt(0).toUpperCase() + nomeCor.slice(1);
            botao.setAttribute("aria-label", "Selecionar cor " + nomeCor);

            botao.dataset.cor = nomeCor;

            const corVisual = {
                preto: "#222222",
                branco: "#ffffff"
            };

            botao.style.cssText = `
                width: 30px;
                height: 30px;
                min-width: 30px;
                padding: 0;
                border-radius: 50%;
                border: 2px solid #888;
                background-color: ${corVisual[nomeCor] || "#cccccc"};
                cursor: pointer;
                transition: 0.2s;
            `;

            botao.addEventListener("click", function() {
                selecionarCorProduto(botao, nomeCor);
            });

            grupo.appendChild(botao);
        });

        areaCores.appendChild(grupo);

        // Seleciona a primeira cor automaticamente
        const primeiraOpcao = grupo.querySelector("button");

        if (primeiraOpcao) {
            selecionarCorProduto(
                primeiraOpcao,
                primeiraOpcao.dataset.cor
            );
        }
    });
}

/* =========================
   SELECIONAR COR DO PRODUTO
========================= */

function selecionarCorProduto(botao, cor) {
    const produto = botao.closest(".produto");

    if (!produto) return;

    const imagem = produto.querySelector("img");

    const botoes = produto.querySelectorAll(
        ".opcoes-cores button"
    );

    botoes.forEach(function(opcao) {
        opcao.style.outline = "none";
        opcao.style.outlineOffset = "2px";
        opcao.style.transform = "scale(1)";
    });

    botao.style.outline = "3px solid #7ed957";
    botao.style.outlineOffset = "3px";
    botao.style.transform = "scale(1.08)";

    produto.dataset.corSelecionada = cor;

    // Busca a imagem correspondente à cor
    const nomeAtributo = "imagem" +
        cor.charAt(0).toUpperCase() +
        cor.slice(1);

    const imagemCor = produto.dataset[nomeAtributo];

    if (imagem && imagemCor) {
        imagem.src = imagemCor;
    }
}

/* =========================
   ABRIR E FECHAR CATEGORIAS
========================= */

function alternarMenuCategorias() {
    const menu = document.getElementById("menuCategorias");
    const seta = document.getElementById("setaCategorias");

    if (!menu || !seta) return;

    menu.classList.toggle("aberto");

    seta.textContent = menu.classList.contains("aberto")
        ? "▲"
        : "▼";
}

/* =========================
   SELECIONAR CATEGORIA
========================= */

function selecionarCategoria(categoria) {
    categoriaAtual = categoria;

    const menu = document.getElementById("menuCategorias");
    const seta = document.getElementById("setaCategorias");

    const textoCategoria = document.getElementById("categoriaSelecionada");

    const nomes = {
        todas: "Todas as categorias",
        feminino: "Feminino",
        masculino: "Masculino",
        blusa: "Blusa",
        calca: "Calça"
    };

    if (textoCategoria) {
        textoCategoria.textContent =
            "Categoria: " + nomes[categoria];
    }

    if (menu) {
        menu.classList.remove("aberto");
    }

    if (seta) {
        seta.textContent = "▼";
    }

    const botoes = document.querySelectorAll(
        "#menuCategorias button"
    );

    botoes.forEach(function(botao) {
        botao.classList.remove("selecionada");

        if (botao.dataset.categoria === categoria) {
            botao.classList.add("selecionada");
        }
    });

    const campo = document.getElementById("campoPesquisa");

    filtrarProdutos(campo ? campo.value : "");
}

/* =========================
   CADASTRO E LOGIN
========================= */

document.addEventListener("DOMContentLoaded", function() {

    /* CADASTRO */

    const formCadastro = document.getElementById("formCadastro");

    if (formCadastro) {
        formCadastro.addEventListener("submit", function(event) {
            event.preventDefault();

            const nome = document.getElementById("nomeCadastro").value.trim();
            const email = document.getElementById("emailCadastro").value.trim();
            const senha = document.getElementById("senhaCadastro").value;

            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            const existe = usuarios.find(function(usuario) {
                return usuario.email.toLowerCase() === email.toLowerCase();
            });

            if (existe) {
                mostrarModal(
                    "Cadastro não realizado",
                    "Este e-mail já está cadastrado!"
                );

                return;
            }

            usuarios.push({
                nome: nome,
                email: email,
                senha: senha
            });

            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            mostrarModal(
                "Cadastro realizado!",
                "Sua conta foi criada com sucesso!",
                function() {
                    window.location.href = "login.html";
                }
            );
        });
    }

    /* LOGIN */

    const formLogin = document.getElementById("formLogin");

    if (formLogin) {
        formLogin.addEventListener("submit", function(event) {
            event.preventDefault();

            const email = document.getElementById("emailLogin").value.trim();
            const senha = document.getElementById("senhaLogin").value;

            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            const usuario = usuarios.find(function(usuario) {
                return usuario.email.toLowerCase() === email.toLowerCase()
                    && usuario.senha === senha;
            });

            if (usuario) {
                localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

                mostrarModal(
                    "Login realizado!",
                    "Bem-vindo(a), " + usuario.nome + "!",
                    function() {
                        window.location.href = "index.html";
                    }
                );
            } else {
                mostrarModal(
                    "Erro no login",
                    "E-mail ou senha incorretos!"
                );
            }
        });
    }

    /* USUÁRIO LOGADO */

    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    const mensagem = document.getElementById("mensagem");
    const linkConta = document.getElementById("linkConta");
    const btnSair = document.getElementById("btnSair");

    if (usuarioLogado) {
        if (mensagem) {
            mensagem.textContent = "Bem-vindo(a), " + usuarioLogado.nome + "!";
        }

        if (linkConta) {
            linkConta.style.display = "none";
        }

        if (btnSair) {
            btnSair.style.display = "block";
        }
    }

    /* PESQUISA E CATEGORIAS */

    const campoPesquisa = document.getElementById("campoPesquisa");

    const listaProdutos = document.querySelector(
        ".pagina-produtos .lista-produtos"
    );

    if (listaProdutos) {
        const parametros = new URLSearchParams(window.location.search);

        const buscaInicial = parametros.get("busca");
        const categoriaInicial = parametros.get("categoria");

        if (campoPesquisa && buscaInicial) {
            campoPesquisa.value = buscaInicial;
        }

        const categoriasPermitidas = [
            "todas",
            "feminino",
            "masculino",
            "blusa",
            "calca"
        ];

        if (categoriasPermitidas.includes(categoriaInicial)) {
            categoriaAtual = categoriaInicial;
        }

        const nomes = {
            todas: "Todas as categorias",
            feminino: "Feminino",
            masculino: "Masculino",
            blusa: "Blusa",
            calca: "Calça"
        };

        const textoCategoria = document.getElementById("categoriaSelecionada");

        if (textoCategoria) {
            textoCategoria.textContent =
                "Categoria: " + nomes[categoriaAtual];
        }

        const botoes = document.querySelectorAll(
            "#menuCategorias button"
        );

        botoes.forEach(function(botao) {
            botao.classList.remove("selecionada");

            if (botao.dataset.categoria === categoriaAtual) {
                botao.classList.add("selecionada");
            }
        });

        if (campoPesquisa) {
            campoPesquisa.addEventListener("input", function() {
                filtrarProdutos(campoPesquisa.value);
            });
        }

        filtrarProdutos(buscaInicial || "");
    }

    /* ATIVAR CORES DOS PRODUTOS */

    configurarOpcoesCores();

    /* PESQUISA COM ENTER */

    if (campoPesquisa) {
        campoPesquisa.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                pesquisar();
            }
        });
    }

    /* CARROSSEL AUTOMÁTICO */

    const slides = document.querySelectorAll(".slide");

    if (slides.length > 0) {
        setInterval(function() {
            mudarSlide(1);
        }, 4000);
    }

    /* ATUALIZAR CARRINHO */

    atualizarContadorCarrinho();
    mostrarCarrinho();
});

/* =========================
   SAIR DA CONTA
========================= */

function sair() {
    mostrarModal(
        "Você saiu da conta",
        "Sua sessão foi encerrada com sucesso.",
        function() {
            localStorage.removeItem("usuarioLogado");
            window.location.href = "index.html";
        }
    );
}

/* =========================
   PESQUISA
========================= */

function pesquisar() {
    const campo = document.getElementById("campoPesquisa");

    if (!campo) return;

    const pesquisa = campo.value.trim();

    if (pesquisa === "") {
        mostrarModal(
            "Pesquisa vazia",
            "Digite o nome de um produto para pesquisar."
        );

        return;
    }

    const estaNaPaginaProdutos =
        document.querySelector(".pagina-produtos .lista-produtos");

    if (estaNaPaginaProdutos) {
        filtrarProdutos(pesquisa);
        return;
    }

    window.location.href =
        "produtos.html?busca=" + encodeURIComponent(pesquisa);
}

/* =========================
   FILTRAR PRODUTOS
========================= */

function filtrarProdutos(pesquisa = "") {
    const produtos = document.querySelectorAll(
        ".pagina-produtos .lista-produtos .produto"
    );

    const mensagem = document.getElementById("resultadoPesquisa");

    if (produtos.length === 0) return;

    const termo = normalizarTexto(pesquisa);

    let encontrados = 0;

    produtos.forEach(function(produto) {
        const conteudo = normalizarTexto(produto.textContent);

        const categorias = normalizarTexto(
            produto.dataset.categorias || ""
        ).split(/\s+/);

        const correspondePesquisa =
            termo === "" || conteudo.includes(termo);

        const correspondeCategoria =
            categoriaAtual === "todas" ||
            categorias.includes(categoriaAtual);

        const mostrar =
            correspondePesquisa && correspondeCategoria;

        if (mostrar) {
            produto.style.display = "";
            encontrados++;
        } else {
            produto.style.display = "none";
        }
    });

    if (mensagem) {
        mensagem.style.display = "block";

        mensagem.textContent = encontrados > 0
            ? encontrados + " produto(s) encontrado(s)."
            : "Nenhum produto encontrado.";
    }
}

/* =========================
   IDENTIFICAR USUÁRIO
========================= */

function obterUsuarioLogado() {
    return JSON.parse(localStorage.getItem("usuarioLogado"));
}

/* =========================
   IDENTIFICAR CARRINHO
========================= */

function obterChaveCarrinho() {
    const usuario = obterUsuarioLogado();

    if (!usuario) return null;

    return "carrinho_" + usuario.email.toLowerCase();
}

/* =========================
   OBTER PRODUTOS DO CARRINHO
========================= */

function obterProdutosCarrinho() {
    const chave = obterChaveCarrinho();

    if (!chave) return [];

    return JSON.parse(localStorage.getItem(chave)) || [];
}

/* =========================
   SALVAR CARRINHO
========================= */

function salvarCarrinho(produtos) {
    const chave = obterChaveCarrinho();

    if (!chave) return;

    localStorage.setItem(chave, JSON.stringify(produtos));

    atualizarContadorCarrinho();
}

/* =========================
   ADICIONAR AO CARRINHO
   AGORA COM VARIAÇÃO DE COR
========================= */

function adicionarAoCarrinho(nome, preco, imagem, elemento = null) {
    const usuario = obterUsuarioLogado();

    if (!usuario) {
        mostrarModal(
            "Entre na sua conta",
            "Você precisa fazer login para adicionar produtos ao carrinho.",
            function() {
                window.location.href = "login.html";
            }
        );

        return;
    }

    let cor = null;
    let imagemFinal = imagem;

    // Identifica a cor selecionada no card
    if (elemento) {
        const card = elemento.closest(".produto");

        if (card && card.dataset.cores) {
            cor = card.dataset.corSelecionada || null;

            if (!cor) {
                mostrarModal(
                    "Escolha uma cor",
                    "Selecione uma cor antes de adicionar o produto ao carrinho."
                );

                return;
            }

            const nomeAtributo = "imagem" +
                cor.charAt(0).toUpperCase() +
                cor.slice(1);

            imagemFinal = card.dataset[nomeAtributo] || imagem;
        }
    }

    let produtos = obterProdutosCarrinho();

    // Produtos com cores diferentes são itens diferentes
    const produtoExistente = produtos.find(function(produto) {
        return produto.nome === nome &&
            (produto.cor || null) === cor;
    });

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        produtos.push({
            nome: nome,
            preco: Number(preco),
            imagem: imagemFinal,
            cor: cor,
            quantidade: 1
        });
    }

    salvarCarrinho(produtos);

    let mensagem = nome + " foi adicionado ao seu carrinho.";

    if (cor) {
        mensagem = nome + " na cor " + cor + " foi adicionado ao seu carrinho.";
    }

    mostrarModal(
        "Produto adicionado!",
        mensagem
    );
}

/* =========================
   ATUALIZAR CONTADOR
========================= */

function atualizarContadorCarrinho() {
    const contador = document.getElementById("contadorCarrinho");

    if (!contador) return;

    const usuario = obterUsuarioLogado();

    if (!usuario) {
        contador.textContent = "0";
        return;
    }

    const produtos = obterProdutosCarrinho();

    let quantidadeTotal = 0;

    produtos.forEach(function(produto) {
        quantidadeTotal += produto.quantidade;
    });

    contador.textContent = quantidadeTotal;
}

/* =========================
   MOSTRAR CARRINHO
========================= */

function mostrarCarrinho() {
    const areaCarrinho = document.getElementById("itensCarrinho");
    const resumoCarrinho = document.getElementById("resumoCarrinho");

    if (!areaCarrinho || !resumoCarrinho) return;

    const usuario = obterUsuarioLogado();

    if (!usuario) {
        areaCarrinho.innerHTML = `
            <p>Você precisa entrar na sua conta para visualizar seu carrinho.</p>

            <a href="login.html" class="botao-login-carrinho">
                Entrar na minha conta
            </a>
        `;

        resumoCarrinho.innerHTML = "";

        return;
    }

    const produtos = obterProdutosCarrinho();

    areaCarrinho.innerHTML = "";

    if (produtos.length === 0) {
        areaCarrinho.innerHTML = `
            <p>Seu carrinho está vazio.</p>
        `;

        resumoCarrinho.innerHTML = "";

        return;
    }

    let valorTotal = 0;

    produtos.forEach(function(produto, indice) {
        const subtotal = produto.preco * produto.quantidade;

        valorTotal += subtotal;

        const item = document.createElement("div");

        item.className = "item-carrinho";

        const informacoes = document.createElement("div");

        informacoes.className = "informacoes-carrinho";

        const imagem = document.createElement("img");

        imagem.src = produto.imagem;
        imagem.alt = produto.nome;

        const titulo = document.createElement("h3");

        titulo.textContent = produto.nome;

        const preco = document.createElement("p");

        preco.textContent =
            "Preço: R$ " + produto.preco.toFixed(2).replace(".", ",");

        const subtotalElemento = document.createElement("p");

        subtotalElemento.textContent =
            "Subtotal: R$ " + subtotal.toFixed(2).replace(".", ",");

        informacoes.appendChild(titulo);

        // Mostra a cor quando houver uma variação escolhida
        if (produto.cor) {
            const corElemento = document.createElement("p");

            corElemento.textContent =
                "Cor: " + produto.cor.charAt(0).toUpperCase() +
                produto.cor.slice(1);

            informacoes.appendChild(corElemento);
        }

        informacoes.appendChild(preco);
        informacoes.appendChild(subtotalElemento);

        const quantidade = document.createElement("div");

        quantidade.className = "quantidade-carrinho";

        const diminuir = document.createElement("button");

        diminuir.textContent = "-";

        diminuir.onclick = function() {
            alterarQuantidade(indice, -1);
        };

        const numero = document.createElement("span");

        numero.textContent = produto.quantidade;

        const aumentar = document.createElement("button");

        aumentar.textContent = "+";

        aumentar.onclick = function() {
            alterarQuantidade(indice, 1);
        };

        quantidade.appendChild(diminuir);
        quantidade.appendChild(numero);
        quantidade.appendChild(aumentar);

        const remover = document.createElement("button");

        remover.className = "remover-produto";
        remover.textContent = "Remover produto";

        remover.onclick = function() {
            removerDoCarrinho(indice);
        };

        informacoes.appendChild(quantidade);
        informacoes.appendChild(remover);

        item.appendChild(imagem);
        item.appendChild(informacoes);

        areaCarrinho.appendChild(item);
    });

    resumoCarrinho.innerHTML = `
        <h3>Total: R$ ${valorTotal.toFixed(2).replace(".", ",")}</h3>

        <button type="button" class="botao-finalizar-compra" onclick="abrirFinalizacaoCompra()">
            Finalizar compra
        </button>
    `;
}

/* =========================
   ALTERAR QUANTIDADE
========================= */

function alterarQuantidade(indice, quantidade) {
    let produtos = obterProdutosCarrinho();

    if (!produtos[indice]) return;

    produtos[indice].quantidade += quantidade;

    if (produtos[indice].quantidade <= 0) {
        produtos.splice(indice, 1);
    }

    salvarCarrinho(produtos);

    mostrarCarrinho();
}

/* =========================
   REMOVER PRODUTO
========================= */

function removerDoCarrinho(indice) {
    let produtos = obterProdutosCarrinho();

    produtos.splice(indice, 1);

    salvarCarrinho(produtos);

    mostrarCarrinho();
}

/* =========================
   CARROSSEL
========================= */

let slideAtual = 0;

/* =========================
   FINALIZAÇÃO DE COMPRA
   SIMULAÇÃO
========================= */

function abrirFinalizacaoCompra() {
    const usuario = obterUsuarioLogado();

    const produtos = obterProdutosCarrinho();

    if (!usuario) {
        mostrarModal(
            "Entre na sua conta",
            "Você precisa fazer login para finalizar a compra.",
            function() {
                window.location.href = "login.html";
            }
        );

        return;
    }

    if (produtos.length === 0) {
        mostrarModal(
            "Carrinho vazio",
            "Adicione produtos antes de finalizar a compra."
        );

        return;
    }

    const total = produtos.reduce(function(soma, produto) {
        return soma + Number(produto.preco) * Number(produto.quantidade);
    }, 0);

    const fundo = document.createElement("div");

    fundo.id = "modalFinalizarCompra";
    fundo.className = "fundo-finalizacao";

    const caixa = document.createElement("div");

    caixa.className = "caixa-finalizacao";

    caixa.innerHTML = `
        <button type="button" class="fechar-finalizacao" aria-label="Fechar">&times;</button>

        <h2>Finalizar compra</h2>

        <p class="total-finalizacao">
            Total do pedido:
            <strong>R$ ${total.toFixed(2).replace(".", ",")}</strong>
        </p>

        <form id="formFinalizacao">
            <fieldset class="opcoes-pagamento">
                <legend>Escolha a forma de pagamento</legend>

                <label>
                    <input type="radio" name="formaPagamento" value="PIX" required>
                    PIX
                </label>

                <label>
                    <input type="radio" name="formaPagamento" value="Cartão de crédito">
                    Cartão de crédito
                </label>

                <label>
                    <input type="radio" name="formaPagamento" value="Cartão de débito">
                    Cartão de débito
                </label>

                <label>
                    <input type="radio" name="formaPagamento" value="Boleto bancário">
                    Boleto bancário
                </label>
            </fieldset>

            <p class="aviso-pagamento">
                Esta é uma demonstração acadêmica. Nenhum pagamento real será realizado e nenhum dado bancário será solicitado.
            </p>

            <div class="acoes-finalizacao">
                <button type="button" class="botao-cancelar-finalizacao">
                    Voltar ao carrinho
                </button>

                <button type="submit" class="botao-confirmar-finalizacao">
                    Confirmar pedido
                </button>
            </div>
        </form>
    `;

    fundo.appendChild(caixa);

    document.body.appendChild(fundo);

    function fechar() {
        fundo.remove();
    }

    caixa.querySelector(".fechar-finalizacao").addEventListener("click", fechar);

    caixa.querySelector(".botao-cancelar-finalizacao").addEventListener("click", fechar);

    fundo.addEventListener("click", function(event) {
        if (event.target === fundo) {
            fechar();
        }
    });

    caixa.querySelector("#formFinalizacao").addEventListener("submit", function(event) {
        event.preventDefault();

        const selecionado = caixa.querySelector(
            'input[name="formaPagamento"]:checked'
        );

        if (!selecionado) {
            mostrarModal(
                "Forma de pagamento",
                "Selecione uma forma de pagamento para continuar."
            );

            return;
        }

        const formaPagamento = selecionado.value;

        const quantidadeItens = produtos.reduce(function(soma, produto) {
            return soma + Number(produto.quantidade);
        }, 0);

        // Limpa somente o carrinho do usuário atualmente conectado.
        salvarCarrinho([]);

        fechar();

        mostrarCarrinho();

        mostrarModal(
            "Pedido realizado!",
            "Seu pedido foi registrado nesta simulação. Itens: " +
            quantidadeItens +
            ". Total: R$ " +
            total.toFixed(2).replace(".", ",") +
            ". Pagamento escolhido: " +
            formaPagamento +
            ". Nenhuma cobrança foi feita."
        );
    });
}

/* =========================
   CONTROLES DO CARROSSEL
========================= */

function mostrarSlide(indice) {
    const slides = document.querySelectorAll(".slide");

    const pontos = document.querySelectorAll(".ponto");

    if (slides.length === 0) return;

    slides[slideAtual].classList.remove("ativo");

    if (pontos[slideAtual]) {
        pontos[slideAtual].classList.remove("ativo");
    }

    slideAtual = (indice + slides.length) % slides.length;

    slides[slideAtual].classList.add("ativo");

    if (pontos[slideAtual]) {
        pontos[slideAtual].classList.add("ativo");
    }
}

function mudarSlide(direcao) {
    mostrarSlide(slideAtual + direcao);
}

function irParaSlide(indice) {
    mostrarSlide(indice);
}