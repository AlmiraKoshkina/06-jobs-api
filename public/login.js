import {
  inputEnabled,
  setDiv,
  message,
  enableInput,
  setToken,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showUnits } from "./units.js";

let loginDiv = null;
let email = null;
let password = null;

export const handleLogin = () => {
  loginDiv = document.getElementById("login-div");
  email = document.getElementById("email");
  password = document.getElementById("password");

  const loginButton = document.getElementById("login-button");
  const cancelButton = document.getElementById("login-cancel");

  loginDiv.addEventListener("click", async (e) => {
    if (!inputEnabled || e.target.nodeName !== "BUTTON") return;

    if (e.target === loginButton) {
      enableInput(false);
      message.textContent = "";

      try {
        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });

        const data = await response.json();

        if (response.status === 200) {
          setToken(data.token);
          message.textContent = `Welcome back, ${data.user.name}`;
          showUnits();
        } else {
          message.textContent = data.msg || "Login failed.";
        }
      } catch (err) {
        console.error(err);
        message.textContent = "Login error.";
      } finally {
        enableInput(true);
      }
    }

    if (e.target === cancelButton) {
      showLoginRegister();
    }
  });
};

export const showLogin = () => {
  email.value = "";
  password.value = "";
  setDiv(loginDiv);
};
