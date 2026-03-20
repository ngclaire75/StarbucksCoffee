"use client";

import { useEffect, useRef } from "react";

export default function CoffeeCup3D({ size = 180 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    let animId;
    let renderer;

    const init = async () => {
      const THREE = await import("three");
      const el = mountRef.current;
      if (!el) return;

      // ── Renderer ─────────────────────────────────────────
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(size, size);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      // ── Scene & Camera ───────────────────────────────────
      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0.6, 4.2);
      camera.lookAt(0, 0, 0);

      // ── Materials ────────────────────────────────────────
      const matDarkGreen = new THREE.MeshPhongMaterial({ color: 0x1E3932, shininess: 80 });
      const matMidGreen  = new THREE.MeshPhongMaterial({ color: 0x2C5147, shininess: 40 });
      const matCream     = new THREE.MeshPhongMaterial({ color: 0xfafaf8, shininess: 30 });
      const matGold      = new THREE.MeshPhongMaterial({ color: 0xC9A84C, shininess: 100 });

      // ── Cup Group ────────────────────────────────────────
      const cupGroup = new THREE.Group();
      scene.add(cupGroup);

      // Body (tapered cylinder — narrower at bottom)
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.68, 0.52, 1.4, 36),
        matDarkGreen
      );
      body.position.y = 0.05;
      cupGroup.add(body);

      // Top rim ring
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.68, 0.045, 14, 36),
        matMidGreen
      );
      rim.position.y = 0.75;
      cupGroup.add(rim);

      // Bottom disc
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.52, 0.52, 0.06, 36),
        matMidGreen
      );
      base.position.y = -0.64;
      cupGroup.add(base);

      // Handle (partial torus)
      const handle = new THREE.Mesh(
        new THREE.TorusGeometry(0.32, 0.065, 12, 24, Math.PI),
        matMidGreen
      );
      handle.rotation.z = -Math.PI / 2;
      handle.position.set(0.74, 0.1, 0);
      cupGroup.add(handle);

      // Saucer
      const saucer = new THREE.Mesh(
        new THREE.CylinderGeometry(1.05, 1.05, 0.07, 36),
        matCream
      );
      saucer.position.y = -0.72;
      cupGroup.add(saucer);

      const saucerRim = new THREE.Mesh(
        new THREE.TorusGeometry(1.05, 0.04, 10, 36),
        matGold
      );
      saucerRim.position.y = -0.685;
      cupGroup.add(saucerRim);

      // Starbucks star badge on cup front
      const badge = new THREE.Mesh(
        new THREE.CircleGeometry(0.22, 5),
        new THREE.MeshPhongMaterial({ color: 0xC9A84C, shininess: 120, side: THREE.DoubleSide })
      );
      badge.position.set(0, 0.1, 0.69);
      cupGroup.add(badge);

      // Lid
      const lid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.70, 0.68, 0.15, 36),
        new THREE.MeshPhongMaterial({ color: 0x2C5147, shininess: 60, transparent: true, opacity: 0.92 })
      );
      lid.position.y = 0.825;
      cupGroup.add(lid);

      const lidDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.70, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3),
        new THREE.MeshPhongMaterial({ color: 0x2C5147, shininess: 60, transparent: true, opacity: 0.85 })
      );
      lidDome.position.y = 0.9;
      lidDome.rotation.x = Math.PI;
      cupGroup.add(lidDome);

      // Drink hole on lid
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 0.05, 16),
        new THREE.MeshPhongMaterial({ color: 0x1E3932 })
      );
      hole.position.set(0.25, 0.93, 0);
      cupGroup.add(hole);

      // ── Steam Particles ──────────────────────────────────
      const steamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 });
      const steamParticles = [];
      for (let i = 0; i < 16; i++) {
        const p = new THREE.Mesh(
          new THREE.SphereGeometry(0.03 + Math.random() * 0.04, 7, 7),
          steamMat.clone()
        );
        const ox = (Math.random() - 0.5) * 0.35;
        const startY = 1.1 + Math.random() * 0.3;
        p.position.set(ox, startY, (Math.random() - 0.5) * 0.18);
        p.userData = {
          speed:  0.006 + Math.random() * 0.008,
          drift:  (Math.random() - 0.5) * 0.004,
          startY,
          ox,
          phase:  Math.random() * Math.PI * 2,
        };
        scene.add(p);
        steamParticles.push(p);
      }

      // ── Lighting ─────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffffff, 0.55));

      const key = new THREE.DirectionalLight(0xffffff, 1.4);
      key.position.set(2, 5, 4);
      scene.add(key);

      const fill = new THREE.DirectionalLight(0xD4E9E2, 0.5);
      fill.position.set(-3, 1, -2);
      scene.add(fill);

      const rim2 = new THREE.DirectionalLight(0xC9A84C, 0.3);
      rim2.position.set(0, -3, 3);
      scene.add(rim2);

      // ── Animate ──────────────────────────────────────────
      let t = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        t += 0.014;

        // Gentle spin + bob
        cupGroup.rotation.y = t * 0.45;
        cupGroup.position.y = Math.sin(t * 0.9) * 0.055;

        // Steam
        steamParticles.forEach(p => {
          p.position.y  += p.userData.speed;
          p.position.x  += p.userData.drift;
          const life = (p.position.y - p.userData.startY) / 1.4;
          p.material.opacity = Math.max(0, 0.55 * (1 - life));
          if (life >= 1) {
            p.position.set(p.userData.ox, p.userData.startY, (Math.random() - 0.5) * 0.18);
            p.material.opacity = 0.55;
          }
        });

        renderer.render(scene, camera);
      };
      animate();
    };

    init().catch(console.error);

    return () => {
      cancelAnimationFrame(animId);
      if (renderer) {
        renderer.dispose();
        const canvas = mountRef.current?.querySelector("canvas");
        if (canvas) canvas.remove();
      }
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}
    />
  );
}
