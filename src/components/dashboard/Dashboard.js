import React, { useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { UserContext } from "../../contexts/UserContext";
import { Box } from '@mui/material';
import {
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../App.css";

// Import the necessary components
import PatientList from "../patients/PatientList";
import AddPatient from "../patients/AddPatient";
import EditPatient from "../patients/EditPatient";
import AppointmentList from "../appointments/AppointmentList";
import AddAppointment from "../appointments/AddAppointment";
import ExerciseList from "../exercises/ExerciseList";
import AddExercise from "../exercises/AddExercise";

function Dashboard() {
  const { user, role } = useContext(UserContext); // Include role from context
  const [appointments, setAppointments] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState();
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [allPatients, setAllPatients] = useState();
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (!user || !user.id) {
      console.error("User data is not available.");
      setIsLoading(false);
      return;
    }
    try {
      const userData = await supabase
        .from("users")
        .select("name,role")
        .eq("uid", user.id)
        .single();

      if (userData.error) {
        console.error("Error fetching user name:", userData.error);
        setError(userData.error);
      } else if (userData.data) {
        setUserName(userData.data.name);

        let appointmentsQuery = supabase.from("appointments").select("*, patients(name, patientid)");
        let patientsQuery = supabase.from("patients").select("*");

        if (role !== "admin") { // Use role from context for filtering
          appointmentsQuery = appointmentsQuery.eq("physiotherapistid", user.id);
          patientsQuery = patientsQuery.eq("physiotherapistid", user.id);
        }

        const [appointmentsData, patientsData] = await Promise.all([
          appointmentsQuery,
          patientsQuery,
        ]);

        if (appointmentsData.error) {
          console.error("Error fetching appointments:", appointmentsData.error);
          setError(appointmentsData.error);
        } else {
          setAppointments(appointmentsData.data ||[]);
        }

        if (patientsData.error) {
          console.error("Error fetching patients:", patientsData.error);
          setError(patientsData.error);
        } else {
          setAllPatients(patientsData.data ||[]);
        }
      }
    } catch (error) {
      console.error("Unexpected error fetching data:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [user, role]); // Include role in dependency array

  useEffect(() => {
    if (user && user.id) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user, fetchData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const formattedDate = formatDate(date);
    const appointmentsForDate = appointments.filter(
      (appointment) => formatDate(new Date(appointment.date)) === formattedDate
    );
    setSelectedAppointments(appointmentsForDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB");
  };

  const toggleMenu = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setIsMenuOpen(open);
  };

  const menuItems = [
    { text: "Dashboard", onClick: () => setActiveMenuItem("Dashboard") },
    { text: "Patients", onClick: () => setActiveMenuItem("Patients") },
    { text: "Appointments", onClick: () => setActiveMenuItem("Appointments") },
    { text: "Exercises", onClick: () => setActiveMenuItem("Exercises") },
    { text: "Logout", onClick: handleLogout },
  ];

  if (isLoading) {
    return <div className="loading"><Typography variant="h6">Loading...</Typography></div>;
  }

  if (error) {
    return <div className="error"><Typography variant="h6" color="error">Error: {error.message}</Typography></div>;
  }

  return (
    <div>
      <AppBar position="static" sx={{ height: 60 }}>
        <Toolbar sx={{ minHeight: 60 }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleMenu(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Welcome, {userName || "User"}!
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isMenuOpen} onClose={toggleMenu(false)}>
        <Box
          sx={{
            width: 140,
            height: '100vh',
            bgcolor: 'WhiteSmoke',
            overflowY: 'auto',
            padding: 1,
          }}
          role="button"
          onClick={toggleMenu(false)}
          onKeyDown={toggleMenu(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={item.onClick}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <div style={{ marginLeft: isMenuOpen ? 140 : 0, padding: "30px", width: '100%', transition: "margin-left 0.3s ease" }}>
        {activeMenuItem === "Dashboard" && (
          <div className="calendar-appointments-container">
            {/* Calendar Section */}
            <Paper elevation={6} className="calendar-container">
              <Typography variant="h5">Calendar View</Typography>
              <Calendar
                onChange={handleDateClick}
                value={selectedDate}
                tileClassName={({ date }) => {
                  const formattedDate = formatDate(date);
                  const hasAppointment = appointments.some(
                    (appointment) => formatDate(new Date(appointment.date)) === formattedDate
                  );
                  return hasAppointment ? "highlighted-date" : null;
                }}
              />
            </Paper>

            {/* Appointments Section */}
            {selectedDate && (
              <Paper elevation={6} className="appointments-container">
                <Typography variant="h5">Appointments for {formatDate(selectedDate)}</Typography>
                {selectedAppointments.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Patient</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Physiotherapist</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedAppointments.map((appointment) => (
                          <TableRow key={appointment.appointmentid}>
                            <TableCell>{appointment.patients.name}</TableCell>
                            <TableCell>{appointment.time}</TableCell>
                            <TableCell>{appointment.physiotherapistid}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography>No appointments for this date.</Typography>
                )}
              </Paper>
            )}
          </div>
        )}

        {activeMenuItem === "Patients" && (
          <div>
            <PatientList patients={allPatients} />
            <AddPatient />
            <EditPatient />
          </div>
        )}

        {activeMenuItem === "Appointments" && (
          <div>
            <AppointmentList appointments={appointments} />
            <AddAppointment />
          </div>
        )}

        {activeMenuItem === "Exercises" && (
          <div>
            <ExerciseList />
            <AddExercise />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;