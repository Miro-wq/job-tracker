import React, { useEffect, useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Tabs,
  Tab,
  Stack,
  Chip,
  Box,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import api from "../api/client";
import { AuthContext } from "../context/AuthContext";
import { Snackbar, Alert } from "@mui/material";
import jsPDF from "jspdf";

const STATUS = ["all", "saved", "applied", "rejected", "ghosted"];

export default function Home() {
  const { logout } = useContext(AuthContext);

  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: "", company: "", url: "" });
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setLoading(true);
    api
      .get("/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "applied").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
    ghosted: jobs.filter((j) => j.status === "ghosted").length,
  };

  const addJob = async () => {
    if (!form.title || !form.company || !form.url) return;
    try {
      const res = await api.post("/jobs", form);
      setJobs([res.data, ...jobs]);
      setForm({ title: "", company: "", url: "" });
      setTab("all");
      setSnack({
        open: true,
        message: "Job salvat cu succes!",
        severity: "success",
      });
    } catch (err) {
      setSnack({
        open: true,
        message: "Eroare la salvare.",
        severity: "error",
      });
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put("/jobs", { id, status });
      setJobs(jobs.map((j) => (j._id === id ? res.data : j)));
      setSnack({
        open: true,
        message: `Status actualizat la ${status}`,
        severity: "info",
      });
    } catch (err) {
      setSnack({
        open: true,
        message: "Eroare la actualizare.",
        severity: "error",
      });
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Job Tracker Export", 10, 20);

    const startY = 30;
    const lineHeight = 10;
    jobs.forEach((job, index) => {
      const y = startY + index * lineHeight;
      doc.setFontSize(12);
      doc.text(
        `${index + 1}. ${job.title} — ${job.company} [${job.status}]`,
        10,
        y
      );
    });

    doc.save("jobs_export.pdf");
  };

  const filtered = tab === "all" ? jobs : jobs.filter((j) => j.status === tab);

  const handleCloseSnack = () => setSnack({ ...snack, open: false });

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            JobTrackr
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            ["Total Jobs", counts.total, "primary"],
            ["Applied", counts.applied, "success"],
            ["Rejected", counts.rejected, "error"],
            ["Ghosted", counts.ghosted, "warning"],
          ].map(([label, val, color]) => (
            <Grid size={{ xs: 6, md: 3 }} key={label}>
              <Card
                variant="outlined"
                sx={{
                  border: 2,
                  borderColor: `${color}.main`,
                }}
              >
                <CardContent>
                  <Typography color={color} variant="subtitle1">
                    {label}
                  </Typography>
                  <Typography variant="h5">{val}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card variant="outlined" sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add New Job
          </Typography>
          <Grid container spacing={2} sx={{ flexDirection: "column" }}>
            <Grid>
              <TextField
                label="Job Title"
                fullWidth
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Grid>
            <Grid>
              <TextField
                label="Company Name"
                fullWidth
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </Grid>
            <Grid>
              <TextField
                label="Job URL"
                fullWidth
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </Grid>
            <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" onClick={addJob}>
                Save Job
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={exportPDF}
                sx={{ ml: 2 }}
              >
                Export PDF
              </Button>
            </Grid>
          </Grid>
        </Card>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {STATUS.map((s) => (
              <Tab
                key={s}
                value={s}
                label={s.charAt(0).toUpperCase() + s.slice(1)}
              />
            ))}
          </Tabs>
        </Box>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={2}>
            {filtered.map((job) => (
              <Grid size={{ xs: 12, md: 4 }} key={job._id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">{job.title}</Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      {job.company}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      gutterBottom
                    >
                      Saved on {new Date(job.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {job.url}
                      </a>
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, justifyContent: "flex-end" }}>
                      {STATUS.slice(1).map((st) => {
                        const statusColor = {
                          saved: "primary",
                          applied: "success",
                          rejected: "error",
                          ghosted: "warning",
                        };
                        const chipColor =
                          job.status === st ? statusColor[st] : "default";

                        return (
                          <Chip
                            key={st}
                            label={st.charAt(0).toUpperCase() + st.slice(1)}
                            variant={job.status === st ? "filled" : "outlined"}
                            color={chipColor}
                            onClick={() => updateStatus(job._id, st)}
                          />
                        );
                      })}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
      >
        <Alert severity={snack.severity} onClose={handleCloseSnack}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}
