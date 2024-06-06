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
