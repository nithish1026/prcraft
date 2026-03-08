import React from 'react'
import './Header.css'

export default function Header({ aiReady, count }) {
  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-mark">PR</div>
        <span className="logo-text">PR<em>Craft</em></span>
      </div>
      <div className="header-right">
        <span className={`ai-badge ${aiReady ? 'ok' : 'warn'}`}>
          {aiReady ? '✅ Groq AI Ready' : '⚠ Add GROQ_API_KEY to .env'}
        </span>
        <span className="usage-count">{count} PRs generated</span>
      </div>
    </header>
  )
}
