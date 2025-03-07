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

function EditExercise({ onClose, onSuccess }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch exercise data on component mount
    useEffect(() => {
        async function fetchExercise() {
            try {
                const { data, error } = await supabase
                    .from("exercises")
                    .select("*")
                    .eq("exerciseId", id)
                    .single();

                if (error) {
                    console.error("Error fetching exercise:", error);
                    setError(error);
                } else {
                    setName(data.name);
                    setDescription(data.description || "");
                }
            } catch (error) {
                console.error("Unexpected error fetching exercise:", error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchExercise();
    }, [id]);

    const handleUpdateExercise = async () => {
        try {
            const { error } = await supabase
                .from("exercises")
                .update({ name, description })
                .eq("exerciseId", id);

            if (error) {
                console.error("Error updating exercise:", error);
                setError(error);
            } else {
                if (onSuccess) {
                    onSuccess(); // Trigger success callback (e.g., refresh data in Dashboard)
                }
                if (onClose) {
                    onClose(); // Close the edit dialog
                } else {
                    navigate("/exercises"); // Navigate back to exercises list if not in a dialog
                }
            }
        } catch (error) {
            console.error("Unexpected error updating exercise:", error);
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
                Edit Exercise
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
                    label="Description"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" onClick={handleUpdateExercise}>
                    Update Exercise
                </Button>
            </Box>
        </Container>
    );
}

export default EditExercise;