import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
} from "@mui/material";

function EditPatient({ patient, onClose, onSuccess }) {
    const [name, setName] = useState("");
    const [medicalhistory, setMedicalHistory] = useState("");
    const [contactinfo, setContactInfo] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch patient data on component mount
    useEffect(() => {
        async function fetchPatient() {
            try {
                // Set patient data if provided
                if (patient) {
                    setName(patient.name);
                    setMedicalHistory(patient.medicalhistory || "");
                    setContactInfo(patient.contactinfo || "");
                }
            } catch (error) {
                console.error("Unexpected error fetching patient:", error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPatient();
    }, [patient]);

    const handleUpdatePatient = async () => {
        try {
            const { error } = await supabase
                .from("patients")
                .update({ name, medicalhistory, contactinfo })
                .eq("patientid", patient.patientid);

            if (error) {
                console.error("Error updating patient:", error);
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
            console.error("Unexpected error updating patient:", error);
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
                Edit Patient
            </Typography>
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Medical History"
                    multiline
                    rows={4}
                    value={medicalhistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Contact Info"
                    multiline
                    rows={4}
                    value={contactinfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" onClick={handleUpdatePatient}>
                    Update Patient
                </Button>
            </Box>
        </Container>
    );
}

export default EditPatient;