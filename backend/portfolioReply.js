const { generateReply, isGeminiConfigured } = require('./gemini')

async function portfolioReply(turn) {
  const { assistantContext, localReply } = await import('../Frontend/src/data/assistant.js')
  if (process.env.ANTHROPIC_API_KEY) {
    const messages = turn.history.map((m) => ({
      role: m.role === 'model' ? 'assistant' : 'user',
      content: m.text,
    }))
    messages.push({ role: 'user', content: turn.message })
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: AbortSignal.timeout(12000),
      headers: {
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5',
        max_tokens: 350,
        system: assistantContext(),
        messages,
      }),
    })
    if (!response.ok) throw new Error('Portfolio assistant provider unavailable.')
    const data = await response.json()
    const reply = data.content
      ?.filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n')
    if (!reply) throw new Error('Portfolio assistant returned an empty response.')
    return reply
  }
  return isGeminiConfigured() ? generateReply(turn) : localReply(turn.message)
}
module.exports = { portfolioReply }
