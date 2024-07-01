// Sélectionne les éléments HTML pour la galerie et les filtres
const galleryGrid = document.querySelector(".gallery");
const filterGrid = document.querySelector(".filters");

// Fetch et affichage des travaux

// Fonction asynchrone pour récupérer et afficher les travaux
async function getWorks() {
  try {
    // Effectue une requête pour obtenir les travaux depuis l'API
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) throw new Error('Network response was not ok');
    // Retourne les données des œuvres en format JSON
    return await response.json();
  } catch (error) {
    console.error('Fetching works failed:', error);
    // En cas d'erreur, retourne un tableau vide
    return [];
  }
}

// Crée et ajoute un travail à galleryGrid
function createWorks(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = work.imageUrl;
  figcaption.textContent = work.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  galleryGrid.appendChild(figure);
}

// Affiche tous les travaux générés dans la galerie
async function displayWorks() {
  galleryGrid.innerHTML = ""; // Vide la galerie actuelle
  const arrayWorks = await getWorks(); // Récupère les travaux via la fonction getWorks
  arrayWorks.forEach((work) => {
    createWorks(work); // Crée et ajoute chaque œuvre à la galerie
  });
}

// Appelle la fonction pour afficher les travaux dès le chargement du script
displayWorks();

// Catégories

// Fonction asynchrone pour récupérer les catégories
async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Fetching categories failed:', error);
    return [];
  }
}

// Affiche les boutons de catégories pour filtrer les travaux
async function displayCategoriesBtn() {
  const categories = await getCategories();
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    filterGrid.appendChild(btn);
  });
  // Ajoute un bouton pour afficher toutes les œuvres
  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.id = "0";
  filterGrid.insertBefore(allBtn, filterGrid.firstChild);
  // Active les filtres de catégories
  filterCategories();
}

displayCategoriesBtn();

// Filtrer les travaux par catégories
async function filterCategories() {
  const allFilters = await getWorks(); // Récupération des travaux
  const buttons = document.querySelectorAll(".filters button"); // Sélectionne tous les boutons de filtre
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const btnId = e.target.id; // Récupère l'ID du bouton cliqué
      galleryGrid.innerHTML = ""; // Vide la galerie actuelle
      if (btnId !== "0") {
        // Filtre les travaux par catégorie
        const filtering = allFilters.filter((works) => {
          return works.categoryId == btnId;
        });
        // Affiche les travaux filtrés
        filtering.forEach((work) => {
          createWorks(work);
        });
      } else {
        // Affiche tous les travaux si le bouton "Tous" est cliqué
        displayWorks();
      }
    });
  });
}

// Mode admin

// Vérifie si l'utilisateur est connecté
const logged = window.sessionStorage.logged;
const logout = document.querySelector("header nav .logout");
const modalContainer = document.querySelector(".modal-container");

