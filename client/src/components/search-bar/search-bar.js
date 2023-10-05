import { useEffect, useState } from "react"
import React from "react"

export default function SearchBar() {

  const [word, setWord] = useState('')
  const [meaning, setMeaning] = useState('')
  const [userWord, setUserWord] = useState('')
  const [data, setData] = useState([])

  async function SearchWord() {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      const data = await response.json()
      setMeaning(data[0].meanings[0].definitions[0].definition)
    }
    catch {
      setMeaning("Something went bad")
    }
  }

  async function AddWord() {
    const token = localStorage.getItem('token')
    const payload = JSON.parse(atob(token.split('.')[1]));
    const username = payload.username
    // console.log(word, token)
    try {
      fetch('http://localhost:8800/add', {
        method: "POST",
        body: JSON.stringify({
          username: username,
          word: word,
        }),
        headers: {
          "Content-Type": "application/json",
          mode: "no-cors"
        }
      })
        .then(response => response.json())
        .then(data => {
          setUserWord(data.word)
        })

    }
    catch (err) {
      console.log(err)
    }
  }

  async function ShowWords() {
    const token = localStorage.getItem('token')
    try {
      fetch(`http://localhost:8800/dictionary`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      })
        .then(response => response.json())
        .then(data => {
          setData(data)
        })
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    ShowWords()
  }, [])


  // console.log(data)
  // console.log(Object.values(data))
  return (
    <React.Fragment>
      <div className="search-bar">
        <input type="text" onChange={(e) => { setWord(e.target.value) }}></input>
        <button onClick={SearchWord}>Search</button>
        <button onClick={AddWord}>Add the word</button>
        <h1>{meaning}</h1>

        <div className="dictionary">
          <h2>dictionary</h2>
          {data.map((item, index) => (
            <div key={index}>
              <strong>{item.word}</strong>: {item.meaning}
            </div>
          ))}
        </div>

      </div>
    </React.Fragment>

  )
}
