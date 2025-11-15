import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./page/HomePage";
import EventPage from "./page/EventPage";
import ChatPage from "./page/ChatPage";
import MapPage from "./page/MapPage";
import LoginPage from "./page/LoginPage";
import SignupPage from "./page/SignupPage";


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
            </Routes>

        </Router>



    );

}

export default App;

