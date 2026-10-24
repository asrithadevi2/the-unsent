const STORAGE_KEY = 'unsent-project-notes-v1';
const form = document.querySelector('#message-form');
const textarea = document.querySelector('#message');
const counter = document.querySelector('#counter');
const messages = document.querySelector('#messages');
const total = document.querySelector('#total');

function loadNotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

let notes = loadNotes();

function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    alert('Could not save notes. Check your browser storage settings.');
  }
}

function renderNotes() {
  messages.replaceChildren();
  total.textContent = `${notes.length} ${notes.length === 1 ? 'NOTE' : 'NOTES'}`;

  if (notes.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'Nothing here yet. Some words are waiting to be written. ♡';
    messages.append(empty);
    return;
  }

  notes.forEach((note) => {
    const card = document.createElement('article');
    card.className = 'note';
    card.dataset.mood = note.mood;

    const top = document.createElement('div');
    top.className = 'note-top';
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = `✧ ${note.mood === 'missing' ? 'missing you' : note.mood}`;
    const remove = document.createElement('button');
    remove.className = 'delete';
    remove.type = 'button';
    remove.textContent = '×';
    remove.setAttribute('aria-label', 'Delete this note');
    remove.addEventListener('click', () => {
      if (!confirm('Delete this unsent note?')) return;
      notes = notes.filter((item) => item.id !== note.id);
      saveNotes();
      renderNotes();
    });
    top.append(tag, remove);

    const content = document.createElement('p');
    content.textContent = note.text;
    const date = document.createElement('time');
    date.textContent = new Date(note.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    date.dateTime = note.createdAt;
    card.append(top, content, date);
    messages.append(card);
  });
}

textarea.addEventListener('input', () => {
  counter.textContent = `${textarea.value.length} / 500`;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = textarea.value.trim();
  if (!text) {
    textarea.focus();
    return;
  }
  const mood = form.elements.mood.value;
  notes.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    text,
    mood,
    createdAt: new Date().toISOString()
  });
  saveNotes();
  renderNotes();
  form.reset();
  counter.textContent = '0 / 500';
  document.querySelector('.wall').scrollIntoView({ behavior: 'smooth' });
});

renderNotes();
