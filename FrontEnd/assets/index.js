const galleryGrid = document.querySelector(".gallery");

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
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