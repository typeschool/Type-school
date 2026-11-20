/* ==========================================
   TYPESCHOOL — MAIN WEBSITE SCRIPT
========================================== */

/* 1. SUPABASE */

const SUPABASE_URL = "https://sfumttelwyyzychnsaes.supabase.co";
const SUPABASE_KEY = "sb_publishable_iQ5rbjOHaHg_9DDf74M0rw_TvXPxFu0";

let db = null;
let currentUser = null;
let currentProfile = null;
let demoMode = false;

const $ = id => document.getElementById(id);

function connectSupabase() {
  try {
    if (!window.supabase) {
      console.error("Supabase library did not load.");
      return;
    }

    db = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

    console.log("Supabase client initialized.");
  } catch (error) {
    console.error("Supabase error:", error);
  }
}

/* 2. TEACHERS */

const principal = {
  name: "Abdalla",
  role: "Principal",
  subject: "School Leadership"
};

const teachers = [
  ["James Anderson", "Mathematics"],
  ["Oliver Bennett", "Physics"],
  ["William Carter", "Chemistry"],
  ["Henry Wilson", "Biology"],
  ["Thomas Mitchell", "English"],
  ["Daniel Foster", "Geography"],
  ["George Parker", "History"],
  ["Edward Collins", "ICT"],
  ["Jack Thompson", "Business"],
  ["Charles Reed", "Economics"],
  ["Alexander Brooks", "Computer Science"],
  ["Benjamin Hayes", "Music"],
  ["Samuel Cooper", "Mathematics"],
  ["Daniel Morgan", "Physics"],
  ["Matthew Evans", "English"],
  ["Joseph Turner", "Chemistry"],
  ["David Phillips", "Geography"],
  ["Christopher Ward", "Biology"]
].map(([name, subject]) => ({
  name,
  subject,
  role: "Teacher"
}));

/* 3. STUDENTS — FICTIONAL DEMO DATA */

const firstNames = [
  "James", "Oliver", "William", "Henry", "Thomas",
  "Daniel", "George", "Edward", "Jack", "Charles",
  "Alexander", "Benjamin", "Samuel", "Matthew",
  "Joseph", "David", "Christopher", "Lucas",
  "Noah", "Ethan", "Liam", "Mason", "Logan",
  "Jacob", "Amelia", "Olivia", "Sophia", "Isabella",
  "Mia", "Charlotte", "Ava", "Emily", "Grace",
  "Ella", "Lily", "Chloe", "Hannah", "Lucy",
  "Emma", "Aria", "Zara", "Layla", "Aisha",
  "Fatima", "Maryam", "Hana", "Sara", "Nadia"
];

const lastNames = [
  "Anderson", "Bennett", "Carter", "Wilson",
  "Mitchell", "Foster", "Parker", "Collins",
  "Thompson", "Reed", "Brooks", "Hayes",
  "Cooper", "Morgan", "Evans", "Turner",
  "Phillips", "Ward", "Hughes", "Bailey",
  "Price", "Gray", "Bell", "Wood", "Adams",
  "Scott", "Green", "Baker", "Hill", "Young",
  "King", "Wright", "Hall", "Lewis", "Clarke",
  "Robinson"
];

const students = [];

for (let i = 0; i < 108; i++) {
  students.push({
    id: i + 1,
    name: `${firstNames[i % firstNames.length]} ${lastNames[(i * 7) % lastNames.length]}`,
    grade: 9 + (i % 5),
    result: 55 + ((i * 7) % 40),
    attendance: 80 + ((i * 3) % 20)
  });
}

students[0] = {
  id: 1,
  name: "James Jr",
  grade: 11,
  result: 78,
  attendance: 96
};

/* 4. TIMETABLES */

const timetableData = {
  9: [
    ["Monday", "Mathematics", "English", "Biology", "Geography"],
    ["Tuesday", "Physics", "Chemistry", "History", "ICT"],
    ["Wednesday", "English", "Mathematics", "Business", "Biology"],
    ["Thursday", "Geography", "Physics", "Chemistry", "Music"],
    ["Friday", "ICT", "English", "Mathematics", "History"]
  ],
  10: [
    ["Monday", "Physics", "Mathematics", "English", "Chemistry"],
    ["Tuesday", "Biology", "Geography", "ICT", "History"],
    ["Wednesday", "Mathematics", "Business", "Physics", "English"],
    ["Thursday", "Chemistry", "Biology", "Geography", "Music"],
    ["Friday", "History", "ICT", "English", "Mathematics"]
  ],
  11: [
    ["Monday", "Mathematics", "Physics", "English", "Chemistry"],
    ["Tuesday", "Geography", "Biology", "ICT", "History"],
    ["Wednesday", "Physics", "Mathematics", "Business", "English"],
    ["Thursday", "Chemistry", "Geography", "Biology", "ICT"],
    ["Friday", "English", "Mathematics", "History", "Economics"]
  ],
  12: [
    ["Monday", "Mathematics", "Physics", "Chemistry", "English"],
    ["Tuesday", "Biology", "Geography", "Business", "ICT"],
    ["Wednesday", "Physics", "Mathematics", "English", "Economics"],
    ["Thursday", "Chemistry", "Biology", "History", "Geography"],
    ["Friday", "ICT", "Mathematics", "English", "Physics"]
  ],
  13: [
    ["Monday", "Mathematics", "Physics", "Chemistry", "English"],
    ["Tuesday", "Geography", "Biology", "Economics", "Business"],
    ["Wednesday", "Physics", "Mathematics", "ICT", "English"],
    ["Thursday", "Chemistry", "Biology", "Geography", "History"],
    ["Friday", "English", "Economics", "Mathematics", "Physics"]
  ]
};

