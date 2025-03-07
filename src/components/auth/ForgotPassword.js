import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Password reset email sent. Please check your inbox.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Forgot Password
        </Typography>
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="contained" onClick={handleForgotPassword}>
            Reset Password
          </Button>
          {message && <Typography color={message.startsWith("Error") ? "error" : "success"}>{message}</Typography>}
        </Box>
      </Paper>
    </Container>
  );
}

export default ForgotPassword;