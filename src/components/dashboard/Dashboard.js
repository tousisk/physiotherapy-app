import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { UserContext } from "../../contexts/UserContext";
import { Typography, Grid, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Import the AddPatient, AddExercise, and AddAppointment components (create these separately)
import AddPatient from "../patients/AddPatient"; // Create this component
import AddExercise from "../exercises/AddExercise"; // Create this component
import AddAppointment from "../appointments/AddAppointment"; // Create this component

function Dashboard() {
  const { user } = useContext(UserContext);
  const [appointments, setAppointments] = useState(null);
  const [patients, setPatients] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        console.error("User data is not available.");
        setIsLoading(false);
        return;
      }
      try {
        // Fetch user name from public.users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name")
          .eq("uid", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user name:", userError);
          setError(userError);
        } else if (userData) {
          setUserName(userData.name);
        }

        // Fetch appointments
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from("appointments")
          .select("*, patients(name)")
          .eq("physiotherapistid", user.id);

        if (appointmentsError) {
          console.error("Error fetching appointments:", appointmentsError);
          setError(appointmentsError);
        } else {
          setAppointments(appointmentsData);
        }

        // Fetch patients
        const { data: patientsData, error: patientsError } = await supabase
          .from("patients")
          .select("*")
          .eq("physiotherapistid", user.id);

        if (patientsError) {
          console.error("Error fetching patients:", patientsError);
          setError(patientsError);
        } else {
          setPatients(patientsData);
        }
      } catch (error) {
        console.error("Unexpected error fetching data:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.id) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login"); // Redirect to login
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Grid container spacing={3} sx={{ padding: 4 }}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Welcome, {userName || "User"}!
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <AddPatient />
      </Grid>
      <Grid item xs={12}>
        <AddExercise />
      </Grid>
      <Grid item xs={12}>
        <AddAppointment />
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Appointments
          </Typography>
          {Array.isArray(appointments) && appointments.length > 0 ? (
            <ul>
              {appointments.map((appointment) => (
                <li key={appointment.appointmentid}>
                  {appointment.patients.name} - {appointment.date} - {appointment.time}
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No appointments found.</Typography>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Patients
          </Typography>
          {Array.isArray(patients) && patients.length > 0 ? (
            <ul>
              {patients.map((patient) => (
                <li key={patient.patientid}>
                  {patient.name} - {patient.contactinfo}
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No patients found.</Typography>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Grid>
    </Grid>
  );
}

export default Dashboard;