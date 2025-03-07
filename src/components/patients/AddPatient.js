import React, { useState, useContext } from "react";
import { supabase } from "../../supabaseClient";
import { UserContext } from "../../contexts/UserContext";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
} from "@mui/material";

function AddPatient() {
    const [name, setName] = useState("");
    const [medicalHistory, setMedicalHistory] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const { user } = useContext(UserContext);

    const handleAddPatient = async () => {
        const { error } = await supabase.from("patients").insert([{
            name,
            medicalHistory,
            contactInfo,
            physiotherapistId: user.id
        }]);
        if (error) {
            console.error("Error adding patient:", error);
        } else {
            setName("");
            setMedicalHistory("");
            setContactInfo("");
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h2" gutterBottom>
                Add Patient
            </Typography>
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField label="Medical History" multiline rows={4} value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} />
                <TextField label="Contact Info" multiline rows={4} value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
                <Button variant="contained" onClick={handleAddPatient}>
                    Add Patient
                </Button>
            </Box>
        </Container>
    );
}

export default AddPatient;