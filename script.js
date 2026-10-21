const form = document.getElementById("note-form");
const titleInput = document.getElementById("note-title");
const contentInput = document.getElementById("note-content");
const colorInput = document.getElementById("note-color");
const notesContainer = document.getElementById("notes-container");
const emptyMessage = document.getElementById("empty-message");

let notes = [];

try {
  notes = JSON.parse(localStorage.getItem("stickyNotes")) || [];

  if (!Array.isArray(notes)) {
    notes = [];
  }
} catch {
  notes = [];
}

function saveNotes() {
  localStorage.setItem("stickyNotes", JSON.stringify(notes));
}

function renderNotes() {
  notesContainer.replaceChildren();

  emptyMessage.hidden = notes.length > 0;

  notes.forEach((note) => {
    const card = document.createElement("article");
    card.className = `note ${note.color}`;

    const title = document.createElement("h3");
    title.textContent = note.title;

    const content = document.createElement("p");
    content.textContent = note.content;

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.type = "button";

    editButton.addEventListener("click", () => {
      const newTitle = prompt("Edit note title:", note.title);

      if (newTitle === null || !newTitle.trim()) {
        return;
      }

      const newContent = prompt(
        "Edit note content:",
        note.content
      );

      if (newContent === null || !newContent.trim()) {
        return;
      }

      note.title = newTitle.trim();
      note.content = newContent.trim();

      saveNotes();
      renderNotes();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => {
      const confirmed = confirm("Delete this note?");

      if (!confirmed) {
        return;
      }

      notes = notes.filter((item) => item.id !== note.id);

      saveNotes();
      renderNotes();
    });

    actions.append(editButton, deleteButton);
    card.append(title, content, actions);
    notesContainer.appendChild(card);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    return;
  }

  const note = {
    id: `${Date.now()}-${Math.random()}`,
    title: title,
    content: content,
    color: colorInput.value
  };

  notes.unshift(note);

  saveNotes();
  renderNotes();

  form.reset();
});

renderNotes();