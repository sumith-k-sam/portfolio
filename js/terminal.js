/**
 * DevOps Portfolio - Interactive DevOps Terminal Simulator
 * Author: Sumith K Sam
 */

(function () {
  'use strict';

  const PROMPT_LABEL = 'root@sumith:~$';
  const commandHistory = [];
  let historyIndex = -1;

  // Linux-style Neofetch display
  const NEOFETCH_OUTPUT = `
        #####           root@sumith-infra
       #######          -----------------
       ##O#O##          OS: Ubuntu 24.04.1 LTS x86_64
       #VVVVV#          Host: AWS EC2 t3.large (us-east-1)
     ##  VVV  ##        Kernel: 6.8.0-45-generic
    #          ##       Uptime: 42 days, 18 hours, 32 mins
   #            ##      Packages: 1,842 (dpkg), 18 (snap), 12 (docker)
   #            ###     Shell: bash 5.2.21
  QQ#           ##Q     Terminal: xterm-256color
QQQQQQ#       #QQQQQQ   CPU: Intel Xeon Platinum 8259CL (4) @ 2.50GHz
QQQQQQQ#     #QQQQQQQ   Memory: 2,410MiB / 8,192MiB (29.4%)
  QQQQQ ##### QQQQQ     Cloud: AWS (VPC: 10.0.0.0/16, Multi-AZ)
    QQQ       QQQ       DevOps: Docker, K8s, Terraform, Jenkins
                        Observability: Prometheus, Grafana
`;

  // Pre-defined commands and responses
  const commands = {
    help: () => `
Available system commands:
  help        - Display list of available commands
  whoami      - Display professional identity & role
  about       - Read professional bio and background (cat about.txt)
  skills      - Enumerate technical competencies and DevOps stack
  projects    - List production-grade infrastructure projects
  experience  - View professional career trajectory & roles
  education   - View academic qualifications & certifications
  contact     - Display contact options & channels
  resume      - Download curriculum vitae (PDF)
  clear       - Clear console screen buffer
  date        - Display current system date and UTC time
  neofetch    - Show Linux server telemetry & system specs
  
Bonus commands:
  ls, cat, uptime, history, docker, kubectl, ping, uname, sudo
`,

    whoami: () => `
Sumith K Sam
Role: DevOps Engineer (Cloud & Infrastructure Automation)
Background: 2.5 Years Python/Django Development + DevOps & Cloud Infrastructure
Current Company: Zoople Technologies PVT LTD
Location: Pathanamthitta, Kerala, India (Open to Remote Worldwide)
Status: Available for high-impact DevOps & Cloud Infrastructure roles
`,

    about: () => `
[cat about.txt]
----------------------------------------------------------------------
DevOps Engineer with a strong software engineering foundation of 2.5 years
as a Python/Django developer before transitioning to end-to-end cloud
infrastructure, GitOps, Kubernetes container orchestration, and DevSecOps.

Having built production backend services from scratch, I bridge the gap
between application developers and infrastructure reliability through declarative
code (Terraform, Ansible), shift-left security (TruffleHog, Semgrep, Trivy, Kyverno),
and GitOps continuous delivery (Jenkins, ArgoCD).

Career Objective:
To architect, automate, and secure resilient, scalable cloud infrastructure
and deployment pipelines that empower development teams to ship code reliably.
----------------------------------------------------------------------
`,

    skills: () => `
TECHNICAL SKILLS & DEVOPS STACK
----------------------------------------------------------------------
1. Cloud Platforms:
   - AWS: EC2, S3, IAM, VPC, Lambda, ALB, CloudWatch, Route 53

2. Containerization & Orchestration:
   - Docker, Kubernetes, Minikube, Helm, Docker Compose

3. CI/CD & GitOps Automation:
   - Jenkins (Declarative Pipelines), ArgoCD, GitHub Actions, GitLab CI/CD

4. Infrastructure as Code (IaC):
   - Terraform (Modules, Remote State, DynamoDB Lock), Ansible Playbooks

5. DevSecOps & Security Gating:
   - TruffleHog (Secrets), Semgrep (SAST), Trivy (CVEs), Kyverno, OWASP ZAP (DAST)

6. Operating Systems & Shell:
   - Linux (Ubuntu, Debian, RHEL), Bash Defensive Scripting, Cron Daemons

7. Programming & Web Frameworks:
   - Python, Django Framework (2.5 Years), FastAPI, REST APIs, JavaScript

8. Version Control:
   - Git, GitHub, GitLab, GitOps declarative workflows
----------------------------------------------------------------------
`,

    projects: () => `
FEATURED DEVOPS PROJECTS (Verified Workloads)
----------------------------------------------------------------------
1. GitOps & DevSecOps Platform for ML Inference Microservices
   - FastAPI, Docker, Kubernetes, Jenkins, ArgoCD, MLflow, Bandit, Safety.
   
2. Infrastructure Automation using Terraform and Ansible
   - Terraform, Ansible, AWS EC2, Linux, YAML, SSH idempotent configuration.
   
3. CI/CD Pipeline for Django Application
   - Jenkins, Docker, Git, GitHub, AWS EC2, SonarQube, Argo CD GitOps.
   
4. AWS Cloud Monitoring Automation using Shell Scripting and Cron
   - AWS EC2, Linux, Bash, Cron, AWS CLI, metric logging & SNS threshold alerts.
   
5. Hardened Microservice & DevSecOps CI/CD Pipeline
   - Jenkins, Docker, Kubernetes, OWASP ZAP, Trivy, Semgrep, TruffleHog, Kyverno.
----------------------------------------------------------------------
Tip: Click 'Details & Specs [→]' on any project card to inspect ASCII blueprints and source code!
`,

    experience: () => `
CAREER TIMELINE & EXPERIENCE
----------------------------------------------------------------------
[2024 - Present] DevOps Engineer
Company: Zoople Technologies PVT LTD
- Architected automated GitOps delivery pipelines using Jenkins & ArgoCD on Kubernetes.
- Engineered Infrastructure as Code with Terraform & Ansible on AWS EC2.
- Enforced shift-left DevSecOps: TruffleHog, Semgrep, Trivy, Kyverno & OWASP ZAP.
- Automated proactive EC2 resource health monitoring scripts and cron daemons.

[Oct 2022 - 2024] Python Developer (~2 Years)
Company: Zoople Technologies PVT LTD
- Working as a web application developer using Django framework (Python).
- Work with development teams and product managers to ideate software solutions.
- Develop and manage well-functioning databases and applications, write effective APIs.
- Strong analytical and problem-solving skills, excellent technical communication.
- Integrate user-facing components built by front-end developers with server logic.
- Translate client requirements into properly structured server-side logic.

[Mar 2022 - Oct 2022] Software Developer (~8 Months)
Company: NextGen Pro Innovations and edupark PVT LTD
- Worked as a web application developer building client web solutions.
- Developed software in Django framework (Python) adhering to clean architecture.
- Assisted in database schema design, view logic, and REST endpoint integration.
----------------------------------------------------------------------
Total Experience: 4+ Years (2.5 Years Django Development + DevOps till date)
`,

    education: () => `
ACADEMIC QUALIFICATIONS & DEGREES
----------------------------------------------------------------------
1. Master of Computer Application (MCA)
   Mount Zion College of Engineering, Kadammanitta, Pathanamthitta, Kerala
   Affiliated to APJ Abdul Kalam Technological University (KTU)
   Academic Score: 7.99 CGPA
   Specialization: Distributed Systems, Cloud Computing, Database Architectures

2. B.Sc Computer Science
   Mannam Memorial NSS College, Konni, Pathanamthitta, Kerala
   Affiliated to Mahatma Gandhi University (MGU)
   Academic Score: 6.88 CGPA
   Specialization: Data Structures, Operating Systems, Computer Networks, Linux

Technical Engineering Foundation:
- 2.5 Years Professional Web Application Engineering in Python & Django
- Applied DevOps, Kubernetes, Terraform & DevSecOps Practice
----------------------------------------------------------------------
`,

    contact: () => `
CONTACT & NETWORK CHANNELS
----------------------------------------------------------------------
Email:    sumithksam.devops@example.com
LinkedIn: linkedin.com/in/sumithksam
GitHub:   github.com/sumithksam
Location: Kerala, India / Available Worldwide (Remote)

Type 'resume' to download my complete curriculum vitae.
----------------------------------------------------------------------
`,

    resume: () => {
      // Trigger download
      const link = document.createElement('a');
      link.href = 'assets/resume/resume.pdf';
      link.download = 'Sumith_K_Sam_DevOps_Resume.pdf';
      link.click();
      return `[OK] Initiated download for 'Sumith_K_Sam_DevOps_Resume.pdf'. Check your downloads folder!`;
    },

    date: () => {
      const now = new Date();
      return `${now.toUTCString()} (Local: ${now.toString()})`;
    },

    neofetch: () => NEOFETCH_OUTPUT,

    uptime: () => ` 13:42:10 up 42 days, 18:32,  2 users,  load average: 0.14, 0.08, 0.03`,

    uname: () => `Linux sumith-infra 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`,

    ls: () => `about.txt   infrastructure.tf   Jenkinsfile   k8s-manifests/   projects/   resume.pdf`,

    history: () => {
      if (!commandHistory.length) return 'No previous commands in session history.';
      return commandHistory.map((cmd, idx) => `  ${idx + 1}  ${cmd}`).join('\n');
    },

    sudo: () => `[sudo] password for sumith: 
Permission granted. With great power comes great responsibility. (System is nominal).`,

    docker: () => `
CONTAINER ID   IMAGE                 STATUS         PORTS                  NAMES
7a9f2c1d88e1   api-gateway:latest    Up 14 hours    0.0.0.0:443->8443/tcp  proxy-ingress
4b8e21a09dc3   auth-service:v2.1     Up 2 days      0.0.0.0:8080->8080/tcp auth-srv
1f5c889a7102   redis:7-alpine        Up 5 days      6379/tcp               cache-redis
`,

    kubectl: () => `
NAME                             READY   STATUS    RESTARTS   AGE
pod/api-deployment-7f89b-4k2ln   1/1     Running   0          3d4h
pod/api-deployment-7f89b-9xplm   1/1     Running   0          3d4h
pod/api-deployment-7f89b-m482a   1/1     Running   0          3d4h
service/api-service              ClusterIP   10.96.0.42   <none>   80/TCP
`
  };

  /* --------------------------------------------------------------------------
     Terminal DOM references & Execution
     -------------------------------------------------------------------------- */
  function executeCommand(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    // Record history
    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    const historyContainer = document.getElementById('cli-history');
    const screenContainer = document.getElementById('cli-screen');
    if (!historyContainer) return;

    const parts = trimmed.split(/\s+/);
    const mainCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    // Handle 'clear'
    if (mainCmd === 'clear') {
      historyContainer.innerHTML = '';
      return;
    }

    // Create entry row
    const entryEl = document.createElement('div');
    entryEl.className = 'cli-history-entry';

    const cmdLine = document.createElement('div');
    cmdLine.className = 'cli-entry-cmd';
    cmdLine.textContent = `${PROMPT_LABEL} ${trimmed}`;
    entryEl.appendChild(cmdLine);

    const outputEl = document.createElement('div');
    outputEl.className = 'cli-entry-output';

    // Route command
    if (commands[mainCmd]) {
      outputEl.textContent = commands[mainCmd](arg);
    } else if (mainCmd === 'cat') {
      if (arg === 'about.txt' || arg === 'introduction.txt') {
        outputEl.textContent = commands.about();
      } else if (arg === 'resume.pdf') {
        outputEl.textContent = commands.resume();
      } else if (arg === 'Jenkinsfile') {
        outputEl.textContent = `pipeline {\n  agent any\n  stages {\n    stage('Build') { steps { echo 'Building...' } }\n  }\n}`;
      } else {
        outputEl.textContent = `cat: ${arg}: No such file or directory. Try 'cat about.txt'`;
      }
    } else if (mainCmd === 'ping') {
      outputEl.textContent = `PING ${arg || 'aws.amazon.com'} (52.95.120.1): 56 data bytes\n64 bytes: icmp_seq=0 ttl=54 time=14.2 ms\n64 bytes: icmp_seq=1 ttl=54 time=13.8 ms\n--- ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss`;
    } else {
      outputEl.className = 'cli-entry-output error';
      outputEl.textContent = `bash: command not found: ${mainCmd}. Type 'help' for available commands.`;
    }

    entryEl.appendChild(outputEl);
    historyContainer.appendChild(entryEl);

    // Scroll to bottom
    if (screenContainer) {
      screenContainer.scrollTop = screenContainer.scrollHeight;
    }
  }

  /* --------------------------------------------------------------------------
     Terminal Setup & Event Binding
     -------------------------------------------------------------------------- */
  function initTerminal() {
    const inputField = document.getElementById('cli-input');
    const screenContainer = document.getElementById('cli-screen');
    if (!inputField) return;

    // Focus input on terminal area click
    if (screenContainer) {
      screenContainer.addEventListener('click', () => {
        inputField.focus();
      });
    }

    // Input keyboard events
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = inputField.value;
        inputField.value = '';
        executeCommand(value);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0 && historyIndex > 0) {
          historyIndex--;
          inputField.value = commandHistory[historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          inputField.value = commandHistory[historyIndex] || '';
        } else {
          historyIndex = commandHistory.length;
          inputField.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        // Simple autocomplete
        const currentVal = inputField.value.trim().toLowerCase();
        if (currentVal) {
          const match = Object.keys(commands).find((c) => c.startsWith(currentVal));
          if (match) inputField.value = match;
        }
      }
    });

    // Suggestion pills binding
    document.querySelectorAll('.cli-suggest-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) {
          executeCommand(cmd);
          inputField.focus();
        }
      });
    });

    // Clear and maximize buttons on header
    const clearBtn = document.getElementById('cli-header-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const historyContainer = document.getElementById('cli-history');
        if (historyContainer) historyContainer.innerHTML = '';
      });
    }

    // Initial greeting in terminal
    executeCommand('neofetch');
  }

  window.DevOpsTerminal = {
    init: initTerminal,
    run: executeCommand
  };
})();

