import {ProgressBar} from "./ProgressBar/ProgressBar.js";

/** Test function that creates Progress bar and uses its methods. */
(function test() {
    const root = document.querySelector("#root");
    if (!root) {
        return new Error("node not found");
    }
    const progressBar = new ProgressBar(root, "Progress", {
        value: 20,
        isHidden: false,
        isAnimated: false,
    });

    setTimeout(() => progressBar.setProgress(35), 3000);
    setTimeout(() => progressBar.turnAnimationOn(), 5000);
    setTimeout(() => progressBar.setProgress(70), 8000);
    setTimeout(() => progressBar.setProgress(80), 11000);
    setTimeout(() => progressBar.setProgress(33), 15000);
    setTimeout(() => progressBar.turnAnimationOff(), 15000);
    setTimeout(() => progressBar.hide(), 18000);
    setTimeout(() => progressBar.setProgress(99), 18500);
    setTimeout(() => progressBar.show(), 20000);
    setTimeout(() => progressBar.turnAnimationOn(), 22000);
    setTimeout(() => progressBar.setProgress(30), 25000);
    setTimeout(() => progressBar.turnAnimationOff(), 27000);
    setTimeout(() => progressBar.setProgress(0), 30000);    
})();
