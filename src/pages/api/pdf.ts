import type { NextApiRequest, NextApiResponse } from 'next';
import { generatePdf } from '../../utils/pdfGenerator';
import { Inputs } from '../../utils/projection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const inputs: Inputs = req.body;
  const { chart, donut,recommendations  } = req.body
  const blob = await generatePdf(inputs, chart, donut,recommendations );
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=projection.pdf');
  const buffer = Buffer.from(await blob.arrayBuffer());
  res.send(buffer);
}