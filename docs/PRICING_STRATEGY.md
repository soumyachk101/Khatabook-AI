# Pricing Strategy — Khatabook AI

> **AI-Powered Invoice & Receipt Scanner for Indian Freelancers & Small Businesses**
> Version 1.0 | September 2026

---

## Pricing Tiers Overview

### Free — ₹0/month
**Tagline:** "Scan up to 10 receipts per month. No credit card required."

| Feature | Included |
|---|---|
| Monthly scan limit | 10 scans |
| Basic income & expense tracking | Yes |
| Manual CSV export | Yes |
| Receipt vault | 30-day retention |
| Language support | English only |
| Support | Community (Discord/WhatsApp) |
| Ads | Light in-app ads |

**Target:** User acquisition funnel — get freelancers and small business owners experiencing the core value of AI scanning with zero friction.

---

### Pro — ₹149/month | ₹1,188/year

**Tagline:** "Unlimited scans. GST reports. Professional bookkeeping — for less than your chai budget."

| Feature | Included |
|---|---|
| Monthly scan limit | Unlimited |
| AI-powered receipt scanning | Yes |
| Multi-language OCR (8+ languages) | Yes |
| Auto-categorization | Yes |
| GST report generation (GSTR-1, GSTR-3B) | Yes |
| Advanced analytics & insights | Yes |
| Receipt vault | Unlimited, cloud-backed |
| Bank statement import | Yes |
| Invoice generator | Yes |
| WhatsApp receipt scanning | Yes |
| Export formats | CSV, PDF |
| Support | Priority email |
| Ads | None |

**Target:** Serious freelancers, consultants, and small business owners who need GST compliance and reliable bookkeeping. Primary revenue driver.

---

### Business — ₹499/month | ₹3,992/year

**Tagline:** "Multi-user access. API. White-label reports. For agencies and growing businesses."

| Feature | Included |
|---|---|
| Everything in Pro | Yes |
| Multi-user seats | Up to 5 users |
| Role-based permissions | Admin, Accountant, Viewer |
| API access | Full REST API |
| White-label PDF reports | Custom branding |
| Bulk receipt import | CSV batch upload |
| Dedicated account manager | Yes |
| Custom integrations | Available on request |
| Audit log | Full activity history |
| Priority phone + email support | Yes |

**Target:** Small agencies, growing MSMEs, CA firms managing multiple clients, medium-sized consultancies.

---

## Pricing Strategy

### 1. Price Anchoring Strategy

We use a **3-tier decoy pricing** model to guide users toward the Pro plan.

```
Free Pro ← SWEET SPOT Business
₹0 ₹149/mo ₹499/mo
```

**Psychological levers:**
- **Pro as the anchor:** Positioned as "the plan most freelancers choose" — 85% of landing page focus
- **Business as prestige/upgrade path:** Shows the value of Pro by comparison — "₹149 vs ₹499 — and you get multi-user, API, white-label"
- **Free as the funnel:** Not a competitor to Pro — it's the on-ramp. The 10-scan limit creates natural pull toward Pro

**Visual positioning on pricing page:**

```
[Recommended] badge on Pro plan
Checkmarks on Pro features
"Most Popular" tag on Pro plan
Business plan presented as "For Teams & Agencies"
```

### 2. Per-User vs. Per-Seat Pricing

- **Pro:** Per-user (single freelancer or sole proprietor)
- **Business:** Per-seat with team management — ₹499 covers up to 5 users (effective ₹100/user)
- **Enterprise:** Custom pricing for >20 users — contact sales

This structure rewards team adoption and reduces per-user cost at scale.

### 3. Regional Pricing Consideration

For early adoption in price-sensitive markets:

| Region | Adjustment |
|---|---|
| Tier 2/3 cities | Offer 20% coupon for first 3 months |
| Student verification | 50% off Pro (₹75/month) |
| CA referrals | 3 months free for every 5 referrals |
| NGO/NPO | Free Business tier for verified organizations |

---

## Discount Strategies

### Annual Billing Discount

**33% discount on annual billing** (vs. monthly):

| Plan | Monthly | Annual (monthly equivalent) | Savings |
|---|---|---|---|
| Pro | ₹149/month | ₹99/month (₹1,188/year) | ₹600/year |
| Business | ₹499/month | ₹333/month (₹3,992/year) | ₹1,996/year |

