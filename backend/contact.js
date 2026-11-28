function validateContact(body = {}) {
  const name = String(body?.name || '').trim();
  const email = String(body?.email || '').trim();
  const message = String(body?.message || '').trim();
  if (!name || !email || !message) return { error: 'Name, email and message are required' };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: 'Please provide a valid email address' };
  return { name, email, subject: String(body.subject || '').trim().slice(0, 160), message };
}

module.exports = { validateContact };
