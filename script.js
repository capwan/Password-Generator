// ============================================
// DOM ELEMENTS
// ============================================
const lengthSlider = document.querySelector(".pass-length input");
const options = document.querySelectorAll(".option input");
const passwordInput = document.getElementById("passwordInput");
const passIndicator = document.querySelector(".pass-indicator");
const generateBtn = document.querySelector(".generate-btn");
const lengthDisplay = document.querySelector(".length-value");
const strengthText = document.getElementById("strengthText");
const copyIcon = document.querySelector(".copy-icon");
const refreshIcon = document.querySelector(".refresh-icon");
const themeToggle = document.getElementById("themeToggle");
const toast = document.getElementById("toast");
const historyToggle = document.getElementById("historyToggle");
const historyPanel = document.getElementById("historyPanel");
const historyClose = document.getElementById("historyClose");
const historyList = document.getElementById("historyList");

passwordInput.placeholder = "Your password";

// ============================================
// THEME MANAGEMENT
// ============================================
const loadTheme = () => {
    const savedTheme = localStorage.getItem('pg_theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.querySelector('.theme-icon').innerText = 'light_mode';
    }
};

const toggleTheme = () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeToggle.querySelector('.theme-icon').innerText = isLight ? 'dark_mode' : 'light_mode';
    localStorage.setItem('pg_theme', isLight ? 'light' : 'dark');
};

// ============================================
// HISTORY & UNIQUENESS LOGIC
// ============================================
const HISTORY_KEY = 'pg_history';
const MAX_HISTORY = 10;
let passwordHistory = [];

const loadHistory = () => {
    const saved = localStorage.getItem(HISTORY_KEY);
    passwordHistory = saved ? JSON.parse(saved) : [];
};

const saveHistory = () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(passwordHistory));
    renderHistory();
};

const addToHistory = (password) => {
    if (!password) return;
    passwordHistory.unshift(password);
    if (passwordHistory.length > MAX_HISTORY) {
        passwordHistory.pop();
    }
    saveHistory();
};

const renderHistory = () => {
    historyList.innerHTML = '';
    if (passwordHistory.length === 0) {
        historyList.innerHTML = '<li style="color: var(--text-muted); text-align: center; padding: 2rem;">No passwords yet</li>';
        return;
    }
    passwordHistory.forEach((pwd, index) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `
            <span class="history-password">${escapeHtml(pwd)}</span>
            <button class="history-copy material-symbols-rounded" data-index="${index}" aria-label="Copy">content_copy</button>
        `;
        historyList.appendChild(li);
    });
};

const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

// ============================================
// CHARACTER SETS
// ============================================
const characters = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "~!@#$%^&*()_+-=?[]{}\\|;':<>/,."
};

// ============================================
// CRYPTOGRAPHIC RANDOM (no modulo bias)
// ============================================
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

// ============================================
// HELPERS
// ============================================

// Check if at least one MAIN character type is selected (not modifiers)
const hasMainCharacterType = () => {
    return document.getElementById("lowercase").checked ||
           document.getElementById("uppercase").checked ||
           document.getElementById("numbers").checked ||
           document.getElementById("symbols").checked;
};

// Get character pool (includes spaces if selected, but excludes "exc-duplicate")
const getStaticPassword = () => {
    let staticPassword = "";
    options.forEach(option => {
        if (option.checked && option.id !== "exc-duplicate") {
            if (characters[option.id]) {
                staticPassword += characters[option.id];
            } else if (option.id === "spaces") {
                staticPassword += " ";
            }
        }
    });
    return staticPassword;
};

// ============================================
// TOAST NOTIFICATION
// ============================================
const showToast = (message, icon = 'check_circle') => {
    toast.querySelector('.toast-text').innerText = message;
    toast.querySelector('.toast-icon').innerText = icon;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
};

// ============================================
// PASSWORD INDICATOR
// ============================================
const updatePassIndicator = () => {
    const val = parseInt(lengthSlider.value, 10);
    passIndicator.removeAttribute("id");

    let strengthClass, strengthLabel;
    if (val <= 8) {
        strengthClass = "weak";
        strengthLabel = "Weak";
    } else if (val <= 15) {
        strengthClass = "medium";
        strengthLabel = "Medium";
    } else {
        strengthClass = "strong";
        strengthLabel = "Strong";
    }

    passIndicator.id = strengthClass;
    strengthText.innerText = strengthLabel;
    strengthText.className = `strength-text ${strengthClass}`;
};

