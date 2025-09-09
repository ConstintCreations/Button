const outerButton = document.querySelector(".outer-button");
const innerButton = document.querySelector(".inner-button");
const hintButton = document.querySelector(".hint");
const hintText = document.querySelector(".hint-text");

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

let hintActive = false;
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
let colorGamesComplete = 0;

let colorGameColor;
let randomInvalidColorGameColor;
let colorGameCycle = [];

let selectedColor;
let selectedColorID = 0;

const colors = [
    {
        color: "#ffff00",
        validColors: ["#00ff00", "#ff0000"],
        invalidColors: ["#0000ff", "#ffff00", "#ffffff", "#000000", "#00ffff", "#ff00ff"]
    },
    {
        color: "#00ffff",
        validColors: ["#00ff00", "#0000ff"],
        invalidColors: ["#ff0000", "#ffff00", "#ffffff", "#000000", "#00ffff", "#ff00ff"]
    },
    {
        color: "#ff00ff",
        validColors: ["#0000ff", "#ff0000"],
        invalidColors: ["#00ff00", "#ffff00", "#ffffff", "#000000", "#00ffff", "#ff00ff"]
    }
]

outerButton.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault(); 
    }
});

hintButton.addEventListener("mousedown", () => {
    hintActive = true;
    if (stage == 1) {
        hintText.innerHTML = "The light will show you the path.";
    } else if (stage == 2) {
        hintText.innerHTML = "Be Patient.";
    } else if (stage == 3) {
        hintText.innerHTML = "Choose carefully. One is wrong.";
    } else if (stage == 4) {
        hintText.innerHTML = "";
    }
})

hintButton.addEventListener("mouseup", () => {
    setTimeout(() => {
        hintActive = false;
    }, 10);
})

document.addEventListener("mousedown", () => {
    if (hintActive) {
        return;
    }

    innerButton.style.margin = "-155px 0px 0px -170px";
    outerButton.style.margin = "0px 0px 0px -170px";
    outerButton.style.padding = "60px 160px";
    pressDownSound.play();
    pressStartTime = Date.now();

    if (stage != 4) {
        if (userTurn) {
        if (started) {
            if (stage == 2) {
                reactionGameCheck();
                return;
            }
            if (stage == 3) {
                colorGameCheck();
                return;
            }
            changeLightColor(shortPressLightColor);
            lightTimeout = setTimeout(() => {
                changeLightColor(longPressLightColor);
            }, shortPressTime);
        }
    } else {
        if (stage != 1) {
            loseGame();
        }
    }
    }
});

document.addEventListener("mouseup", () => {
    if (hintActive) {
        return;
    }

    innerButton.style.margin = "-215px 0px 0px -170px";
    outerButton.style.margin = "-125px 0px 0px -170px";
    outerButton.style.padding = "120px 160px";
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
                loseGame();
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

function loseGame() {
    stage = 4;
    changeLightColor(incorrectLightColor);
    resetGame();
    patternTimeouts.forEach(t => clearTimeout(t));
    patternTimeouts = [];

    if (lightTimeout) {
        clearTimeout(lightTimeout);
    }
    userTurn = false;
    lightTimeout = setTimeout(() => {
        changeLightColor(neutralLightColor);
        userTurn = true;
    }, 1000);
}

function resetGame() {
    hintText.innerHTML = "";
    started = false;
    patternTimeouts.forEach(t => clearTimeout(t));
    patternTimeouts = [];

    if (lightTimeout) {
        clearTimeout(lightTimeout);
    }

    pattern = [];
    userInput = [];
    userTurn = true;
    reactionGamesCompleted = 0;
    colorGamesComplete = 0;
    selectedColorID = 0;
    stage = 1;
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
            loseGame();
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
                hintText.innerHTML = "";
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
            loseGame();
        }, 500);
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
        hintText.innerHTML = "";
        changeLightColor(correctLightColor);
        lightTimeout = setTimeout(() => {
            changeLightColor(neutralLightColor);
            colorGame();
        }, 1000);
    }
}

function colorGame() {
    userTurn = false;
    colorGameCycle = [];
    colorGameColor = colors[Math.floor(Math.random() * colors.length)];
    randomInvalidColorGameColor = colorGameColor.invalidColors[Math.floor(Math.random() * colorGameColor.invalidColors.length)];
    changeLightColor(colorGameColor.color);
    let tempColorGameCycle = [randomInvalidColorGameColor, colorGameColor.validColors[0], colorGameColor.validColors[1]]
    for (let i = 0; i < 3; i++) {
        const randomColor = tempColorGameCycle[Math.floor(Math.random() * tempColorGameCycle.length)];
        colorGameCycle.push(randomColor);
        tempColorGameCycle.splice(tempColorGameCycle.indexOf(randomColor), 1);
    }
    lightTimeout = setTimeout(() => {
        changeLightColor(neutralLightColor);
        lightTimeout = setTimeout(() => {
            userTurn = true;
            cycleColorOptions();
        }, 1000);
    }, 1000); 
}

function cycleColorOptions() {
    selectedColor = colorGameCycle[selectedColorID];
    changeLightColor(selectedColor);
    lightTimeout = setTimeout(() => {
        if (userTurn) {
            selectedColorID = (selectedColorID + 1) % 3;
            cycleColorOptions();
        }
    }, 500)
}

function colorGameCheck() {
    userTurn = false;
    if (lightTimeout) {
        clearTimeout(lightTimeout);
    }
    if (colorGameColor.validColors.indexOf(selectedColor) > -1) {
        loseGame();
    } else {
        colorGamesComplete++;
        changeLightColor(correctLightColor);
        lightTimeout = setTimeout(() => {
            changeLightColor(neutralLightColor);
            if (colorGamesComplete >= 5) {
                hintText.innerHTML = "";
                stage++;
                winGame();
            } else {
                colorGame();
            }
        }, 1000);
        
        
    }
}

function winGame() {
    hintText.innerHTML = "";
    changeLightColor(correctLightColor);
    setTimeout(() => {
        changeLightColor(neutralLightColor);
        resetGame();
    }, 3000);
}

function changeLightColor(color) {
    document.documentElement.style.setProperty('--light-color', color);
}