const times = [
  "08:00–09:00",
  "09:15–10:15",
  "10:30–11:30",
  "11:45–12:45"
];

/* 5. HELPERS */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function showMessage(id, message) {
  const element = $(id);
  if (element) element.textContent = message;
}

/* 6. MODALS */

function openModal(id) {
  $(id)?.classList.remove("hidden");
}

function closeModal(id) {
  $(id)?.classList.add("hidden");
}

function openLogin() {
  closeModal("registerModal");
  openModal("loginModal");
}

function openRegister() {
  closeModal("loginModal");
  openModal("registerModal");
}

$("loginOpen")?.addEventListener("click", openLogin);
$("bottomLogin")?.addEventListener("click", openLogin);
$("registerOpen")?.addEventListener("click", openRegister);
$("heroJoin")?.addEventListener("click", openRegister);
$("joinBottom")?.addEventListener("click", openRegister);

$("loginClose")?.addEventListener("click", () => closeModal("loginModal"));
$("registerClose")?.addEventListener("click", () => closeModal("registerModal"));

$("switchRegister")?.addEventListener("click", openRegister);
$("switchLogin")?.addEventListener("click", openLogin);

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) modal.classList.add("hidden");
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal("loginModal");
    closeModal("registerModal");
  }
});

/* 7. FACeless AVATARS */

function makeAvatar(name) {
  const initials = name.split(" ")
    .map(word => word[0])
    .slice(0, 2)
    .join("");

  return `
    <div class="avatar">
      <span>${escapeHTML(initials)}</span>
    </div>
  `;
}

/* 8. PUBLIC TEAM */

function renderPublicTeachers() {
  const container = $("publicTeachers");
  if (!container) return;

  container.innerHTML = [principal, ...teachers].map(person => `
    <article class="team-card">
      ${makeAvatar(person.name)}
      <div class="team-info">
        <span class="eyebrow">
          ${person.role === "Principal" ? "LEADERSHIP" : "TEACHING TEAM"}
        </span>
        <h3>${escapeHTML(person.name)}</h3>
        <p>${escapeHTML(person.role)}</p>
        <small>${escapeHTML(person.subject)}</small>
      </div>
    </article>
  `).join("");
}

/* 9. ONLINE / VISIT OPTIONS */

$("onlineChoice")?.addEventListener("click", () => {
  $("connectionInfo").innerHTML = `
    <h3>Join TypeSchool online</h3>
    <p>Create an account to begin. New accounts receive student access.
    Other roles require school approval.</p>
    <button class="btn btn-gold" id="onlineRegister">
      Create account →
    </button>
  `;

  $("onlineRegister")?.addEventListener("click", openRegister);
});

$("visitChoice")?.addEventListener("click", () => {
  $("connectionInfo").innerHTML = `
    <h3>Visit TypeSchool</h3>
    <p>Contact the school office to arrange a visit.
    School address and visiting hours can be added here.</p>
  `;
});

/* 10. DEMO PREVIEW */

function addDemoButtons() {
  const box = document.querySelector("#loginModal .modal-box");
  if (!box || $("demoPreviewButtons")) return;

  const section = document.createElement("div");
  section.id = "demoPreviewButtons";
  section.style.cssText =
    "margin-top:24px;padding-top:18px;border-top:1px solid #ddd;";

  section.innerHTML = `
    <h3>Explore the dashboard</h3>
    <p>Fictional demonstration accounts. No real student records.</p>
    <button type="button" class="btn btn-outline form-submit" id="demoStudent">
      Preview student dashboard
    </button>
    <button type="button" class="btn btn-outline form-submit" id="demoParent">
      Preview parent dashboard and students
    </button>
    <button type="button" class="btn btn-outline form-submit" id="demoTeacher">
      Preview teacher dashboard
    </button>
  `;

  box.appendChild(section);

  $("demoStudent").addEventListener("click", () => startDemo("student"));
  $("demoParent").addEventListener("click", () => startDemo("parent"));
  $("demoTeacher").addEventListener("click", () => startDemo("teacher"));
}

