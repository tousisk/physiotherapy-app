import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

function EditAppointment({ appointment, onClose, onSuccess }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [patientid, setPatientId] = useState("");
    const [paymentstatus, setPaymentStatus] = useState("pending");
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch appointment and patients data on component mount
    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch patients
                const { data: patientsData, error: patientsError } = await supabase
                    .from("patients")
                    .select("*");

                if (patientsError) {
                    console.error("Error fetching patients:", patientsError);
                    setError(patientsError);
                } else {
                    setPatients(patientsData || []);
                }

                // Set appointment data if provided
                if (appointment) {
                    setDate(appointment.date);
                    setTime(appointment.time);
                    setPatientId(appointment.patientid); // Use lowercase
                    setPaymentStatus(appointment.paymentstatus); // Use lowercase
                }
            } catch (error) {
                console.error("Unexpected error fetching data:", error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [appointment]);

    const handleUpdateAppointment = async () => {
        try {
            const { error } = await supabase
                .from("appointments")
                .update({ date, time, patientid, paymentstatus }) // Use lowercase
                .eq("appointmentid", appointment.appointmentid); // Use lowercase

            if (error) {
                console.error("Error updating appointment:", error);
                setError(error);
            } else {
                if (onSuccess) {
                    onSuccess(); // Trigger success callback (e.g., refresh data in Dashboard)
                }
                if (onClose) {
                    onClose(); // Close the edit dialog
                }
            }
        } catch (error) {
            console.error("Unexpected error updating appointment:", error);
            setError(error);
        }
    };

    if (isLoading) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h6">Loading...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h6" color="error">
                    Error: {error.message}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h2" gutterBottom>
                Edit Appointment
            </Typography>
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="patient-label">Patient</InputLabel>
                    <Select
                        labelId="patient-label"
                        value={patientid}
                        onChange={(e) => setPatientId(e.target.value)}
                        label="Patient"
                    >
                        {patients.map((patient) => (
                            <MenuItem key={patient.patientid} value={patient.patientid}>
                                {patient.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="payment-status-label">Payment Status</InputLabel>
                    <Select
                        labelId="payment-status-label"
                        value={paymentstatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        label="Payment Status"
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="paid">Paid</MenuItem>
                        <MenuItem value="unpaid">Unpaid</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleUpdateAppointment}>
                    Update Appointment
                </Button>
            </Box>
        </Container>
    );
}

export default EditAppointment;