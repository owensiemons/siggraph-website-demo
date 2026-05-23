import './Home.css'
import logo from '/ascii.txt?raw'
import ShaderBackground from '../components/three/ShaderBackground'
import siggraph from '/SIGGRAPH_01.png'
import { Weight } from 'lucide-react'

export default function Home() {
  return (
    <div className="home">
       <ShaderBackground />
      <header className="ascii">
        <pre>{logo}</pre>
      </header>
      <div className="layout">

        <div className="left-col">
          <div className="box">
            <h2>Navigation</h2>
            <table>
              <tr><td>Home</td></tr>
              <tr><td>Projects</td></tr>
              <tr><td>Resources</td></tr>
              <tr><td>About</td></tr>
            </table>
          </div>
          <div className="box">
            <h2>Links</h2>
            <table>
              <tr><td>Discord</td></tr>
              <tr><td>Mail</td></tr>
              <tr><td>Instagram</td></tr>
            </table>
          </div>
        </div>
        

        <div className="box center">
          <h2>Welcome!</h2>
          <p>Welcome to UIUC's chapter of ACM SIGGRAPH, the special interest group in computer graphics.</p>
          <p className="smallHeader">Want to get involved?</p>

          <p>Come to our meetings! We meet every Sunday at Siebel CS, 2 PM. Also, you can join our discord, which has more info.</p>

          <p className="smallHeader">What we're up to:</p>

          <p>A starling murmuration simulation</p>
          <p>A medical volume renderer</p>
          <p>A least squares physics simulation</p>
        </div>

        <div className="right-col">
          <div className="box">
            <h2>Annoucements</h2>
            <p>Next meeting in Siebel CS 999!</p>
          </div>

          <div className="box">
            <h2>Latest Lecture</h2>
            <table>
              <tr><td>Topic</td></tr>
              <tr><td>Slides</td></tr>
              <tr><td>References</td></tr>
            </table>
          </div>

          <div className="box">
            <h2>Empty</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
          </div>
        </div>


      </div>
    </div>
  )
}