(function createProgressBar() {
    const root = document.querySelector("#root");
    if (root === undefined) {
        return;
    }
    const container = createDivWithClassAndText("container");
    container.appendChild(createDivWithClassAndText("title", "Progress"));

    const progressBar = createDivWithClassAndText("progressBar");
    progressBar.appendChild(createDivWithClassAndText("progressBar__circle"))
    progressBar.appendChild(createSettingsSection());
    container.appendChild(progressBar);
    root.appendChild(container);
})();

(function addListeners() {
    addClickHandler("#animate", () => changeClassPresence(".progressBar__circle", "progressBar__circle_animated"));
    addClickHandler("#hide", () => changeClassPresence(".progressBar__circle", "progressBar__circle_hidden"));
    const clickedNode = document.querySelector("#value");
    const circle = document.querySelector(".progressBar__circle");
    if (!clickedNode) {
        return;
    }
    var inter;
    clickedNode.addEventListener('input', (e) => {
        const inputNumber = validateInput(e.target.value)
        e.target.value = inputNumber;
        let progressValue = getComputedStyle(circle).getPropertyValue("--progress");
        clearInterval(inter);
        inter = setInterval(() => {
            progressValue < inputNumber
                ? progressValue++
                : progressValue--;
            circle.style.setProperty('--progress', String(progressValue));

            if (+inputNumber === +progressValue) {
                clearInterval(inter);
            }
        }, 20);
    });
})();


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

function addClickHandler(selector = "", handler) {
    const clickedNode = document.querySelector(selector);
    if (!clickedNode) {
        return;
    }
    clickedNode.addEventListener('click', handler);
}

function changeClassPresence(selector = "", className) {
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

function createSettingsSection() {
    const settings = createDivWithClassAndText(["progressBar__settings", "settings"]);
    settings.appendChild(createInputWithText("settings__property", "settings__input", "Value", "input", "value"));
    settings.appendChild(createInputWithText("settings__property", "settings__checkbox", "Animate", "checkbox", "animate"));
    settings.appendChild(createInputWithText("settings__property", "settings__checkbox", "Hide", "checkbox", "hide"));
    return settings;
}

function createInputWithText(className = "", inputClassName = "", inputText = "", inputType = "", id = String(Date.now())) {
    const inputContainer = createDivWithClassAndText(className);
    const input = document.createElement("input");
    input.type = inputType;
    input.id = id;
    input.classList.add(inputClassName);


    const text = document.createElement("span");
    text.innerHTML = inputText;

    inputContainer.appendChild(input);
    if (inputType === "checkbox") {
        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.classList.add("toggle");
        inputContainer.appendChild(label);
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
