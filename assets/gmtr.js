let dbg = null;
let data = null;
async function load() {
    const response = await fetch("assets/dict.json");
    const json = await response.json();
    data = json;
}
load().then();

function getInput() {
    return document.getElementById("number").value;
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

function clear() {
    let results = document.getElementById("results");
    while (results.childNodes.length > 0) {
        results.removeChild(results.childNodes[0]);
    }
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

async function onListWords() {
    clear();
    printText("Thinking...");
    let words = await getKnownWords(getInput());
    clear();
    printWords(words);
}

async function onSearchWords() {
    clear();
    printText("Thinking...");
    let words = await getSimilarWords(getInput());
    clear();
    printWords(words);
}

async function onRandomWord() {
    clear();
    printText("Thinking...");
    let words = await getKnownWords(getInput());
    clear();
    printWords([words[Math.floor(Math.random() * words.length)]]);
}

async function onRandomPhrase() {
    clear();
    if (getInput() < 2) {
        printText("Please enter a number of 2 or higher.");
        return;
    }

    printText("Thinking...");
    let words = await getRandomPhrase(getInput());
    clear();
    printPhrases(words);
}