function startDemo(role) {
  demoMode = true;

  currentUser = { id: "demo-user" };

  currentProfile = {
    full_name: role === "student" ? "Demo Student" :
      role === "parent" ? "Demo Parent" : "Demo Teacher",
    role
  };

  closeModal("loginModal");
  showDashboard();
}

/* 11. DASHBOARD */

function showDashboard() {
  $("publicPage")?.classList.add("hidden");
  document.querySelector(".navbar")?.classList.add("hidden");
  document.querySelector(".footer")?.classList.add("hidden");
  $("dashboard")?.classList.remove("hidden");

  $("dashboardWelcome").textContent =
    `Welcome, ${currentProfile.full_name}`;

  $("dashboardRoleLabel").textContent =
    `${currentProfile.role.toUpperCase()} WORKSPACE` +
    (demoMode ? " • DEMO PREVIEW" : "");

  renderDashboardTabs(currentProfile.role);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function returnToPublic() {
  $("dashboard")?.classList.add("hidden");
  $("publicPage")?.classList.remove("hidden");
  document.querySelector(".navbar")?.classList.remove("hidden");
  document.querySelector(".footer")?.classList.remove("hidden");
}

function renderDashboardTabs(role) {
  const tabs = [["overview", "Overview"]];

  if (role === "student") {
    tabs.push(["timetable", "My timetable"]);
    tabs.push(["results", "My results"]);
  }

  if (role === "parent" || role === "admin") {
    tabs.push(["students", "Student directory"]);
    tabs.push(["timetables", "Timetables"]);
  }

  if (role === "teacher" || role === "admin") {
    tabs.push(["teaching", "Teaching team"]);
    tabs.push(["timetables", "Timetables"]);
  }

  $("dashboardTabs").innerHTML = tabs.map((tab, index) => `
    <button class="dashboard-tab ${index === 0 ? "active" : ""}"
      data-tab="${tab[0]}">${tab[1]}</button>
  `).join("");

  document.querySelectorAll(".dashboard-tab").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".dashboard-tab")
        .forEach(item => item.classList.remove("active"));

      button.classList.add("active");
      renderDashboardPage(button.dataset.tab);
    });
  });

  renderDashboardPage("overview");
}

function renderDashboardPage(page) {
  const role = currentProfile.role;
  const content = $("dashboardContent");

  if (!content) return;

  if (page === "overview") {
    content.innerHTML = `
      <div class="dashboard-panel">
        <span class="eyebrow">YOUR WORKSPACE</span>
        <h2>Welcome to TypeSchool.</h2>
        <p>You are viewing the ${escapeHTML(role)} dashboard.</p>
        ${demoMode
          ? "<p><strong>DEMO MODE:</strong> All records are fictional.</p>"
          : "<p>Your account is connected.</p>"}
      </div>
    `;
    return;
  }

  if (page === "students" && ["parent", "admin"].includes(role)) {
    renderStudentDirectory();
    return;
  }

  if (page === "timetable") {
    renderTimetable(11);
    return;
  }

  if (page === "timetables" &&
      ["parent", "admin", "teacher"].includes(role)) {
    renderTimetableSelector();
    return;
  }

  if (page === "results" && role === "student") {
    content.innerHTML = `
      <div class="dashboard-panel">
        <h2>My results</h2>
        <p>Your real exam results will appear here when the school connects its results system.</p>
      </div>
    `;
    return;
  }

  if (page === "teaching" && ["teacher", "admin"].includes(role)) {
    renderTeachingDirectory();
    return;
  }

  content.innerHTML = "<div class='dashboard-panel'>Page unavailable.</div>";
}

/* 12. STUDENT DIRECTORY */

function renderStudentDirectory() {
  $("dashboardContent").innerHTML = `
    <div class="dashboard-panel">
      <span class="eyebrow">FICTIONAL DEMO RECORDS</span>
      <h2>Student directory</h2>
      <p>Search by student name.</p>
      <input id="studentSearch" type="search"
        placeholder="Search names..."
        style="width:100%;padding:14px;margin:15px 0;">
      <div id="studentResults"></div>
      <p><small>All records displayed are fictional demonstration data.</small></p>
    </div>
  `;

  $("studentSearch").addEventListener("input", event => {
    const query = event.target.value.trim().toLowerCase();

    const matches = students.filter(student =>
      student.name.toLowerCase().startsWith(query)
    );

    showStudentResults(matches);
  });

  showStudentResults(students);
}