if (logged == "true") {
  // Si l'utilisateur est connecté
  logout.textContent = "logout";
  filterGrid.style.display = "none";

  const adminBar = document.querySelector("#admin-bar");
  adminBar.style.display = "flex";

  const headings = document.querySelector("#portfolio h2");

  const icon = document.createElement("i");
  icon.classList.add("fa-regular", "fa-pen-to-square");
  icon.style.marginLeft = "25px";
  icon.style.marginRight = "10px";
  const iconWithText = document.createElement("span");
  const modifyText = document.createTextNode("modifier");

  iconWithText.appendChild(icon);
  iconWithText.appendChild(modifyText);
  
  iconWithText.style.fontFamily = "Work Sans";
  iconWithText.style.color = "black";
  iconWithText.style.fontSize = "14px";
  iconWithText.style.cursor = "pointer";

  headings.appendChild(iconWithText);

  // Affichage de la modale
  const close = document.querySelector(".modal-container .fa-xmark");

  iconWithText.addEventListener("click", () => {
    modalContainer.style.display = "flex";
    removePreviewImage(); // Réinitialisation du formulaire
  });

  close.addEventListener("click", () => {
    modalContainer.style.display = "none";
    removePreviewImage();
  });

  modalContainer.addEventListener("click", (e) => {
    if (e.target.className == "modal-container") {
      modalContainer.style.display = "none";
      removePreviewImage();
    }
  });

  // Affiche les travaux dans la modale
  const galleryModal = document.querySelector(".gallery-figure");

  async function displayGalleryModal() {
    galleryModal.innerHTML = ""
    const gallery = await getWorks()
    gallery.forEach(work => {
      const figure = document.createElement("figure")
      const img = document.createElement("img")
      const span = document.createElement("span")
      const trash = document.createElement("i")
      trash.classList.add("fa-solid", "fa-trash-can")
      trash.id = work.id
      img.src = work.imageUrl
      span.appendChild(trash)
      figure.appendChild(span)
      figure.appendChild(img)
      galleryModal.appendChild(figure)
    });
    attachDeleteListeners();
  }
  
  displayGalleryModal();

 // Attache des écouteurs d'événements pour supprimer les travaux
function attachDeleteListeners() {
   const trashcans = document.querySelectorAll(".fa-trash-can");
   const token = window.sessionStorage.getItem("token");
 
   trashcans.forEach(trash => {
     trash.addEventListener("click", (e) => {
       e.preventDefault();
       const id = trash.id;
       deleteWork(id, token);
     });
   });
  }

// Fonction pour supprimer un travail
async function deleteWork(id, token) {
   try {
     const response = await fetch(`http://localhost:5678/api/works/${id}`, {
       method: "DELETE",
       headers: {
         Authorization: `Bearer ${token}`,
         "Content-Type": "application/json",
       },
       mode: "cors",
       credentials: "same-origin",
     });
     if (!response.ok) throw new Error('Failed to delete the work');

      // Met à jour les galeries après la suppression
     displayGalleryModal();
     displayWorks();
   } catch (error) {
     console.error(error);
   }
 }

  // Modale pour ajouter des travaux
const btnAdd = document.querySelector(".modal button");
const modalAddWorks = document.querySelector(".add-works-modal");
const modalDeleteWorks = document.querySelector(".modal");
const arrowBack = document.querySelector(".fa-arrow-left");
const closeAddModal = document.querySelector(".add-works-modal .fa-xmark");

function displayAddModal() {
  btnAdd.addEventListener("click", () => {
    modalAddWorks.style.display = "flex";
    modalDeleteWorks.style.display = "none";
    title.value = "";
    category.value = "";
    removePreviewImage();
  });
  arrowBack.addEventListener("click", () => {
    modalAddWorks.style.display = "none";
    modalDeleteWorks.style.display = "flex";
    title.value = "";
    category.value = "";
    removePreviewImage();
  });
  closeAddModal.addEventListener("click", () => {
    modalContainer.style.display = "none";
    title.value = "";
    category.value = "";
    removePreviewImage();
  });
}

displayAddModal();

  // Prévisualisation de l'image ajoutée
  const previewImg = document.querySelector(".file-content img");
  const inputFile = document.querySelector(".file-content input");
  const labelFile = document.querySelector(".file-content label");
  const iconFile = document.querySelector(".file-content .fa-image");
  const paragraphFile = document.querySelector(".file-content p");

  // Affiche les catégories dans la modale d'ajout de travail
  async function displayCategoryModal() {
    const select = document.querySelector(".add-works-modal select");
    const categories = await getCategories();
    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
  }
  
  displayCategoryModal();

  // Vérifie la validité des champs du formulaire
  const form = document.querySelector(".add-works-modal form");  
  const title = document.querySelector(".add-works-modal #title");  
  const category = document.querySelector(".add-works-modal #category");
  const validateButton = document.querySelector(".add-works-modal button");
  const errorMessage = document.querySelector(".error-message");

// Fonction pour vérifier la validité des champs du formulaire
function checkFields() {
  const isFileSelected = inputFile.files.length > 0; // Vérifie si un fichier est sélectionné
  
  const titleRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{3,}$/; // Regex pour valider le titre
  const isTitleValid = titleRegex.test(title.value.trim()); // Vérifie si le titre est valide
  
  const isTitleFilled = title.value.trim() !== "" && isTitleValid; // Vérifie si le titre est rempli et valide
  const isCategorySelected = category.value !== ""; // Vérifie si une catégorie est sélectionnée
  
  const allFieldsValid = isFileSelected && isTitleFilled && isCategorySelected; // Vérifie si tous les champs sont valides

  validateButton.disabled = !allFieldsValid; // Active/désactive le bouton Valider
  
  if (allFieldsValid) {
    validateButton.style.backgroundColor = '#1D6154'; // Change la couleur du bouton si tous les champs sont valides
    errorMessage.style.display = "none"; // Cache le message d'erreur
  } else {
    validateButton.style.backgroundColor = ''; // Réinitialise la couleur du bouton
  }
}

// Ajoute des écouteurs d'événements pour vérifier les champs à chaque changement ou saisie
[inputFile, title, category].forEach(element => {
  element.addEventListener("change", checkFields);
  element.addEventListener("input", checkFields);
});

checkFields();

// Empêche la soumission du formulaire si les champs ne sont pas valides
validateButton.addEventListener("click", (e) => {
  if (validateButton.disabled) {
    e.preventDefault();
    errorMessage.style.display = "block"; // Affiche le message d'erreur
  }
});

  // Gère l'affichage de la prévisualisation de l'image sélectionnée
  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageSrc = e.target.result;
        previewImg.src = imageSrc; // Affiche l'image sélectionnée
        previewImg.style.display = "flex";
        labelFile.style.display = "none";
        iconFile.style.display = "none";
        paragraphFile.style.display = "none";
        checkFields();
      };
      reader.readAsDataURL(file);
    }
  });

  // Vérifie les champs à chaque saisie dans le titre
  title.addEventListener("input", () => {
    checkFields();
  });

  // Charge les données sauvegardées pour préremplir les champs du formulaire
  async function loadSavedData() {
    const works = await getWorks();
    if (works.length > 0) {
      const lastWork = works[works.length - 1];
      if (lastWork.imageUrl) {
        previewImg.src = lastWork.imageUrl;
        previewImg.style.display = "flex";
        labelFile.style.display = "none";
        iconFile.style.display = "none";
        paragraphFile.style.display = "none";
      }
      if (lastWork.title) {
        title.value = lastWork.title;
        title.dataset.loaded = true;
      }
    }
    checkFields();
  }
    loadSavedData();

    // Fonction pour réinitialiser l'affichage de la prévisualisation de l'image
    function removePreviewImage() {
      inputFile.value = "";
      previewImg.src = "";
      previewImg.style.display = "none";
      labelFile.style.display = "block";
      iconFile.style.display = "block";
      paragraphFile.style.display = "block";
    }
           
    // Fonction de soumission d'un travail
  async function addWorks() {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const token = window.sessionStorage.getItem("token");
      const formData = new FormData(form); // Crée un objet FormData avec les données du formulaire
  
      try {
        const response = await fetch(`http://localhost:5678/api/works`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to upload work");
        }
  
        const data = await response.json();
        console.log("Successfully uploaded work:", data);
        displayGalleryModal(); // Met à jour la galerie dans la modale
        displayWorks(); // Met à jour la galerie principale
        form.reset(); // Réinitialise le formulaire
        removePreviewImage(); // Réinitialise la prévisualisation de l'image
      } catch (error) {
        console.error("Erreur:", error);
      }
    });
  }
  
  addWorks();

  // Gère la déconnexion de l'utilisateur
  logout.addEventListener("click", () => {
    window.sessionStorage.logged = "false"; // Change l'état de connexion
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("userId");
    window.location.href = "login.html"; // Redirige vers la page de connexion
  });
}