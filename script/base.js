document.addEventListener("DOMContentLoaded", () => {
    let data; // Déclarez une variable pour stocker les données

    // Récupérez les données depuis le backend
    fetch("http://localhost:5678/api/works")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Échec de la récupération des données");
            }
            return response.json();
        })
        .then((responseData) => {
            data = responseData; // Stockez les données dans la variable data
            generationProjets(data, null); // Appelez la fonction pour générer les projets initiaux

            const tousBtn = document.querySelector(".tousBtn");
            tousBtn.addEventListener("click", () => generationProjets(data, null)); // Utilisez une fonction fléchée ici

            //  buttons 
            fetch("http://localhost:5678/api/categories")
                .then((resCategories) => {
                    return resCategories.json();
                })
                .then((dataCategories) => {
                    dataCategories.forEach((category) => {
                        const container = document.querySelector('.filters'); // Vous avez manqué un point ici
                        let btn = document.createElement("button");
                        btn.classList.add("btn");
                        btn.textContent = category.name;
                        btn.addEventListener("click", () => generationProjets(data, category.id)); // Utilisez une fonction fléchée ici
                        container.appendChild(btn);

                        const buttons = document.querySelectorAll('.btn, .tousBtn');

                        let selectedButton = null; // Variable pour stocker le bouton sélectionné

                        buttons.forEach((button) => {
                            button.addEventListener('click', () => {   // Ajoutez click à chaque bouton
                                if (selectedButton !== null) {
                                    selectedButton.classList.remove('active'); // Désélectionnez le bouton précédemment sélectionné
                                }

                                button.classList.add('active'); // Sélectionnez le bouton actuel

                                selectedButton = button; // Mettez à jour le bouton sélectionné
                            });
                        });
                    });

                    tousBtn.click(); // selected by default quand la page loads
                });
        });

    // Fonction pour générer les projets en fonction du filtre
    function generationProjets(data, id) {
        const galleryContainer = document.querySelector(".gallery");
        galleryContainer.innerHTML = ""; // Effacez la galerie existante

        if (id === null) {
            // Affichez tous les projets
            data.forEach((work) => {
                const figure = document.createElement("figure");
                const img = document.createElement("img");
                const figcaption = document.createElement("figcaption");

                img.src = work.imageUrl;
                img.alt = work.title;
                figcaption.textContent = work.title;

                figure.appendChild(img);
                figure.appendChild(figcaption);
                galleryContainer.appendChild(figure);
            });

        } else {
            // Affichez les projets filtrés
            const filteredData = data.filter((work) => work.categoryId === id);
            filteredData.forEach((work) => {
                const figure = document.createElement("figure");
                const img = document.createElement("img");
                const figcaption = document.createElement("figcaption");

                img.src = work.imageUrl;
                img.alt = work.title;
                figcaption.textContent = work.title;

                figure.appendChild(img);
                figure.appendChild(figcaption);
                galleryContainer.appendChild(figure);
            });
        }
    }


    /* ................................Admin...............................*/

    function adminPanel() {
        const alreadyLogged = document.querySelector(".already-logged");
        const token = sessionStorage.getItem("Token");

        if (token) {

            console.log("Token exists in sessionStorage:", token);
            console.log("User is logged in.");

            const adminElements = document.querySelectorAll(".admin__modifier");

            adminElements.forEach((element) => {
                element.removeAttribute("aria-hidden");
                element.removeAttribute("style");
            });

            alreadyLogged.innerHTML = "logout";

            alreadyLogged.addEventListener("click", () => {
                sessionStorage.removeItem("Token");
                // Redirect the user back to index.html
                window.location.href = "index.html";
            });

            const filterappear = document.querySelectorAll(".filters");
            filterappear.forEach((button) => {
                button.style.display = "none";
            });
        } else {
            // Token is not found in sessionStorage
            console.log("Token is not found in sessionStorage.");
            console.log("User is not logged in.");
        }
    }

    adminPanel();

    /* ................................MODAL...............................*/

    const openModal = function (e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));

        target.style.display = null;
        target.removeAttribute('aria-hidden');
        target.removeAttribute('aria-modal', 'true');
    }

    document.querySelectorAll(".js-modal").forEach(a => {
        a.addEventListener('click', openModal);
    });

    fetch("http://localhost:5678/api/works")
        .then((response) => {
            return response.json();
        })
        .then((responseData) => {
            data = responseData; // Stockez les données dans la variable data
            ModalProjets(data, null); // Appelez la fonction pour générer les projets initiaux
        });

    function ModalProjets(data, id) {
        const galleryModal = document.querySelector(".admin-projets");
        galleryModal.innerHTML = ""; // Effacez la galerie existante

        if (id === null) {
            // Affichez tous les projets
            data.forEach((work) => {
                const figure = document.createElement("figure");
                const img = document.createElement("img");
                const deleteIcon = document.createElement("span");

                img.src = work.imageUrl;
                img.alt = work.title;

                deleteIcon.classList.add("fa", "fa-trash");
                deleteIcon.dataset.workId = work.id;

                deleteIcon.addEventListener("click", (event) => {
                    event.preventDefault(); // Prevent the default behavior
                    const workId = event.currentTarget.dataset.workId;
                    const token = sessionStorage.getItem("Token");

                    fetch(`http://localhost:5678/api/works/${workId}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 204) {
                                // Successfully deleted, so remove the deleted project from the modal
                                const deletedProject = galleryModal.querySelector(`[data-work-id="${workId}"]`);
                                if (deletedProject) {
                                    deletedProject.remove();
                                }

                                // Fetch the updated list of projects and refresh the modal
                                fetch("http://localhost:5678/api/works")
                                    .then((response) => response.json())
                                    .then((responseData) => {
                                        data = responseData;
                                        ModalProjets(data, null); // Refresh the modal with the same filter (or null)
                                    })
                                    .catch((error) => {
                                        console.error("Error fetching updated data:", error);
                                    });
                            } else if (response.status === 401) {
                                console.error("Vous n'êtes pas autorisé.");
                            } else {
                                console.error("Échec de la suppression de l'image.");
                            }
                        });
                });

                figure.appendChild(deleteIcon);
                figure.appendChild(img);
                galleryModal.appendChild(figure);
            });
        }
    }

    /* ................................MODAL 2...............................*/

    const openModal2 = function (e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));

        target.style.display = null;
        target.removeAttribute('aria-hidden');
        target.removeAttribute('aria-modal', 'true');
    };

    document.querySelectorAll(".ajouter-projet").forEach(a => {
        a.addEventListener('click', openModal2);
    });

    const btnAjouterProjet = document.querySelector(".add-work");
    btnAjouterProjet.addEventListener("click", ajouterProjet);

    // Add an event listener to the "ajouter photo" button to clear the success message
    document.getElementById("imageLabel").addEventListener("click", () => {
        document.querySelector(".error-message").textContent = "";
    });

        const modalReturnButton = document.querySelector("#modal2 .modal-return");
        modalReturnButton.addEventListener("click", (e) => {
            e.preventDefault();
            const modal2 = document.querySelector("#modal2");
            const modal1 = document.querySelector("#modal1");

            // Hide modal2
            modal2.style.display = "none";
            modal2.setAttribute("aria-hidden", "true");

            // Show modal1
            modal1.style.display = null;
            modal1.removeAttribute("aria-hidden");
            modal1.removeAttribute("aria-modal", "true");

            // Refresh modal1
            fetch("http://localhost:5678/api/works")
                .then((response) => response.json())
                .then((responseData) => {
                    data = responseData;
                    ModalProjets(data, null);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        });

        const imagePreview = document.querySelector('.js-image-preview');
        const fileInput = document.querySelector('.js-image');
        const imageIcon = document.querySelector('#imageIcon');
        const imageLabel = document.querySelector('#imageLabel');
        const imageContent = document.querySelector('.form-photo');

        imagePreview.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    imageIcon.style.display = 'none';
                    imageLabel.style.display = 'none';
                    imageContent.classList.add('image-selected');
                };

                reader.readAsDataURL(file);
                imageLabel.style.display = 'none';
            } else {
                imagePreview.style.display = 'none';
                imageIcon.style.display = 'block';
                imageLabel.style.display = 'block';
                imageContent.classList.remove('image-selected');
            }
        });

        const form = document.getElementById("modal-form");
        const submitButton = document.getElementById("submit");

        // Function to check if all required fields are filled
        function isFormValid() {
            const requiredFields = form.querySelectorAll("[required]");
            return [...requiredFields].every(field => field.value.trim() !== "");
        }

        // Function to update button color based on form validity
        function updateButtonColor() {
            submitButton.style.backgroundColor = isFormValid() ? "#1D6154" : "#A7A7A7";
        }

        // Listen for input events on the form fields
        form.addEventListener("input", updateButtonColor);

        // Initial button color check
        updateButtonColor();

        function ajouterProjet(event) {
            event.preventDefault();

            const title = document.querySelector(".js-title").value;
            const categoryId = document.querySelector(".js-categoryId").value;
            const image = document.querySelector(".js-image").files[0];
            const errorMessage = document.querySelector(".error-message");

            if (!title || !categoryId || !image) {
                errorMessage.textContent = "Veuillez remplir tous les champs";
                return;
            }

            if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") {
                errorMessage.textContent = "Choisissez une catégorie valide";
                return;
            }

            errorMessage.textContent = "";

            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", categoryId);
            formData.append("image", image);

            const token = sessionStorage.getItem("Token");

            fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })
                .then((response) => {
                    if (response.status === 201) {
                        errorMessage.textContent = "Projet ajouté avec succès";

                        // Refresh modal1 with the new image
                        fetch("http://localhost:5678/api/works")
                            .then((response) => response.json())
                            .then((responseData) => {
                                data = responseData;
                                ModalProjets(data, null);
                            })
                            .catch((error) => {
                                console.error("Error fetching data:", error);
                            });

                        // Reset the form fields
                        document.querySelector(".js-title").value = "";
                        document.querySelector(".js-categoryId").value = "";
                        document.querySelector(".js-image").value = null;
                        document.querySelector("#imagePreview").src = "";
                        document.querySelector("#imagePreview").style.display = "none";
                        document.querySelector("#imageIcon").style.display = "block";
                        document.querySelector("#imageLabel").textContent = "+ Ajouter photo";
                        document.querySelector("#imageLabel").style.display = 'block';



                        updateButtonColor();
                    } else if (response.status === 400) {
                        errorMessage.textContent = "Veuillez remplir tous les champs";
                    } else if (response.status === 500) {
                        errorMessage.textContent = "Erreur de serveur";
                    } else if (response.status === 401) {
                        errorMessage.textContent = "Vous n'êtes pas autorisé à ajouter un projet";
                        window.location.href = "login.html";
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de l'ajout du projet:", error);
                });
        }
    });
