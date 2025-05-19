import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    email,
    firstName,
    lastName,
    utm_source = 'Website',
    utm_medium = 'organic',
    utm_campaign = 'default_campaign',
    referring_site = 'https://yourdomain.com',
    stripe_customer_id = '',
  } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  console.log('Sending to Beehiiv:', email);

  try {
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: false,
          utm_source,
          utm_medium,
          utm_campaign,
          referring_site,
          stripe_customer_id,
          custom_fields: [
            { name: 'First Name', value: firstName || '' },
            { name: 'Last Name', value: lastName || '' },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Beehiiv API Error:', data);
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to subscribe user in Beehiiv.' });
  }
}
