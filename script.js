const lengthSlider = document.querySelector(".pass-length input"),
options = document.querySelectorAll(".option input"),
copyIcon = document.querySelector(".input-box span"),
passwordInput = document.querySelector(".input-box input"),
passIndicator = document.querySelector(".pass-indicator"),
generateBtn = document.querySelector(".generate-btn");

// Добавляем placeholder в поле ввода
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

    // Проверяем, есть ли хотя бы одна опция выбрана
    let atLeastOneSelected = false;

    options.forEach(option => {
        if(option.checked && option.id !== "exc-duplicate") {
            atLeastOneSelected = true;
            if(option.id !== "spaces") {
                staticPassword += characters[option.id]; 
            } else {
                staticPassword += " "; // Добавляем пробел
            }
        } else if(option.checked && option.id === "exc-duplicate") {
            excludeDuplicate = true;
        }
    });

    // Если ни одна опция не выбрана - показываем placeholder и выходим
    if(!atLeastOneSelected) {
        passwordInput.value = "";
        return;
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
    // Убедимся, что по крайней мере один чекбокс выбран
    const defaultOptions = document.querySelectorAll('input[type="checkbox"][id="lowercase"], input[type="checkbox"][id="uppercase"]');
    
    // Если ни один чекбокс не выбран - выберем lowercase по умолчанию
    let anyChecked = false;
    options.forEach(option => {
        if(option.checked && option.id !== "exc-duplicate" && option.id !== "spaces") {
            anyChecked = true;
        }
    });
    
    if(!anyChecked) {
        const lowercaseOption = document.querySelector('input[type="checkbox"][id="lowercase"]');
        if(lowercaseOption) lowercaseOption.checked = true;
    }
    
    updateSlider();
});

copyIcon.addEventListener("click", () => {
    if(passwordInput.value) {
        navigator.clipboard.writeText(passwordInput.value);
        copyIcon.innerText = "check";
        setTimeout(() => {
            copyIcon.innerText = "copy_all";
        }, 600);
    }
});

lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);
