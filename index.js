const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
    mongoose = require('mongoose');
    Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

mongoose.connect('mongodb://localhost:27017/myflixDB', { useNewUrlParser: true, useUnifiedTopology: true});

// const movies = [
//     {
//         id: 1,
//         title: 'The Boy and the Heron',
//         director: 'Hayao Miyazaki',
//         year: 2023,
//         genre: 'Adventure'
//     },
//     {
//         id: 2,
//         title: 'Castle in the Sky',
//         director: 'Hayao Miyazaki',
//         year: 1986,
//         genre: 'Adventure'
//     },
//     {
//         id: 3,
//         title: 'The Cat Returns',
//         director: 'Hiroyuki Morita',
//         year: 2002,
//         genre: 'Comedy'
//     },
//     {
//         id: 4,
//         title: 'Earwig and the Witch',
//         director: 'Gorô Miyazaki',
//         year: 2020,
//         genre: 'Family'
//     },
//     {
//         id: 5,
//         title: 'From Up On Poppy Hill',
//         director: 'Gorô Miyazaki',
//         year: 2011,
//         genre: 'Drama'
//     },
//     {
//         id: 6,
//         title: 'Grave of the Fireflies',
//         director: 'Isao Takahata',
//         year: 1988,
//         genre: 'War'
//     },
//     {
//         id: 7,
//         title: 'Howl\s Moving Castle',
//         director: 'Hayao Miyazaki',
//         year: 2004,
//         genre: 'Adventure'
//     },
//     {
//         id: 8,
//         title: 'Kiki\s Delivery Service',
//         director: 'Hayao Miyazaki',
//         year: 1989,
//         genre: 'Fantasy'
//     },
//     {
//         id: 9,
//         title: 'My Neighbor Totoro',
//         director: 'Hayao Miyazaki',
//         year: 1988,
//         genre: 'Family'
//     },
//     {
//         id: 10,
//         title: 'My Neighbors The Yamadas',
//         director: 'Isao Takahata',
//         year: 1986,
//         genre: 'Family'
//     },
//     {
//         id: 11,
//         title: 'Nausicaä of the Valley of the Wind',
//         director: 'Hayao Miyazaki',
//         year: 1984,
//         genre: 'Sci-Fi'
//     },
//     {
//         id: 12,
//         title: 'Ocean Waves',
//         director: 'Tomomi Mochizuki',
//         year: 1993,
//         genre: 'Drama'
//     },
//     {
//         id: 13,
//         title: 'Only Yesterday',
//         director: 'Isao Takahata',
//         year: 1991,
//         genre: 'Romance'
//     },
//     {
//         id: 14,
//         title: 'Pom Poko',
//         director: 'Isao Takahata',
//         year: 1994,
//         genre: 'Comedy'
//     },
//     {
//         id: 15,
//         title: 'Ponyo',
//         director: 'Hayao Miyazaki',
//         year: 2008,
//         genre: 'Comedy'
//     },
//     {
//         id: 16,
//         title: 'Porco Rosso',
//         director: 'Hayao Miyazaki',
//         year: 1992,
//         genre: 'Comedy'
//     },
//     {
//         id: 17,
//         title: 'Princess Mononoke',
//         director: 'Hayao Miyazaki',
//         year: 1997,
//         genre: 'Action'
//     },
//     {
//         id: 18,
//         title: 'The Secret World of Arrietty',
//         director: 'Hiromasa Yonebayashi',
//         year: 2010,
//         genre: 'Adventure'
//     },
//     {
//         id: 19,
//         title: 'Spirited Away',
//         director: 'Hayao Miyazaki',
//         year: 2001,
//         genre: 'Adventure'
//     },
//     {
//         id: 20,
//         title: 'Tales from Earthsea',
//         director: 'Gorô Miyazaki',
//         year: 2006,
//         genre: 'Family'
//     },
//     {
//         id: 21,
//         title: 'The Tale of the Princess Kaguya',
//         director: 'Isao Takahata',
//         year: 2013,
//         genre: 'Drama'
//     },
//     {
//         id: 22,
//         title: 'When Marnie Was There',
//         director: 'Hiromasa Yonebayashi',
//         year: 2014,
//         genre: 'Family'
//     },
//     {
//         id: 23,
//         title: 'Whisper of the Heart',
//         director: 'Yoshifumi Kondô',
//         year: 1995,
//         genre: 'Drama'
//     },
//     {
//         id: 24,
//         title: 'The Wind Rises',
//         director: 'Hayao Miyazaki',
//         year: 2013,
//         genre: 'Biography'
//     }
// ];

