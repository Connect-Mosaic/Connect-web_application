import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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
import AdminManagementPage from "./page/AdminManagementPage";
import SearchPage from "./page/SearchPage";
import EventDetail from "./page/EventDetail";
import EventForm from "./components/EventForm"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("jwt");
  });


  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  // Protected Route Wrapper
  const Protected = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/resources" element={<Resources />} />

        {/* Home Page */}
        <Route
          path="/"
          element={
            <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
              <HomePage />
            </MainLayout>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/events"
          element={
            <Protected>
              <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
                <EventPage />
              </MainLayout>
            </Protected>
          }
        />

        <Route
          path="/events/:id/edit"
          element={
            <Protected>
              <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
                <EventForm />
              </MainLayout>
            </Protected>
          }
        />


        <Route
          path="/events/:id"
          element={
            <Protected>
              <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
                <EventDetail />
              </MainLayout>
            </Protected>
          }
        />

        <Route
          path="/chat/:conversationId?"
          element={
            <Protected>
              <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
                <ChatPage />
              </MainLayout>
            </Protected>
          }
        />

        <Route
          path="/map"
          element={
            <Protected>
              <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
                <MapPage />
              </MainLayout>
            </Protected>
          }
        />

        {/* FIXED: Profile now accepts /profile/:userId */}
        <Route
          path="/profile/:userId"
          element={
            <Protected>
              <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
                <ProfilePage />
              </MainLayout>
            </Protected>
          }
        />

        <Route
          path="/admin/users"
          element={
            <Protected>
              <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
                <AdminManagementPage />
              </MainLayout>
            </Protected>
          }
        />

        <Route
          path="/search"
          element={
            <Protected>
              <MainLayout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
                <SearchPage />
              </MainLayout>
            </Protected>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
