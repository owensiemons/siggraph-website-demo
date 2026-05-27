import './Home.css'
import DraggableWindow from '../components/DraggableWindow'
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
      <DraggableWindow title="Test Window" x_0={500} y_0={550}>
        <p className="miniHeader">What am i?</p>
        <p>I'm a window! Click and drag my title bar to move me around!</p>
      </DraggableWindow>


      <DraggableWindow title="Navigation" x_0={275} y_0={135}>
        <table>
          <tr><td>Home</td></tr>
          <tr><td>Projects</td></tr>
          <tr><td>Resources</td></tr>
          <tr><td>About</td></tr>
        </table>
      </DraggableWindow>

      <DraggableWindow title="Links" x_0={275} y_0={310}>
        <table>
          <tr><td>Discord</td></tr>
          <tr><td>Mail</td></tr>
          <tr><td>Instagram</td></tr>
        </table>
      </DraggableWindow>

      <DraggableWindow title="WELCOME~!" x_0={500} y_0={135}>
        <p>Welcome to UIUC's chapter of ACM SIGGRAPH, the special interest group in computer graphics.</p>
          <p className="miniHeader">Want to get involved?</p>

          <p>Come to our meetings! We meet every Sunday at Siebel CS, 2 PM. Also, you can join our discord, which has more info.</p>

          <p className="miniHeader">What we're up to:</p>

          <p>A starling murmuration simulation</p>
          <p>A medical volume renderer</p>
          <p>A least squares physics simulation</p>

      </DraggableWindow>

      <DraggableWindow title="Announcements" x_0={950} y_0={135} color="#f59f00">
        <p>
          <marquee style={{color: "#000000"}}>Next meeting in 1304 Siebel Center!</marquee>
        </p>
      </DraggableWindow>

      <DraggableWindow title="Last Meeting" x_0={950} y_0={250} >
        <table>
              <tr><td>Topic</td></tr>
              <tr><td>Slides</td></tr>
              <tr><td>References</td></tr>
            </table>
      </DraggableWindow>
    </div>
  )
}