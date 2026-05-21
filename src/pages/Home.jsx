import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ParticleMesh from '../components/three/ParticleMesh'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const headingRef = useRef(null)
  const subRef = useRef(null)
  const btnsRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const els = [headingRef.current, subRef.current, btnsRef.current, cardsRef.current]
    els.forEach((el, i) => {
      if (!el) return
      el.style.opacity = 0
      el.style.transform = 'translateY(20px)'
      setTimeout(() => {
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
        el.style.opacity = 1
        el.style.transform = 'translateY(0)'
      }, 300 + i * 160)
    })
  }, [])

  return (
    <div className="home">
      <ParticleMesh />

      <div className="hero__content">
        <p className="eyebrow">ACM @ Illinois</p>
        <h1 ref={headingRef} className="hero__title">
          SIG<span className="accent">GRAPH</span>
        </h1>
        <p ref={subRef} className="hero__sub">
          Computer graphics &amp; interactive techniques.<br />
          Where art meets algorithm.
        </p>
        <div ref={btnsRef} className="hero__buttons">
          <button className="btn btn--primary" onClick={() => navigate('/about')}>
            About Us
          </button>
          <button className="btn btn--ghost" onClick={() => navigate('/projects')}>
            Projects
          </button>
        </div>
      </div>

      <div ref={cardsRef} className="cards">

        <div className="card meetings">
          <p className="card__label">// when we meet</p>
          <h2 className="card__heading">Meeting Times</h2>
          <div className="meeting-slot">
            <span className="meeting-slot__day">DAY</span>
            <div className="meeting-slot__details">
              <span className="meeting-slot__time">00:00 – 00:00 PM</span>
              <span className="meeting-slot__loc">Location TBD</span>
            </div>
          </div>
          <div className="meeting-slot">
            <span className="meeting-slot__day">DAY</span>
            <div className="meeting-slot__details">
              <span className="meeting-slot__time">00:00 – 00:00 PM</span>
              <span className="meeting-slot__loc">Location TBD</span>
            </div>
          </div>
          <p className="meetings__note">
            Open to everyone — no experience required.
          </p>
        </div>

        <div className="card discord-card">
          <p className="card__label">// join the conversation</p>
          <h2 className="card__heading">Discord</h2>
          <p className="discord-blurb">
            Chat with members, get updates, and stay in the loop between meetings.
          </p>
          <a
            className="btn btn--primary"
            href="https://discord.gg/HZrRzgcT69"
            target="_blank"
            rel="noreferrer"
          >
            Join Server ↗
          </a>
        </div>

      </div>
    </div>
  )
}