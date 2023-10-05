import React, { useState } from "react"
import './registrationLogin.css'

function RegistrationLogin() {
  const [usernameReg, setUsernameReg] = useState('')
  const [passwordReg, setPasswordReg] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [showFormRegistration, setShowFormRegistration] = useState(false)
  const [showFormLogin, setShowFormLogin] = useState(false)

  const [loginStatus, setLoginStatus] = useState(false)

  async function login() {
    console.log(username, password)
    try {
      fetch("http://localhost:8800/login", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
          mode: "no-cors"
        }
      })
        .then(response => response.json())
        .then(data => {
          localStorage.setItem('token', data.token)
          console.log(localStorage)
        })
      setLoginStatus(!loginStatus)
    }
    catch (error) {
      console.error(error)
    }
  }

  /**
   * users array
   * 
   * dictionary user array
   * - user token
   * -- words array
   */

  async function register() {
    console.log(usernameReg, passwordReg)
    try {
      const response = await fetch("http://localhost:8800/register", {
        method: "POST",
        body: JSON.stringify({
          username: usernameReg,
          password: passwordReg
        }),
        headers: {
          "Content-Type": "application/json",
          mode: "no-cors"
        }
      })
      console.log(response)
    }
    catch (error) {
      console.error(error)
    }
  }

  function toggleFormRegistration() {
    setShowFormRegistration(!showFormRegistration)
  }

  function toggleFormLogin() {
    setShowFormLogin(!showFormLogin)
  }

  return (
    <div className="App">
      <button onClick={toggleFormRegistration}>Register</button>
      <div className="registration">
        <div className={showFormRegistration ? '' : 'on-hide'}>
          <h1>Registration</h1>
          <label>Username</label>
          <input type="username" onChange={(e) => { setUsernameReg(e.target.value) }} />
          <label>Password</label>
          <input type="password" onChange={(e) => { setPasswordReg(e.target.value) }} />
          <button onClick={register}>Register</button>
        </div>
      </div>

      <div className="login">
        <button onClick={toggleFormLogin}>Login</button>
        <div className={showFormLogin ? '' : 'on-hide'}>
          <h1>Login</h1>
          <label>Username</label>
          <input type="username" onChange={(e) => { setUsername(e.target.value) }} />
          <label>Password</label>
          <input type="password" onChange={(e) => { setPassword(e.target.value) }} />
          <button onClick={login}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default RegistrationLogin