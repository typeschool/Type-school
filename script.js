// ==========================================
// TYPESCHOOL — SUPABASE LOGIN & REGISTRATION
// ==========================================

const SUPABASE_URL = "https://sfumttelwyyzychnsaes.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_iQ5rbjOHaHg_9DDf74M0rw_TvXPxFu0";

let db = null;

// CONNECT TO SUPABASE
function loadSupabase() {
    return new Promise((resolve, reject) => {
        if (window.supabase) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.onload = resolve;
        script.onerror = () => reject(
            new Error("Could not load Supabase.")
        );

        document.head.appendChild(script);
    });
}

async function connectSupabase() {
    try {
        await loadSupabase();

        db = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );

        console.log("TypeSchool connected successfully.");
    } catch (error) {
        console.error(error);
        alert("Could not connect to Supabase. Check your internet connection.");
    }
}

// PAGE ELEMENTS
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

const loginHeading = document.getElementById("loginHeading");
const loginDescription = document.getElementById("loginDescription");

// OPEN LOGIN
function openLogin(role = "student") {
    if (!loginModal) return;

    if (loginHeading) {
        loginHeading.textContent =
            role.charAt(0).toUpperCase() + role.slice(1) + " Login";
    }

    if (loginDescription) {
        loginDescription.textContent =
            "Sign in to your TypeSchool account.";
    }

    if (loginMessage) loginMessage.textContent = "";

    loginModal.classList.remove("hidden");
}

// CLOSE LOGIN
function closeLogin() {
    loginModal?.classList.add("hidden");
}

// OPEN REGISTRATION
function openRegister() {
    if (!registerModal) return;

    if (registerMessage) registerMessage.textContent = "";

    registerModal.classList.remove("hidden");
}

// CLOSE REGISTRATION
function closeRegister() {
    registerModal?.classList.add("hidden");
}

// NAVIGATION BUTTONS
document.getElementById("openLogin")?.addEventListener("click", () => {
    openLogin();
});

document.getElementById("openRegister")?.addEventListener("click", openRegister);

document.getElementById("closeLogin")?.addEventListener("click", closeLogin);

document.getElementById("closeRegister")?.addEventListener("click", closeRegister);

document.getElementById("switchToRegister")?.addEventListener("click", () => {
    closeLogin();
    openRegister();
});

document.getElementById("switchToLogin")?.addEventListener("click", () => {
    closeRegister();
    openLogin();
});

// CLOSE MODALS WHEN TAPPING OUTSIDE
[loginModal, registerModal].forEach(modal => {
    modal?.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.add("hidden");
        }
    });
});

// STUDENT, PARENT, TEACHER AND ADMIN PORTALS
document.querySelectorAll("[data-portal]").forEach(button => {
    button.addEventListener("click", () => {
        openLogin(button.dataset.portal);
    });
});

// ADMISSIONS BUTTONS
document.getElementById("heroApply")?.addEventListener("click", openRegister);

document.getElementById("admissionRegister")?.addEventListener("click", openRegister);

// REGISTRATION
registerForm?.addEventListener("submit", async event => {
    event.preventDefault();

    if (!db) {
        registerMessage.textContent = "Connecting. Please try again shortly.";
        return;
    }

    const name = document.getElementById("registerName")?.value.trim();
    const email = document.getElementById("registerEmail")?.value.trim();
    const password = document.getElementById("registerPassword")?.value;

    if (!name || !email || !password) {
        registerMessage.textContent = "Please complete all fields.";
        return;
    }

    if (password.length < 6) {
        registerMessage.textContent = "Password must be at least 6 characters.";
        return;
    }

    registerMessage.textContent = "Creating your account...";

    try {
        const { data, error } = await db.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name
                }
            }
        });

        if (error) throw error;

        registerForm.reset();

        if (data.session) {
            registerMessage.textContent =
                "Your account has been created successfully. You can sign in.";
        } else {
            registerMessage.textContent =
                "Account created! Check your email for a confirmation link.";
        }

    } catch (error) {
        registerMessage.textContent = error.message;
    }
});

// LOGIN
loginForm?.addEventListener("submit", async event => {
    event.preventDefault();

    if (!db) {
        loginMessage.textContent = "Connecting. Please try again shortly.";
        return;
    }

    const email = loginForm.querySelector('input[type="email"]')?.value.trim();
    const password = loginForm.querySelector('input[type="password"]')?.value;

    if (!email || !password) {
        loginMessage.textContent = "Enter your email and password.";
        return;
    }

    loginMessage.textContent = "Signing in...";

    try {
        const { data, error } = await db.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        const { data: profile, error: profileError } = await db
            .from("profiles")
            .select("full_name, role")
            .eq("id", data.user.id)
            .single();

        if (profileError) throw profileError;

        loginMessage.textContent =
            "Welcome back, " + (profile.full_name || "student") + "!";

        alert(
            "Welcome to TypeSchool, " +
            (profile.full_name || "student") + "!"
        );

        closeLogin();

    } catch (error) {
        loginMessage.textContent = error.message;
    }
});

// LOGOUT FUNCTION
async function typeSchoolLogout() {
    if (!db) return;

    const { error } = await db.auth.signOut();

    if (error) {
        alert(error.message);
        return;
    }

    alert("You have signed out.");
}

// START CONNECTION
connectSupabase();