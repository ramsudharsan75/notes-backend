require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Note = require("./models/note");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) =>
  Note.find({}).then((notes) => response.json(notes))
);

app.get("/api/notes/:id", (request, response) =>
  Note.findById(request.params.id).then((note) => {
    response.json(note);
  })
);

app.put("/api/notes/:id", (request, response) =>
  Note.findById(request.params.id).then((note) => {
    note.important = !note.important;
    Note.findByIdAndUpdate(request.params.id, note).then(() =>
      response.json(note)
    );
  })
);

app.delete("/api/notes/:id", (request, response) =>
  Note.findByIdAndDelete(request.params.id).then(() =>
    response.status(204).send()
  )
);

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
