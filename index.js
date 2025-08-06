//PARTE 3C - USANDO LA BASE DE DATOS EN LOS CONTROLADORES DE RUTA
//const http = require('http');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Note = require('./models/note.js')
//const whiteList = ['http://localhost:5173']
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

/*let notes = [
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
    //response.json(notes);
    Note.find({}).then(notes => {
        response.json(notes)
    })
})
//get one note
app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id).then(note => {
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    }).catch(error => {
        next(error)
        /*
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })*/
    })
    /*
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
    */
})

/*delete one note
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    //notes = notes.filter(n => n.id !== id)
    response.status(204).end()
})*/

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}

//add one note
app.post('/api/notes', (request, response, next) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json(
            {
                error: 'Content missing'
            }
        )
    }
    /*const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId()
    }*/

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    //notes = notes.concat(note)
    //console.log(note)
    //console.log(request.headers)
    note.save().then(savedNote => {
        response.json(savedNote)
    }).catch(error => next(error))
})

//update one note
app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true, runValidators: true, context: 'query' }).then(updatedNote => {
        response.json(updatedNote)
    }).catch(error => next(error))
})

//delete one note
app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(unknownEndpoint)

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)