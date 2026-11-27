/* ==========================================================================
   VENOM X MONICA (MONIC) - TKJ & AI DIGITAL PORTFOLIO
   Core Interactive Application Logic
   ========================================================================== */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (WEB AUDIO API) ---
  // Pure synthesized audio - zero external audio asset dependencies!
  let audioCtx = null;
  let isSoundMuted = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Comical squish sound for the "Venom Kelindes" effect
  function playSquishSound() {
    if (isSoundMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = 'triangle';
      // Pitch bend down fast (splat/squash)
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.16);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.2);

      // Second low squish rumble
      setTimeout(() => {
        try {
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          const t = audioCtx.currentTime;
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(140, t);
          osc2.frequency.exponentialRampToValueAtTime(45, t + 0.12);
          gain2.gain.setValueAtTime(0.3, t);
          gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.start(t);
          osc2.stop(t + 0.15);
        } catch (e) {}
      }, 40);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Deep growl / roar sound for Venom
  function playVenomRoar() {
    if (isSoundMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      // Simple lowpass filter for deep throat symbiote rumble
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.48);
    } catch (e) {}
  }

  // Cyber blip for buttons
  function playBlipSound() {
    if (isSoundMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  // ==========================================================================
  // EFEK ANIMASI KEPALA VENOM KELINDES (SQUASH & SPLAT)
  // Super lightweight, pure DOM + CSS transforms, cleans up in 750ms!
  // ==========================================================================
  let squishCount = 0;

  function triggerVenomKelindesEffect(x, y) {
    playSquishSound();
    squishCount++;
    const counterEl = document.getElementById('kelindes-counter-badge');
    if (counterEl) {
      counterEl.textContent = `${squishCount}x SQUISHED!`;
      counterEl.classList.remove('hidden');
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'venom-kelindes-wrapper';
    wrapper.style.left = `${x}px`;
    wrapper.style.top = `${y}px`;

    // High quality cartoon Venom Head SVG with funny shock expression
    wrapper.innerHTML = `
      <div class="splat-text">SPLAT!!</div>
      <div class="venom-squished-head">
        <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="venomSkin" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#1e1b4b" />
              <stop offset="70%" stop-color="#080811" />
              <stop offset="100%" stop-color="#000000" />
            </radialGradient>
            <linearGradient id="tongueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f43f5e" />
              <stop offset="100%" stop-color="#be123c" />
            </linearGradient>
          </defs>
          <!-- Symbiote Head -->
          <path d="M 50,10 C 22,10 12,35 15,62 C 18,85 35,92 50,92 C 65,92 82,85 85,62 C 88,35 78,10 50,10 Z" fill="url(#venomSkin)" stroke="#00f0ff" stroke-width="2"/>
          
          <!-- Eyes - Shocked / Squished cartoon eyes -->
          <path d="M 24,32 C 30,30 42,42 38,52 C 32,54 22,46 24,32 Z" fill="#ffffff" stroke="#9333ea" stroke-width="1.5"/>
          <path d="M 76,32 C 70,30 58,42 62,52 C 68,54 78,46 76,32 Z" fill="#ffffff" stroke="#9333ea" stroke-width="1.5"/>
          <!-- Dazed X or spiral inside eye during squish -->
          <path d="M 28,38 L 34,46 M 34,38 L 28,46" stroke="#000" stroke-width="2" stroke-linecap="round"/>
          <path d="M 66,38 L 72,46 M 72,38 L 66,46" stroke="#000" stroke-width="2" stroke-linecap="round"/>

          <!-- Wide Sharp Grin with comic flattened teeth -->
          <path d="M 22,66 Q 50,88 78,66 Q 50,72 22,66 Z" fill="#450a0a" stroke="#00f0ff" stroke-width="1"/>
          <polygon points="26,67 29,74 32,67 36,75 40,68 44,76 48,68 52,76 56,68 60,76 64,68 68,75 72,67" fill="#ffffff"/>
          <polygon points="28,72 32,67 36,72 40,67 44,72 48,67 52,72 56,67 60,72 64,67 68,72" fill="#ffffff"/>

          <!-- Long comic flat tongue spilling out sideways -->
          <path d="M 45,70 C 42,85 20,85 10,95 C 16,98 38,90 52,78 Z" fill="url(#tongueGrad)" stroke="#fda4af" stroke-width="1"/>
          <circle cx="12" cy="94" r="3" fill="#10b981"/>
        </svg>
      </div>
    `;

    // Add bursting splat droplets around the head
    const colors = ['#00f0ff', '#c026d3', '#ef4444', '#10b981', '#f8fafc'];
    for (let i = 0; i < 8; i++) {
      const drop = document.createElement('div');
      drop.className = 'splat-droplet';
      const angle = (i / 8) * 2 * Math.PI;
      const distance = 35 + Math.random() * 45;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const size = 5 + Math.random() * 8;
      drop.style.width = `${size}px`;
      drop.style.height = `${size}px`;
      drop.style.setProperty('--dx', `${dx}px`);
      drop.style.setProperty('--dy', `${dy}px`);
      drop.style.background = colors[i % colors.length];
      wrapper.appendChild(drop);
    }

    document.body.appendChild(wrapper);

    // Garbage collection after animation completes
    setTimeout(() => {
      if (wrapper && wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    }, 750);
  }

  // Attach kelindes effect to all navigation links, buttons, and marked items
  function setupKelindesTriggers() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest(
        'a, button, .kelindes-trigger, .nav-item, .tech-badge, #walking-chibi-btn, .clickable-card'
      );
      if (target) {
        // Fallback for keyboard or off-target clicks
        const rect = target.getBoundingClientRect();
        const x = (e.clientX && e.clientX > 0) ? e.clientX : (rect.left + rect.width / 2);
        const y = (e.clientY && e.clientY > 0) ? e.clientY : (rect.top + rect.height / 2);
        triggerVenomKelindesEffect(x, y);
      }
    });

    // Test playground button
    const testPad = document.getElementById('kelindes-test-pad');
    if (testPad) {
      testPad.addEventListener('click', (e) => {
        const rect = testPad.getBoundingClientRect();
        const x = (e.clientX && e.clientX > 0) ? e.clientX : (rect.left + rect.width / 2);
        const y = (e.clientY && e.clientY > 0) ? e.clientY : (rect.top + rect.height / 2);
        triggerVenomKelindesEffect(x, y);
      });
    }
  }

  // ==========================================================================
  // CHIBI VENOM BERJALAN (WALKING CHIBI VENOM ENGINE)
  // Walks back and forth across the screen bottom, flips, talks, responds to clicks!
  // ==========================================================================
  let chibiX = 60;
  let chibiSpeed = 1.3;
  let chibiDirection = 1; // 1 = right, -1 = left
  let isChibiPaused = false;
  let chibiMode = 'patrol'; // 'patrol' or 'follow'
  let mouseX = window.innerWidth / 2;

  const chibiPhrases = [
    'WE ARE VENOM! ...dan Monic jagoan TKJ kami!',
    'Mikrotik Routerboard aman terkendali!',
    'Lapar... butuh asupan bandwidth 10 Gbps!',
    'Web Server Nginx aktif & stabil tanpa hambatan!',
    'Monic 12 TKJ SMK Bangun Nusa Bangsa paling GG!',
    'PKL di PT Dwi Prima Rezeky sukses terverifikasi!',
    'Desain grafis & video editor Monic tajam abis!',
    'Symbiote AI siap mengamankan jaringanmu!'
  ];

  function showChibiSpeech(text, duration = 3500) {
    const bubble = document.getElementById('chibi-speech-bubble');
    if (!bubble) return;
    bubble.textContent = text;
    bubble.classList.add('active');
    setTimeout(() => {
      bubble.classList.remove('active');
    }, duration);
  }

  function initWalkingChibi() {
    const companion = document.getElementById('chibi-venom-companion');
    if (!companion) return;

    // Listen to mouse for follow mode
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
    });

    // Companion click action
    companion.addEventListener('click', (e) => {
      e.stopPropagation();
      playVenomRoar();
      triggerVenomKelindesEffect(e.clientX, e.clientY - 20);

      // Play 360-degree backflip
      companion.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      companion.style.transform = `translateX(${chibiX}px) rotate(360deg) translateY(-25px)`;

      setTimeout(() => {
        companion.style.transition = 'none';
      }, 650);

      const randomPhrase = chibiPhrases[Math.floor(Math.random() * chibiPhrases.length)];
      showChibiSpeech(randomPhrase);
    });

    // Animation loop for walking
    function animateWalk() {
      const minX = 20;
      const maxX = Math.max(window.innerWidth - 110, 100);

      if (!isChibiPaused) {
        if (chibiMode === 'patrol') {
          chibiX += chibiSpeed * chibiDirection;

          // Flip on boundaries
          if (chibiX >= maxX) {
            chibiX = maxX;
            chibiDirection = -1;
            isChibiPaused = true;
            setTimeout(() => { isChibiPaused = false; }, 900);
          } else if (chibiX <= minX) {
            chibiX = minX;
            chibiDirection = 1;
            isChibiPaused = true;
            setTimeout(() => { isChibiPaused = false; }, 900);
          }
        } else if (chibiMode === 'follow') {
          const diff = mouseX - (chibiX + 40);
          if (Math.abs(diff) > 20) {
            chibiDirection = diff > 0 ? 1 : -1;
            chibiX += Math.min(Math.max(diff * 0.05, -3), 3);
          }
        }

        // Apply translation to container and flip only to SVG (so speech text is never mirrored)
        companion.style.transform = `translateX(${chibiX}px)`;
        const chibiSvg = companion.querySelector('.chibi-venom-body-wrap svg');
        if (chibiSvg) {
          chibiSvg.style.transform = `scaleX(${chibiDirection})`;
          chibiSvg.style.transformOrigin = '50px 55px';
        }
      }

      requestAnimationFrame(animateWalk);
    }

    requestAnimationFrame(animateWalk);

    // Initial random speech after 3 seconds
    setTimeout(() => {
      showChibiSpeech('Halo! Kami Venom menemani jelajah web Monic!');
    }, 2800);
  }

  // Toggle walk mode (Patrol vs Follow Mouse)
  window.toggleChibiMode = function () {
    if (chibiMode === 'camera') {
      stopFaceTracking();
    }
    chibiMode = chibiMode === 'patrol' ? 'follow' : 'patrol';
    const btn = document.getElementById('chibi-mode-toggle-btn');
    if (btn) {
      btn.textContent = chibiMode === 'patrol' ? 'Mode: Patroli Bebas' : 'Mode: Mengikuti Kursor';
    }
    showChibiSpeech(chibiMode === 'patrol' ? 'Mode Patroli Aktif!' : 'Kami mengikuti kursormu!');
  };

  // ==========================================================================
  // SENSOR KAMERA PELACAK MUKA (FACE TRACKING ENGINE)
  // Venom mengakses kamera & bergerak mengikuti arah muka user (kiri / kanan)
  // ==========================================================================
  let isFaceTrackingActive = false;
  let faceMediaStream = null;
  let faceTrackingAnimId = null;
  let faceDetector = null;

  // Cek ketersediaan hardware FaceDetector API di Chromium
  if ('FaceDetector' in window) {
    try {
      faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
    } catch (e) {
      faceDetector = null;
    }
  }

  async function startFaceTracking() {
    const video = document.getElementById('face-tracking-video');
    const hud = document.getElementById('face-tracking-hud');
    const canvas = document.getElementById('face-tracking-canvas');
    const btnLabel = document.getElementById('face-tracking-btn-label');
    const statusText = document.getElementById('face-direction-text');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Perangkat Anda tidak mendukung akses kamera web.');
      return;
    }

    try {
      faceMediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' },
        audio: false
      });

      if (video) {
        video.srcObject = faceMediaStream;
        await video.play();
      }

      isFaceTrackingActive = true;
      chibiMode = 'camera';
      if (hud) hud.classList.remove('hidden');
      if (btnLabel) btnLabel.textContent = '📷 Sensor Muka: ON';
      showChibiSpeech('Sensor Kamera Aktif! Gerakkan mukamu, kami akan mengikuti!');
      playVenomRoar();

      // Canvas tracker loop
      const ctx = canvas.getContext('2d');
      const processCanvas = document.createElement('canvas');
      processCanvas.width = 80;
      processCanvas.height = 60;
      const processCtx = processCanvas.getContext('2d');

      async function processFaceFrame() {
        if (!isFaceTrackingActive || !video) return;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth || 320;
          canvas.height = video.videoHeight || 240;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          let detectedX = null; // rentang 0 (kiri) sampai 1 (kanan) di feed kamera

          // Coba deteksi via hardware FaceDetector jika ada
          if (faceDetector) {
            try {
              const faces = await faceDetector.detect(video);
              if (faces && faces.length > 0) {
                const box = faces[0].boundingBox;
                detectedX = (box.x + box.width / 2) / canvas.width;
                // Render cyber bounding box
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 2;
                ctx.strokeRect(canvas.width - (box.x + box.width), box.y, box.width, box.height);
                ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
                ctx.fillRect(canvas.width - (box.x + box.width), box.y, box.width, box.height);
              }
            } catch (err) {}
          }

          // Fallback algoritma deteksi skin-centroid & kecerahan wajah
          if (detectedX === null) {
            processCtx.drawImage(video, 0, 0, 80, 60);
            const frame = processCtx.getImageData(0, 0, 80, 60);
            const data = frame.data;
            let sumX = 0;
            let totalWeight = 0;

            for (let y = 5; y < 55; y += 2) {
              for (let x = 5; x < 75; x += 2) {
                const idx = (y * 80 + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];

                // Rule skin-tone / facial luminance
                if (r > 60 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 12) {
                  const weight = (r * 2 + g) / 3;
                  sumX += x * weight;
                  totalWeight += weight;
                }
              }
            }

            if (totalWeight > 2000) {
              const centroidX = sumX / totalWeight; // 0..80
              detectedX = centroidX / 80;

              // Render visual target crosshair pada canvas
              const visualX = (1 - detectedX) * canvas.width;
              ctx.strokeStyle = '#9333ea';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(visualX, canvas.height / 2, 28, 0, 2 * Math.PI);
              ctx.stroke();

              ctx.strokeStyle = '#00f0ff';
              ctx.beginPath();
              ctx.moveTo(visualX - 35, canvas.height / 2);
              ctx.lineTo(visualX + 35, canvas.height / 2);
              ctx.moveTo(visualX, canvas.height / 2 - 35);
              ctx.lineTo(visualX, canvas.height / 2 + 35);
              ctx.stroke();
            }
          }

          // Analisis arah muka & gerakkan Chibi Venom
          if (detectedX !== null) {
            // Kamera depan dimirror, jadi jika user bergerak ke kanan fisik:
            // detectedX < 0.44 artinya muka user bergerak ke kanan monitor
            // detectedX > 0.56 artinya muka user bergerak ke kiri monitor
            const minX = 20;
            const maxX = Math.max(window.innerWidth - 110, 100);

            if (detectedX < 0.43) {
              // MUKA KANAN USER
              if (statusText) statusText.innerHTML = `<span class="text-emerald-400">MUKA: KANAN &rarr;</span> <span class="text-xs text-slate-300">(VENOM IKUT KANAN)</span>`;
              chibiDirection = 1;
              chibiX = Math.min(chibiX + 4.2, maxX);
            } else if (detectedX > 0.57) {
              // MUKA KIRI USER
              if (statusText) statusText.innerHTML = `<span class="text-cyan-400">&larr; MUKA: KIRI</span> <span class="text-xs text-slate-300">(VENOM IKUT KIRI)</span>`;
              chibiDirection = -1;
              chibiX = Math.max(chibiX - 4.2, minX);
            } else {
              // MUKA TENGAH
              if (statusText) statusText.innerHTML = `<span class="text-purple-300">&bull; MUKA: TENGAH &bull;</span> <span class="text-xs text-slate-400">(FOKUS KE USER)</span>`;
            }

            // Update posisi Chibi Venom secara live
            const companion = document.getElementById('chibi-venom-companion');
            if (companion) {
              companion.style.transform = `translateX(${chibiX}px)`;
              const chibiSvg = companion.querySelector('.chibi-venom-body-wrap svg');
              if (chibiSvg) {
                chibiSvg.style.transform = `scaleX(${chibiDirection})`;
                chibiSvg.style.transformOrigin = '50px 55px';
              }
            }
          } else {
            if (statusText) statusText.textContent = 'MENCARI POSISI MUKA...';
          }
        }

        faceTrackingAnimId = requestAnimationFrame(processFaceFrame);
      }

      faceTrackingAnimId = requestAnimationFrame(processFaceFrame);

    } catch (err) {
      console.error('Gagal mengakses kamera:', err);
      alert('Tidak dapat mengaktifkan kamera. Pastikan izin kamera telah diberikan di browser Anda.');
      stopFaceTracking();
    }
  }

  function stopFaceTracking() {
    isFaceTrackingActive = false;
    if (faceMediaStream) {
      faceMediaStream.getTracks().forEach(t => t.stop());
      faceMediaStream = null;
    }
    if (faceTrackingAnimId) {
      cancelAnimationFrame(faceTrackingAnimId);
      faceTrackingAnimId = null;
    }
    const hud = document.getElementById('face-tracking-hud');
    const btnLabel = document.getElementById('face-tracking-btn-label');
    if (hud) hud.classList.add('hidden');
    if (btnLabel) btnLabel.textContent = '📷 Sensor Kamera Muka: OFF';
    chibiMode = 'patrol';
    showChibiSpeech('Sensor Kamera Dimatikan. Kembali ke patroli santai!');
  }

  window.toggleFaceTracking = function () {
    if (isFaceTrackingActive) {
      stopFaceTracking();
    } else {
      startFaceTracking();
    }
  };

  // ==========================================================================
  // AI ASSISTANT: HALF MONIC CHIBI / HALF VENOM SYMBIOTE
  // Interactive Dialog, Smart Queries, and Web Speech Indonesian Voice
  // ==========================================================================
  let isAiSpeaking = false;

  function speakText(text) {
    if (isSoundMuted) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.05;
    utterance.pitch = 0.9; // Slightly deep symbiote-bonded tone

    utterance.onstart = () => { isAiSpeaking = true; };
    utterance.onend = () => { isAiSpeaking = false; };

    window.speechSynthesis.speak(utterance);
  }

  const aiKnowledgeBase = {
    monic: `Monica Kartika Indah Riyanti (akrab dipanggil Monic) adalah siswi berprestasi dari kelas 12 TKJ (Teknik Komputer dan Jaringan) di SMK Bangun Nusa Bangsa. Monic memadukan keahlian teknik jaringan tingkat lanjut (Mikrotik, Server, Linux, Networking) dengan kreativitas tinggi di bidang desain grafis dan video editing!`,
    tkj: `Di bidang TKJ, Monic sangat berpengalaman dalam:
1. Konfigurasi Mikrotik Routerboard (Routing OSPF/BGP, Bandwidth Management Queue Tree/PCQ, Firewall NAT, Hotspot User Manager, VLAN).
2. Web Server Deployment (Nginx, Apache, Linux Debian/Ubuntu, SSL Let's Encrypt, BIND9 DNS).
3. Hardware & Fiber Optic (Splicing FO, UTP Crimping Cat6, Managed Switch, Subnetting VLSM).
4. Coding & Scripting (HTML/CSS/JS, PHP, Python Network Automation, Bash).`,
    pkl: `Monic telah menyelesaikan Praktik Kerja Lapangan (PKL) resmi di PT DWI PRIMA REZEKY!
Di sana Monic bertugas sebagai IT Support & Network Infrastructure Intern:
- Evaluasi Kedisiplinan: 80% (Baik, Tanggap, & Bertanggung Jawab).
- Penguasaan IT: Mahir & Tanggap dalam maintenance jaringan perkantoran & server internal.
- Tugas Utama: Troubleshooting perangkat keras, router, access point, instalasi kabel LAN terstruktur, dan pemeliharaan backup data.`,
    smk: `SMKS Bangun Nusa Bangsa (SMK BNB) adalah sekolah kejuruan tempat Monic menuntut ilmu:
• Status & Akreditasi: Terakreditasi "A" BAN-SM (NPSN: 69769379) di bawah naungan Yayasan Bangun Nusa Bangsa.
• Kepala Sekolah: Bapak Muhammad Yunus, S.E., M.Pd.
• Dewan Guru & Tenaga Pendidik: Didukung oleh guru produktif TKJ yang ahli di bidang jaringan Mikrotik, server Linux, fiber optic, perakitan PC, dewan guru adaptif/normatif, pengajar bahasa asing (English, Mandarin, Jepang), serta instruktur praktisi industri DUDI.
• 3 Jurusan Unggulan: 
  1. Teknik Komputer & Jaringan (TKJ - Jurusan Monic)
  2. Akuntansi & Keuangan Lembaga (AKL)
  3. Teknik Kendaraan Ringan Otomotif (TKRO)
• Alamat Lengkap: Jl. Raya SKB No. 8, RT 06/RW 07 (Jl. Roda Pembangunan No. 45), Kel. Karadenan, Kec. Cibinong, Kab. Bogor, Jawa Barat 16913.
• Fasilitas: Lab TKJ modern dengan PC Workstation Core i7, routerboard Mikrotik, server rack, fiber optic splicer, ruang kelas ber-AC dengan proyektor/TV LCD, gedung bertingkat milik sendiri, dan internet cepat.
• Kontak Resmi: www.smk-bnb.sch.id | Email: info@smk-bnb.sch.id / smkbnb13@gmail.com.`,
    desain: `Selain jago di bidang jaringan komputer, Monic memiliki skill kreatif yang mumpuni:
1. Video Editing: Adobe Premiere Pro, After Effects, CapCut, DaVinci Resolve (color grading, beat syncing, motion graphics).
2. Desain Grafis & UI/UX: Adobe Photoshop, Illustrator, Canva, Figma (branding, poster, mockup visual, web UI design).`,
    venom: `Saya adalah Asisten Venom! Asisten AI cerdas berkecepatan tinggi yang mendampingi Monic dalam mengelola infrastruktur jaringan TKJ, server, dan visual multimedia.`
  };

  function appendChatMessage(sender, text, metadata = null) {
    const chatContainer = document.getElementById('ai-messages-container');
    if (!chatContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `flex gap-2.5 mb-3.5 ${sender === 'user' ? 'justify-end' : 'justify-start'}`;

    if (sender === 'ai') {
      let groundingHtml = '';
      if (metadata && metadata.groundingMetadata) {
        const queries = metadata.groundingMetadata.webSearchQueries || [];
        const chunks = metadata.groundingMetadata.groundingChunks || [];
        
        groundingHtml = `
          <div class="mt-2.5 pt-2 border-t border-cyan-500/30 text-[10px] font-mono space-y-1">
            <div class="text-cyan-300 flex items-center gap-1 font-bold">
              <span>🔍 Google Search Grounding:</span>
              <span class="text-slate-400 font-normal">${queries.join(', ') || 'Pencarian Web Terkini'}</span>
            </div>
            ${chunks.length > 0 ? `
              <div class="flex flex-wrap gap-1 pt-1">
                ${chunks.slice(0, 3).map(c => `
                  <a href="${c.web?.uri || '#'}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 hover:text-white hover:border-cyan-300 transition-colors truncate max-w-[200px]">
                    🌐 ${c.web?.title || 'Sumber Google'}
                  </a>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }

      let toolHtml = '';
      if (metadata && metadata.toolResult) {
        const t = metadata.toolResult;
        toolHtml = `
          <div class="mt-2 p-2 rounded-lg bg-slate-950/90 border border-purple-500/40 text-[10px] font-mono space-y-1">
            <div class="text-purple-300 font-bold flex items-center gap-1">
              <span>⚡ Layanan Google Terintegrasi: ${t.service || 'Tool'}</span>
            </div>
            <div class="text-slate-300">${t.message || t.recommendation || 'Data berhasil diproses.'}</div>
            ${t.url ? `
              <a href="${t.url}" target="_blank" rel="noopener noreferrer" class="inline-block mt-1 px-2.5 py-1 rounded bg-purple-600/30 border border-purple-400/50 text-purple-200 hover:text-white font-bold">
                Buka di ${t.service} &rarr;
              </a>
            ` : ''}
          </div>
        `;
      }

      msgDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-cyan-400 bg-slate-900 flex items-center justify-center text-xs">
          <span class="text-cyan-400 font-bold">AV</span>
        </div>
        <div class="max-w-[85%] bg-slate-900/90 border border-cyan-500/30 rounded-2xl rounded-tl-sm p-3 text-xs leading-relaxed text-slate-200 shadow-lg">
          <div class="font-bold text-cyan-300 mb-1 flex items-center justify-between font-heading text-[11px]">
            <span class="flex items-center gap-1.5">
              <span>ASISTEN VENOM</span>
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            </span>
            <span class="text-[9px] font-mono text-slate-400">Gemini 2.5 + Grounding</span>
          </div>
          <div>${text.replace(/\n/g, '<br/>')}</div>
          ${toolHtml}
          ${groundingHtml}
        </div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="max-w-[80%] bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-2xl rounded-tr-sm p-3 text-xs leading-relaxed shadow-lg">
          ${text}
        </div>
      `;
    }

    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Riwayat percakapan untuk konteks multi-turn
  const chatContext = [
    { role: 'model', content: 'Halo! Saya adalah Asisten Venom (asisten AI digital portofolio Monic). Siap membantu dengan penalaran tajam dan akses real-time Google.' }
  ];

  async function handleAiQuestion(queryType, customText = '') {
    playBlipSound();
    let userText = customText;

    if (queryType === 'monic') {
      userText = userText || 'Siapa itu Monica (Monic)?';
    } else if (queryType === 'tkj') {
      userText = userText || 'Apa saja keahlian TKJ & Mikrotik Monic?';
    } else if (queryType === 'pkl') {
      userText = userText || 'Bagaimana pengalaman PKL di PT Dwi Prima Rezeky?';
    } else if (queryType === 'smk') {
      userText = userText || 'Informasi lengkap tentang SMK Bangun Nusa Bangsa?';
    } else if (queryType === 'desain') {
      userText = userText || 'Apa saja keahlian Desain & Editor Monic?';
    } else if (queryType === 'google_search') {
      userText = userText || 'Cari berita teknologi dan jaringan Mikrotik terkini di Google!';
    } else if (queryType === 'google_maps') {
      userText = userText || 'Buka rute Google Maps menuju SMK Bangun Nusa Bangsa';
    }

    appendChatMessage('user', userText);
    chatContext.push({ role: 'user', content: userText });

    // Tampilkan indikator mengetik
    const chatContainer = document.getElementById('ai-messages-container');
    const typingId = 'typing-indicator-' + Date.now();
    if (chatContainer) {
      const typingDiv = document.createElement('div');
      typingDiv.id = typingId;
      typingDiv.className = 'flex gap-2.5 mb-3 justify-start';
      typingDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full border border-cyan-400 bg-slate-900 flex items-center justify-center text-xs text-cyan-400 font-bold">AV</div>
        <div class="p-2.5 rounded-2xl bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Asisten Venom sedang menalar & mencari di Google...</span>
        </div>
      `;
      chatContainer.appendChild(typingDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    const removeTyping = () => {
      const el = document.getElementById(typingId);
      if (el) el.remove();
    };

    // Coba panggil Backend API Gemini dengan Google Search Grounding
    const savedKey = localStorage.getItem('monic_gemini_key') || '';
    let apiSuccess = false;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatContext,
          apiKey: savedKey
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply && data.status !== 'unconfigured') {
          removeTyping();
          appendChatMessage('ai', data.reply, {
            groundingMetadata: data.groundingMetadata,
            toolResult: data.toolResult
          });
          chatContext.push({ role: 'model', content: data.reply });
          speakText(data.reply.substring(0, 180));
          apiSuccess = true;
          return;
        }
      }
    } catch (err) {
      // Backend mungkin belum dinyalakan atau direct file:/// access
    }

    // Fallback cerdas lokal jika backend offline / API key belum diisi
    setTimeout(() => {
      removeTyping();
      let replyText = '';
      let toolResult = null;
      const q = userText.toLowerCase();

      if (queryType === 'google_maps' || q.includes('maps') || q.includes('lokasi smk') || q.includes('alamat')) {
        replyText = 'Lokasi dan rute menuju SMK Bangun Nusa Bangsa (Jl. Raya SKB No. 8, Karadenan, Cibinong, Bogor) siap diakses via Google Maps.';
        toolResult = {
          service: 'Google Maps',
          url: 'https://maps.google.com/?q=SMK+Bangun+Nusa+Bangsa+Cibinong',
          message: 'Tautan rute resmi Google Maps telah disiapkan untuk SMK Bangun Nusa Bangsa.'
        };
      } else if (queryType === 'google_search' || q.includes('berita') || q.includes('terkini') || q.includes('harga') || q.includes('google')) {
        replyText = `Hasil Pencarian Terkini Google (Simulasi Asisten Venom):\n• Mikrotik RouterOS versi 7.x terus menghadirkan pembaruan performa WireGuard, BGP, dan containerization.\n• Perkembangan teknologi AI & IoT semakin terintegrasi dengan arsitektur jaringan TKJ.\n\n(Catatan: Untuk live Google Search Grounding via SDK resmi @google/genai, jalankan backend server dengan "npm start" dan isi GEMINI_API_KEY di file .env atau klik tombol ⚙️ di atas!)`;
      } else if (queryType === 'monic' || q.includes('monic') || q.includes('biodata') || q.includes('siapa')) {
        replyText = aiKnowledgeBase.monic;
      } else if (queryType === 'tkj' || q.includes('mikrotik') || q.includes('tkj') || q.includes('server') || q.includes('jaringan') || q.includes('coding')) {
        replyText = aiKnowledgeBase.tkj;
      } else if (queryType === 'pkl' || q.includes('pkl') || q.includes('dwi prima') || q.includes('pt')) {
        replyText = aiKnowledgeBase.pkl;
      } else if (queryType === 'smk' || q.includes('smk') || q.includes('bangun nusa') || q.includes('sekolah') || q.includes('guru') || q.includes('kepala sekolah')) {
        replyText = aiKnowledgeBase.smk;
      } else if (queryType === 'desain' || q.includes('edit') || q.includes('desain') || q.includes('video') || q.includes('figma')) {
        replyText = aiKnowledgeBase.desain;
      } else {
        replyText = `Halo! Saya Asisten Venom siap membantu dengan penalaran tajam. Kamu bisa menanyakan seputar:\n- Keahlian Mikrotik & Web Server Monic\n- Pengalaman PKL di PT Dwi Prima Rezeky (Kedisiplinan 80%)\n- Data lengkap & dewan guru SMK Bangun Nusa Bangsa\n- Portofolio Desain Grafis & Video Editing\n- Pencarian Google Terkini (Google Search Grounding)`;
      }

      appendChatMessage('ai', replyText, { toolResult });
      chatContext.push({ role: 'model', content: replyText });
      speakText(replyText.substring(0, 180));
    }, 450);
  }

  function setupAiWidget() {
    const toggleBtn = document.getElementById('ai-avatar-toggle');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('ai-close-btn');
    const sendBtn = document.getElementById('ai-send-btn');
    const inputField = document.getElementById('ai-user-input');
    const settingsToggleBtn = document.getElementById('ai-settings-toggle-btn');
    const settingsDrawer = document.getElementById('ai-settings-drawer');
    const customKeyInput = document.getElementById('custom-gemini-key');
    const saveKeyBtn = document.getElementById('save-api-key-btn');

    // Restore saved API Key
    if (customKeyInput) {
      customKeyInput.value = localStorage.getItem('monic_gemini_key') || '';
    }

    if (settingsToggleBtn && settingsDrawer) {
      settingsToggleBtn.addEventListener('click', () => {
        settingsDrawer.classList.toggle('hidden');
        playBlipSound();
      });
    }

    if (saveKeyBtn && customKeyInput) {
      saveKeyBtn.addEventListener('click', () => {
        const key = customKeyInput.value.trim();
        if (key) {
          localStorage.setItem('monic_gemini_key', key);
          alert('Kunci API Gemini tersimpan di browser! Fitur Google Search Grounding siap digunakan.');
        } else {
          localStorage.removeItem('monic_gemini_key');
          alert('Kunci API kustom dihapus. Menggunakan kunci dari .env server.');
        }
        if (settingsDrawer) settingsDrawer.classList.add('hidden');
      });
    }

    if (toggleBtn && chatWindow) {
      toggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        playBlipSound();
      });
    }

    if (closeBtn && chatWindow) {
      closeBtn.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
      });
    }

    // Quick query buttons
    const queryButtons = document.querySelectorAll('.ai-quick-query');
    queryButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-query');
        handleAiQuestion(type);
      });
    });

    // Form submit
    function submitAiInput() {
      if (!inputField) return;
      const val = inputField.value.trim();
      if (val) {
        handleAiQuestion('custom', val);
        inputField.value = '';
      }
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', submitAiInput);
    }
    if (inputField) {
      inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          submitAiInput();
        }
      });
    }

    // Initial greeting modal / speech after 1.8 seconds
    setTimeout(() => {
      const greetingBubble = document.getElementById('ai-greeting-bubble');
      if (greetingBubble) {
        greetingBubble.classList.remove('hidden');
        speakText('Halo! Selamat datang di Website Symbiote Tech Hub Monica Kartika Indah Riyanti! Saya adalah Asisten Venom.');
        setTimeout(() => {
          greetingBubble.classList.add('hidden');
        }, 8000);
      }
    }, 1800);
  }

  // ==========================================================================
  // INTERACTIVE MIKROTIK TERMINAL SIMULATOR
  // ==========================================================================
  const terminalCommands = {
    help: `Daftar perintah RouterOS yang tersedia:
- /ip address print       : Tampilkan konfigurasi IP address interface
- /ip route print         : Tampilkan tabel routing dinamis & statis
- /ip firewall nat print  : Tampilkan aturan NAT Masquerade & Port Forward
- /queue simple print     : Tampilkan alokasi bandwidth QoS siswa & server
- /system resource print  : Tampilkan spesifikasi CPU, RAM, & Uptime Mikrotik
- /ping 8.8.8.8           : Uji konektivitas gateway ke Google Public DNS
- /venom status           : Cek status integrasi Symbiote AI Security
- clear                   : Bersihkan layar terminal`,

    'ip address print': `Flags: X - disabled, I - invalid, D - dynamic 
 #   ADDRESS            NETWORK         INTERFACE
 0   192.168.1.180/24   192.168.1.0     ether1-WAN-ISP
 1   10.20.30.1/24      10.20.30.0      ether2-LAN-SMK-BNB
 2   172.16.10.1/24     172.16.10.0     vlan10-WebServers
 3   10.100.0.1/24      10.100.0.0      wlan1-Hotspot-Monic`,

    'ip route print': `Flags: X - disabled, A - active, D - dynamic, C - connect, S - static, y - copy 
 #      DST-ADDRESS        PREF-SRC        GATEWAY            DISTANCE
 0 A S  0.0.0.0/0                          192.168.1.1        1
 1 ADC  10.20.30.0/24      10.20.30.1      ether2-LAN         0
 2 ADC  172.16.10.0/24     172.16.10.1     vlan10-WebServers  0
 3 ADC  192.168.1.0/24     192.168.1.180   ether1-WAN         0`,

    'ip firewall nat print': `Flags: X - disabled, I - invalid, D - dynamic 
 0    chain=srcnat action=masquerade out-interface=ether1-WAN-ISP log=no 
 1    chain=dstnat action=dst-nat to-addresses=172.16.10.80 to-ports=80 protocol=tcp in-interface=ether1-WAN dst-port=80 
 2    chain=dstnat action=dst-nat to-addresses=172.16.10.80 to-ports=443 protocol=tcp in-interface=ether1-WAN dst-port=443`,

    'queue simple print': `Flags: X - disabled, I - invalid 
 0    name="Web-Server-Priority" target=172.16.10.80/32 max-limit=100M/100M priority=1/1 
 1    name="Lab-TKJ-SMK-BNB" target=10.20.30.0/24 max-limit=50M/50M priority=3/3 
 2    name="Hotspot-Students" target=10.100.0.0/24 max-limit=20M/20M priority=5/5`,

    'system resource print': `                   uptime: 42d 18h 33m 12s
                  version: 7.14.3 (stable)
               build-time: 2026-03-12 10:24:00
         factory-software: 7.6
              free-memory: 894.2MiB
             total-memory: 1024.0MiB
                      cpu: ARMv7 4-Core
                cpu-count: 4
            cpu-frequency: 1400MHz
                 cpu-load: 8%
           free-hdd-space: 412.8MiB
          total-hdd-space: 512.0MiB
  architecture-name: arm
               board-name: RB4011iGS+5HacQ2HnD-IN`,

    'ping 8.8.8.8': `SEQ HOST                                     SIZE TTL TIME  STATUS
  0 8.8.8.8                                    56  117 12ms 
  1 8.8.8.8                                    56  117 11ms 
  2 8.8.8.8                                    56  117 13ms 
  3 8.8.8.8                                    56  117 12ms 
  sent=4 received=4 packet-loss=0% min-rtt=11ms avg-rtt=12ms max-rtt=13ms`,

    'venom status': `[+] SYMBIOTE AI CYBER DEFENSE CORE: ONLINE
[+] HOST: MONICA KARTIKA INDAH RIYANTI (MONIC) - 12 TKJ SMK BANGUN NUSA BANGSA
[+] INTERNSHIP LINK: PT DWI PRIMA REZEKY [VERIFIED]
[+] WE ARE VENOM: Active threat mitigation enabled. Firewall packets quarantined: 0 threats.`
  };

  function setupTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    if (!input || !output) return;

    function executeCommand(rawCmd) {
      const cmd = rawCmd.trim().toLowerCase().replace(/^\//, '');
      const line = document.createElement('div');
      line.className = 'mb-1';
      line.innerHTML = `<span class="text-cyan-400 font-bold">[monic@SMK-BNB] &gt;</span> <span class="text-white">${rawCmd}</span>`;
      output.appendChild(line);

      if (cmd === 'clear') {
        output.innerHTML = '';
        return;
      }

      const res = terminalCommands[cmd] || terminalCommands[rawCmd.trim().toLowerCase()];
      const responseEl = document.createElement('div');
      responseEl.className = 'text-slate-300 whitespace-pre font-mono text-xs mb-3 text-cyan-200/90';

      if (res) {
        responseEl.textContent = res;
      } else if (cmd === '') {
        // Empty command
      } else {
        responseEl.className = 'text-red-400 font-mono text-xs mb-3';
        responseEl.textContent = `bad command name '${rawCmd}' (ketik 'help' untuk daftar perintah)`;
      }

      output.appendChild(responseEl);
      output.scrollTop = output.scrollHeight;
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = input.value;
        input.value = '';
        executeCommand(val);
        playBlipSound();
      }
    });

    // Quick Command Badges
    const quickCmds = document.querySelectorAll('.terminal-quick-cmd');
    quickCmds.forEach((chip) => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        executeCommand(cmd);
        playBlipSound();
      });
    });
  }

  // ==========================================================================
  // SYMBIOTE TKJ NETWORK & SERVER REPOSITORY DATABASE
  // ==========================================================================
  function setupDatabaseModal() {
    const dbModal = document.getElementById('symbiote-database-modal');
    const openBtns = document.querySelectorAll('.open-db-btn');
    const closeBtn = document.getElementById('close-db-btn');
    const searchInput = document.getElementById('db-search-input');
    const filterBtns = document.querySelectorAll('.db-filter-btn');
    const copyBtns = document.querySelectorAll('.db-copy-ip-btn');
    const rows = document.querySelectorAll('.db-row');

    if (!dbModal) return;

    openBtns.forEach((b) => {
      b.addEventListener('click', (e) => {
        e.preventDefault();
        dbModal.classList.add('active');
        playBlipSound();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        dbModal.classList.remove('active');
      });
    }

    dbModal.addEventListener('click', (e) => {
      if (e.target === dbModal) {
        dbModal.classList.remove('active');
      }
    });

    // Real-time search filter
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        rows.forEach((row) => {
          const searchable = (row.getAttribute('data-search') || '').toLowerCase();
          const text = row.innerText.toLowerCase();
          if (query === '' || searchable.includes(query) || text.includes(query)) {
            row.style.display = 'flex';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }

    // Category filter buttons
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.className = 'db-filter-btn px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-400';
        });
        btn.className = 'db-filter-btn px-2.5 py-1 rounded bg-cyan-500 text-black font-bold';

        const filter = btn.getAttribute('data-filter');
        rows.forEach((row) => {
          const cat = row.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            row.style.display = 'flex';
          } else {
            row.style.display = 'none';
          }
        });
        playBlipSound();
      });
    });

    // Copy IP buttons
    copyBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ip = btn.getAttribute('data-ip');
        if (ip && navigator.clipboard) {
          navigator.clipboard.writeText(ip);
          const origText = btn.textContent;
          btn.textContent = 'Tersalin!';
          btn.classList.add('text-emerald-400');
          playBlipSound();
          setTimeout(() => {
            btn.textContent = origText;
            btn.classList.remove('text-emerald-400');
          }, 1500);
        }
      });
    });
  }

  // ==========================================================================
  // SOUND TOGGLE
  // ==========================================================================
  function setupSoundToggle() {
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (!soundBtn) return;

    soundBtn.addEventListener('click', () => {
      isSoundMuted = !isSoundMuted;
      if (isSoundMuted) {
        soundBtn.innerHTML = `
          <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
          <span class="text-xs text-red-400 font-bold">Muted</span>
        `;
      } else {
        initAudio();
        playBlipSound();
        soundBtn.innerHTML = `
          <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <span class="text-xs text-cyan-400 font-bold">Audio ON</span>
        `;
      }
    });
  }

  // ==========================================================================
  // LIVE WEB SERVER METRICS OSCILLATOR
  // Dynamic tick for CPU, RAM, and simulated network traffic
  // ==========================================================================
  function setupServerMetrics() {
    const cpuBar = document.getElementById('metric-cpu-bar');
    const cpuText = document.getElementById('metric-cpu-text');
    const ramText = document.getElementById('metric-ram-text');
    const reqText = document.getElementById('metric-req-text');

    let reqCount = 14280;

    setInterval(() => {
      if (cpuBar && cpuText) {
        const cpuVal = Math.floor(6 + Math.random() * 14);
        cpuBar.style.width = `${cpuVal * 3}%`;
        cpuText.textContent = `${cpuVal}%`;
      }
      if (ramText) {
        const ramVal = (412 + Math.floor(Math.random() * 18)).toString();
        ramText.textContent = `${ramVal} MB / 1024 MB`;
      }
      if (reqText) {
        reqCount += Math.floor(1 + Math.random() * 5);
        reqText.textContent = `${reqCount.toLocaleString()} reqs`;
      }
    }, 2200);
  }

  // ==========================================================================
  // INITIALIZATION ON DOM READY
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    setupKelindesTriggers();
    initWalkingChibi();
    setupAiWidget();
    setupTerminal();
    setupDatabaseModal();
    setupSoundToggle();
    setupServerMetrics();
    console.log('⚡ VENOM X MONICA (MONIC) TECH HUB LOADED SUCCESSFULLY! ⚡');
  });

})();
