const galleryGrid = document.querySelector(".gallery");
const filterGrid = document.querySelector(".filters");

async function getWorks() {
    const works = await fetch("http://localhost:5678/api/works");
    return await works.json();
}

async function displayWorks() {
    const arrayWorks = await getWorks();
    arrayWorks.forEach(element => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        img.src = element.imageUrl;
        figcaption.textContent = element.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        galleryGrid.appendChild(figure);
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

    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.id = category.id;
        filterGrid.appendChild(btn);
    });
}

displayCategoriesBtn();