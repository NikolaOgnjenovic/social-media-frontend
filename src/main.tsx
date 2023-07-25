import ReactDOM from 'react-dom/client'
import Feed from './pages/feed.tsx'
import Folders from './pages/folders.tsx'
import './css/index.css'
import {BrowserRouter, Navigate, Route, Routes,} from "react-router-dom";
import Navbar from "./components/navbar.tsx";
import Login from "./pages/login.tsx";
import Register from "./pages/register.tsx";
import Chart from "./pages/chart.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Navigate to="/login"/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/feed" element={<Feed/>}/>
            <Route path="/folders" element={<Folders/>}/>
            <Route path="/chart" element={<Chart/>}/>
        </Routes>
        <footer>
            <p>By <a href="https://github.com/NikolaOgnjenovic" target="_blank">Mrmi</a></p>
        </footer>
    </BrowserRouter>
)