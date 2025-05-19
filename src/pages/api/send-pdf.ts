// pages/api/send-pdf.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, pdfBase64 } = req.body;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_SENDER!,
      to: email,
      subject: 'Your 12-Month Income Projection PDF',
      html: `<p>Hi!</p><p>Here's your personalized income projection.</p>`,
      attachments: [
        {
          filename: 'projection.pdf',
          content: pdfBase64,
        },
      ],
    });

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Send email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
