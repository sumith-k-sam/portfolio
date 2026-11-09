/**
 * DevOps Portfolio - 3D Interactive DevOps Globe
 * GitHub-Inspired Real-Time Global Cloud Mesh
 * Author: Sumith K Sam
 */

(function () {
  'use strict';

  // Check reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cloud Hubs (AWS Regions & Key Data Centers)
  const CLOUD_HUBS = [
    {
      id: 'us-east-1',
      name: 'AWS us-east-1 (N. Virginia)',
      short: 'us-east-1',
      lat: 38.0,
      lon: -78.5,
      role: 'Primary Production Ingress / VPC',
      pods: '64 Pods Running',
      latency: '14ms',
      status: '100% HEALTHY',
      color: '#ff7b00'
    },
    {
      id: 'us-west-2',
      name: 'AWS us-west-2 (Oregon)',
      short: 'us-west-2',
      lat: 45.5,
      lon: -122.6,
      role: 'Disaster Recovery & Hot Standby',
      pods: '32 Pods Standby',
      latency: '38ms',
      status: 'SYNCED',
      color: '#00d4ff'
    },
    {
      id: 'eu-central-1',
      name: 'AWS eu-central-1 (Frankfurt)',
      short: 'eu-central-1',
      lat: 50.1,
      lon: 8.6,
      role: 'European Gateway & Database Replica',
      pods: '28 Pods Running',
      latency: '32ms',
      status: '100% HEALTHY',
      color: '#ff2a4b'
    },
    {
      id: 'eu-west-1',
      name: 'AWS eu-west-1 (Ireland)',
      short: 'eu-west-1',
      lat: 53.3,
      lon: -6.2,
      role: 'CI/CD Build Farm & Artifact Cache',
      pods: '16 Build Workers',
      latency: '29ms',
      status: 'ACTIVE',
      color: '#ff2a4b'
    },
    {
      id: 'ap-south-1',
      name: 'AWS ap-south-1 (Mumbai / Kerala)',
      short: 'ap-south-1',
      lat: 19.0,
      lon: 72.8,
      role: 'Core DevOps Command & SRE Cluster',
      pods: '48 Pods Running',
      latency: '8ms',
      status: 'PRIMARY',
      color: '#ff7b00'
    },
    {
      id: 'ap-southeast-1',
      name: 'AWS ap-southeast-1 (Singapore)',
      short: 'ap-southeast-1',
      lat: 1.3,
      lon: 103.8,
      role: 'APAC Edge Proxy & Redis Cluster',
      pods: '20 Pods Running',
      latency: '24ms',
      status: '100% HEALTHY',
      color: '#00d4ff'
    },
    {
      id: 'ap-northeast-1',
      name: 'AWS ap-northeast-1 (Tokyo)',
      short: 'ap-northeast-1',
      lat: 35.6,
      lon: 139.6,
      role: 'East Asia Edge Routing',
      pods: '18 Pods Running',
      latency: '42ms',
      status: 'OPTIMIZED',
      color: '#ff2a4b'
    },
    {
      id: 'sa-east-1',
      name: 'AWS sa-east-1 (São Paulo)',
      short: 'sa-east-1',
      lat: -23.5,
      lon: -46.6,
      role: 'Latin America Latency Accelerator',
      pods: '12 Pods Running',
      latency: '68ms',
      status: 'HEALTHY',
      color: '#00d4ff'
    }
  ];

  // Cloud Network Mesh Arcs (Data Pipelines)
  const MESH_ARCS = [
    { from: 'us-east-1', to: 'ap-south-1', speed: 0.004, alt: 0.38, color: '#ff7b00' },
    { from: 'us-east-1', to: 'eu-west-1', speed: 0.005, alt: 0.28, color: '#ff2a4b' },
    { from: 'us-east-1', to: 'us-west-2', speed: 0.006, alt: 0.22, color: '#ff7b00' },
    { from: 'eu-central-1', to: 'ap-south-1', speed: 0.005, alt: 0.32, color: '#00d4ff' },
    { from: 'ap-south-1', to: 'ap-southeast-1', speed: 0.007, alt: 0.24, color: '#ff7b00' },
    { from: 'ap-southeast-1', to: 'ap-northeast-1', speed: 0.006, alt: 0.26, color: '#00d4ff' },
    { from: 'us-east-1', to: 'sa-east-1', speed: 0.005, alt: 0.30, color: '#ff2a4b' }
  ];

  // Continent Polygon Definitions for Accurate Landmass Dots
  const CONTINENT_POLYS = [
    // North America
    [[-168,65],[-165,71],[-140,70],[-120,68],[-85,70],[-75,60],[-60,50],[-65,44],[-75,35],[-80,25],[-90,20],[-97,18],[-105,23],[-115,30],[-124,38],[-124,48],[-132,54],[-150,60],[-160,55],[-168,65]],
    // South America
    [[-75,10],[-60,10],[-50,5],[-35,-5],[-35,-12],[-40,-22],[-50,-30],[-58,-38],[-65,-45],[-70,-55],[-75,-50],[-73,-40],[-72,-20],[-78,-10],[-80,0],[-75,10]],
    // Europe
    [[-10,36],[0,36],[15,38],[28,41],[35,42],[30,48],[20,55],[15,58],[25,71],[30,71],[40,65],[40,45],[30,45],[15,48],[5,48],[-5,48],[-10,43],[-10,36]],
    // Scandinavia
    [[5,58],[15,58],[20,65],[30,70],[25,71],[12,65],[5,58]],
    // UK & Ireland
    [[-10,51],[-5,58],[2,52],[-5,50],[-10,51]],
    // Africa
    [[-17,15],[-17,32],[-5,36],[10,37],[25,32],[32,32],[35,28],[42,15],[51,12],[48,0],[40,-15],[35,-25],[30,-34],[18,-34],[12,-20],[10,-5],[8,5],[0,5],[-10,5],[-17,15]],
    // Asia
    [[35,30],[45,30],[55,25],[60,40],[70,40],[75,35],[90,25],[100,20],[110,20],[120,25],[130,35],[140,45],[145,55],[160,60],[175,65],[180,70],[100,75],[60,70],[45,55],[35,30]],
    // India & Sri Lanka
    [[68,24],[74,32],[80,30],[88,28],[85,20],[80,8],[77,10],[72,18],[68,24]],
    // SE Asia
    [[98,18],[108,12],[108,2],[100,4],[98,18]],
    // Japan
    [[130,32],[135,35],[141,40],[145,45],[140,44],[135,38],[130,32]],
    // Australia
    [[113,-22],[115,-35],[135,-35],[145,-38],[150,-38],[153,-28],[150,-20],[142,-11],[130,-13],[122,-18],[113,-22]],
    // New Zealand
    [[168,-46],[174,-42],[178,-38],[175,-35],[172,-40],[168,-46]]
  ];

  function isPointInPoly(pt, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1];
      const xj = poly[j][0], yj = poly[j][1];
      const intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
        (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // Generate land and ocean dots
  function generateGlobePoints() {
    const points = [];

    // Land points from polygons
    for (let lat = -55; lat <= 70; lat += 3.2) {
      for (let lon = -180; lon <= 180; lon += 4.2) {
        if (CONTINENT_POLYS.some((p) => isPointInPoly([lon, lat], p))) {
          points.push({ lat, lon, isLand: true });
        }
      }
    }

    // Background ocean grid dots for full spherical depth
    for (let lat = -70; lat <= 70; lat += 14) {
      for (let lon = -180; lon <= 180; lon += 18) {
        if (!CONTINENT_POLYS.some((p) => isPointInPoly([lon, lat], p))) {
          points.push({ lat, lon, isLand: false });
        }
      }
    }

    return points;
  }

  /* --------------------------------------------------------------------------
     3D Spherical Math Utilities
     -------------------------------------------------------------------------- */
  function toCartesian(lat, lon, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return [
      -(r * Math.sin(phi) * Math.cos(theta)),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    ];
  }

  function rotatePoint(p, rotX, rotY) {
    const [x, y, z] = p;
    // Rotate around X (pitch)
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;
    // Rotate around Y (yaw)
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const x2 = x * cosY + z1 * sinY;
    const z2 = -x * sinY + z1 * cosY;
    return [x2, y1, z2];
  }

  // Spherical linear interpolation with altitude arc
  function slerpArc(p1, p2, t, r, alt) {
    const dot = (p1[0]*p2[0] + p1[1]*p2[1] + p1[2]*p2[2]) / (r*r);
    const clampedDot = Math.max(-1, Math.min(1, dot));
    const omega = Math.acos(clampedDot);
    if (Math.abs(omega) < 0.001) return p1;
    const sinOmega = Math.sin(omega);
    const a = Math.sin((1 - t) * omega) / sinOmega;
    const b = Math.sin(t * omega) / sinOmega;
    const x = a * p1[0] + b * p2[0];
    const y = a * p1[1] + b * p2[1];
    const z = a * p1[2] + b * p2[2];
    const norm = Math.sqrt(x*x + y*y + z*z);
    const currentR = r * (1 + alt * Math.sin(Math.PI * t));
    return [(x / norm) * currentR, (y / norm) * currentR, (z / norm) * currentR];
  }

  /* --------------------------------------------------------------------------
     DevOps Globe Controller Class
     -------------------------------------------------------------------------- */
  class DevOpsGlobe {
    constructor(canvasId, tooltipId) {
      this.canvas = document.getElementById(canvasId);
      this.tooltip = document.getElementById(tooltipId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.points = generateGlobePoints();

      // State
      this.radius = 145;
      this.rotX = 0.28; // ~16 deg tilt
      this.rotY = -0.5; // Initial rotation angle
      this.velX = 0;
      this.velY = 0.0035; // gentle auto-spin
      this.autoRotate = !prefersReducedMotion;
      this.isDragging = false;
      this.lastMouseX = 0;
      this.lastMouseY = 0;
      this.hoveredHub = null;
      this.targetRotX = null;
      this.targetRotY = null;
      this.pings = []; // Concentric ping animations on hubs

      // Prepare Arcs with animated packets
      this.arcs = MESH_ARCS.map((arc) => {
        const fromHub = CLOUD_HUBS.find((h) => h.id === arc.from);
        const toHub = CLOUD_HUBS.find((h) => h.id === arc.to);
        return {
          ...arc,
          fromHub,
          toHub,
          progress: Math.random(), // staggered starting position
          speed: arc.speed,
          alt: arc.alt
        };
      });

      this.initEvents();
      this.resize();
      this.animate();
    }

    resize() {
      const wrapper = this.canvas.parentElement;
      if (!wrapper) return;

      const wrapperWidth = wrapper.clientWidth || (wrapper.getBoundingClientRect ? wrapper.getBoundingClientRect().width : 320);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = Math.max(220, Math.min(Math.round(wrapperWidth), 420));

      this.canvas.width = Math.round(size * dpr);
      this.canvas.height = Math.round(size * dpr);
      this.canvas.style.width = `${size}px`;
      this.canvas.style.height = `${size}px`;

      // Always reset transform before scaling to prevent scale stacking on resize
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);

      this.width = size;
      this.height = size;
      this.centerX = size / 2;
      this.centerY = size / 2;
      this.radius = Math.max(88, Math.min(155, Math.round(size * 0.40)));
    }

    initEvents() {
      window.addEventListener('resize', () => this.resize());
      window.addEventListener('orientationchange', () => setTimeout(() => this.resize(), 150));

      // Mouse drag handlers
      this.canvas.addEventListener('mousedown', (e) => {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        this.velX = 0;
        this.velY = 0;
      });

      window.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (this.isDragging) {
          const dx = e.clientX - this.lastMouseX;
          const dy = e.clientY - this.lastMouseY;
          this.velY = dx * 0.005;
          this.velX = dy * 0.005;
          this.rotY += this.velY;
          this.rotX = Math.max(-1.3, Math.min(1.3, this.rotX + this.velX));
          this.lastMouseX = e.clientX;
          this.lastMouseY = e.clientY;
          if (this.tooltip) this.tooltip.style.display = 'none';
        } else {
          // Check hover over cloud hubs
          this.checkHubHover(mouseX, mouseY);
        }
      });

      window.addEventListener('mouseup', () => {
        this.isDragging = false;
      });

      // Touch handlers for mobile
      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          this.isDragging = true;
          this.lastMouseX = e.touches[0].clientX;
          this.lastMouseY = e.touches[0].clientY;
          this.velX = 0;
          this.velY = 0;
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (this.isDragging && e.touches.length === 1) {
          const dx = e.touches[0].clientX - this.lastMouseX;
          const dy = e.touches[0].clientY - this.lastMouseY;
          this.velY = dx * 0.006;
          this.velX = dy * 0.006;
          this.rotY += this.velY;
          this.rotX = Math.max(-1.3, Math.min(1.3, this.rotX + this.velX));
          this.lastMouseX = e.touches[0].clientX;
          this.lastMouseY = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        this.isDragging = false;
      });

      // Click to focus hub
      this.canvas.addEventListener('click', () => {
        if (this.hoveredHub) {
          this.focusHub(this.hoveredHub);
          if (window.DevOpsMain && window.DevOpsMain.showToast) {
            window.DevOpsMain.showToast(`Focused ${this.hoveredHub.name} (Latency: ${this.hoveredHub.latency})`);
          }
        }
      });
    }

    checkHubHover(mouseX, mouseY) {
      let found = null;

      CLOUD_HUBS.forEach((hub) => {
        const cart = toCartesian(hub.lat, hub.lon, this.radius);
        const rot = rotatePoint(cart, this.rotX, this.rotY);
        // Only front facing nodes
        if (rot[2] > -10) {
          const screenX = this.centerX + rot[0];
          const screenY = this.centerY + rot[1];
          const dist = Math.hypot(mouseX - screenX, mouseY - screenY);

          if (dist < 15) {
            found = { hub, screenX, screenY };
          }
        }
      });

      this.hoveredHub = found ? found.hub : null;
      this.canvas.style.cursor = found ? 'pointer' : (this.isDragging ? 'grabbing' : 'grab');

      if (this.tooltip) {
        if (found) {
          this.tooltip.style.display = 'block';
          this.tooltip.style.left = `${found.screenX + 12}px`;
          this.tooltip.style.top = `${found.screenY - 18}px`;
          this.tooltip.innerHTML = `
            <div class="tooltip-header"><span class="status-dot pulse-red"></span> ${found.hub.name}</div>
            <div class="tooltip-row"><span>Role:</span> <strong>${found.hub.role}</strong></div>
            <div class="tooltip-row"><span>Pods:</span> <strong>${found.hub.pods}</strong></div>
            <div class="tooltip-row"><span>Latency:</span> <span style="color: var(--accent-red);">${found.hub.latency}</span></div>
            <div class="tooltip-row"><span>Cluster Status:</span> <span style="color: var(--accent-cyan);">${found.hub.status}</span></div>
          `;
        } else {
          this.tooltip.style.display = 'none';
        }
      }
    }

    focusHub(hub) {
      // Calculate target rotation angles so this hub faces directly front
      this.targetRotX = Math.max(-1.2, Math.min(1.2, -(hub.lat * Math.PI) / 180));
      this.targetRotY = -((hub.lon + 90) * Math.PI) / 180;
      this.triggerPing(hub);
    }

    triggerPing(hub) {
      this.pings.push({
        hub,
        radius: 4,
        maxRadius: 28,
        alpha: 1
      });
    }

    triggerGlobalPing() {
      CLOUD_HUBS.forEach((hub) => this.triggerPing(hub));
      // Randomize packet burst
      this.arcs.forEach((arc) => {
        arc.progress = 0;
      });
      const latencyBadge = document.getElementById('globe-latency-indicator');
      if (latencyBadge) {
        latencyBadge.textContent = 'BURSTING TRAFFIC...';
        setTimeout(() => (latencyBadge.textContent = 'PINGS: 14ms (OPTIMAL)'), 1500);
      }
    }

    animate() {
      // Handle inertia & smooth target transition
      if (!this.isDragging) {
        if (this.targetRotX !== null && this.targetRotY !== null) {
          this.rotX += (this.targetRotX - this.rotX) * 0.08;
          this.rotY += (this.targetRotY - this.rotY) * 0.08;
          this.rotX = Math.max(-1.3, Math.min(1.3, this.rotX));
          if (Math.abs(this.targetRotX - this.rotX) < 0.005 && Math.abs(this.targetRotY - this.rotY) < 0.005) {
            this.targetRotX = null;
            this.targetRotY = null;
          }
        } else if (this.autoRotate) {
          this.rotY += 0.0035;
        } else {
          // Friction dampening
          this.velX *= 0.94;
          this.velY *= 0.94;
          this.rotX = Math.max(-1.3, Math.min(1.3, this.rotX + this.velX));
          this.rotY += this.velY;
        }
      }

      this.render();
      requestAnimationFrame(() => this.animate());
    }

    render() {
      try {
        const ctx = this.ctx;
        const R = this.radius;
        const cx = this.centerX;
        const cy = this.centerY;

        ctx.clearRect(0, 0, this.width, this.height);

        // 1. Atmosphere Background Halo & Glow (Cyber Red + Orange + Cyan)
        const glowGrad = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.35);
        glowGrad.addColorStop(0, 'rgba(255, 42, 75, 0.12)');
        glowGrad.addColorStop(0.4, 'rgba(255, 123, 0, 0.04)');
        glowGrad.addColorStop(0.7, 'rgba(0, 212, 255, 0.03)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2);
        ctx.fill();

        // 2. Dark Translucent Globe Core Sphere
        const sphereGrad = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.1, cx, cy, R);
        sphereGrad.addColorStop(0, '#0c131d');
        sphereGrad.addColorStop(0.8, '#060a10');
        sphereGrad.addColorStop(1, '#030508');

        ctx.fillStyle = sphereGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();

        // 3. Globe Edge Atmosphere Rim
        ctx.strokeStyle = 'rgba(255, 42, 75, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.stroke();

        // 4. Subtle Latitude & Meridian Grid Rings (Safely using Math.abs to prevent negative radius crashes)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 0.75;
        const sinTilt = Math.sin(this.rotX);
        const absSinTilt = Math.abs(sinTilt);
        for (let lat = -60; lat <= 60; lat += 30) {
          const ringR = Math.max(0.1, R * Math.cos((lat * Math.PI) / 180));
          const ringY = -R * Math.sin((lat * Math.PI) / 180);
          const p1 = rotatePoint([0, ringY, 0], this.rotX, 0);
          const radiusY = Math.max(0.01, ringR * absSinTilt);
          const radiusX = Math.max(0.01, ringR);
          ctx.beginPath();
          ctx.ellipse(cx, cy + p1[1], radiusX, radiusY, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 5. Draw Landmass Dots & Ocean Grid
        for (let i = 0; i < this.points.length; i++) {
          const pt = this.points[i];
          const cart = toCartesian(pt.lat, pt.lon, R);
          const rot = rotatePoint(cart, this.rotX, this.rotY);

          const z = rot[2];
          const x = cx + rot[0];
          const y = cy + rot[1];

          if (pt.isLand) {
            if (z > 0) {
              // Front facing land dot (Vibrant Cyber Red)
              const alpha = 0.35 + (z / R) * 0.65;
              ctx.fillStyle = `rgba(255, 42, 75, ${alpha * 0.88})`;
              ctx.beginPath();
              ctx.arc(x, y, 1.35, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // Back facing land dot (translucent holographic depth)
              const alpha = Math.max(0.04, 0.18 + (z / R) * 0.14);
              ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
              ctx.beginPath();
              ctx.arc(x, y, 0.9, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            // Ocean faint dot
            if (z > 0) {
              const alpha = 0.08 + (z / R) * 0.12;
              ctx.fillStyle = `rgba(139, 148, 158, ${alpha})`;
              ctx.beginPath();
              ctx.arc(x, y, 0.75, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // 6. Draw 3D Curved Arcs & Animated Light Packets
        this.arcs.forEach((arc) => {
          if (!arc.fromHub || !arc.toHub) return;

          const p1 = toCartesian(arc.fromHub.lat, arc.fromHub.lon, R);
          const p2 = toCartesian(arc.toHub.lat, arc.toHub.lon, R);

          const samples = 28;
          ctx.beginPath();
          let anyVisible = false;

          for (let s = 0; s <= samples; s++) {
            const t = s / samples;
            const arcPt = slerpArc(p1, p2, t, R, arc.alt);
            const rot = rotatePoint(arcPt, this.rotX, this.rotY);

            const x = cx + rot[0];
            const y = cy + rot[1];
            const z = rot[2];

            if (z > -20) anyVisible = true;

            if (s === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          if (anyVisible) {
            const arcColor = arc.color || '#00d4ff';
            if (arcColor === '#ff7b00') {
              ctx.strokeStyle = 'rgba(255, 123, 0, 0.45)';
            } else if (arcColor === '#ff2a4b') {
              ctx.strokeStyle = 'rgba(255, 42, 75, 0.45)';
            } else {
              ctx.strokeStyle = 'rgba(0, 212, 255, 0.38)';
            }
            ctx.lineWidth = 1.3;
            ctx.stroke();

            // Animated Data Packet
            arc.progress += arc.speed;
            if (arc.progress > 1) {
              arc.progress = 0;
              this.triggerPing(arc.toHub);
            }

            const packetPt = slerpArc(p1, p2, arc.progress, R, arc.alt);
            const packetRot = rotatePoint(packetPt, this.rotX, this.rotY);

            if (packetRot[2] > -10) {
              const px = cx + packetRot[0];
              const py = cy + packetRot[1];

              // Packet glow halo
              const pGrad = ctx.createRadialGradient(px, py, 1, px, py, 6);
              pGrad.addColorStop(0, '#ffffff');
              pGrad.addColorStop(0.5, arcColor);
              pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

              ctx.fillStyle = pGrad;
              ctx.beginPath();
              ctx.arc(px, py, 6, 0, Math.PI * 2);
              ctx.fill();

              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(px, py, 1.8, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });

        // 7. Draw Cloud Hub Markers & Beacons
        CLOUD_HUBS.forEach((hub) => {
          const cart = toCartesian(hub.lat, hub.lon, R);
          const rot = rotatePoint(cart, this.rotX, this.rotY);

          if (rot[2] > -5) {
            const x = cx + rot[0];
            const y = cy + rot[1];
            const isHovered = this.hoveredHub && this.hoveredHub.id === hub.id;
            const hubColor = hub.color || '#00d4ff';
            const beaconTipColor = isHovered ? '#ffffff' : hubColor;

            // Vertical 3D Pin Beacon
            const beaconTop = rotatePoint(toCartesian(hub.lat, hub.lon, R + (isHovered ? 20 : 12)), this.rotX, this.rotY);
            const bx = cx + beaconTop[0];
            const by = cy + beaconTop[1];

            ctx.strokeStyle = isHovered ? '#ffffff' : hubColor;
            ctx.lineWidth = isHovered ? 2 : 1.2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(bx, by);
            ctx.stroke();

            // Beacon tip
            ctx.fillStyle = beaconTipColor;
            ctx.beginPath();
            ctx.arc(bx, by, isHovered ? 3.5 : 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Base hub point
            ctx.fillStyle = hubColor;
            ctx.beginPath();
            ctx.arc(x, y, isHovered ? 4.5 : 3, 0, Math.PI * 2);
            ctx.fill();

            // Micro label for hub
            ctx.font = '10px monospace';
            ctx.fillStyle = isHovered ? '#ffffff' : (hubColor === '#ff7b00' ? '#ff9100' : 'rgba(230, 237, 243, 0.75)');
            ctx.fillText(hub.short, bx + 5, by - 2);
          }
        });

        // 8. Draw Expanding Ripple Pings
        for (let i = this.pings.length - 1; i >= 0; i--) {
          const ping = this.pings[i];
          const cart = toCartesian(ping.hub.lat, ping.hub.lon, R);
          const rot = rotatePoint(cart, this.rotX, this.rotY);

          if (rot[2] > -10) {
            const x = cx + rot[0];
            const y = cy + rot[1];
            const pingColor = (ping.hub && ping.hub.color) || '#ff2a4b';

            if (pingColor === '#ff7b00') {
              ctx.strokeStyle = `rgba(255, 123, 0, ${ping.alpha})`;
            } else if (pingColor === '#00d4ff') {
              ctx.strokeStyle = `rgba(0, 212, 255, ${ping.alpha})`;
            } else {
              ctx.strokeStyle = `rgba(255, 42, 75, ${ping.alpha})`;
            }

            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(x, y, Math.max(0.1, ping.radius), 0, Math.PI * 2);
            ctx.stroke();

            ping.radius += 0.8;
            ping.alpha -= 0.025;
            if (ping.alpha <= 0) {
              this.pings.splice(i, 1);
            }
          } else {
            this.pings.splice(i, 1);
          }
        }
      } catch (err) {
        console.error('Globe render error recovered:', err);
      }
    }
  }

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */
  function initDevOpsGlobe() {
    const canvas = document.getElementById('devops-globe-canvas');
    if (!canvas) return;

    const globe = new DevOpsGlobe('devops-globe-canvas', 'globe-tooltip');
    window.devOpsGlobeInstance = globe;

    // Controls
    const toggleRotateBtn = document.getElementById('globe-toggle-rotate');
    if (toggleRotateBtn) {
      toggleRotateBtn.addEventListener('click', () => {
        globe.autoRotate = !globe.autoRotate;
        toggleRotateBtn.innerHTML = globe.autoRotate ? '<span>⏸</span> Pause' : '<span>▶</span> Spin';
        if (window.DevOpsMain && window.DevOpsMain.showToast) {
          window.DevOpsMain.showToast(globe.autoRotate ? 'Auto-rotation resumed' : 'Globe auto-rotation paused');
        }
      });
    }

    const focusHomeBtn = document.getElementById('globe-focus-home');
    if (focusHomeBtn) {
      focusHomeBtn.addEventListener('click', () => {
        const homeHub = CLOUD_HUBS.find((h) => h.id === 'ap-south-1');
        if (homeHub) globe.focusHub(homeHub);
      });
    }

    const pingBtn = document.getElementById('globe-ping-btn');
    if (pingBtn) {
      pingBtn.addEventListener('click', () => {
        globe.triggerGlobalPing();
        if (window.DevOpsMain && window.DevOpsMain.showToast) {
          window.DevOpsMain.showToast('Triggered multi-region synthetic network ping!');
        }
      });
    }
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDevOpsGlobe);
  } else {
    initDevOpsGlobe();
  }

  window.DevOpsGlobeModule = {
    init: initDevOpsGlobe,
    getHubs: () => CLOUD_HUBS
  };
})();

