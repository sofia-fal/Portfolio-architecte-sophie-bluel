const galleryGrid = document.querySelector(".gallery");
const filterGrid = document.querySelector(".filters");

//* Get and display works *//

async function getWorks() {
  const works = await fetch("http://localhost:5678/api/works");
  return await works.json();
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
  const categories = await fetch("http://localhost:5678/api/categories");
  return await categories.json();
}

async function displayCategoriesBtn() {
  const categories = await getCategories();

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    filterGrid.appendChild(btn);
  });
}

displayCategoriesBtn();

//* Category filters *//

async function filterCategories() {
  const allFilters = await getWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      btnId = e.target.id;
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

filterCategories();

//* Admin *//

const logged = window.sessionStorage.logged;
const logout = document.querySelector("header nav .logout");
const modalContainter = document.querySelector(".modal-container");

if (logged == "true") {
  //* Logged in *//
  logout.textContent = "logout";
  filterGrid.style = "display: none";

  const adminBar = document.querySelector("#admin-bar");
  adminBar.style = "display: flex;";

  const headings = document.querySelector("#portfolio h2");

  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-file-pen");
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

  const modalContainter = document.querySelector(".modal-container");
  const close = document.querySelector(".modal-container .fa-xmark");

  iconWithText.addEventListener("click", () => {
    modalContainter.style.display = "flex";
});

close.addEventListener("click", () => {
  modalContainter.style.display = "none";
});

modalContainter.addEventListener("click", (e) => {
  if (e.target.className == "modal-container") {
    modalContainter.style.display = "none";
  }
});

//* Logged out *//  
  logout.addEventListener("click", () => {
    window.sessionStorage.logged = "false";
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("userId");
    window.location.href = "login.html";
  }); 
}