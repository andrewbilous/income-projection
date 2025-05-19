import { jsPDF } from 'jspdf';
import { calculateProjection, Inputs } from './projection';

export async function generatePdf(
  inputs: Inputs,
  chartDataUrl: string,
  donutDataUrl: string,
  aiText: string
): Promise<Blob> {
  const doc = new jsPDF('p', 'mm', 'a4');
  doc.setFontSize(18);
  doc.text('12-Month Income Projection', 20, 20);
  doc.addImage(chartDataUrl, 'PNG', 20, 30, 160, 80);
  doc.addImage(donutDataUrl, 'PNG', 20, 120, 80, 80);
  const { annual } = calculateProjection(inputs);
  doc.setFontSize(14);
  doc.text(`Projected Annual Income: $${annual.toFixed(2)}`, 20, 215);

  // Recommended next steps
  doc.setFontSize(12);
  doc.text('Recommended Next Steps:', 20, 230);
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(aiText, 170);
  doc.text(lines, 20, 240);

  return doc.output('blob');
}