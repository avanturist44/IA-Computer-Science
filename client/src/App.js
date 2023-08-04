import React, {useEffect, useState} from "react"
import axios from 'axios'
import './App.css';

function App() {
  const [usernameReg, setUsernameReg] = useState('')
  const [passwordReg, setPasswordReg] = useState('')
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loginStatus, setLoginStatus] = useState('')

  const [word, setWord] = useState('')
  const [meaning, setMeaning] = useState('')

  const register = () => {
    axios.post("http://localhost:8800/register", {username: usernameReg, password: passwordReg}, { withCredentials: true })
    .then((response) => {
      console.log(response)
    })
  }
  
  const login = () => {
    axios.post("http://localhost:8800/login", {username: username, password: password})
    .then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        console.log(response.data)
        // setLoginStatus(response.data[0].username)
      }
    })
  }

  useEffect(() => {
    axios.get("http://localhost:8800/login").then((response) => {
      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0].username)
      }
    })
  }, [])

  const add = () => {
    try {
          axios.post("http://localhost:8800/add", {word: word})
        .then((response) => {
          console.log(response)
        })
    }
    catch (err){
      console.log(err)
    }
  }
  
  const check = () => {
    axios.post(`http://localhost:8800/check?word=${word}`, {word: word})
    .then((response) => {
      if(response.data && response.data[0]) {
        setWord(response.data[0].word)
        setMeaning(response.data[0].meaning)
        console.log(response.data)
      } else if(response.data && response.data.message) {
        setMeaning(response.data.message)
        console.log(meaning)
      } else {
        console.log("An error occurred.")
      }
    }).catch((error) => {
      console.error("An error occurred when making the request: ", error)
    })
  }
  
  const user_words = () => {
    axios.get(`http://localhost:8800/dictionary`, {word: word, meaning: meaning})
    .then((response) => {
      if(response.data) {
        console.log(response.data)
      } else {
        console.log("An error occurred.")
      }
    }).catch((error) => {
      console.error("An error occurred when making the request: ", error)
    })
  }

  return (
    <div className="App">

      <div className="registration">
        <h1>Registration</h1>
        <label>Username</label>
        <input type="text" onChange={(e)=>{setUsernameReg(e.target.value)}}/>
        <label>Password</label>
        <input type="text" onChange={(e)=>{setPasswordReg(e.target.value)}}/>
        <button onClick={register}>Register</button>
      </div>

      <div className="login">
        <h1>Login</h1>
        <input type="text" placeholder="Username..." onChange={(e)=>{setUsername (e.target.value)}}/>
        <input type="password" placeholder="Password..." onChange={(e)=>{setPassword (e.target.value)}}/>
        <button onClick={login}>Login</button>
      </div>

      <h1>{loginStatus}</h1>
      
      <div>
        <input type="text" onChange={(e) => {setWord(e.target.value)}}></input>
        <button onClick={check}>Search for a word</button>
        <button onClick={add}>Add to dictionary</button>
        <button>Ask ChatGpt</button>
        <div>
          <p>{word}</p>
          <p>{meaning}</p>
        </div>
        <div className="user-dictionary">
          <button onClick={user_words}>Show dictionary</button>
        </div>
      </div>
      
    </div>
  );
}

export default App;
