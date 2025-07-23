//import required modules
const express = require("express");
const path = require("path");
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require("uuid"); // For unique IDs


//create an instance of express
const app=express();

//create the port
const PORT=process.env.PORT ||3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(cors());
//Middleware to parse JSON requests
app.use(express.json());

const dataFilePath = path.join(__dirname, "data.json");

const readNotes = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, "[]"); // Create file if not exists
      return [];
    }
    const data = fs.readFileSync(dataFilePath, "utf8").trim();
    if (!data) {
      fs.writeFileSync(dataFilePath, "[]"); // Fix empty file
      return [];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("Corrupt data.json, resetting...", err);
    fs.writeFileSync(dataFilePath, "[]"); // Reset corrupt file
    return [];
  }
};

const writeNotes = (notes) => {
  try{
    fs.writeFileSync(dataFilePath, JSON.stringify(notes, null, 2));
  } catch (err) {
    console.log("Error writing data file",err);
  }
};

//Service static files from 'public' directory
app.use(express.static(path.join(__dirname,"public")));

//Basic route to send index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// GET all notes
app.get("/api/notes", (req, res) => {
  const notes = readNotes();
  res.json(notes);
});
// POST (Create) a note
app.post("/api/notes", (req, res) => {
  const notes = readNotes();
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Note text is required" });
  }

  const newNote = { id: uuidv4(), text: text.trim() };
  notes.push(newNote);
  writeNotes(notes);
  res.status(201).json(newNote);
});
// PUT (Update) a note
app.put("/api/notes/:id", (req, res) => {
  let notes = readNotes();
  const noteId = req.params.id;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Updated note text is required" });
  }

  const noteIndex = notes.findIndex((n) => n.id === noteId);
  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }
  notes[noteIndex].text = text.trim();
  writeNotes(notes);
  res.json(notes[noteIndex]);
});
// DELETE a note
app.delete("/api/notes/:id", (req, res) => {
  let notes = readNotes();
  const noteId = req.params.id;
  const filteredNotes = notes.filter((n) => n.id !== noteId);

  if (filteredNotes.length === notes.length) {
    return res.status(404).json({ error: "Note not found" });
  }

  writeNotes(filteredNotes);
  res.json({ message: "Note deleted" });
});



// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });