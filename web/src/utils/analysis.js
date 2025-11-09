import dayjs from "dayjs";


function normalize(transactions) {
  return transactions
    .map((t) => {
      const d = dayjs(t.date);
      const amt = Number(t.amount);
      if (!d.isValid() || isNaN(amt)) return null;
      return {
        date: d,
        yyyymm: d.format("YYYY-MM"),
        merchant: String(t.merchant || "").trim(),
        category: String(t.category || "Uncategorized").trim(),
        amount: amt,      // expenses should be positive 
      };
    })
    .filter(Boolean);
}


function sum(arr) { return arr.reduce((a, b) => a + b, 0); }
function mean(arr) { return arr.length ? sum(arr) / arr.length : 0; }
function stddev(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return Math.sqrt(mean(arr.map((x) => (x - m) ** 2)));
}


function groupBy(arr, keyFn) {
  const m = new Map();
  for (const x of arr) {
    const k = keyFn(x);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(x);
  }
  return m;
}


export function computeInsights(rawTxns) {
  const tx = normalize(rawTxns);
  if (tx.length === 0) return [{ title: "No data", detail: "Load a CSV to see insights." }];

  // latest month in data
  const months = Array.from(new Set(tx.map((t) => t.yyyymm))).sort();
  const curMonth = months[months.length - 1];
  const prevMonth = months[months.length - 2];

  const byMonth = groupBy(tx, (t) => t.yyyymm);
  const curTx = byMonth.get(curMonth) || [];
  const prevTx = byMonth.get(prevMonth) || [];

  const curSpend = sum(curTx.map((t) => t.amount));
  const prevSpend = sum(prevTx.map((t) => t.amount));
  const deltaPct = prevSpend > 0 ? ((curSpend - prevSpend) / prevSpend) * 100 : null;

  // category totals per month
  const byMonthCat = groupBy(tx, (t) => `${t.yyyymm}__${t.category}`);
  const monthCatTotals = Array.from(byMonthCat.entries()).map(([k, rows]) => {
    const [m, c] = k.split("__");
    return { month: m, category: c, total: sum(rows.map((r) => r.amount)) };
  });

  
  const curMonthCatTotals = monthCatTotals.filter((r) => r.month === curMonth);
  let spike = null;
  for (const row of curMonthCatTotals) {
    const hist = monthCatTotals.filter((x) => x.category === row.category).map((x) => x.total);
    if (hist.length < 2) continue;
    const m = mean(hist);
    const s = stddev(hist);
    if (s === 0) continue;
    const z = (row.total - m) / s;
    if (!spike || z > spike.z) spike = { category: row.category, z, total: row.total, meanHist: m };
  }

  // most frequent merchant 
  const curByMerchant = groupBy(curTx, (t) => t.merchant);
  const freqMerchant = Array.from(curByMerchant.entries())
    .map(([merchant, rows]) => ({ merchant, count: rows.length, spend: sum(rows.map((r) => r.amount)) }))
    .sort((a, b) => b.count - a.count)[0];

  const insights = [];

  // month over month
  const detailMoM =
    deltaPct === null
      ? `You spent $${curSpend.toFixed(2)} in ${curMonth}.`
      : `You spent $${curSpend.toFixed(2)} in ${curMonth}, which is ${deltaPct >= 0 ? "up" : "down"} ${Math.abs(deltaPct).toFixed(1)}% vs ${prevMonth} ($${prevSpend.toFixed(2)}).`;
  insights.push({ title: "Month-over-month spending", detail: detailMoM });

  // category 
  if (spike && spike.z > 1.2) {
    insights.push({
      title: `Spike in ${spike.category}`,
      detail: `${spike.category} spending of $${spike.total.toFixed(2)} is unusually high vs your typical $${spike.meanHist.toFixed(2)} (z=${spike.z.toFixed(2)}). Consider setting a weekly cap.`,
    });
  } else {
    insights.push({
      title: "Stable category trends",
      detail: "No unusually high category spend detected this month.",
    });
  }

  // frequent merchant
  if (freqMerchant) {
    insights.push({
      title: "Most frequent merchant",
      detail: `${freqMerchant.merchant} appears ${freqMerchant.count}× this month (total $${freqMerchant.spend.toFixed(2)}).`,
    });
  }

  return insights;
}

// goal forecast 
export function forecastGoal(rawTxns, goalAmount, goalMonths) {
  const tx = normalize(rawTxns);
  if (!goalAmount || !goalMonths || goalAmount <= 0 || goalMonths <= 0) {
    return { onTrack: false, monthlyNeeded: 0, potentialMonthlySavings: 0, note: "Enter a valid goal to forecast." };
  }

  const byMonth = groupBy(tx, (t) => t.yyyymm);
  const monthTotals = Array.from(byMonth.values()).map((rows) => sum(rows.map((r) => r.amount)));
  const avgMonthlySpend = mean(monthTotals);
  const potentialMonthlySavings = 0.2 * avgMonthlySpend; 
  const monthlyNeeded = goalAmount / goalMonths;
  const onTrack = potentialMonthlySavings >= monthlyNeeded;

  const note = onTrack
    ? "You're on track if you redirect ~20% of your typical monthly spend."
    : "You're off track with the current 20% savings heuristic. Trim high-flex categories or extend the timeline.";

  return { onTrack, monthlyNeeded: Number(monthlyNeeded.toFixed(2)), potentialMonthlySavings: Number(potentialMonthlySavings.toFixed(2)), note };
}

// detects subscriptions 
export function detectSubscriptions(rawTxns) {
  const tx = normalize(rawTxns).sort((a, b) => a.date.valueOf() - b.date.valueOf());
  const byMerchant = groupBy(tx, (t) => t.merchant);

  const results = [];
  for (const [merchant, rows] of byMerchant.entries()) {
    if (rows.length < 2) continue;

    
    const gaps = [];
    for (let i = 1; i < rows.length; i++) {
      gaps.push(rows[i].date.diff(rows[i - 1].date, "day"));
    }
    const avgGap = mean(gaps);

    if (avgGap < 25 || avgGap > 35) continue;

    // amount stability
    const amounts = rows.map((r) => r.amount);
    const aMean = mean(amounts);
    const within = amounts.every((a) => Math.abs(a - aMean) / aMean <= 0.15);
    if (!within) continue;

    results.push({
      merchant,
      amount: aMean,
      note: `Recurring ~monthly (avg gap ${avgGap.toFixed(0)} days). Consider canceling if unused.`,
    });
  }
  // sorting by amount descending
  results.sort((a, b) => b.amount - a.amount);
  return results;
}
