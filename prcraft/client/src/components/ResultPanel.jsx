import React, { useState } from 'react'
import './ResultPanel.css'

function renderMarkdown(text) {
  // Simple markdown → HTML
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="check"><span class="cb"></span>$1</li>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="check checked"><span class="cb">✓</span>$1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="num">$1</li>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/\n\n/g, '</p><p class="md-p">')
    .replace(/\n/g, '<br/>')
}

export default function ResultPanel({ result, loading, error, onImprove, onTranslate }) {
  const [copied,    setCopied]    = useState(false)
  const [translated, setTranslated] = useState(null)
  const [transLabel, setTransLabel] = useState('')
  const [transLoading, setTransLoading] = useState(false)

  async function handleTranslate(format, label) {
    setTransLoading(true)
    setTranslated(null)
    setTransLabel(label)
    const res = await onTranslate(format)
    setTranslated(res)
    setTransLoading(false)
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="result-panel">

      <div className="panel-label">Generated Description</div>

      {/* Toolbar — only shown when there's a result */}
      {result && (
        <div className="output-toolbar">
          <button className="tool-btn" onClick={() => copyText(result)}>
            {copied ? '✅ Copied!' : '⎘ Copy Markdown'}
          </button>
          <button className="tool-btn" onClick={onImprove}>
            ✦ Improve
          </button>
          <button className="tool-btn" onClick={() => handleTranslate('slack', '💬 Slack')}>
            💬 Slack
          </button>
          <button className="tool-btn" onClick={() => handleTranslate('email', '📧 Email')}>
            📧 Email
          </button>
          <button className="tool-btn" onClick={() => handleTranslate('simple', '👤 Plain English')}>
            👤 Plain English
          </button>
        </div>
      )}

      {/* Main result box */}
      <div className={`result-box ${!result && !loading && !error ? 'empty' : ''}`}>

        {/* Loading state */}
        {loading && (
          <div className="loading-wrap">
            <div className="spinner" />
            <span className="loading-text">WRITING YOUR PR...</span>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="error-msg">⚠ {error}</div>
        )}

        {/* Empty state */}
        {!loading && !error && !result && (
          <div className="empty-state">
            <div className="empty-icon">◈</div>
            <div className="empty-title">Ready to generate</div>
            <p className="empty-sub">
              Fill in your commits on the left and click Generate.<br />
              Takes about 3 seconds.
            </p>
          </div>
        )}

        {/* Result */}
        {!loading && !error && result && (
          <div
            className="md-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }}
          />
        )}

      </div>

      {/* Translate result */}
      {(transLoading || translated) && (
        <div className="translate-box">
          <div className="translate-label">{transLabel}</div>
          {transLoading ? (
            <div className="trans-loading">
              <div className="spinner small" /> Converting...
            </div>
          ) : (
            <div className="translate-content">
              <p>{translated}</p>
              <button className="tool-btn" onClick={() => copyText(translated)}>
                ⎘ Copy
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
