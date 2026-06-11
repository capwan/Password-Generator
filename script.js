const lengthSlider = document.querySelector(".pass-length input");
const options = document.querySelectorAll(".option input");
const copyIcon = document.querySelector(".copy-icon");
const passwordInput = document.querySelector(".input-box input");
const passIndicator = document.querySelector(".pass-indicator");
const generateBtn = document.querySelector(".generate-btn");
const lengthDisplay = document.querySelector(".length-value");

passwordInput.placeholder = "Your password";

// ==========================================
// HISTORY & UNIQUENESS LOGIC
// ==========================================
const HISTORY_KEY = 'pg_history';
const MAX_HISTORY = 10;
let passwordHistory = [];

const loadHistory = () => {
    const saved = localStorage.getItem(HISTORY_KEY);
    passwordHistory = saved ? JSON.parse(saved) : [];
};

const saveHistory = () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(passwordHistory));
};

const addToHistory = (password) => {
    if (!password) return;
    // Add new password to the beginning of the array
    passwordHistory.unshift(password);
    // If array exceeds 10, remove the oldest password
    if (passwordHistory.length > MAX_HISTORY) {
        passwordHistory.pop();
    }
    saveHistory();
};

// ==========================================
// CORE GENERATION LOGIC
// ==========================================
const characters = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "~!@#$%^&*()_+-=?[]{}\\|;':<>/,."
};

function getSecureRandom(max) {
    if (max <= 0) return 0;
    const array = new Uint32Array(1);
    const limit = Math.floor(0xFFFFFFFF / max) * max;
    let rand;
    do {
        crypto.getRandomValues(array);
        rand = array[0];
    } while (rand >= limit);
    return rand % max;
}

const getStaticPassword = () => {
    let staticPassword = "";
    options.forEach(option => {
        if (option.checked) {
            if (characters[option.id]) {
                staticPassword += characters[option.id];
            } else if (option.id === "spaces") {
                staticPassword += " ";
            }
        }
    });
    return staticPassword;
};

const updatePassIndicator = () => {
    const val = parseInt(lengthSlider.value, 10);
    passIndicator.removeAttribute("id");

    if (val <= 8) {
        passIndicator.id = "weak";      // Red (up to 8 inclusive)
    } else if (val <= 15) {
        passIndicator.id = "medium";    // Yellow (9-15)
    } else {
        passIndicator.id = "strong";    // Blue (16 and above)
    }
};

// Creates a single password string (without history check)
const createPasswordString = () => {
    const staticPassword = getStaticPassword();
    if (staticPassword.length === 0) return "";

    const excludeDuplicate = document.getElementById("exc-duplicate").checked;
    let passLength = parseInt(lengthSlider.value, 10);
    let randomPassword = "";

    // Protection against exceeding pool limits when Exclude Duplicate is enabled
    if (excludeDuplicate && passLength > staticPassword.length) {
        passLength = staticPassword.length;
        lengthSlider.value = passLength;
        if (lengthDisplay) lengthDisplay.innerText = passLength;
    }

    if (excludeDuplicate) {
        let availableChars = staticPassword.split("");
        for (let i = 0; i < passLength; i++) {
            if (availableChars.length === 0) break;
            const randomIndex = getSecureRandom(availableChars.length);
            randomPassword += availableChars.splice(randomIndex, 1)[0];
        }
    } else {
        for (let i = 0; i < passLength; i++) {
            const randomIndex = getSecureRandom(staticPassword.length);
            randomPassword += staticPassword[randomIndex];
        }
    }
    return randomPassword;
};

// Main generation function with uniqueness check
const generatePassword = () => {
    const staticPassword = getStaticPassword();
    if (staticPassword.length === 0) {
        passwordInput.value = "";
        return;
    }

    let finalPassword = "";
    let attempts = 0;
    const maxAttempts = 50; // Failsafe against infinite loops in edge cases

    // Generate password until it's unique (max 50 attempts)
    do {
        finalPassword = createPasswordString();
        attempts++;
    } while (passwordHistory.includes(finalPassword) && attempts < maxAttempts);

    passwordInput.value = finalPassword;
    addToHistory(finalPassword); // Save to history
};

// ==========================================
// UI STATE & LIMITS
// ==========================================
const checkOptionsAndToggleUI = () => {
    const staticPassword = getStaticPassword();
    const hasValidCharacterType = staticPassword.length > 0;

    if (!hasValidCharacterType) {
        passwordInput.value = "";
        passwordInput.placeholder = "Select character type";
        passIndicator.style.opacity = "0";

        lengthSlider.disabled = true;
        generateBtn.disabled = true;
        generateBtn.style.opacity = "0.5";
        lengthSlider.style.opacity = "0.5";
    } else {
        passwordInput.placeholder = "Your password";
        passIndicator.style.opacity = "1";

        lengthSlider.disabled = false;
        generateBtn.disabled = false;
        generateBtn.style.opacity = "1";
        lengthSlider.style.opacity = "1";

        updateSliderLimits();
        generatePassword();
        updatePassIndicator();
    }
};

const updateSliderLimits = () => {
    const staticPassword = getStaticPassword();
    const excludeDuplicate = document.getElementById("exc-duplicate").checked;
    let maxLimit = 64;

    if (excludeDuplicate && staticPassword.length > 0) {
        maxLimit = staticPassword.length;
    }

    const defaultMin = 8;
    
    // Protection against slider breakage (when min > max)
    if (maxLimit < defaultMin) {
        lengthSlider.min = maxLimit;
        lengthSlider.max = maxLimit;
        lengthSlider.value = maxLimit;
    } else {
        lengthSlider.min = defaultMin;
        lengthSlider.max = maxLimit;
        if (parseInt(lengthSlider.value) > maxLimit) {
            lengthSlider.value = maxLimit;
        }
    }

    if (lengthDisplay) lengthDisplay.innerText = lengthSlider.value;
};

const updateSlider = () => {
    if (!lengthSlider.disabled) {
        updateSliderLimits();
        generatePassword();
        updatePassIndicator();
    }
    saveSettings();
};

// ==========================================
// LOCALSTORAGE SETTINGS
// ==========================================
const saveSettings = () => {
    const settings = {
        length: lengthSlider.value,
        options: Array.from(options).reduce((acc, opt) => {
            acc[opt.id] = opt.checked;
            return acc;
        }, {})
    };
    localStorage.setItem('pg_settings', JSON.stringify(settings));
};

const loadSettings = () => {
    const saved = localStorage.getItem('pg_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        lengthSlider.value = settings.length;
        options.forEach(option => {
            if (settings.options[option.id] !== undefined) {
                option.checked = settings.options[option.id];
            }
        });
    } else {
        document.getElementById("lowercase").checked = true;
        document.getElementById("numbers").checked = true;
    }
};

// ==========================================
// EVENT LISTENERS
// ==========================================
copyIcon.addEventListener("click", () => {
    if (passwordInput.value) {
        navigator.clipboard.writeText(passwordInput.value);
        copyIcon.innerText = "check";
        setTimeout(() => copyIcon.innerText = "copy_all", 600);
    }
});

lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);

options.forEach(option => {
    option.addEventListener("change", () => {
        checkOptionsAndToggleUI();
        saveSettings();
    });
});

// ==========================================
// INITIALIZATION
// ==========================================
window.addEventListener("load", () => {
    loadHistory();      // Load password history
    loadSettings();     // Load settings
    checkOptionsAndToggleUI(); // Initialize UI
});