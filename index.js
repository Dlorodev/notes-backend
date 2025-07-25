const http = require('http');
const express = require('express');
const cors = require('cors');
const whiteList = ['http://localhost:5173']


const app = express();
app.use(express.json());
app.use(cors({ origin: whiteList }));

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    },
    {
        id: 4,
        content: "GET is easy to learn",
        important: false
    }
]

/*
const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end(JSON.stringify(notes))
});
const PORT = 3001;
app.listen(PORT);
console.log(`App running on port ${PORT}`);
*/

//homepage
app.get('/', (request, response) => {
    response.send('<h1>Hello World from Express!</h1>')
    console.log('Request Path -> ', request.path);
    console.log('Request Query -> ', request.query);
})
//get all notes
app.get('/api/notes', (request, response) => {
    response.json(notes);
})
//get one note
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(n => {
        //console.log(n.id, typeof n.id, id, typeof id, n.id === id)
        return n.id === id
    });

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
    console.log(request.params)
    console.log(typeof (note));
})
//delete one note
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(n => n.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    const note = request.body
    return maxId + 1
}

//add one note
app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json(
            {
                error: 'Content missing'
            }
        )
    }

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId()
    }

    notes = notes.concat(note)
    //console.log(note)
    //console.log(request.headers)
    response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))