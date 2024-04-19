'use client'

import * as THREE from 'three'
import { ShaderMaterial } from 'three'
import { useFrame, Canvas, extend, Object3DNode } from '@react-three/fiber'
import { OrbitControls, shaderMaterial } from '@react-three/drei'
import vertexShader from '../shaders/purpleCircle/vertexShader'
import fragmentShader from '../shaders/purpleCircle/fragmentShader'
import { useRef } from 'react'
import gsap from 'gsap'
import { abs, float } from 'three/examples/jsm/nodes/Nodes.js'

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

const PurpleCircleMaterial = shaderMaterial(
  {
    uSize: 5000.0,
    uTime: 0.0,
    uFrequency: 0.0,
    uRadius: 0.0,
    uResolution: new THREE.Vector2(
      sizes.width * sizes.pixelRatio,
      sizes.height * sizes.pixelRatio
    ),
  },
  vertexShader,
  fragmentShader
)

extend({ PurpleCircleMaterial })

interface IPurpleCircleMaterial extends ShaderMaterial {
  uTime: number
  uFrequency: number
  uRadius: number
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    purpleCircleMaterial: Object3DNode<
      IPurpleCircleMaterial,
      typeof PurpleCircleMaterial
    >
  }
}

export function PurpleCirlce() {
  const position = [0, 0, 0]
  const pos = new Float32Array(position)

  const shaderMaterialRef = useRef<IPurpleCircleMaterial>(null)

  let frequencyData = { frequency: 0.0 }
  gsap.to(frequencyData, {
    duration: 1.0,
    frequency: 1.0,
    delay: 1.9,
    ease: 'none',
    onUpdate: () => {
      shaderMaterialRef.current!.uFrequency = frequencyData.frequency
    },
  })

  const now = Date.now()

  useFrame(({ clock }) => {
    // if (frequencyData.frequency < 0.8) {
    //   shaderMaterialRef.current!.uFrequency = 0
    //   console.log(shaderMaterialRef.current!.uFrequency)
    // } else shaderMaterialRef.current!.uFrequency = 1

    const time = clock.getElapsedTime()
    shaderMaterialRef.current!.uRadius =
      ((Math.abs(Math.sin(time / 1.5)) * 2.0) / 10.0 + 0.8) / 3.0
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

        <purpleCircleMaterial
          ref={shaderMaterialRef}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent={true}
        />
      </points>
    </>
  )
}
