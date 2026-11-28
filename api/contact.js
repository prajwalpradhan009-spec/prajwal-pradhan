const { validateContact } = require('../backend/contact')

module.exports = async function contact(request, response) {
  response.setHeader('Cache-Control', 'no-store')
  if (request.method !== 'POST') return response.status(405).json({ error: 'Use POST.' })
  const contact = validateContact(request.body)
  if (contact.error) return response.status(400).json(contact)
  const id = process.env.FORMSPREE_ID || process.env.VITE_FORMSPREE_ID
  if (!id)
    return response
      .status(503)
      .json({ error: 'Contact form delivery is unavailable. Please use the email link.' })
  try {
    const result = await fetch('https://formspree.io/f/' + encodeURIComponent(id), {
      method: 'POST',
      signal: AbortSignal.timeout(10000),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(contact),
    })
    if (!result.ok)
      return response.status(502).json({ error: 'Email delivery failed. Please try again.' })
    return response.status(201).json({ message: 'Message received.' })
  } catch {
    return response.status(503).json({ error: 'Email delivery is temporarily unavailable.' })
  }
}
