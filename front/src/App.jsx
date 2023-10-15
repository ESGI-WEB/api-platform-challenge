import {useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [count, setCount] = useState(0)
    const [pong, setPong] = useState('calling backend...')

    // call ping pong api route
    const pingPong = () => {
        fetch(import.meta.env.VITE_API_ENDPOINT + '/ping', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }

                return response.json()
            })
            .then((data) => setPong(data.message + ', backend works! :D'))
            .catch((error) => {
                setPong('backend not working :( check console errors')
                console.error(error)
            });
    }

    useEffect(() => {
        pingPong();
    }, []);

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <h2>{pong}</h2>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
