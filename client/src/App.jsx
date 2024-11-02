import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { TaskProvider } from "./contexts/TaskContext.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import SharedTask from "./pages/SharedTask.jsx";

function App() {
  return (
    <>
      <Toaster />
      <AuthProvider>
        <TaskProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/shared-task/:taskId" element={<SharedTask />} />
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </>
  );
}

export default App;
