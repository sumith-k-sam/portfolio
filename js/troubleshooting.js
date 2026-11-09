/**
 * DevOps Portfolio - DevOps Troubleshooting Simulator
 * Author: Sumith K Sam
 */

(function () {
  'use strict';

  const incidentsData = [
    {
      id: 'docker-port-conflict',
      title: 'Docker: Port 80 Allocation Failure',
      severity: 'critical',
      service: 'Docker Engine',
      description: 'Production web-frontend container terminates immediately upon execution with an address binding error.',
      logText: `docker: Error response from daemon: driver failed programming external connectivity on endpoint web-frontend:
Bind for 0.0.0.0:80 failed: port is already allocated.
[FATAL] container web-frontend-prod (id: 4a9f2c1) exited with code 128.`,
      diagnostics: [
        {
          cmd: 'sudo netstat -tulpn | grep :80',
          output: 'tcp   0   0 0.0.0.0:80   0.0.0.0:*   LISTEN   1420/nginx: master'
        },
        {
          cmd: 'docker ps -a --filter name=web-frontend',
          output: 'CONTAINER ID   IMAGE                COMMAND               STATUS                      PORTS   NAMES\n4a9f2c1d88ef   web-frontend:latest  "nginx -g \'daemon of…"   Exited (128) 2 minutes ago          web-frontend'
        }
      ],
      options: [
        {
          id: 'opt-a',
          text: 'Run container with `--privileged` flag and restart the Docker daemon.',
          isCorrect: false,
          feedback: 'Incorrect. `--privileged` grants extended kernel capabilities to the container but does not resolve the host TCP port collision on port 80.'
        },
        {
          id: 'opt-b',
          text: 'Inspect conflicting process on port 80 (found host Nginx pid 1420), stop orphan process or remap container port to `-p 8080:80`.',
          isCorrect: true,
          feedback: 'Correct! Another service (host Nginx) was already bound to 0.0.0.0:80. Either stopping the legacy daemon or binding the container to an available port like 8080:80 successfully eliminates the conflict.'
        },
        {
          id: 'opt-c',
          text: 'Purge /var/lib/docker directory and reinstall Docker Engine.',
          isCorrect: false,
          feedback: 'Incorrect. Deleting Docker system data is destructive and unnecessary when the conflict is simply another active process holding port 80.'
        }
      ]
    },
    {
      id: 'k8s-crashloop',
      title: 'Kubernetes: Pod CrashLoopBackOff',
      severity: 'critical',
      service: 'Kubernetes EKS',
      description: 'Microservice pod "checkout-api" continuously restarts and enters CrashLoopBackOff state in production namespace.',
      logText: `Events:
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Normal   Scheduled  4m                 default-scheduler  Successfully assigned prod/checkout-api to ip-10-0-1-42
  Warning  BackOff    2m (x8 over 3m)    kubelet            Back-off restarting failed container
  Warning  Unhealthy  1m (x3 over 2m)    kubelet            Liveness probe failed: HTTP probe failed
  Normal   Killing    1m                 kubelet            Container checkout-api failed liveness probe, will be restarted
Last State: Terminated (Reason: OOMKilled, Exit Code: 137)`,
      diagnostics: [
        {
          cmd: 'kubectl describe pod checkout-api',
          output: 'Containers:\n  checkout-api:\n    Limits:\n      memory: 128Mi\n    Requests:\n      memory: 64Mi\n    Last State: Terminated\n      Reason: OOMKilled\n      Exit Code: 137'
        },
        {
          cmd: 'kubectl logs checkout-api --previous',
          output: '<--- Last few GCs --->\n[1:0x55a9b] 124500 ms: Mark-sweep 126.8 (128.0) MB\nFATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory'
        }
      ],
      options: [
        {
          id: 'opt-a',
          text: 'Disable liveness probes entirely in the deployment manifest.',
          isCorrect: false,
          feedback: 'Incorrect. The container died from OOMKilled (Exit Code 137). Disabling health checks will not prevent the Linux kernel from killing the container when it runs out of memory.'
        },
        {
          id: 'opt-b',
          text: 'Increase memory limits in manifest (e.g. from 128Mi to 512Mi) and investigate memory leak in application heap allocations.',
          isCorrect: true,
          feedback: 'Correct! Exit code 137 indicates the OS OOM Killer terminated the container for exceeding its 128Mi cgroup memory ceiling. Increasing limits to 512Mi restores stability while analyzing heap profiles.'
        },
        {
          id: 'opt-c',
          text: 'Delete the Kubernetes cluster node and drain the node pools.',
          isCorrect: false,
          feedback: 'Incorrect. The issue is pod-specific memory sizing, not a node hardware failure.'
        }
      ]
    },
    {
      id: 'jenkins-permission',
      title: 'Jenkins: Docker Socket Permission Denied',
      severity: 'high',
      service: 'Jenkins CI/CD',
      description: 'Declarative CI/CD pipeline fails during "Docker Build" stage when attempting to execute docker commands.',
      logText: `+ docker build -t api-service:v2 .
Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock:
Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/containers/json": dial unix /var/run/docker.sock: connect: permission denied
[Pipeline] }
[Pipeline] // stage
[Pipeline] End of Pipeline
ERROR: script returned exit code 1`,
      diagnostics: [
        {
          cmd: 'ls -la /var/run/docker.sock',
          output: 'srw-rw---- 1 root docker 0 Nov  5 09:30 /var/run/docker.sock'
        },
        {
          cmd: 'id jenkins',
          output: 'uid=112(jenkins) gid=116(jenkins) groups=116(jenkins)'
        }
      ],
      options: [
        {
          id: 'opt-a',
          text: 'Run `chmod 777 /var/run/docker.sock` to make the socket world-writable.',
          isCorrect: false,
          feedback: 'Incorrect. Running chmod 777 on the Docker socket creates a catastrophic security hole allowing any local process to gain root access to the host.'
        },
        {
          id: 'opt-b',
          text: 'Add jenkins user to the docker group (`sudo usermod -aG docker jenkins`) and restart the Jenkins service.',
          isCorrect: true,
          feedback: 'Correct! The Docker socket belongs to the `docker` group. Adding the `jenkins` user to this group provides secure, idiomatic socket access without unsafe permissive file modes.'
        },
        {
          id: 'opt-c',
          text: 'Reconfigure Jenkins to run as root permanently.',
          isCorrect: false,
          feedback: 'Incorrect. Running Jenkins master as root violates the principle of least privilege.'
        }
      ]
    },
    {
      id: 'ec2-unreachable',
      title: 'AWS: EC2 SSH Connection Timed Out',
      severity: 'high',
      service: 'AWS EC2',
      description: 'Administrator unable to SSH into freshly provisioned Ubuntu EC2 instance in us-east-1.',
      logText: `$ ssh -i "devops-key.pem" ubuntu@ec2-54-210-44-12.compute-1.amazonaws.com
ssh: connect to host ec2-54-210-44-12.compute-1.amazonaws.com port 22: Connection timed out`,
      diagnostics: [
        {
          cmd: 'aws ec2 describe-instance-status --instance-id i-08a9c2b1',
          output: 'InstanceStatuses:\n  - InstanceId: i-08a9c2b1\n    InstanceState: { Code: 16, Name: running }\n    SystemStatus: { Status: ok }\n    InstanceStatus: { Status: ok }'
        },
        {
          cmd: 'aws ec2 describe-security-groups --group-ids sg-019ab2',
          output: 'SecurityGroups:\n  - GroupId: sg-019ab2\n    GroupName: default-sg\n    IpPermissions: []  # No inbound rules configured!'
        }
      ],
      options: [
        {
          id: 'opt-a',
          text: 'Reboot the EC2 instance from the AWS console.',
          isCorrect: false,
          feedback: 'Incorrect. Both AWS system and instance status checks are 2/2 OK. The instance OS is running normally; network packets are being blocked by the security group.'
        },
        {
          id: 'opt-b',
          text: 'Authorize inbound TCP port 22 in the EC2 Security Group rules for your workstation IP CIDR.',
          isCorrect: true,
          feedback: 'Correct! A timeout indicates packet dropping at the AWS perimeter. AWS Security Groups drop all inbound traffic by default until port 22 is explicitly permitted.'
        },
        {
          id: 'opt-c',
          text: 'Change instance type from t3.micro to m5.large.',
          isCorrect: false,
          feedback: 'Incorrect. Vertical scaling does not modify security group ingress filters.'
        }
      ]
    },
    {
      id: 'nginx-502',
      title: 'Nginx: HTTP 502 Bad Gateway',
      severity: 'critical',
      service: 'Nginx / App Server',
      description: 'External clients receive HTTP 502 Bad Gateway when querying public API endpoints.',
      logText: `2026/11/05 10:14:22 [error] 1420#1420: *1 connect() failed (111: Connection refused)
while connecting to upstream, client: 203.0.113.19, server: api.devops.io,
request: "GET /api/v1/health HTTP/1.1", upstream: "http://127.0.0.1:3000/api/v1/health",
host: "api.devops.io"`,
      diagnostics: [
        {
          cmd: 'systemctl status api-backend.service',
          output: '● api-backend.service - Node.js Backend Service\n   Loaded: loaded\n   Active: failed (Result: exit-code) since 10 minutes ago\n  Process: 2190 ExecStart=/usr/bin/node server.js (code=exited, status=1/FAILURE)'
        },
        {
          cmd: 'curl -I http://127.0.0.1:3000',
          output: 'curl: (7) Failed to connect to 127.0.0.1 port 3000: Connection refused'
        }
      ],
      options: [
        {
          id: 'opt-a',
          text: 'Change Nginx proxy_pass directive to port 80.',
          isCorrect: false,
          feedback: 'Incorrect. Nginx is already listening on port 80. Pointing proxy_pass to port 80 would create an infinite proxy loop.'
        },
        {
          id: 'opt-b',
          text: 'Inspect backend systemd logs (`journalctl -u api-backend`), fix unhandled exception, and restart the upstream service on port 3000.',
          isCorrect: true,
          feedback: 'Correct! HTTP 502 occurs when the reverse proxy cannot establish a connection with the upstream application (Connection refused on port 3000). Resolving the crash in `api-backend` fixes the gateway response.'
        },
        {
          id: 'opt-c',
          text: 'Disable client SSL caching in Nginx.',
          isCorrect: false,
          feedback: 'Incorrect. SSL configuration has no bearing on local socket connection refusals.'
        }
      ]
    },
    {
      id: 'disk-full-100',
      title: 'Linux: Root Filesystem at 100% Usage',
      severity: 'warning',
      service: 'Storage / OS',
      description: 'Production Ubuntu server cannot write pidfiles or session data due to full root partition.',
      logText: `Nov  5 11:20:01 prod-srv kernel: [ 4812.19] EXT4-fs error (device nvme0n1p1): ext4_lookup: deleted inode referenced: 14418
Nov  5 11:20:02 prod-srv systemd[1]: Failed to write session file: No space left on device
Nov  5 11:20:03 prod-srv cron[912]: (CRON) DEATH (can't write to /var/run/cron.pid)`,
      diagnostics: [
        {
          cmd: 'df -h /',
          output: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/nvme0n1p1   50G   50G     0 100% /'
        },
        {
          cmd: 'du -sh /var/log/journal/*',
          output: '34G\t/var/log/journal/9f4a2b8e...'
        }
      ],
      options: [
        {
          id: 'opt-a',
          text: 'Reformat the root disk using `mkfs.ext4 /dev/nvme0n1p1`.',
          isCorrect: false,
          feedback: 'Incorrect. Reformatting the mounted root partition wipes all data and destroys the operating system.'
        },
        {
          id: 'opt-b',
          text: 'Vacuum systemd journal logs (`journalctl --vacuum-time=3d`), prune unneeded Docker artifacts, and configure logrotate retention.',
          isCorrect: true,
          feedback: 'Correct! The diagnostic `du` check proved systemd journal logs were hoarding 34GB of the 50GB disk. Vacuuming journal entries immediately frees disk blocks, and setting logrotate bounds ensures it does not recur.'
        },
        {
          id: 'opt-c',
          text: 'Delete /etc/hosts to reclaim disk space.',
          isCorrect: false,
          feedback: 'Incorrect. `/etc/hosts` is only a few bytes in size and is critical for hostname resolution.'
        }
      ]
    }
  ];

  let currentIncidentIndex = 0;
  const solvedIncidents = new Set();

  /* --------------------------------------------------------------------------
     Render Tabs & Workspace
     -------------------------------------------------------------------------- */
  function renderIncidentTabs() {
    const tabsContainer = document.getElementById('sim-nav-tabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = '';
    incidentsData.forEach((inc, idx) => {
      const btn = document.createElement('button');
      btn.className = 'sim-tab-btn' + (idx === currentIncidentIndex ? ' active' : '') + (solvedIncidents.has(inc.id) ? ' solved' : '');
      btn.innerHTML = `
        <span class="status-dot"></span>
        <span>#${idx + 1} ${inc.title.split(':')[0]}</span>
      `;
      btn.addEventListener('click', () => {
        currentIncidentIndex = idx;
        renderCurrentIncident();
        renderIncidentTabs();
      });
      tabsContainer.appendChild(btn);
    });

    updateSolvedCounter();
  }

  function renderCurrentIncident() {
    const inc = incidentsData[currentIncidentIndex];
    if (!inc) return;

    const titleEl = document.getElementById('sim-title');
    const badgeEl = document.getElementById('sim-severity');
    const descEl = document.getElementById('sim-desc');
    const logViewer = document.getElementById('sim-log-viewer');
    const diagGroup = document.getElementById('sim-diag-buttons');
    const optionsList = document.getElementById('sim-options-list');
    const feedbackBox = document.getElementById('sim-feedback-box');

    if (titleEl) titleEl.textContent = inc.title;
    if (badgeEl) {
      badgeEl.textContent = inc.severity;
      badgeEl.className = 'sim-severity-badge ' + inc.severity;
    }
    if (descEl) descEl.textContent = inc.description;
    if (logViewer) logViewer.textContent = inc.logText;

    if (feedbackBox) {
      feedbackBox.className = 'sim-feedback-box';
      feedbackBox.style.display = 'none';
      feedbackBox.innerHTML = '';
    }

    // Diagnostics buttons
    if (diagGroup) {
      diagGroup.innerHTML = '';
      inc.diagnostics.forEach((diag) => {
        const btn = document.createElement('button');
        btn.className = 'sim-diag-btn';
        btn.innerHTML = `<span style="color: var(--accent-green);">$</span> ${diag.cmd}`;
        btn.addEventListener('click', () => {
          if (logViewer) {
            logViewer.textContent = `$ ${diag.cmd}\n${diag.output}\n\n--- original logs ---\n${inc.logText}`;
          }
        });
        diagGroup.appendChild(btn);
      });
    }

    // Solution Options
    if (optionsList) {
      optionsList.innerHTML = '';
      inc.options.forEach((opt) => {
        const optBtn = document.createElement('button');
        optBtn.className = 'sim-option-btn';
        optBtn.textContent = opt.text;

        optBtn.addEventListener('click', () => {
          // Check solution
          const allOptionBtns = optionsList.querySelectorAll('.sim-option-btn');
          allOptionBtns.forEach((b) => (b.className = 'sim-option-btn'));

          if (opt.isCorrect) {
            optBtn.classList.add('selected-correct');
            feedbackBox.className = 'sim-feedback-box correct active';
            feedbackBox.style.display = 'block';
            feedbackBox.innerHTML = `<strong>[INCIDENT RESOLVED]</strong><br>${opt.feedback}`;
            solvedIncidents.add(inc.id);
            renderIncidentTabs();
            if (window.DevOpsMain && window.DevOpsMain.showToast) {
              window.DevOpsMain.showToast(`Incident #${currentIncidentIndex + 1} successfully remediated!`);
            }
          } else {
            optBtn.classList.add('selected-wrong');
            feedbackBox.className = 'sim-feedback-box wrong active';
            feedbackBox.style.display = 'block';
            feedbackBox.innerHTML = `<strong>[REMEDIATION FAILED]</strong><br>${opt.feedback}`;
          }
        });

        optionsList.appendChild(optBtn);
      });
    }
  }

  function updateSolvedCounter() {
    const counterEl = document.getElementById('sim-solved-counter');
    if (counterEl) {
      counterEl.textContent = `Resolved: ${solvedIncidents.size} / ${incidentsData.length}`;
    }
  }

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */
  function initSimulator() {
    renderIncidentTabs();
    renderCurrentIncident();
  }

  window.DevOpsTroubleshooting = {
    init: initSimulator,
    getIncidents: () => incidentsData
  };
})();

