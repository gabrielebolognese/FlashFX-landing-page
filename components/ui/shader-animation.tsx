"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { cappedPixelRatio, prefersReducedMotion } from "@/lib/render-gate"

export function ShaderAnimation({ active = false }: { active?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(active)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: any
    animationId: number
  } | null>(null)

  useEffect(() => {
    const wasActive = activeRef.current
    activeRef.current = active
    if (active && !wasActive && sceneRef.current) {
      sceneRef.current.uniforms.time.value = 0
    }
  }, [active])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Fragment shader
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.002;

        vec3 base = vec3(0.025, 0.045, 0.110);
        vec3 color = base;
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
          }
        }

        gl_FragColor = vec4(color[0],color[1],color[2],1.0);
      }
    `

    // Initialize Three.js scene
    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { type: "f", value: 0.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(cappedPixelRatio())

    container.appendChild(renderer.domElement)

    // Handle window resize
    const onWindowResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    // Initial resize
    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    // Store scene references for cleanup
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    }

    let rafId: number | null = null

    const animate = () => {
      if (activeRef.current) {
        uniforms.time.value += 0.05
      }
      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
      if (sceneRef.current) sceneRef.current.animationId = rafId
    }

    const start = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(animate)
    }

    const stop = () => {
      if (rafId === null) return
      cancelAnimationFrame(rafId)
      rafId = null
    }

    const reduced = prefersReducedMotion()

    // Under reduced motion the shader is drawn once and left alone.
    if (reduced) {
      renderer.render(scene, camera)
    }

    /*
     * The hero is at the top of the page, so this mostly matters once the
     * visitor scrolls past it — previously the loop kept drawing for the whole
     * session no matter how far down the page they went.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting)
        if (visible && !reduced) start()
        else stop()
      },
      { rootMargin: "100px" }
    )
    observer.observe(container)

    // Cleanup function
    return () => {
      observer.disconnect()
      stop()
      window.removeEventListener("resize", onWindowResize)

      if (sceneRef.current) {
        if (container && sceneRef.current.renderer.domElement.parentNode === container) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }

        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0"
      style={{
        background: "#06091C",
        overflow: "hidden",
      }}
    />
  )
}
