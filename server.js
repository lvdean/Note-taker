const path = require('path')
const express = require('express')
const fs = require('node:fs')
const app = express()
const { v4: uuidv4 } = require('uuid');
uuidv4();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html')));

// get request for notes
app.get('/api/notes', (req, res) => {
  console.info(`GET/api/notes`);

  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
    res.status(200).json(JSON.parse(data));

  });
})

// POST request for notes (to add)
app.post('/api/notes', (req, res) => {
  console.info(`POST/api/notes`);

// Items in req.body
  const { title, text } = req.body
// shorten id created
  const randomID = uuidv4().slice(0, 4)
  const newNote = {
    title,
    text,
    id: randomID
  };

  // read db.son file
  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    // parsethe JSONdata
    const parsedData = JSON.parse(data)
    parsedData.push(newNote)
    // check JSON data
    console.log(parsedData)
    //writing a new note to db folder
    fs.writeFile(`db/db.json`, JSON.stringify(parsedData), (err) => {
      // check status
      const response = {
        status: 'success',
        body: newNote,
      };
      console.log(response);
      res.status(201).json(response);
    }
    );
  });
});

// DELETE  request for notes

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

//reading notes file
fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) =>{
  if (err) {
    return res.status(500).json({ message: 'Error reading notes' });
}

let notes;
try {
    notes = JSON.parse(data);
} catch (parseError) {
    return res.status(500).json({ message: 'Error parsing notes' });
} 
const noteIndex = notes.findIndex(note => note.id === noteId);
        if (noteIndex === -1) {
            return res.status(404).json({ message: 'Note not found' });
        }
 // Remove the note from the array
 notes.splice(noteIndex, 1);

//  write notes to file
 fs.writeFile(`db/db.json`, JSON.stringify(notes,null,2), (err) => {
  if (err) {
    return res.status(500).json({ message: 'Error writing notes' });
}
res.status(204).send(); 
    });
  });
});

app.listen(3000, () => console.log('server is running'));
