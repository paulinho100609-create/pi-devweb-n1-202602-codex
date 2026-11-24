/* =========================
   LOGIN DO ADMINISTRADOR
========================= */

document.addEventListener("DOMContentLoaded", function() {
    const formLogin = document.getElementById("formLogin");

    if (!formLogin) return;

    formLogin.addEventListener("submit", function(event) {
        const email = document.getElementById("emailLogin")
            .value.trim().toLowerCase();

        const senha = document.getElementById("senhaLogin").value;

        if (email === "admin@gmail.com" && senha === "essenzya123") {
            event.preventDefault();
            event.stopImmediatePropagation();

            localStorage.setItem("administradorLogado", "true");

            mostrarModal(
                "Acesso administrativo",
                "Bem-vindo ao painel de administração da Essenzya!",
                function() {
                    window.location.href = "produtos.html";
                }
            );
        }
    }, true);
});