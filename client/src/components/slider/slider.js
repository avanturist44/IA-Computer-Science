import { useEffect, useState } from "react";
import './slider.css'

function GetWords() {

  const [data, setData] = useState([])
  const [message, setMessage] = useState('')

  async function fetchWords() {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8800/words', {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const responseData = await response.json()
      setData(responseData)
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchWords()
  }, [])

  async function addSample(words) {
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token.split('.')[1]));
      const username = payload.username

      await fetch("http://localhost:8800/addSample", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          data: words
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          mode: "no-cors"
        }
      })
        .then(res => res.json())
        .then(message => {
          setMessage(message)
        })
    }
    catch (err) {
      console.log(err)
    }
  }

  const slangwords = data.slice(0, 138)
  const slangwordssocialmeadia = data.slice(138)

  return (
    <div className="container">
      <h3>Slang Words</h3>
      <div className="slang-words">
        {slangwords.map((item, index) => (
          <div key={index}>
            <strong>{item.word}</strong>: {item.meaning}
          </div>
        ))}
      </div>
      <button className="1" onClick={addSample(slangwords)}>Add a sample</button>

      <div className="slang-words-social-media-2023">
        <h3>Slang Words Social Media 2023</h3>
        {slangwordssocialmeadia.map((item, index) => (
          <div key={index}>
            <strong>{item.word}</strong>: {item.meaning}
          </div>
        ))}
      </div>

      <button className="2" onClick={addSample(slangwordssocialmeadia)}>Add a sample</button>
      {/* <div className="button">
        <button onClick={addSample}>Add a sample</button>
        <h2>{message}</h2>
      </div> */}
    </div>
  )
}



export default GetWords