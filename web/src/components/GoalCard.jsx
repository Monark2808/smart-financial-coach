import { Card, CardHeader, CardContent, Typography, TextField, Stack, Button, Chip, Divider } from "@mui/material";
import { useState } from "react";

export default function GoalCard({ onSetGoal, result }) {
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");

  const handleClick = () => {
    const a = Number(amount);
    const m = Number(months);
    onSetGoal?.(a, m);
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="Goal Forecast" subheader="Set a savings goal" />
      <CardContent>
        <Stack spacing={2}>
          <TextField label="Goal amount ($)" value={amount} onChange={e => setAmount(e.target.value)} />
          <TextField label="Months to reach" value={months} onChange={e => setMonths(e.target.value)} />
          <Button variant="contained" onClick={handleClick}>Calculate</Button>

          <Divider />

          {!result ? (
            <Typography variant="caption" color="text.secondary">
              We’ll project using a transparent heuristic: ~20% of average monthly spend as potential savings.
            </Typography>
          ) : (
            <Stack spacing={1}>
              <Chip
                label={result.onTrack ? "On track" : "Off track"}
                color={result.onTrack ? "success" : "warning"}
                size="small"
                sx={{ alignSelf: "start" }}
              />
              <Typography variant="body2">
                Monthly needed: <b>${result.monthlyNeeded}</b>
              </Typography>
              <Typography variant="body2">
                Potential monthly savings (heuristic): <b>${result.potentialMonthlySavings}</b>
              </Typography>
              <Typography variant="caption" color="text.secondary">{result.note}</Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
