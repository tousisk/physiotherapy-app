import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword"; 
import VerifyEmail from "./components/auth/VerifyEmail"; // Import VerifyEmail
import PatientList from "./components/patients/PatientList";
import AddPatient from "./components/patients/AddPatient";
import EditPatient from "./components/patients/EditPatient";
import AppointmentList from "./components/appointments/AppointmentList";
import AddAppointment from "./components/appointments/AddAppointment";
import ExerciseList from "./components/exercises/ExerciseList";
import AddExercise from "./components/exercises/AddExercise";
import { UserContext } from "./contexts/UserContext";
import Dashboard from "./components/dashboard/Dashboard"; // Assuming you create Dashboard.js in the components folder

function App() {
    const { user } = useContext(UserContext);

    const PrivateRoute = ({ children }) => {
        return user ? children : <Navigate to="/login" />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} /> 
                <Route path="/verify-email" element={<VerifyEmail />} /> {/* Add VerifyEmail route */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/patients" element={<PrivateRoute><PatientList /></PrivateRoute>} />
                <Route path="/patients/add" element={<PrivateRoute><AddPatient /></PrivateRoute>} />
                <Route path="/patients/edit/:id" element={<PrivateRoute><EditPatient /></PrivateRoute>} />
                <Route path="/appointments" element={<PrivateRoute><AppointmentList /></PrivateRoute>} />
                <Route path="/appointments/add" element={<PrivateRoute><AddAppointment /></PrivateRoute>} />
                <Route path="/exercises" element={<PrivateRoute><ExerciseList /></PrivateRoute>} />
                <Route path="/exercises/add" element={<PrivateRoute><AddExercise /></PrivateRoute>} />
                <Route path="/" element={<PrivateRoute><Navigate to="/patients" /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;