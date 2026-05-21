import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 120
const CONNECTION_DISTANCE = 2.2
const MOUSE_INFLUENCE = 2.5
const MOUSE_FORCE = 0.012

export default function ParticleMesh() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const width = mount.clientWidth
    const height = mount.clientHeight

    // Scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.z = 12

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Particles
    const positions = []
    const velocities = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions.push(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6
      )
      velocities.push(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.003
      )
    }

    const particleGeo = new THREE.BufferGeometry()
    const posArray = new Float32Array(positions)
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.07,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Lines geometry (pre-allocate max possible connections)
    const maxLines = PARTICLE_COUNT * PARTICLE_COUNT
    const linePositions = new Float32Array(maxLines * 6)
    const lineColors = new Float32Array(maxLines * 6)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))

    const lineMat = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
      })
    )
    scene.add(lineMat)

    // Mouse
    const mouse = new THREE.Vector2(9999, 9999)
    const mouse3D = new THREE.Vector3(9999, 9999, 0)

    const handleMouseMove = (e) => {
      const rect = mount.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      mouse3D.set(mouse.x * 9, mouse.y * 5, 0)
    }
    mount.addEventListener('mousemove', handleMouseMove)

    // Resize
    const handleResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // Animation
    let animId
    const pos = particleGeo.attributes.position.array

    const animate = () => {
      animId = requestAnimationFrame(animate)

      // Move particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3
        const iy = ix + 1
        const iz = ix + 2

        // Mouse repulsion
        const dx = pos[ix] - mouse3D.x
        const dy = pos[iy] - mouse3D.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_INFLUENCE) {
          const force = (MOUSE_INFLUENCE - dist) / MOUSE_INFLUENCE
          velocities[ix] += (dx / dist) * force * MOUSE_FORCE
          velocities[iy] += (dy / dist) * force * MOUSE_FORCE
        }

        // Dampen & move
        velocities[ix] *= 0.995
        velocities[iy] *= 0.995
        pos[ix] += velocities[ix]
        pos[iy] += velocities[iy]
        pos[iz] += velocities[iz]

        // Wrap edges
        if (pos[ix] > 9) pos[ix] = -9
        if (pos[ix] < -9) pos[ix] = 9
        if (pos[iy] > 5) pos[iy] = -5
        if (pos[iy] < -5) pos[iy] = 5
        if (pos[iz] > 3) pos[iz] = -3
        if (pos[iz] < -3) pos[iz] = 3
      }
      particleGeo.attributes.position.needsUpdate = true

      // Draw lines
      let lineIdx = 0
      const lp = lineGeo.attributes.position.array
      const lc = lineGeo.attributes.color.array

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const ax = pos[i * 3], ay = pos[i * 3 + 1], az = pos[i * 3 + 2]
          const bx = pos[j * 3], by = pos[j * 3 + 1], bz = pos[j * 3 + 2]
          const d = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2)

          if (d < CONNECTION_DISTANCE) {
            const alpha = 1 - d / CONNECTION_DISTANCE
            const base = lineIdx * 6
            lp[base] = ax; lp[base + 1] = ay; lp[base + 2] = az
            lp[base + 3] = bx; lp[base + 4] = by; lp[base + 5] = bz
            // cyan tinted lines
            lc[base] = 0; lc[base + 1] = alpha * 0.9; lc[base + 2] = alpha
            lc[base + 3] = 0; lc[base + 4] = alpha * 0.9; lc[base + 5] = alpha
            lineIdx++
          }
        }
      }

      lineGeo.attributes.position.needsUpdate = true
      lineGeo.attributes.color.needsUpdate = true
      lineGeo.setDrawRange(0, lineIdx * 2)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      mount.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    />
  )
}