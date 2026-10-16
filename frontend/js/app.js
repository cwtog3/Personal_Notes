const notesList = document.querySelector(".my-notes");
console.log(notesList);
const notesHeading = notesList
    ? notesList.querySelector("h1")
    : null;

//пример данных
const defaultNotes = [
    {
        date: "16.10.2026",
        text: "meow",
        question: "meow?",
        mood: "meow"
    },
    {
        date: "16.10.2025",
        text: "Заметила облако в форме кота",
        question: "Вопрос дня: Что тебя удивило сегодня?",
        mood: "спокойное"
    }
];
const savedNotes = localStorage.getItem("notes");       //получение раннее сохраненных заметок
let notes = savedNotes ? JSON.parse(savedNotes) : defaultNotes;

//сохранение заметки введенной пользователем
const answerForm = document.querySelector("#answer-form");      //поиск по id
const answerInput = document.querySelector("#answer");
if (answerInput && answerForm) {
    console.log(answerForm);
    console.log(answerInput);
    answerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const answer = answerInput.value.trim();
    const newNote = {
        date: new Date().toLocaleDateString("ru-RU"),
        question: "Как вы чувствуете себя сегодня?",
        text: answer,
        mood: "Не указано"
    };
    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));
    console.log(newNote);
    });
    console.log(notes);
};

//создание новой заметки
function createNote(note) {
    const article = document.createElement("article");
    const date = document.createElement("h3");
    const question = document.createElement("p");
    const text = document.createElement("p");
    article.append(date);
    article.append(question);
    article.append(text);
    date.textContent = note.date;
    question.textContent = note.question;
    text.textContent = note.text;
    return article;
}
//отображение данных из массива заметок на сайте
function renderNotes() {
    if (!notesList) {
        return;
    }
    const articles = notesList.querySelectorAll("article");
    articles.forEach(function (article) {
        article.remove();
    });
    notes.forEach(function (note) {
        const article = createNote(note);
        notesList.append(article);
    });
}
renderNotes();