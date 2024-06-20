const galleryGrid = document.querySelector(".gallery");
const filterGrid = document.querySelector(".filters");

// Get and display works

async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Fetching works failed:', error);
    return [];
  }
}

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

async function displayWorks() {
  galleryGrid.innerHTML = "";
  const arrayWorks = await getWorks();
  arrayWorks.forEach((work) => {
    createWorks(work);
  });
}

displayWorks();

// Categories

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

async function displayCategoriesBtn() {
  const categories = await getCategories();
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    filterGrid.appendChild(btn);
  });

  const allBtn = document.createElement("button");
  allBtn.textContent = "Tous";
  allBtn.id = "0";
  filterGrid.insertBefore(allBtn, filterGrid.firstChild);

  filterCategories();
}

displayCategoriesBtn();

// Category filters

async function filterCategories() {
  const allFilters = await getWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const btnId = e.target.id;
      galleryGrid.innerHTML = "";
      if (btnId !== "0") {
        const filtering = allFilters.filter((works) => {
          return works.categoryId == btnId;
        });
        filtering.forEach((work) => {
          createWorks(work);
        });
      } else {
        displayWorks();
      }
    });
  });
}

// Admin

const logged = window.sessionStorage.logged;
const logout = document.querySelector("header nav .logout");
const modalContainer = document.querySelector(".modal-container");

if (logged == "true") {
  // Logged in
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

  // Modal display
  const close = document.querySelector(".modal-container .fa-xmark");

  iconWithText.addEventListener("click", () => {
    modalContainer.style.display = "flex";
  });

  close.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });

  modalContainer.addEventListener("click", (e) => {
    if (e.target.className == "modal-container") {
      modalContainer.style.display = "none";
    }
  });

  // Display works in modal
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

  // Delete works
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

     displayGalleryModal();
     displayWorks();
   } catch (error) {
     console.error(error);
   }
 }

  // Add works
const btnAdd = document.querySelector(".modal button");
const modalAddWorks = document.querySelector(".add-works-modal");
const modalDeleteWorks = document.querySelector(".modal");
const arrowBack = document.querySelector(".fa-arrow-left");
const closeAddModal = document.querySelector(".add-works-modal .fa-xmark");

function displayAddModal() {
  btnAdd.addEventListener("click", () => {
    modalAddWorks.style.display = "flex";
    modalDeleteWorks.style.display = "none";
  });
  arrowBack.addEventListener("click", () => {
    modalAddWorks.style.display = "none";
    modalDeleteWorks.style.display = "flex";
  });
  closeAddModal.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });
}

displayAddModal();

  // Image preview
  const previewImg = document.querySelector(".file-content img");
  const inputFile = document.querySelector(".file-content input");
  const labelFile = document.querySelector(".file-content label");
  const iconFile = document.querySelector(".file-content .fa-image");
  const paragraphFile = document.querySelector(".file-content p");

  // Category list select
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

   // Check field validity
  const form = document.querySelector(".add-works-modal form");  
  const title = document.querySelector(".add-works-modal #title");  
  const category = document.querySelector(".add-works-modal #category");
  const validateButton = document.querySelector(".add-works-modal button");

  function checkFields() {
    const isFileSelected = inputFile.files.length > 0;
    const isTitleFilled = title.value.trim() !== "";
    const isCategorySelected = category.value !== "";
  
    const allFieldsValid = isFileSelected && isTitleFilled && isCategorySelected;
  
    validateButton.disabled = !allFieldsValid;
    
    if (allFieldsValid) {
      validateButton.style.backgroundColor = '#1D6154';
    } else {
      validateButton.style.backgroundColor = '';
    }
  }

[inputFile, title, category].forEach(element => {
  element.addEventListener("change", checkFields);
  element.addEventListener("input", checkFields);
});

checkFields();

  // Input file
  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageSrc = e.target.result;
        previewImg.src = imageSrc;
        previewImg.style.display = "flex";
        labelFile.style.display = "none";
        iconFile.style.display = "none";
        paragraphFile.style.display = "none";
        checkFields();
      };
      reader.readAsDataURL(file);
    }
  });

  title.addEventListener("input", () => {
    checkFields();
  });

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

    // Add works
  async function addWorks() {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const token = window.sessionStorage.getItem("token");
      const formData = new FormData(form);
  
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
        displayGalleryModal();
        displayWorks();
        form.reset();
        modalDeleteWorks.style.display = "flex";
        modalAddWorks.style.display = "none";

        inputFile.value = "";
        previewImg.src = "";
        previewImg.style.display = "none";
        labelFile.style.display = "block";
        iconFile.style.display = "block";
        paragraphFile.style.display = "block";
      } catch (error) {
        console.error("Erreur:", error);
      }
    });
  }
  
  addWorks();

  // Logged out
  logout.addEventListener("click", () => {
    window.sessionStorage.logged = "false";
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("userId");
    window.location.href = "login.html";
  });
}