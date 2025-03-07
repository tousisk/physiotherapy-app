import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp(
        {
            email,
            password,
      
        },
        {
            user_metadata: { name: name }, // Include name in user_metadata
            redirectTo: "http://localhost:3000/verify-email",
        }
    );
      if (error) {
        console.error("Signup error:", error);
        setErrorMessage(error.message);
      } else {
        console.log("Signup successful:", data);
        setSuccessMessage(
          "Signup successful! Please check your email to verify your account."
        );

        // Add user data to the 'users' table (in the background)
        const { error: userError } = await supabase
          .from("users")
          .insert([{ uid: data.user.id, role: "physiotherapist", name, email }]);

        if (userError) {
          console.error("Error adding user to 'users' table:", userError);
          // You might want to handle this error more gracefully (e.g., retry, inform the user)
        } else {
          console.log("User added to 'users' table");
        }
      }
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Signup
        </Typography>

        {errorMessage && (
          <Alert severity="error" onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            type="submit"
            onClick={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Signup"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Signup;