function showStudentResults(list) {
  const target = $("studentResults");
  if (!target) return;

  if (!list.length) {
    target.innerHTML = "<p>No matching students found.</p>";
    return;
  }

  target.innerHTML = list.map(student => `
    <article class="dashboard-panel student-record">
      <h3>${escapeHTML(student.name)}</h3>
      <p>Grade ${student.grade}</p>
      <p>Last exam: <strong>${student.result}%</strong></p>
      <p>Attendance: ${student.attendance}%</p>
    </article>
  `).join("");
}

/* 13. TIMETABLES */

function renderTimetableSelector() {
  $("dashboardContent").innerHTML = `
    <div class="dashboard-panel">
      <h2>Grade timetables</h2>
      <label for="gradeSelect">Choose grade</label>
      <select id="gradeSelect" style="padding:12px;margin:12px 0;">
        ${[9, 10, 11, 12, 13].map(grade =>
          `<option value="${grade}">Grade ${grade}</option>`
        ).join("")}
      </select>
      <div id="timetableDisplay"></div>
    </div>
  `;

  $("gradeSelect").addEventListener("change", event => {
    renderTimetable(Number(event.target.value));
  });

  renderTimetable(9);
}

function renderTimetable(grade) {
  const target = $("timetableDisplay") || $("dashboardContent");
  if (!target) return;

  const rows = timetableData[grade];

  target.innerHTML = `
    <h3>Grade ${grade} timetable</h3>
    <p>Fictional demonstration timetable</p>
    <div style="overflow-x:auto;">
      <table class="demo-table">
        <thead>
          <tr>
            <th>Day</th>
            ${times.map(time => `<th>${time}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>${row.map(item =>
              `<td>${escapeHTML(item)}</td>`
            ).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

/* 14. TEACHING DIRECTORY */

function renderTeachingDirectory() {
  $("dashboardContent").innerHTML = `
    <div class="dashboard-panel">
      <h2>Teaching team</h2>
      <div class="team-grid">
        ${teachers.map(teacher => `
          <article class="team-card">
            ${makeAvatar(teacher.name)}
            <div class="team-info">
              <h3>${escapeHTML(teacher.name)}</h3>
              <p>${escapeHTML(teacher.role)}</p>
              <small>${escapeHTML(teacher.subject)}</small>
            </div>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

/* 15. LOAD REAL USER PROFILE */

async function loadProfile(user) {
  const { data, error } = await db
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    throw new Error(
      "Your profile could not be loaded. Contact the school administrator."
    );
  }

  currentUser = user;
  currentProfile = data;
  demoMode = false;

  showDashboard();
}

/* 16. LOGIN */

$("loginForm")?.addEventListener("submit", async event => {
  event.preventDefault();

  if (!db) {
    showMessage("loginMessage", "Supabase did not initialize. Check your internet connection and key.");
    return;
  }

  const email = $("loginEmail").value.trim();
  const password = $("loginPassword").value;

  showMessage("loginMessage", "Signing in...");

  try {
    const { data, error } = await db.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    await loadProfile(data.user);
    closeModal("loginModal");

  } catch (error) {
    showMessage("loginMessage", error.message || "Login failed.");
  }
});

/* 17. REGISTRATION */

$("registerForm")?.addEventListener("submit", async event => {
  event.preventDefault();

  if (!db) {
    showMessage("registerMessage", "Supabase did not initialize. Check your internet connection and key.");
    return;
  }

  const fullName = $("registerName").value.trim();
  const email = $("registerEmail").value.trim();
  const password = $("registerPassword").value;

  showMessage("registerMessage", "Creating your account...");

  try {
    const { data, error } = await db.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (error) throw error;

    if (data.session && data.user) {
      await loadProfile(data.user);
      closeModal("registerModal");
    } else {
      showMessage(
        "registerMessage",
        "Account created. Check your email if confirmation is required, then log in."
      );
    }

  } catch (error) {
    showMessage("registerMessage", error.message || "Registration failed.");
  }
});

/* 18. LOGOUT */

$("logoutButton")?.addEventListener("click", async () => {
  if (!demoMode && db) {
    await db.auth.signOut();
  }

  currentUser = null;
  currentProfile = null;
  demoMode = false;

  returnToPublic();
});

/* 19. RESTORE SESSION */

async function restoreSession() {
  if (!db) return;

  try {
    const { data, error } = await db.auth.getSession();

    if (error) throw error;

    if (data.session?.user) {
      await loadProfile(data.session.user);
    }
  } catch (error) {
    console.error("Session restore error:", error);
  }
}

/* 20. INITIALIZE */

connectSupabase();
renderPublicTeachers();
addDemoButtons();
restoreSession();