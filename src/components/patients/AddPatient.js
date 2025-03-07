import React, { useState, useContext } from "react";
import { supabase } from "../../supabaseClient";
import { UserContext } from "../../contexts/UserContext";
import {
    Container,
    TextField,
    Button,
    Box,
} from "@mui/material";

function AddPatient() {
    const [name, setName] = useState("");
    const [medicalhistory, setMedicalhistory] = useState(""); // Use lowercase
    const [contactinfo, setContactinfo] = useState(""); // Use lowercase
    const { user } = useContext(UserContext);

    const handleAddPatient = async () => {
        const { error } = await supabase.from("patients").insert([{
            name,
            medicalhistory, // Use lowercase
            contactinfo, // Use lowercase
            physiotherapistid: user.id
        }]);
        if (error) {
            console.error("Error adding patient:", error);
        } else {
            setName("");
            setMedicalhistory(""); // Use lowercase
            setContactinfo(""); // Use lowercase
        }
    };

    return (
        <Container maxWidth="sm">
            
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField label="Medical History" multiline rows={4} value={medicalhistory} onChange={(e) => setMedicalhistory(e.target.value)} /> {/* Use lowercase */}
                <TextField label="Contact Info" multiline rows={4} value={contactinfo} onChange={(e) => setContactinfo(e.target.value)} /> {/* Use lowercase */}
                <Button variant="contained" onClick={handleAddPatient}>
                    Add Patient
                </Button>
            </Box>
        </Container>
    );
}

export default AddPatient;