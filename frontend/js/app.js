const notesList = document.querySelector(".my-notes");
console.log(notesList);

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
        date: "20.10.2026",
        text: "ляляляля",
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
const savedTags = localStorage.getItem("tags");       //получение раннее сохраненных тегов

//массив состояний
const state = {
    notes: savedNotes ? JSON.parse(savedNotes): defaultNotes,
    tags: savedTags ? JSON.parse(savedTags): [],
    newNoteTags: [],
    searchQuery: "",
    selectedTags: [],
    sortBy: "date-desc",
};

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
        tags: [...state.newNoteTags]
    };
    state.notes.push(newNote);
    state.newNoteTags = [];
    renderNoteTagCheckboxes();
    localStorage.setItem("notes", JSON.stringify(state.notes));
    render();
    answerInput.value = "";         //очищает поле ввода заметки после сохранения предыдущей
    console.log(newNote);
    });
    console.log(state.notes);
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

//для отображения заметок после поиска, фильтрации
function getVisibleNotes() {
    const query = state.searchQuery;
    const visibleNotes = state.notes.filter(function (note) {
        const matchesSearch =
            note.text.toLowerCase().includes(query) ||
            note.question.toLowerCase().includes(query);
        const matchesTags = state.selectedTags.length === 0 ||
            state.selectedTags.some(function (tag) {
                return note.tags.includes(tag);
            });
        return matchesSearch && matchesTags;
    });
//    сортировка по дате
    visibleNotes.sort(function (noteA, noteB) {
        const [dayA, monthA, yearA] = noteA.date.split(".").map(Number);
        const [dayB, monthB, yearB] = noteB.date.split(".").map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        if (state.sortBy === "date-asc") {
            return dateA - dateB;
        }
        return dateB - dateA;
    });
    return visibleNotes;
}

function render() {
    const visibleNotes = getVisibleNotes();
    renderNotes(visibleNotes);
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
render();

//кнопка удаления
if (notesList) {
    notesList.addEventListener("click", function (event) {
        const button = event.target.closest(".delete-note");
        if (!button) {
            return;
        }
        const id = button.dataset.id;
        state.notes = state.notes.filter(function (note) {
            return note.id !== id;
        });
        localStorage.setItem("notes", JSON.stringify(state.notes));
        render();
        renderTagCheckboxes();
    });
}

//массив всех тегов
function getAllTags() {
    return state.tags;
}

//создание чекбоксов(тегов)
const tagsDropdown = document.querySelector("#tags-dropdown");
function renderTagCheckboxes() {
    if (tagsDropdown) {
        tagsDropdown.replaceChildren();
        getAllTags().forEach(function (tag) {
                const checkbox = document.createElement("input");
                checkbox.value = tag;
                const labelTag = document.createElement("label");
                checkbox.type = "checkbox";
                checkbox.checked = state.selectedTags.includes(tag);
                checkbox.addEventListener("change", function () {
                    if (checkbox.checked) {
                        if (!state.selectedTags.includes(checkbox.value)) {
                            state.selectedTags.push(checkbox.value);
                        }
                    } else {
                        const filteredByTags = state.selectedTags.filter(function (tag) {
                        return tag !== checkbox.value;
                        });
                    state.selectedTags = filteredByTags;
                    }
                render();
                });
                labelTag.append(checkbox);
                labelTag.append(tag);
                tagsDropdown.append(labelTag);
                });
    }
}
renderTagCheckboxes();

//показ и скрытие перечня тегов у фильтрации
const buttonTag = document.querySelector("#tags-toggle");
if (buttonTag && tagsDropdown) {
    buttonTag.addEventListener("click", function () {
        tagsDropdown.hidden = !tagsDropdown.hidden;
    });
}

//поиск и фильтрация
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#query");
const tagsSelect = document.querySelector("#tags");

function applyFilters() {
    state.searchQuery = searchInput.value.trim().toLowerCase();
    render();
}

if (searchInput && searchForm) {
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        applyFilters();
    });
}

//считывание какую именно сортировку надо провести
const sortSelect = document.querySelector("#sort-by");
if (sortSelect) {
    sortSelect.addEventListener("change", function () {
    state.sortBy = sortSelect.value;
    render();
    });
}

//добавление тегов у заметки
const addTagButton = document.querySelector(".add-tag-button");         //кнопка добавления тегов
const tagsPanel = document.querySelector("#note-tags-panel");           //панель для добавления тегов
const tagInput = document.querySelector("#new-tag-input");                //поле для ввода тегов
const createTagButton = document.querySelector("#create-tag-button");       //кнопка сохранения тега
const noteTagsList = document.querySelector("#note-tags-list");             //список тегов
if (addTagButton && tagsPanel) {
    addTagButton.addEventListener("click", function () {
        tagsPanel.hidden = !tagsPanel.hidden;
    });
}

if (tagInput && createTagButton) {
    createTagButton.addEventListener("click", function () {
        const newTag = tagInput.value.trim();
        if (newTag === "" || state.tags.includes(newTag)) {
            return;
        }
        state.tags.push(newTag);
        localStorage.setItem("tags", JSON.stringify(state.tags));
        tagInput.value = "";
        renderNoteTagCheckboxes();
    });
}

//отображение тегов при создании заметки
function renderNoteTagCheckboxes() {
    if (!noteTagsList) {
        return;
    }
    noteTagsList.replaceChildren();
    state.tags.forEach(function (tag) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = tag;
        checkbox.checked = state.newNoteTags.includes(tag);
        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                if (!state.newNoteTags.includes(tag)) {
                    state.newNoteTags.push(tag);
                }
            } else {
                state.newNoteTags = state.newNoteTags.filter(function (selectedTags) {
                    return selectedTags !== tag;
                });
            }
        })
        const label = document.createElement("label");
        label.append(checkbox);
        label.append(tag);
        noteTagsList.append(label);
    });
}
renderNoteTagCheckboxes();