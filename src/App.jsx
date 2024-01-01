import './App.css'
import {Route, Routes} from "react-router-dom";
import Main from "./pages/Main.jsx";
import Bar from "./components/Bar.jsx";

function App() {

  return (
    <>
        <Routes>
            <Route path={'/'} element={<Main/>} />
        </Routes>
        <Bar/>
    </>
  )
}

export default App
