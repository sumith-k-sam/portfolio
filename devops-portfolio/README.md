# Sumith K Sam - DevOps Engineer Interactive Portfolio

A terminal-inspired, interactive personal portfolio website for **Sumith K Sam**, DevOps Engineer specializing in Cloud Infrastructure, Kubernetes, CI/CD Automation, Terraform (IaC), and Observability.

Inspired by modern Linux server management environments, terminal consoles, and developer digital workspaces (with primary reference to [ajasmhd.in](https://ajasmhd.in/)).

---

## 🚀 Live Demo & How to Run

This website is built strictly using **HTML5, CSS3, and Vanilla JavaScript**. It has **no frameworks, no build tools, no Node.js/Python dependencies, and no backend requirements**.

### Option 1: Direct File Open
Double click `index.html` in your file explorer, or right-click `index.html` and choose **Open With > Google Chrome / Firefox / Microsoft Edge / Safari**.

### Option 2: VS Code Live Server
1. Open the project directory `c:\Users\User\Desktop\Port` in Visual Studio Code.
2. Install the **Live Server** extension (by Ritwick Dey) if not already installed.
3. Right-click `index.html` and select **"Open with Live Server"**.
4. The site will launch on `http://127.0.0.1:5500/index.html`.

---

## 🎨 Design & Visual Identity

- **Theme Palette:**
  - **Background:** Deep Terminal Black / Dark Charcoal (`#070a0f`, `#0d121a`)
  - **Primary Accent:** Terminal Green (`#00ff66` / `#10b981`)
  - **Secondary Accent:** Electric Cyan (`#00d4ff`) & **DevOps Cloud Orange** (`#ff7b00` / `#ea580c`) representing AWS, Terraform, Ubuntu, and Prometheus telemetry
  - **Text:** Crisp Monospace Light Grey & White (`#f0f6fc`, `#8b949e`)
- **Typography:** JetBrains Mono, Fira Code, SF Mono, Menlo, monospace stack
- **Aesthetics:** Minimal glowing borders, scanline overlays, blinking terminal cursors, and network latency indicators.

---

## 🛠️ Technology Stack & Zero-Dependency Architecture

- **Markup:** Semantic HTML5 with accessibility ARIA tags
- **Styling:** Modular CSS3 with CSS Custom Properties (Variables), Flexbox, CSS Grid, and GPU-accelerated keyframe animations
- **Scripting:** Pure Vanilla JavaScript (ES6+ modular architecture, zero npm packages or third-party libraries)
- **Audio:** Web Audio API synthesizer for native retro terminal bleeps (no external audio files)
- **Vector Icons:** Clean inline and vector SVGs

---

## 📁 Project Folder Structure

```text
devops-portfolio/
│
├── index.html                   # Primary semantic single-page layout
│
├── assets/
│   ├── images/                  # Profile & preview imagery assets
│   ├── icons/                   # Modular SVG vector icons (aws, docker, k8s, etc.)
│   └── resume/
│       └── resume.pdf           # Downloadable curriculum vitae (PDF)
│
├── css/
│   ├── style.css                # Core layout, themes, terminal styling & cards
│   ├── responsive.css           # Breakpoints (1440px, 1024px, 768px, 480px, 375px)
│   └── animations.css           # Blinking cursors, scanlines, data packet flows
│
├── js/
│   ├── main.js                  # Boot sequence, navigation, audio synth, modals, clock
│   ├── globe.js                 # 3D interactive GitHub-style DevOps cloud mesh globe
│   ├── terminal.js              # Functional simulated Linux shell (whoami, neofetch, etc.)
│   ├── animations.js            # Hero typing animation, custom cursor & grid canvas
│   ├── projects.js              # DevOps project data, architecture previews & modals
│   ├── infrastructure.js        # Interactive Network/Pipeline Lab & telemetry inspector
│   └── troubleshooting.js       # Real-world incident remediation simulator
│
└── README.md                    # Project documentation & customization guide
```

---

## 🖥️ Key Interactive Features & Sections

### 1. Simulated Linux Boot Sequence (Section A)
- Systemd / GRUB style boot logs with status tags (`[ OK ] Initializing DevOps Environment...`).
- Real-time progress percentage bar.
- Skip button (`[ESC]` or button click) with session persistence so it only boots once per browser session.

### 2. DevOps System Status Bar & Sticky Navigation (Section B & Nav)
- Real-time system telemetry: Host, Cluster Health (100%), AWS Region, SLA (99.999%), and live UTC clock.
- Web Audio API synthesizer toggle (mute/unmute).
- Light / Dark mode toggle (persisted via `localStorage`).
- Navigation bar with bracket terminal notation: `[01. /home]`, `[02. /about]`, etc., with mobile drawer menu.

### 3. Hero Section – Terminal Intro & Interactive 3D Globe (Section B)
- **Linux Terminal Command Center:**
  - Real-time command typing animation:
    - `root@sumith:~$ whoami` -> Sumith K Sam
    - `root@sumith:~$ cat introduction.txt` -> Professional biography
    - `root@sumith:~$ systemctl status devops-workload.service` -> Running status pills
  - Resume PDF download, View Projects, Interactive CLI launch button, and social channels.
- **GitHub-Inspired 3D Interactive Globe:**
  - 3D rotating particle sphere displaying real-world continent landmasses (~1,100 points) and oceanic depth grids.
  - 8 Connected AWS Cloud Hubs (`us-east-1`, `us-west-2`, `eu-central-1`, `eu-west-1`, `ap-south-1`, `ap-southeast-1`, `ap-northeast-1`, `sa-east-1`) with 3D beacon pins.
  - Elevated great-circle network arcs with animated traveling data packets and expanding ping rings upon arrival.
  - Interactive click-and-drag rotation with momentum damping, touch support for mobile devices, and hover HUD tooltips with region telemetry.
  - Globe controls: Toggle Auto-Rotation, Focus Home Region (`ap-south-1`), and Simulate Global Ping.

### 4. About Me & Neofetch System Specs (Section C)
- Information-card layout covering introduction, years of experience, current role, location, and career objective.
- Linux `neofetch` hardware/OS card showing kernel version, cloud region, container engine, and uptime.

### 5. Technical Skills – 8 DevOps Domains (Section D)
- 1. Cloud Platforms (AWS: EC2, S3, IAM, VPC, Lambda)
- 2. Containers & Orchestration (Docker, Kubernetes, Minikube, Helm)
- 3. CI/CD Automation (Jenkins, GitHub Actions, GitLab CI/CD)
- 4. Infrastructure as Code (Terraform, Ansible)
- 5. Monitoring & Logging (Prometheus, Grafana, ELK Stack, Alertmanager)
- 6. Operating Systems (Linux, Ubuntu Server, Debian, Windows Server)
- 7. Programming & Scripting (Python, Bash, JavaScript)
- 8. Version Control (Git, GitHub, Bitbucket)
*(No fake proficiency bars or percentages — strictly clean architectural tags).*

### 6. Professional Experience Career Timeline (Section E)
- Vertical timeline with pulsing markers, active badges, and verified career history:
  - **DevOps Engineer** (2024 - Present) @ Zoople Technologies PVT LTD - Leading GitOps delivery, Kubernetes clusters, Terraform & Ansible IaC, and DevSecOps pipelines.
  - **Python Developer** (Oct 2022 - 2024, ~2 Years) @ Zoople Technologies PVT LTD - Web application development using Django framework, REST APIs, and database engineering.
  - **Software Developer** (Mar 2022 - Oct 2022, ~8 Months) @ NextGen Pro Innovations and edupark PVT LTD - Web application development in Django (Python).
  - *Total Experience:* 4+ Years (2.5 Years Django Development + DevOps till date).

### 7. DevOps Projects with Architecture Modals (Section F)
- 5 Verified real-world production projects:
  1. **GitOps & DevSecOps Platform for ML Inference Microservices** (FastAPI, Docker, Kubernetes, Jenkins, ArgoCD, MLflow, Bandit, Safety)
  2. **Infrastructure Automation using Terraform and Ansible** (Terraform, Ansible, AWS EC2, Linux, YAML, SSH)
  3. **CI/CD Pipeline for Django Application** (Jenkins, Docker, Git, GitHub, AWS EC2, SonarQube, Argo CD)
  4. **AWS Cloud Monitoring Automation using Shell Scripting and Cron** (AWS EC2, Linux, Bash, Cron, AWS CLI)
  5. **Hardened Microservice & DevSecOps CI/CD Pipeline** (Jenkins, Docker, Kubernetes, OWASP ZAP, Trivy, Semgrep, TruffleHog, Kyverno)
- Each card features an ASCII/SVG architecture preview and a **"Details & Specs [→]"** modal with code snippets, problem statements, and key highlights.

### 8. Interactive Infrastructure / Network Lab (Section G)
- Visual topology diagram:
  `Developer` ➔ `GitHub` ➔ `Jenkins CI` ➔ `Docker` ➔ `Kubernetes` ➔ `AWS Cloud` ➔ `Prometheus/Grafana`
- Clickable nodes with live telemetry in the inspector sidebar.
- Interactive actions:
  - `[▶ Trigger Deploy Simulation]`: Sends an animated data packet across all 7 stages with live logs.
  - `[⚡ Simulate Traffic Spike]`: Injects traffic surges and triggers Kubernetes HPA auto-scaling.
  - `[↺ Reset Architecture]`: Restores default cluster state.

### 9. Interactive DevOps Terminal (Section H)
- Authentic Linux terminal simulator with `root@sumith:~$` prompt.
- Supported commands:
  - `help`, `whoami`, `about`, `skills`, `projects`, `experience`, `education`, `contact`, `resume`, `clear`, `date`, `neofetch`
  - Bonus commands: `ls`, `cat <file>`, `uptime`, `history`, `sudo`, `docker`, `kubectl`, `ping`, `uname`
- Features: Command history (Up / Down arrows), Tab auto-completion, quick command pill buttons, sanitized output.
- Shortcut: Press `` ` `` (backtick) or `~` anywhere on the site to immediately jump to and focus the terminal!

### 10. DevOps Troubleshooting Simulator (Section I)
- 6 Real-world production incident scenarios:
  1. Docker: Port 80 Allocation Failure (`bind: address already in use`)
  2. Kubernetes: Pod `CrashLoopBackOff` (`OOMKilled: Exit Code 137`)
  3. Jenkins: Docker Daemon Socket Permission Denied
  4. AWS: EC2 SSH Connection Timed Out (Security Group Missing Ingress)
  5. Nginx: HTTP 502 Bad Gateway (Upstream Service Connection Refused)
  6. Linux: Root Filesystem at 100% Usage (`No space left on device`)
- Includes diagnostic commands (`docker logs`, `kubectl describe`, `netstat`, `df -h`), multiple-choice solutions, and post-mortem technical feedback.

### 11. Certifications & Education (Section J)
- AWS Certified Solutions Architect - Associate
- Certified Kubernetes Administrator (CKA)
- HashiCorp Certified: Terraform Associate
- Red Hat Certified System Administrator (RHCSA)
- Master of Computer Application (MCA) - Mount Zion College of Engineering, KTU (CGPA: 7.99)
- B.Sc Computer Science - Mannam Memorial NSS College, MGU (CGPA: 6.88)

### 12. Documentation / Technical Notes (Section K)
- 8 Curated Runbooks: Linux Admin, Docker, Kubernetes, Jenkins, AWS, Terraform, Prometheus, Bash Automation.
- Clicking any topic opens a code documentation modal with copyable commands.

### 13. Contact & Direct Connect (Section L)
- Terminal `./contact.sh` themed interface with copyable email address (`sumithksam.devops@example.com`), LinkedIn profile, GitHub repository, and location/availability indicator in an organized card grid.

---

## 🎨 Customization Guide

All personal and technical information is completely editable:

1. **Personal Information & Bio:**
   - Open `index.html` and search for `Sumith K Sam` to update your name, title, bio, or social links.
   - Edit `js/terminal.js` under `commands.whoami` and `commands.about` to customize the terminal command output.

2. **Resume PDF:**
   - Replace `assets/resume/resume.pdf` with your own PDF document.

3. **Projects:**
   - Edit `js/projects.js` to modify titles, descriptions, architecture ASCII diagrams, and code snippets.

4. **Colors & Theming:**
   - In `css/style.css`, edit `:root` CSS variables to tweak accent colors (`--accent-green`, `--accent-cyan`), background tones, or monospace font families.

---

## 📱 Responsive Testing Matrix

Tested and optimized for:
- **Desktop / Ultrawide:** 1440px - 2560px
- **Laptops / Standard Desktops:** 1024px - 1200px
- **Tablets:** 768px (iPad, Android tablets)
- **Mobile Handsets:** 375px - 480px (iPhone, Pixel, Galaxy)

---

## 🛡️ Security & Privacy

- No external analytics, trackers, or cookies.
- No terminal commands execute on the user's actual host operating system.
- Safe DOM handling preventing script injection.
- Zero API keys or cloud credentials exposed.

---

## 📜 License

MIT License &copy; 2026 Sumith K Sam. Free to use and customize for personal portfolios.

