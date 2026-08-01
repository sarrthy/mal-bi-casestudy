# Trackable metric data architecture

This prototype is designed to be rebuilt in Power BI, Looker, Tableau, Metabase, or a comparable BI tool without custom application logic. It uses standard visual types only: KPI cards, line charts, bar charts, tables, and dropdown filters.

## Synthetic import files

- `data/synthetic_enterprise_monthly.csv` drives the executive time series and can be imported as one monthly fact table.
- `data/synthetic_financing_funnel.csv` drives the financing funnel.
- `data/source_system_map.csv` documents the production acquisition path for each governed mart.

## Production acquisition pattern

```text
Source systems → governed raw zone → tested warehouse marts → semantic model → BI tool
```

The production source systems and required fields are listed in `data/source_system_map.csv`. Each source lands with an ingestion timestamp and source record ID. Warehouse tests validate freshness, uniqueness, referential integrity, posted/settled status, and finance reconciliation before a mart is certified.

## Portable semantic model

| Model | Grain | Primary keys | BI relationship |
|---|---|---|---|
| `dim_customer` | customer | `customer_id` | One-to-many to customer, financing, payment, support, and AI facts |
| `dim_calendar` | calendar date | `date_key` | One-to-many to every fact date |
| `mart_customer_monthly` | customer-month | `customer_id`, `month_end_date` | Executive customer / inclusion metrics |
| `mart_financing_application_daily` | application-day | `application_id`, `date_key` | Financing funnel and approval metrics |
| `mart_financing_portfolio_daily` | financing-contract-day | `financing_contract_id`, `date_key` | Book, DPD, vintage, and credit-loss metrics |
| `mart_finance_monthly` | account-month | `account_id`, `month_end_date` | Financing profit income, balances, and reconciliation |
| `mart_sharia_controls_daily` | control exception | `exception_id`, `date_key` | Sharia control measures |
| `mart_ai_decision_daily` | automated decision | `decision_id`, `date_key` | Explainability and fairness monitoring |

## BI-tool implementation

1. Import the certified marts or prototype CSVs into the BI platform.
2. Join facts only through `dim_customer` and `dim_calendar`; do not join account, financing, and transaction facts directly.
3. Implement the formulas in the KPI Dictionary as semantic measures. Certified measures are promoted to the shared semantic layer; exploratory measures remain in the domain workspace.
4. Apply row-level security by country, business unit, and data classification. Never expose PII in the executive model.
5. Set scheduled refreshes to the dictionary cadence and show freshness status from `bi_observability_daily`.

The synthetic CSVs are review aids only. In production, data is acquired from the named source systems through controlled, auditable ingestion—not by manual spreadsheet upload.
