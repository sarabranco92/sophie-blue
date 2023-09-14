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
          });
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
});
