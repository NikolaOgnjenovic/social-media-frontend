import ReactDOM from 'react-dom/client'
import Feed from './pages/Feed.tsx'
import Folders from './pages/Folders.tsx'
import './css/index.css'
import {BrowserRouter, Navigate, Route, Routes,} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PopularityChart from "./pages/PopularityChart";
import {ChakraProvider} from '@chakra-ui/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ChakraProvider>
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Navigate to="/login"/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/feed" element={<Feed/>}/>
                <Route path="/folders" element={<Folders/>}/>
                <Route path="/chart" element={<PopularityChart/>}/>
            </Routes>
            <footer>
                <p>By <a href="https://github.com/NikolaOgnjenovic" target="_blank">Mrmi</a></p>
            </footer>
        </BrowserRouter>
    </ChakraProvider>
)