**Rationale:**
- Annual billing improves cash flow and reduces churn (users committed for 12 months)
- 33% is enough to be compelling but not so high that it signals low value
- Expected uptake: 20–30% of paid users choose annual

### Student Discount

- **50% off Pro plan** (₹75/month or ₹600/year)
- Verified via student ID or .ac.in email address
- Reversible: if student status is removed, reverts to full price
- Expected uptake: 10–15% of Pro users

### Referral Discount

| Referrer | Reward |
|---|---|
| Refer 1 friend | 1 month of Pro free |
| Refer 5 friends | 6 months of Pro free |
| Refer 10 friends | 1 year of Pro free |
| Top 10 referrers (quarterly) | Lifetime Pro + swag |

| Referee | Reward |
|---|---|
| Signs up via referral | 1 month of Pro free (no credit card needed for trial) |

### Launch Period Discount

- First 1,000 Pro subscribers: **₹99/month** for lifetime (grandfathered)
- Creates urgency and FOMO
- Rewards early adopters who take the product risk
- Price increases to ₹149 after 1,000 slots filled

### Seasonal / Festival Offers

- **Diwali sale:** 20% off annual plans (October–November)
- **New Year:** 25% off first 3 months of Pro
- **GST season (July–September):** Free GST report templates for new signups
- **Freelance Day (September 22):** 30% off annual plans

---

## Razorpay Subscription Setup

### Plan Configuration in Razorpay

#### Pro Plan (₹149/month)

```json
{
 "plan_id": "plan_ProMonthly",
 "name": "Khatabook AI Pro",
 "billing_cycle": 1,
 "billing_period": "month",
 "amount": 14900,
 "currency": "INR",
 "description": "Unlimited scans, GST reports, priority support",
 "notes": {
 "tier": "pro",
 "features": "unlimited_scans,gst_reports,priority_support"
 }
}
```

#### Pro Annual Plan (₹1,188/year)

```json
{
 "plan_id": "plan_ProAnnual",
 "name": "Khatabook AI Pro (Annual)",
 "billing_cycle": 12,
 "billing_period": "month",
 "amount": 118800,
 "currency": "INR",
 "description": "33% savings — billed ₹1,188/year",
 "notes": {
 "tier": "pro",
 "billing": "annual",
 "features": "unlimited_scans,gst_reports,priority_support"
 }
}
```

#### Business Plan (₹499/month)

```json
{
 "plan_id": "plan_BusinessMonthly",
 "name": "Khatabook AI Business",
 "billing_cycle": 1,
 "billing_period": "month",
 "amount": 49900,
 "currency": "INR",
 "description": "Multi-user, API, white-label",
 "notes": {
 "tier": "business",
 "features": "multi_user,api_access,white_label,priority_support"
 }
}
```

### Razorpay Webhook Handling

Set up webhooks for:

| Event | Action |
|---|---|
| `subscription.created` | Upgrade user tier in Supabase |
| `subscription.activated` | Enable Pro/Business features |
| `subscription.cancelled` | Downgrade to Free at period end |
| `subscription.paused` | Pause features, notify user |
| `subscription.activated` (renewal) | Renew access |
| `payment.failed` | Retry logic, send reminder email |
| `invoice.paid` | Send receipt, extend access |

### Razorpay Checkout Flow

1. User clicks "Upgrade to Pro" → pricing page
2. Selects Monthly or Annual billing
3. Clicks "Subscribe" → Razorpay Checkout modal opens
4. Completes payment (UPI, card, net banking, wallet)
5. Redirect to `/dashboard?upgraded=true`
6. Webhook confirms subscription → Supabase updated
7. Welcome email sent with Pro features guide

### Razorpay Test Mode

- Use Razorpay test keys during development
- Test card: `4111 1111 1111 1111` (Visa), any future expiry, any CVV
- Test UPI: Create a UPI ID in Razorpay dashboard

---

## Free Trial Strategy

### 14-Day Pro Trial

**Eligibility:**
- New users who sign up with email or phone
- Users who have used the Free tier and want to upgrade
- No credit card required to start trial

**Trial Mechanics:**

