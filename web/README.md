# Smart Financial Coach — Case Study for Palo Alto Networks

This project is a lightweight Smart Financial Coach application built for the Palo Alto Networks Early Talent Case Study.  
It analyzes spending patterns from a CSV file, identifies key insights, detects recurring subscriptions, and provides a transparent heuristic-based savings forecast.



#  Features

#  Insights
- Month-over-month spending comparison
- Category spike detection using z-score
- Most frequent merchant analysis

#  Goal Forecast
- Set a financial savings goal  
- Transparent heuristic: potential savings = ~20% of average monthly spend  
- Displays whether you are on track or off track  
- Shows monthly amount required and potential savings  

# Subscription Detection
- Identifies recurring monthly charges
- Checks cadence (~30 days)
- Checks amount stability (±15%)
- Suggests potential cancellation for unused services



# Tech Stack

- **React + Vite**
- **Material UI**
- **PapaParse** (CSV parsing)
- **Day.js** (date handling)
- Fully client-side — no backend needed  
- Local processing = no data leaves your browser (Responsible AI)



#  How to Run Locally

```bash
cd web
npm install
npm run dev
