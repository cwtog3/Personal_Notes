const notesList = document.querySelector(".my-notes");
console.log(notesList);
const notesHeading = notesList
    ? notesList.querySelector("h1")
    : null;

//пример данных
const defaultNotes = [
    {
        id: crypto.randomUUID(),
        date: "16.10.2026",
        text: "meow",
        question: "meow?",
        tags: ["учёба", "развитие"]
    },
    {
        id: crypto.randomUUID(),
        date: "16.10.2025",
        text: "Заметила облако в форме кота",
        question: "Вопрос дня: Что тебя удивило сегодня?",
        tags: ["природа"]
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
    if (answer === "") {
        answerInput.setCustomValidity("Введите текст заметки");
        answerInput.reportValidity();
        return;
    }
    answerInput.setCustomValidity("");
    const newNote = {
        id: crypto.randomUUID(),            //создание уникального id для каждой заметки
        date: new Date().toLocaleDateString("ru-RU"),
        question: "Как вы чувствуете себя сегодня?",
        text: answer,
        tags: []
    };
    notes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(notes));
    answerInput.value = "";         //очищает поле ввода заметки после сохранения предыдущей
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
    const tags = document.createElement("p");
    article.append(date);
    article.append(question);
    article.append(text);
    article.append(tags);
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Удалить";
    deleteButton.dataset.id = note.id;
    deleteButton.classList.add("delete-note");
    date.textContent = note.date;
    question.textContent = note.question;
    text.textContent = note.text;
    tags.textContent = note.tags.map(function (tag) {return "#" + tag;}).join(" ");
    article.append(deleteButton);
    return article;
}
//отображение данных из массива заметок на сайте
function renderNotes(notesToRender) {
    if (!notesList) {
        return;
    }
    const articles = notesList.querySelectorAll("article");
    articles.forEach(function (article) {
        article.remove();
    });
    notesToRender.forEach(function (note) {
        const article = createNote(note);
        notesList.append(article);
    });
}
renderNotes(notes);

//кнопка удаления
if (notesList) {
    notesList.addEventListener("click", function (event) {
        const button = event.target.closest(".delete-note");
        if (!button) {
            return;
        }
        const id = button.dataset.id;
        notes = notes.filter(function (note) {
            return note.id !== id;
        });
        localStorage.setItem("notes", JSON.stringify(notes));
        renderNotes(notes);
    });
}

const allTags = [];
notes.forEach(function (note) {
    note.tags.forEach(function (tag) {
        if (!allTags.includes(tag)) {
            allTags.push(tag);
        }
    });
});

//поиск и фильтрация
function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedTags = tagsSelect.value;
    const result = notes.filter(function (note) {
        const matchSearch = note.text.toLowerCase().includes(query) ||
                   note.question.toLowerCase().includes(query);
        const matchTag = selectedTags === "" || note.tags.includes(selectedTags);
        return matchSearch && matchTag;
    });
    renderNotes(result);
}

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#query");
const tagsSelect = document.querySelector("#tags");
if (searchInput && searchForm) {
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        applyFilters();
    });
}