/* PRAGATI SMART DASHBOARD STUDIO
   Interactive Dashboard Engine
*/

document.addEventListener("DOMContentLoaded", () => {

  // -----------------------------
  // 1. EDIT MODE BUTTON
  // -----------------------------
  const editButton = document.createElement("button");

  editButton.textContent = "⚙️ EDIT MODE";
  editButton.id = "dashboardEditButton";

  Object.assign(editButton.style, {
    position: "fixed",
    right: "18px",
    bottom: "18px",
    zIndex: "99999",
    padding: "12px 18px",
    borderRadius: "12px",
    border: "1px solid #22d3ee",
    background: "#062044",
    color: "#67e8f9",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer"
  });

  document.body.appendChild(editButton);


  // -----------------------------
  // 2. EDIT MODE
  // -----------------------------
  let editMode = false;

  editButton.addEventListener("click", () => {

    editMode = !editMode;

    const allText = document.querySelectorAll(
      "h1,h2,h3,h4,h5,h6,p,span,div,li,td"
    );

    allText.forEach(element => {

      if (
        element.children.length === 0 &&
        element.textContent.trim() !== ""
      ) {
        element.contentEditable = editMode;
      }

    });

    editButton.textContent =
      editMode ? "✅ SAVE MODE" : "⚙️ EDIT MODE";

    if (!editMode) {
      saveDashboard();
    }
  });


  // -----------------------------
  // 3. SAVE DATA
  // -----------------------------
  function saveDashboard() {

    const editableElements = document.querySelectorAll(
      '[contenteditable="true"]'
    );

    const data = [];

    editableElements.forEach((element, index) => {
      data.push({
        index: index,
        text: element.innerText
      });
    });

    localStorage.setItem(
      "pragatiDashboardData",
      JSON.stringify(data)
    );

    alert("✅ Dashboard saved!");
  }


  // -----------------------------
  // 4. LOAD SAVED DATA
  // -----------------------------
  function loadDashboard() {

    const saved = localStorage.getItem(
      "pragatiDashboardData"
    );

    if (!saved) return;

    try {

      const data = JSON.parse(saved);

      const elements = document.querySelectorAll(
        "h1,h2,h3,h4,h5,h6,p,span,div,li,td"
      );

      let index = 0;

      elements.forEach(element => {

        if (
          element.children.length === 0 &&
          element.textContent.trim() !== ""
        ) {

          if (data[index]) {
            element.innerText = data[index].text;
          }

          index++;
        }

      });

    } catch (error) {
      console.log("Saved dashboard data could not be loaded.");
    }
  }


  // -----------------------------
  // 5. RESET DASHBOARD
  // -----------------------------
  const resetButton = document.createElement("button");

  resetButton.textContent = "↻ RESET";

  Object.assign(resetButton.style, {
    position: "fixed",
    right: "18px",
    bottom: "70px",
    zIndex: "99999",
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #64748b",
    background: "#071a38",
    color: "#cbd5e1",
    fontSize: "13px",
    cursor: "pointer"
  });

  document.body.appendChild(resetButton);

  resetButton.addEventListener("click", () => {

    const confirmReset = confirm(
      "Reset saved dashboard data?"
    );

    if (confirmReset) {
      localStorage.removeItem(
        "pragatiDashboardData"
      );

      location.reload();
    }

  });


  // -----------------------------
  // 6. DIGITAL CLOCK
  // -----------------------------
  function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }
    );

    const date = now.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

    const clockElements = document.querySelectorAll(
      ".clock, #clock, [data-clock]"
    );

    clockElements.forEach(element => {
      element.textContent = time;
    });

    const dateElements = document.querySelectorAll(
      ".date, #date, [data-date]"
    );

    dateElements.forEach(element => {
      element.textContent = date;
    });
  }

  setInterval(updateClock, 1000);
  updateClock();


  // -----------------------------
  // 7. LOAD SAVED SETTINGS
  // -----------------------------
  loadDashboard();

});
