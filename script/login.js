document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM content loaded");
    const elements = {
        password: document.querySelector("#password"),
        email: document.querySelector("#email"),
        submit: document.querySelector("#submit"),
        errorMessage: document.querySelector("#error-message"),
    };

    const API_URL = "http://localhost:5678/api/users/login";

    function displayErrorMessage(message) {
        elements.errorMessage.textContent = message;
    }

    function loginUser() {
        const email = elements.email.value.trim();
        const password = elements.password.value.trim();

        if (!email || !password) {
            displayErrorMessage("Veuillez remplir tous les champs.");
            return;
        }

        fetch(API_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
        .then((response) => {
            if (response.status === 404) {
                displayErrorMessage("Utilisateur non trouvé.");
            } else if (response.status === 401) {
                errorMessage.textContent = "Ulilizateur pas pas autorisé";
            } else if (response.status === 400) {
                displayErrorMessage("Mot de passe incorrect.");
            } else if (response.ok) {
                return response.json();
            } else {
                throw new Error("Une erreur s'est produite lors de la connexion.");
            }
        })
        .then((data) => {
            if (data.token) {
                sessionStorage.setItem("Token", data.token);
                sessionStorage.setItem("isConnected", JSON.stringify(true));
                window.location.replace("index.html");
            }

            elements.email.value = "";
            elements.password.value = "";

        })
        .catch((error) => {
            console.error("Error:", error);
            displayErrorMessage("Une erreur s'est produite lors de la connexion.");
            elements.email.value = "";
            elements.password.value = "";
        });
    
    }

    elements.submit.addEventListener("click", (event) => {
        event.preventDefault();
        loginUser();
    });
});

