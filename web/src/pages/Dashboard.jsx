import { useRef, useState } from "react";
import { Container, Grid, Stack, Button, Box } from "@mui/material";
import Papa from "papaparse";
import InsightsCard from "../components/InsightsCard";
import GoalCard from "../components/GoalCard";
import SubscriptionsCard from "../components/SubscriptionsCard";
import { computeInsights, forecastGoal, detectSubscriptions } from "../utils/analysis";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [subs, setSubs] = useState([]);
  const [goalResult, setGoalResult] = useState(null);
  const fileRef = useRef(null);

  const parseAndAnalyze = (text) => {
    const { data } = Papa.parse(text, { header: true, dynamicTyping: true, skipEmptyLines: true });
    setTransactions(data);
    setInsights(computeInsights(data));
    setSubs(detectSubscriptions(data));
    setGoalResult(null); // reset on new data
  };

  const loadSample = async () => {
    const resp = await fetch("/sample_data/transactions.csv");
    const text = await resp.text();
    parseAndAnalyze(text);
  };

  const onUploadClick = () => fileRef.current?.click();
  const onFileChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    parseAndAnalyze(text);
  };

  const handleSetGoal = (amount, months) => {
    const res = forecastGoal(transactions, amount, months);
    setGoalResult(res);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={loadSample}>Load Sample CSV</Button>
          <input ref={fileRef} type="file" accept=".csv" onChange={onFileChange} style={{ display: "none" }} />
          <Button variant="contained" onClick={onUploadClick}>Upload CSV</Button>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <InsightsCard insights={insights} />
        </Grid>
        <Grid item xs={12} md={4}>
          <GoalCard onSetGoal={handleSetGoal} result={goalResult} />
        </Grid>
        <Grid item xs={12} md={3}>
          <SubscriptionsCard subs={subs} />
        </Grid>
      </Grid>
    </Container>
  );
}
