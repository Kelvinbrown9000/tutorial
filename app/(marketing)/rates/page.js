import PageHero from "@/components/PageHero";
import Disclaimer from "@/components/Disclaimer";
import { rates, disclaimers } from "@/content/site";

export const metadata = {
  title: "Current Rates",
  description:
    "View today's rates on savings accounts, certificates, auto loans, mortgages, personal loans, and credit cards at Guardian Trust FCU.",
};

const savingsRates = [
  { product: "Share Savings", min: "$5", rate: "1.50%", unit: "APY" },
  { product: "High-Yield Savings", min: "$500", rate: "4.75%", unit: "APY" },
  { product: "Money Market ($0–$2,499)", min: "$0", rate: "2.25%", unit: "APY" },
  { product: "Money Market ($2,500+)", min: "$2,500", rate: "3.95%", unit: "APY" },
  { product: "Interest Checking", min: "$1,500", rate: "0.15%", unit: "APY" },
];

const cdRates = [
  { term: "3 Months", rate: "4.25%", unit: "APY", min: "$500" },
  { term: "6 Months", rate: "4.60%", unit: "APY", min: "$500" },
  { term: "12 Months", rate: "5.10%", unit: "APY", min: "$500" },
  { term: "24 Months", rate: "4.85%", unit: "APY", min: "$500" },
  { term: "36 Months", rate: "4.50%", unit: "APY", min: "$500" },
  { term: "60 Months", rate: "4.25%", unit: "APY", min: "$500" },
];

const loanRates = [
  { product: "New Auto (up to 36 mo)", rate: "5.24%", unit: "APR" },
  { product: "New Auto (37–60 mo)", rate: "5.74%", unit: "APR" },
  { product: "Used Auto (up to 36 mo)", rate: "5.74%", unit: "APR" },
  { product: "Personal Loan", rate: "8.99%", unit: "APR" },
  { product: "Home Equity Loan", rate: "7.25%", unit: "APR" },
  { product: "HELOC", rate: "7.99%", unit: "APR" },
];

const mortgageRates = [
  { product: "30-Year Fixed", rate: "6.49%", unit: "APR" },
  { product: "15-Year Fixed", rate: "5.99%", unit: "APR" },
  { product: "5/1 ARM", rate: "5.75%", unit: "APR" },
  { product: "FHA 30-Year", rate: "6.75%", unit: "APR" },
];

export default function RatesPage() {
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <>
      <PageHero
        title="Current Rates"
        subtitle={`Rates effective ${today}. Rates are subject to change without notice.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Rates" }]}
      />

      <div className="py-16 bg-[#f4f4f5]">
        <div className="container-site max-w-4xl space-y-10">
          <RatesTable title="Savings & Deposit Accounts" columns={["Product", "Min. Balance", "Rate"]} rows={savingsRates.map(r => [r.product, r.min, `${r.rate} ${r.unit}`])} />
          <RatesTable title="Share Certificates (CDs)" columns={["Term", "Min. Deposit", "Rate"]} rows={cdRates.map(r => [r.term, r.min, `${r.rate} ${r.unit}`])} />
          <RatesTable title="Consumer Loans" columns={["Product", "", "Rate"]} rows={loanRates.map(r => [r.product, "—", `${r.rate} ${r.unit}`])} />
          <RatesTable title="Mortgage Loans" columns={["Product", "", "Rate"]} rows={mortgageRates.map(r => [r.product, "—", `${r.rate} ${r.unit}`])} />

          <div className="bg-white rounded-2xl border border-[#e4e4e7] p-6">
            <Disclaimer text={disclaimers.apyGeneral} />
            <Disclaimer text={disclaimers.loanGeneral} className="mt-2" />
            <Disclaimer text={disclaimers.mortgageGeneral} className="mt-2" />
          </div>
        </div>
      </div>
    </>
  );
}

function RatesTable({ title, columns, rows }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#0d1f3c] mb-4">{title}</h2>
      <div className="overflow-x-auto rounded-2xl border border-[#e4e4e7] bg-white" style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}>
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="bg-[#0d1f3c] text-white">
              {columns.map((col, i) => (
                <th key={i} className={`px-5 py-3.5 font-semibold text-left ${i === 0 ? "rounded-tl-2xl" : ""} ${i === columns.length - 1 ? "rounded-tr-2xl text-right" : ""}`} scope="col">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e4e4e7]">
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-[#f4f4f5]"}>
                {row.map((cell, ci) => (
                  <td key={ci} className={`px-5 py-3.5 ${ci === 0 ? "font-medium text-[#0d1f3c]" : "text-[#52525b]"} ${ci === row.length - 1 ? "text-right font-bold text-[#1f7f4a]" : ""}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
