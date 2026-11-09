/**
 * DevOps Portfolio - Projects Module & Interactive Modal Viewer
 * Author: Sumith K Sam
 */

(function () {
  'use strict';

  const projectsData = [
    {
      id: 'gitops-ml-inference',
      title: 'GitOps & DevSecOps Platform for ML Inference Microservices',
      shortDesc: 'Built an automated GitOps delivery pipeline deploying containerized FastAPI ML microservices to a Kubernetes cluster. Integrated Bandit and Safety into Jenkins CI for automated vulnerability scanning, with ArgoCD automating rolling deployments upon manifest updates.',
      techStack: ['FastAPI', 'Docker', 'Kubernetes', 'Jenkins', 'ArgoCD', 'MLflow', 'Python', 'Linux'],
      archAscii: `[Developer Push] ──> [GitHub / GitLab]
                           │ (Webhook)
                   [Jenkins CI Pipeline]
            ┌──────────────┼──────────────┐
     [Bandit SAST]   [Safety Audit]  [Docker Build]
            └──────────────┼──────────────┘
                           │ (Push Image & Tag Manifest)
                   [GitOps Config Repo]
                           │ (Sync)
                      [ArgoCD]
                           │ (Rolling Deploy)
              [Kubernetes Cluster (Pods)]
                           │
                 [FastAPI ML Inference]`,
      githubUrl: 'https://github.com/sumithksam/gitops-devsecops-ml-platform',
      demoUrl: '#',
      category: 'gitops',
      details: {
        problemStatement: 'Deploying ML inference microservices manually introduced security blind spots, package vulnerability risks, and configuration drift between staging and Kubernetes production clusters.',
        solution: 'Engineered an automated GitOps & DevSecOps delivery pipeline using Jenkins for continuous integration and automated security scanning (Bandit + Safety), coupled with ArgoCD for automated declarative synchronization to Kubernetes.',
        highlights: [
          'Automated Python SAST code security scanning with Bandit and dependency auditing with Safety in Jenkins.',
          'Containerized lightweight FastAPI inference services with optimized multi-stage Docker builds.',
          'Declarative GitOps continuous deployment using ArgoCD tracking Kubernetes manifest revisions.',
          'Zero-downtime rolling update strategy on Kubernetes ensuring continuous inference availability.',
          'MLflow model artifact management integrated into automated microservice packaging.'
        ],
        codeSnippetTitle: 'Jenkinsfile (GitOps & DevSecOps Pipeline)',
        codeSnippet: `pipeline {
    agent any
    environment {
        IMAGE_NAME = 'sumithksam/ml-inference-api'
        IMAGE_TAG = "\${env.BUILD_NUMBER}"
        GITOPS_REPO = 'https://github.com/sumithksam/gitops-k8s-manifests.git'
    }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Security Scan - SAST & Dependencies') {
            steps {
                sh 'bandit -r app/ -f json -o bandit-report.json || true'
                sh 'safety check --full-report'
            }
        }
        stage('Docker Build & Scan') {
            steps {
                sh "docker build -t \${IMAGE_NAME}:\${IMAGE_TAG} ."
                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL \${IMAGE_NAME}:\${IMAGE_TAG}"
            }
        }
        stage('Push to Registry') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo \${DOCKER_PASS} | docker login -u \${DOCKER_USER} --password-stdin"
                    sh "docker push \${IMAGE_NAME}:\${IMAGE_TAG}"
                }
            }
        }
        stage('Update GitOps Manifest') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'git-credentials', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh """
                        git clone \${GITOPS_REPO} gitops-repo
                        cd gitops-repo/environments/prod
                        sed -i "s|image: \${IMAGE_NAME}:.*|image: \${IMAGE_NAME}:\${IMAGE_TAG}|g" deployment.yaml
                        git config user.name "Jenkins CI"
                        git config user.email "ci@sumith.devops"
                        git commit -am "chore(gitops): update ml-inference image to \${IMAGE_TAG}"
                        git push origin main
                    """
                }
            }
        }
    }
}`
      }
    },
    {
      id: 'terraform-ansible-infra',
      title: 'Infrastructure Automation using Terraform and Ansible',
      shortDesc: 'Automated cloud infrastructure deployment and server configuration on AWS using Terraform and Ansible. Provisioned EC2 instances with Terraform and configured them using Ansible playbooks, demonstrating an Infrastructure as Code (IaC) workflow.',
      techStack: ['Terraform', 'Ansible', 'AWS EC2', 'Linux', 'YAML', 'SSH'],
      archAscii: `[Terraform CLI]
       │ (terraform apply)
[AWS Cloud Provider]
       │
┌──────┴───────────────────────────┐
│ [VPC & Security Groups]          │
│   └──> [AWS EC2 Linux Instances] │
└──────────────────────────────────┘
       │ (Dynamic Inventory via SSH)
[Ansible Control Node]
       │ (playbook.yml)
┌──────┴───────────────────────────┐
│ ├── Baseline Security & Packages │
│ ├── Nginx Web Server Setup       │
│ └── Systemd Daemon Hardening     │
└──────────────────────────────────┘`,
      githubUrl: 'https://github.com/sumithksam/terraform-ansible-aws-automation',
      demoUrl: '#',
      category: 'iac',
      details: {
        problemStatement: 'Manual provisioning of cloud virtual machines and manual SSH server configuration caused environment drift, reproducibility issues, and operational configuration delays.',
        solution: 'Built a unified Infrastructure as Code (IaC) workflow using Terraform to provision AWS EC2 compute, security groups, and networking, followed by Ansible playbooks for automated server configuration and hardening.',
        highlights: [
          'Modular Terraform code provisioning AWS EC2 instances, subnets, and security groups declaratively.',
          'Remote state management and dynamic inventory generation for downstream Ansible execution.',
          'Idempotent Ansible playbooks handling package installations, system users, and service management.',
          'Automated SSH key management and firewall hardening (UFW/Iptables) across provisioned instances.',
          'Single-command infrastructure spin-up and teardown eliminating idle resource costs.'
        ],
        codeSnippetTitle: 'main.tf & configure-nodes.yml',
        codeSnippet: `# --- main.tf (Terraform AWS EC2 Provisioning) ---
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web_nodes" {
  count                  = 2
  ami                    = "ami-0c7217cdde317cfec" # Ubuntu 24.04 LTS
  instance_type          = "t3.medium"
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.web_sg.id]

  tags = {
    Name        = "prod-node-\${count.index + 1}"
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}

# --- configure-nodes.yml (Ansible Playbook) ---
- name: Configure Production Web Server Nodes
  hosts: all
  become: yes
  tasks:
    - name: Update apt cache and install baseline tools
      apt:
        name: [nginx, ufw, fail2ban, curl, htop]
        state: present
        update_cache: yes

    - name: Enable and configure UFW firewall
      ufw:
        state: enabled
        rule: allow
        port: "{{ item }}"
      loop: ['22', '80', '443']`
      }
    },
    {
      id: 'django-cicd-pipeline',
      title: 'CI/CD Pipeline for Django Application',
      shortDesc: 'Designed and implemented an automated CI/CD pipeline for a Django application using Jenkins. Containerized the application with Docker and deployed it on AWS EC2. Integrated SonarQube for automated code quality analysis. Implemented GitOps-based deployment using Argo CD.',
      techStack: ['Jenkins', 'Docker', 'Git', 'GitHub', 'AWS EC2', 'SonarQube', 'Argo CD', 'Python', 'Django'],
      archAscii: `[Django Dev] ──> [Git / GitHub Repo]
                         │
                 [Jenkins CI Server]
         ┌───────────────┼───────────────┐
  [pytest / Unit]  [SonarQube Quality] [Docker Build]
         └───────────────┼───────────────┘
                         │ (Push to Docker Hub)
              [Docker Image Registry]
                         │
             [ArgoCD / GitOps Sync]
                         │
             [AWS EC2 Host (Docker / K8s)]
                         │
         [Gunicorn / Django Application]`,
      githubUrl: 'https://github.com/sumithksam/django-cicd-jenkins-argocd',
      demoUrl: '#',
      category: 'cicd',
      details: {
        problemStatement: 'Manual deployment of Django web applications required repetitive SSH access, manual database migrations, static file collection, and lacked automated quality control gates.',
        solution: 'Created a full-lifecycle automated CI/CD pipeline in Jenkins that triggers on GitHub pushes, runs automated unit tests, inspects code with SonarQube, builds Docker images, and deploys to AWS EC2 with ArgoCD GitOps.',
        highlights: [
          'Automated pytest test suite execution and SonarQube quality gate enforcement before container builds.',
          'Dockerized Django application using multi-stage builds separating build-deps from lightweight runtime.',
          'Automated collection of static assets (collectstatic) and database migrations in CI pipeline stages.',
          'GitOps deployment synchronization via ArgoCD targeting AWS EC2 container environment.',
          'Nginx reverse proxy and Gunicorn WSGI configuration for production-grade throughput.'
        ],
        codeSnippetTitle: 'Jenkinsfile & Dockerfile (Django CI/CD)',
        codeSnippet: `pipeline {
    agent any
    environment {
        APP_NAME = 'sumithksam/django-web-app'
        REGISTRY_CREDS = 'dockerhub-credentials'
    }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Run Tests') {
            steps {
                sh '''
                    python3 -m venv venv
                    . venv/bin/activate
                    pip install -r requirements.txt
                    pytest --cov=app tests/
                '''
            }
        }
        stage('SonarQube Quality Gate') {
            steps {
                withSonarQubeEnv('SonarServer') {
                    sh 'sonar-scanner -Dsonar.projectKey=django-app'
                }
                waitForQualityGate abortPipeline: true
            }
        }
        stage('Docker Build & Push') {
            steps {
                script {
                    docker.withRegistry('', REGISTRY_CREDS) {
                        def img = docker.build("\${APP_NAME}:\${BUILD_NUMBER}")
                        img.push()
                        img.push('latest')
                    }
                }
            }
        }
        stage('Trigger ArgoCD Sync') {
            steps {
                sh 'argocd app sync django-prod --auth-token \${ARGOCD_TOKEN} --server argocd.sumith.dev'
            }
        }
    }
}`
      }
    },
    {
      id: 'aws-monitoring-automation',
      title: 'AWS Cloud Monitoring Automation using Shell Scripting and Cron',
      shortDesc: 'Developed a shell script to automate the monitoring of AWS EC2 instance resources and system health. Configured the script as a cron job to execute at scheduled intervals, collect system metrics, log resource utilization, and support proactive infrastructure monitoring without manual intervention.',
      techStack: ['AWS EC2', 'Linux', 'Bash', 'Cron', 'AWS CLI'],
      archAscii: `[Cron Daemon (* * * * *)]
           │
   [monitor_ec2.sh] ──> [AWS CLI / EC2 Metadata]
           │
 ┌─────────┼───────────────────────────┐
 │ CPU Utilization (top/mpstat)        │
 │ Memory Saturation (free -m)         │
 │ Disk Usage & Inodes (df -h)         │
 │ Network Sockets (ss / netstat)      │
 └─────────┬───────────────────────────┘
           │
   [Threshold Evaluation]
 ┌─────────┴─────────┐
 │ Normal            │ Alert Exceeded (>80%)
 ▼                   ▼
[/var/log/sys.log]  [AWS CloudWatch / SNS Email]`,
      githubUrl: 'https://github.com/sumithksam/aws-ec2-monitoring-shell-script',
      demoUrl: '#',
      category: 'monitoring',
      details: {
        problemStatement: 'Without automated monitoring, EC2 instances suffered silent disk exhaustion and memory leaks during traffic surges before engineers could manually identify the cause.',
        solution: 'Engineered an automated lightweight Bash monitoring daemon executed periodically via cron that collects CPU, memory, disk, and network telemetry, logging metrics and alerting when thresholds are breached.',
        highlights: [
          'Zero-overhead Bash script extracting system metrics from /proc and AWS instance metadata.',
          'Configured automated cron schedules running every 5 minutes with robust error trapping (set -euo pipefail).',
          'Automated disk usage and memory leak alerting with automatic log file rotation.',
          'Integration with AWS CLI for sending custom CloudWatch metrics and triggering SNS notifications.',
          'Reduced incident detection latency by establishing automated proactive health telemetry.'
        ],
        codeSnippetTitle: 'monitor_ec2.sh (Automated Shell Script)',
        codeSnippet: `#!/usr/bin/env bash
# ==============================================================================
# AWS EC2 Automated Resource & Health Monitor
# Scheduled via Cron: */5 * * * * /opt/scripts/monitor_ec2.sh
# ==============================================================================
set -euo pipefail

LOG_FILE="/var/log/ec2_metrics.log"
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id || hostname)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Metric Extraction
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print 100 - $8}')
MEM_USAGE=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')

echo "[$TIMESTAMP] [$INSTANCE_ID] CPU: \${CPU_USAGE}% | MEM: \${MEM_USAGE}% | DISK: \${DISK_USAGE}%" >> "$LOG_FILE"

# Threshold Alerting (>80% utilization)
if (( $(echo "$CPU_USAGE > 80.0" | bc -l) )) || [ "$DISK_USAGE" -gt 80 ]; then
  ALERT_MSG="[ALERT] Instance $INSTANCE_ID high utilization: CPU=\${CPU_USAGE}%, DISK=\${DISK_USAGE}%"
  echo "$ALERT_MSG" >> "$LOG_FILE"
  aws sns publish --topic-arn "arn:aws:sns:us-east-1:123456789012:InfraAlerts" \
    --message "$ALERT_MSG" --subject "EC2 Health Alert: $INSTANCE_ID" || true
fi`
      }
    },
    {
      id: 'devsecops-hardened-pipeline',
      title: 'Hardened Microservice & DevSecOps CI/CD Pipeline',
      shortDesc: 'Architected an automated DevSecOps CI/CD pipeline in Jenkins utilizing Docker-out-of-Docker architecture to enforce shift-left security across code, IaC, and runtime layers. Integrated TruffleHog for secrets detection, Semgrep for OWASP Top 10 SAST analysis, and Trivy alongside Kyverno CLI for Kubernetes admission policy validation. Automated live dynamic vulnerability scanning (DAST) via OWASP ZAP over isolated Docker networks and gated container deployments against unpatched CVEs using Trivy Image scanning.',
      techStack: ['Jenkins', 'Docker', 'Kubernetes', 'OWASP ZAP', 'Trivy', 'Semgrep', 'TruffleHog', 'Kyverno', 'Git'],
      archAscii: `[Git Commit]
      │
[Jenkins DooD Controller]
      │
┌─────┴───────────────────────────────────────────────────────┐
│ 1. [TruffleHog] ────> Secrets Detection (API Keys/Tokens)   │
│ 2. [Semgrep] ───────> SAST Code Inspection (OWASP Top 10)   │
│ 3. [Docker Build] ──> Container Image Packaging             │
│ 4. [Trivy Scan] ────> Container Vulnerability / CVE Gating  │
│ 5. [Kyverno CLI] ───> Kubernetes Admission Policy Check     │
│ 6. [OWASP ZAP] ─────> DAST Live Dynamic Penetration Testing │
└─────┬───────────────────────────────────────────────────────┘
      │ (All Security Gates Passed)
[Gated Production Deploy] ──> [Kubernetes Secure Cluster]`,
      githubUrl: 'https://github.com/sumithksam/devsecops-hardened-microservice-pipeline',
      demoUrl: '#',
      category: 'security',
      details: {
        problemStatement: 'Security auditing conducted after deployment resulted in late discovery of vulnerabilities, leaked credentials, hardcoded secrets, and non-compliant Kubernetes manifests.',
        solution: 'Architected a comprehensive DevSecOps pipeline with shift-left security gates: TruffleHog for secret scanning, Semgrep for SAST, Trivy for CVE container image scanning, Kyverno for manifest policy enforcement, and OWASP ZAP for DAST.',
        highlights: [
          'Shift-left security integrating static and dynamic auditing directly into Jenkins pipelines.',
          'TruffleHog verified no secrets, credentials, or private keys exist in Git commit history.',
          'Semgrep rules enforce OWASP Top 10 security standards across source code.',
          'Trivy gates image promotion, failing builds on CRITICAL or HIGH unpatched vulnerabilities.',
          'Kyverno CLI validates Kubernetes manifests against CIS benchmark admission policies before cluster apply.',
          'OWASP ZAP runs automated dynamic security scans over isolated Docker bridge networks.'
        ],
        codeSnippetTitle: 'Jenkinsfile (DevSecOps Hardened Pipeline)',
        codeSnippet: `pipeline {
    agent any
    environment {
        APP_IMAGE = 'sumithksam/hardened-microservice'
    }
    stages {
        stage('Shift-Left 1: Secrets Scanning') {
            steps {
                sh 'trufflehog git file://. --only-verified --fail'
            }
        }
        stage('Shift-Left 2: SAST Code Analysis') {
            steps {
                sh 'semgrep scan --config=auto --error'
            }
        }
        stage('Container Build & CVE Gate') {
            steps {
                sh "docker build -t \${APP_IMAGE}:\${BUILD_NUMBER} ."
                sh "trivy image --severity CRITICAL --exit-code 1 \${APP_IMAGE}:\${BUILD_NUMBER}"
            }
        }
        stage('Shift-Left 3: K8s Policy Gate') {
            steps {
                sh 'kyverno apply /policies --resource k8s-manifests/deployment.yaml --table'
            }
        }
        stage('Shift-Left 4: DAST Live Testing') {
            steps {
                sh """
                    docker network create test-net || true
                    docker run -d --name target-app --network test-net \${APP_IMAGE}:\${BUILD_NUMBER}
                    docker run --rm --network test-net zaproxy/zap-stable zap-baseline.py -t http://target-app:8000 -r zap-report.html || true
                    docker rm -f target-app
                """
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s-manifests/'
            }
        }
    }
}`
      }
    }
  ];

  /* --------------------------------------------------------------------------
     Render Projects in Grid
     -------------------------------------------------------------------------- */
  function getTagClass(tag) {
    const orangeTags = ['AWS', 'AWS EC2', 'Terraform', 'Lambda', 'EC2', 'DynamoDB', 'Ansible', 'CloudWatch', 'S3', 'IAM'];
    return orangeTags.includes(tag) ? 'project-tag tag-orange' : 'project-tag';
  }

  function renderProjects() {
    const container = document.getElementById('projects-grid-container');
    if (!container) return;

    const existingBtns = container.querySelectorAll('.view-details-btn');
    if (existingBtns.length > 0) {
      existingBtns.forEach((btn) => {
        const id = btn.getAttribute('data-project-id');
        btn.onclick = () => openProjectModal(id);
      });
      return;
    }

    container.innerHTML = '';

    projectsData.forEach((proj) => {
      const card = document.createElement('div');
      card.className = 'project-card fade-in-up';
      card.setAttribute('data-category', proj.category);

      const tagsHtml = proj.techStack
        .map((tag) => `<span class="${getTagClass(tag)}">${tag}</span>`)
        .join('');

      card.innerHTML = `
        <div class="project-arch-preview">
          <pre class="arch-ascii-box">${proj.archAscii}</pre>
        </div>
        <div class="project-card-body">
          <h3 class="project-card-title">${proj.title}</h3>
          <p class="project-card-desc">${proj.shortDesc}</p>
          <div class="project-tags">${tagsHtml}</div>
          <div class="project-card-footer">
            <div class="project-links">
              <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link-icon" title="View Source Code">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                Code
              </a>
            </div>
            <button class="view-details-btn" data-project-id="${proj.id}">
              Details & Specs [→]
            </button>
          </div>
        </div>
      `;

      // Event listener for opening details
      const btn = card.querySelector('.view-details-btn');
      btn.addEventListener('click', () => openProjectModal(proj.id));

      container.appendChild(card);
    });
  }

  /* --------------------------------------------------------------------------
     Modal Management
     -------------------------------------------------------------------------- */
  function openProjectModal(projectId) {
    const proj = projectsData.find((p) => p.id === projectId);
    if (!proj) return;

    const modalOverlay = document.getElementById('project-modal');
    const modalTitle = document.getElementById('project-modal-title');
    const modalBody = document.getElementById('project-modal-body');

    if (!modalOverlay || !modalTitle || !modalBody) return;

    modalTitle.innerHTML = `
      <span style="color: var(--accent-red);">[PROJECT_SPEC]</span> ${proj.title}
    `;

    const highlightsHtml = proj.details.highlights
      .map((h) => `<li style="margin-bottom: 6px; display: flex; gap: 8px;"><span style="color: var(--accent-red);">▹</span> ${h}</li>`)
      .join('');

    const techBadges = proj.techStack
      .map((t) => `<span class="${getTagClass(t)}">${t}</span>`)
      .join(' ');

    modalBody.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h4 style="color: var(--accent-cyan); font-size: 0.95rem; margin-bottom: 8px;">// OVERVIEW & OBJECTIVE</h4>
        <p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 0.9rem;">${proj.details.problemStatement}</p>
        <p style="color: var(--text-primary); font-size: 0.9rem;"><strong>Solution:</strong> ${proj.details.solution}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="color: var(--accent-cyan); font-size: 0.95rem; margin-bottom: 8px;">// ARCHITECTURE BLUEPRINT</h4>
        <div style="background: #06090e; border: 1px solid var(--border-subtle); border-radius: 4px; padding: 16px; overflow-x: auto;">
          <pre style="color: var(--accent-red); font-size: 0.8rem; margin: 0; line-height: 1.5;">${proj.archAscii}</pre>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="color: var(--accent-cyan); font-size: 0.95rem; margin-bottom: 8px;">// KEY ENGINEERING HIGHLIGHTS</h4>
        <ul style="list-style: none; padding-left: 0; font-size: 0.88rem; color: var(--text-secondary);">
          ${highlightsHtml}
        </ul>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="color: var(--accent-cyan); font-size: 0.95rem; margin-bottom: 8px;">// REPOSITORIES & TECHNOLOGIES</h4>
        <div style="margin-bottom: 12px;">${techBadges}</div>
        <p style="font-size: 0.82rem; color: var(--text-muted);">
          GitHub: <a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-red);">${proj.githubUrl}</a>
        </p>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4 style="color: var(--accent-cyan); font-size: 0.95rem; margin: 0;">// ${proj.details.codeSnippetTitle.toUpperCase()}</h4>
          <button id="modal-copy-code-btn" class="copy-btn" style="font-size: 0.75rem;">Copy Code</button>
        </div>
        <div style="background: #04060a; border: 1px solid var(--border-subtle); border-radius: 4px; padding: 16px; max-height: 280px; overflow-y: auto;">
          <pre id="modal-code-block" style="color: #85e89d; font-size: 0.8rem; margin: 0; font-family: var(--font-mono); line-height: 1.5;">${escapeHtml(proj.details.codeSnippet)}</pre>
        </div>
      </div>
    `;

    // Code copy event
    const copyBtn = document.getElementById('modal-copy-code-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(proj.details.codeSnippet).then(() => {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => (copyBtn.textContent = 'Copy Code'), 2000);
        });
      });
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modalOverlay = document.getElementById('project-modal');
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  // Setup modal close listeners
  function initModalListeners() {
    const modalOverlay = document.getElementById('project-modal');
    const closeBtn = document.getElementById('project-modal-close');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  window.DevOpsProjects = {
    init: function () {
      renderProjects();
      initModalListeners();
    },
    openProject: openProjectModal,
    getProjects: () => projectsData
  };
})();