| Step | Action |
|---|---|
| 1. Sign up | User creates account (email/phone/Google) |
| 2. Auto-upgrade | Account automatically upgraded to Pro trial |
| 3. Feature access | Full Pro features unlocked for 14 days |
| 4. Scan limit | Unlimited scans during trial |
| 5. Day 10 reminder | Email + in-app notification: "4 days left in trial" |
| 6. Day 13 reminder | Email + in-app: "Last day! Subscribe to keep access" |
| 7. Day 14 (expiry) | Account reverts to Free tier |
| 8. Post-trial | 3-day grace period with limited Pro access |
| 9. Conversion prompt | "Resume Pro — ₹149/month" with annual billing option |

**Trial Conversion Tactics:**

1. **Onboarding tour:** Immediately after signup, walk users through scanning their first receipt. The "aha moment" must happen in the first 60 seconds.

2. **Progressive feature reveals:** Day 1 — scanner. Day 3 — reports. Day 7 — multi-language. Day 10 — WhatsApp integration. Keep discovering value.

3. **In-app value metrics:** Show "You've saved X hours and scanned Y receipts this week" to make value tangible.

4. **Smart timing:** Send upgrade prompts at moments of high engagement (after scanning 5+ receipts, after generating first GST report).

5. **No credit card friction:** Trial requires no payment info. Users convert when they feel the value, not because they're trapped.

6. **Trial extension offer:** If user doesn't convert at day 14, offer 7-day extension in exchange for 2-minute feedback survey.

### Trial → Paid Conversion Benchmarks

| Metric | Target |
|---|---|
| Trial activation (first scan within 24h) | 60%+ |
| Trial → Pro conversion | 15–20% |
| Trial → Annual billing | 30% of conversions |
| Average time to conversion | 7 days |

---

## Pricing Psychology & Positioning

### Value Framing

Instead of "₹149/month," frame as:

| Frame | Example |
|---|---|
| **Daily cost** | "Less than ₹5/day" |
| **Comparative** | "Less than your monthly Netflix + coffee" |
| **ROI-based** | "Save ₹2,000+ in CA fees annually" |
| **Time-based** | "Reclaim 10+ hours/month" |
| **Risk-reversed** | "14-day free trial. Cancel anytime." |

### Pricing Page Copy

```
HEADLINE: Professional bookkeeping, for less than your chai.

[PRO — RECOMMENDED]
₹149/month | ₹99/month billed annually

✓ Unlimited AI receipt scanning
✓ GST reports (GSTR-1, GSTR-3B)
✓ Multi-language support
✓ Cloud backup & sync
✓ Priority support

[Start Free Trial] [View Annual Pricing]

---

[BUSINESS — FOR TEAMS]
₹499/month | ₹333/month billed annually

Everything in Pro, plus:
✓ Multi-user access (up to 5)
✓ API access
✓ White-label reports
✓ Dedicated support

[Start Free Trial] [View Annual Pricing]

---

[FREE — GET STARTED]
₹0 forever

✓ 10 scans/month
✓ Basic tracking
✓ Community support

[Sign Up Free]
```

---

## Churn Prevention Pricing

### Win-Back Campaigns

| Trigger | Offer |
|---|---|
| Cancellation survey | 50% off next 3 months |
| Payment failure | 7-day grace period + payment reminder |
| 30-day inactive | Free month of Pro as "welcome back" |
| Downgrade from Business → Pro | First month of Business at ₹299 |

### Usage-Based Nudges

- If a Free user hits the 10-scan limit 3 months in a row → offer Pro at ₹99/month (special rate)
- If a Pro user hasn't scanned in 30 days → email with "We miss you — here's a free month"
- If a user cancels → exit survey + counter-offer within 48 hours

---

## Competitive Pricing Positioning

| Product | Pro Equivalent | Our Pro | Our Advantage |
|---|---|---|---|
| Zoho Books | ₹125/mo | ₹149/mo | ₹24 more for AI + India-specific features |
| QuickBooks India | ₹1,200/mo | ₹149/mo | ₹1,051 cheaper |
| Khatabook (app) | ₹89/yr | ₹1,188/yr | More features, but we win on AI + UX |
| Vyapar | ₹1,200/yr | ₹1,188/yr | Same price, but we're AI-powered and mobile-first |

**Positioning statement:** "Why pay for QuickBooks when Khatabook AI does the same job for 90% less — and it's actually designed for how Indian freelancers work?"

---

*End of Pricing Strategy*
