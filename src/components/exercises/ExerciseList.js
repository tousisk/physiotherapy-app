import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
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

function ExerciseList() {
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        async function fetchExercises() {
            const { data, error } = await supabase.from("exercises").select("*");
            if (error) {
                console.error("Error fetching exercises:", error);
            } else {
                setExercises(data);
            }
        }
        fetchExercises();
    }, []);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h2" gutterBottom>
                Exercises
            </Typography>
            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {exercises.map((exercise) => (
                            <TableRow key={exercise.exerciseId}>
                                <TableCell>{exercise.name}</TableCell>
                                <TableCell>{exercise.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}

export default ExerciseList;