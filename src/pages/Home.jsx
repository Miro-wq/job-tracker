import { useEffect, useState, useContext } from "react";
import { Grid, Card, CardContent, Typography, TextField, Button, Chip, Stack } from "@mui/material";
import api from "../api/client";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title:"", company:"", url:"" });
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    api.get("/jobs").then(r => setJobs(r.data));
  }, []);

  const counts = {
    total: jobs.length,
    applied: jobs.filter(j=>j.status==="applied").length,
    rejected: jobs.filter(j=>j.status==="rejected").length,
    ghosted: jobs.filter(j=>j.status==="ghosted").length,
  };

  const addJob = async () => {
    const { data } = await api.post("/jobs", form);
    setJobs([...jobs, data]);
    setForm({ title:"",company:"",url:"" });
  };

  return (
    <>
      <Grid container spacing={2} sx={{mb:4}}>
        {[
          ["Total Jobs", counts.total, "primary"],
          ["Applied", counts.applied, "success"],
          ["Rejected", counts.rejected, "error"],
          ["Ghosted", counts.ghosted, "warning"],
        ].map(([label,val,color])=>(
          <Grid item xs key={label}>
            <Card variant="outlined">
              <CardContent>
                <Typography color={color} variant="h6">{label}</Typography>
                <Typography variant="h4">{val}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Form adăugare job */}
      <Card sx={{p:2, mb:4}}>
        <Typography variant="h6">Adaugă un job nou</Typography>
        <Grid container spacing={2} sx={{mt:1}}>
          {["title","company","url"].map(field=>(
            <Grid item xs={field==="url"?12:6} key={field}>
              <TextField
                fullWidth
                label={field==="url"? "Job URL": field==="title"? "Titlu job":"Companie"}
                value={form[field]}
                onChange={e=>setForm({...form,[field]:e.target.value})}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="contained" onClick={addJob}>Salvează Job</Button>
          </Grid>
        </Grid>
      </Card>

      {/* Listă joburi */}
      <Grid container spacing={2}>
        {jobs.map(j=>(
          <Grid item xs={12} md={6} lg={4} key={j._id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{j.title}</Typography>
                <Typography variant="subtitle2" gutterBottom>{j.company}</Typography>
                <Typography variant="body2">
                  <a href={j.url} target="_blank" rel="noopener noreferrer">{j.url}</a>
                </Typography>
                <Stack direction="row" spacing={1} sx={{mt:2}}>
                  {["saved","applied","rejected","ghosted"].map(st=>(
                    <Chip
                      key={st}
                      label={st}
                      variant={j.status===st? "filled":"outlined"}
                      color={j.status===st? st==="saved"?"default":st : "default"}
                      onClick={async ()=> {
                        await api.put("/jobs", { id:j._id, status:st });
                        setJobs(jobs.map(x=> x._id===j._id? {...x,status:st} : x));
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
