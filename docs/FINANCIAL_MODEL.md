# Financial Model — Khatabook AI

> **AI-Powered Invoice & Receipt Scanner for Indian Freelancers & Small Businesses**
> Version 1.0 | September 2026

---

## Cost Structure

### 1. Development Costs (One-Time)

| Item | Cost | Timing |
|---|---|---|
| Initial MVP build | ₹2,00,000 | Month 0 |
| Design (UI/UX) | ₹50,000 | Month 0–1 |
| AI/ML development (OCR pipeline, classification) | ₹1,50,000 | Month 0–2 |
| Mobile PWA optimization | ₹50,000 | Month 2–3 |
| WhatsApp integration | ₹25,000 | Month 3–4 |
| API integrations (GSTN, UPI) | ₹50,000 | Month 4–6 |
| QA & Bug fixes | ₹25,000 | Ongoing |
| **Total Development** | **₹5,50,000** | **Months 0–6** |

> **Note:** If built solo with AI-assisted coding, development costs can be reduced to ~₹1.5–2L. The figures above assume hiring 1–2 part-time developers.

### 2. Recurring Monthly Costs (Steady State)

| Cost Category | Amount/Month | Notes |
|---|---|---|
| **Hosting (Vercel + Supabase)** | ₹5,000 | Vercel Pro (~$20) + Supabase Pro (~$25) + storage |
| **AI API Costs (OpenAI GPT-4o)** | ₹10,000 | At 10K scans/day @ ~₹2–3/scan; scales with usage |
| **WhatsApp Business API** | ₹2,000 | Message fees for receipt processing |
| **Payment Gateway Fees (Razorpay)** | ~₹5,000 | 2–3% of ₹2–3L GMV |
| **Domain, SSL, Email** | ₹1,000 | Zoho Mail / Resend |
| **Monitoring & Analytics** | ₹1,000 | Sentry, PostHog, Plausible |
| **Legal & Compliance** | ₹3,000 | Terms, Privacy Policy, GST registration, CA |
| **Marketing & Growth** | ₹20,000 | Content, ads, influencer fees |
| **Support Tools** | ₹2,000 | Crisp/Intercom, email tool |
| **Miscellaneous** | ₹2,000 | Design assets, stock photos |
| **Total Monthly (at 10K users)** | **₹51,000** | |

### 3. Scaling Costs (At Scale — 100K Users)

| Cost Category | Amount/Month | Notes |
|---|---|---|
| Hosting (Vercel Enterprise + Supabase Team) | ₹25,000 | CDN, database scaling |
| AI API Costs | ₹1,00,000 | 10x users, some optimization via caching |
| WhatsApp Business API | ₹20,000 | Volume messaging |
| Payment Gateway Fees | ₹50,000 | 2–3% of ₹20–25L GMV |
| Marketing & Growth | ₹2,00,000 | Paid ads, content team |
| Team Salaries | ₹3,00,000 | 1 dev, 1 designer, 1 marketer, 1 support |
| Legal, Accounting, CA | ₹15,000 | |
| **Total Monthly (at 100K users)** | **₹7,10,000** | |

---

## Break-Even Analysis

### Monthly Break-Even Calculation

| Item | Value |
|---|---|
| Monthly fixed costs | ₹51,000 |
| Variable cost per scan | ~₹3 (AI API) |
| Pro plan price | ₹149/month |
| Avg. scans per Pro user | ~30/month |
| Variable cost per Pro user | ₹90/month |
| Gross margin per Pro user | ₹59/month |

**Break-even users needed:**

```
Break-even revenue = Monthly costs
= ₹51,000

At ₹59 margin per user:
Break-even users = 51,000 / 59 = ~865 Pro users
```

**With mixed revenue (including Business tier):**
```
Blended avg. revenue per paid user: ~₹180/month
Blended avg. margin per paid user: ~₹120/month

Break-even paid users = 51,000 / 120 = ~425 paid users
```

**Break-even with free users (total user base):**
```
At 10% conversion rate:
Total users needed = 425 / 0.10 = ~4,250 total users
```

### Time to Break-Even

| Scenario | Assumptions | Break-Even Month |
|---|---|---|
| **Conservative** | Slow growth, 5% conversion, ₹50K/mo marketing | Month 14–16 |
| **Base Case** | Steady growth, 10% conversion, ₹50K/mo marketing | Month 8–10 |
| **Optimistic** | Viral growth, 15% conversion, viral referrals | Month 5–6 |

---

## 3-Year Financial Projections

### Year 1: Foundation

| Quarter | Users | Paid | MRR | Revenue (Q) | Total Costs (Q) | Net |
|---|---|---|---|---|---|---|
| Q1 | 5,000 | 250 | ₹43K | ₹1.3L | ₹3.5L | **-₹2.2L** |
| Q2 | 15,000 | 750 | ₹1.3L | ₹3.9L | ₹3.5L | **+₹0.4L** |
| Q3 | 30,000 | 1,500 | ₹2.6L | ₹7.8L | ₹4.0L | **+₹3.8L** |
| Q4 | 50,000 | 2,500 | ₹4.3L | ₹13L | ₹4.5L | **+₹8.5L** |

| Year 1 Total | 50,000 | 2,500 | ₹4.3L (end MRR) | ₹26L | ₹15.5L | **+₹10.5L** |

> Year 1 likely to show a small loss in Q1–Q2 due to upfront development costs, turning profitable by Q3.

### Year 2: Growth

| Quarter | Users | Paid | MRR | Revenue (Q) | Total Costs (Q) | Net |
|---|---|---|---|---|---|---|
| Q1 | 80,000 | 5,500 | ₹9.2L | ₹27.6L | ₹8.0L | **+₹19.6L** |
| Q2 | 120,000 | 8,800 | ₹14.8L | ₹44.4L | ₹10.0L | **+₹34.4L** |
| Q3 | 170,000 | 13,200 | ₹22.3L | ₹66.9L | ₹12.0L | **+₹54.9L** |
| Q4 | 220,000 | 17,700 | ₹29.9L | ₹89.7L | ₹15.0L | **+₹74.7L** |

| Year 2 Total | 220,000 | 17,700 | ₹29.9L (end MRR) | ₹228.6L | ₹45.0L | **+₹183.6L** |

### Year 3: Scale

| Quarter | Users | Paid | MRR | Revenue (Q) | Total Costs (Q) | Net |
|---|---|---|---|---|---|---|
| Q1 | 280,000 | 24,000 | ₹40L | ₹1.2Cr | ₹18.0L | **+₹1.02Cr** |
| Q2 | 330,000 | 30,500 | ₹50.8L | ₹1.52Cr | ₹20.0L | **+₹1.32Cr** |
| Q3 | 380,000 | 37,500 | ₹62.5L | ₹1.88Cr | ₹22.0L | **+₹1.66Cr** |
| Q4 | 400,000 | 40,000 | ₹67L | ₹2.01Cr | ₹25.0L | **+₹1.76Cr** |

| Year 3 Total | 400,000 | 40,000 | ₹67L (end MRR) | ₹6.6Cr | ₹85.0L | **+₹5.75Cr** |

### Summary: 3-Year P&L

| Year | Revenue | Costs | Net Profit | Margin |
|---|---|---|---|---|
| Year 1 | ₹26L | ₹15.5L | +₹10.5L | 40% |
| Year 2 | ₹229L | ₹45L | +₹184L | 80% |
| Year 3 | ₹660L | ₹85L | +₹575L | 87% |

---

## Cash Flow Analysis

### Year 1 Cash Flow

| Month | Inflow (Revenue) | Outflow (Costs) | Net Cash | Cumulative |
|---|---|---|---|---|
| 0 (dev) | ₹0 | ₹3,50,000 | -₹3.5L | -₹3.5L |
| 1 | ₹20K | ₹55K | -₹35K | -₹3.85L |
| 2 | ₹30K | ₹52K | -₹22K | -₹4.07L |
| 3 | ₹40K | ₹50K | -₹10K | -₹4.17L |
| 4 | ₹1L | ₹50K | +₹50K | -₹3.67L |
| 5 | ₹2L | ₹50K | +₹1.5L | -₹2.17L |
| 6 | ₹3L | ₹50K | +₹2.5L | ₹0.33L |
| 7 | ₹4L | ₹50K | +₹3.5L | ₹3.83L |
| 8 | ₹5L | ₹50K | +₹4.5L | ₹8.33L |
| 9 | ₹7L | ₹50K | +₹6.5L | ₹14.83L |
| 10 | ₹8L | ₹50K | +₹7.5L | ₹22.33L |
| 11 | ₹10L | ₹50K | +₹9.5L | ₹31.83L |
| 12 | ₹13L | ₹50K | +₹12L | ₹43.83L |

**Peak cash requirement:** ~₹4.2L (Month 3) — easily covered by bootstrapping/small seed.

---

## Funding Requirements

### Bootstrap Scenario (Recommended)

**Total required:** ₹5–7 Lakhs

| Source | Amount |
|---|---|
| Founder personal savings | ₹3,00,000 |
| Friends & family | ₹1,00,000 |
| Revenue (from Month 3+) | ₹1–4L |

