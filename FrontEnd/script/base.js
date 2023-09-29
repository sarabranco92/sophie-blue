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
            const img = document.createElement("img")
            const deleteIcon = document.createElement("span"); // Icône de suppression (peut-être une icône Font Awesome)

            img.src = work.imageUrl;
            img.alt = work.title;

            deleteIcon.classList.add("fa", "fa-trash");

            deleteIcon.dataset.workId = work.id;

            deleteIcon.addEventListener("click", (event) => {
                const workId = event.currentTarget.dataset.workId;
                const token = sessionStorage.getItem("Token");

                fetch(`http://localhost:5678/api/works/${workId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((response) => {
                        if (response.ok) {

                            ModalProjets(data, null);
                        } else {

                            console.error("Image deletion failed.");
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


 /* Modal 2 */
 const openModal2 = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));

    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.removeAttribute('aria-modal', 'true');
}

document.querySelectorAll(".ajouter-projet").forEach(a => {
    a.addEventListener('click', openModal2);
});

const btnAjouterProjet = document.querySelector(".add-work");
btnAjouterProjet.addEventListener("click", ajouterProjet);

// Add a project
function ajouterProjet(event) {
    event.preventDefault();
    

    const title = document.querySelector(".js-title").value;
    const categoryId = document.querySelector(".js-categoryId").value;
    const image = document.querySelector(".js-image").files[0]; 
    if (title === "" || categoryId === "" || image === undefined) {
        alert("Fill in all fields");
        return;
    } else if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") {
        alert("Choose a valid category");
        return;
    } else {
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
                    alert("Project added successfully");
                    ModalProjets(dataAdmin, null);
                    generationProjets(data, null);
                } else if (response.status === 400) {
                    alert("Please fill in all fields");
                } else if (response.status === 500) {
                    alert("Server error");
                } else if (response.status === 401) {
                    alert("You are not authorized to add a project");
                    window.location.href = "login.html";
                }
            })
            .catch((error) => {
                console.error("Error adding project:", error);
            });
    }
}
});