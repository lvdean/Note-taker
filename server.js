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
  // res.status(200).json(data);

  // Items in req.body

  const { title, text } = req.body
  // let response;
  const randomID = uuidv4().slice(0, 4)
  const newNote = {
    title,
    text,
    id: randomID
  };


  // read db.son file
  fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {

    const parsedData = JSON.parse(data)
    parsedData.push(newNote)
    console.log(parsedData, 'lauren')
    //writing a new note to db folder
    fs.writeFile(`db/db.json`, JSON.stringify(parsedData), (err) => {
      // find render code
      // console.log(data);
      // res.status(200).json(JSON.parse(data));
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


//   res.json(`Note has been added!`);
// } else {
//   res.json('Note must contain both title and text');
// }


// Log the response body to the console
// console.log(req.body);



// DELETE  request for notes

app.delete('/api/notes', (req, res) => {
  console.info(`DELETE/api/notes`);
  res.status(200).json(reviews);
})

// write note to file
// fs.writeFile(`./db/db.json`)

// GET/api/notes should return the notes.html file
// GET * should return the index.html file
app.listen(3000, () => console.log('server is running'));
