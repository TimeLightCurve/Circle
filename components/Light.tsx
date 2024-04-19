'use client'

import * as THREE from 'three'
import { ShaderMaterial } from 'three'
import { useFrame, Canvas, extend, Object3DNode } from '@react-three/fiber'
import { OrbitControls, shaderMaterial } from '@react-three/drei'
import vertexShader from '../shaders/light/vertexShader'
import fragmentShader from '../shaders/light/fragmentShader'
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

const CircleMaterial = shaderMaterial(
  {
    uSize: 5000.0,
    uTime: 0.0,
    uFrequency: 0.0,
    uResolution: new THREE.Vector2(
      sizes.width * sizes.pixelRatio,
      sizes.height * sizes.pixelRatio
    ),
  },
  vertexShader,
  fragmentShader
)

extend({ CircleMaterial })

interface ICircleMaterial extends ShaderMaterial {
  uTime: number
  uFrequency: number
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    circleMaterial: Object3DNode<ICircleMaterial, typeof CircleMaterial>
  }
}

export function Light() {
  const position = [0, 0, 0]
  const pos = new Float32Array(position)

  const shaderMaterialRef = useRef<ICircleMaterial>(null)

  let frequencyData = { frequency: 0.0 }
  gsap.to(frequencyData, {
    duration: 2,
    frequency: 1.0,
    ease: 'none',
    onUpdate: () => {
      shaderMaterialRef.current!.uFrequency = frequencyData.frequency
    },
  })

  useFrame(({ clock }) => {
    if (shaderMaterialRef.current?.uFrequency === 1) {
      shaderMaterialRef.current.uFrequency = 0
    }
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

        <circleMaterial
          ref={shaderMaterialRef}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent={true}
        />
      </points>
    </>
  )
}
