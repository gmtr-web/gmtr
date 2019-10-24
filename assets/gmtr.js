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

function clearChildren() {
    let results = document.getElementById("results");
    for (let i = 0; i < results.children.length; i++) {
        results.removeChild(results.children[i]);
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

    clearChildren();
    document.getElementById("results").appendChild(table);
}

async function getRandomPhrase(number) {
    let phraseWords = [];
    let allWords = data;
    let value = 0;

    while (value < number) {
        let word = allWords[Math.floor(Math.random() * allWords.length)];
        let wordNumber = word.v;
        if (value + wordNumber > number)
            continue;

        phraseWords.push(word);
        value += word.v;
    }

    return phraseWords;
}

function displayRandomPhrase(words) {
    clearChildren();

    document.getElementById("results").appendChild(

    );
    let wordsDiv = document.createElement("DIV").append;

    for (let i = 0; i < words.length; i++) {
        let div = document.createElement("DIV");
        div.appendChild(document.createTextNode(words[i].v + "\n"));
        div.appendChild(document.createTextNode(words[i].w + "\n"));
        div.appendChild(document.createTextNode(words[i].t + "\n"));
        document.getElementById("results").appendChild(div);
    }
}

async function onListWords() {
    let words = await getKnownWords(getNumber());
    displayKnownWords(words);
}

async function onRandomWord() {
    let words = await getKnownWords(getNumber());
    displayKnownWords([words[Math.floor(Math.random() * words.length)]]);
}

a