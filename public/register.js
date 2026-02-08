import {
  inputEnabled,
  setDiv,
  message,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showUnits } from "./units.js";

let registerDiv = null;
let name = null;
let email1 = null;
let password1 = null;
let password2 = null;

export const handleRegister = () => {
  registerDiv = document.getElementById("register-div");

  name = document.getElementById("name");
  email1 = document.getElementById("email1");
  password1 = document.getElementById("password1");
  password2 = document.getElementById("password2");

  const registerButton = document.getElementById("register-button");
  const cancelButton = document.getElementById("register-cancel");

  registerDiv.addEventListener("click", async (e) => {
    if (!inputEnabled || e.target.nodeName !== "BUTTON") return;

    if (e.target === registerButton) {
      if (password1.value !== password2.value) {
        message.textContent = "Passwords do not match.";
        return;
      }

      enableInput(false);
      message.textContent = "";

      try {
        const response = await fetch("/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.value,
            email: email1.value,
            password: password1.value,
          }),
        });

        const data = await response.json();

        if (response.status === 201) {
          setToken(data.token);
          message.textContent = `Welcome, ${data.user.name}`;
          showUnits();
        } else {
          message.textContent = data.msg || "Registration failed.";
        }
      } catch (err) {
        console.error(err);
        message.textContent = "Registration error.";
      } finally {
        enableInput(true);
      }
    }

    if (e.target === cancelButton) {
      showLoginRegister();
    }
  });
};

export const showRegister = () => {
  name.value = "";
  email1.value = "";
  password1.value = "";
  password2.value = "";
  setDiv(registerDiv);
};
