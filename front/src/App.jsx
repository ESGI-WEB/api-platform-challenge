import './App.css'
import Login from "./pages/Login.jsx";
import GlobalFooter from "./components/GlobalFooter.jsx";
import GlobalHeader from "./components/GlobalHeader.jsx";

function App() {

    return (
        <>
            <GlobalHeader />
            <div>
                <Login />
            </div>
            <GlobalFooter />
        </>
    )
}

export default App
