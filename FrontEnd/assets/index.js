const galleryGrid = document.querySelector(".gallery");
const filterGrid = document.querySelector(".filters");

//* Get and display works *//

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
  const arrayWorks = await getWorks();
  arrayWorks.forEach((work) => {
    createWorks(work);
  });
}

displayWorks();

//* Categories *//

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

//* Category filters *//

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

//* Admin *//

const logged = window.sessionStorage.logged;
const logout = document.querySelector("header nav .logout");
const modalContainer = document.querySelector(".modal-container");

if (logged == "true") {
  //* Logged in *//
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

  //* Modal display *//

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

  //* Display works in modal *//
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
  }

  displayGalleryModal();

  //* Logged out *//  
  logout.addEventListener("click", () => {
    window.sessionStorage.logged = "false";
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("userId");
    window.location.href = "login.html";
  });
}