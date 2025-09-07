const outerButton = document.querySelector(".outer-button");

const neutralLightColor = "#b2b7ba";
const correctLightColor = "#9add7b";
const incorrectLightColor = "#c25c5c";
const shortPatternLightColor = "#827bdd";
const longPatternLightColor = "#7ba2dd";

const shortPressLightColor = "#ddb67b";
const longPressLightColor = "#ddd87b";

const goLightColor = "#00ff00";
const stopLightColor = "#ff0000";

const pressDownSound = new Audio("audio/press-down.wav");
const pressUpSound = new Audio("audio/press-up.wav");


let started = false;
let userTurn = true;

let pressStartTime = 0;
let shortPressTime = 300;

let pattern = [];
let userInput = [];

let lightTimeout;
let patternTimeouts = [];

let stage = 1;

let reactionGamesCompleted = 0;

outerButton.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault(); 
    }
});

document.addEventListener("mousedown", () => {
    pressDownSound.play();
    pressStartTime = Date.now();
    if (userTurn) {
        if (started) {
            if (stage == 2) {
                reactionGameCheck();
                return;
            }
            changeLightColor(shortPressLightColor);
            lightTimeout = setTimeout(() => {
                changeLightColor(longPressLightColor);
            }, shortPressTime);
        }
    } else {
        endGame();
    }
});

document.addEventListener("mouseup", () => {
    pressUpSound.play();
    if (stage == 1) {
        clearTimeout(lightTimeout);
        changeLightColor(neutralLightColor);
        const pressDuration = Date.now() - pressStartTime; 
        if (started) {
            if (userTurn) {
                if (stage == 1) {
                    if (pressDuration <= shortPressTime) {
                    userInput.push("short");
                    checkUserInput();
                    } else {
                        userInput.push("long");
                        checkUserInput();
                    }
                }
            } else {
                endGame();
            }
        } else {
            startGame();
        }
    }
});

function startGame() {
    if (stage == 1) {
        if (lightTimeout) {
            clearTimeout(lightTimeout);
        }

        started = true;
        changeLightColor(correctLightColor);
        lightTimeout = setTimeout(() => {
            changeLightColor(neutralLightColor);
            setTimeout(() => {
                generateNextPattern();
                playPattern();
            }, 300);
        }, 1000);
    }
}

function endGame() {
    patternTimeouts.forEach(t => clearTimeout(t));
    patternTimeouts = [];

    if (lightTimeout) {
        clearTimeout(lightTimeout);
    }

    changeLightColor(incorrectLightColor);
    started = false;
    pattern = [];
    userInput = [];
    userTurn = true;
    reactionGamesCompleted = 0;
    stage = 1;
    lightTimeout = setTimeout(() => {
        changeLightColor(neutralLightColor);
    }, 1000);
}

function generateNextPattern() {
    if (Math.random() < 0.5) {
        pattern.push("short");
    } else {
        pattern.push("long");
    }
}

function playPattern() {
    patternTimeouts.forEach(t => clearTimeout(t));
    patternTimeouts = [];

    let delay = 0; 

    for (let i = 0; i < pattern.length; i++) {
        const t1 = setTimeout(() => {
            changeLightColor(pattern[i] == "short" ? shortPatternLightColor : longPatternLightColor);

            let duration = pattern[i] == "short" ? shortPressTime * 1.5 : shortPressTime * 3;

            const t2 = setTimeout(() => {
                changeLightColor(neutralLightColor);
            }, duration);

            patternTimeouts.push(t2);

        }, delay);

        patternTimeouts.push(t1);

        delay += pattern[i] == "short" ? shortPressTime * 3 : shortPressTime * 4;
    };

    const t3 = setTimeout(() => {
        changeLightColor(correctLightColor);
        const t4 = setTimeout(() => {
            userTurn = true;
            changeLightColor(neutralLightColor);
        }, 1000);

        patternTimeouts.push(t4);

    }, delay);

    patternTimeouts.push(t3);
}

function checkUserInput() {
    for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] !== pattern[i]) {
            endGame();
            return;
        }
    }

    if (userInput.length == pattern.length) { 
        changeLightColor(correctLightColor);
        userTurn = false;
        userInput = [];
        lightTimeout = setTimeout(() => {
            changeLightColor(neutralLightColor);
            generateNextPattern();
            if (pattern.length > 5) {
                stage++;
                reactionGame();
            } else {
                playPattern();
            }
        }, 1000);
    }
}

function reactionGame() {
    changeLightColor(stopLightColor);
    let randomDelay = Math.floor(Math.random() * 5000) + 3000;
    userTurn = false;
    lightTimeout = setTimeout(() => {
        changeLightColor(goLightColor);
        userTurn = true;
        lightTimeout = setTimeout(() => {
            userTurn = false;
            endGame();
        }, 400);
    }, randomDelay);
}

function reactionGameCheck() {
    if (lightTimeout) {
        clearTimeout(lightTimeout);
    }
    reactionGamesCompleted++;
    if (reactionGamesCompleted < 5) {
        reactionGame();
    } else {
        stage++;
        changeLightColor(correctLightColor);
        lightTimeout = setTimeout(() => {
            changeLightColor(neutralLightColor);
        }, 1000);
    }
}

function changeLightColor(color) {
    document.documentElement.style.setProperty('--light-color', color);
}