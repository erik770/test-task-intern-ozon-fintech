import {ProgressBar} from "./ProgressBar/ProgressBar.js";

const root = document.querySelector("#root");
if (root) {
    new ProgressBar(root, "Progress");
}
