/* Synthetic, deterministic data for the Mal Principal Business Intelligence case study. No customer or bank data is used. */
const BI_DATA = {
  asOf: '31 Jul 2026',
  months: ['Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Mar 26','Apr 26','May 26','Jun 26','Jul 26'],
  activeCustomers: [11980,12420,12970,13410,14080,14620,15110,15690,16260,16920,17410,18640],
  savings: [51.2,54.8,57.4,60.8,63.1,67.5,70.9,75.4,79.1,84.7,89.2,94.8],
  loanBook: [94.4,98.2,102.9,107.8,112.3,117.9,122.4,127.3,131.6,136.4,140.1,142.6],
  par30: [2.7,2.8,2.7,2.6,2.7,2.5,2.6,2.5,2.5,2.4,2.5,2.4],
  revenue: [3.15,3.36,3.52,3.66,3.98,4.16,4.48,4.71,5.04,5.43,5.82,6.42],
  kpis: [
    {label:'Certified active customers', value:'18,640', delta:'+7.1% QoQ', trend:'good', domain:'Enterprise', status:'Certified', note:'Enterprise Active Customer'},
    {label:'Net revenue', value:'AED 6.42m', delta:'+10.3% MoM', trend:'good', domain:'Finance', status:'Certified', note:'Revenue, net of incentives'},
    {label:'Savings balance', value:'AED 94.8m', delta:'+6.3% MoM', trend:'good', domain:'Finance', status:'Certified', note:'Closing customer deposits'},
    {label:'Gross loan book', value:'AED 142.6m', delta:'+1.8% MoM', trend:'good', domain:'Credit', status:'Certified', note:'Principal outstanding'},
    {label:'Approval rate', value:'61.8%', delta:'+1.2pp vs floor', trend:'good', domain:'Credit', status:'Certified', note:'Final approvals / adjudicated'},
    {label:'PAR30', value:'2.4%', delta:'−0.2pp YoY', trend:'good', domain:'Risk', status:'Certified', note:'30+ DPD principal / gross loan book'},
    {label:'Digital activation', value:'74.6%', delta:'+2.9pp QoQ', trend:'good', domain:'Product', status:'Certified', note:'Activated in 7 days'},
    {label:'Early delinquency', value:'2.8%', delta:'+0.3pp MoM', trend:'warn', domain:'Risk', status:'Exploratory', note:'New-to-Credit segment'}
  ],
  revenueMix: [{name:'Interest income',value:3.04,color:'#155e59'},{name:'Interchange & payment fees',value:1.46,color:'#39a293'},{name:'Savings spread',value:1.12,color:'#8b7ad7'},{name:'Origination & service fees',value:0.80,color:'#d39a41'}],
  funnel: [{name:'Applications started',value:12840,percent:100},{name:'Submitted',value:9640,percent:75.1},{name:'Adjudicated',value:8430,percent:65.7},{name:'Approved',value:5210,percent:40.6},{name:'Funded',value:4760,percent:37.1}],
  riskSegments: [{name:'New-to-Credit',value:2.8,limit:3.0},{name:'Repeat borrower',value:1.7,limit:3.0},{name:'Payroll-linked',value:0.9,limit:3.0}],
  vintage: {labels:['Feb 26','Mar 26','Apr 26','May 26','Jun 26','Jul 26'], values:[2.2,2.5,2.3,2.6,2.7,2.4]},
  definitions: [
    {team:'Finance',metric:'Billable account',value:'16,980',status:'Exploratory',rule:'Customer with ≥1 settled revenue-bearing event in the month.',why:'Useful for fee and revenue attribution; excludes borrowers with no payment event.',accent:'amber'},
    {team:'Product',metric:'Engaged user',value:'17,420',status:'Exploratory',rule:'Customer with ≥2 meaningful app events in trailing 30 days.',why:'Useful for product adoption; counts journeys even if no financial activity occurred.',accent:'violet'},
    {team:'Credit',metric:'Active borrower',value:'7,860',status:'Exploratory',rule:'Customer with principal outstanding at month-end.',why:'Useful for portfolio management; intentionally limited to credit customers.',accent:'teal'}
  ],
  metrics: [
    ['KPI-01 · Enterprise Active Customer','Enterprise','Product Analytics','Unique verified customer with ≥1 posted payment transaction OR open loan principal at calendar month-end; fraud-confirmed and closed accounts excluded.','COUNT(DISTINCT customer_id WHERE posted_txn OR open_principal_eom)','mart_customer_monthly','Daily 06:00 GST','Certified'],
    ['KPI-02 · Total Customer Base','Enterprise','Product Analytics','Unique verified customers with any open product or historical completed onboarding.','COUNT(DISTINCT verified_customer_id)','dim_customer','Daily 06:00 GST','Certified'],
    ['KPI-03 · Customer Retention','Product','Product Analytics','Prior-month certified active customers also certified active in the current month.','retained_active / prior_month_active','mart_customer_monthly','Monthly +1','Certified'],
    ['KPI-04 · Net Revenue','Finance','Finance Control','Recognised interest, interchange, and fees less customer incentives and reversals in the month.','SUM(revenue_components) − SUM(incentives + reversals)','mart_finance_monthly','Month-end +2','Certified'],
    ['KPI-05 · Savings Balance','Finance','Treasury','Customer deposit principal at end of calendar day; excludes internal and suspense accounts.','SUM(deposit_principal_eod)','mart_finance_daily','Daily 06:15 GST','Certified'],
    ['KPI-06 · Cost-to-Income Ratio','Finance','Finance Control','Operating expenses divided by net revenue for the reporting period.','operating_expense / net_revenue','mart_finance_monthly','Month-end +3','Certified'],
    ['KPI-07 · Approval Rate','Credit','Credit Operations','Final approved applications as a share of applications with a final approve/decline outcome; withdrawals and pending cases excluded.','approved / (approved + declined)','mart_credit_application_daily','Daily 06:30 GST','Certified'],
    ['KPI-08 · Funded Conversion','Credit','Credit Operations','Approved applications that reached disbursement within 30 days.','funded_30d / approved','mart_credit_application_daily','Daily 06:30 GST','Certified'],
    ['KPI-09 · Gross Loan Book','Credit','Credit Finance','Outstanding principal before expected-credit-loss provisions, including contractual arrears.','SUM(principal_outstanding_eod)','mart_credit_portfolio_daily','Daily 06:30 GST','Certified'],
    ['KPI-10 · PAR30','Risk','Credit Risk','Principal outstanding on loans 30 or more days past due divided by gross loan book.','SUM(principal WHERE dpd ≥ 30) / gross_loan_book','mart_credit_portfolio_daily','Daily 06:30 GST','Certified'],
    ['KPI-11 · Net Charge-off Rate','Risk','Credit Risk','Annualised net charged-off principal less recoveries divided by average gross loan book.','12 × (charge_offs − recoveries) / avg_glb','mart_credit_portfolio_daily','Month-end +3','Certified'],
    ['KPI-12 · Early Delinquency','Risk','Credit Risk','Principal on loans 1–29 days past due divided by current gross loan book; shown by risk segment.','SUM(principal WHERE 1 ≤ dpd ≤ 29) / gross_loan_book','mart_credit_portfolio_daily','Daily 06:30 GST','Exploratory'],
    ['KPI-13 · Digital Activation','Product','Product Analytics','New verified customers completing first meaningful in-app action within 7 calendar days of verification.','activated_in_7d / verified_new_customers','mart_customer_monthly','Daily 06:00 GST','Certified'],
    ['KPI-14 · Payment Success Rate','Product','Payments','Successfully posted payment attempts divided by all authorised payment attempts, excluding customer cancellations.','posted_payment_attempts / authorised_attempts','mart_payments_daily','Daily 06:05 GST','Certified'],
    ['KPI-15 · Finance Billable Account','Finance','Finance Control','Customer with one or more settled revenue-bearing event in the month. Finance diagnostic only.','COUNT(DISTINCT customer_id WHERE settled_revenue_event)','mart_finance_monthly','Month-end +2','Exploratory'],
    ['KPI-16 · Product Engaged User','Product','Product Analytics','Customer with two or more meaningful app events during trailing 30 days. Product diagnostic only.','COUNT(DISTINCT customer_id WHERE meaningful_events_30d ≥ 2)','mart_product_events_daily','Daily 06:00 GST','Exploratory'],
    ['KPI-17 · Active Borrower','Credit','Credit Operations','Customer with principal outstanding at final calendar day of the month. Credit diagnostic only.','COUNT(DISTINCT customer_id WHERE principal_eom > 0)','mart_credit_portfolio_daily','Daily 06:30 GST','Exploratory'],
    ['KPI-18 · Data Freshness SLA','Enterprise','Principal Business Intelligence','Share of certified data products refreshed by their published SLA.','on_time_certified_marts / certified_marts','bi_observability_daily','Daily 07:00 GST','Certified'],
    ['KPI-19 · Data Quality Pass Rate','Enterprise','Principal Business Intelligence','Share of active critical data quality tests passing on the latest successful refresh.','passing_critical_tests / critical_tests_run','bi_observability_daily','Daily 07:00 GST','Certified']
  ]
};
