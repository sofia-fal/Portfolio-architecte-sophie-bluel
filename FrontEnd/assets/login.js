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
    headers: { "Content-Type": "application/json" },
    body: user,
  })
    .then((response) => {
      if (!response.ok) {
        email.style.border = "2px solid #FF0000";
        password.style.border = "2px solid #FF0000";
        email.style.background = "rgba(255, 0, 0, 0.39)";
        password.style.background = "rgba(255, 0, 0, 0.39)";
        
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
      email.style.border = "";
      password.style.border = "";
      email.style.background = "";
      password.style.background = "";

      window.sessionStorage.setItem("logged", "true");
      window.sessionStorage.setItem("token", data.token);
      window.sessionStorage.setItem("userId", data.userId);
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Une erreur est survenue : ", error);
    });
});