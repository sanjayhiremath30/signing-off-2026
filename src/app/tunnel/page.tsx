"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, Image as ImageImpl, Text } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useMemoryTunnelStore } from "@/store/useMemoryTunnelStore";

/* ─── 3D Tunnel items ─────────────────────────────────────── */
function TunnelItems() {
  const scroll = useScroll();
  const group = useRef<THREE.Group>(null);
  const { memories } = useMemoryTunnelStore();

  useFrame(() => {
    if (group.current) {
      const maxScroll = Math.max(0, (memories.length - 1) * 10);
      group.current.position.z = scroll.offset * maxScroll;
    }
  });

  return (
    <group ref={group}>
      {memories.map((mem, i) => {
        const z = -(i * 10) - 5;
        const x = i % 2 === 0 ? -3 : 3;
        const y = Math.sin(i) * 2;

        return (
          <group key={mem.id || i} position={[x, y, z]}>
            <ImageImpl url={mem.url} scale={[4, 3]} transparent opacity={0.9} />
            <Text
              position={[0, -2, 0]}
              fontSize={0.5}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.05}
              outlineColor="#a855f7"
            >
              {mem.year} - {mem.text}
            </Text>
          </group>
        );
      })}

      {/* Floating particles inside the tunnel */}
      {Array.from({ length: 100 }).map((_, i) => (
        <mesh
          key={`particle-${i}`}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            -Math.random() * (Math.max(5, memories.length) * 10),
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#a855f7" : "#3b82f6"}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function MemoryTunnelPage() {
  const [mounted, setMounted] = useState(false);
  const { memories, init } = useMemoryTunnelStore();

  useEffect(() => {
    init();
    setMounted(true);
  }, [init]);

  return (
    <div className="w-full h-screen overflow-hidden relative">

      {/* ── Background: college.jpg sits behind everything ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/college.jpg"
        alt="College Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* ── Dark overlay so text and 3D content remain readable ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.68) 0%, rgba(3,1,15,0.80) 50%, rgba(0,0,0,0.90) 100%)",
        }}
      />

      {/* ── 3D Canvas — transparent bg so the college.jpg shows through ── */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            gl={{ alpha: true }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <fog attach="fog" args={["#050210", 5, Math.max(25, memories.length * 5)]} />

            <ScrollControls pages={memories.length || 1} damping={0.2}>
              <TunnelItems />
            </ScrollControls>
          </Canvas>
        )}
      </div>

      {/* ── Header — floats above the 3D canvas ── */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-4xl font-black tracking-widest"
          style={{
            color: "#e9d5ff",
            textShadow:
              "0 0 20px rgba(168,85,247,0.9), 0 0 40px rgba(168,85,247,0.5), 0 2px 8px rgba(0,0,0,0.9)",
          }}
        >
          MEMORY TUNNEL
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-zinc-200 mt-2 font-medium tracking-widest text-sm"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
        >
          ✨ Scroll down to travel through time ✨
        </motion.p>
      </div>
    </div>
  );
}
