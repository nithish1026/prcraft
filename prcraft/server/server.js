require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const Groq    = require('groq-sdk');

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function getGroq() {
  const key = process.env.GROQ_API_KEY;
  if (!key || key === 'your_groq_key_here')
    throw new Error('GROQ_API_KEY not set in .env — get free key at https://console.groq.com');
  return new Groq({ apiKey: key });
}

async function chat(system, user) {
  const groq = getGroq();
  const res  = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1500,
    temperature: 0.3,
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: user   }
    ]
  });
  return res.choices[0]?.message?.content || '';
}

// Health
app.get('/api/health', (req, res) => {
  const key = process.env.GROQ_API_KEY;
  res.json({ ok: true, aiReady: !!(key && key !== 'your_groq_key_here') });
});

// Generate PR description
app.post('/api/generate', async (req, res) => {
  try {
    const { commits, diff, title, type, jira, breaking } = req.body;
    if (!commits && !diff)
      return res.status(400).json({ error: 'Please provide commits or a code diff.' });

    const system = `You are an expert software engineer who writes exceptional pull request descriptions.
Respond in EXACTLY this format with these exact section headers:

## Summary
(2-3 sentences: what changed and why)

## Changes Made
(bullet list of specific technical changes)

## Type of Change
(Bug Fix / New Feature / Refactor / Performance / Documentation / Tests / Chore)

## How to Test
(numbered steps to test this PR)

## Screenshots
(write "No UI changes" if backend-only)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Added/updated tests if needed
- [ ] No new warnings introduced

## Related Issues
(Fixes #NUMBER or "None")`;

    const user = `Generate a professional PR description.

PR Title: ${title || 'Not provided'}
PR Type: ${type || 'Feature'}
Breaking Change: ${breaking ? 'YES' : 'No'}
${jira ? `Ticket: ${jira}` : ''}
${commits ? `\nGit Commits:\n${commits}` : ''}
${diff ? `\nCode Diff:\n${diff.slice(0, 5000)}` : ''}`;

    const result = await chat(system, user);
    res.json({ description: result });
  } catch(e) {
    console.error(e.message);
    res.status(500).json({ error: e.message });
  }
});

// Improve existing description
app.post('/api/improve', async (req, res) => {
  try {
    const { existing } = req.body;
    if (!existing) return res.status(400).json({ error: 'No description provided' });
    const result = await chat(
      'You are an expert at writing clear, professional pull request descriptions. Improve the given PR description — make it more detailed, professional, and useful. Keep the same markdown section structure.',
      `Improve this PR description:\n\n${existing}`
    );
    res.json({ description: result });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Convert to different format
app.post('/api/translate', async (req, res) => {
  try {
    const { description, format } = req.body;
    if (!description) return res.status(400).json({ error: 'No description provided' });
    const prompts = {
      slack:  'Rewrite this PR description as a short friendly Slack message. Use emojis. Max 5 lines.',
      email:  'Rewrite this as a professional email to the engineering team announcing this change.',
      simple: 'Rewrite this in very simple plain English a non-technical person can understand. No jargon.'
    };
    const result = await chat(prompts[format] || prompts.slack, description);
    res.json({ result });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  const ready = !!(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_key_here');
  console.log(`\n  PRCraft server → http://localhost:${PORT}`);
  console.log(`  AI: ${ready ? '✅ Groq ready (FREE)' : '⚠️  Add GROQ_API_KEY to .env'}\n`);
});
