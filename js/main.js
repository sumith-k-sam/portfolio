/**
 * DevOps Portfolio - Main Orchestrator & UI Controller
 * Author: Sumith K Sam
 */

(function () {
  'use strict';

  // Sound Engine (Web Audio API Synthesizer - zero external files needed)
  let audioEnabled = false;
  let audioCtx = null;

  function playTone(freq, type, duration) {
    if (!audioEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not supported or blocked
    }
  }

  /* --------------------------------------------------------------------------
     1. Toast Notification System
     -------------------------------------------------------------------------- */
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span style="color: var(--accent-green); font-weight: bold;">[OK]</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    playTone(520, 'triangle', 0.12);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  /* --------------------------------------------------------------------------
     2. Simulated Linux Boot Sequence
     -------------------------------------------------------------------------- */
  function initBootSequence() {
    const bootScreen = document.getElementById('boot-screen');
    const logContainer = document.getElementById('boot-log-container');
    const progressBar = document.getElementById('boot-progress-bar');
    const skipBtn = document.getElementById('boot-skip-btn');

    if (!bootScreen) return;

    // Check if user already booted this session
    const hasBooted = sessionStorage.getItem('devops_portfolio_booted');
    if (hasBooted === 'true') {
      bootScreen.classList.add('boot-finished');
      if (window.DevOpsAnimations && window.DevOpsAnimations.triggerHeroTyping) {
        window.DevOpsAnimations.triggerHeroTyping();
      }
      return;
    }

    const bootMessages = [
      { tag: 'INFO', type: 'info', text: 'Initializing DevOps Kernel 6.8.0-devops (x86_64)...' },
      { tag: 'OK', type: 'ok', text: 'Mounted /sys/fs/cgroup system filesystem.' },
      { tag: 'OK', type: 'ok', text: 'Initializing DevOps Environment (v2.4.0-prod)' },
      { tag: 'OK', type: 'ok', text: 'Loading Infrastructure Modules: AWS, Terraform, Docker, K8s' },
      { tag: 'OK', type: 'ok', text: 'Connecting to Cloud Services: us-east-1, eu-central-1' },
      { tag: 'OK', type: 'ok', text: 'Starting Monitoring Services: Prometheus v2.51 & Grafana v10.4' },
      { tag: 'OK', type: 'ok', text: 'Initializing Service Mesh & Network Topology Lab' },
      { tag: 'OK', type: 'ok', text: 'Configuring interactive terminal shell (root@sumith:~$)' },
      { tag: 'OK', type: 'ok', text: 'Portfolio System Ready. Launching Digital Workspace...' }
    ];

    let currentMsgIndex = 0;

    function finishBoot() {
      sessionStorage.setItem('devops_portfolio_booted', 'true');
      bootScreen.classList.add('boot-finished');
      playTone(880, 'sine', 0.2);
      if (window.DevOpsAnimations && window.DevOpsAnimations.triggerHeroTyping) {
        window.DevOpsAnimations.triggerHeroTyping();
      }
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', finishBoot);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.code === 'Space') {
        if (!bootScreen.classList.contains('boot-finished')) {
          finishBoot();
        }
      }
    });

    const bootInterval = setInterval(() => {
      if (currentMsgIndex < bootMessages.length) {
        const item = bootMessages[currentMsgIndex];
        const line = document.createElement('div');
        line.className = 'boot-line';
        line.innerHTML = `<span class="boot-tag ${item.type}">[ ${item.tag} ]</span><span class="boot-msg">${item.text}</span>`;
        if (logContainer) {
          logContainer.appendChild(line);
          logContainer.scrollTop = logContainer.scrollHeight;
        }

        playTone(320 + currentMsgIndex * 40, 'sine', 0.04);

        currentMsgIndex++;
        const pct = Math.round((currentMsgIndex / bootMessages.length) * 100);
        if (progressBar) progressBar.style.width = pct + '%';
      } else {
        clearInterval(bootInterval);
        setTimeout(finishBoot, 400);
      }
    }, 240);
  }

  /* --------------------------------------------------------------------------
     3. Top Status Bar Real-Time Clock & Telemetry
     -------------------------------------------------------------------------- */
  function initClock() {
    const clockEl = document.getElementById('live-utc-clock');
    if (!clockEl) return;

    function update() {
      const d = new Date();
      const utcString = d.toUTCString().replace('GMT', 'UTC');
      clockEl.textContent = utcString;
    }
    update();
    setInterval(update, 1000);
  }

  /* --------------------------------------------------------------------------
     4. Theme Toggle (Dark / Light)
     -------------------------------------------------------------------------- */
  function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) return;

    const savedTheme = localStorage.getItem('sumith_devops_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeBtn.innerHTML = savedTheme === 'dark' ? '☀️ Light' : '🌙 Dark';

    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const target = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', target);
      localStorage.setItem('sumith_devops_theme', target);
      themeBtn.innerHTML = target === 'dark' ? '☀️ Light' : '🌙 Dark';
      showToast(`Interface switched to ${target} mode`);
    });
  }

  /* --------------------------------------------------------------------------
     5. Audio Synthesis Toggle
     -------------------------------------------------------------------------- */
  function initAudioToggle() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (!audioBtn) return;

    audioBtn.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      audioBtn.innerHTML = audioEnabled ? '🔊 Audio: ON' : '🔇 Audio: OFF';
      audioBtn.style.color = audioEnabled ? 'var(--accent-green)' : 'var(--text-muted)';
      if (audioEnabled) {
        playTone(660, 'sine', 0.15);
        showToast('Synthesizer sound enabled');
      } else {
        showToast('Audio muted');
      }
    });
  }

  /* --------------------------------------------------------------------------
     6. Navigation & Scroll Tracking
     -------------------------------------------------------------------------- */
  function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Mobile Hamburger
    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });

      // Close on link click
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
        });
      });
    }

    // Scroll Progress Bar & Back to top button
    const scrollProgressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (scrollProgressBar) {
        scrollProgressBar.style.width = progress + '%';
      }

      if (backToTopBtn) {
        if (scrollTop > 450) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Active link highlighting via IntersectionObserver
    if ('IntersectionObserver' in window && sections.length) {
      const navObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const currentId = entry.target.getAttribute('id');
              navLinks.forEach((link) => {
                const href = link.getAttribute('href');
                if (href === '#' + currentId) {
                  link.classList.add('active');
                } else {
                  link.classList.remove('active');
                }
              });
            }
          });
        },
        { rootMargin: '-20% 0px -70% 0px' }
      );

      sections.forEach((s) => navObserver.observe(s));
    }
  }

  /* --------------------------------------------------------------------------
     7. Technical Notes / Documentation Modal Viewer
     -------------------------------------------------------------------------- */
  const documentationData = {
    'linux-admin': {
      title: 'Linux Systems Administration & Hardening',
      desc: 'Essential Linux system administration, networking commands, and security configurations.',
      code: `# 1. Process & Resource Inspection
top -b -n 1 | head -n 20
htop
ss -tulwnp          # Modern socket status (replaces netstat)
vmstat 1 5          # Virtual memory stats

# 2. Disk & Inode Diagnostics
df -h               # Filesystem disk space
df -i               # Inode capacity
du -ah /var/log | sort -rh | head -n 10

# 3. Systemd Service Management
systemctl daemon-reload
systemctl status nginx --no-pager
journalctl -u nginx -e --no-pager
journalctl --vacuum-size=500M`
    },
    'docker-commands': {
      title: 'Docker Commands & Multi-Stage Optimization',
      desc: 'Common Docker lifecycle commands, container hygiene, and optimization techniques.',
      code: `# 1. Container Lifecycle
docker run -d --name web-api -p 8080:80 --restart unless-stopped my-app:latest
docker logs -f --tail 100 web-api
docker exec -it web-api /bin/sh

# 2. Pruning & Reclaiming Storage
docker system df
docker container prune -f
docker image prune -a --filter "until=72h"

# 3. Multi-Stage Build Snippet
# syntax=docker/dockerfile:1
FROM golang:1.22-alpine AS build
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-w -s" -o /bin/app

FROM scratch
COPY --from=build /bin/app /bin/app
ENTRYPOINT ["/bin/app"]`
    },
    'kubernetes-basics': {
      title: 'Kubernetes (K8s) Production Cheatsheet',
      desc: 'Crucial kubectl diagnostic commands and manifest structures.',
      code: `# 1. Cluster Status & Nodes
kubectl get nodes -o wide
kubectl top nodes
kubectl top pods -A

# 2. Pod Debugging
kubectl describe pod <pod-name> -n production
kubectl logs <pod-name> -c <container-name> --previous
kubectl exec -it <pod-name> -- /bin/sh

# 3. Rolling Updates & Autoscaling
kubectl rollout status deployment/api-service
kubectl rollout undo deployment/api-service
kubectl autoscale deployment api-service --min=3 --max=10 --cpu-percent=75`
    },
    'jenkins-pipeline': {
      title: 'Jenkins Declarative Pipeline Patterns',
      desc: 'Robust Jenkinsfile pipelines with parallel stages, SonarQube gates, and post actions.',
      code: `pipeline {
    agent { label 'docker-runner' }
    options {
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
    }
    stages {
        stage('Parallel Tests') {
            parallel {
                stage('Unit Tests') {
                    steps { sh 'npm test' }
                }
                stage('Security Audit') {
                    steps { sh 'trivy fs .' }
                }
            }
        }
    }
    post {
        always { cleanWs() }
        failure { echo "Build failed! Alerting team via webhook." }
    }
}`
    },
    'aws-deployment': {
      title: 'AWS Cloud Architecture & Security Best Practices',
      desc: 'VPC design, IAM least privilege policies, and AWS CLI automation.',
      code: `# 1. Query EC2 Instances via AWS CLI
aws ec2 describe-instances \\
  --filters "Name=instance-state-name,Values=running" \\
  --query "Reservations[*].Instances[*].[InstanceId,PrivateIpAddress,PublicIpAddress]" \\
  --output table

# 2. S3 Bucket Lifecycle Policy Sync
aws s3api put-bucket-lifecycle-configuration \\
  --bucket my-prod-logs-bucket \\
  --lifecycle-configuration file://lifecycle.json

# 3. Security Check
aws iam get-account-summary`
    },
    'terraform-fundamentals': {
      title: 'Terraform Fundamentals & State Management',
      desc: 'Remote backend setup, state locking with DynamoDB, and modular IaC workflows.',
      code: `# Core Terraform Workflow
terraform init -upgrade
terraform fmt -recursive
terraform validate
terraform plan -out=tfplan
terraform apply tfplan

# State Inspection & Targeted Operations
terraform state list
terraform state show module.vpc.aws_subnet.private[0]
terraform refresh`
    },
    'prometheus-monitoring': {
      title: 'Prometheus & Grafana Observability',
      desc: 'PromQL queries, Alertmanager configuration, and scrape definitions.',
      code: `# PromQL Useful Queries:
# 1. 5-minute CPU usage percentage per instance:
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# 2. Available Memory percentage:
(node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100

# 3. HTTP 5xx error rate over 5m:
sum(rate(http_requests_total{status=~"5.."}[5m]))
  /
sum(rate(http_requests_total[5m])) * 100`
    },
    'bash-automation': {
      title: 'Defensive Bash Scripting & System Automation',
      desc: 'Best practices for writing robust, fail-safe infrastructure automation scripts.',
      code: `#!/usr/bin/env bash
# Strict mode: exit on error, undefined vars, pipeline fails
set -euo pipefail
IFS=$'\\n\\t'

readonly LOG_FILE="/var/log/backup_service.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

trap 'log "ERROR occurred on line $LINENO. Exiting."' ERR

log "Starting automated backup procedure..."
# ... backup operations ...
log "Backup finished successfully."`
    }
  };

  function initDocumentationModal() {
    const docCards = document.querySelectorAll('.doc-card');
    const modalOverlay = document.getElementById('doc-modal');
    const modalTitle = document.getElementById('doc-modal-title');
    const modalBody = document.getElementById('doc-modal-body');
    const modalClose = document.getElementById('doc-modal-close');

    if (!docCards.length || !modalOverlay) return;

    docCards.forEach((card) => {
      card.addEventListener('click', () => {
        const docKey = card.getAttribute('data-doc-key');
        const doc = documentationData[docKey];
        if (!doc) return;

        modalTitle.innerHTML = `<span style="color: var(--accent-green);">[DOCS]</span> ${doc.title}`;
        modalBody.innerHTML = `
          <p style="color: var(--text-secondary); margin-bottom: 16px;">${doc.desc}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 0.75rem; color: var(--accent-cyan); font-family: var(--font-mono);">TERMINAL / CODE REFERENCE:</span>
            <button id="doc-copy-btn" class="copy-btn" style="font-size: 0.75rem;">Copy Commands</button>
          </div>
          <div style="background: #04070c; border: 1px solid var(--border-subtle); border-radius: 4px; padding: 18px; max-height: 380px; overflow-y: auto;">
            <pre style="color: #85e89d; font-size: 0.82rem; margin: 0; font-family: var(--font-mono); line-height: 1.5;">${escapeHtml(doc.code)}</pre>
          </div>
        `;

        const copyBtn = document.getElementById('doc-copy-btn');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(doc.code).then(() => {
              copyBtn.textContent = 'Copied!';
              setTimeout(() => (copyBtn.textContent = 'Copy Commands'), 2000);
            });
          });
        }

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeDocModal() {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeDocModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeDocModal();
    });
  }

  /* --------------------------------------------------------------------------
     8. Contact Form Handling & Copy Buttons
     -------------------------------------------------------------------------- */
  function initContactSection() {
    // Copy email button
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', () => {
        const email = 'sumithksam.devops@example.com';
        navigator.clipboard.writeText(email).then(() => {
          showToast('Email address copied to clipboard!');
          copyEmailBtn.textContent = 'Copied!';
          setTimeout(() => (copyEmailBtn.textContent = 'Copy Address'), 2200);
        });
      });
    }
  }

  /* --------------------------------------------------------------------------
     9. Global Keyboard Shortcut (` or ~ to focus terminal)
     -------------------------------------------------------------------------- */
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === '`' || e.key === '~') {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          const termSection = document.getElementById('terminal');
          const cliInput = document.getElementById('cli-input');
          if (termSection) {
            termSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
              if (cliInput) cliInput.focus();
            }, 300);
          }
        }
      }
    });
  }

  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /* --------------------------------------------------------------------------
     Bootstrap All Modules
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initBootSequence();
    initClock();
    initThemeToggle();
    initAudioToggle();
    initNavigation();
    initDocumentationModal();
    initContactSection();
    initKeyboardShortcuts();

    if (window.DevOpsAnimations) window.DevOpsAnimations.init();
    if (window.DevOpsProjects) window.DevOpsProjects.init();
    if (window.DevOpsLab) window.DevOpsLab.init();
    if (window.DevOpsTerminal) window.DevOpsTerminal.init();
    if (window.DevOpsTroubleshooting) window.DevOpsTroubleshooting.init();
  });

  // Global exposure
  window.DevOpsMain = {
    showToast: showToast,
    playTone: playTone
  };
})();

