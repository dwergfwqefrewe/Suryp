import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Articles from "./pages/Articles"
import EditArticle from "./pages/EditArticle"
import NavBar from "./components/Navbar"
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import Messenger from "./components/Messenger"


const App = () => {
    return (
        <Router>
            <div className="main-container">
                <NavBar/>
                <main className="page-container">
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/" element={<Articles/>} />
                        <Route path="/profile" element={<Profile/>} />
                        <Route path="/messenger" element={<Messenger/>}/>
                        <Route path="/edit-article/:id" element={<EditArticle/>}/>
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App
