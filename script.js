/* =========================================
   PRAGATI SMART DASHBOARD
   JAVASCRIPT — PART 1
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- DATA ---------- */

  const defaultData = {
    subjects: [],
    habits: [],
    goals: [],
    notes: [],
    studyMinutes: 0,
    streak: 0,
    theme: "dark"
  };

  let data = loadData();

  function loadData() {
    try {
      const saved =
        localStorage.getItem("pragatiSmartDashboard");

      if (!saved) {
        return { ...defaultData };
      }

      return {
        ...defaultData,
        ...JSON.parse(saved)
      };

    } catch (error) {
      return { ...defaultData };
    }
  }


  function saveData() {
    localStorage.setItem(
      "pragatiSmartDashboard",
      JSON.stringify(data)
    );
  }


  /* ---------- HELPER ---------- */

  function $(id) {
    return document.getElementById(id);
  }


  function createId() {
    return Date.now().toString() +
      Math.random().toString(16).slice(2);
  }


  function showToast(message) {

    const toast = $("toast");
    const toastMessage = $("toastMessage");

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }


  /* ---------- CLOCK ---------- */

  function updateClock() {

    const now = new Date();

    const time =
      now.toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }
      );

    const date =
      now.toLocaleDateString(
        "en-IN",
        {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      );


    if ($("liveClock")) {
      $("liveClock").textContent = time;
    }


    if ($("todayDate")) {
      $("todayDate").textContent = date;
    }
  }


  updateClock();

  setInterval(updateClock, 1000);


  /* ---------- NAVIGATION ---------- */

  const navButtons =
    document.querySelectorAll(".nav-btn");

  const pageSections =
    document.querySelectorAll(".page-section");


  function openSection(sectionId) {

    pageSections.forEach(section => {
      section.classList.remove("active");
    });


    navButtons.forEach(button => {
      button.classList.remove("active");
    });


    const section = $(sectionId);

    if (section) {
      section.classList.add("active");
    }


    const activeButton =
      document.querySelector(
        `.nav-btn[data-section="${sectionId}"]`
      );


    if (activeButton) {
      activeButton.classList.add("active");
    }


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  navButtons.forEach(button => {

    button.addEventListener("click", () => {

      openSection(
        button.dataset.section
      );

    });

  });


  /* ---------- OTHER SECTION BUTTONS ---------- */

  document
    .querySelectorAll("[data-section]")
    .forEach(button => {

      if (button.classList.contains("nav-btn")) {
        return;
      }


      button.addEventListener("click", () => {

        openSection(
          button.dataset.section
        );

      });

    });


  /* ---------- MODAL ---------- */

  const modalOverlay =
    $("modalOverlay");

  const modalTitle =
    $("modalTitle");

  const modalBody =
    $("modalBody");

  const closeModal =
    $("closeModal");


  function openModal(title, html) {

    modalTitle.textContent = title;

    modalBody.innerHTML = html;

    modalOverlay.classList.add("show");
  }


  function hideModal() {

    modalOverlay.classList.remove("show");

    modalBody.innerHTML = "";
  }


  closeModal.addEventListener(
    "click",
    hideModal
  );


  modalOverlay.addEventListener(
    "click",
    event => {

      if (event.target === modalOverlay) {
        hideModal();
      }

    }
  );


  /* ---------- SECURITY HELPERS ---------- */

  function escapeHTML(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }


  function escapeAttribute(value) {
    return escapeHTML(value);
  }


  /* ---------- START ---------- */

  updateClock();

  showToast("⚡ Dashboard engine started!");

updateClock();

showToast("⚡ Dashboard engine started!");
   /* =========================================
     STUDY SYSTEM
  ========================================= */

  function renderSubjects() {

    const list = $("subjectList");

    if (!list) return;

    $("subjectCount").textContent =
      data.subjects.length;


    if (data.subjects.length === 0) {

      list.innerHTML = `
        <div class="empty-state">
          <span>📚</span>
          <p>No subjects added yet.</p>
          <small>Use "+ Add Subject" to create one.</small>
        </div>
      `;

      $("averageStudy").textContent = "0%";

      return;
    }


    let total = 0;


    list.innerHTML =
      data.subjects.map(subject => {

        total += Number(subject.progress);


        return `
          <div class="list-item">

            <div class="list-item-main">

              <div class="list-item-title">
                ${escapeHTML(subject.name)}
              </div>

              <div class="list-item-subtitle">
                ${subject.progress}% complete
              </div>

              <div class="progress-bar">
                <span
                  style="width:${subject.progress}%">
                </span>
              </div>

            </div>


            <div class="item-actions">

              <button
                class="small-btn"
                data-edit-subject="${subject.id}">
                Edit
              </button>

              <button
                class="small-btn"
                data-delete-subject="${subject.id}">
                Delete
              </button>

            </div>

          </div>
        `;

      }).join("");


    const average =
      Math.round(
        total / data.subjects.length
      );


    $("averageStudy").textContent =
      average + "%";


    list
      .querySelectorAll("[data-edit-subject]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => editSubject(
            button.dataset.editSubject
          )
        );

      });


    list
      .querySelectorAll("[data-delete-subject]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => deleteSubject(
            button.dataset.deleteSubject
          )
        );

      });
  }


  function addSubject() {

    openModal(
      "📚 Add Subject",

      `
        <label>Subject Name</label>

        <input
          id="subjectName"
          type="text"
          placeholder="e.g. Economics"
        >

        <label>Progress (%)</label>

        <input
          id="subjectProgress"
          type="number"
          min="0"
          max="100"
          value="0"
        >

        <button
          id="saveSubject"
          class="primary-btn">
          Save Subject
        </button>
      `
    );


    $("saveSubject").addEventListener(
      "click",
      () => {

        const name =
          $("subjectName").value.trim();


        let progress =
          Number(
            $("subjectProgress").value
          );


        if (!name) {

          showToast(
            "Please enter a subject name."
          );

          return;
        }


        progress =
          Math.max(
            0,
            Math.min(100, progress)
          );


        data.subjects.push({

          id: createId(),

          name: name,

          progress: progress

        });


        saveData();

        renderSubjects();

        hideModal();

        showToast("📚 Subject added!");
      }
    );
  }


  function editSubject(id) {

    const subject =
      data.subjects.find(
        item => item.id === id
      );


    if (!subject) return;


    openModal(
      "✏️ Edit Subject",

      `
        <label>Subject Name</label>

        <input
          id="subjectName"
          type="text"
          value="${escapeAttribute(subject.name)}"
        >

        <label>Progress (%)</label>

        <input
          id="subjectProgress"
          type="number"
          min="0"
          max="100"
          value="${subject.progress}"
        >

        <button
          id="saveSubject"
          class="primary-btn">
          Save Changes
        </button>
      `
    );


    $("saveSubject").addEventListener(
      "click",
      () => {

        const name =
          $("subjectName").value.trim();


        if (!name) {

          showToast(
            "Please enter a subject name."
          );

          return;
        }


        subject.name = name;


        subject.progress =
          Math.max(
            0,
            Math.min(
              100,
              Number(
                $("subjectProgress").value
              )
            )
          );


        saveData();

        renderSubjects();

        hideModal();

        showToast("✅ Subject updated!");
      }
    );
  }


  function deleteSubject(id) {

    if (!confirm("Delete this subject?")) {
      return;
    }


    data.subjects =
      data.subjects.filter(
        subject => subject.id !== id
      );


    saveData();

    renderSubjects();

    showToast("Subject deleted.");
  }


  $("addStudyBtn").addEventListener(
    "click",
    addSubject
  );



  /* =========================================
     HABIT SYSTEM
  ========================================= */

  function renderHabits() {

    const list = $("habitList");

    if (!list) return;


    $("habitTotalCount").textContent =
      data.habits.length;


    const completed =
      data.habits.filter(
        habit => habit.done
      ).length;


    $("habitDoneCount").textContent =
      completed;


    const best =
      data.habits.length
        ? Math.max(
            ...data.habits.map(
              habit => habit.streak || 0
            )
          )
        : 0;


    $("bestStreak").textContent =
      best + " days";


    if (!data.habits.length) {

      list.innerHTML = `
        <div class="empty-state">
          <span>🌱</span>
          <p>No habits added yet.</p>
        </div>
      `;

      return;
    }


    list.innerHTML =
      data.habits.map(habit => {

        return `
          <div
            class="habit-item ${
              habit.done ? "completed" : ""
            }">

            <input
              class="habit-checkbox"
              type="checkbox"
              data-habit-check="${habit.id}"
              ${habit.done ? "checked" : ""}
            >

            <div class="list-item-main">

              <div class="habit-name">
                ${escapeHTML(habit.name)}
              </div>

              <div class="list-item-subtitle">
                🔥 ${habit.streak || 0} day streak
              </div>

            </div>


            <div class="item-actions">

              <button
                class="small-btn"
                data-delete-habit="${habit.id}">
                Delete
              </button>

            </div>

          </div>
        `;

      }).join("");


    list
      .querySelectorAll("[data-habit-check]")
      .forEach(input => {

        input.addEventListener(
          "change",
          () => toggleHabit(
            input.dataset.habitCheck
          )
        );

      });


    list
      .querySelectorAll("[data-delete-habit]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => deleteHabit(
            button.dataset.deleteHabit
          )
        );

      });
  }


  function addHabit() {

    openModal(
      "🔥 Add Habit",

      `
        <label>Habit Name</label>

        <input
          id="habitName"
          type="text"
          placeholder="e.g. Study for 30 minutes"
        >

        <button
          id="saveHabit"
          class="primary-btn">
          Add Habit
        </button>
      `
    );


    $("saveHabit").addEventListener(
      "click",
      () => {

        const name =
          $("habitName").value.trim();


        if (!name) {

          showToast(
            "Please enter a habit."
          );

          return;
        }


        data.habits.push({

          id: createId(),

          name: name,

          done: false,

          streak: 0

        });


        saveData();

        renderHabits();

        hideModal();

        showToast("🔥 Habit added!");
      }
    );
  }


  function toggleHabit(id) {

    const habit =
      data.habits.find(
        item => item.id === id
      );


    if (!habit) return;


    habit.done = !habit.done;


    if (habit.done) {

      habit.streak =
        (habit.streak || 0) + 1;

      showToast(
        "🔥 Habit completed!"
      );

    }


    saveData();

    renderHabits();
  }


  function deleteHabit(id) {

    if (!confirm("Delete this habit?")) {
      return;
    }


    data.habits =
      data.habits.filter(
        habit => habit.id !== id
      );


    saveData();

    renderHabits();

    showToast("Habit deleted.");
  }


  $("addHabitBtn").addEventListener(
    "click",
    addHabit
  );



  /* =========================================
     GOAL SYSTEM
  ========================================= */

  function renderGoals() {

    const list = $("goalList");

    if (!list) return;


    if (!data.goals.length) {

      list.innerHTML = `
        <div class="empty-state">
          <span>🎯</span>
          <p>No goals created yet.</p>
        </div>
      `;

      return;
    }


    list.innerHTML =
      data.goals.map(goal => {

        return `
          <div class="goal-card">

            <h3>
              ${escapeHTML(goal.name)}
            </h3>

            <p>
              ${escapeHTML(
                goal.description || ""
              )}
            </p>

            <div class="goal-percentage">
              ${goal.progress}%
            </div>

            <div class="progress-bar">
              <span
                style="width:${goal.progress}%">
              </span>
            </div>

            <div class="item-actions">

              <button
                class="small-btn"
                data-edit-goal="${goal.id}">
                Edit
              </button>

              <button
                class="small-btn"
                data-delete-goal="${goal.id}">
                Delete
              </button>

            </div>

          </div>
        `;

      }).join("");


    list
      .querySelectorAll("[data-edit-goal]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => editGoal(
            button.dataset.editGoal
          )
        );

      });


    list
      .querySelectorAll("[data-delete-goal]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => deleteGoal(
            button.dataset.deleteGoal
          )
        );

      });
  }


  function addGoal() {

    openModal(
      "🎯 Add Goal",

      `
        <label>Goal Name</label>

        <input
          id="goalName"
          type="text"
          placeholder="e.g. Finish Economics syllabus"
        >

        <label>Description</label>

        <textarea
          id="goalDescription"
          placeholder="What do you want to achieve?"
        ></textarea>

        <label>Progress (%)</label>

        <input
          id="goalProgress"
          type="number"
          min="0"
          max="100"
          value="0"
        >

        <button
          id="saveGoal"
          class="primary-btn">
          Save Goal
        </button>
      `
    );


    $("saveGoal").addEventListener(
      "click",
      () => {

        const name =
          $("goalName").value.trim();


        const description =
          $("goalDescription").value.trim();


        let progress =
          Number(
            $("goalProgress").value
          );


        if (!name) {

          showToast(
            "Please enter a goal name."
          );

          return;
        }


        progress =
          Math.max(
            0,
            Math.min(100, progress)
          );


        data.goals.push({

          id: createId(),

          name: name,

          description: description,

          progress: progress

        });


        saveData();

        renderGoals();

        hideModal();

        showToast("🎯 Goal created!");
      }
    );
  }


  function editGoal(id) {

    const goal =
      data.goals.find(
        item => item.id === id
      );


    if (!goal) return;


    openModal(
      "✏️ Edit Goal",

      `
        <label>Goal Name</label>

        <input
          id="goalName"
          type="text"
          value="${escapeAttribute(goal.name)}"
        >

        <label>Description</label>

        <textarea
          id="goalDescription"
        >${escapeHTML(
          goal.description || ""
        )}</textarea>

        <label>Progress (%)</label>

        <input
          id="goalProgress"
          type="number"
          min="0"
          max="100"
          value="${goal.progress}"
        >

        <button
          id="saveGoal"
          class="primary-btn">
          Save Changes
        </button>
      `
    );


    $("saveGoal").addEventListener(
      "click",
      () => {

        const name =
          $("goalName").value.trim();


        if (!name) {

          showToast(
            "Please enter a goal name."
          );

          return;
        }


        goal.name = name;


        goal.description =
          $("goalDescription").value.trim();


        goal.progress =
          Math.max(
            0,
            Math.min(
              100,
              Number(
                $("goalProgress").value
              )
            )
          );


        saveData();

        renderGoals();

        hideModal();

        showToast("🎯 Goal updated!");
      }
    );
  }


  function deleteGoal(id) {

    if (!confirm("Delete this goal?")) {
      return;
    }


    data.goals =
      data.goals.filter(
        goal => goal.id !== id
      );


    saveData();

    renderGoals();

    showToast("Goal deleted.");
  }


  $("addGoalBtn").addEventListener(
    "click",
    addGoal
  ); 
   /* =========================================
     NOTES SYSTEM
  ========================================= */

  function renderNotes() {

    const grid = $("notesGrid");

    if (!grid) return;

    if (!data.notes.length) {

      grid.innerHTML = `
        <div class="empty-state">
          <span>📝</span>
          <p>No notes yet.</p>
        </div>
      `;

      return;
    }

    grid.innerHTML =
      data.notes.map(note => {

        return `
          <div class="note-card">

            <h3>
              ${escapeHTML(note.title)}
            </h3>

            <p>
              ${escapeHTML(note.text)}
            </p>

            <div class="item-actions">

              <button
                class="small-btn"
                data-edit-note="${note.id}">
                Edit
              </button>

              <button
                class="small-btn"
                data-delete-note="${note.id}">
                Delete
              </button>

            </div>

          </div>
        `;

      }).join("");


    grid
      .querySelectorAll("[data-edit-note]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => editNote(
            button.dataset.editNote
          )
        );

      });


    grid
      .querySelectorAll("[data-delete-note]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => deleteNote(
            button.dataset.deleteNote
          )
        );

      });
  }


  function addNote() {

    openModal(
      "📝 New Note",

      `
        <label>Title</label>

        <input
          id="noteTitle"
          type="text"
          placeholder="Note title"
        >

        <label>Note</label>

        <textarea
          id="noteText"
          placeholder="Write your note..."
        ></textarea>

        <button
          id="saveNote"
          class="primary-btn">
          Save Note
        </button>
      `
    );


    $("saveNote").addEventListener(
      "click",
      () => {

        const title =
          $("noteTitle").value.trim();

        const text =
          $("noteText").value.trim();


        if (!title || !text) {

          showToast(
            "Please fill both fields."
          );

          return;
        }


        data.notes.push({

          id: createId(),

          title: title,

          text: text

        });


        saveData();

        renderNotes();

        hideModal();

        showToast("📝 Note saved!");
      }
    );
  }


  function editNote(id) {

    const note =
      data.notes.find(
        item => item.id === id
      );


    if (!note) return;


    openModal(
      "✏️ Edit Note",

      `
        <label>Title</label>

        <input
          id="noteTitle"
          type="text"
          value="${escapeAttribute(note.title)}"
        >

        <label>Note</label>

        <textarea
          id="noteText"
        >${escapeHTML(note.text)}</textarea>

        <button
          id="saveNote"
          class="primary-btn">
          Save Changes
        </button>
      `
    );


    $("saveNote").addEventListener(
      "click",
      () => {

        const title =
          $("noteTitle").value.trim();

        const text =
          $("noteText").value.trim();


        if (!title || !text) {

          showToast(
            "Please fill both fields."
          );

          return;
        }


        note.title = title;

        note.text = text;


        saveData();

        renderNotes();

        hideModal();

        showToast("✅ Note updated!");
      }
    );
  }


  function deleteNote(id) {

    if (!confirm("Delete this note?")) {
      return;
    }


    data.notes =
      data.notes.filter(
        note => note.id !== id
      );


    saveData();

    renderNotes();

    showToast("Note deleted.");
  }


  $("addNoteBtn").addEventListener(
    "click",
    addNote
  );



  /* =========================================
     THEME SYSTEM
  ========================================= */

  function applyTheme() {

    if (data.theme === "light") {

      document.body.classList.add(
        "light-theme"
      );


      if ($("themeBtn")) {
        $("themeBtn").textContent = "☀️";
      }

    } else {

      document.body.classList.remove(
        "light-theme"
      );


      if ($("themeBtn")) {
        $("themeBtn").textContent = "🌙";
      }
    }
  }


  if ($("themeBtn")) {

    $("themeBtn").addEventListener(
      "click",
      () => {

        data.theme =
          data.theme === "dark"
            ? "light"
            : "dark";


        saveData();

        applyTheme();


        showToast(
          data.theme === "light"
            ? "☀️ Light theme enabled"
            : "🌙 Dark theme enabled"
        );

      }
    );

  }



  /* =========================================
     FULLSCREEN
  ========================================= */

  if ($("settingsBtn")) {

    $("settingsBtn").addEventListener(
      "click",
      () => {

        if (!document.fullscreenElement) {

          document.documentElement
            .requestFullscreen()
            .catch(() => {

              showToast(
                "Fullscreen not available."
              );

            });

        } else {

          document.exitFullscreen();

        }

      }
    );

  }



  /* =========================================
     STUDY TIME
  ========================================= */

  function updateStudyMinutes() {

    if ($("studyMinutes")) {

      $("studyMinutes").textContent =
        data.studyMinutes + " min";

    }


    if ($("statStudy")) {

      $("statStudy").textContent =
        data.studyMinutes + " min";

    }
  }



  /* =========================================
     DASHBOARD STATISTICS
  ========================================= */

  function updateDashboardStats() {

    const subjects =
      data.subjects.length;


    const studyProgress =
      subjects
        ? Math.round(
            data.subjects.reduce(
              (sum, subject) =>
                sum + Number(subject.progress),
              0
            ) / subjects
          )
        : 0;


    const habitsTotal =
      data.habits.length;


    const habitsDone =
      data.habits.filter(
        habit => habit.done
      ).length;


    const habitProgress =
      habitsTotal
        ? Math.round(
            (habitsDone / habitsTotal) * 100
          )
        : 0;


    const goalsTotal =
      data.goals.length;


    const goalProgress =
      goalsTotal
        ? Math.round(
            data.goals.reduce(
              (sum, goal) =>
                sum + Number(goal.progress),
              0
            ) / goalsTotal
          )
        : 0;


    const overall =
      Math.round(
        (
          studyProgress +
          habitProgress +
          goalProgress
        ) / 3
      );


    if ($("homeStudyProgress")) {

      $("homeStudyProgress").textContent =
        studyProgress + "%";

    }


    if ($("homeHabitsDone")) {

      $("homeHabitsDone").textContent =
        habitsDone;

    }


    if ($("homeGoals")) {

      $("homeGoals").textContent =
        goalsTotal;

    }


    if ($("homeStreak")) {

      $("homeStreak").textContent =
        data.streak + " days";

    }


    if ($("progressStudy")) {

      $("progressStudy").textContent =
        studyProgress + "%";

    }


    if ($("progressHabits")) {

      $("progressHabits").textContent =
        habitProgress + "%";

    }


    if ($("progressGoals")) {

      $("progressGoals").textContent =
        goalProgress + "%";

    }


    if ($("overallProgress")) {

      $("overallProgress").textContent =
        overall + "%";

    }


    if ($("statHabits")) {

      $("statHabits").textContent =
        habitsDone;

    }


    if ($("statGoals")) {

      $("statGoals").textContent =
        data.goals.filter(
          goal => Number(goal.progress) >= 100
        ).length;

    }


    if ($("statNotes")) {

      $("statNotes").textContent =
        data.notes.length;

    }


    if ($("statStudy")) {

      $("statStudy").textContent =
        data.studyMinutes + " min";

    }
  }



  /* =========================================
     RENDER EVERYTHING
  ========================================= */

  function renderAll() {

    renderSubjects();

    renderHabits();

    renderGoals();

    renderNotes();

    updateStudyMinutes();

    updateDashboardStats();
  }



  /* =========================================
     FINAL START
  ========================================= */

  applyTheme();

  renderAll();

  showToast(
    "⚡ Dashboard ready!"
  );

});
