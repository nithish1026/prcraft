import React, { useState } from 'react'
import './InputForm.css'

const PR_TYPES = [
  { value: 'feature',     label: '✨ Feature'     },
  { value: 'bugfix',      label: '🐛 Bug Fix'     },
  { value: 'refactor',    label: '♻️ Refactor'    },
  { value: 'performance', label: '⚡ Performance'  },
  { value: 'docs',        label: '📝 Docs'        },
  { value: 'tests',       label: '🧪 Tests'       },
  { value: 'chore',       label: '🔧 Chore'       },
]

export default function InputForm({ onGenerate, loading }) {
  const [commits,  setCommits]  = useState('')
  const [diff,     setDiff]     = useState('')
  const [title,    setTitle]    = useState('')
  const [jira,     setJira]     = useState('')
  const [type,     setType]     = useState('feature')
  const [breaking, setBreaking] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    onGenerate({ commits, diff, title, jira, type, breaking })
  }

  return (
    <form className="input-form" onSubmit={handleSubmit}>

      <div className="panel-label">Input Details</div>

      {/* Title */}
      <div className="field">
        <label htmlFor="pr-title">PR Title</label>
        <input
          id="pr-title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Add user authentication with JWT tokens"
        />
      </div>

      {/* PR Type */}
      <div className="field">
        <label>PR Type</label>
        <div className="type-pills">
          {PR_TYPES.map(t => (
            <button
              key={t.value}
              type="button"
              className={`type-pill ${type === t.value ? 'active' : ''}`}
              onClick={() => setType(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Commits */}
      <div className="field">
        <label htmlFor="commits">
          Git Commits
          <span className="field-hint"> — run: git log --oneline</span>
        </label>
        <textarea
          id="commits"
          className="code-ta"
          value={commits}
          onChange={e => setCommits(e.target.value)}
          placeholder={`a3f2c1d Add JWT middleware for auth routes\nb1e9a2c Create User model with bcrypt hashing\nc8d4f3e Add login and register endpoints`}
          rows={5}
        />
      </div>

      {/* Diff */}
      <div className="field">
        <label htmlFor="diff">
          Code Diff
          <span className="field-hint"> — optional, run: git diff main</span>
        </label>
        <textarea
          id="diff"
          className="code-ta"
          value={diff}
          onChange={e => setDiff(e.target.value)}
          placeholder={`+ const generateToken = (userId) => {\n+   return jwt.sign({ id: userId }, process.env.JWT_SECRET);\n+ };`}
          rows={4}
        />
      </div>

      {/* Jira */}
      <div className="field">
        <label htmlFor="jira">
          Jira / Ticket Number
          <span className="field-hint"> — optional</span>
        </label>
        <input
          id="jira"
          type="text"
          value={jira}
          onChange={e => setJira(e.target.value)}
          placeholder="e.g. PROJ-123 or #456"
        />
      </div>

      {/* Breaking change */}
      <div className="field">
        <label>Breaking Change?</label>
        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-label">This PR contains breaking changes</span>
            <span className="toggle-sub">API changes, removed features, etc.</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={breaking}
              onChange={e => setBreaking(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Submit */}
      <button className="gen-btn" type="submit" disabled={loading}>
        {loading ? (
          <>
            <span className="btn-spinner" />
            Generating...
          </>
        ) : (
          '⚡ Generate PR Description'
        )}
      </button>

    </form>
  )
}
