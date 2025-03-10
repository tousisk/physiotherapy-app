import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../supabaseClient";
import { UserContext } from "../../contexts/UserContext";
import {
    Container,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
} from "@mui/material";

function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        async function fetchAppointments() {
            setLoading(true);
            try {
                let query = supabase.from("appointments").select("*, patients(name, patientid)");

                if (user && user.role !== "admin") {
                    query = query.eq("physiotherapistid", user.id);
                }

                const { data, error } = await query;
                console.log(data); //check data being returned
                if (error) {
                    console.error("Error fetching appointments:", error);
                    setFetchError(error);
                    setAppointments([]);
                } else {
                    setAppointments(data || []);
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
                setFetchError(error);
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        }
        fetchAppointments();
    }, [user]);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h2" gutterBottom>
                Appointments
            </Typography>
            <Paper elevation={3}>
                {loading ? (
                    <div>Loading...</div>
                ) : fetchError ? (
                    <div>{fetchError.message}</div>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Patient ID</TableCell>
                                <TableCell>Physiotherapist</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(appointments) && appointments.map((appointment) => (
                                <TableRow key={appointment.appointmentid}>
                                    <TableCell>{appointment.date}</TableCell>
                                    <TableCell>{appointment.time}</TableCell>
                                    <TableCell>{appointment.patientid}</TableCell>
                                    <TableCell>{appointment.physiotherapistid}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Paper>
        </Container>
    );
}

export default AppointmentList;