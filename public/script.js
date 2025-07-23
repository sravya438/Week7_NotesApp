document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("note-form");
  const notesList = document.getElementById("notes-list");

  // Function to fetch and display notes
  const fetchNotes = async () => {
    const res = await fetch("/notes");
    const notes = await res.json();
    notesList.innerHTML = "";
    notes.forEach(note => {
      const noteDiv = document.createElement("div");
      noteDiv.classList.add("note");
      noteDiv.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <button onclick="deleteNote('${note.id}')">Delete</button>
      `;
      notesList.appendChild(noteDiv);
    });
  };

  // Add new note
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("note-title").value;
    const content = document.getElementById("note-content").value;
    await fetch("/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
    form.reset();
    fetchNotes();
  });

  // Delete note (we’ll define deleteNote in global scope)
  window.deleteNote = async (id) => {
    await fetch(`/notes/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  // Initial load
  fetchNotes();
});