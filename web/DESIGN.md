# Smart Financial Coach — Design Documentation

This document provides an overview of the design, architecture, technical stack, and future enhancements for the Smart Financial Coach, developed as part of the Palo Alto Networks Early Talent Hackathon Case Study.



# 1. Problem Summary

Many individuals—especially young adults, students, and freelancers—struggle to maintain clarity over their financial habits. Manually tracking expenses is tedious, budgeting apps often feel generic, and most tools lack actionable guidance. As a result:

- Users lose visibility into where their money goes.
- Wasteful spending and unused subscriptions go unnoticed.
- Financial goals feel unrealistic or overwhelming.
- Anxiety increases due to lack of control.

**Goal:** Build a lightweight financial coaching tool that transforms raw transaction data into clear, personalized insights while emphasizing responsible, transparent AI.



# 2. Target Users

- **Young adults and students** beginning to build financial awareness.
- **Freelancers and gig workers** with inconsistent cash flow.
- **Anyone needing clarity** on spending, subscriptions, and achievable savings.

These users want guidance that is **friendly, private, and non-judgmental**, not intrusive or overwhelming.

---

# 3. MVP Scope (Implemented Features)

The MVP prioritizes three high-impact areas:

# 3.1 Intelligent Spending Insights
- Month-over-month comparison of total spending.
- Category-level anomaly detection using z-score analysis.
- Identification of the most frequent merchant in the current month.
- User-friendly, non-judgmental messaging for awareness.



#  3.2 Personalized Goal Forecasting
- User enters a target amount and desired timeline.
- Transparent heuristic: estimated potential savings = **20% of average monthly spending**.
- Application determines whether the goal is achievable.
- Displays:
  - On-track/off-track status
  - Monthly amount needed
  - Potential savings
  - Concise explanation of reasoning



# 3.3 Subscription & “Gray Charge” Detector
- Detects recurring expenses using:
  - Monthly cadence (~30 days between charges)
  - Amount stability (±15%)
- Lists active subscriptions with:
  - Merchant name
  - Average monthly cost
  - Recommendations to review or cancel
- Helps uncover forgotten free trials and low-visibility charges.



# 3.4 Responsible AI by Design
- **All computation runs locally inside the browser.**
- No personal or financial data leaves the device.
- Heuristics and rules are explicitly explained to the user.
- Insights are friendly, non-judgmental, and transparent.



# 4. Out-of-Scope for MVP (Deferred Features)

- Bank API integrations (Plaid, Stripe, or Open Banking APIs)
- Predictive ML models for spending trends
- Income estimation or cash flow analysis
- Personalized nudges and habit formation mechanisms
- Rich visual dashboards (graphs, trend lines)
- Automatic budgeting suggestions
- Mobile app version

These are ideal for future iterations but intentionally excluded to maintain focus and MVP clarity.



# 5. System Architecture

#  5.1 High-Level Flow


              +-------------------------+
              | Upload CSV / Sample CSV |
              +-----------+-------------+
                          |
                          v
               +------------------------+
               |   Parse & Normalize    |
               |  (PapaParse, Day.js)   |
               +-----------+------------+
                           |
      +---------+----------+----------+----------+
      |         |                     |          |
      v         v                     v          v
Insights   Subscription Detector   Goal Forecast  (Future ML)
Engine     (~30d cadence +         (20% rule)  
(MoM,      ±15% stability)         Track/No Track
z-score,
merchant)




# 6. Technical Stack

# Frontend
- **React** (functional components + hooks)
- **Vite** (fast dev + optimized build)
- **Material UI** (clean, accessible UI)
- **PapaParse** (CSV parsing)
- **Day.js** (date handling)

# Environment
- Browser-only, no backend
- Static CSV under `public/sample_data/transactions.csv`

# Data Privacy
- Entire analysis pipeline runs client-side
- No network transmission of financial data
- No storage or logging of user transactions



# 7. Core Algorithms

# 7.1 Normalization
- Convert dates using Day.js
- Drop malformed entries
- Generate `yyyymm` keys for grouping

# 7.2 Insights Engine
- **Month-over-month**: compare totals of current vs previous month
- **Category spike detection**:
  - For each category:
    - Compute historical monthly totals
    - z = (current − mean) / stddev
    - Spike if z > 1.2
- **Frequent merchant**:
  - Count occurrences for current month
  - Sort by frequency



#  7.3 Subscription Detection
For each merchant:

- Sort transactions by date
- Compute gaps between consecutive charges
- Compute average gap
- Check cadence: 25–35 days
- Amount stability: within 15% of mean

If all conditions match → subscription.



# 7.4 Goal Forecasting
- Average monthly spend = mean of monthly totals
- Potential savings = 20% of average monthly spend
- Required savings per month = goalAmount / goalMonths
- On-track if potential savings ≥ required savings
- Provide a note explaining

This approach is simple, transparent, and easy to communicate.



# 8. Responsible AI Considerations

- **Transparency:** Heuristics clearly described in UI
- **Privacy:** 100% client-side; no backend; no PII transmission
- **Explainability:** Simple stats and heuristics rather than opaque models
- **User agency:** Insights phrased as suggestions, not judgments
- **Limitations acknowledged:** Income not modeled, heuristic may under/over estimate



# 9. Testing & Edge Case Handling

- Empty CSV → insights card shows prompt
- Malformed rows → dropped by normalization
- Single-month data → MoM comparison adapts gracefully
- Missing category/merchant values → normalized to defaults
- Very low variance → spike detection suppressed



# 10. Future Enhancements

1. **ML-powered trend analysis**  
   - Time-series forecasting  
   - Dynamic anomaly detection

2. **Bank API integrations**  
   - Real-time transaction import  
   - Secure OAuth flows

3. **Personalized recommendations**  
   - Category-level budgeting  
   - Spending elasticity analysis

4. **Visual dashboards**  
   - Graphs for trends and categories  
   - What-if scenario sliders

5. **Mobile app experience**



# 11. Conclusion

This Smart Financial Coach delivers a focused, actionable MVP that balances **AI transparency, user privacy, and meaningful insights**. The architecture supports expansion into more advanced ML-powered features while keeping the current version lightweight, explainable, and user-friendly.


# 12. Video Presentation Link (Youtube) :

Link - https://youtu.be/LmdiTdj5Qmw?si=fZ1_I_5skjRQR5Dj

## THANK YOU.