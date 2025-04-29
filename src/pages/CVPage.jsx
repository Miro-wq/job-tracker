import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  CircularProgress
} from "@mui/material";
import { Download, Delete } from "@mui/icons-material";
import api from "../api/client";

export default function CVPage() {
  const [file, setFile] = useState(null);
  const [cvs, setCvs]   = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cv");
      setCvs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1];
      try {
        const res = await api.post("/cv", {
          filename:    file.name,
          contentType: file.type,
          data:        base64
        });
        setCvs([res.data, ...cvs]);
        setFile(null);
      } catch (e) {
        console.error(e);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = async (id, filename) => {
    try {
      const res = await api.get(`/cv?id=${id}`, { responseType: "arraybuffer" });
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete("/cv", { data: { id } });
      setCvs(cvs.filter(cv => cv._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        CV Manager
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Button variant="outlined" component="label">
         Select CV
          <input
            type="file"
            hidden
            onChange={e => setFile(e.target.files[0])}
          />
        </Button>
        <TextField
          value={file?.name || ""}
          placeholder="No file selected"
          InputProps={{ readOnly: true }}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file}
        >
          Upload CV
        </Button>
      </Stack>

      {loading
        ? <CircularProgress />
        : (
          <List>
            {cvs.map(cv => (
              <ListItem
                key={cv._id}
                secondaryAction={
                  <>
                    <IconButton edge="end" onClick={() => handleDownload(cv._id, cv.filename)}>
                      <Download />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(cv._id)}>
                      <Delete />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={cv.filename}
                  secondary={new Date(cv.createdAt).toLocaleString("ro-RO")}
                />
              </ListItem>
            ))}
          </List>
        )
      }
    </Container>
  );
}