// ============================================
// PASSWORD GENERATION
// ============================================
const createPasswordString = () => {
    const staticPassword = getStaticPassword();
    if (staticPassword.length === 0) return "";

    const excludeDuplicate = document.getElementById("exc-duplicate").checked;
    let passLength = parseInt(lengthSlider.value, 10);
    let randomPassword = "";

    // Safety: ensure length doesn't exceed pool size when excluding duplicates
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

const generatePassword = () => {
    const staticPassword = getStaticPassword();
    if (staticPassword.length === 0) {
        passwordInput.value = "";
        return;
    }

    let finalPassword = "";
    let attempts = 0;
    const maxAttempts = 50;

    do {
        finalPassword = createPasswordString();
        attempts++;
    } while (passwordHistory.includes(finalPassword) && attempts < maxAttempts);

    passwordInput.value = finalPassword;
    addToHistory(finalPassword);
    updatePassIndicator();
};

// ============================================
// UI STATE & LIMITS (FIXED LOGIC)
// ============================================
const checkOptionsAndToggleUI = () => {
    const hasMainType = hasMainCharacterType();

    if (!hasMainType) {
        // No main character type selected - block everything
        passwordInput.value = "";
        passwordInput.placeholder = "Select at least one character type";
        passIndicator.style.opacity = "0";
        strengthText.innerText = "None";
        strengthText.className = "strength-text";

        lengthSlider.disabled = true;
        generateBtn.disabled = true;
    } else {
        // At least one main type is selected - enable UI
        passwordInput.placeholder = "Your password";
        passIndicator.style.opacity = "1";

        lengthSlider.disabled = false;
        generateBtn.disabled = false;

        updateSliderLimits();
        generatePassword();
    }
};

const updateSliderLimits = () => {
    const staticPassword = getStaticPassword();
    const excludeDuplicate = document.getElementById("exc-duplicate").checked;
    const currentValue = parseInt(lengthSlider.value, 10);
    const defaultMin = 8;
    const defaultMax = 64;
    
    // ALWAYS keep slider at fixed range (8-64) to avoid visual jumping
    lengthSlider.min = defaultMin;
    lengthSlider.max = defaultMax;
    
    // If "Exclude duplicates" is enabled and pool is too small, adjust value
    if (excludeDuplicate && staticPassword.length > 0) {
        const maxPossibleLength = staticPassword.length;
        
        if (currentValue > maxPossibleLength) {
            // Only adjust if current value exceeds pool size
            lengthSlider.value = maxPossibleLength;
            if (lengthDisplay) lengthDisplay.innerText = maxPossibleLength;
        } else {
            // Value is OK, just update display
            if (lengthDisplay) lengthDisplay.innerText = currentValue;
        }
    } else {
        // No "Exclude duplicates" - just update display
        if (lengthDisplay) lengthDisplay.innerText = currentValue;
    }
};

const updateSlider = () => {
    if (!lengthSlider.disabled) {
        const excludeDuplicate = document.getElementById("exc-duplicate").checked;
        const staticPassword = getStaticPassword();
        let currentValue = parseInt(lengthSlider.value, 10);
        
        // Validate length if "Exclude duplicates" is enabled
        if (excludeDuplicate && staticPassword.length > 0) {
            const maxPossibleLength = staticPassword.length;
            if (currentValue > maxPossibleLength) {
                // Auto-adjust and show toast notification
                lengthSlider.value = maxPossibleLength;
                currentValue = maxPossibleLength;
                showToast(`Max length adjusted to ${maxPossibleLength} (pool size)`, "info");
            }
        }
        
        // FIX: Update the displayed value on slider movement
        if (lengthDisplay) lengthDisplay.innerText = currentValue;
        
        generatePassword();
        updatePassIndicator();
    }
    saveSettings();
};

// ============================================
// LOCALSTORAGE SETTINGS
// ============================================
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

// ============================================
// EVENT LISTENERS
// ============================================

// Copy to clipboard (Main)
copyIcon.addEventListener("click", () => {
    if (passwordInput.value) {
        navigator.clipboard.writeText(passwordInput.value);
        showToast("Copied to clipboard!", "check_circle");
        copyIcon.innerText = "check";
        setTimeout(() => copyIcon.innerText = "copy_all", 1500);
    }
});

// Refresh
refreshIcon.addEventListener("click", () => {
    generatePassword();
    refreshIcon.style.transform = "rotate(360deg)";
    setTimeout(() => {
        refreshIcon.style.transition = "none";
        refreshIcon.style.transform = "rotate(0deg)";
        setTimeout(() => refreshIcon.style.transition = "all 0.2s ease", 50);
    }, 300);
});

// Theme toggle
themeToggle.addEventListener("click", toggleTheme);

// Slider
lengthSlider.addEventListener("input", updateSlider);

// Generate button
generateBtn.addEventListener("click", generatePassword);

// Checkboxes
options.forEach(option => {
    option.addEventListener("change", () => {
        checkOptionsAndToggleUI();
        saveSettings();
    });
});

// History panel
historyToggle.addEventListener("click", () => {
    historyPanel.classList.add('open');
    renderHistory();
});

historyClose.addEventListener("click", () => {
    historyPanel.classList.remove('open');
});

// Copy from history (WITH ANIMATION)
historyList.addEventListener("click", (e) => {
    if (e.target.classList.contains('history-copy')) {
        const index = parseInt(e.target.dataset.index);
        const password = passwordHistory[index];
        navigator.clipboard.writeText(password);
        showToast("Copied from history!", "check_circle");
        
        // Animate icon to checkmark
        const icon = e.target;
        const originalText = icon.innerText;
        icon.innerText = "check";
        icon.style.color = "var(--strong)";
        
        setTimeout(() => {
            icon.innerText = originalText;
            icon.style.color = "";
        }, 1500);
    }
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    if (e.code === 'Space' && !e.target.matches('input, button, textarea, [contenteditable]')) {
        e.preventDefault();
        generatePassword();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyC' && document.activeElement === passwordInput) {
        if (passwordInput.value) {
            navigator.clipboard.writeText(passwordInput.value);
            showToast("Copied to clipboard!", "check_circle");
        }
    }
    
    if (e.code === 'Escape' && historyPanel.classList.contains('open')) {
        historyPanel.classList.remove('open');
    }
});

// Keyboard support for icons
[copyIcon, refreshIcon].forEach(icon => {
    icon.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            icon.click();
        }
    });
});

// ============================================
// INITIALIZATION
// ============================================
window.addEventListener("load", () => {
    loadTheme();
    loadHistory();
    loadSettings();
    renderHistory();
    checkOptionsAndToggleUI();
});
