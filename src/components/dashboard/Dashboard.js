import React, { useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { UserContext } from "../../contexts/UserContext";
import { Typography, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../App.css";

function Dashboard() {
    const { user } = useContext(UserContext);
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedAppointments, setSelectedAppointments] = useState([]);
    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for collapsible menu
    const navigate = useNavigate();

    // Fetch data from Supabase
    const fetchData = useCallback(async () => {
        if (!user || !user.id) {
            console.error("User data is not available.");
            setIsLoading(false);
            return;
        }
        try {
            // Fetch user name and appointments in parallel
            const [userData, appointmentsData] = await Promise.all([
                supabase
                    .from("users")
                    .select("name")
                    .eq("uid", user.id)
                    .single(),
                supabase
                    .from("appointments")
                    .select("*, patients(name)")
                    .eq("physiotherapistid", user.id),
            ]);

            if (userData.error) {
                console.error("Error fetching user name:", userData.error);
                setError(userData.error);
            } else if (userData.data) {
                setUserName(userData.data.name);
            }

            if (appointmentsData.error) {
                console.error("Error fetching appointments:", appointmentsData.error);
                setError(appointmentsData.error);
            } else {
                setAppointments(appointmentsData.data || []);
            }
        } catch (error) {
            console.error("Unexpected error fetching data:", error);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Fetch data on component mount or when user changes
    useEffect(() => {
        if (user && user.id) {
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [user, fetchData]);

    // Handle logout
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    // Handle date click on calendar
    const handleDateClick = (date) => {
        setSelectedDate(date);
        const formattedDate = formatDate(date); // Format date as Day/Month/Year
        const appointmentsForDate = appointments.filter(
            (appointment) => formatDate(new Date(appointment.date)) === formattedDate
        );
        setSelectedAppointments(appointmentsForDate);
    };

    // Format date as Day/Month/Year
    const formatDate = (date) => {
        return date.toLocaleDateString("en-GB"); // Use 'en-GB' for Day/Month/Year format
    };

    // Toggle menu visibility
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="loading">
                <Typography variant="h6">Loading...</Typography>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="error">
                <Typography variant="h6" color="error">
                    Error: {error.message}
                </Typography>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Side Menu */}
            <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
                <div className="menu-header">
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleMenu}>
                        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h6">Menu</Typography>
                </div>
                <ul>
                    <li>Options</li>
                    <li>Appointments</li>
                    <li>Patients</li>
                    <li>Exercises</li>
                    <li>
                        <Button onClick={handleLogout} style={{ color: "white", textTransform: "none" }}>
                            Logout
                        </Button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Welcome Message */}
                <div className="welcome-message">
                    <Typography variant="h4">Welcome, {userName || "User"}!</Typography>
                </div>

                {/* Calendar and Appointments Section */}
                <div className="calendar-appointments-section">
                    {/* Calendar View */}
                    <div className="calendar-section">
                        <Typography variant="h5">Calendar View</Typography>
                        <Calendar
                            onChange={handleDateClick} // Handle date click
                            value={selectedDate}
                            tileClassName={({ date }) => {
                                const formattedDate = formatDate(date); // Format date as Day/Month/Year
                                const hasAppointment = appointments.some(
                                    (appointment) => formatDate(new Date(appointment.date)) === formattedDate
                                );
                                return hasAppointment ? "highlighted-date" : null;
                            }}
                        />
                    </div>

                    {/* Appointments for Selected Date */}
                    {selectedDate && (
                        <div className="appointments-for-date">
                            <Typography variant="h5">Appointments for {formatDate(selectedDate)}</Typography>
                            {selectedAppointments.length > 0 ? (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Patient</TableCell>
                                                <TableCell>Time</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedAppointments.map((appointment) => (
                                                <TableRow key={appointment.appointmentid}>
                                                    <TableCell>{appointment.patients.name}</TableCell>
                                                    <TableCell>{appointment.time}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Typography>No appointments for this date.</Typography>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;