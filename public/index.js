let activeDiv = null;

export const setDiv = (newDiv) => {
  if (newDiv !== activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};

export let token = null;
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
  } else {
    localStorage.removeItem("token");
  }
};

export let message = null;
export let unitsMessage = null;

import { showUnits, handleUnits } from "./units.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleRegister } from "./register.js";
import { handleAddEdit } from "./addEdit.js";

document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");

  message = document.getElementById("message");
  unitsMessage = document.getElementById("units-message");

  handleLoginRegister();
  handleLogin();
  handleRegister();
  handleUnits();
  handleAddEdit();

  if (token) {
    showUnits();
  } else {
    showLoginRegister();
  }
});
