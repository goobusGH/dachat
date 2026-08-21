let currentUser = null;
let currentProfile = null;


// ====================
// ELEMENTS
// ====================

const authScreen =
    document.getElementById("auth-screen");

const app =
    document.getElementById("app");

const loginTab =
    document.getElementById("login-tab");

const signupTab =
    document.getElementById("signup-tab");

const usernameContainer =
    document.getElementById("username-container");

const usernameInput =
    document.getElementById("username");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const authButton =
    document.getElementById("auth-button");

const authTitle =
    document.getElementById("auth-title");

const authSubtitle =
    document.getElementById("auth-subtitle");

const authMessage =
    document.getElementById("auth-message");

const logoutButton =
    document.getElementById("logout-button");

const currentUsername =
    document.getElementById("current-username");

const userAvatar =
    document.getElementById("user-avatar");


// ====================
// AUTH MODE
// ====================

let authMode = "login";


function setAuthMode(mode) {

    authMode = mode;

    authMessage.textContent = "";

    if (mode === "login") {

        loginTab.classList.add("active");
        signupTab.classList.remove("active");

        usernameContainer.classList.add("hidden");

        authTitle.textContent =
            "Welcome back!";

        authSubtitle.textContent =
            "Log in to continue to DaChat.";

        authButton.textContent =
            "Log In";

        passwordInput.autocomplete =
            "current-password";

    } else {

        signupTab.classList.add("active");
        loginTab.classList.remove("active");

        usernameContainer.classList.remove("hidden");

        authTitle.textContent =
            "Create an account";

        authSubtitle.textContent =
            "Join the DaChat community.";

        authButton.textContent =
            "Sign Up";

        passwordInput.autocomplete =
            "new-password";
    }
}


loginTab.addEventListener(
    "click",
    () => setAuthMode("login")
);

signupTab.addEventListener(
    "click",
    () => setAuthMode("signup")
);


// ====================
// SIGN UP / LOGIN
// ====================

authButton.addEventListener(
    "click",
    handleAuth
);


async function handleAuth() {

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    const username =
        usernameInput.value.trim();


    if (!email || !password) {

        authMessage.textContent =
            "Please enter your email and password.";

        return;
    }


    if (
        authMode === "signup" &&
        !username
    ) {

        authMessage.textContent =
            "Please choose a username.";

        return;
    }


    authButton.disabled = true;

    authMessage.textContent =
        "Please wait...";


    if (authMode === "login") {

        const {
            error
        } = await db.auth.signInWithPassword({
            email,
            password
        });


        if (error) {

            authMessage.textContent =
                error.message;

            authButton.disabled = false;

            return;
        }

    } else {

        const {
            data,
            error
        } = await db.auth.signUp({

            email,
            password,

            options: {
                data: {
                    username
                }
            }

        });


        if (error) {

            authMessage.textContent =
                error.message;

            authButton.disabled = false;

            return;
        }


        if (data.session) {

            authMessage.textContent =
                "Account created!";

        } else {

            authMessage.textContent =
                "Account created! Check your email to confirm your account.";
        }
    }


    authButton.disabled = false;
}


// ====================
// LOAD PROFILE
// ====================

async function loadProfile() {

    if (!currentUser) return;


    const {
        data,
        error
    } = await db
        .from("profiles")
        .select("username")
        .eq("id", currentUser.id)
        .single();


    if (error) {

        console.error(
            "Profile error:",
            error
        );

        return;
    }


    currentProfile = data;


    currentUsername.textContent =
        data.username;

    userAvatar.textContent =
        data.username
            .charAt(0)
            .toUpperCase();
}


// ====================
// SHOW APP
// ====================

async function showApp(user) {

    currentUser = user;

    authScreen.classList.add("hidden");

    app.classList.remove("hidden");

    await loadProfile();
}


// ====================
// SHOW LOGIN
// ====================

function showLogin() {

    currentUser = null;

    currentProfile = null;

    authScreen.classList.remove("hidden");

    app.classList.add("hidden");
}


// ====================
// LOG OUT
// ====================

logoutButton.addEventListener(
    "click",
    async () => {

        await db.auth.signOut();

    }
);


// ====================
// AUTH STATE
// ====================

db.auth.onAuthStateChange(
    async (event, session) => {

        if (session?.user) {

            await showApp(
                session.user
            );

        } else {

            showLogin();

        }

    }
);


// ====================
// INITIAL AUTH CHECK
// ====================

async function initialize() {

    const {
        data
    } = await db.auth.getSession();


    if (data.session?.user) {

        await showApp(
            data.session.user
        );

    } else {

        showLogin();

    }
}


initialize();