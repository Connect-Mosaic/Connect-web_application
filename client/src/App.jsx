import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./page/HomePage";
import EventPage from "./page/EventPage";
import ChatPage from "./page/ChatPage";
import MapPage from "./page/MapPage";
import LoginPage from "./page/LoginPage";
import SignupPage from "./page/SignupPage";
import About from "./page/About";
import Resources from "./page/Resources";



function App() {

    return (
        <Router>



            <Routes>

                <Route path='/' element={<MainLayout><HomePage /></MainLayout>} />

                <Route path='/events' element={<MainLayout><EventPage /></MainLayout>} />

                <Route path='/chat' element={<MainLayout><ChatPage /></MainLayout>} />

                <Route path='/map' element={<MainLayout><MapPage /></MainLayout>} />

                <Route path="/login" element={<LoginPage />} />
                
                <Route path="/signup" element={<SignupPage />} />

                 <Route path="/about" element={<About />} />

                 <Route path="/resources" element={<Resources />} />
            </Routes>

        </Router>


    );

}

export default App;

