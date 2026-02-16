import { inputEnabled, enableInput, message, setDiv, token } from "./index.js";
import { showUnits } from "./units.js";

let addEditDiv = null;
let titleInput = null;
let progressSelect = null;
let saveButton = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-unit");
  titleInput = document.getElementById("title");
  progressSelect = document.getElementById("progress");
  saveButton = document.getElementById("save-unit");

  const cancelButton = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (!inputEnabled || e.target.nodeName !== "BUTTON") return;

    if (e.target === saveButton) {
      enableInput(false);
      message.textContent = "";

      let method = "POST";
      let url = "/api/v1/learning-units";

      if (addEditDiv.dataset.id) {
        method = "PATCH";
        url = `/api/v1/learning-units/${addEditDiv.dataset.id}`;
      }

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: titleInput.value,
            progress: progressSelect.value,
          }),
        });

        const data = await response.json();

        if (response.status === 200 || response.status === 201) {
          message.textContent =
            response.status === 200
              ? "Learning unit updated."
              : "Learning unit added.";

          addEditDiv.dataset.id = "";
          showUnits();
        } else {
          message.textContent = data.msg || "Failed to save learning unit.";
        }
      } catch (err) {
        console.error(err);
        message.textContent = "Error saving learning unit.";
      } finally {
        enableInput(true);
      }
    }

    if (e.target === cancelButton) {
      addEditDiv.dataset.id = "";
      showUnits();
    }
  });
};

export const showAddEdit = async (unitId = null) => {
  titleInput.value = "";
  progressSelect.value = "not_started";
  message.textContent = "";

  if (!unitId) {
    addEditDiv.dataset.id = "";
    setDiv(addEditDiv);
    return;
  }

  enableInput(false);

  try {
    const response = await fetch(`/api/v1/learning-units/${unitId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      titleInput.value = data.unit.title;
      progressSelect.value = data.unit.progress;
      addEditDiv.dataset.id = unitId;
      setDiv(addEditDiv);
    } else {
      message.textContent = "Learning unit not found.";
      showUnits();
    }
  } catch (err) {
    console.error(err);
    message.textContent = "Error loading learning unit.";
    showUnits();
  } finally {
    enableInput(true);
  }
};
