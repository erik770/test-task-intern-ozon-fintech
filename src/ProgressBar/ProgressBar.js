export class ProgressBar {
    #state = {
        value: 0,
        isAnimated: false,
        isHidden: false,
    }

    constructor(parentNode, progressBarTitle = "Progress", initialState = {value:0, isAnimated: false, isHidden: false}) {
        this.#state = {...initialState};
        
        if (!parentNode || !(parentNode instanceof HTMLElement)) {
            return;
        }
        const container = createDivWithClassAndText("container");
        container.appendChild(createDivWithClassAndText("title", progressBarTitle));

    
        const progressBar = createDivWithClassAndText("progressBar");
        let progressCircleClasses = ["progressBar__circle"];
        this.#state.isHidden ? progressCircleClasses.push("progressBar__circle_hidden") : progressCircleClasses;
        this.#state.isAnimated ? progressCircleClasses.push("progressBar__circle_animated") : progressCircleClasses;
        const progressCircle = createDivWithClassAndText(progressCircleClasses);
        progressBar.appendChild(progressCircle);
        progressBar.appendChild(createSettingsSection(this.#state.value, this.#state.isAnimated, this.#state.isHidden));
        container.appendChild(progressBar);

        parentNode.appendChild(container);
        
        addProgressHandler();
        if (this.#state.value) {
            this.setProgress(this.#state.value);
        }
        addClickHandler("#animate", () => this.#state.isAnimated ? this.turnAnimationOff() : this.turnAnimationOn());
        addClickHandler("#hide", () => this.#state.isHidden ? this.show() : this.hide());       
    }

    setProgress(newValue) {
        const valueInputField = document.querySelector("#value");
        if (!valueInputField) {
            return new Error("node not found");
        }
        valueInputField.value = newValue;
        this.#state.value = newValue;
        valueInputField.dispatchEvent(new Event('input', {bubbles:true}));
    }

    turnAnimationOn() {
        if(this.#state.isAnimated){
            return;
        }
        changeClassPresence(".progressBar__circle", "progressBar__circle_animated");
        this.#state.isAnimated = true;
        const animateToggle = document.querySelector("#animate");
        if (animateToggle) {
            animateToggle.checked = this.#state.isAnimated;
            return;
        }
    }
    
    turnAnimationOff() {
        if(!this.#state.isAnimated){
            return;
        }
        changeClassPresence(".progressBar__circle", "progressBar__circle_animated");
        this.#state.isAnimated = false;
        const animateToggle = document.querySelector("#animate");
        if (animateToggle) {
            animateToggle.checked = this.#state.isAnimated;
            return;
        }
    }

    hide() {
        if(this.#state.isHidden){
            return;
        }
        changeClassPresence(".progressBar__circle", "progressBar__circle_hidden");
        this.#state.isHidden = true;
        const hideToggle = document.querySelector("#hide");
        if (hideToggle) {
            hideToggle.checked = true;
            return;
        }
    }
    
    show() {
        if(!this.#state.isHidden){
            return;
        }
        changeClassPresence(".progressBar__circle", "progressBar__circle_hidden");
        this.#state.isHidden = false;
        const hideToggle = document.querySelector("#hide");
        if (hideToggle) {
            hideToggle.checked = false;
            return;
        }
    }
}

function addProgressHandler(growingSpeed = 20) {
    const valueInputField = document.querySelector("#value");
    if (!valueInputField) {
        return new Error("node not found");
    }
    const progressCircle = document.querySelector(".progressBar__circle");
    if (!progressCircle) {
        return new Error("node not found");
    }
    let inter;
    valueInputField.addEventListener('input', (e) => {
        const newInputValue = validateInput(e.target.value)
        e.target.value = newInputValue;
        let currentValue = getComputedStyle(progressCircle).getPropertyValue("--progress");
        clearInterval(inter);
        inter = setInterval(() => {
            currentValue < newInputValue
                ? currentValue++
                : currentValue--;

            progressCircle.style.setProperty('--progress', String(currentValue));
            if (+newInputValue === +currentValue) {
                clearInterval(inter);
            }
        }, growingSpeed);
    });
}

function validateInput(inputNumber) {
    if (inputNumber.length === 0) {
        return "0";
    }
    if (inputNumber[0] === '0') {
        return inputNumber.slice(1);
    }
    if (inputNumber > 100) {
        return "100";
    }
    return inputNumber.replace(/[^0-9]/g, "");
}

function addClickHandler(selector, handler) {
    const clickedNode = document.querySelector(selector);
    if (!clickedNode) {
        return new Error("node not found");
    }
    clickedNode.addEventListener('click', handler);
}

function changeClassPresence(selector, className) {
    const searchingNode = document.querySelector(selector);
    if (!searchingNode) {
        return new Error("node not found");
    }
    if (searchingNode.classList.contains(className)) {
        searchingNode.classList.remove(className);
    } else {
        searchingNode.classList.add(className);
    }
}

function createSettingsSection(value, isAnimated, isHidden) {
    const settings = createDivWithClassAndText(["progressBar__settings", "settings"]);
    settings.appendChild(createInputWithText("settings__property", "settings__input", "Value", value, "input", "value"));
    settings.appendChild(createInputWithText("settings__property", "settings__checkbox", "Animate", isAnimated, "checkbox", "animate"));
    settings.appendChild(createInputWithText("settings__property", "settings__checkbox", "Hide", isHidden, "checkbox", "hide"));
    return settings;
}

function createInputWithText(className = "", inputClassName = "", inputText = "", inputValue = 0, inputType = "", id = String(Date.now())) {
    const inputContainer = createDivWithClassAndText(className);
    const input = document.createElement("input");
    input.type = inputType;
    input.id = id;
    input.classList.add(inputClassName);


    const text = document.createElement("span");
    text.innerHTML = inputText;

    inputContainer.appendChild(input);
    if (inputType === "checkbox") {
        input.checked = inputValue;
        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.classList.add("toggle");
        inputContainer.appendChild(label);
    } else {
        input.value = inputValue;
    }
    inputContainer.appendChild(text)
    return inputContainer;
}

function createDivWithClassAndText(className = "", text = "") {
    const divElem = document.createElement("div");
    Array.isArray(className) ? className.forEach(name => divElem.classList.add(name)) : divElem.classList.add(className);
    divElem.innerHTML = text;
    return divElem;
}
