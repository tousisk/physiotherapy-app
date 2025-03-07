import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
} from "@mui/material";

function EditPatient() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [medicalHistory, setMedicalHistory] = useState("");
    const [contactInfo, setContactInfo] = useState("");

    useEffect(() => {
        async function fetchPatient() {
            const { data, error } = await supabase.from("patients").select("*").eq("patientId", id).single();
            if (error) {
                console.error("Error fetching patient:", error);
            } else {
                setName(data.name);
                setMedicalHistory(data.medicalHistory);
                setContactInfo(data.contactInfo);
            }
        }
        fetchPatient();
    }, [id]);

    const handleUpdatePatient = async () => {
        const { error } = await supabase.from("patients").update({
            name,
            medicalHistory,
            contactInfo,
        }).eq("patientId", id);
        if (error) {
            console.error("Error updating patient:", error);
        } else {
            navigate("/patients");
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h2" gutterBottom>
                Edit Patient
            </Typography>
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField label="Medical History" multiline rows={4} value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} />
                <TextField label="Contact Info" multiline rows={4} value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
                <Button variant="contained" onClick={handleUpdatePatient}>
                    Update Patient
                </Button>
            </Box>
        </Container>
    );
}

export default EditPatient;