/**
 * DevOps Portfolio - Interactive Infrastructure / Network Lab
 * Author: Sumith K Sam
 */

(function () {
  'use strict';

  const nodesData = {
    developer: {
      name: 'Developer Workstation',
      badge: 'SOURCE',
      status: 'READY',
      uptime: '14d 6h',
      metrics: {
        'Branch': 'main',
        'Commit': 'git commit -m "feat(api): optimize cache"',
        'GPG Signature': 'Verified (RSA-4096)',
        'Pre-commit Hook': 'Passed (100%)'
      },
      desc: 'Local workstation configured with pre-commit linters, Git signing keys, and automated test runners.',
      logs: [
        '[00:00:01] Git stage: 4 modified files indexed',
        '[00:00:02] Running pre-commit hooks: eslint, black, terraform_validate',
        '[00:00:03] Hooks clean. Pushing HEAD to origin/main'
      ]
    },
    github: {
      name: 'GitHub Repository',
      badge: 'VCS & WEBHOOKS',
      status: 'SYNCED',
      uptime: '99.99%',
      metrics: {
        'Repo': 'sumithksam/core-infrastructure',
        'Active PRs': '0 pending',
        'Webhook': 'POST /github-webhook/ -> 200 OK',
        'Protection': 'Enforced (Require 1 review)'
      },
      desc: 'Central Git repository enforcing branch protections, semantic version tags, and instant webhook dispatches to Jenkins.',
      logs: [
        '[00:00:04] GitHub payload received on branch refs/heads/main',
        '[00:00:05] Webhook dispatched to Jenkins CI listener at endpoint /jenkins',
        '[00:00:06] Status check registered: continuous-integration/jenkins/pr'
      ]
    },
    jenkins: {
      name: 'Jenkins CI/CD Engine',
      badge: 'AUTOMATION PIPELINE',
      status: 'PROCESSING',
      uptime: '42d 18h',
      metrics: {
        'Pipeline': 'Declarative Jenkinsfile',
        'Executors': '4/8 active',
        'SonarQube Gate': 'Passed (Coverage: 88.4%)',
        'Trivy Security': '0 Critical / 0 High'
      },
      desc: 'Distributed CI/CD controller orchestrating automated multi-branch builds, automated unit/integration tests, and container vulnerability scans.',
      logs: [
        '[00:00:07] Jenkins Agent #2 spawned via Kubernetes cloud plugin',
        '[00:00:08] Stage [Checkout]: fetched commit b4a71f0',
        '[00:00:10] Stage [Code Analysis]: SonarQube quality gate PASSED',
        '[00:00:12] Stage [Trivy Scan]: zero critical CVE vulnerabilities detected'
      ]
    },
    docker: {
      name: 'Docker Build & Registry',
      badge: 'CONTAINERIZATION',
      status: 'OPTIMIZED',
      uptime: '99.95%',
      metrics: {
        'Base Image': 'alpine:3.19 (12.4MB)',
        'Image Tag': 'api-service:v2.4.1',
        'Layers': '4 multi-stage cached',
        'Registry': 'Secure ECR / DockerHub'
      },
      desc: 'Builds hardened, non-root OCI container images using BuildKit caching and pushes signed images to container registry.',
      logs: [
        '[00:00:13] Docker BuildKit activated for multi-stage Dockerfile',
        '[00:00:15] Stripped development dependencies; total size: 112MB',
        '[00:00:17] Pushing digest sha256:7f42c8d to private registry'
      ]
    },
    kubernetes: {
      name: 'Kubernetes Cluster (K8s)',
      badge: 'ORCHESTRATION',
      status: 'HEALTHY',
      uptime: '180d 12h',
      metrics: {
        'Active Pods': '6 / 6 Running',
        'Cluster CPU': '22% utilized',
        'Memory': '3.4GB / 16GB',
        'HPA Target': 'CPU < 70% (Auto-scale 3..12)'
      },
      desc: 'Production cluster orchestrating rolling updates, zero-downtime traffic shifts, and health liveness/readiness probes.',
      logs: [
        '[00:00:18] Deployment rollout started: api-service-deployment',
        '[00:00:20] Pod api-service-86b7c59-xk9pl: Running [1/1]',
        '[00:00:22] Readiness probe succeeded: HTTP GET /healthz 200 OK',
        '[00:00:24] Zero-downtime rolling update completed successfully'
      ]
    },
    aws: {
      name: 'AWS Cloud Infrastructure',
      badge: 'CLOUD PLATFORM',
      status: 'DEPLOYED',
      uptime: '99.999%',
      metrics: {
        'Region': 'us-east-1 (N. Virginia)',
        'VPC': '10.0.0.0/16 (2 AZs)',
        'ALB Target': 'Healthy (Latency: 14ms)',
        'IaC State': 'Terraform Managed (Locked)'
      },
      desc: 'Multi-AZ AWS architecture with Application Load Balancer, isolated private subnets, NAT Gateways, and Auto Scaling groups.',
      logs: [
        '[00:00:25] ALB target group registered new pod IP endpoints',
        '[00:00:26] Synthetic health checks returning HTTP 200 via Route 53',
        '[00:00:27] CloudWatch monitoring alarms in state OK'
      ]
    },
    prometheus: {
      name: 'Prometheus & Grafana',
      badge: 'OBSERVABILITY',
      status: 'MONITORING',
      uptime: '99.98%',
      metrics: {
        'Scrape Interval': '15s (100% success)',
        'Active Metrics': '14,820 series',
        'Alertmanager': '0 firing / 0 silenced',
        'Grafana SLA': '99.99% Availability'
      },
      desc: 'Unified monitoring suite collecting node, container, and application metrics with real-time Grafana dashboard visualization and Alertmanager notifications.',
      logs: [
        '[00:00:28] Prometheus scraped targets: node_exporter & cAdvisor',
        '[00:00:29] Grafana SLA dashboard refreshed: 99.99% uptime',
        '[00:00:30] All system metrics normal. No alerts triggered.'
      ]
    }
  };

  let currentNodeId = 'jenkins';
  let isSimulating = false;

  /* --------------------------------------------------------------------------
     Inspector Update
     -------------------------------------------------------------------------- */
  function updateInspector(nodeId) {
    const node = nodesData[nodeId];
    if (!node) return;

    currentNodeId = nodeId;

    // Highlight active node in SVG
    document.querySelectorAll('.topo-node').forEach((el) => {
      el.classList.toggle('active', el.getAttribute('data-node-id') === nodeId);
    });

    const titleEl = document.getElementById('inspector-node-title');
    const badgeEl = document.getElementById('inspector-node-badge');
    const descEl = document.getElementById('inspector-node-desc');
    const metricsContainer = document.getElementById('inspector-metrics');
    const logsContainer = document.getElementById('inspector-logs');

    if (titleEl) titleEl.textContent = node.name;
    if (badgeEl) {
      badgeEl.textContent = node.badge;
      badgeEl.className = 'inspector-badge ' + (node.status === 'CRITICAL' ? 'pulse-red' : 'pulse-green');
    }
    if (descEl) descEl.textContent = node.desc;

    if (metricsContainer) {
      metricsContainer.innerHTML = '';
      for (const [key, val] of Object.entries(node.metrics)) {
        const row = document.createElement('div');
        row.className = 'inspector-metric-row';
        row.innerHTML = `<span class="metric-label">${key}</span><span class="metric-val">${val}</span>`;
        metricsContainer.appendChild(row);
      }
    }

    if (logsContainer) {
      logsContainer.innerHTML = '';
      node.logs.forEach((log) => {
        const entry = document.createElement('div');
        entry.className = 'log-entry info';
        entry.textContent = log;
        logsContainer.appendChild(entry);
      });
      logsContainer.scrollTop = logsContainer.scrollHeight;
    }
  }

  /* --------------------------------------------------------------------------
     Deploy Simulation Flow
     -------------------------------------------------------------------------- */
  function runDeploySimulation() {
    if (isSimulating) return;
    isSimulating = true;

    const deployBtn = document.getElementById('lab-btn-deploy');
    if (deployBtn) {
      deployBtn.disabled = true;
      deployBtn.textContent = 'Deploying...';
    }

    const steps = ['developer', 'github', 'jenkins', 'docker', 'kubernetes', 'aws', 'prometheus'];
    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const stageId = steps[stepIndex];
        updateInspector(stageId);

        // Highlight active step line
        const packetDot = document.getElementById('anim-packet-dot');
        if (packetDot) {
          packetDot.setAttribute('cx', 100 + stepIndex * 95);
          packetDot.style.opacity = '1';
        }

        stepIndex++;
      } else {
        clearInterval(interval);
        isSimulating = false;
        if (deployBtn) {
          deployBtn.disabled = false;
          deployBtn.textContent = 'Trigger Deploy Simulation';
        }
        if (window.DevOpsMain && window.DevOpsMain.showToast) {
          window.DevOpsMain.showToast('CI/CD Pipeline Run #241 finished with SUCCESS!');
        }
      }
    }, 900);
  }

  /* --------------------------------------------------------------------------
     Traffic Spike Simulation
     -------------------------------------------------------------------------- */
  function simulateTrafficSpike() {
    updateInspector('kubernetes');
    const logsContainer = document.getElementById('inspector-logs');
    if (logsContainer) {
      const entry1 = document.createElement('div');
      entry1.className = 'log-entry warn';
      entry1.textContent = '[ALERT] Ingress request rate surged to 12,500 req/sec!';
      logsContainer.appendChild(entry1);

      const entry2 = document.createElement('div');
      entry2.className = 'log-entry success';
      entry2.textContent = '[HPA] Scaling Deployment "api-service" from 3 to 10 replicas.';
      logsContainer.appendChild(entry2);

      logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    if (window.DevOpsMain && window.DevOpsMain.showToast) {
      window.DevOpsMain.showToast('Traffic spike injected! Kubernetes HPA scaled replicas to 10.');
    }
  }

  /* --------------------------------------------------------------------------
     Reset State
     -------------------------------------------------------------------------- */
  function resetLab() {
    updateInspector('developer');
    const packetDot = document.getElementById('anim-packet-dot');
    if (packetDot) {
      packetDot.setAttribute('cx', 100);
      packetDot.style.opacity = '0.5';
    }
    if (window.DevOpsMain && window.DevOpsMain.showToast) {
      window.DevOpsMain.showToast('Architecture simulator reset to baseline state.');
    }
  }

  /* --------------------------------------------------------------------------
     Event Listeners Initialization
     -------------------------------------------------------------------------- */
  function initLab() {
    // Add click listeners to SVG topology nodes
    document.querySelectorAll('.topo-node').forEach((nodeEl) => {
      nodeEl.addEventListener('click', () => {
        const id = nodeEl.getAttribute('data-node-id');
        if (id) updateInspector(id);
      });
    });

    const deployBtn = document.getElementById('lab-btn-deploy');
    if (deployBtn) deployBtn.addEventListener('click', runDeploySimulation);

    const spikeBtn = document.getElementById('lab-btn-spike');
    if (spikeBtn) spikeBtn.addEventListener('click', simulateTrafficSpike);

    const resetBtn = document.getElementById('lab-btn-reset');
    if (resetBtn) resetBtn.addEventListener('click', resetLab);

    // Initial inspector load
    updateInspector('jenkins');
  }

  window.DevOpsLab = {
    init: initLab,
    inspectNode: updateInspector,
    runDeploy: runDeploySimulation
  };
})();

