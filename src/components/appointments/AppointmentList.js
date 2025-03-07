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

    useEffect(() => {
        async function fetchAppointments() {
            let query = supabase.from("appointments").select("*");

            if (user) {
                query = query.eq("physiotherapistId", user.id);
            }

            const { data, error } = await query;
            if (error) {
                console.error("Error fetching appointments:", error);
            } else {
                setAppointments(data);
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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Patient ID</TableCell>
                            <TableCell>Payment Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments.map((appointment) => (
                            <TableRow key={appointment.appointmentId}>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>{appointment.time}</TableCell>
                                <TableCell>{appointment.patientId}</TableCell>
                                <TableCell>{appointment.paymentStatus}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}

export default AppointmentList;