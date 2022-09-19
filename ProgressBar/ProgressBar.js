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

function createSettingsSection() {
    const settings = createDivWithClassAndText(["progressBar__settings", "settings"]);
    settings.appendChild(createInputWithText("Value", "settings__value", "input", "value"));
    settings.appendChild(createInputWithText("Animate", "settings__animate", "checkbox", "animate"));
    settings.appendChild(createInputWithText("Hide", "settings__hide", "checkbox", "hide"));
    return settings;
}

function createInputWithText(inputText = "", className = "" , inputType = "", id = String(Date.now())) {
    const inputContainer = createDivWithClassAndText(className);
    const input = document.createElement("input");
    input.type = inputType;
    input.id = id;
    // if(inputType === "checkbox") {
    //     const label = document.createElement("label");
    //     label.for = id;
    //     label.innerHTML = inputText;
    //     inputContainer.appendChild(label);
    // }

    const text = document.createElement("span");
    text.innerHTML = inputText;

    inputContainer.appendChild(input);
    inputContainer.appendChild(text)
    return inputContainer;
}

function createDivWithClassAndText(className = "", text = "") {
    const divElem = document.createElement("div");
    Array.isArray(className)
        ? className.forEach(name => divElem.classList.add(name))
        : divElem.classList.add(className);
    divElem.innerHTML = text;
    return divElem;
}
