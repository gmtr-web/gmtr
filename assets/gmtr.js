let data = null;
async function load() {
    const response = await fetch("assets/dict.json");
    const json = await response.json();
    data = json;
}
load().then();

function getNumber() {
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

function clearResults() {
    let results = document.getElementById("results");
    while (results.childNodes.length > 0) {
        results.removeChild(results.childNodes[0]);
    }
}

function displayKnownWords(words) {
    let table = document.createElement("TABLE");
    for (let i = 0; i < words.length; i++) {
        let row = document.createElement("TR");
        let word = document.createElement("TD");
        let trans = document.createElement("TD");
        word.appendChild(document.createTextNode(words[i].w));
        trans.appendChild(document.createTextNode(words[i].t));
        row.appendChild(word);
        row.appendChild(trans);
        table.appendChild(row);
    }

    document.getElementById("results").appendChild(table);
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

function showResultText(text, align) {
    let div = document.createElement("DIV");
    div.style.textAlign = align;
    div.appendChild(
        document.createTextNode(text)
    );

    document.getElementById("results").appendChild(
        div
    );
}

function showResultLink(text, href, align) {
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

let dbg = null;

function displayRandomPhrase(words) {
    showResultText("Words:\n\n", "left");

    let wordStrings = [];
    let wordsDiv = document.createElement("DIV");

    for (let i = 0; i < words.length; i++) {
        wordStrings.push(words[i].w);
        let div = document.createElement("DIV")
        div.appendChild(document.createTextNode("(" + words[i].v + ") " + words[i].w + "\n" + words[i].t + "\n\n"));
        div.style.textAlign = "right";
        document.getElementById("results").appendChild(div);
    }

    let phrases = [];
    phrases.push(wordStrings.join(" "));
    phrases.push(wordStrings.join(" ").split("").reverse().join(""));

    wordStrings.reverse();
    phrases.push(wordStrings.join(" "));
    phrases.push(wordStrings.join(" ").split("").reverse().join(""));
    dbg = phrases;

    showResultText("\n");
    showResultText("Phrase 1:\n", "left");
    showResultLink(phrases[0] + "\n\n", "https://translate.google.com/#iw|en|" + phrases[0], "right");
    showResultText("Phrase 2:\n", "left");
    showResultLink(phrases[1] + "\n\n", "https://translate.google.com/#iw|en|" + phrases[1], "right");
    showResultText("Phrase 3:\n", "left");
    showResultLink(phrases[2] + "\n\n", "https://translate.google.com/#iw|en|" + phrases[2], "right");
    showResultText("Phrase 4:\n", "left");
    showResultLink(phrases[3] + "\n\n", "https://translate.google.com/#iw|en|" + phrases[3], "right");
}

async function onListWords() {
    clearResults();
    showResultText("Thinking...");
    let words = await getKnownWords(getNumber());
    clearResults();
    displayKnownWords(words);
}

async function onRandomWord() {
    clearResults();
    showResultText("Thinking...");
    let words = await getKnownWords(getNumber());
    clearResults();
    displayKnownWords([words[Math.floor(Math.random() * words.length)]]);
}

async function onRandomPhrase() {
    clearResults();
    if (getNumber() < 2) {
        showResultText("Please enter a number of 2 or higher.");
        return;
    }

    showResultText("Thinking...");
    let words = await getRandomPhrase(getNumber());
    clearResults();
    displayRandomPhrase(words);
}
