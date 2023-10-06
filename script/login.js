// Attend que le document HTML soit complètement chargé
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM content loaded");

    // Sélectionnez les éléments du formulaire et les éléments d'affichage des messages
    const elements = {
        password: document.querySelector("#password"),
        email: document.querySelector("#email"),
        submit: document.querySelector("#submit"),
        errorMessage: document.querySelector("#error-message"),
    };

    // URL de l'API pour la connexion de l'utilisateur
    const API_URL = "http://localhost:5678/api/users/login";

    // Fonction pour afficher un message d'erreur
    function displayErrorMessage(message) {
        elements.errorMessage.textContent = message;
    }

    // Fonction pour connecter l'utilisateur
    function loginUser() {
        const email = elements.email.value.trim();
        const password = elements.password.value.trim();

        // Vérifiez si les champs email et mot de passe sont vides
        if (!email || !password) {
            displayErrorMessage("Veuillez remplir tous les champs.");
            return;
        }

        // Effectuez une requête POST vers l'API de connexion
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
                errorMessage.textContent = "L'utilisateur n'est pas autorisé.";
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
                // Stockez le jeton de l'utilisateur dans sessionStorage
                sessionStorage.setItem("Token", data.token);
                sessionStorage.setItem("isConnected", JSON.stringify(true));
                // Redirigez l'utilisateur vers index.html
                window.location.replace("index.html");
            }

            // Réinitialisez les champs email et mot de passe
            elements.email.value = "";
            elements.password.value = "";

        })
        .catch((error) => {
            console.error("Error:", error);
            displayErrorMessage("Une erreur s'est produite lors de la connexion.");
            // Réinitialisez les champs email et mot de passe en cas d'erreur
            elements.email.value = "";
            elements.password.value = "";
        });
    
    }

    // Ajoutez un gestionnaire d'événements au bouton de soumission
    elements.submit.addEventListener("click", (event) => {
        event.preventDefault();
        loginUser();
    });
});
