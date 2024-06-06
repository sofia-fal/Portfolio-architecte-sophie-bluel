const form = document.querySelector("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userEmail = email.value;
  const userPassword = password.value;
  const login = {
    email: userEmail,
    password: userPassword,
  };
  const user = JSON.stringify(login);

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: user,
  })
    .then((response) => {
      if (!response.ok) {
        email.style.border = "2px solid #FF0000";
        password.style.border = "2px solid #FF0000";
        email.style.background = "rgba(255, 0, 0, 0.39)";
        password.style.background = "rgba(255, 0, 0, 0.39)";
        const errorLogin = document.querySelector("p");
        errorLogin.textContent =
          "Le mot de passe ou l'identifiant est incorrect.";
        throw new Error("Le mot de passe ou l'identifiant est incorrect.");
      }
      return response.json();
    })
    .then((data) => {
      const userId = data.userId;
      const userToken = data.token;
      window.sessionStorage.setItem("token", userToken);
      window.sessionStorage.setItem("userId", userId);
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Une erreur est survenue : ", error);
    });
});