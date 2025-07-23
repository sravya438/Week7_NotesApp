const notesContainer = document.getElementById("notesContainer");
const addNoteBtn = document.getElementById("addNoteBtn");
const noteInput = document.getElementById("noteInput");

// Detect backend URL (works with Live Server and Express server)
const API_BASE_URL = "http://localhost:3000";

// Fetch and display all notes when the page loads
async function fetchNotes() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/notes`);
        const notes = await response.json();
        notesContainer.innerHTML = ""; // Clear previous notes
        notes.forEach(note => displayNote(note));
    } catch (error) {
        console.error("Error fetching notes:", error);
        alert("Failed to load notes. Check the server.");
    }
}

// Display a single note in the DOM
function displayNote(note) {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";
    noteDiv.dataset.id = note.id;

    // Note text
    const noteText = document.createElement("span");
    noteText.textContent = note.text;

    // Delete button (❌)
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => deleteNote(note.id, noteDiv));

    noteDiv.appendChild(noteText);
    noteDiv.appendChild(deleteBtn);
    notesContainer.appendChild(noteDiv);
}

// Add a new note
addNoteBtn.addEventListener("click", async () => {
    const text = noteInput.value.trim();
    if (!text) return alert("Note cannot be empty!");

    try {
        const response = await fetch(`${API_BASE_URL}/api/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const newNote = await response.json();
        displayNote(newNote);
        noteInput.value = ""; // Clear input
    } catch (error) {
        console.error("Error adding note:", error);
        alert("Failed to add note.");
    }
});

// Delete a note
async function deleteNote(id, noteDiv) {
    try {
        await fetch(`${API_BASE_URL}/api/notes/${id}`, { method: "DELETE" });
        noteDiv.remove();
    } catch (error) {
        console.error("Error deleting note:", error);
        alert("Failed to delete note.");
    }
}

// Fetch notes when the page loads
fetch("https://week7-notesapp.onrender.com/api/notes");