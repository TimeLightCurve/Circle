'use client'

import { Experience } from '@/components/Experience'
import { Canvas } from '@react-three/fiber'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between bg-black">
      <Canvas>
        <Experience />
      </Canvas>
    </main>
  )
}
