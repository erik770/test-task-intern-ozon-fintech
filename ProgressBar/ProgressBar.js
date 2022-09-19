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
    if(inputType === "checkbox") {
        // input.checked = true;
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
    Array.isArray(className)
        ? className.forEach(name => divElem.classList.add(name))
        : divElem.classList.add(className);
    divElem.innerHTML = text;
    return divElem;
}
