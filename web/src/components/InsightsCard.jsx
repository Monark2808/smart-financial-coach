import { Card, CardHeader, CardContent, Typography, Stack } from "@mui/material";

export default function InsightsCard({ insights = [] }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="Insights" subheader="Clear, friendly spending highlights" />
      <CardContent>
        {insights.length === 0 ? (
          <Typography variant="body2">Load a CSV to see insights.</Typography>
        ) : (
          <Stack spacing={1}>
            {insights.map((i, idx) => (
              <div key={idx}>
                <Typography variant="subtitle1">{i.title}</Typography>
                <Typography variant="body2" color="text.secondary">{i.detail}</Typography>
              </div>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
