import express from 'express'
import mysql from 'mysql'
import 'dotenv/config'
import cors from "cors"
import bcrypt, { hash } from 'bcrypt'
import bodyParser from "body-parser";
import cookieParser  from "cookie-parser";
import session from "express-session";

const saltRounds = 10

const app = express()

app.use(express.json())
app.use(cors())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}))

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.use(session({
    key: process.env.key,
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24
    }
}))

const db = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

app.post('/register', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    
    bcrypt.hash(password, saltRounds, (err, hash) => {

        if(err) {
            console.log(err)
        }

        db.query("INSERT INTO Users (username,password) VALUES (?,?)", [username, hash], (err, result)=> {
            console.log(err);
        })
    })
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query("SELECT * FROM Users WHERE username = ?;", username, (err, result) => {
        if (err) {
            res.send({err});
            return; 
        }
        if (result && result.length > 0) {
            bcrypt.compare(password, result[0].password, (error, response) => {
                if (response) {
                    req.session.user = result;
                    console.log(req.session.user);
                    res.send(result);
                } else {
                    res.send({message: "Wrong username/password combination"});
                }
            });
        } else {
            res.send({message: "User doesn't exist"});
        }
    });
});


app.get('/login', (req, res) => {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user})
    } else {
        res.send({loggedIn: false})
    }
})


app.post('/add', (req, res) => {
    const word = req.body.word;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send({message: 'Unauthorized. Please login.'});
    }

    db.query("SELECT * FROM Users WHERE id = ?", [userId], (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).send({message: 'An error occurred.', error: err});
        } if(result.length > 0) {
                db.query("INSERT INTO UserWords (user_id, word, meaning) VALUES (?, ?, ?)", [userId, word, meaning], (err, result) => {
                    if(err) {
                        console.log(err);
                        return res.status(500).send({message: 'An error occurred while adding the word.', error: err});
                    }
                    
                    return res.status(200).send({message: 'Word added successfully!'});
                });
            } else {
                // Если пользователь не существует, отправляем сообщение об ошибке
                return res.status(400).send({message: 'Invalid user_id. The user does not exist.'});
            }
    })
})

app.post('/check', (req, res) => {
    const word = req.body.word
    db.query("SELECT meaning FROM Words WHERE word = ?", [word], (err, result) => {
        if(err) {
            res.send({err})
        }
        else if (result && result.length > 0) {
            res.send(result)
        }
    })
})

app.get('/dictionary', (req, res) => {
    const word = req.query.word
    const meaning = req.query.meaning
    db.query("SELECT * FROM UserWords WHERE id = ?", [word, meaning], (err, result) => {
        if(err) {
            res.send({err})
        }else if (result && result.length > 0) { 
            res.send(result);
        }else {
            res.send(result)
        } 
    })
})


app.listen(8800, () => {
    console.log('Connected to the backend!')
})