// const directors = [
//     {
//         id: 1,
//         name: 'Gorô Miyazaki',
//         birthday: 'Jan 21, 1967',
//         about: 'Gorô is the son of Hayao Miyazaki -- he is an animation director as well as a landscape architect. His landscape projects include the Ghibli Museum and Ghibli Park.'
//     },
//     {
//         id: 2,
//         name: 'Hayao Miyazaki',
//         birthday: 'Jan 5, 1941',
//         about: 'Hayao Miyazaki is a Japanese animator, filmmaker, and manga artist. He is a co-founder of Ghibli Studios and is widely regarded as one of the most accomplished filmmakers in animation.',
//     },
//     {
//         id: 3,
//         name: 'Hiromasa Yonebayashi',
//         birthday: 'July 10, 1973',
//         about: 'Hiromasa Yonebayashi is a Japanese animator and director, formerly for Studio Ghibli -- he left the studio after eighteen years in 2014. He established his own studio, Studio Ponoc, in June 2015.'
//     },
//     {
//         id: 4,
//         name: 'Hiroyuki Morita',
//         birthday: 'June 26, 1964',
//         about: 'Hiroyuki Morita is a Japanese animator and director, best known for working on the Studio Ghibli film The Cat Returns (2002). During high school, he produced an indepened animated film that won an animation magazine contest'
//     },
//     {
//         id: 5,
//         name: 'Isao Takahata',
//         birthday: 'Oct 29, 1935',
//         died: 'April 5, 2018',
//         about: 'Isao Takahata was a Japanese director, screenwriter, and producer. He was a co-founder of Studio Ghibli along side Miyazaki and others, where he went on to direct films such as Grave of the Fireflies, Pom Poko, and The Tale of the Princess Kaguya -- which was his last film as director'
//     },
//     {
//         id: 6,
//         name: 'Tomomi Mochizuki',
//         birthday: 'Dec 31, 1958',
//         about: 'Tomomi Mochizuki is a Japanese storyboard artist, screenwriter, and director. He is well known for working with animation studios such as Studio Ghibli, Nippon Animation, and Sunrise. He first gained recognition in the early 1990s after directing the show Ranma 1/2'
//     },
//     {
//         id: 7,
//         name: 'Yoshifumi Kondô',
//         birthday: 'March 31, 1950',
//         died: 'Jan 21, 1998',
//         about: 'Yoshifumi Kondô was a Japanese animator who worked for Studio Ghibli before his passing. His notable works include Kiki\s Delivery Service, Only Yesterday, and Princess Mononoke'
//     }
// ];

