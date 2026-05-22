import './Home.css'
import logo from '/ascii.txt?raw'
import projImage from '/proj.png'
import ShaderBackground from '../components/three/ShaderBackground'

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
          <h2>Main Content</h2>
          <p>Welcome to UIUC's chapter of ACM SIGGRAPH, the special interest group in computer graphics.<br></br>
            Meetings every Sunday at 2 PM
          </p>
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
            <h2>Featured Project</h2>
            <p>Volume Renderer</p>
            <img src={projImage} alt="Featured Project" />
            <p>Github</p>
          </div>
        </div>


      </div>
    </div>
  )
}