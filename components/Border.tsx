'use client'

import * as THREE from 'three'
import { ShaderMaterial } from 'three'
import { useFrame, Canvas, extend, Object3DNode } from '@react-three/fiber'
import { OrbitControls, shaderMaterial, useTexture } from '@react-three/drei'
import vertexShader from '../shaders/border/vertexShader'
import fragmentShader from '../shaders/border/fragmentShader'
import { useRef } from 'react'
import gsap from 'gsap'

const fallbackSizes = {
  width: 1024,
  height: 768,
  pixelRatio: 1,
}

const getSizes = () => {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
    }
  } else {
    return fallbackSizes
  }
}
const sizes = getSizes()

const BorderMaterial = shaderMaterial(
  {
    uSize: 5000.0,
    uTime: 0.0,
    uFrequency: 0.0,
    uRadius: 0.0,
    uTexture: null,
    uResolution: new THREE.Vector2(
      sizes.width * sizes.pixelRatio,
      sizes.height * sizes.pixelRatio
    ),
  },
  vertexShader,
  fragmentShader
)

extend({ BorderMaterial })

interface IBorderMaterial extends ShaderMaterial {
  uTime: number
  uFrequency: number
  uRadius: number
  uTexture: any
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    borderMaterial: Object3DNode<IBorderMaterial, typeof BorderMaterial>
  }
}

export function Border() {
  const position = [0, 0, 0]
  const pos = new Float32Array(position)

  const shaderMaterialRef = useRef<IBorderMaterial>(null)

  let frequencyData = { frequency: 0.0 }
  gsap.to(frequencyData, {
    duration: 1.0,
    frequency: 1.0,
    delay: 2,
    ease: 'none',
    onUpdate: () => {
      shaderMaterialRef.current!.uFrequency = frequencyData.frequency
    },
  })

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    shaderMaterialRef.current!.uRadius =
      (Math.abs(Math.sin(time / 1.5)) * 2.0) / 10.0 + 0.8
  })

  return (
    <>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1}
            array={pos}
            itemSize={3}
          />
        </bufferGeometry>

        <borderMaterial
          ref={shaderMaterialRef}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent={true}
        />
      </points>
    </>
  )
}
