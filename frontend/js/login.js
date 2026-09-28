document.addEventListener("DOMContentLoaded", function () {
    if (getToken()) {
        window.location.href = "inventario.html";
        return;
    }

    const form = document.getElementById("loginForm");
    const errorBox = document.getElementById("loginError");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        errorBox.classList.add("d-none");

        try {
            const data = await api("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    username: document.getElementById("username").value.trim(),
                    password: document.getElementById("password").value
                })
            });

            saveSession(data.token, data.user);
            window.location.href = "inventario.html";
        } catch (error) {
            errorBox.textContent = error.message;
            errorBox.classList.remove("d-none");
        }
    });
});