**No external funding needed.** The business becomes cash-flow positive by Month 6, with minimal upfront costs.

### Seed Round Scenario (If Accelerating)

**Total required:** ₹50–75 Lakhs

| Use | Amount | Timing |
|---|---|---|
| Team expansion (2 devs, 1 designer, 1 marketer) | ₹30L | Year 1 |
| Marketing & user acquisition | ₹20L | Year 1 |
| Infrastructure scaling | ₹5L | Year 1 |
| Legal & compliance | ₹2L | Year 1 |
| Working capital buffer | ₹8–13L | Year 1 |

**Funding sources:**
- Angel investors (fintech-aware angels in Bangalore/Mumbai)
- Accelerators: YC India (if eligible), Sequoia Surge, Axilor
- Bootcamp: Google for Startups, Microsoft for Startups (credits)

**Valuation at Seed (Year 1 end):**
- ARR: ₹26L
- Growth rate: 300% YoY
- Comparable SaaS multiples: 10–15x ARR
- **Valuation: ₹2.6–3.9 Crores**

---

## Sensitivity Analysis

### Key Variables & Impact

| Variable | -20% Impact | Base | +20% Impact |
|---|---|---|---|
| Conversion rate (free → paid) | 8% | 10% | 12% |
| Pro price (₹) | ₹119 | ₹149 | ₹179 |
| Marketing spend (₹/month) | ₹16K | ₹20K | ₹24K |
| AI cost per scan | ₹2.4 | ₹3 | ₹3.6 |
| **Year 1 Revenue Impact** | ₹20L | ₹26L | ₹32L |

### Worst-Case Scenario

- Conversion rate drops to 5%
- AI costs increase 30% due to OpenAI pricing changes
- Marketing is 2x less efficient

**Year 1 Revenue:** ₹15L → still covers costs by Q3
**Survival runway with ₹3.5L initial capital:** 12 months

### Best-Case Scenario

- Conversion rate hits 15%
- Viral referral loop drives 40% organic signups
- Annual billing at 40% uptake

**Year 1 Revenue:** ₹40L+ → profitable by Q2
**MRR at Year 1 end:** ₹6L+

---

## Financial Health Metrics

### SaaS Metrics (Year 2 Target)

| Metric | Target | Benchmark |
|---|---|---|
| MRR | ₹15L | — |
| ARR | ₹1.8Cr | — |
| Gross Margin | 85%+ | > 70% is good |
| Net Revenue Retention | 110%+ | > 100% is healthy |
| LTV:CAC | 30:1+ | > 3:1 is acceptable |
| CAC Payback Period | < 3 months | < 12 months is good |
| Monthly Churn | < 3% | < 5% is acceptable |
| NRR (Net Dollar Retention) | 115%+ | > 110% is excellent |

### Burn Rate

| Stage | Monthly Burn | Runway (with ₹3.5L) |
|---|---|---|
| Pre-launch (dev) | ₹1L | 3.5 months |
| Beta (Month 1–2) | ₹55K | 6+ months |
| Growth (Month 3–6) | ₹50K | 7+ months |
| Scale (Month 6+) | ₹1L+ | 3.5 months (fundraise) |

---

## Tax & Compliance Considerations

| Item | Details |
|---|---|
| **Business Registration** | Pvt. Ltd. or LLP (recommended) |
| **GST Registration** | Mandatory if revenue > ₹40L/year (likely in Year 1) |
| **GST Rate** | 18% on SaaS subscriptions (CGST 9% + SGST 9%) |
| **TDS on Payments** | 10% TDS on contractor payments > ₹30K |
| **Income Tax** | 30% on profits (add surcharge if applicable) |
| **Professional Tax** | Varies by state (~₹200–2,500/year) |
| **Accounting** | Monthly books, quarterly TDS returns, annual audit |

### Razorpay Fee Impact on Pricing

- Razorpay charges 2% per transaction
- On ₹149: Razorpay fee = ₹3
- **Net revenue per Pro subscription:** ₹146/month
- **No impact on pricing** — absorbed as cost of doing business

---

## Key Assumptions

1. **AI costs decrease** by 20% YoY as models get more efficient and we implement caching strategies
2. **Hosting costs** scale sub-linearly with users (efficiency gains from edge caching)
3. **Conversion rate** improves over time as product-market fit strengthens (8% → 12%)
4. **Churn decreases** over time (5% → 3%) as product quality improves and features expand
5. **Organic growth share** increases from 30% (Year 1) to 50% (Year 3) as brand builds
6. **Annual billing uptake** stabilizes at 30% of paid users
7. **No significant competitive price war** in the first 24 months

---

*End of Financial Model*
