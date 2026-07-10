import { getAllContent } from "@/lib/content";

export default async function SalaryPage() {
  const data = await getAllContent(["SALARY_RATES", "INCOME_PROGRESSION"]);
  const salaryRates = data.SALARY_RATES || [];
  const incomeProgression = data.INCOME_PROGRESSION || [];

  return (
    <>
      <h1 className="page-title">💵 Salary Guide</h1>
      <p className="page-sub">
        General USD/hour estimates for international clients — a starting reference, not a guarantee.
      </p>
      <div className="card">
        <div className="section-title" style={{ marginTop: 0 }}>
          Rates by Role &amp; Experience Level
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Beginner</th>
                <th>Intermediate</th>
                <th>Expert</th>
              </tr>
            </thead>
            <tbody>
              {salaryRates.map((r, i) => (
                <tr key={i}>
                  <td>
                    <strong>{r[0]}</strong>
                  </td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <div className="section-title" style={{ marginTop: 0 }}>
          Sample Monthly Income Progression (Virtual Assistant example)
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timeframe</th>
                <th>Rate</th>
                <th>Hours/Week</th>
                <th>Est. Monthly Income</th>
              </tr>
            </thead>
            <tbody>
              {incomeProgression.map((r, i) => (
                <tr key={i}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>
                    <strong>{r[3]}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <div className="section-title" style={{ marginTop: 0 }}>
          🧮 How to Set Your Own Rate
        </div>
        <ol style={{ fontSize: 13.5, lineHeight: 1.8 }}>
          <li>Research market rate for your role/niche using this table and real job posts.</li>
          <li>Factor in your costs — internet, tools, taxes, healthcare.</li>
          <li>Start slightly below market average if brand new, but not drastically lower.</li>
          <li>Increase your rate every 3-6 months as you gain testimonials and confidence.</li>
          <li>Charge more for specialized skill combinations.</li>
        </ol>
        <div className="callout">
          ⚠️ Common mistakes: underpricing to &quot;win&quot; a client, never raising rates with existing clients,
          ignoring non-billable time, comparing rates without adjusting for niche/region/experience.
        </div>
      </div>
    </>
  );
}
