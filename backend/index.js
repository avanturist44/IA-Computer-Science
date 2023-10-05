import express from 'express'
import mysql from 'mysql'
import 'dotenv/config'
import cors from "cors"
import bcrypt, { hash } from 'bcrypt'
import bodyParser from "body-parser";
import jwt from 'jsonwebtoken'
const saltRounds = 10

const app = express()

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

const db = mysql.createConnection({
    user: process.env.user,
    host: process.env.host,
    password: process.env.password,
    database: process.env.database
})

app.post('/register', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    bcrypt.hash(password, saltRounds, (err, hash) => {

        if (err) {
            console.log(err)
        }

        db.query("INSERT INTO Users (username,password) VALUES (?,?)", [username, hash], (err, result) => {
            console.log(err);
        })
    })
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    db.query("SELECT * FROM Users WHERE username = ?", [username], (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result && result.length > 0) {
            // console.log(result)
            bcrypt.compare(password, result[0].password, (error, response) => {
                if (response) {
                    const tokenPayload = { username: result[0].username }
                    const token = jwt.sign(tokenPayload, process.env.secret_key, { expiresIn: '1h' })

                    res.send({ response, token })
                }
                else if (error) {
                    res.send({ message: "Wrong username/password combination" })
                }
                else {
                    res.send({ message: "Yoooo Mr.White we gotta coooooookkkkk" })
                }
            })
        }
        else {
            res.send({ message: 'User does not exist' })
        }
    })
})

app.post('/add', (req, res) => {
    const username = req.body.username
    const word = req.body.word

    db.query("INSERT INTO User_Words (username, word) VALUES (?,?)", [username, word], (err, result) => {
        if (err) {
            console.log(err)
        }
        if (result && result.length > 0) {
            res.send(result)
        }
    })
})

app.get('/words', (req, res) => {
    db.query("SELECT * FROM Words", (err, result) => {
        if (err) {
            console.log(err)
        }
        if (result && result.length > 0) {
            res.send(result)
        }
    })
})

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.secret_key);
        return decoded;
    } catch (error) {
        console.error(error);
        return null;
    }
}

app.get('/dictionary', (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = verifyToken(token)
    const username = decodedToken.username
    console.log(username)
    if (decodedToken) {
        console.log('decodedToken is not null. Congrats!')
        db.query("SELECT * FROM User_Words WHERE username = ?", [username], (err, result) => {
            // console.log(result)
            if (err) {
                console.log('Something went wrong')
            }
            else if (result && result.length > 0) {
                console.log("Well, result is also not null! Congrats!")
                res.send(result)
            }
        })
    }
    else {
        res.status(401).json({ error: 'Invalid token' });
    }
})

// app.post('/add', (req, res) => {
//     jwt.verify(token, process.env.secret_key, (err, decoded) => {
//         if (err) {
//             console.log('Token verification failed', err)
//         }
//         else {
//             const user_id = decoded.user_id
//             console.log('user ID:', user_id)
//         }
//     })

//     db.query("SELECT word_id FROM Words WHERE word = ?", [word], (err, result) => {
//         if (result) {
//             res.send(result)
//         }
//         else if (err) {
//             res.send({ message: "Error occured" })
//         }
//     })

//     db.query("INSERT INTO User_Words (user_id)")
// })

app.post('/addSample', (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = verifyToken(token)
    const username = req.body.username
    const data = req.body.data
    console.log(data.length)
    if (decodedToken) {
        for (let i = 0; i <= data.length; i++) {
            db.query("INSERT INTO User_Words (username, word, meaning) VALUES (?,?,?)", [username, data[i].word, data[i].meaning], (err, result) => {
                if (err) {
                    console.log("Something went bad")
                }
                else if (result && result.length > 0) {
                    res.send('Adding the sample was successfully done!')
                }
            })
        }
    }
    else {
        res.status(401).json({ error: 'Invalid token' });
    }
})



app.listen(8800, () => {
    console.log('Connected to the backend!')
})
