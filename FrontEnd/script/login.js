document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        password: document.querySelector("#password"),
        email: document.querySelector("#email"),
        submit: document.querySelector("#submit"),
        errorMessage: document.querySelector("#error-message"),
    };

    const API_URL = "http://localhost:5678/api/users/login";

    function displayErrorMessage(message) {
        elements.errorMessage.textContent = message;
        setTimeout(() => {
            elements.errorMessage.textContent = "";
        }, 3000);
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
            if (!response.ok) {
                throw new Error("Échec de la connexion");
            }
            return response.json();
        })
        .then((data) => {
            if (data.token) {
                sessionStorage.setItem("Token", data.token);
                sessionStorage.setItem("isConnected", JSON.stringify(true));
                window.location.replace("index.html");
            } else {
                displayErrorMessage("Erreur dans l'identifiant ou le mot de passe.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            displayErrorMessage("Une erreur s'est produite lors de la connexion.");
        });
    }

    elements.submit.addEventListener("click", (event) => {
        event.preventDefault();
        loginUser();
    });
});
