
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { rate, hours, retainer, productPrice, units } = req.body;

  const prompt = `
You're a business coach with a friendly, practical style (like learning.fractionl.ai).
Based on this input:

- Hourly rate: $${rate}
- Weekly consulting hours: ${hours}
- Monthly retainer: $${retainer}
- Digital product price: $${productPrice}
- Monthly product sales goal: ${units}

Generate 3 bullet-point recommendations on how to increase their income over the next 12 months. Keep it under 100 words.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });

    const message = response.choices[0].message?.content;
    res.status(200).json({ recommendations: message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
}
