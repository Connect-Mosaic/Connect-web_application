import React, { useState, useEffect } from "react";
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
import ProfilePage from "./page/ProfilePage";
import AdminManagementPage from "./page/AdminManagementPage";  // .jsx file
import SearchPage from "./page/SearchPage";
import EventDetail from "./page/EventDetail";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user logined or not
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
  setIsLoggedIn(false);
  window.location.href = "/login";
};

  return (
    <Router>
      <Routes>

        <Route path="/" element={
          <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
            <HomePage />
          </MainLayout>
        } />

        <Route path="/events" element={
          <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
            <EventPage/>
          </MainLayout>
        } />

        <Route path="/chat/:conversationId?" element={
          <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
            <ChatPage />
          </MainLayout>
        } />

        <Route path="/map" element={
          <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
            <MapPage />
          </MainLayout>
        } />

        <Route path="/login" element={
          <LoginPage setIsLoggedIn={setIsLoggedIn} />
        } />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/profile" element={
        <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
        <ProfilePage />
         </MainLayout>
        } />
        <Route path="/about" element={<About />} />

        <Route path="/resources" element={<Resources />} />

        <Route path="/admin/users" element={
          <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
            <AdminManagementPage />
          </MainLayout>
        } />
        
        <Route path="/search" element={
          <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
            <SearchPage />
          </MainLayout>

        }/>

        <Route path="/events/:id" element={
  <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
    <EventDetail />
  </MainLayout>
} />

<Route path="/events/:id/edit" element={
  <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
    {/* You'll need to create an EventEdit component later */}
    <div>Edit Event Page - To be implemented</div>
  </MainLayout>
} />

      </Routes>
    </Router>
  );
}

export default App;