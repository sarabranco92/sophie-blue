document.addEventListener("DOMContentLoaded", () => {
  let data; // Déclarez une variable pour stocker les données

  // Récupérez les données depuis le backend
  fetch("http://localhost:5678/api/works")
    .then(response => {
      if (!response.ok) {
        throw new Error("Échec de la récupération des données");
      }
      return response.json();
    })
    .then(responseData => {
      data = responseData; // Stock les données dans la variable data

      // Appelez la fonction pour générer les projets initiaux
      generationProjets(data, null);

      //EventListener sur les boutons de filtre
     // Créez les boutons de filtre

            const btnAll = document.createElement("button");
            btnAll.className = "filter__btn filter__btn-id-null";
            btnAll.textContent = "Tous";
          
            const btnId1 = document.createElement("button");
            btnId1.className = "filter__btn filter__btn-id-1";
            btnId1.textContent = "Objets";
          
            const btnId2 = document.createElement("button");
            btnId2.className = "filter__btn filter__btn-id-2";
            btnId2.textContent = "Appartements";
          
            const btnId3 = document.createElement("button");
            btnId3.className = "filter__btn filter__btn-id-3";
            btnId3.textContent = "Hôtels & restaurants";
          
            // Ajoutez les boutons de filtre à l'élément conteneur
            filterContainer.appendChild(btnAll);
            filterContainer.appendChild(btnId1);
            filterContainer.appendChild(btnId2);
            filterContainer.appendChild(btnId3);
    
    
    
    
    

      btnAll.addEventListener("click", () => { // Tous les projets
        generationProjets(data, null);
      });

      btnId1.addEventListener("click", () => { // Objets
        generationProjets(data, 1);
      });

      btnId2.addEventListener("click", () => { // Appartements
        generationProjets(data, 2);
      });

      btnId3.addEventListener("click", () => { // Hôtels & restaurants
        generationProjets(data, 3);
      });
    })
    .catch(error => console.log(error));

  // Fonction pour générer les projets en fonction du filtre
  function generationProjets(data, id) {
    const galleryContainer = document.querySelector(".gallery");
    galleryContainer.innerHTML = ''; // Effacez la galerie existante

    if (id === null) {
      // Affichez tous les projets
      data.forEach(work => {
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
      const filteredData = data.filter(work => work.categoryId === id);
      filteredData.forEach(work => {
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


