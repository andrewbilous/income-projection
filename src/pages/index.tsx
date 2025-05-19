// @ts-nocheck
import { useState, useRef } from "react";
import RateForm from "../components/RateForm";
import ProjectionChart from "../components/ProjectionChart";
import LatestPosts from "../components/LatestPosts";
import DonutChart from "../components/DonutChart";
import { calculateProjection, Inputs } from "../utils/projection";
import { generatePdf } from "../utils/pdfGenerator";

export default function Home() {
  const [inputs, setInputs] = useState<Inputs | null>(null);
  const [projection, setProjection] = useState<number[]>([]);
  const chartRef = useRef<any>(null);
  const donutRef = useRef<any>(null);
  

  const handleSubmit = (data: Inputs) => {
    setInputs(data);
    const proj = calculateProjection(data).monthly;
    setProjection(proj);
  };

  const handleDownload = async () => {
      if (!inputs || !chartRef.current || !donutRef.current) return;

  const chartUrl = await chartRef.current.getBase64();
  const donutUrl = await donutRef.current.getBase64();

    const link = document.createElement("a");

    link.download = "projection.pdf";
    document.body.appendChild(link);
    const recommendationRes = await fetch("/api/generate-recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });
    const { recommendations } = await recommendationRes.json();
    console.log("recommendations", recommendations);
    const blob = await generatePdf(inputs, chartUrl, donutUrl, recommendations);
    const base64 = await new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    const result = reader.result as string;
    const base64Data = result.split(',')[1];
    resolve(base64Data);
  };
  reader.onerror = reject;
  reader.readAsDataURL(blob);
});
    await fetch("/api/send-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inputs.email, pdfBase64: base64 }),
    });
    link.href = URL.createObjectURL(blob);
    link.click();
    link.remove();
    await fetch("/api/beehiiv-tag", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: inputs.email,
    firstName: "User",
    lastName: "Test",
    utm_campaign: "pdf_projection",
    referring_site: "https://yourtool.com",
  }),
});
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "income_projection_completed", {
        value: projection.reduce((a, b) => a + b, 0),
        email: inputs.email,
      });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Build Your Side Hustle Income</h1>
        <p>Enter your numbers and get a 12‑month projection</p>
        <RateForm onSubmit={handleSubmit} />
        {projection.length > 0 && (
          <>
            <div className="charts">
              <div className="chart">
                <ProjectionChart ref={chartRef} data={projection} />
              </div>
              <div className="chart">
                <DonutChart
                  ref={donutRef}
                  inputs={{
                    consult: inputs.rate * inputs.hours * 4.3,
                    retainer: inputs.retainer,
                    product: inputs.productPrice * inputs.units,
                  }}
                />
              </div>
            </div>
            <div className="card">
              <p>Month 3: ${projection[2].toFixed(2)}</p>
              <p>Month 12: ${projection[11].toFixed(2)}</p>
              <p>
                Annualised: ${projection.reduce((a, b) => a + b, 0).toFixed(2)}
              </p>
              <button onClick={handleDownload}>Download PDF</button>
            </div>
            <LatestPosts />
          </>
        )}
        <div style={{ marginTop: "2rem" }}>
          <iframe
            src="https://embeds.beehiiv.com/f2d565c1-0d24-41d6-88ee-95c7131bb0c6"
            data-test-id="beehiiv-embed"
            width="100%"
            height="320"
            style={{
              maxWidth: "400px",
              maxHeight: "200px",
              borderRadius: "4px",
              border: "2px solid #e5e7eb",
              margin: 0,
              backgroundColor: "transparent",
            }}
          />
        </div>
      </div>
    </div>
  );
}
