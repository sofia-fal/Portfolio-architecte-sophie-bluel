// Sélectionne le formulaire de connexion dans le document HTML
const form = document.querySelector("form");
// Sélectionne les champs de saisie pour l'email et le mot de passe
const email = document.getElementById("email");
const password = document.getElementById("password");

// Ajoute un écouteur d'événements pour l'événement 'submit' du formulaire
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Récupère les valeurs saisies dans les champs email et mot de passe
  const userEmail = email.value;
  const userPassword = password.value;

  // Crée un objet représentant les informations de connexion de l'utilisateur
  const login = {
    email: userEmail,
    password: userPassword,
  };
  // Convertit l'objet de connexion en une chaîne JSON
  const user = JSON.stringify(login);

  // Envoie une requête POST à l'API pour tenter de se connecter
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: user,
  })
    .then((response) => {
      if (!response.ok) {
        // Change l'apparence des champs email et mot de passe pour indiquer une erreur
        email.style.border = "2px solid #FF0000";
        password.style.border = "2px solid #FF0000";
        email.style.background = "rgba(255, 0, 0, 0.39)";
        password.style.background = "rgba(255, 0, 0, 0.39)";
        
        // Crée un élément pour afficher un message d'erreur
        let errorLogin = document.querySelector(".error-message");
        if (!errorLogin) {
          errorLogin = document.createElement("p");
          errorLogin.className = "error-message";
          errorLogin.style.color = "#FF0000";
          errorLogin.style = "text-align: center;";
          form.appendChild(errorLogin);
        }
        errorLogin.textContent = "Erreur dans l’identifiant ou le mot de passe.";
        
        throw new Error("Erreur dans l’identifiant ou le mot de passe.");
      }
      return response.json();
    })
    .then((data) => {
      // Réinitialise l'apparence des champs email et mot de passe
      email.style.border = "";
      password.style.border = "";
      email.style.background = "";
      password.style.background = "";

      // Stocke des informations dans le sessionStorage pour maintenir la session utilisateur
      window.sessionStorage.setItem("logged", "true");
      window.sessionStorage.setItem("token", data.token);
      window.sessionStorage.setItem("userId", data.userId);

      // Redirige l'utilisateur vers la page d'accueil
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Une erreur est survenue : ", error);
    });
});