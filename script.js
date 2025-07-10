const lengthSlider = document.querySelector(".pass-length input"),
options = document.querySelectorAll(".option input"),
copyIcon = document.querySelector(".input-box span"),
passwordInput = document.querySelector(".input-box input"),
passIndicator = document.querySelector(".pass-indicator"),
generateBtn = document.querySelector(".generate-btn");

const characters = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "~!@#$%^&*()_+-=?[]{}\|;':<>/,."
}

const generatePassword = () => {
    let staticPassword = "",
    randomPassword = "",
    excludeDuplicate = false,
    passLength = lengthSlider.value;

    options.forEach(option => {
        if(option.checked) {
            if(option.id !== "exc-duplicate" && option.id !== "spaces") {
                staticPassword += characters[option.id]; 
            } else if(option.id == "spaces") {
                staticPassword += " "; // Добавляем пробел как отдельный символ
            } else {
                excludeDuplicate = true;
            }
        }
    });

    // Если не выбран ни один набор символов
    if(staticPassword === "") {
        staticPassword = characters.lowercase; // Устанавливаем строчные буквы по умолчанию
    }

    for (let i = 0; i < passLength; i++) {
        let randomChar = staticPassword[Math.floor(Math.random() * staticPassword.length)];
        if(excludeDuplicate) {
            !randomPassword.includes(randomChar) || randomChar == " " ? randomPassword += randomChar : i--;
        } else {
            randomPassword += randomChar;
        }
    }

    passwordInput.value = randomPassword;
}

const updatePassIndicator = () => {
    if(lengthSlider.value <= 8) {
        passIndicator.id = "weak";
    } else if (lengthSlider.value <= 16) {
        passIndicator.id = "medium";
    } else {
        passIndicator.id = "strong";
    }
}

const updateSlider = () => {
    document.querySelector(".pass-length span").innerText = lengthSlider.value;
    generatePassword();
    updatePassIndicator();
}

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", () => {
    // Помечаем чекбокс строчных букв как выбранный по умолчанию
    const defaultOption = document.querySelector('input[type="checkbox"][id="lowercase"]');
    if(defaultOption) defaultOption.checked = true;
    
    updateSlider();
});

copyIcon.addEventListener("click", () => {
    navigator.clipboard.writeText(passwordInput.value);
    copyIcon.innerText = "check";
    setTimeout(() => {
        copyIcon.innerText = "copy_all";
    }, 600);
});

lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);
