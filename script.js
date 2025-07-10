const lengthSlider = document.querySelector(".pass-length input"),
options = document.querySelectorAll(".option input"),
copyIcon = document.querySelector(".input-box span"),
passwordInput = document.querySelector(".input-box input"),
passIndicator = document.querySelector(".pass-indicator"),
generateBtn = document.querySelector(".generate-btn");

// Устанавливаем placeholder
passwordInput.placeholder = "Your password";

const characters = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "~!@#$%^&*()_+-=?[]{}\\|;':<>/,."
}

const generatePassword = () => {
    let staticPassword = "",
    randomPassword = "",
    excludeDuplicate = false,
    passLength = lengthSlider.value;

    // Счетчик выбранных опций
    let selectedOptions = 0;

    options.forEach(option => {
        if(option.checked) {
            if(option.id !== "exc-duplicate" && option.id !== "spaces") {
                staticPassword += characters[option.id];
                selectedOptions++;
            } else if(option.id === "spaces") {
                staticPassword += " ";
            } else {
                excludeDuplicate = true;
            }
        }
    });

    // Если нет выбранных опций - показываем placeholder
    if(selectedOptions === 0) {
        passwordInput.value = "";
        return;
    }

    // Генерация пароля
    for (let i = 0; i < passLength; i++) {
        const randomChar = staticPassword[Math.floor(Math.random() * staticPassword.length)];
        
        if(excludeDuplicate) {
            if(!randomPassword.includes(randomChar) || randomChar === " ") {
                randomPassword += randomChar;
            } else {
                i--;
            }
        } else {
            randomPassword += randomChar;
        }
    }

    passwordInput.value = randomPassword;
}

const updatePassIndicator = () => {
    passIndicator.id = lengthSlider.value <= 8 ? "weak" : 
                      lengthSlider.value <= 16 ? "medium" : "strong";
}

const updateSlider = () => {
    document.querySelector(".pass-length span").innerText = lengthSlider.value;
    generatePassword();
    updatePassIndicator();
}

// Инициализация при полной загрузке страницы
window.addEventListener("load", () => {
    // Сбрасываем все чекбоксы
    options.forEach(option => option.checked = false);
    
    // Устанавливаем значения по умолчанию
    document.getElementById("lowercase").checked = true;
    document.getElementById("numbers").checked = true;
    
    // Обновляем UI
    updateSlider();
});

// Обработчики событий
copyIcon.addEventListener("click", () => {
    if(passwordInput.value) {
        navigator.clipboard.writeText(passwordInput.value);
        copyIcon.innerText = "check";
        setTimeout(() => copyIcon.innerText = "copy_all", 600);
    }
});

lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);
