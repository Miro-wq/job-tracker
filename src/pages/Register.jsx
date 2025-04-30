import React, { useState, useContext } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration error");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Sign up
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          required
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          required
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </form>

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link component={RouterLink} to="/login">
          Login
        </Link>
      </Typography>
    </Container>
  );
}
