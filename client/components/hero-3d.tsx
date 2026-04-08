import { Canvas } from "@react-three/fiber";
import { Float, PresentationControls, Environment, Sphere, Torus, Octahedron, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function Hero3D() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] cursor-grab active:cursor-grabbing transition-opacity duration-700">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={isDark ? 0.2 : 1} />
        <directionalLight position={[10, 10, 5]} intensity={isDark ? 0.5 : 2} />
        <directionalLight position={[-10, -10, -5]} intensity={1} color={isDark ? "#1d6fe8" : "#e8186c"} />

        {isDark && (
          <pointLight position={[0, 0, 0]} intensity={2} color="#1d6fe8" />
        )}
        
        <Suspense fallback={null}>
          <Environment preset={isDark ? "night" : "city"} />
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            {/* Center Sphere — French Blue */}
            <Float rotationIntensity={isDark ? 4 : 2} floatIntensity={isDark ? 5 : 3} speed={isDark ? 3 : 2}>
              <Sphere args={[1.5, 64, 64]} position={[0, 0, 0]}>
                {isDark ? (
                  <meshStandardMaterial
                    color="#1d6fe8"
                    wireframe
                    roughness={0.1}
                    emissive="#1d6fe8"
                    emissiveIntensity={0.5}
                  />
                ) : (
                  <MeshDistortMaterial
                    color="#1d6fe8"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                  />
                )}
              </Sphere>
            </Float>

            {/* Torus — Orange / Gold */}
            <Float rotationIntensity={isDark ? 3 : 1.5} floatIntensity={isDark ? 4 : 2} speed={isDark ? 2.5 : 1.5}>
              <Torus args={[0.6, 0.2, 16, 32]} position={[2.5, 1.5, -1]} rotation={[Math.PI / 4, 0, 0]}>
                {isDark ? (
                  <meshStandardMaterial color="#f59200" wireframe roughness={0} emissive="#f59200" emissiveIntensity={0.8} />
                ) : (
                  <meshStandardMaterial color="#f59200" roughness={0.1} metalness={0.9} />
                )}
              </Torus>
            </Float>

            {/* Octahedron — French Red/Pink */}
            <Float rotationIntensity={isDark ? 5 : 2} floatIntensity={isDark ? 6 : 4} speed={isDark ? 4 : 3}>
              <Octahedron args={[0.8]} position={[-2, -1.5, 1]} rotation={[0, Math.PI / 4, 0]}>
                <meshStandardMaterial
                  color={isDark ? "#e8186c" : "#e8186c"}
                  roughness={0.1}
                  metalness={0.5}
                  wireframe={true}
                  emissive={isDark ? "#e8186c" : "black"}
                  emissiveIntensity={isDark ? 0.8 : 0}
                />
              </Octahedron>
            </Float>

            {/* Small Sphere — Mint Green */}
            <Float rotationIntensity={isDark ? 2 : 1} floatIntensity={isDark ? 3 : 1} speed={isDark ? 2 : 1}>
              <Sphere args={[0.4, 32, 32]} position={[1.5, -2, 2]}>
                <meshStandardMaterial
                  color={isDark ? "#22c55e" : "#22c55e"}
                  roughness={0.3}
                  metalness={0.6}
                  wireframe={isDark}
                  emissive={isDark ? "#22c55e" : "black"}
                />
              </Sphere>
            </Float>

          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
}
