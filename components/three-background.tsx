'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  
  const particleCount = 1000
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.02
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.03
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#FFD700"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  )
}

function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={[2, 0, -3]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#FFD700"
        wireframe
        transparent
        opacity={0.1}
      />
    </mesh>
  )
}

function GoldenRings() {
  const ringRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.1
    }
  })

  return (
    <group ref={ringRef} position={[-2, 0, -4]}>
      {[1, 1.3, 1.6].map((scale, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[scale, 0.02, 16, 100]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.15 - i * 0.03}
          />
        </mesh>
      ))}
    </group>
  )
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <FloatingGeometry />
        <GoldenRings />
      </Canvas>
    </div>
  )
}

export function ThreeBackgroundSimple() {
  return (
    <div className="fixed inset-0 -z-10 opacity-40">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
      >
        <ParticleField />
      </Canvas>
    </div>
  )
}
