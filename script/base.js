// Exécute le code lorsque le DOM (Document Object Model) est complètement chargé
document.addEventListener("DOMContentLoaded", () => {

    let data; // Déclare une variable pour stocker les données des projets
    let tousBtn;
  
    // Fonction pour récupérer les données des projets depuis le serveur
    function fetchProjects() {
      fetch("http://localhost:5678/api/works")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Échec de la récupération des données");
          }
          return response.json();
        })
        .then((responseData) => {
          data = responseData;
          generationProjets(data, null); // Appelle la fonction pour générer les projets
          ModalProjets(data, null); // Appelle la fonction pour générer les projets dans la modal
  
          const tousBtn = document.querySelector(".tousBtn");
          tousBtn.addEventListener("click", () => generationProjets(data, null)); // Utilise une fonction fléchée ici
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données :", error);
        });
    }
  
    // Fonction pour récupérer les catégories de projets
    function fetchCategories() {
      fetch("http://localhost:5678/api/categories")
        .then((resCategories) => {
          return resCategories.json();
        })
        .then((dataCategories) => {
          // Génère des boutons de filtre pour chaque catégorie
          dataCategories.forEach((category) => {
            const container = document.querySelector('.filters');
            let btn = document.createElement("button");
            btn.classList.add("btn");
            btn.textContent = category.name;
            btn.addEventListener("click", () => generationProjets(data, category.id)); // Utilise une fonction fléchée ici
            container.appendChild(btn);
  
            const buttons = document.querySelectorAll('.btn, .tousBtn');
  
            let selectedButton = null; // Variable pour stocker le bouton sélectionné
  
            // Ajoute des gestionnaires d'événements pour les boutons de filtre
            buttons.forEach((button) => {
              button.addEventListener('click', () => {
                if (selectedButton !== null) {
                  selectedButton.classList.remove('active');
                }
                button.classList.add('active');
                selectedButton = button;
              });
            });
          });
  
          if (tousBtn) {
            tousBtn.click(); // Sélectionne par défaut lorsque la page se charge
          }
          fetchProjects();
        });
    }
  
    // Fonction pour mettre à jour la galerie dans la modal
    function updateModalGallery() {
      fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then((responseData) => {
          data = responseData;
          ModalProjets(data, null); // Appelle la fonction pour générer les projets dans la modal
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour des données :", error);
        });
    }
  
    // Fonction pour générer les projets en fonction du filtre
    function generationProjets(data, id) {
      const galleryContainer = document.querySelector(".gallery");
      galleryContainer.innerHTML = ""; // Efface la galerie existante
  
      if (id === null) {
        // Affiche tous les projets
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
        // Affiche les projets filtrés par catégorie
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
  
    // Fonction pour gérer l'interface d'administration
    function adminPanel() {
      const alreadyLogged = document.querySelector(".already-logged");
      const token = sessionStorage.getItem("Token");
  
      if (token) {
        // L'utilisateur est connecté en tant qu'administrateur
        console.log("Token existe dans sessionStorage :", token);
        console.log("L'utilisateur est connecté.");
  
        const adminElements = document.querySelectorAll(".admin__modifier");
  
        adminElements.forEach((element) => {
          element.removeAttribute("aria-hidden");
          element.removeAttribute("style");
        });
  
        alreadyLogged.innerHTML = "logout";
  
        alreadyLogged.addEventListener("click", () => {
          // Déconnexion de l'utilisateur
          sessionStorage.removeItem("Token");
          // Redirection de l'utilisateur vers index.html
          window.location.href = "index.html";
        });
  
        const filterappear = document.querySelectorAll(".filters");
        filterappear.forEach((button) => {
          button.style.display = "none";
        });
      } else {
        // Le jeton n'est pas trouvé dans sessionStorage
        console.log("Token n'est pas trouvé dans sessionStorage.");
        console.log("L'utilisateur n'est pas connecté.");
      }
    }
  
    adminPanel(); // Appelle la fonction d'administration pour gérer l'interface
  
    // Fonction pour ouvrir la modal
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
  
    fetchProjects()
  
    // Fonction pour générer les projets dans la modal
    function ModalProjets(data, id) {
      const galleryModal = document.querySelector(".admin-projets");
      galleryModal.innerHTML = ""; // Efface la galerie existante
  
      if (id === null) {
        // Affiche tous les projets dans la modal
        data.forEach((work) => {
          const figure = document.createElement("figure");
          const img = document.createElement("img");
          const deleteIcon = document.createElement("span");
  
          img.src = work.imageUrl;
          img.alt = work.title;
  
          deleteIcon.classList.add("fa", "fa-trash");
          deleteIcon.dataset.workId = work.id;
  
          deleteIcon.addEventListener("click", (event) => {
            event.preventDefault(); // Empêche le comportement par défaut
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
                  // Supprimé avec succès, donc retirez le projet supprimé de la modal
                  const deletedProject = galleryModal.querySelector(`[data-work-id="${workId}"]`);
                  if (deletedProject) {
                    deletedProject.remove();
                  }
  
                  // Obtenez la liste mise à jour des projets et rafraîchissez la modal
                  fetchProjects()
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
  
    // Fonction pour ouvrir la deuxième modal
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
  
    // Ajoutez un gestionnaire d'événements au bouton "ajouter photo" pour effacer le message de succès
    document.getElementById("imageLabel").addEventListener("click", () => {
      document.querySelector(".error-message").textContent = "";
    });
  
    const modalReturnButton = document.querySelector("#modal2 .modal-return");
    modalReturnButton.addEventListener("click", (e) => {
      e.preventDefault();
      const modal2 = document.querySelector("#modal2");
      const modal1 = document.querySelector("#modal1");
  
      // Masquez la modal2
      modal2.style.display = "none";
      modal2.setAttribute("aria-hidden", "true");
  
      // Affichez la modal1
      modal1.style.display = null;
      modal1.removeAttribute("aria-hidden");
      modal1.removeAttribute("aria-modal", "true");
  
      // Rafraîchissez la modal1
      fetchProjects();
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
  
    // Fonction pour vérifier si tous les champs obligatoires sont remplis
    function isFormValid() {
      const requiredFields = form.querySelectorAll("[required]");
      return [...requiredFields].every(field => field.value.trim() !== "");
    }
  
    // Fonction pour mettre à jour la couleur du bouton en fonction de la validité du formulaire
    function updateButtonColor() {
      submitButton.style.backgroundColor = isFormValid() ? "#1D6154" : "#A7A7A7";
    }
  
    // Écoutez les événements d'entrée sur les champs du formulaire
    form.addEventListener("input", updateButtonColor);
  
    // Vérifiez la couleur initiale du bouton
    updateButtonColor();
  
    // Fonction pour ajouter un nouveau projet
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
  
            // Rafraîchissez la modal1 avec la nouvelle image
            fetchProjects();
  
            // Réinitialisez les champs du formulaire
            document.querySelector(".js-title").value = "";
            document.querySelector(".js-categoryId").value = "";
            document.querySelector(".js-image").value = null;
            document.querySelector("#imagePreview").src = "";
            document.querySelector("#imagePreview").style.display = "none";
            document.querySelector("#imageIcon").style.display = "block";
            document.querySelector("#imageLabel").textContent = "+ Ajouter photo";
            document.querySelector("#imageLabel").style.display = 'block';
  
            // Mettez à jour la couleur du bouton
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
          console.error("Erreur lors de l'ajout du projet :", error);
        });
    }
  
    document.getElementById('modal1').addEventListener('click', (e) => {
      if (e.target.id === 'modal1') {
        e.currentTarget.style.display = 'none';
        e.currentTarget.setAttribute('aria-hidden', 'true');
      }
    });
  
    // Ajoutez un gestionnaire d'événements pour fermer la modal2 lorsque vous cliquez à l'extérieur
    document.getElementById('modal2').addEventListener('click', (e) => {
      if (e.target.id === 'modal1' || e.target.id === 'modal2') {
        e.target.style.display = 'none';
        document.getElementById('modal1').style.display = 'none';
        e.target.setAttribute('aria-hidden', 'true');
      }
    });
  
    fetchCategories();
    adminPanel();
    updateModalGallery()
    fetchProjects()
  
  });
  
