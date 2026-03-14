'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './notavailablemodal.css';

export default function NotAvailableModal({ onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.offsetWidth || 360;
    const H = canvas.offsetHeight || 280;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 5;

    const COUNT = 120;
    const positions = new Float32Array(COUNT * 3);
    const velocities = [];
    const sizes = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      velocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: Math.random() * 0.018 + 0.004,
      });
      sizes[i] = Math.random() * 0.06 + 0.02;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: 0xc8a96e,
      size: 0.07,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Soft ambient ring — a torus for depth
    const ringGeo = new THREE.TorusGeometry(2.2, 0.02, 8, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xc8a96e, transparent: true, opacity: 0.12 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.015, 8, 80),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 })
    );
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);

    let animId;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.005;

      const pos = geometry.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3]     += velocities[i].x + Math.sin(t + i) * 0.002;
        pos[i * 3 + 1] += velocities[i].y;
        if (pos[i * 3 + 1] > 3.5) {
          pos[i * 3 + 1] = -3.5;
          pos[i * 3]     = (Math.random() - 0.5) * 10;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      ring.rotation.z  = t * 0.3;
      ring2.rotation.z = -t * 0.18;
      material.opacity = 0.55 + Math.sin(t * 2) * 0.12;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, []);

  // Auto-close
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <canvas ref={canvasRef} className="modal-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

        <div className="modal-body">
          <div className="modal-icon-ring">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h2 className="modal-heading">Coming Soon</h2>
          <p className="modal-subtext">
            This feature is currently not available.<br />
            Check back with us soon.
          </p>

          <button className="modal-close-btn" onClick={onClose}>
            Got it
          </button>
        </div>

        <div className="modal-progress-bar" />
      </div>
    </div>
  );
}
