const flags = {
    uppercase: false,
    numbers: false,
    symbols: false,
    length: 5
}

const selectors = {
    copy: 'copy',
    checkbox: 'checkbox',
    slider: 'slider',
    button: 'button',
    sliderValue: document.querySelector('.value'),
    input: document.querySelector('input[type="text"]')
}

const generatePassword = () => {
    const defaultCharacters = 'abcdefghijklmnopqrstuvwxyz'
    const characters = {
        uppercase: defaultCharacters.toUpperCase(),
        numbers: '0123456789',
        symbols: '~!@-#$'
    }

    const characterList = [
        defaultCharacters,
        ...flags.uppercase ? characters.uppercase : [],
        ...flags.numbers ? characters.numbers : [],
        ...flags.symbols ? characters.symbols : []
    ].join('')

    return Array.from({ length: flags.length }, () => Math.floor(Math.random() * characterList.length))
        .map(number => characterList[number])
        .join('')
}

document.querySelector('#app').addEventListener('click', event => {
    switch (event.target.dataset.jsSelector) {
        // Event listener for copy
        case selectors.copy:
            const dummy = document.createElement('textarea')

            document.body.appendChild(dummy)

            dummy.value = selectors.input.value
            dummy.select()

            document.execCommand('copy')
            document.body.removeChild(dummy)
        break;

        // Event listeners for checkboxes
        case selectors.checkbox:
            flags[event.target.control.id] = !event.target.control.checked
        break;

        // Event listeners for slider
        case selectors.slider:
            const value = event.target.valueAsNumber

            selectors.sliderValue.innerText = value
            flags.length = value
        break;

        // Event listener for generate button
        case selectors.button:
            selectors.input.value = generatePassword()
        break;
    }
})