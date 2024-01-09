const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

let topMovies = [
    {
        title: 'Howl\'s Moving Castle',
        director: 'Hayao Miyazaki',
        year: '2004'
    },
    {
        title: 'Coraline',
        director: 'Henry Selick',
        year: '2009'
    },
    {
        title: 'Eternal Sunshine of the Spotless Mind',
        director: 'Michel Gondry',
        year: '2004'
    },
    {
        title: '10 Things I Hate About You',
        director: 'Gil Junger',
        year: '1999'
    },
    {
        title: 'Addams Family Values',
        director: 'Barry Sonnenfeld',
        year: '1993'
    },
    {
        title: 'Labyrinth',
        director: 'Jim Henson',
        year: '1986'
    },
    {
        title: 'Practical Magic',
        director: 'Griffin Dunne',
        year: '1998'
    },
    {
        title: 'Moulin Rouge!',
        director: 'Baz Luhrmann',
        year: '2001'
    },
    {
        title: 'Dungeons & Dragons: Honor Among Thieves',
        director: 'John Francis Daley and Jonathan Goldstein',
        year: '2023'
    },
    {
        title: 'Godzilla Minus One',
        director: 'Takashi Yamazaki',
        year: '2023'
    }
];

app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// error handling
app.use ((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});