import {
  setDiv,
  token,
  enableInput,
  inputEnabled,
  unitsMessage,
  message,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";
import { setToken } from "./index.js";

let unitsDiv = null;
let unitsTable = null;
let unitsTableHeader = null;

export const handleUnits = () => {
  unitsDiv = document.getElementById("units");
  unitsTable = document.getElementById("units-table");
  unitsTableHeader = document.getElementById("units-table-header");

  const logoffButton = document.getElementById("logoff");
  const addButton = document.getElementById("add-unit");

  unitsDiv.addEventListener("click", async (e) => {
    if (!inputEnabled) return;

    // LOG OFF
    if (e.target === logoffButton) {
      setToken(null); // clear JWT
      message.textContent = "You have been logged out.";
      showLoginRegister();
      return;
    }

    // ADD
    if (e.target === addButton) {
      showAddEdit();
      return;
    }

    // EDIT
    if (e.target.classList.contains("editButton")) {
      const unitId = e.target.dataset.id;
      showAddEdit(unitId);
      return;
    }

    // DELETE
    if (e.target.classList.contains("deleteButton")) {
      const unitId = e.target.dataset.id;

      if (!confirm("Delete this learning unit?")) return;

      try {
        enableInput(false);

        const response = await fetch(`/api/v1/learning-units/${unitId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.status === 200) {
          message.textContent = "Learning unit deleted.";
          showUnits();
        } else {
          message.textContent = data.msg || "Failed to delete learning unit.";
        }
      } catch (err) {
        console.error(err);
        message.textContent = "Error deleting learning unit.";
      } finally {
        enableInput(true);
      }
    }
  });
};

export const showUnits = async () => {
  setDiv(unitsDiv);
  unitsMessage.textContent = "";

  try {
    enableInput(false);

    const response = await fetch("/api/v1/learning-units", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    // clear table before populating
    unitsTable.replaceChildren(unitsTableHeader);

    if (response.status === 200) {
      if (data.count === 0) {
        unitsMessage.textContent = "No learning units yet.";
      } else {
        for (const unit of data.units) {
          const row = document.createElement("tr");

          row.innerHTML = `
            <td>${unit.title}</td>
            <td>${unit.progress}</td>
            <td>
              <button
                type="button"
                class="editButton"
                data-id="${unit._id}"
              >
                Edit
              </button>
            </td>
            <td>
              <button
                type="button"
                class="deleteButton"
                data-id="${unit._id}"
              >
                Delete
              </button>
            </td>
          `;

          unitsTable.appendChild(row);
        }
      }
    } else {
      unitsMessage.textContent = data.msg || "Failed to load learning units.";
    }
  } catch (err) {
    console.error(err);
    unitsMessage.textContent = "Error loading learning units.";
  } finally {
    enableInput(true);
  }
};
