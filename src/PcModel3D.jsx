// src/PcModel3D.jsx
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  RoundedBox,
  Html,
  Sparkles,
  MeshReflectorMaterial,
  Environment,
  Lightformer
} from '@react-three/drei';
import * as THREE from 'three';

// ==========================================
// 1. PROCEDURALNE TEKSTURY (Siatka Mesh i Ścieżki PCB)
// ==========================================
function useHardwareTextures() {
  return useMemo(() => {
    // Tekstura perforowanej siatki wentylacyjnej (Honeycomb Mesh)
    const meshCanvas = document.createElement('canvas');
    meshCanvas.width = 128;
    meshCanvas.height = 128;
    const mCtx = meshCanvas.getContext('2d');
    mCtx.fillStyle = '#141720';
    mCtx.fillRect(0, 0, 128, 128);
    mCtx.fillStyle = '#050608';
    for (let y = 0; y < 128; y += 16) {
      for (let x = 0; x < 128; x += 16) {
        mCtx.beginPath();
        mCtx.arc(x + (y % 32 === 0 ? 0 : 8), y, 5, 0, Math.PI * 2);
        mCtx.fill();
      }
    }
    const meshTex = new THREE.CanvasTexture(meshCanvas);
    meshTex.wrapS = meshTex.wrapT = THREE.RepeatWrapping;
    meshTex.repeat.set(8, 12);

    // Tekstura ścieżek elektronicznych na płycie głównej (PCB Traces)
    const pcbCanvas = document.createElement('canvas');
    pcbCanvas.width = 256;
    pcbCanvas.height = 256;
    const pCtx = pcbCanvas.getContext('2d');
    pCtx.fillStyle = '#11141c';
    pCtx.fillRect(0, 0, 256, 256);
    pCtx.strokeStyle = '#242c3d';
    pCtx.lineWidth = 2;
    for (let i = 0; i < 36; i++) {
      pCtx.beginPath();
      const startX = (i * 19) % 256;
      const startY = (i * 37) % 256;
      pCtx.moveTo(startX, startY);
      pCtx.lineTo(startX + 30, startY + 30);
      pCtx.lineTo(startX + 30, startY + 75);
      pCtx.stroke();
    }
    const pcbTex = new THREE.CanvasTexture(pcbCanvas);
    pcbTex.wrapS = pcbTex.wrapT = THREE.RepeatWrapping;
    pcbTex.repeat.set(2, 2);

    return { meshTex, pcbTex };
  }, []);
}

// ==========================================
// 2. PŁYNNE STEROWANIE KAMERĄ (Focus na wybrany podzespół)
// ==========================================
export function CameraDirector({ targetPos, targetLookAt, autoFocus, controlsRef }) {
  const { camera } = useThree();
  const desiredPos = useMemo(() => new THREE.Vector3(...targetPos), [targetPos]);
  const desiredTarget = useMemo(() => new THREE.Vector3(...targetLookAt), [targetLookAt]);

  useFrame((_, delta) => {
    if (!autoFocus) return;
    camera.position.lerp(desiredPos, delta * 3.2);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(desiredTarget, delta * 3.8);
      controlsRef.current.update();
    }
  });

  return null;
}

// ==========================================
// 3. ANIMOWANY KONTENER WPADANIA + WIDOK ROZSTRZELONY (CAD)
// ==========================================
function AnimatedHardwareGroup({
  triggerKey,
  startOffset = [2.5, 1.2, 2.0],
  explodeOffset = [0, 0, 0],
  exploded = false,
  delay = 0,
  children
}) {
  const groupRef = useRef();
  const animState = useRef({ progress: 0, timer: 0, explodeFactor: 0 });

  useEffect(() => {
    animState.current.progress = 0;
    animState.current.timer = -delay;
  }, [triggerKey, delay]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    animState.current.timer += delta;

    if (animState.current.timer < 0) {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;
    animState.current.progress = Math.min(1, animState.current.progress + delta * 2.1);

    // Płynna interpolacja dla widoku rozstrzelonego (Exploded View)
    const targetExplode = exploded ? 1 : 0;
    animState.current.explodeFactor = THREE.MathUtils.lerp(
      animState.current.explodeFactor,
      targetExplode,
      delta * 4.5
    );

    const t = animState.current.progress;
    const c1 = 1.70158;
    const c3 = c1 + 1;
    const ease = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);

    const ex = animState.current.explodeFactor;

    groupRef.current.position.set(
      startOffset[0] * (1 - ease) + explodeOffset[0] * ex,
      startOffset[1] * (1 - ease) + explodeOffset[1] * ex,
      startOffset[2] * (1 - ease) + explodeOffset[2] * ex
    );

    const s = Math.max(0.01, Math.min(1, t * 1.35));
    groupRef.current.scale.set(s, s, s);
  });

  return <group ref={groupRef}>{children}</group>;
}

