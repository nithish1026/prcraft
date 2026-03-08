import React, { useState, useEffect } from 'react'
import Header     from './components/Header.jsx'
import InputForm  from './components/InputForm.jsx'
import ResultPanel from './components/ResultPanel.jsx'
import './App.css'

const API = import.meta.env.VITE_API_URL || ''

export default function App() {
  const [aiReady,  setAiReady]  = useState(false)
  const [count,    setCount]    = useState(() => parseInt(localStorage.getItem('pr_count') || '0'))
  const [result,   setResult]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [improving, setImproving] = useState(false)

  // Check AI health on mount
  useEffect(() => {
    fetch(API + '/api/health')
      .then(r => r.json())
      .then(d => setAiReady(d.aiReady))
      .catch(() => setAiReady(false))
  }, [])

  async function handleGenerate(formData) {
    const { commits, diff } = formData
    if (!commits.trim() && !diff.trim()) {
      setError('Please paste your git commits or code diff first.')
      return
    }

    setLoading(true)
    setError('')
    setResult('')

    try {
      const res  = await fetch(API + '/api/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')

      setResult(data.description)

      // Update count
      const newCount = count + 1
      setCount(newCount)
      localStorage.setItem('pr_count', newCount)

    } catch(e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleImprove() {
    if (!result) return
    setImproving(true)
    try {
      const res  = await fetch(API + '/api/improve', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ existing: result })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data.description)
    } catch(e) {
      setError(e.message)
    } finally {
      setImproving(false)
    }
  }

  async function handleTranslate(format) {
    if (!result) return null
    try {
      const res  = await fetch(API + '/api/translate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ description: result, format })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      return data.result
    } catch(e) {
      setError(e.message)
      return null
    }
  }

  return (
    <div className="app">
      <Header aiReady={aiReady} count={count} />

      {/* Hero */}
      <section className="hero">
        <div className="hero-tag">
          <span className="hero-dot" />
          ✦ AI-POWERED · FREE WITH GROQ
        </div>
        <h1>Write better <em>pull requests.</em></h1>
        <p className="hero-sub">
          Paste your commits — get a professional PR description in seconds.
          No more staring at a blank text box.
        </p>
      </section>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat-cell">
          <span className="stat-n">~3s</span>
          <span className="stat-l">GENERATION TIME</span>
        </div>
        <div className="stat-cell">
          <span className="stat-n">{count}</span>
          <span className="stat-l">TOTAL GENERATED</span>
        </div>
        <div className="stat-cell">
          <span className="stat-n">FREE</span>
          <span className="stat-l">POWERED BY GROQ</span>
        </div>
      </div>

      {/* Main two-column layout */}
      <main className="main-grid">
        <div className="col-left">
          <InputForm onGenerate={handleGenerate} loading={loading} />
        </div>
        <div className="col-right">
          <ResultPanel
            result={result}
            loading={loading || improving}
            error={error}
            onImprove={handleImprove}
            onTranslate={handleTranslate}
          />
        </div>
      </main>

      <footer className="footer">
        <span>Built with <em>Groq AI</em> — 100% free, no credit card needed</span>
        <span className="footer-right">🔒 Your code is never stored</span>
      </footer>
    </div>
  )
}
