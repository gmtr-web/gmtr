let dbg = null;
let data = null;
async function load() {
    const response = await fetch("assets/dict.json");
    const json = await response.json();
    data = json;
}
load().then();

function getInput() {
    return register;
}

async function getKnownWords(number) {
    let words = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].v == number)
            words.push(data[i]);
    }

    return words;
}

async function getSimilarWords(input) {
    let words = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].t.toLowerCase().indexOf(input.toLowerCase()) >= 0
            || data[i].w.indexOf(input) >= 0)
            words.push(data[i]);
    }

    return words;
}

async function getRandomPhrase(number) {
    let phraseWords = [];
    let allWords = data;
    let value = 0;

    while (value < number) {
        let availableWords = [];
        for (let i = 0; i < allWords.length; i++) {
            if (allWords[i].v <= number - value)
                availableWords.push(allWords[i]);
        }

        if (availableWords.length == 0) { // start over
            phraseWords = [];
            value = 0;
            continue;
        }

        let word = availableWords[Math.floor(Math.random() * availableWords.length)];
        phraseWords.push(word);
        value += word.v;
    }

    return phraseWords;
}

function clear(id) {
    let element = document.getElementById(id);
    while (element != null && element.firstChild)
        element.removeChild(element.firstChild);
}

function printText(text, align) {
    let div = document.createElement("DIV");
    div.style.textAlign = align;
    div.appendChild(
        document.createTextNode(text)
    );

    document.getElementById("results").appendChild(
        div
    );
}

function printLink(text, href, align) {
    let div = document.createElement("DIV");
    div.style.textAlign = align;

    let link = document.createElement("A");
    link.href = href;
    link.setAttribute("target", "_blank");
    link.appendChild(
        document.createTextNode(text)
    );

    div.appendChild(link);
    document.getElementById("results").appendChild(div);
}

function printOption(text, option, align) {
    let div = document.createElement("DIV");
    div.style.textAlign = align;

    let a = document.createElement("A");
    a.appendChild(document.createTextNode(text));
    a.className = "option";
    a.onclick = option;
    div.appendChild(a);
    document.getElementById("options").appendChild(div);
}

//printOption("list words", onListWords, "right");

function printWords(words) {
    printText("Words:", "left");
    for (let i = 0; i < words.length; i++) {
        let div = document.createElement("DIV");
        div.appendChild(document.createTextNode("(" + words[i].v + ") " + words[i].w + "\n" + words[i].t + "\n\n"));
        div.style.textAlign = "right";
        document.getElementById("results").appendChild(div);
    }
}

function printPhrases(words) {
    let wordStrings = [];
    for (let i = 0; i < words.length; i++)
        wordStrings.push(words[i].w);

    let phrases = [];
    phrases.push(wordStrings.join(" "));
    phrases.push(wordStrings.join(" ").split("").reverse().join(""));
    wordStrings.reverse();
    phrases.push(wordStrings.join(" "));
    phrases.push(wordStrings.join(" ").split("").reverse().join(""));
    dbg = phrases;

    printText("Phrase 1:\n", "left");
    printLink(phrases[0] + "\n\n", "https://translate.google.com/#iw|en|" + phrases[0], "right");
    printText("Phrase 2:\n", "left");
    printLink(phrases[1] + "\n\n", "https://translate.google.com/#iw|en|" + phrases[1], "right");
    printText("Phrase 3:\n", "left");
    printLink(phrases[2] + "\n\n", "https://translate.google.com/#iw|en|" + phrases[2], "right");
    printText("Phrase 4:\n", "left");
    printLink(phrases[3] + "\n\n", "https://translate.google.com/#iw|en|" + phrases[3], "right");
}

let registerStart = new Date();
let register = "";
let registerBlink = setInterval(printRegister, 1000);
function printRegister() {
    clear("register");
    let dateDiff = (new Date()).getUTCSeconds() - (registerStart.getUTCSeconds());
    let dateMod = dateDiff % 2;
    console.log("dD " + dateDiff);
    console.log("dM " + dateMod);
    console.log("dS " + registerStart.getUTCSeconds());
    document.getElementById("register").appendChild(
        document.createTextNode(
            ">" + register + (dateMod == 0 ? "▓" : "")
        )
    );
}

function updateRegister() {
    clearInterval(registerBlink);
    registerBlink = setInterval(printRegister, 1000);
    registerStart = new Date();
    printRegister();
}

function updateOptions() {
    clear("options");
    document.getElementById("options").appendChild(document.createTextNode("\n"));
    if (register == "") {
    }
    else if (!isNaN(parseInt(register))) {
        // show number options
        printOption("List Known Words <", onListWords, "right");
        printOption("Show a Random Word <", onRandomWord, "right");
        printOption("Build a Random Phrase <", onRandomPhrase, "right");
    }
    else {
        // show word options
        printOption("Search for Matching Words <", onSearchWords, "right");
    }
    document.getElementById("options").appendChild(document.createTextNode("\n"));
}

async function onListWords() {
    clear("results");
    printText("Thinking...");
    let words = await getKnownWords(getInput());
    clear("results");
    printWords(words);
}

async function onSearchWords() {
    clear("results");
    printText("Thinking...");
    let words = await getSimilarWords(getInput());
    clear("results");
    printWords(words);
}

async function onRandomWord() {
    clear("results");
    printText("Thinking...");
    let words = await getKnownWords(getInput());
    clear("results");
    printWords([words[Math.floor(Math.random() * words.length)]]);
}

async function onRandomPhrase() {
    clear("results");
    if (getInput() < 2) {
        printText("Please enter a number of 2 or higher.");
        return;
    }

    printText("Thinking...");
    let words = await getRandomPhrase(getInput());
    clear("results");
    printWords(words);
    printPhrases(words);
}

window.onkeydown = function(event) {
    if (event.key == "Backspace")
        register = register.substr(0, register.length - 1);
    else if (/^[a-zA-Z0-9]$/.test(event.key))
        register += event.key;
    else
        return;

    updateRegister();
    updateOptions();
    console.log(event.key);
}

window.onload = function() {
    document.getElementById("register").onclick = function() {
        document.getElementById("hiddenText").focus();
        console.log("clicked register");
    };
    document.getElementById("hiddenText").focus();
}