// ==========================================
// 4. REALISTYCZNY WENTYLATOR ARGB Z 9 WYPROFILOWANYMI ŁOPATKAMI
// ==========================================
function HighDetailFan({ position, rotation = [0, 0, 0], activeColor, size = 0.34 }) {
  const rotorRef = useRef();
  const ringMatRef = useRef();

  useFrame((_, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.y += delta * 12;
    }
    if (ringMatRef.current) {
      ringMatRef.current.color.set(activeColor);
      ringMatRef.current.emissive.set(activeColor);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Zewnętrzna zaokrąglona obudowa wentylatora */}
      <RoundedBox args={[size * 2.05, 0.075, size * 2.05]} radius={0.03} smoothness={4}>
        <meshStandardMaterial color="#12141c" roughness={0.4} metalness={0.5} />
      </RoundedBox>

      {/* Wycięcie cylindryczne (wnętrze ramki) */}
      <mesh>
        <cylinderGeometry args={[size * 0.94, size * 0.94, 0.08, 32, 1, true]} />
        <meshStandardMaterial color="#090b10" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Podwójny pierścień neonowy Halo ARGB */}
      <mesh position={[0, 0.036, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[size * 0.9, 0.018, 16, 48]} />
        <meshStandardMaterial
          ref={ringMatRef}
          color={activeColor}
          emissive={activeColor}
          emissiveIntensity={3.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, -0.036, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[size * 0.9, 0.015, 16, 48]} />
        <meshStandardMaterial
          color={activeColor}
          emissive={activeColor}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Wirnik + Miedziano-aluminiowy kapsel środkowy + 9 wygiętych łopatek */}
      <group ref={rotorRef}>
        <mesh>
          <cylinderGeometry args={[size * 0.28, size * 0.28, 0.065, 24]} />
          <meshStandardMaterial color="#1e2330" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.035, 0]}>
          <cylinderGeometry args={[size * 0.18, size * 0.18, 0.005, 24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={1} roughness={0.1} />
        </mesh>
        {Array.from({ length: 9 }).map((_, idx) => {
          const angle = (idx * Math.PI * 2) / 9;
          return (
            <group key={idx} rotation={[0, angle, 0]}>
              <mesh position={[size * 0.52, 0, 0]} rotation={[0.42, 0.12, 0]}>
                <boxGeometry args={[size * 0.62, 0.01, size * 0.22]} />
                <meshPhysicalMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.72}
                  roughness={0.15}
                  transmission={0.4}
                  emissive={activeColor}
                  emissiveIntensity={0.75}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

// ==========================================
// 5. ZAKRZYWIONE WĘŻE WODNE AIO I KABLE W OPLOCIE (CatmullRomCurve3)
// ==========================================
function CurvedTube3D({ points, radius = 0.032, color = '#161922', emissive = '#000000', emissiveIntensity = 0 }) {
  const geometry = useMemo(() => {
    const vectors = points.map((p) => new THREE.Vector3(...p));
    const curve = new THREE.CatmullRomCurve3(vectors);
    return new THREE.TubeGeometry(curve, 36, radius, 16, false);
  }, [points, radius]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        roughness={0.45}
        metalness={0.35}
        toneMapped={emissiveIntensity === 0}
      />
    </mesh>
  );
}

// ==========================================
// 6. GŁÓWNA SCENA 3D KOMPUTERA (OTWARTE AKWARIUM CAD)
// ==========================================
export function DetailedPcScene({
  selectedParts,
  rgbColor,
  rgbMode,
  showGlass,
  exploded,
  showHotspots,
  onSelectCategory,
  buildCounter
}) {
  const { case: pcCase, mobo, cpu, cooler, ram, gpu, psu, ssd } = selectedParts;
  const { meshTex, pcbTex } = useHardwareTextures();

  const lightRef = useRef();
  const dynamicColorRef = useRef(rgbColor);

  // Obsługa trybów podświetlenia ARGB (Statyczny, Tęcza, Ogień Kuźni, Cyber)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (rgbMode === 'rainbow') {
      const hue = (t * 0.15) % 1;
      const col = new THREE.Color().setHSL(hue, 1, 0.55);
      dynamicColorRef.current = `#${col.getHexString()}`;
    } else if (rgbMode === 'forge') {
      const pulse = 0.04 + Math.sin(t * 3.5) * 0.03;
      const col = new THREE.Color().setHSL(pulse, 1, 0.52);
      dynamicColorRef.current = `#${col.getHexString()}`;
    } else {
      dynamicColorRef.current = rgbColor;
    }

    if (lightRef.current) {
      lightRef.current.color.set(dynamicColorRef.current);
    }
  });

  const chassisColor = pcCase?.color || '#12151e';
  const accentColor = pcCase?.accent || '#ea580c';
  const isWhiteCase = pcCase?.type === 'aquarium-white';
  const activeColor = rgbMode === 'static' ? rgbColor : dynamicColorRef.current;

  return (
    <group position={[0, -1.35, 0]}>
      {/* OŚWIETLENIE STUDYJNE HDRI (100% lokalne, tworzy refleksy na szkle i metalu) */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="rect" intensity={2.5} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
          <Lightformer form="ring" color={rgbColor} intensity={3} onUpdate={(self) => self.lookAt(0, 0, 0)} position={[4, 3, 4]} scale={3} />
        </group>
      </Environment>

      {/* Światło wewnętrzne ARGB rzucające blask na podzespoły */}
      <pointLight ref={lightRef} position={[0.25, 1.55, 0.15]} color={rgbColor} intensity={4.5} distance={5} />
      <pointLight position={[0.8, 2.4, 0.8]} color="#ffffff" intensity={1.8} distance={5} />
      <Sparkles count={30} scale={3.4} size={2.2} speed={0.4} position={[0, 1.5, 0]} color={rgbColor} />

      {/* LUSTRZANA PODŁOGA STUDYJNA (Odbija obudowę PC i neony ARGB) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[6.5, 64]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={1}
          mixStrength={35}
          roughness={0.35}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#080a0f"
          metalness={0.7}
        />
      </mesh>

      {/* ================================================== */}
      {/* 1. OBUDOWA PC (Rama Dual-Chamber z zaokrąglonymi krawędziami) */}
      {/* ================================================== */}
      <AnimatedHardwareGroup
        triggerKey={`${pcCase?.id}-${buildCounter}`}
        startOffset={[0, -1.8, 0]}
        explodeOffset={[0, 0, 0]}
        exploded={exploded}
        delay={0}
      >
        {/* Gumowe nóżki antywibracyjne ze złotym/chromowanym pierścieniem */}
        {[
          [-0.7, 0.04, -1.25],
          [0.7, 0.04, -1.25],
          [-0.7, 0.04, 1.25],
          [0.7, 0.04, 1.25]
        ].map((pos, idx) => (
          <group key={idx} position={pos}>
            <mesh>
              <cylinderGeometry args={[0.12, 0.14, 0.08, 24]} />
              <meshStandardMaterial color="#111" roughness={0.8} />
            </mesh>
            <mesh position={[0, -0.01, 0]}>
              <cylinderGeometry args={[0.142, 0.142, 0.02, 24]} />
              <meshStandardMaterial color={accentColor} metalness={0.9} roughness={0.15} />
            </mesh>
          </group>
        ))}

        {/* Dolna płyta bazowa */}
        <RoundedBox args={[1.76, 0.08, 2.94]} radius={0.03} smoothness={4} position={[0, 0.1, 0]}>
          <meshStandardMaterial color={chassisColor} metalness={0.65} roughness={0.3} />
        </RoundedBox>

        {/* Piwnica zasilacza (PSU Shroud) z fazowanym wycięciem i paskiem LED/Miedź */}
        <RoundedBox args={[1.68, 0.44, 2.86]} radius={0.03} smoothness={4} position={[0, 0.34, 0]}>
          <meshStandardMaterial color={chassisColor} metalness={0.6} roughness={0.35} />
        </RoundedBox>
        {/* Świecący pasek akcentowy wzdłuż piwnicy (styl SMX Capsule / Lian Li EVO) */}
        <mesh position={[0.85, 0.55, 0]}>
          <boxGeometry args={[0.02, 0.035, 2.88]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.55, 1.44]}>
          <boxGeometry args={[1.7, 0.035, 0.02]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.6} toneMapped={false} />
        </mesh>

        {/* Tylna ściana z perforowaną siatką Mesh i śledziami PCIe */}
        <RoundedBox args={[1.76, 2.72, 0.06]} radius={0.02} position={[0, 1.46, -1.44]}>
          <meshStandardMaterial map={meshTex} color={chassisColor} metalness={0.7} roughness={0.35} />
        </RoundedBox>

        {/* Tacka płyty głównej z gumowymi przepustami na kable */}
        <RoundedBox args={[0.07, 2.72, 2.9]} radius={0.02} position={[-0.78, 1.46, 0]}>
          <meshStandardMaterial color={chassisColor} metalness={0.65} roughness={0.35} />
        </RoundedBox>
        {/* Gumowe przepusty kablowe (Grommets) */}
        {[1.85, 1.25].map((yPos, i) => (
          <RoundedBox key={i} args={[0.09, 0.38, 0.16]} radius={0.02} position={[-0.76, yPos, 0.58]}>
            <meshStandardMaterial color="#090a0d" roughness={0.9} />
          </RoundedBox>
        ))}

        {/* Górny panel z filtrem przeciwkurzowym i portami USB-C / Power LED */}
        <RoundedBox args={[1.76, 0.09, 2.94]} radius={0.03} smoothness={4} position={[0, 2.82, 0]}>
          <meshStandardMaterial color={chassisColor} metalness={0.65} roughness={0.3} />
        </RoundedBox>
        <mesh position={[0.68, 2.87, 1.15]}>
          <torusGeometry args={[0.045, 0.008, 12, 24]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color={rgbColor} emissive={rgbColor} emissiveIntensity={3} toneMapped={false} />
        </mesh>

        {/* Wentylatory obudowy (1x Tył + 2x Bok Reverse Blade) */}
        <HighDetailFan position={[0.18, 2.02, -1.36]} rotation={[Math.PI / 2, 0, 0]} activeColor={activeColor} size={0.32} />
        <HighDetailFan position={[-0.7, 2.02, 0.96]} rotation={[0, 0, Math.PI / 2]} activeColor={activeColor} size={0.3} />
        <HighDetailFan position={[-0.7, 1.32, 0.96]} rotation={[0, 0, Math.PI / 2]} activeColor={activeColor} size={0.3} />
      </AnimatedHardwareGroup>

      {/* ================================================== */}
      {/* 2. PŁYTA GŁÓWNA (Radiatory z żeberkami, kondensatory, bateria CMOS) */}
      {/* ================================================== */}
      <AnimatedHardwareGroup
        triggerKey={`${mobo?.id}-${buildCounter}`}
        startOffset={[2.2, 0.2, 0]}
        explodeOffset={[0.35, 0, 0]}
        exploded={exploded}
        delay={0.12}
      >
        <group position={[-0.68, 1.56, -0.22]}>
          {/* Wielowarstwowy laminat PCB ze ścieżkami */}
          <RoundedBox args={[0.05, 1.78, 1.52]} radius={0.015}>
            <meshStandardMaterial map={pcbTex} color={mobo?.color || '#151821'} roughness={0.5} metalness={0.35} />
          </RoundedBox>

          {/* Osłona portów I/O + Żebrowany radiator VRM */}
          <RoundedBox args={[0.18, 0.72, 0.28]} radius={0.02} position={[0.09, 0.42, -0.56]}>
            <meshStandardMaterial color={mobo?.heatsinkColor || '#64748b'} metalness={0.88} roughness={0.2} />
          </RoundedBox>
          {/* Podświetlany pasek na osłonie VRM płyty głównej */}
          <mesh position={[0.182, 0.44, -0.56]}>
            <boxGeometry args={[0.008, 0.45, 0.04]} />
            <meshStandardMaterial color={rgbColor} emissive={rgbColor} emissiveIntensity={2.5} toneMapped={false} />
          </mesh>

          {/* Górny radiator sekcji zasilania z nacięciami */}
          <RoundedBox args={[0.14, 0.16, 0.68]} radius={0.015} position={[0.07, 0.76, -0.08]}>
            <meshStandardMaterial color={mobo?.heatsinkColor || '#64748b'} metalness={0.88} roughness={0.2} />
          </RoundedBox>

          {/* Srebrna bateria BIOS CR2032 */}
          <mesh position={[0.03, -0.28, -0.15]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.015, 24]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </mesh>

          {/* Złote kondensatory sekcji audio */}
          {[-0.65, -0.55, -0.45, -0.35].map((y, idx) => (
            <mesh key={idx} position={[0.04, y, -0.66]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.022, 0.022, 0.04, 16]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.15} />
            </mesh>
          ))}

          {/* Radiator Chipsetu B650 / X670E */}
          <RoundedBox args={[0.09, 0.38, 0.42]} radius={0.015} position={[0.05, -0.46, 0.36]}>
            <meshStandardMaterial color={mobo?.heatsinkColor || '#64748b'} metalness={0.85} roughness={0.22} />
          </RoundedBox>

          {/* Wzmocnione stalowe sloty PCIe x16 */}
          <mesh position={[0.04, -0.14, -0.08]}>
            <boxGeometry args={[0.045, 0.055, 0.82]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.12} />
          </mesh>
          <mesh position={[0.04, -0.58, -0.08]}>
            <boxGeometry args={[0.04, 0.045, 0.82]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* ZAKRZYWIONA WIĄZKA ZASILANIA 24-PIN ATX W OPLOCIE */}
          <CurvedTube3D
            points={[
              [0.06, 0.25, 0.68],
              [0.24, 0.25, 0.74],
              [0.16, 0.22, 0.82],
              [-0.08, 0.20, 0.82]
            ]}
            radius={0.042}
            color="#1e293b"
          />
        </group>
      </AnimatedHardwareGroup>

      {/* ================================================== */}
      {/* 3. PROCESOR (CPU AMD Ryzen AM5 z charakterystycznym IHS) */}
      {/* ================================================== */}
      <AnimatedHardwareGroup
        triggerKey={`${cpu?.id}-${buildCounter}`}
        startOffset={[2.4, 0.5, 0]}
        explodeOffset={[0.65, 0.15, 0]}
        exploded={exploded}
        delay={0.24}
      >
        <group position={[-0.62, 1.94, -0.3]}>
          <RoundedBox args={[0.03, 0.34, 0.34]} radius={0.008}>
            <meshStandardMaterial color="#0f5132" roughness={0.4} metalness={0.3} />
          </RoundedBox>
          <RoundedBox args={[0.035, 0.26, 0.26]} radius={0.01} position={[0.02, 0, 0]}>
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.12} />
          </RoundedBox>
        </group>
      </AnimatedHardwareGroup>

      {/* ================================================== */}
      {/* 4. DYSK SSD M.2 NVMe Z RADIATOREM */}
      {/* ================================================== */}
      <AnimatedHardwareGroup
        triggerKey={`${ssd?.id}-${buildCounter}`}
        startOffset={[2.4, -0.1, 0.3]}
        explodeOffset={[0.7, -0.1, 0]}
        exploded={exploded}
        delay={0.35}
      >
        <group position={[-0.62, 1.6, -0.28]}>
          <RoundedBox args={[0.05, 0.15, 0.56]} radius={0.01}>
            <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.22} />
          </RoundedBox>
          <mesh position={[0.028, 0, 0]}>
            <boxGeometry args={[0.005, 0.05, 0.42]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1} />
          </mesh>
        </group>
      </AnimatedHardwareGroup>

      {/* ================================================== */}
      {/* 5. PAMIĘĆ RAM DDR5 (Radiatory + Dyfuzory ARGB) */}
      {/* ================================================== */}
      <AnimatedHardwareGroup
        triggerKey={`${ram?.id}-${buildCounter}`}
        startOffset={[2.5, 0.6, 0.4]}
        explodeOffset={[0.85, 0.2, 0.25]}
        exploded={exploded}
        delay={0.46}
      >
        <group position={[-0.56, 1.94, 0.12]}>
          {Array.from({ length: ram?.sticks || 2 }).map((_, idx) => (
            <group key={idx} position={[0, 0, idx * 0.075]}>
              <RoundedBox args={[0.14, 0.5, 0.028]} radius={0.006}>
                <meshStandardMaterial color="#1a1f2c" metalness={0.85} roughness={0.2} />
              </RoundedBox>
              {/* Grzbiet kości RAM (Świecący pasek LED lub szczotkowane srebro) */}
              <RoundedBox args={[0.032, 0.48, 0.032]} radius={0.006} position={[0.065, 0, 0]}>
                <meshStandardMaterial
                  color={ram?.rgb ? activeColor : '#e2e8f0'}
                  emissive={ram?.rgb ? activeColor : '#000000'}
                  emissiveIntensity={ram?.rgb ? 2.8 : 0}
                  metalness={0.9}
                  roughness={0.1}
                  toneMapped={!ram?.rgb}
                />
              </RoundedBox>
            </group>
          ))}
        </group>
      </AnimatedHardwareGroup>

      {/* ================================================== */}
      {/* 6. CHŁODZENIE CPU (Wodne AIO 360mm z zakrzywionymi wężami 3D lub Wieża z 16 finami) */}
      {/* ================================================== */}
      <AnimatedHardwareGroup
        triggerKey={`${cooler?.id}-${buildCounter}`}
        startOffset={[2.0, 1.8, 0]}
        explodeOffset={[0.95, 0.45, 0]}
        exploded={exploded}
        delay={0.58}
      >
        {cooler?.isAio ? (
          <group>
            {/* Blokopompka z wielowarstwowym efektem Infinity Mirror */}
            <group position={[-0.5, 1.94, -0.3]} rotation={[0, 0, Math.PI / 2]}>
              <mesh>
                <cylinderGeometry args={[0.21, 0.21, 0.18, 32]} />
                <meshStandardMaterial color="#10131a" metalness={0.85} roughness={0.18} />
              </mesh>
              {/* Pierścienie głębi Infinity Mirror */}
              {[0.16, 0.11, 0.06].map((r, idx) => (
                <mesh key={idx} position={[0, -0.092 + idx * 0.012, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[r, 0.012, 16, 32]} />
                  <meshStandardMaterial
                    color={activeColor}
                    emissive={activeColor}
                    emissiveIntensity={3.5 - idx * 0.7}
                    toneMapped={false}
                  />
                </mesh>
              ))}
            </group>

            {/* Chłodnica 360mm pod sufitem */}
            <RoundedBox args={[0.82, 0.14, 2.32]} radius={0.02} position={[0.04, 2.68, 0]}>
              <meshStandardMaterial color="#0e1117" metalness={0.75} roughness={0.35} />
            </RoundedBox>

            {/* 3 wentylatory 120mm ARGB na chłodnicy */}
            <HighDetailFan position={[0.04, 2.57, -0.74]} rotation={[0, 0, 0]} activeColor={activeColor} size={0.33} />
            <HighDetailFan position={[0.04, 2.57, 0]} rotation={[0, 0, 0]} activeColor={activeColor} size={0.33} />
            <HighDetailFan position={[0.04, 2.57, 0.74]} rotation={[0, 0, 0]} activeColor={activeColor} size={0.33} />

            {/* DWIE GIĘTKIE, ZAKRZYWIONE RURKI WODNE AIO W OPLOCIE */}
            <CurvedTube3D
              points={[
                [-0.46, 1.88, -0.14],
                [-0.12, 1.82, 0.22],
                [0.14, 2.15, 0.58],
                [0.08, 2.58, 0.85]
              ]}
              radius={0.03}
              color="#1c212e"
            />
            <CurvedTube3D
              points={[
                [-0.46, 1.98, -0.14],
                [-0.08, 1.95, 0.28],
                [0.2, 2.25, 0.64],
                [0.16, 2.58, 0.92]
              ]}
              radius={0.03}
              color="#1c212e"
            />
          </group>
        ) : (
          /* Wieżowe chłodzenie powietrzne z 16 pojedynczymi aluminiowymi finami i 6 miedzianymi rurkami */
          <group position={[-0.3, 1.94, -0.3]}>
            {Array.from({ length: 16 }).map((_, fIdx) => (
              <mesh key={fIdx} position={[-0.22 + fIdx * 0.03, 0, 0]}>
                <boxGeometry args={[0.012, 0.54, 0.48]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.18} />
              </mesh>
            ))}
            {/* Miedziane ciepłowody (Heatpipes) */}
            {[-0.16, -0.06, 0.06, 0.16].map((zOff, hIdx) => (
              <mesh key={hIdx} position={[0, 0, zOff]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.022, 0.022, 0.58, 16]} />
                <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.15} />
              </mesh>
            ))}
            <HighDetailFan position={[0.02, 0, 0.27]} rotation={[Math.PI / 2, 0, 0]} activeColor={activeColor} size={0.24} />
          </group>
        )}
      </AnimatedHardwareGroup>

      {/* ================================================== */}
      {/* 7. KARTA GRAFICZNA (26 finów radiatora, ciepłowody, backplate, kabel 12VHPWR) */}
      {/* ================================================== */}
      <AnimatedHardwareGroup
        triggerKey={`${gpu?.id}-${buildCounter}`}
        startOffset={[2.8, 0, 0.6]}
        explodeOffset={[1.15, -0.15, 0.35]}
        exploded={exploded}
        delay={0.74}
      >
        <group position={[-0.2, 1.38, -0.1]}>
          {/* Główne wyprofilowane body karty (Shroud) */}
          <RoundedBox args={[0.74, 0.21, gpu?.length || 1.45]} radius={0.035} smoothness={4}>
            <meshStandardMaterial color={gpu?.color || '#1a1d26'} metalness={0.78} roughness={0.24} />
          </RoundedBox>

          {/* Szczotkowany metalowy Backplate na górze karty */}
          <RoundedBox
            args={[0.72, 0.018, (gpu?.length || 1.45) - 0.04]}
            radius={0.01}
            position={[0, 0.11, 0]}
          >
            <meshStandardMaterial color="#334155" metalness={0.92} roughness={0.18} />
          </RoundedBox>

          {/* Prawdziwy pakiet 24 aluminiowych żeberek radiatora wewnątrz karty */}
          {Array.from({ length: 24 }).map((_, finIdx) => {
            const totalLen = (gpu?.length || 1.45) - 0.12;
            const zPos = -totalLen / 2 + (finIdx / 23) * totalLen;
            return (
              <mesh key={finIdx} position={[0, 0, zPos]}>
                <boxGeometry args={[0.68, 0.16, 0.012]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.2} />
              </mesh>
            );
          })}

          {/* Niklowane rurki cieplne (Heatpipes) biegnące wzdłuż karty */}
          {[-0.2, 0, 0.2].map((xOff, idx) => (
            <mesh key={idx} position={[xOff, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, (gpu?.length || 1.45) + 0.02, 16]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.1} />
            </mesh>
          ))}

          {/* Świecący pasek GEFORCE RTX ARGB na boku karty */}
          <RoundedBox
            args={[0.02, 0.055, (gpu?.length || 1.45) * 0.58]}
            radius={0.008}
            position={[0.372, 0.02, 0]}
          >
            <meshStandardMaterial
              color={activeColor}
              emissive={activeColor}
              emissiveIntensity={3.2}
              toneMapped={false}
            />
          </RoundedBox>

          {/* Wentylatory Axial-tech pod kartą */}
          {Array.from({ length: gpu?.fans || 2 }).map((_, i) => {
            const count = gpu?.fans || 2;
            const len = gpu?.length || 1.45;
            const zPos = (i - (count - 1) / 2) * (len * 0.62);
            return (
              <HighDetailFan
                key={i}
                position={[0, -0.105, zPos]}
                rotation={[0, 0, 0]}
                activeColor={activeColor}
                size={0.23}
              />
            );
          })}

          {/* Zakrzywiony kabel zasilający 12VHPWR schodzący z karty do piwnicy */}
          <CurvedTube3D
            points={[
              [0.36, 0.02, 0.25],
              [0.52, -0.05, 0.25],
              [0.44, -0.45, 0.28],
              [0.12, -0.82, 0.3]
            ]}
            radius={0.032}
            color="#1e293b"
            emissive={activeColor}
            emissiveIntensity={0.45}
          />
        </group>
      </AnimatedHardwareGroup>

      {/* ================================================== */}
      {/* 8. ZASILACZ (PSU w dolnej komorze z grillem i tabliczką mocy) */}
      {/* ================================================== */}
      <AnimatedHardwareGroup
        triggerKey={`${psu?.id}-${buildCounter}`}
        startOffset={[0, -1.2, 2.0]}
        explodeOffset={[0.6, -0.35, 0.4]}
        exploded={exploded}
        delay={0.86}
      >
        <group position={[0, 0.32, -0.65]}>
          <RoundedBox args={[1.38, 0.36, 0.85]} radius={0.02}>
            <meshStandardMaterial color="#0f1219" metalness={0.75} roughness={0.3} />
          </RoundedBox>
          <RoundedBox args={[0.02, 0.22, 0.65]} radius={0.008} position={[0.695, 0, 0]}>
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.2} />
          </RoundedBox>
        </group>
      </AnimatedHardwareGroup>

      {/* ================================================== */}
      {/* 9. SZYBY HARTOWANE Z CZARNĄ RAMKĄ SILKSCREEN I ŚRUBAMI */}
      {/* ================================================== */}
      {showGlass && (
        <AnimatedHardwareGroup
          triggerKey={`glass-${buildCounter}`}
          startOffset={[1.8, 0, 1.8]}
          explodeOffset={[1.5, 0, 1.2]}
          exploded={exploded}
          delay={0.95}
        >
          {/* SZYBA BOCZNA */}
          <group position={[0.86, 1.68, 0]}>
            <mesh>
              <boxGeometry args={[0.02, 2.22, 2.86]} />
              <meshPhysicalMaterial
                color={isWhiteCase ? '#f8fafc' : '#bae6fd'}
                transparent
                opacity={0.18}
                roughness={0.04}
                metalness={0.1}
                transmission={0.82}
                reflectivity={0.9}
              />
            </mesh>
            {/* Czarna obwódka wokół szyby (Silkscreen Frame) + 4 śruby montażowe */}
            <mesh position={[0.011, 1.07, 0]}>
              <boxGeometry args={[0.006, 0.08, 2.86]} />
              <meshStandardMaterial color={chassisColor} roughness={0.3} />
            </mesh>
            <mesh position={[0.011, -1.07, 0]}>
              <boxGeometry args={[0.006, 0.08, 2.86]} />
              <meshStandardMaterial color={chassisColor} roughness={0.3} />
            </mesh>
            {[
              [0.02, 1.0, -1.32],
              [0.02, 1.0, 1.32],
              [0.02, -1.0, -1.32],
              [0.02, -1.0, 1.32]
            ].map((sPos, idx) => (
              <mesh key={idx} position={sPos} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.032, 0.032, 0.03, 16]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} />
              </mesh>
            ))}
          </group>

          {/* SZYBA PRZEDNIA (Akwarium) */}
          <group position={[0, 1.68, 1.44]}>
            <mesh>
              <boxGeometry args={[1.7, 2.22, 0.02]} />
              <meshPhysicalMaterial
                color={isWhiteCase ? '#f8fafc' : '#bae6fd'}
                transparent
                opacity={0.18}
                roughness={0.04}
                metalness={0.1}
                transmission={0.82}
                reflectivity={0.9}
              />
            </mesh>
          </group>
        </AnimatedHardwareGroup>
      )}

      {/* ================================================== */}
      {/* 10. INTERAKTYWNE ZNACZNIKI 3D (HOTSPOTS) NA MODELU */}
      {/* ================================================== */}
      {showHotspots && onSelectCategory && (
        <group>
          <Html position={[0.25, 1.38, 0.45]} center distanceFactor={7}>
            <button className="hotspot-3d-pin" onClick={() => onSelectCategory('gpu')}>
              <span className="pin-dot"></span>
              <span className="pin-text">🎮 {gpu?.name.split(' ').slice(0, 4).join(' ')}</span>
            </button>
          </Html>
          <Html position={[-0.35, 2.05, -0.3]} center distanceFactor={7}>
            <button className="hotspot-3d-pin" onClick={() => onSelectCategory('cpu')}>
              <span className="pin-dot"></span>
              <span className="pin-text">🧠 {cpu?.name.replace('AMD ', '')}</span>
            </button>
          </Html>
          <Html position={[0.2, 2.65, 0.5]} center distanceFactor={7}>
            <button className="hotspot-3d-pin" onClick={() => onSelectCategory('cooler')}>
              <span className="pin-dot"></span>
              <span className="pin-text">❄️ {cooler?.isAio ? 'AIO 360mm ARGB' : 'Dual Tower'}</span>
            </button>
          </Html>
        </group>
      )}
    </group>
  );
}