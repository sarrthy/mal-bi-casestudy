# Mal Enterprise BI Foundation — Principal Business Intelligence case study

Live prototype: publish `index.html` through GitHub Pages, Netlify, or Vercel. The site is intentionally a no-backend static application so reviewers can access it without an account.

## What this demonstrates

- An executive dashboard with 8 enterprise KPIs across Finance, Product, Credit, and Risk.
- A Credit & Lending dashboard: funnel, funded conversion, portfolio quality, risk segment monitor, and a decision recommendation.
- A transparent metric-conflict screen that shows the three pre-existing meanings of “active customer” and a certified enterprise measure.
- A 19-metric data dictionary including owner, definition, formula, source mart, refresh cadence, and certification status.
- A self-service dataset catalogue, access SLA, support service-level expectations, and a practical 90-day plan for a solo BI lead.

All values are deterministic synthetic data designed only for this exercise. They do not represent Mal, any customer, or any banking portfolio.

## Stack choice

This is a dependency-light static web app: HTML, CSS, vanilla JavaScript, and Chart.js loaded from CDN. The choice is deliberate for the case-study context: it is public by default, deploys to GitHub Pages in seconds, and makes all definition logic reviewable in source control. In production, the presentation layer would be backed by a governed semantic layer and role-based BI platform—not browser-embedded data.

## Data model and metric consistency

`data.js` is the prototype’s synthetic semantic layer. It defines monthly aggregates, application funnel counts, risk segments, the executive KPI values, and the dictionary. The dashboards render from the same source constants used by the dictionary.

The target production mart pattern is:

| Mart | Grain | Primary purpose |
|---|---|---|
| `dim_customer` | customer | verified customer identity and exclusions |
| `mart_customer_monthly` | customer-month | certified activity, retention, activation |
| `mart_credit_application_daily` | application-day | application through funding funnel |
| `mart_credit_portfolio_daily` | loan-day | principal, DPD, vintage, charge-offs |
| `mart_finance_daily` / `monthly` | account-day / month | balances, revenue, GL reconciliation |
| `bi_observability_daily` | mart-day | freshness and data-quality controls |

The intended joins are through a conformed customer key and calendar date. Financial and credit measures retain their native account/loan grains and are aggregated only after their prescribed filters.

## Reading the metric conflict resolution view

The three original measures are not labelled “wrong.” They answer different domain questions:

1. **Finance billable account** identifies settled revenue-bearing activity.
2. **Product engaged user** identifies meaningful digital engagement.
3. **Credit active borrower** identifies an outstanding credit relationship.

The certified **Enterprise Active Customer** is a purpose-built enterprise measure: a unique verified customer with at least one posted payment transaction **or** an open loan principal balance at month-end. It is de-duplicated at the customer level, excludes fraud-confirmed / closed accounts, and is refreshed daily. The reconciliation line demonstrates why the figure is 18,640: 16,980 Finance-billable customers plus 1,660 active borrowers without payment activity. Product engagement is retained as a domain diagnostic rather than forced into an enterprise financial-activity measure.

Certification is governed by a monthly Metric Council, with Product Analytics accountable for the measure and Finance, Credit Operations, and Credit Risk as consulted parties. A certified KPI change requires an owner, decision use case, source/lineage impact assessment, test plan, and Principal Business Intelligence approval.

## 90-day approach

The dashboard includes the phased plan. The sequencing is intentional: first make executive decisions safe; then make the trusted layer repeatable and observable; finally use adoption and data-debt evidence to select the long-term BI platform and team roadmap. As a solo hire, I would not attempt a wholesale warehouse rebuild before resolving ownership and the highest-risk decision metrics.

## Run locally

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Publish publicly

### GitHub Pages

1. Create a GitHub repository and push this folder’s contents to `main`.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
3. The included workflow publishes it at `https://<github-user>.github.io/<repository>/` without login.

Because this is static, no credentials, environment variables, or server process are required.
