import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

export default function ShaderBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    renderer.toneMapping = THREE.NoToneMapping
    renderer.setClearColor(0x000000, 1)
    mount.appendChild(renderer.domElement)
    

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geometry = new THREE.PlaneGeometry(2, 2)

    const composer = new EffectComposer(renderer)

    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.065, // strength
    0.1, // radius
    0.2 // threshold
    )

    composer.addPass(bloomPass)

    const aspect = window.innerWidth / window.innerHeight
    const minB = new THREE.Vector2(-aspect * 0.5, -0.5)
    const maxB = new THREE.Vector2( aspect * 0.5,  0.5)

    const balls = [
      { pos: new THREE.Vector2( 0.3,  0.3), vel: new THREE.Vector2( 0.1,  0.2) },
      { pos: new THREE.Vector2( 0.0,  0.3), vel: new THREE.Vector2( 0.1, -0.2) },
      { pos: new THREE.Vector2(-0.2,  0.3), vel: new THREE.Vector2(-0.3, -0.1) },
      { pos: new THREE.Vector2( 0.1, -0.2), vel: new THREE.Vector2(-0.5,  0.3) },
    ]

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime:      { value: 0 },
        uResolution:{ value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uMouse:     { value: new THREE.Vector2(0, 0) },
        uBall1Pos:  { value: new THREE.Vector2() },
        uBall2Pos:  { value: new THREE.Vector2() },
        uBall3Pos:  { value: new THREE.Vector2() },  // was missing
        uBall4Pos:  { value: new THREE.Vector2() },  // was missing
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        uniform vec2 uBall1Pos;
        uniform vec2 uBall2Pos;
        uniform vec2 uBall3Pos;
        uniform vec2 uBall4Pos;

        #define warp 0.0
        #define scan 0.5

        float smin(float a, float b, float k) {
            k *= 4.0;
            float h = max(k - abs(a - b), 0.0) / k;
            return min(a, b) - h*h*k*(1.0/4.0);
        }

        float sdfSphere(vec3 p, vec3 center, float rad) {
            return length(p - center) - rad;
        }

        float map(vec3 p) {
            float s1 = sdfSphere(p, vec3(uBall1Pos, 0.0), 0.3);
            float s2 = sdfSphere(p, vec3(uBall2Pos, 0.0), 0.25);
            float s3 = sdfSphere(p, vec3(uBall3Pos, 0.0), 0.2);
            float s4 = sdfSphere(p, vec3(uBall4Pos, 0.0), 0.4);
            return smin(smin(s1, s2, 0.05), smin(s3, s4, 0.05), 0.05);
        }

        void main() {
            float aspect = uResolution.x / uResolution.y;
            vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
            vec2 dc = abs(uv / vec2(aspect, 1.0));
            dc *= dc;
            uv.x *= 1.0 + (dc.y * (0.3 * warp));
            uv.y *= 1.0 + (dc.x * (0.4 * warp));

            float d = map(vec3(uv, 0.0));

            vec3 bg_col = vec3(0.1, 0.1, 0.1);
            vec3 col = bg_col;
            if (d < 0.0) {
                float edge = smoothstep(0.0, 0.01, -d);
                col = mix(bg_col, vec3(1.0, 0.5, 0.0), edge);
            }

            if (uv.y > 0.5 || uv.y < -0.5 || uv.x < -aspect * 0.5 || uv.x > aspect * 0.5) {
                gl_FragColor = vec4(bg_col, 1.0);
            } else {
                float apply = abs(sin(gl_FragCoord.y) * 0.5 * scan);
                gl_FragColor = vec4(mix(col, vec3(0.0), apply), 1.0);
            }
        }
      `
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const onMouseMove = (e) => {
      material.uniforms.uMouse.value.x = ((e.clientX / window.innerWidth) - 0.5) * aspect
      material.uniforms.uMouse.value.y = ((e.clientY / window.innerHeight) - 0.5) * -1
    }
    window.addEventListener('mousemove', onMouseMove)

    const dt = 1 / 240
    let animId

    const animate = () => {
      animId = requestAnimationFrame(animate)

      for (const ball of balls) {
        const toMouse = material.uniforms.uMouse.value.clone().sub(ball.pos)
        ball.vel.addScaledVector(toMouse, 0.75 * dt)
        ball.pos.addScaledVector(ball.vel, dt)

        if (ball.pos.x < minB.x || ball.pos.x > maxB.x) ball.vel.x *= -1.5 * Math.random()
        if (ball.pos.y < minB.y || ball.pos.y > maxB.y) ball.vel.y *= -1.5 * Math.random()
        ball.pos.clamp(minB, maxB)

        if (ball.vel.length() > 1.0) ball.vel.normalize()
      }

      material.uniforms.uBall1Pos.value.copy(balls[0].pos)
      material.uniforms.uBall2Pos.value.copy(balls[1].pos)
      material.uniforms.uBall3Pos.value.copy(balls[2].pos)
      material.uniforms.uBall4Pos.value.copy(balls[3].pos)
      material.uniforms.uTime.value += dt
      composer.render();
    }
    animate()

    const onResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        composer.setSize(window.innerWidth, window.innerHeight)

        material.uniforms.uResolution.value.set(
            window.innerWidth,
            window.innerHeight
        )
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} style={{
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    zIndex: -1
  }} />
}