// const genres = [
//     {
//         id: 1,
//         name: 'Action',
//         description: 'The protagonist is thrust into a series of events that typically involve violence and physical feats'
//     },
//     {
//         id: 2,
//         name: 'Adventure',
//         description: 'Defined by a journey and is usually located within a fantasy or exoticized setting'
//     },
//     {
//         id: 3,
//         name: 'Biography',
//         description: 'Dramatizes the life of a non-fictional or historically-based person or people'
//     },
//     {
//         id: 4,
//         name: 'Comedy',
//         description: 'Defined by events that are primarily intended to make the audience laugh'
//     },
//     {
//         id: 5,
//         name: 'Drama',
//         description: 'Focused on emotions and defined by conflict, often looking to reality'
//     },
//     {
//         id: 6,
//         name: 'Family',
//         description: 'Contains appropriate content for younger viewers but there may also be components of the film that are geared towards adults'
//     },
//     {
//         id: 7,
//         name: 'Fantasy',
//         description: 'Defined by situations that transcend natural laws and/or by settings inside a fictional universe'
//     },
//     {
//         id: 8,
//         name: 'Romance',
//         description: 'Characterized by an emphasis on passion, emotion, and the affectionate romantic involvement of the main characters'
//     },
//     {
//         id: 9,
//         name: 'Sci-Fi',
//         description: 'Defined by a combination of imaginative speculation and a scientific or technological premise'
//     },
//     {
//         id: 10,
//         name: 'War',
//         description: 'Concerned with warfare, with combat scenes and themes such as the effects of war on society and the moral and human issues raised by war'
//     }
// ];

// let users = [
//     {
//         id: 1,
//         username: 'bettysgarden',
//         name: 'Betty',
//         email: '',
//         movies: []
//     },
//     {
//         id: 2,
//         username: 'meetmebehindthemall',
//         name: 'August',
//         email: '',
//         movies: []
//     }
// ];

app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.static('public'));
app.use(bodyParser.json());

// Get list of all movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

// Get data about single movie
app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => {
            return movie.title === req.params.title;
        })
    );
});

// Get a list of movies by year
app.get('/movies/year/:year', (req, res) => {
    res.json(movies.filter((movies) => {
            return movies.year === parseInt(req.params.year);
        })
    );
});

// Get list of movies by genre
app.get('/movies/genres/:genre', (req, res) => {
    res.json(movies.filter((movies) => {
        return movies.genre == req.params.genre;
    })
);
});

// Get data about a genre
app.get('/genres/:genre/about', (req, res) => {
    res.json(genres.filter((genre) => {
        return genre.name === req.params.genre;
    }))
});

// Get list of all genres
app.get('/genres', (req, res) => {
    res.json(genres);
});

// Get list of movies by director
app.get('/movies/directors/:director', (req, res) => {
    res.json(movies.filter((movie) => {
            return movie.director === req.params.director;
        })
    );
});

// Get data about a director
app.get('/movies/directors/:director/about', (req, res) => {
    res.json(directors.filter((director) => {
        return director.name === req.params.director;
    })
);
});

// Get list of users
app.get('/users', (req, res) => {
    res.json(users);
});

// Add user
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('New user needs a name!')
    }
})

// Update username
app.put('/users/:username', (req, res) => {
    let updatedUser = req.body;
    let user = users.find((user) => { return user.username == req.params.username });

    if (user) {
        user.username = updatedUser.username;
        res.status(200).send('Username updated!');
    } else {
        res.status(400).send('User not updated!')
    }
});

// Delete user
app.delete('/users/:username', (req, res) => {
    let user = users.find((user) => { return user.username === req.params.username });

    if (user) {
        users = users.filter((obj) => { return obj.username !== req.params.username });
        res.status(201).send('User ' + req.params.username + ' was deleted.');
    }
});

// Add movie to favorites
app.post('/users/:username/movies', (req, res) => {
    let newMovie = req.body;
    let user = users.find((user) => { return user.username == req.params.username });

    if (newMovie.title) {
        user.movies.push(newMovie);
        res.status(201).send(newMovie.title + ' added to favorites!');
    } else {
        const message = 'Movie does not exist!';
        res.status(400).send(message);
    }
});

// Delete movie from favorites
app.delete('/users/:username/movies/:title', (req, res) => {
    let user = users.find((user) => { return user.username === req.params.username });

    if (user) {
        user.movies = user.movies.filter((obj) => { return obj.title !== req.params.title });
        res.status(201).send('The movie, ' + req.params.title + ' was removed.');
    }
});

// Get API documentation
app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
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