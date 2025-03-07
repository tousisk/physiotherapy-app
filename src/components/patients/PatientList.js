import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../../supabaseClient";
import { UserContext } from "../../contexts/UserContext";
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

function PatientList() {
    const [patients, setPatients] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        async function fetchPatients() {
            let query = supabase.from("patients").select("*");

            if (user && user.user_metadata.role !== "admin") {
                query = query.eq("physiotherapistid", user.id);
            }

            const { data, error } = await query;
            if (error) {
                console.error("Error fetching patients:", error);
            } else {
                setPatients(data);
            }
        }
        fetchPatients();
    }, [user]);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h2" gutterBottom>
                Patients Table
            </Typography>
            <Paper elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Patient ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Medical History</TableCell>
                            <TableCell>Contact Info</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow key={patient.patientid}>
                                <TableCell>{patient.patientid}</TableCell>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell>{patient.medicalhistory}</TableCell>
                                <TableCell>{patient.contactinfo}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}

export default PatientList;