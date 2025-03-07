import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import {
    Container,
    TextField,
    Button,
    Box,
} from "@mui/material";

function AddExercise() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [instructions, setInstructions] = useState("");

    const handleAddExercise = async () => {
        const { error } = await supabase.from("exercises").insert([{
            name,
            description,
            instructions,
        }]);
        if (error) {
            console.error("Error adding exercise:", error);
        } else {
            setName("");
            setDescription("");
            setInstructions("");
        }
    };

    return (
        <Container maxWidth="sm">
           
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField label="Description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                <TextField label="Instructions" multiline rows={4} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
                <Button variant="contained" onClick={handleAddExercise}>
                    Add Exercise
                </Button>
            </Box>
        </Container>
    );
}

export default AddExercise;