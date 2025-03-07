import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../supabaseClient";
import { UserContext } from "../../contexts/UserContext";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";

function AddAppointment() {
    const [patientId, setPatientId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const [exerciseIds, setExerciseIds] = useState([]);
    const [patients, setPatients] = useState([]);
    const [exercises, setExercises] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        async function fetchPatients() {
            const { data, error } = await supabase.from("patients").select("patientId");
            if (error) {
                console.error("Error fetching patients:", error);
            } else {
                setPatients(data);
            }
        }
        async function fetchExercises() {
            const { data, error } = await supabase.from("exercises").select("exerciseId");
            if (error) {
                console.error("Error fetching exercises:", error);
            } else {
                setExercises(data);
            }
        }
        fetchPatients();
        fetchExercises();
    }, []);

    const handleAddAppointment = async () => {
        const { error } = await supabase.from("appointments").insert([{
            patientId: parseInt(patientId),
            date,
            time,
            paymentAmount,
            paymentStatus,
            exercises: exerciseIds,
            physiotherapistId: user.id
        }]);
        if (error) {
            console.error("Error adding appointment:", error);
        } else {
            setPatientId("");
            setDate("");
            setTime("");
            setPaymentAmount(0);
            setPaymentStatus("pending");
            setExerciseIds([]);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h2" gutterBottom>
                Add Appointment
            </Typography>
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControl>
                    <InputLabel id="patient-label">Patient</InputLabel>
                    <Select labelId="patient-label" id="patient-select" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                        <MenuItem value="">Select Patient</MenuItem>
                        {patients.map((patient) => (
                            <MenuItem key={patient.patientId} value={patient.patientId}>
                                {patient.patientId}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <TextField type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                <TextField type="number" label="Payment Amount" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
                <FormControl>
                    <InputLabel id="payment-status-label">Payment Status</InputLabel>
                    <Select labelId="payment-status-label" id="payment-status-select" value={paymentStatus} label="Payment Status" onChange={(e) => setPaymentStatus(e.target.value)}>
                        <MenuItem value={"pending"}>pending</MenuItem>
                        <MenuItem value={"paid"}>paid</MenuItem>
                        <MenuItem value={"unpaid"}>unpaid</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="exercises-label">Exercises</InputLabel>
                    <Select multiple labelId="exercises-label" id="exercises-select" value={exerciseIds} onChange={(e) => setExerciseIds(Array.from(e.target.selectedOptions).map(option => parseInt(option.value)))}>
                        <MenuItem value="">Select Exercises</MenuItem>
                        {exercises.map((exercise) => (
                            <MenuItem key={exercise.exerciseId} value={exercise.exerciseId}>
                                {exercise.exerciseId}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleAddAppointment}>
                    Add Appointment
                </Button>
            </Box>
        </Container>
    );
}

export default AddAppointment;