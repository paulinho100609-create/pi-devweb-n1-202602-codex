let imagensCoresFormulario = {};

document.addEventListener("DOMContentLoaded", function() {

    if (localStorage.getItem("administradorLogado") !== "true") {
        window.location.href = "login.html";
        return;
    }

    const formulario = document.getElementById("formProdutoAdmin");
    const secaoFormulario = document.getElementById("formularioAdmin");
    const botaoAdicionar = document.getElementById("botaoAdicionarProduto");
    const campoCores = document.getElementById("coresProdutoAdmin");
    const campoImagemPrincipal = document.getElementById("imagemProdutoAdmin");
    const campoUrlPrincipal = document.getElementById("urlImagemPrincipalAdmin");

    if (!formulario) return;

    renderizarProdutosAdmin();
    configurarCategoriasAdmin();
    configurarImagemPrincipal();
    atualizarCamposImagemPorQuantidadeDeCores();

    if (botaoAdicionar) {
        botaoAdicionar.addEventListener("click", function() {
            cancelarEdicaoProduto();

            secaoFormulario.hidden = false;

            document.getElementById("tituloFormularioProduto").textContent =
                "Adicionar novo produto";

            secaoFormulario.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    formulario.addEventListener("submit", function(event) {
        event.preventDefault();
        salvarProdutoAdmin();
    });

    if (campoCores) {
        campoCores.addEventListener("input", function() {
            atualizarCamposImagemPorQuantidadeDeCores();
            renderizarCamposImagensCores();
        });
    }

    if (campoImagemPrincipal) {
        campoImagemPrincipal.addEventListener("change", async function() {
            const arquivo = campoImagemPrincipal.files[0];

            if (!arquivo) return;

            try {
                const imagem = await converterImagemParaBase64(arquivo);

                document.getElementById("imagemProdutoValorAdmin").value = imagem;

                if (campoUrlPrincipal) {
                    campoUrlPrincipal.value = "";
                }

                mostrarPreviaImagem("previaImagemPrincipal", imagem);

            } catch (erro) {
                mostrarModalAdmin(
                    "Imagem inválida",
                    "Não foi possível carregar essa imagem. Tente selecionar outra."
                );

                campoImagemPrincipal.value = "";
            }
        });
    }

    if (campoUrlPrincipal) {
        campoUrlPrincipal.addEventListener("input", function() {
            const url = campoUrlPrincipal.value.trim();

            if (!url) {
                document.getElementById("imagemProdutoValorAdmin").value = "";
                mostrarPreviaImagem("previaImagemPrincipal", "");
                return;
            }

            if (!validarEnderecoImagem(url)) return;

            document.getElementById("imagemProdutoValorAdmin").value = url;
            mostrarPreviaImagem("previaImagemPrincipal", url);
        });

        campoUrlPrincipal.addEventListener("change", function() {
            const url = campoUrlPrincipal.value.trim();

            if (url && !validarEnderecoImagem(url)) {
                mostrarModalAdmin(
                    "Link inválido",
                    "Cole um endereço válido começando com https:// ou http://."
                );
            }
        });
    }

    const botaoRemoverPrincipal = document.getElementById(
        "removerImagemPrincipalAdmin"
    );

    if (botaoRemoverPrincipal) {
        botaoRemoverPrincipal.addEventListener("click", function() {
            document.getElementById("imagemProdutoValorAdmin").value = "";

            if (campoImagemPrincipal) {
                campoImagemPrincipal.value = "";
            }

            if (campoUrlPrincipal) {
                campoUrlPrincipal.value = "";
            }

            mostrarPreviaImagem("previaImagemPrincipal", "");
        });
    }

    const checkboxPromocao = document.getElementById("promocaoProdutoAdmin");
    const campoPrecoPromocional = document.getElementById("precoPromocionalAdmin");

    if (checkboxPromocao && campoPrecoPromocional) {
        checkboxPromocao.addEventListener("change", function() {
            campoPrecoPromocional.disabled = !checkboxPromocao.checked;

            if (!checkboxPromocao.checked) {
                campoPrecoPromocional.value = "";
            }
        });

        campoPrecoPromocional.disabled = !checkboxPromocao.checked;
    }

    document.addEventListener("catalogoAtualizado", renderizarProdutosAdmin);
});


/* =====================================
   CONVERSÃO DE IMAGENS DO DISPOSITIVO
===================================== */

function converterImagemParaBase64(arquivo) {
    return new Promise(function(resolve, reject) {

        if (!arquivo || !arquivo.type.startsWith("image/")) {
            reject(new Error("Arquivo não é uma imagem."));
            return;
        }

        const leitor = new FileReader();

        leitor.onload = function() {
            const imagem = new Image();

            imagem.onload = function() {
                const limite = 1200;

                let largura = imagem.width;
                let altura = imagem.height;

                if (largura > limite || altura > limite) {
                    const proporcao = Math.min(
                        limite / largura,
                        limite / altura
                    );

                    largura = Math.round(largura * proporcao);
                    altura = Math.round(altura * proporcao);
                }

                const canvas = document.createElement("canvas");
                canvas.width = largura;
                canvas.height = altura;

                const contexto = canvas.getContext("2d");

                contexto.fillStyle = "#ffffff";
                contexto.fillRect(0, 0, largura, altura);
                contexto.drawImage(imagem, 0, 0, largura, altura);

                resolve(canvas.toDataURL("image/jpeg", 0.78));
            };

            imagem.onerror = reject;
            imagem.src = leitor.result;
        };

        leitor.onerror = reject;
        leitor.readAsDataURL(arquivo);
    });
}


/* =====================================
   VALIDAÇÃO E PRÉVIA DAS IMAGENS
===================================== */

function validarEnderecoImagem(url) {
    try {
        const endereco = new URL(url);

        return endereco.protocol === "https:" ||
            endereco.protocol === "http:";
    } catch (erro) {
        return false;
    }
}


function mostrarPreviaImagem(id, caminho) {
    const previa = document.getElementById(id);

    if (!previa) return;

    if (caminho) {
        previa.onload = function() {
            previa.classList.add("visivel");
        };

        previa.onerror = function() {
            previa.classList.remove("visivel");

            mostrarModalAdmin(
                "Imagem não encontrada",
                "Não foi possível carregar essa imagem. Confira o link ou escolha outro arquivo."
            );
        };

        previa.src = caminho;
    } else {
        previa.removeAttribute("src");
        previa.classList.remove("visivel");
    }
}


function configurarImagemPrincipal() {
    const campoArquivo = document.getElementById("imagemProdutoAdmin");
    const campoUrl = document.getElementById("urlImagemPrincipalAdmin");

    if (campoArquivo && campoUrl) {
        campoArquivo.addEventListener("change", function() {
            if (campoArquivo.files.length) {
                campoUrl.value = "";
            }
        });
    }
}


/* =====================================
   CATEGORIAS COM BOTÕES DE TOQUE
===================================== */

function configurarCategoriasAdmin() {
    const botoes = document.querySelectorAll(".categoria-admin");
    const select = document.getElementById("categoriaProdutoAdmin");

    botoes.forEach(function(botao) {
        botao.addEventListener("click", function() {
            const categoria = botao.dataset.categoria;

            const opcao = Array.from(select.options).find(function(item) {
                return item.value === categoria;
            });

            if (!opcao) return;

            opcao.selected = !opcao.selected;
            atualizarBotoesCategoriasAdmin();
        });
    });

    atualizarBotoesCategoriasAdmin();
}


function atualizarBotoesCategoriasAdmin() {
    const select = document.getElementById("categoriaProdutoAdmin");

    if (!select) return;

    const selecionadas = Array.from(select.selectedOptions).map(function(opcao) {
        return opcao.value;
    });

    document.querySelectorAll(".categoria-admin").forEach(function(botao) {
        const ativa = selecionadas.includes(botao.dataset.categoria);

        botao.classList.toggle("selecionada", ativa);
        botao.setAttribute("aria-pressed", String(ativa));
    });
}


/* =====================================
   IMAGENS DINÂMICAS POR COR
===================================== */

function normalizarCorAdmin(cor) {
    return String(cor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}


function obterCoresDoFormulario() {
    const campo = document.getElementById("coresProdutoAdmin");

    if (!campo) return [];

    return campo.value
        .split(",")
        .map(function(cor) {
            return cor.trim();
        })
        .filter(Boolean);
}


function atualizarCamposImagemPorQuantidadeDeCores() {
    const cores = obterCoresDoFormulario();

    const campoPrincipal = document.getElementById(
        "campoImagemPrincipalContainer"
    );

    const campoCores = document.getElementById(
        "campoImagensCoresContainer"
    );

    if (!campoPrincipal || !campoCores) return;

    if (cores.length >= 2) {
        campoPrincipal.style.display = "none";
        campoCores.style.display = "block";
    } else {
        campoPrincipal.style.display = "block";
        campoCores.style.display = "none";
    }
}


function renderizarCamposImagensCores() {
    const container = document.getElementById("imagensCoresAdmin");

    if (!container) return;

    const cores = obterCoresDoFormulario();
    const imagensAntigas = { ...imagensCoresFormulario };

    container.innerHTML = "";

    const coresRenderizadas = new Set();

    // Com zero ou uma cor, não são criados campos individuais.
    if (cores.length < 2) {
        imagensCoresFormulario = {};
        atualizarCamposImagemPorQuantidadeDeCores();
        return;
    }

    cores.forEach(function(cor, indice) {
        const chave = normalizarCorAdmin(cor);

        if (!chave || coresRenderizadas.has(chave)) return;

        coresRenderizadas.add(chave);

        const bloco = document.createElement("div");
        bloco.className = "campo-imagem-admin";

        const titulo = document.createElement("strong");
        titulo.textContent = "Imagem da cor: " + cor;

        const labelArquivo = document.createElement("label");
        labelArquivo.textContent = "Selecionar do dispositivo";

        const inputArquivo = document.createElement("input");
        inputArquivo.type = "file";
        inputArquivo.accept = "image/*";
        inputArquivo.id = "arquivoCorAdmin" + indice;

        labelArquivo.htmlFor = inputArquivo.id;

        const separador = document.createElement("div");
        separador.className = "separador-imagem-admin";
        separador.textContent = "OU";

        const labelUrl = document.createElement("label");
        labelUrl.textContent = "Colar link da imagem";

        const inputUrl = document.createElement("input");
        inputUrl.type = "url";
        inputUrl.placeholder = "https://exemplo.com/imagem.jpg";

        const previa = document.createElement("img");
        previa.alt = "Prévia da cor " + cor;

        const botaoRemover = document.createElement("button");
        botaoRemover.type = "button";
        botaoRemover.className = "botao-remover-imagem-admin";
        botaoRemover.textContent = "Remover imagem";

        const imagemSalva = imagensAntigas[chave] || "";

        if (imagemSalva) {
            previa.src = imagemSalva;
            previa.classList.add("visivel");

            if (
                imagemSalva.startsWith("http://") ||
                imagemSalva.startsWith("https://")
            ) {
                inputUrl.value = imagemSalva;
            }
        }

        inputArquivo.addEventListener("change", async function() {
            const arquivo = inputArquivo.files[0];

            if (!arquivo) return;

            try {
                const imagem = await converterImagemParaBase64(arquivo);

                imagensCoresFormulario[chave] = imagem;
                inputUrl.value = "";

                previa.src = imagem;
                previa.classList.add("visivel");

            } catch (erro) {
                mostrarModalAdmin(
                    "Imagem inválida",
                    "Não foi possível carregar a imagem da cor " + cor + "."
                );

                inputArquivo.value = "";
            }
        });

        inputUrl.addEventListener("input", function() {
            const url = inputUrl.value.trim();

            if (!url) {
                delete imagensCoresFormulario[chave];

                previa.removeAttribute("src");
                previa.classList.remove("visivel");
                return;
            }

            if (!validarEnderecoImagem(url)) return;

            imagensCoresFormulario[chave] = url;
            inputArquivo.value = "";

            previa.src = url;
            previa.classList.add("visivel");
        });

        inputUrl.addEventListener("change", function() {
            const url = inputUrl.value.trim();

            if (url && !validarEnderecoImagem(url)) {
                mostrarModalAdmin(
                    "Link inválido",
                    "Cole um endereço válido começando com https:// ou http://."
                );
            }
        });

        botaoRemover.addEventListener("click", function() {
            delete imagensCoresFormulario[chave];

            inputArquivo.value = "";
            inputUrl.value = "";

            previa.removeAttribute("src");
            previa.classList.remove("visivel");
        });

        bloco.append(
            titulo,
            labelArquivo,
            inputArquivo,
            separador,
            labelUrl,
            inputUrl,
            previa,
            botaoRemover
        );

        container.appendChild(bloco);
    });

    Object.keys(imagensCoresFormulario).forEach(function(chave) {
        if (!coresRenderizadas.has(chave)) {
            delete imagensCoresFormulario[chave];
        }
    });

    atualizarCamposImagemPorQuantidadeDeCores();
}


/* =====================================
   MODAIS PERSONALIZADOS DO ADMIN
===================================== */

function mostrarModalAdmin(titulo, mensagem, confirmacao = false) {
    return new Promise(function(resolve) {
        const modalAnterior = document.getElementById("modalAdminPersonalizado");

        if (modalAnterior) {
            modalAnterior.remove();
        }

        const fundo = document.createElement("div");
        fundo.id = "modalAdminPersonalizado";
        fundo.className = "fundo-modal-admin";

        const caixa = document.createElement("div");
        caixa.className = "caixa-modal-admin";

        const icone = document.createElement("div");
        icone.className = "icone-modal-admin";
        icone.textContent = confirmacao ? "?" : "✓";

        const tituloElemento = document.createElement("h2");
        tituloElemento.textContent = titulo;

        const mensagemElemento = document.createElement("p");
        mensagemElemento.textContent = mensagem;

        const botoes = document.createElement("div");
        botoes.className = "botoes-modal-admin";

        function fecharModal(resultado) {
            fundo.remove();
            resolve(resultado);
        }

        if (confirmacao) {
            const botaoCancelar = document.createElement("button");
            botaoCancelar.type = "button";
            botaoCancelar.className = "botao-modal-cancelar";
            botaoCancelar.textContent = "Cancelar";

            botaoCancelar.addEventListener("click", function() {
                fecharModal(false);
            });

            const botaoConfirmar = document.createElement("button");
            botaoConfirmar.type = "button";
            botaoConfirmar.className = "botao-modal-confirmar";
            botaoConfirmar.textContent = "Confirmar";

            botaoConfirmar.addEventListener("click", function() {
                fecharModal(true);
            });

            botoes.append(botaoCancelar, botaoConfirmar);

        } else {
            const botaoOk = document.createElement("button");
            botaoOk.type = "button";
            botaoOk.className = "botao-modal-confirmar";
            botaoOk.textContent = "Entendi";

            botaoOk.addEventListener("click", function() {
                fecharModal(true);
            });

            botoes.appendChild(botaoOk);
        }

        caixa.append(icone, tituloElemento, mensagemElemento, botoes);
        fundo.appendChild(caixa);
        document.body.appendChild(fundo);
    });
}


/* =====================================
   SALVAR PRODUTO
===================================== */

function salvarProdutoAdmin() {
    const id = document.getElementById("produtoId").value;
    const nome = document.getElementById("nomeProdutoAdmin").value.trim();
    const preco = Number(document.getElementById("precoProdutoAdmin").value);

    const categorias = Array.from(
        document.getElementById("categoriaProdutoAdmin").selectedOptions
    ).map(function(opcao) {
        return opcao.value;
    });

    const cores = obterCoresDoFormulario().map(function(cor) {
        return cor.toLowerCase();
    });

    const imagemPrincipal = document.getElementById(
        "imagemProdutoValorAdmin"
    ).value.trim();

    // Duas ou mais cores usam somente imagens individuais.
    // Zero ou uma cor usa somente a imagem principal.
    const imagem = cores.length >= 2 ? "" : imagemPrincipal;

    const imagensCores = cores.length >= 2
        ? { ...imagensCoresFormulario }
        : {};

    const promocao = document.getElementById("promocaoProdutoAdmin").checked;

    const precoPromocional = Number(
        document.getElementById("precoPromocionalAdmin").value
    );

    if (!nome || !Number.isFinite(preco) || preco <= 0 || categorias.length === 0) {
        mostrarModalAdmin(
            "Dados incompletos",
            "Preencha o nome, o preço e selecione pelo menos uma categoria."
        );
        return;
    }

    if (
        promocao &&
        (
            !Number.isFinite(precoPromocional) ||
            precoPromocional <= 0 ||
            precoPromocional >= preco
        )
    ) {
        mostrarModalAdmin(
            "Preço promocional inválido",
            "O preço promocional deve ser maior que zero e menor que o preço original."
        );
        return;
    }

    const produtos = obterProdutos();

    const indice = id
        ? produtos.findIndex(function(item) {
            return String(item.id) === String(id);
        })
        : -1;

    if (id && indice === -1) {
        mostrarModalAdmin(
            "Produto não encontrado",
            "Não foi possível localizar esse produto no catálogo."
        );
        return;
    }

    const produtoAnterior = indice >= 0 ? produtos[indice] : null;

    const produto = {
        id: id || "produto-" + Date.now(),
        nome: nome,
        preco: preco,
        categoria: categorias,
        cores: cores,
        imagem: imagem,
        imagensCores: imagensCores,
        promocao: promocao,
        precoPromocional: promocao ? precoPromocional : 0,
        esgotado: produtoAnterior ? Boolean(produtoAnterior.esgotado) : false
    };

    // Compatibilidade com produtos antigos que usavam esses campos.
    produto.imagemPreto = imagensCores.preto || "";
    produto.imagemBranco = imagensCores.branco || "";

    const produtosAtualizados = [...produtos];

    if (indice >= 0) {
        produtosAtualizados[indice] = produto;
    } else {
        produtosAtualizados.push(produto);
    }

    try {
        const salvou = salvarProdutos(produtosAtualizados);

        if (salvou === false) return;

    } catch (erro) {
        mostrarModalAdmin(
            "Não foi possível salvar",
            "O armazenamento do navegador pode estar cheio. Tente usar imagens menores ou links de imagens."
        );
        return;
    }

    cancelarEdicaoProduto();
    renderizarProdutosAdmin();

    mostrarModalAdmin(
        "Tudo certo!",
        id
            ? "O produto foi atualizado com sucesso."
            : "O produto foi cadastrado com sucesso."
    );
}


/* =====================================
   LISTAGEM ADMINISTRATIVA
===================================== */

function renderizarProdutosAdmin() {
    const lista = document.getElementById("listaProdutosAdmin");
    const quantidade = document.getElementById("quantidadeProdutosAdmin");

    if (!lista) return;

    const produtos = obterProdutos();

    lista.innerHTML = "";

    if (quantidade) {
        quantidade.textContent = produtos.length;
    }

    if (produtos.length === 0) {
        lista.innerHTML =
            '<p class="mensagem-lista-vazia">Nenhum produto cadastrado.</p>';
        return;
    }

    produtos.forEach(function(produto) {
        lista.appendChild(criarCardProduto(produto, true));
    });
}


/* =====================================
   EDITAR PRODUTO
===================================== */

function editarProdutoAdmin(id) {
    const produtos = obterProdutos();

    const produto = produtos.find(function(item) {
        return String(item.id) === String(id);
    });

    if (!produto) {
        mostrarModalAdmin(
            "Produto não encontrado",
            "Não foi possível localizar esse produto."
        );
        return;
    }

    const secaoFormulario = document.getElementById("formularioAdmin");

    secaoFormulario.hidden = false;

    document.getElementById("produtoId").value = produto.id;
    document.getElementById("nomeProdutoAdmin").value = produto.nome;
    document.getElementById("precoProdutoAdmin").value = produto.preco;

    document.getElementById("coresProdutoAdmin").value =
        (produto.cores || []).join(", ");

    const possuiVariasCores = (produto.cores || []).length >= 2;

    document.getElementById("imagemProdutoValorAdmin").value =
        possuiVariasCores ? "" : (produto.imagem || "");

    document.getElementById("imagemProdutoAdmin").value = "";

    const urlPrincipal = document.getElementById("urlImagemPrincipalAdmin");

    if (urlPrincipal) {
        urlPrincipal.value =
            !possuiVariasCores &&
            produto.imagem &&
            (
                produto.imagem.startsWith("http://") ||
                produto.imagem.startsWith("https://")
            )
                ? produto.imagem
                : "";
    }

    mostrarPreviaImagem(
        "previaImagemPrincipal",
        possuiVariasCores ? "" : (produto.imagem || "")
    );

    imagensCoresFormulario = {};

    Object.entries(produto.imagensCores || {}).forEach(function([cor, imagem]) {
        imagensCoresFormulario[normalizarCorAdmin(cor)] = imagem;
    });

    // Compatibilidade com produtos antigos.
    if (produto.imagemPreto && !imagensCoresFormulario.preto) {
        imagensCoresFormulario.preto = produto.imagemPreto;
    }

    if (produto.imagemBranco && !imagensCoresFormulario.branco) {
        imagensCoresFormulario.branco = produto.imagemBranco;
    }

    atualizarCamposImagemPorQuantidadeDeCores();
    renderizarCamposImagensCores();

    document.getElementById("promocaoProdutoAdmin").checked =
        Boolean(produto.promocao);

    document.getElementById("precoPromocionalAdmin").value =
        produto.precoPromocional || "";

    document.getElementById("precoPromocionalAdmin").disabled =
        !produto.promocao;

    const categorias = Array.isArray(produto.categoria)
        ? produto.categoria
        : [produto.categoria];

    Array.from(
        document.getElementById("categoriaProdutoAdmin").options
    ).forEach(function(opcao) {
        opcao.selected = categorias.includes(opcao.value);
    });

    atualizarBotoesCategoriasAdmin();

    document.getElementById("tituloFormularioProduto").textContent =
        "Editar produto";

    document.getElementById("botaoSalvarProduto").textContent =
        "Salvar alterações";

    document.getElementById("botaoCancelarEdicao").style.display =
        "inline-block";

    secaoFormulario.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =====================================
   CANCELAR EDIÇÃO
===================================== */

function cancelarEdicaoProduto() {
    const formulario = document.getElementById("formProdutoAdmin");
    const secaoFormulario = document.getElementById("formularioAdmin");

    if (!formulario) return;

    formulario.reset();

    document.getElementById("produtoId").value = "";
    document.getElementById("imagemProdutoValorAdmin").value = "";

    const urlPrincipal = document.getElementById("urlImagemPrincipalAdmin");

    if (urlPrincipal) {
        urlPrincipal.value = "";
    }

    const arquivoPrincipal = document.getElementById("imagemProdutoAdmin");

    if (arquivoPrincipal) {
        arquivoPrincipal.value = "";
    }

    imagensCoresFormulario = {};

    mostrarPreviaImagem("previaImagemPrincipal", "");

    const containerCores = document.getElementById("imagensCoresAdmin");

    if (containerCores) {
        containerCores.innerHTML = "";
    }

    atualizarCamposImagemPorQuantidadeDeCores();
    atualizarBotoesCategoriasAdmin();

    document.getElementById("tituloFormularioProduto").textContent =
        "Adicionar novo produto";

    document.getElementById("botaoSalvarProduto").textContent =
        "Salvar produto";

    document.getElementById("botaoCancelarEdicao").style.display =
        "none";

    document.getElementById("precoPromocionalAdmin").disabled = true;

    if (secaoFormulario) {
        secaoFormulario.hidden = true;
    }
}


/* =====================================
   ALTERAR ESTOQUE
===================================== */

function alternarStatusProduto(id) {
    const produtos = obterProdutos();

    const produto = produtos.find(function(item) {
        return String(item.id) === String(id);
    });

    if (!produto) return;

    produto.esgotado = !produto.esgotado;

    if (salvarProdutos(produtos)) {
        renderizarProdutosAdmin();
    }
}


/* =====================================
   EXCLUIR PRODUTO
===================================== */

async function excluirProdutoAdmin(id) {
    const confirmar = await mostrarModalAdmin(
        "Excluir produto?",
        "Tem certeza de que deseja excluir este produto? Essa ação não poderá ser desfeita.",
        true
    );

    if (!confirmar) return;

    const produtos = obterProdutos().filter(function(produto) {
        return String(produto.id) !== String(id);
    });

    if (!salvarProdutos(produtos)) return;

    renderizarProdutosAdmin();

    if (document.getElementById("produtoId").value === String(id)) {
        cancelarEdicaoProduto();
    }

    mostrarModalAdmin(
        "Produto excluído",
        "O produto foi removido do catálogo."
    );
}


/* =====================================
   SAIR DO PAINEL
===================================== */

function sairAdministrador() {
    localStorage.removeItem("administradorLogado");
    window.location.href = "index.html";
}