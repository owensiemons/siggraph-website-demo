import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ShaderBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime:       { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uMouse:      { value: new THREE.Vector4(0, 0, 0, 0) }, // xy = pos, z = isDown
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec4 uMouse;

        #define epsilon 0.001
        #define step_size 0.005

        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        vec3 bezier(vec3 start, vec3 mid, vec3 end, float t) {
            vec3 l1 = mix(start, mid, t);
            vec3 l2 = mix(mid,   end, t);
            return mix(l1, l2, t);
        }

        float sdfSphere(vec3 p, vec3 center, float rad) {
            return length(center - p) - rad;
        }

        float map(vec3 p) {
            float s1 = sdfSphere(p, vec3(0.2, 0, 0), 0.2);
            float s2 = sdfSphere(p, vec3(0.5, 0.1, -0.2), 0.15);
            float s3 = sdfSphere(p, vec3(-0.4, -0.2, 0), 0.25);
            float s4 = sdfSphere(p, vec3(0, -10e2 - 1.0, 0), 10e2);
            return min(s4, min(s1, min(s2, s3)));
        }

        vec3 estimateNormal(vec3 p) {
            return normalize(vec3(
                map(vec3(p.x + epsilon, p.y, p.z)) - map(vec3(p.x - epsilon, p.y, p.z)),
                map(vec3(p.x, p.y + epsilon, p.z)) - map(vec3(p.x, p.y - epsilon, p.z)),
                map(vec3(p.x, p.y, p.z + epsilon)) - map(vec3(p.x, p.y, p.z - epsilon))
            ));
        }

        float ray_march(vec3 ro, vec3 rd, vec3 mid, vec3 end) {
            float t = 0.0;
            vec3 p = ro;
            for (int i = 0; i < 612; i++) {
                p = bezier(ro, mid, end, t);
                float d = map(p);
                if (d < epsilon) return t;
                if (t > 15.0) return -1.0;
                t += step_size;
            }
            return -1.0;
        }

        void main() {
            vec2 fragCoord = gl_FragCoord.xy;
            vec2 uv = (fragCoord - 0.5 * uResolution.xy) / uResolution.y;

            vec3 cam_pos = vec3(0, 0, -1);
            vec3 cam_dir = vec3(0, 0, 1);

            vec3 cam_right = normalize(cross(vec3(0, 1, 0), cam_dir));
            vec3 cam_up = cross(cam_dir, cam_right);
            mat3 look_at = mat3(cam_right, cam_up, cam_dir);

            vec3 rd = normalize(look_at * normalize(vec3(uv.x, uv.y, 1.0)));

            vec3 col = vec3(0.0);
            vec3 mat_color = vec3(1.0, 0.0, 1.0);

            vec3 end = cam_pos + 1.0 * rd;
            vec3 mid = (cam_pos + end) / 2.0;
            mid.x = mid.x * 2.0 * sin(uTime);
            mid.y = mid.y * 2.0 * cos(uTime);

            float t = ray_march(cam_pos, rd, mid, end);

            if (t > 0.0) {
                vec3 pos = bezier(cam_pos, mid, end, t);
                vec3 light_pos = vec3(0.0, 0.3, 0.0);
                vec3 light_norm = normalize(light_pos - pos);
                vec3 hit_norm = estimateNormal(pos);
                vec3 half_norm = normalize(light_norm - rd);

                float ambient = 0.1;
                float diffuse = max(0.0, dot(hit_norm, light_norm));
                float specular = pow(max(0.0, dot(hit_norm, half_norm)), 8.0);

                col = (ambient + diffuse) * mat_color + specular * vec3(1.0);
            }

            gl_FragColor = vec4(col, 1.0);
        }
      `
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Mouse tracking
    const onMouseMove = (e) => {
      material.uniforms.uMouse.value.x = e.clientX
      material.uniforms.uMouse.value.y = window.innerHeight - e.clientY // flip Y
    }
    const onMouseDown = () => { material.uniforms.uMouse.value.z = 1.0 }
    const onMouseUp   = () => { material.uniforms.uMouse.value.z = 0.0 }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup',   onMouseUp)

    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      material.uniforms.uTime.value += 0.01
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup',   onMouseUp)
      window.removeEventListener('resize',    onResize)
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