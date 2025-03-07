import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../supabaseClient";
import { UserContext } from "../../contexts/UserContext";
import {
    Container,
    TextField,
    Button,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";

function AddAppointment({ onSuccess }) {
    const [patientid, setPatientId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [paymentamount, setPaymentAmount] = useState(0);
    const [paymentstatus, setPaymentStatus] = useState("pending");
    const [exerciseids, setExerciseIds] = useState([]); // Initialize as an empty array
    const [patients, setPatients] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useContext(UserContext);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: patientsData, error: patientsError } = await supabase.from("patients").select("patientid, name");
                if (patientsError) {
                    console.error("Error fetching patients:", patientsError);
                } else {
                    setPatients(patientsData);
                }

                const { data: exercisesData, error: exercisesError } = await supabase.from("exercises").select("exerciseid, name");
                if (exercisesError) {
                    console.error("Error fetching exercises:", exercisesError);
                } else {
                    setExercises(exercisesData);
                }
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleAddAppointment = async () => {
        try {
            const appointmentData = {
                patientid: parseInt(patientid),
                date,
                time,
                paymentamount,
                paymentstatus,
                exercises: exerciseids,
                physiotherapistid: user.id,
            };

            const { error } = await supabase.from("appointments").insert([appointmentData]);

            if (error) {
                console.error("Error adding appointment:", error);
            } else {
                setPatientId("");
                setDate("");
                setTime("");
                setPaymentAmount(0);
                setPaymentStatus("pending");
                setExerciseIds([]); // Correctly clear the array
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (error) {
            console.error("Unexpected error adding appointment:", error);
        }
    };

    return (
        <Container maxWidth="sm">
            
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControl>
                    <InputLabel id="patient-label">Patient</InputLabel>
                    <Select labelId="patient-label" id="patient-select" value={patientid} onChange={(e) => setPatientId(e.target.value)}>
                        <MenuItem value="">Select Patient</MenuItem>
                        {!isLoading && patients.map((patient) => (
                            <MenuItem key={patient.patientid} value={patient.patientid}>
                                {patient.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <TextField type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                <TextField type="number" label="Payment Amount" value={paymentamount} onChange={(e) => setPaymentAmount(e.target.value)} />
                <FormControl>
                    <InputLabel id="payment-status-label">Payment Status</InputLabel>
                    <Select labelId="payment-status-label" id="payment-status-select" value={paymentstatus} label="Payment Status" onChange={(e) => setPaymentStatus(e.target.value)}>
                        <MenuItem value={"pending"}>pending</MenuItem>
                        <MenuItem value={"paid"}>paid</MenuItem>
                        <MenuItem value={"unpaid"}>unpaid</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
    <InputLabel id="exercises-label">Exercises</InputLabel>
    <Select
        multiple
        labelId="exercises-label"
        id="exercises-select"
        value={exerciseids} // Use the array here
        onChange={(e) => {
            // e.target.value is already an array of selected values
            setExerciseIds(e.target.value);
        }}
    >
        {!isLoading && exercises.map((exercise) => (
            <MenuItem key={exercise.exerciseid} value={exercise.exerciseid}>
                {exercise.name}
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