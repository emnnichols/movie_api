const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
    mongoose = require('mongoose');
    Models = require('./models.js');

const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// mongoose.connect('mongodb://localhost:27017/myflixDB', { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true});

app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// Index page
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
})

// Get list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get data about single movie
app.get('/movies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne(req.params.MovieID)
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a list of movies by year
app.get('/movies/year/:released', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find({ Released: req.params.Released })
        .then((movies) => {
            res.json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get list of movies by genre
app.get('/movies/genres/:genre', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find({ "Genre.Name": req.params.Genre })
        .then((movies) => {
            res.json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get data about a genre
app.get('/movies/genres/:genre/about', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ "Genre.Name": req.params.Genre })
        .then((movie) => {
            res.json(movie.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get list of movies by director
app.get('/movies/directors/:director', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find({ "Director.Name": req.params.director })
        .then((movies) => {
            res.json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get data about a director
app.get('/movies/directors/:director/about', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ "Director.Name": req.params.director })
        .then((movie) => {
            res.json(movie.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get list of users
app.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // if(req.user.Username !== req.params.Username){
    //     return res.status(400).send('Permission denied');
    // }
    await Users.findOne(req.user.Username)
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a user by username
app.get('/profile/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Add user
app.post('/signup',
    [
      check('Username', 'Username is required').not().isEmpty(),
      check('Username', 'Username is too short').isLength({min: 5}),
      check('Username', 'Username contains non alphanumeric characters').isAlphanumeric(),
      check('Password', 'Password is required').not().isEmpty(),
      check('Password', 'Password is too short').isLength({min: 8}),
      check('Email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) => {

        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => { res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        })
})

// Update user info by username
app.put('/profile/:Username/account', 
[
  check('Username', 'Username is required').not().isEmpty(),
  check('Username', 'Username is too short').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Password', 'Password is too short').isLength({min: 8}),
  check('Email', 'Email does not appear to be valid').isEmail()
], passport.authenticate('jwt', { session: false }), async (req, res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }

    await Users.findOneAndUpdate({ Username: req.params.Username }, { $set: 
        {
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    { new: true })
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
});

// Delete user by username
app.delete('/profile/:Username/account', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Add movie to favorites
app.post('/profile/:Username/movies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.movieId }
    },
    { new: true })
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Delete movie from favorites
app.delete('/profile/:Username/movies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.movieId }
    },
    { new: true })
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
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
const port = process.env.PORT || 8080;

app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});