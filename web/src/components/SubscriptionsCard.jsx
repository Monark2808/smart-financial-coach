import { Card, CardHeader, CardContent, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function SubscriptionsCard({ subs = [] }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="Subscriptions" subheader="Recurring charges we detect" />
      <CardContent>
        {subs.length === 0 ? (
          <Typography variant="body2">Load a CSV to see potential subscriptions.</Typography>
        ) : (
          <List dense>
            {subs.map((s, i) => (
              <ListItem key={i} disableGutters>
                <ListItemText
                  primary={`${s.merchant} — $${s.amount.toFixed(2)}/mo`}
                  secondary={s.note || ""}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
