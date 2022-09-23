/** Class representing a Circular Progress Bar. */
export class ProgressBar {
    #state = {
        value: 0,
        isAnimated: false,
        isHidden: false,
    }

     /**
      * Create a Progress Bar.
      * @param {HTMLElement} parentNode - The node to which Progress Bar is attached.
      * @param {string} [progressBarTitle] - The title of Progress Bar (displays at top left corner).
      * @param {object} [initialState] - The initial state of Progress Bar.
      */
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

    /**
      * Change the progress percentage.
      * @param {number} newValue - New progress percentage.
      */
    setProgress(newValue) {
        const valueInputField = document.querySelector("#value");
        if (!valueInputField) {
            return new Error("node not found");
        }
        valueInputField.value = newValue;
        this.#state.value = newValue;
        valueInputField.dispatchEvent(new Event('input', {bubbles:true}));
    }

    /** Animates the Progress Bar (spinning animation) */
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
    
    /** Turn the spinning animation off */
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

    /** Complitely hides Progress Bar from page */
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
    
    /** If Progress Bar was hidden shows it */
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

/**
 * Binds the value in input form with progress percentage.
 * @param {number} [growingSpeed] - Progress Bar change rate.
 */
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

/**
 * Validates string to match numbers from 0 to 100.
 * @param {string} inputString - The string we want to validate.
 * @return {string} The string with number from 0 to 100 or empty string if doesn't fit the conditions.
 */
function validateInput(inputString) {
    if (inputString.length === 0) {
        return "0";
    }
    if (inputString[0] === '0') {
        return inputString.slice(1);
    }
    if (inputString > 100) {
        return "100";
    }
    return inputString.replace(/[^0-9]/g, "");
}

/**
 * Binds the node found by selector with handler, which will be called after click on node.
 * @param {string} selector - Selector by which the node is searched.
 * @param {function} handler - The function that will be called after the click.
 */
function addClickHandler(selector, handler) {
    const clickedNode = document.querySelector(selector);
    if (!clickedNode) {
        return new Error("node not found");
    }
    clickedNode.addEventListener('click', handler);
}

/**
 * Adds or removes class from node found by selector (If node already has the class then removes it, if dont have -- adds it).
 * @param {string} selector - Selector by which the node is searched.
 * @param {string} className - The removed or added classname.
 */
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

/**
 * Creates setting section
 * @param {number} value - Initial progress percentage.
 * @param {boolean} isAnimated - Initial state of animation toggle.
 * @param {boolean} isHidden - Initial state of hide toggle.
 * @return {HTMLElement} Created settings section node.    
*/
function createSettingsSection(value, isAnimated, isHidden) {
    const settings = createDivWithClassAndText(["progressBar__settings", "settings"]);
    settings.appendChild(createInputWithText("settings__property", "settings__input", "Value", value, "input", "value"));
    settings.appendChild(createInputWithText("settings__property", "settings__checkbox", "Animate", isAnimated, "checkbox", "animate"));
    settings.appendChild(createInputWithText("settings__property", "settings__checkbox", "Hide", isHidden, "checkbox", "hide"));
    return settings;
}

/**
 * Creates input element based on parameters
 * @param {string} [className] - Class name for div that frames the input.
 * @param {string} [inputClassName] - Class name for input element.
 * @param {string} [inputText] - The text next to the input field.
 * @param {number|boolean} [inputValue] - The initial input value.
 * @param {string} [inputType] - The input type.
 * @param {string|number} [id] - The input id.
 * @return {HTMLElement} - Div element with input and its text.
*/
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

/**
 * Creates a simple div element with class(es) and text in it
 * @param {string|string[]} [className] - Class or many classes for div element.
 * @param {string} [text] - The text that will be inside div element.
 * @return {HTMLElement} - Created div element.
 */
function createDivWithClassAndText(className = "", text = "") {
    const divElem = document.createElement("div");
    Array.isArray(className) ? className.forEach(name => divElem.classList.add(name)) : divElem.classList.add(className);
    divElem.innerHTML = text;
    return divElem;
}
