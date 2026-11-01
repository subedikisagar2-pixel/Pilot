import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LogDetail from "./pages/LogDetail";
import CreateLog from "./pages/CreateLog";
import EditLog from "./pages/EditLog";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logs/:id" element={<LogDetail />} />
              <Route path="/profile/:userId" element={<Profile />} />

              {/* Protected Routes */}
              <Route
                path="/create-log"
                element={
                  <PrivateRoute>
                    <CreateLog />
                  </PrivateRoute>
                }
              />

              <Route
                path="/edit-log/:id"
                element={
                  <PrivateRoute>
                    <EditLog />
                  </PrivateRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
