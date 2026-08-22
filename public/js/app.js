/* ==========================================================================
   APK QA Platform - Production Client Router & Wizard Controller
   ========================================================================== */

let wizardState = {
  step: 1,
  apk: null,
  credentials: {
    username: '',
    password: '',
    role: 'Standard User',
    advanced: {
      loginScreen: 'Auto-detect',
      usernameField: 'Auto-detect',
      passwordField: 'Auto-detect',
      loginBtn: 'Auto-detect'
    }
  },
  tests: {
    functional: true,
    ui: true,
    crash: true,
    performance: true,
    network: true,
    security: true,
    compatibility: true
  },
  environment: {
    androidVersion: 'Android 15 (API 35) [Recommended]',
    device: 'Pixel 8 [Recommended]'
  },
  securityConfirmed: true
};

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  setupNavigation();
  renderView('dashboard');
}

function setupNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const view = tab.getAttribute('data-view');
      if (view) {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderView(view);
      }
    });
  });
}

function renderView(viewName, params = {}) {
  const container = document.getElementById('viewContainer');
  container.innerHTML = '';

  switch (viewName) {
    case 'dashboard':
      renderDashboardView(container);
      break;
    case 'wizard':
      renderWizardView(container, params.step || 1);
      break;
    case 'test-run':
      renderTestRunView(container, params.runId);
      break;
    case 'findings':
      renderFindingsView(container);
      break;
    case 'finding-detail':
      renderFindingDetailView(container, params.findingId);
      break;
    case 'version-compare':
      renderVersionCompareView(container);
      break;
    case 'reports':
      renderReportsView(container);
      break;
    case 'audit-logs':
      renderAuditLogsView(container);
      break;
    default:
      renderDashboardView(container);
  }
}

// ==========================================================================
// 1. DYNAMIC DASHBOARD & EMPTY STATE VIEW (Requirement #5 & #15)
// ==========================================================================
async function renderDashboardView(container) {
  container.innerHTML = `<div class="card"><p style="color: var(--text-muted);">Loading QA Platform Dashboard...</p></div>`;

  try {
    const runs = await apiClient.getTestRuns();
    const findings = await apiClient.getFindings();

    // Check if database is empty (no test runs yet)
    if (!runs || runs.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 64px 32px; max-width: 800px; margin: 40px auto; background: var(--bg-card);">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(99, 102, 241, 0.1); color: var(--primary); display: inline-flex; align-items: center; justify-content: center; font-size: 36px; margin-bottom: 24px;">
            <i class="fa-solid fa-cloud-arrow-up"></i>
          </div>
          <h2 style="font-size: 26px; font-weight: 700; margin-bottom: 12px;">No Applications Tested Yet</h2>
          <p style="color: var(--text-muted); font-size: 15px; max-width: 540px; margin: 0 auto 28px; line-height: 1.6;">
            Upload your Android APK file, configure optional test credentials, and run automated static, dynamic, security, and performance analysis.
          </p>
          <button class="btn btn-primary" onclick="switchView('wizard')" style="font-size: 16px; padding: 14px 32px; font-weight: 700; box-shadow: 0 0 24px var(--primary-glow);">
            <i class="fa-solid fa-plus"></i> New QA Test
          </button>
        </div>
      `;
      return;
    }

    // Calculate real dynamic statistics from DB records
    const totalRuns = runs.length;
    const completedRuns = runs.filter(r => r.status === 'COMPLETED').length;
    const totalFindings = findings.length;
    const criticals = findings.filter(f => f.severity === 'CRITICAL').length;
    const highs = findings.filter(f => f.severity === 'HIGH').length;

    let overallScore = 100;
    if (totalFindings > 0) {
      overallScore = Math.max(10, 100 - (criticals * 25 + highs * 10 + (totalFindings - criticals - highs) * 3));
    }

    const latestRun = runs[0];

    container.innerHTML = `
      <!-- Top Banner with + New QA Test Button -->
      <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, #111827 0%, #1e1b4b 100%);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span class="badge badge-info" style="margin-bottom: 8px;">System Active</span>
            <h2 style="font-size: 24px; font-weight: 700;">QA Platform Overview</h2>
            <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">Latest Test Run: <strong>#${latestRun.id}</strong> (${latestRun.environment || 'Android 15'})</p>
          </div>
          <button class="btn btn-primary" onclick="switchView('wizard')" style="font-size: 15px; padding: 12px 24px; font-weight: 700;">
            <i class="fa-solid fa-plus"></i> New QA Test
          </button>
        </div>
      </div>

      <!-- Real Dynamic Metrics -->
      <div class="grid grid-cols-4" style="margin-bottom: 24px;">
        <div class="card">
          <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Overall QA Score</span>
          <div style="display: flex; align-items: baseline; gap: 8px; margin-top: 8px;">
            <h1 style="font-size: 36px; color: ${overallScore >= 80 ? 'var(--accent-emerald)' : (overallScore >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)')};">${overallScore}</h1>
            <span style="font-size: 14px; color: var(--text-muted);">/ 100</span>
          </div>
          <div class="progress-bar-container"><div class="progress-bar-fill" style="width: ${overallScore}%;"></div></div>
        </div>

        <div class="card">
          <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total QA Runs</span>
          <h1 style="font-size: 36px; color: var(--accent-cyan); margin-top: 8px;">${totalRuns}</h1>
          <span style="font-size: 12px; color: var(--accent-emerald);"><i class="fa-solid fa-circle-check"></i> ${completedRuns} Completed</span>
        </div>

        <div class="card">
          <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Critical & High Issues</span>
          <h1 style="font-size: 36px; color: ${criticals + highs > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'}; margin-top: 8px;">${criticals + highs}</h1>
          <span style="font-size: 12px; color: var(--text-muted);">${criticals} Critical, ${highs} High</span>
        </div>

        <div class="card">
          <span style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Active Environment</span>
          <h3 style="font-size: 18px; color: var(--text-main); margin-top: 12px;">Pixel 8 Container</h3>
          <span style="font-size: 12px; color: var(--accent-cyan);">Android 15 (API 35)</span>
        </div>
      </div>

      <!-- Recent Test Runs & Findings Tables -->
      <div class="grid grid-cols-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fa-solid fa-bolt"></i> Recent Test Executions</h3>
            <button class="btn btn-secondary btn-sm" onclick="switchView('wizard')">+ New Test</button>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Run ID</th><th>Status</th><th>Progress</th><th>Action</th></tr></thead>
              <tbody>
                ${runs.map(r => `
                  <tr>
                    <td><strong>${r.id}</strong></td>
                    <td><span class="badge badge-${r.status === 'COMPLETED' ? 'low' : (r.status === 'FAILED' ? 'critical' : 'high')}">${r.status}</span></td>
                    <td>${r.progress}%</td>
                    <td><button class="btn btn-secondary btn-sm" onclick="switchView('test-run', { runId: '${r.id}' })">Inspect</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title"><i class="fa-solid fa-triangle-exclamation"></i> Discovered Findings</h3>
            <button class="btn btn-secondary btn-sm" onclick="switchView('findings')">View All</button>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Severity</th><th>Title</th><th>Action</th></tr></thead>
              <tbody>
                ${findings.length > 0 ? findings.map(f => `
                  <tr>
                    <td><span class="badge badge-${f.severity.toLowerCase()}">${f.severity}</span></td>
                    <td><strong>${f.title}</strong></td>
                    <td><button class="btn btn-secondary btn-sm" onclick="switchView('finding-detail', { findingId: '${f.id}' })">Investigate</button></td>
                  </tr>
                `).join('') : '<tr><td colspan="3" style="color: var(--text-muted); text-align: center;">No findings recorded yet.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
  }
}

// ==========================================================================
// 2. MULTI-STEP "+ NEW QA TEST" WIZARD (Requirements #1 - #12)
// ==========================================================================
function renderWizardView(container, stepNum = 1) {
  wizardState.step = stepNum;

  container.innerHTML = `
    <div class="wizard-stepper">
      <div class="step-item ${stepNum >= 1 ? (stepNum > 1 ? 'completed' : 'active') : ''}">
        <div class="step-number">${stepNum > 1 ? '✓' : '1'}</div>
        <span>Upload APK</span>
      </div>
      <div class="step-item ${stepNum >= 2 ? (stepNum > 2 ? 'completed' : 'active') : ''}">
        <div class="step-number">${stepNum > 2 ? '✓' : '2'}</div>
        <span>Test Account Credentials</span>
      </div>
      <div class="step-item ${stepNum >= 3 ? (stepNum > 3 ? 'completed' : 'active') : ''}">
        <div class="step-number">${stepNum > 3 ? '✓' : '3'}</div>
        <span>Testing Config</span>
      </div>
      <div class="step-item ${stepNum >= 4 ? (stepNum > 4 ? 'completed' : 'active') : ''}">
        <div class="step-number">${stepNum > 4 ? '✓' : '4'}</div>
        <span>Environment</span>
      </div>
      <div class="step-item ${stepNum === 5 ? 'active' : ''}">
        <div class="step-number">5</div>
        <span>Review & Start</span>
      </div>
    </div>

    <div id="wizardStepBody"></div>
  `;

  const body = document.getElementById('wizardStepBody');

  if (stepNum === 1) renderWizardStep1(body);
  else if (stepNum === 2) renderWizardStep2(body);
  else if (stepNum === 3) renderWizardStep3(body);
  else if (stepNum === 4) renderWizardStep4(body);
  else if (stepNum === 5) renderWizardStep5(body);
}

function renderWizardStep1(body) {
  body.innerHTML = `
    <div class="card" style="max-width: 800px; margin: 0 auto;">
      <div class="card-header">
        <h3 class="card-title"><i class="fa-solid fa-cloud-arrow-up"></i> Step 1: Upload APK File</h3>
      </div>

      <div class="upload-dropzone" id="wizardDropzone">
        <i class="fa-solid fa-file-zipper upload-icon"></i>
        <h3>Drag & Drop APK here or Browse Files</h3>
        <p style="color: var(--text-muted); font-size: 13px; margin: 8px 0 16px;">Supports .apk binaries up to 250MB</p>
        <input type="file" id="wizardFileInput" accept=".apk" style="display: none;">
        <button class="btn btn-primary" onclick="document.getElementById('wizardFileInput').click()"><i class="fa-solid fa-folder-open"></i> Browse Files</button>
      </div>

      <div id="wProgressBox" style="display: none; margin-top: 24px;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
          <span id="wFileName">Uploaded_App.apk</span>
          <span id="wPct">0%</span>
        </div>
        <div class="progress-bar-container"><div class="progress-bar-fill" id="wBarFill"></div></div>
      </div>

      <div id="wApkMetaCard" class="card" style="display: ${wizardState.apk ? 'block' : 'none'}; margin-top: 24px; background: var(--bg-dark);">
        <h4 style="color: var(--accent-cyan); margin-bottom: 12px;"><i class="fa-solid fa-circle-check"></i> APK Metadata Extracted</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;" id="wMetaDetails">
          ${wizardState.apk ? `
            <div><strong>Package Name:</strong> ${wizardState.apk.package_name}</div>
            <div><strong>Version:</strong> ${wizardState.apk.version_name} (Code ${wizardState.apk.version_code})</div>
            <div><strong>Target SDK:</strong> Android ${wizardState.apk.target_sdk}</div>
            <div><strong>SHA-256:</strong> <span style="font-family: monospace; font-size: 11px;">${wizardState.apk.sha256.substring(0, 16)}...</span></div>
          ` : ''}
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: 24px;">
        <button class="btn btn-primary" id="wStep1NextBtn" ${wizardState.apk ? '' : 'disabled'} onclick="renderWizardView(document.getElementById('viewContainer'), 2)">
          Next: Test Account Credentials &rarr;
        </button>
      </div>
    </div>
  `;

  const dropzone = document.getElementById('wizardDropzone');
  const fileInput = document.getElementById('wizardFileInput');

  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleWizardFileUpload(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) handleWizardFileUpload(fileInput.files[0]);
  });
}

async function handleWizardFileUpload(file) {
  if (!file.name.endsWith('.apk')) { alert('Please select a valid .apk file'); return; }

  document.getElementById('wProgressBox').style.display = 'block';
  document.getElementById('wFileName').textContent = file.name;

  const formData = new FormData();
  formData.append('file', file);

  let pct = 0;
  const timer = setInterval(() => {
    pct = Math.min(pct + 25, 90);
    document.getElementById('wPct').textContent = `${pct}%`;
    document.getElementById('wBarFill').style.width = `${pct}%`;
  }, 80);

  try {
    const uploadedApk = await apiClient.uploadApk('PRJ-DEFAULT', formData);
    clearInterval(timer);
    document.getElementById('wPct').textContent = `100%`;
    document.getElementById('wBarFill').style.width = `100%`;

    wizardState.apk = uploadedApk;
    document.getElementById('wApkMetaCard').style.display = 'block';
    document.getElementById('wMetaDetails').innerHTML = `
      <div><strong>Package Name:</strong> ${uploadedApk.package_name}</div>
      <div><strong>Version:</strong> ${uploadedApk.version_name} (Code ${uploadedApk.version_code})</div>
      <div><strong>Target SDK:</strong> Android ${uploadedApk.target_sdk}</div>
      <div><strong>SHA-256:</strong> <span style="font-family: monospace; font-size: 11px;">${uploadedApk.sha256.substring(0, 16)}...</span></div>
    `;

    document.getElementById('wStep1NextBtn').disabled = false;
  } catch (err) {
    clearInterval(timer);
    alert(`APK Upload Error: ${err.message}`);
  }
}

function renderWizardStep2(body) {
  body.innerHTML = `
    <div class="card" style="max-width: 800px; margin: 0 auto;">
      <div class="card-header">
        <h3 class="card-title"><i class="fa-solid fa-user-shield"></i> Step 2: Application Test Credentials</h3>
      </div>

      <div class="security-notice-banner">
        <h4><i class="fa-solid fa-lock"></i> Application Test Credentials</h4>
        <p>Provide a test account that the QA system can use to log into your application and test authenticated features. These credentials will only be used by the automated QA environment to test your APK.</p>
      </div>

      <div class="form-group">
        <label class="form-label">Username / Email</label>
        <input type="text" class="form-control" id="wCredUsername" value="${wizardState.credentials.username}" placeholder="e.g. qa.testuser@example.com">
      </div>

      <div class="form-group">
        <label class="form-label">Password</label>
        <div class="password-input-group">
          <input type="password" class="form-control" id="wCredPassword" value="${wizardState.credentials.password}" placeholder="Enter test account password">
          <button class="toggle-password-btn" type="button" onclick="togglePasswordVisibility()"><i class="fa-solid fa-eye" id="passToggleIcon"></i></button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Account Role</label>
        <select class="form-control" id="wCredRole">
          <option ${wizardState.credentials.role === 'Standard User' ? 'selected' : ''}>Standard User</option>
          <option ${wizardState.credentials.role === 'Admin' ? 'selected' : ''}>Admin</option>
          <option ${wizardState.credentials.role === 'Manager' ? 'selected' : ''}>Manager</option>
          <option ${wizardState.credentials.role === 'Guest' ? 'selected' : ''}>Guest</option>
          <option ${wizardState.credentials.role === 'Custom' ? 'selected' : ''}>Custom</option>
        </select>
      </div>

      <details style="margin-top: 16px; background: var(--bg-dark); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <summary style="cursor: pointer; color: var(--accent-cyan); font-size: 13px; font-weight: 600;">
          <i class="fa-solid fa-sliders"></i> Advanced Authentication Configuration (Optional)
        </summary>
        <p style="font-size: 12px; color: var(--text-muted); margin: 8px 0 12px;">Only specify if automatic field detection fails.</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px;">
          <div><label class="form-label">Login Screen</label><input type="text" class="form-control" id="wAdvScreen" value="${wizardState.credentials.advanced.loginScreen}"></div>
          <div><label class="form-label">Username Field</label><input type="text" class="form-control" id="wAdvUser" value="${wizardState.credentials.advanced.usernameField}"></div>
          <div><label class="form-label">Password Field</label><input type="text" class="form-control" id="wAdvPass" value="${wizardState.credentials.advanced.passwordField}"></div>
          <div><label class="form-label">Login Button</label><input type="text" class="form-control" id="wAdvBtn" value="${wizardState.credentials.advanced.loginBtn}"></div>
        </div>
      </details>

      <div style="display: flex; justify-content: space-between; margin-top: 24px;">
        <button class="btn btn-secondary" onclick="renderWizardView(document.getElementById('viewContainer'), 1)">&larr; Back</button>
        <button class="btn btn-primary" onclick="saveWizardStep2Data()">Next: Testing Config &rarr;</button>
      </div>
    </div>
  `;
}

window.togglePasswordVisibility = function() {
  const input = document.getElementById('wCredPassword');
  const icon = document.getElementById('passToggleIcon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fa-solid fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fa-solid fa-eye';
  }
};

function saveWizardStep2Data() {
  wizardState.credentials.username = document.getElementById('wCredUsername').value;
  wizardState.credentials.password = document.getElementById('wCredPassword').value;
  wizardState.credentials.role = document.getElementById('wCredRole').value;
  wizardState.credentials.advanced = {
    loginScreen: document.getElementById('wAdvScreen').value,
    usernameField: document.getElementById('wAdvUser').value,
    passwordField: document.getElementById('wAdvPass').value,
    loginBtn: document.getElementById('wAdvBtn').value
  };

  renderWizardView(document.getElementById('viewContainer'), 3);
}

function renderWizardStep3(body) {
  body.innerHTML = `
    <div class="card" style="max-width: 800px; margin: 0 auto;">
      <div class="card-header">
        <h3 class="card-title"><i class="fa-solid fa-list-check"></i> Step 3: What should we test?</h3>
        <button class="btn btn-secondary btn-sm" onclick="selectAllTests()"><i class="fa-solid fa-check-double"></i> Select Recommended</button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <label class="card" style="display: flex; gap: 12px; cursor: pointer; padding: 16px;">
          <input type="checkbox" id="chkFunc" ${wizardState.tests.functional ? 'checked' : ''}>
          <div><strong>Functional Testing</strong><p style="font-size: 12px; color: var(--text-muted);">Tests core app workflows & user actions</p></div>
        </label>
        <label class="card" style="display: flex; gap: 12px; cursor: pointer; padding: 16px;">
          <input type="checkbox" id="chkUI" ${wizardState.tests.ui ? 'checked' : ''}>
          <div><strong>UI / UX Exploration</strong><p style="font-size: 12px; color: var(--text-muted);">Checks layout overflow & view responsiveness</p></div>
        </label>
        <label class="card" style="display: flex; gap: 12px; cursor: pointer; padding: 16px;">
          <input type="checkbox" id="chkCrash" ${wizardState.tests.crash ? 'checked' : ''}>
          <div><strong>Crash & Logcat Monitor</strong><p style="font-size: 12px; color: var(--text-muted);">Captures unhandled exceptions & memory leaks</p></div>
        </label>
        <label class="card" style="display: flex; gap: 12px; cursor: pointer; padding: 16px;">
          <input type="checkbox" id="chkPerf" ${wizardState.tests.performance ? 'checked' : ''}>
          <div><strong>Performance Profiling</strong><p style="font-size: 12px; color: var(--text-muted);">Profiles CPU, RAM memory & FPS metrics</p></div>
        </label>
        <label class="card" style="display: flex; gap: 12px; cursor: pointer; padding: 16px;">
          <input type="checkbox" id="chkNet" ${wizardState.tests.network ? 'checked' : ''}>
          <div><strong>Network & API Testing</strong><p style="font-size: 12px; color: var(--text-muted);">Inspects latency spikes & unencrypted HTTP</p></div>
        </label>
        <label class="card" style="display: flex; gap: 12px; cursor: pointer; padding: 16px;">
          <input type="checkbox" id="chkSec" ${wizardState.tests.security ? 'checked' : ''}>
          <div><strong>Security Audit</strong><p style="font-size: 12px; color: var(--text-muted);">Scans hardcoded API keys & manifest permissions</p></div>
        </label>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 24px;">
        <button class="btn btn-secondary" onclick="renderWizardView(document.getElementById('viewContainer'), 2)">&larr; Back</button>
        <button class="btn btn-primary" onclick="saveWizardStep3Data()">Next: Test Environment &rarr;</button>
      </div>
    </div>
  `;
}

window.selectAllTests = function() {
  ['chkFunc', 'chkUI', 'chkCrash', 'chkPerf', 'chkNet', 'chkSec'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = true;
  });
};

function saveWizardStep3Data() {
  wizardState.tests = {
    functional: document.getElementById('chkFunc').checked,
    ui: document.getElementById('chkUI').checked,
    crash: document.getElementById('chkCrash').checked,
    performance: document.getElementById('chkPerf').checked,
    network: document.getElementById('chkNet').checked,
    security: document.getElementById('chkSec').checked
  };

  renderWizardView(document.getElementById('viewContainer'), 4);
}

function renderWizardStep4(body) {
  body.innerHTML = `
    <div class="card" style="max-width: 800px; margin: 0 auto;">
      <div class="card-header">
        <h3 class="card-title"><i class="fa-solid fa-mobile-screen"></i> Step 4: Select Test Environment</h3>
      </div>

      <div class="form-group">
        <label class="form-label">Android Version</label>
        <select class="form-control" id="wEnvVer">
          <option ${wizardState.environment.androidVersion.includes('Android 15') ? 'selected' : ''}>Android 15 (API 35) [Recommended]</option>
          <option ${wizardState.environment.androidVersion.includes('Android 14') ? 'selected' : ''}>Android 14 (API 34)</option>
          <option ${wizardState.environment.androidVersion.includes('Android 13') ? 'selected' : ''}>Android 13 (API 33)</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Device Preset</label>
        <select class="form-control" id="wEnvDevice">
          <option ${wizardState.environment.device.includes('Pixel 8') ? 'selected' : ''}>Pixel 8 [Recommended Device]</option>
          <option ${wizardState.environment.device.includes('Pixel 7 Pro') ? 'selected' : ''}>Pixel 7 Pro</option>
          <option ${wizardState.environment.device.includes('Samsung Galaxy S23') ? 'selected' : ''}>Samsung Galaxy S23</option>
        </select>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 24px;">
        <button class="btn btn-secondary" onclick="renderWizardView(document.getElementById('viewContainer'), 3)">&larr; Back</button>
        <button class="btn btn-primary" onclick="saveWizardStep4Data()">Next: Complete Review &rarr;</button>
      </div>
    </div>
  `;
}

function saveWizardStep4Data() {
  wizardState.environment.androidVersion = document.getElementById('wEnvVer').value;
  wizardState.environment.device = document.getElementById('wEnvDevice').value;
  renderWizardView(document.getElementById('viewContainer'), 5);
}

function renderWizardStep5(body) {
  const activeTests = Object.keys(wizardState.tests).filter(k => wizardState.tests[k]).map(k => k.toUpperCase());

  body.innerHTML = `
    <div class="card" style="max-width: 800px; margin: 0 auto;">
      <div class="card-header">
        <h3 class="card-title"><i class="fa-solid fa-clipboard-check"></i> Step 5: Review & Start QA Test</h3>
      </div>

      <div class="review-box">
        <div class="review-box-header">
          <h4>Application Information</h4>
          <button class="btn btn-secondary btn-sm" onclick="renderWizardView(document.getElementById('viewContainer'), 1)">Edit</button>
        </div>
        <p><strong>Package Name:</strong> ${wizardState.apk ? wizardState.apk.package_name : 'Uploaded APK'}</p>
        <p><strong>Version:</strong> ${wizardState.apk ? wizardState.apk.version_name : '1.0.0'} (Code ${wizardState.apk ? wizardState.apk.version_code : 1})</p>
      </div>

      <div class="review-box">
        <div class="review-box-header">
          <h4>Application Test Account</h4>
          <button class="btn btn-secondary btn-sm" onclick="renderWizardView(document.getElementById('viewContainer'), 2)">Edit</button>
        </div>
        <p><strong>Username/Email:</strong> ${wizardState.credentials.username || 'No test account provided'}</p>
        <p><strong>Password:</strong> ${wizardState.credentials.password ? '•••••••• (Encrypted at rest)' : 'Not specified'}</p>
        <p><strong>Account Role:</strong> ${wizardState.credentials.role}</p>
      </div>

      <div class="review-box">
        <div class="review-box-header">
          <h4>Testing Configuration & Environment</h4>
          <button class="btn btn-secondary btn-sm" onclick="renderWizardView(document.getElementById('viewContainer'), 3)">Edit</button>
        </div>
        <p><strong>Selected Tests:</strong> ${activeTests.join(', ')}</p>
        <p><strong>Environment:</strong> ${wizardState.environment.device} / ${wizardState.environment.androidVersion}</p>
      </div>

      <div class="security-notice-banner" style="margin-top: 20px;">
        <label style="display: flex; gap: 10px; cursor: pointer; align-items: flex-start;">
          <input type="checkbox" id="wSecConfirm" ${wizardState.securityConfirmed ? 'checked' : ''} style="margin-top: 3px;">
          <span style="font-size: 13px;">I understand that the provided test credentials will be encrypted at rest and used strictly by the automated QA system to test authenticated application features.</span>
        </label>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 24px;">
        <button class="btn btn-secondary" onclick="renderWizardView(document.getElementById('viewContainer'), 4)">&larr; Back</button>
        <button class="btn btn-primary" style="font-size: 16px; padding: 12px 28px; font-weight: 700;" onclick="submitStartQaTest()">
          <i class="fa-solid fa-play"></i> Start QA Test
        </button>
      </div>
    </div>
  `;
}

async function submitStartQaTest() {
  const secChk = document.getElementById('wSecConfirm');
  if (secChk && !secChk.checked) {
    alert('Please confirm the Test Account Security Notice.');
    return;
  }

  let credId = null;

  if (wizardState.credentials.username) {
    try {
      const savedCred = await apiClient.saveTestCredentials({
        project_id: 'PRJ-DEFAULT',
        apk_id: wizardState.apk ? wizardState.apk.id : null,
        username_or_email: wizardState.credentials.username,
        password: wizardState.credentials.password,
        role: wizardState.credentials.role,
        advanced_config: wizardState.credentials.advanced
      });
      credId = savedCred.id;
    } catch (err) {
      console.error('Credentials save warning:', err);
    }
  }

  try {
    const run = await apiClient.createTestRun({
      project_id: 'PRJ-DEFAULT',
      apk_id: wizardState.apk ? wizardState.apk.id : 'APK-101',
      credential_id: credId,
      environment: `${wizardState.environment.device} - ${wizardState.environment.androidVersion}`,
      testing_config: wizardState.tests
    });

    switchView('test-run', { runId: run.id });
  } catch (err) {
    alert(`Failed to start QA Test Run: ${err.message}`);
  }
}

// ==========================================================================
// 3. REAL-TIME TEST RUN EXECUTION VIEW
// ==========================================================================
function renderTestRunView(container, runId) {
  container.innerHTML = `
    <div class="card" style="margin-bottom: 24px;">
      <div class="card-header">
        <div>
          <h2 style="font-size: 20px;">QA Execution Run #${runId || 'RUN-LATEST'}</h2>
          <p style="color: var(--text-muted); font-size: 13px;">Target: Pixel 8 Container (Android 15)</p>
        </div>
        <span class="badge badge-info" id="runStageBadge">QUEUED</span>
      </div>

      <div style="display: flex; justify-content: space-between; font-size: 13px;">
        <span id="stageLabelText">Initializing task worker state machine...</span>
        <strong id="runPctText" style="color: var(--accent-cyan);">0%</strong>
      </div>
      <div class="progress-bar-container"><div class="progress-bar-fill" id="runProgressBarFill" style="width: 0%;"></div></div>
    </div>

    <div class="grid grid-cols-2">
      <div class="card">
        <h3 class="card-title" style="margin-bottom: 16px;"><i class="fa-solid fa-list-check"></i> QA Pipeline Checklist</h3>
        <div id="checklistItems" style="font-size: 14px; line-height: 2;">
          <div id="chk-VALIDATING">○ APK Validation & Signature</div>
          <div id="chk-STATIC_ANALYSIS">○ Static Code & Binary Analysis</div>
          <div id="chk-STARTING_ENVIRONMENT">○ Emulator Container Startup</div>
          <div id="chk-AUTHENTICATING">○ Application Test Account Authentication</div>
          <div id="chk-DYNAMIC_TESTING">○ Dynamic Functional UI Exploration</div>
          <div id="chk-NETWORK_ANALYSIS">○ Network Traffic & Latency Scan</div>
          <div id="chk-PERFORMANCE_ANALYSIS">○ CPU, RAM & FPS Profiling</div>
          <div id="chk-SECURITY_ANALYSIS">○ Security & Secret Scanning</div>
          <div id="chk-AI_ANALYSIS">○ AI Explanation Generation</div>
          <div id="chk-REPORT_GENERATION">○ Final QA Report Synthesizer</div>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title" style="margin-bottom: 16px;"><i class="fa-solid fa-terminal"></i> Logcat & Execution Terminal</h3>
        <div class="terminal-box" id="terminalLog">
          <div class="terminal-line info">[INIT] SSE Real-time log connection established...</div>
        </div>
      </div>
    </div>
  `;

  if (runId) {
    connectSSE(runId);
  }
}

function connectSSE(runId) {
  const evtSource = new EventSource(`/api/test-runs/${runId}/progress`);
  
  evtSource.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.status) {
      document.getElementById('runStageBadge').textContent = data.status;
      document.getElementById('runStageBadge').className = `badge badge-${data.status === 'COMPLETED' ? 'low' : 'info'}`;
      document.getElementById('stageLabelText').textContent = data.label || data.status;
      document.getElementById('runPctText').textContent = `${data.progress}%`;
      document.getElementById('runProgressBarFill').style.width = `${data.progress}%`;

      const chk = document.getElementById(`chk-${data.status}`);
      if (chk) chk.innerHTML = `<span style="color: var(--accent-emerald); font-weight: 700;">✓</span> ${chk.textContent.substring(2)}`;

      const term = document.getElementById('terminalLog');
      if (term) {
        term.innerHTML += `<div class="terminal-line">[${new Date().toLocaleTimeString()}] ${data.label || data.status}</div>`;
        term.scrollTop = term.scrollHeight;
      }

      if (data.status === 'COMPLETED') {
        evtSource.close();
        setTimeout(() => switchView('findings'), 1500);
      }
    }
  };

  evtSource.onerror = () => evtSource.close();
}

// ==========================================================================
// 4. FINDINGS & INVESTIGATION VIEW
// ==========================================================================
async function renderFindingsView(container) {
  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fa-solid fa-bug"></i> Discovered QA Findings</h3>
        <button class="btn btn-secondary btn-sm" onclick="switchView('version-compare')"><i class="fa-solid fa-code-compare"></i> Compare Versions</button>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr><th>Severity</th><th>Finding ID</th><th>Title</th><th>Category</th><th>Confidence</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody id="findingsTableBody"><tr><td colspan="7">Loading findings...</td></tr></tbody>
        </table>
      </div>
    </div>
  `;

  try {
    const list = await apiClient.getFindings();
    if (!list || list.length === 0) {
      document.getElementById('findingsTableBody').innerHTML = `
        <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 32px;">No findings discovered yet. Upload an APK and run a test to generate findings.</td></tr>
      `;
      return;
    }

    document.getElementById('findingsTableBody').innerHTML = list.map(f => `
      <tr>
        <td><span class="badge badge-${f.severity.toLowerCase()}">${f.severity}</span></td>
        <td><strong>${f.id}</strong></td>
        <td><a href="#" onclick="switchView('finding-detail', { findingId: '${f.id}' }); return false;" style="color: white; font-weight: 600;">${f.title}</a></td>
        <td><span class="badge badge-info">${f.category}</span></td>
        <td>${f.confidence}</td>
        <td><span class="badge badge-secondary">${f.status}</span></td>
        <td><button class="btn btn-primary btn-sm" onclick="switchView('finding-detail', { findingId: '${f.id}' })">Investigate &rarr;</button></td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

async function renderFindingDetailView(container, findingId) {
  container.innerHTML = `<div class="card"><p style="color: var(--text-muted);">Loading investigation details...</p></div>`;

  try {
    const f = await apiClient.getFindingDetails(findingId || 'FND-101');
    const aiStandard = await apiClient.getAIExplanation(f.id, 'STANDARD');

    container.innerHTML = `
      <div class="card" style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <span class="badge badge-${f.severity.toLowerCase()}">${f.severity} SEVERITY</span>
              <span class="badge badge-info">${f.category}</span>
              <span class="badge badge-secondary">CONFIDENCE: ${f.confidence}</span>
            </div>
            <h2 style="font-size: 22px;">${f.title}</h2>
          </div>
          <button class="btn btn-primary" onclick="triggerRetestFinding('${f.id}')"><i class="fa-solid fa-rotate-right"></i> Retest Finding</button>
        </div>
      </div>

      <div class="card" style="margin-bottom: 24px;">
        <h4 style="font-size: 14px; color: var(--text-muted); margin-bottom: 12px;"><i class="fa-solid fa-wand-magic-sparkles" style="color: var(--primary);"></i> AI Finding Explanation Level</h4>
        <div class="ai-level-tabs">
          <button class="ai-tab" onclick="switchAiLevel('${f.id}', 'SIMPLE', this)">SIMPLE</button>
          <button class="ai-tab active" onclick="switchAiLevel('${f.id}', 'STANDARD', this)">STANDARD</button>
          <button class="ai-tab" onclick="switchAiLevel('${f.id}', 'TECHNICAL', this)">TECHNICAL</button>
        </div>
        <div id="aiExplanationBox" style="background: var(--bg-dark); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); font-size: 14px; line-height: 1.6;">
          <p style="white-space: pre-line;">${aiStandard.explanation}</p>
        </div>
      </div>

      <div class="grid grid-cols-2">
        <div class="card">
          <h3 class="card-title" style="margin-bottom: 12px;">Reproduction Steps</h3>
          <p style="font-size: 13px; color: var(--text-muted); white-space: pre-line;">${f.reproduction_steps}</p>
        </div>
        <div class="card">
          <h3 class="card-title" style="margin-bottom: 12px;">Evidence & Log Viewer</h3>
          <div class="terminal-box" style="font-size: 12px;">
            ${f.evidence && f.evidence.length > 0 ? f.evidence.map(e => `
              <div class="terminal-line">[${e.type}] ${e.content_json}</div>
            `).join('') : '<div class="terminal-line">No binary stack trace attached.</div>'}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
  }
}

window.switchAiLevel = async function(findingId, level, tabElem) {
  document.querySelectorAll('.ai-tab').forEach(t => t.classList.remove('active'));
  tabElem.classList.add('active');
  const aiData = await apiClient.getAIExplanation(findingId, level);
  document.getElementById('aiExplanationBox').innerHTML = `<p style="white-space: pre-line;">${aiData.explanation}</p>`;
};

window.triggerRetestFinding = async function(findingId) {
  const resp = await apiClient.retestFinding(findingId);
  alert(`Retest run ${resp.retestRunId} launched! Redirecting to live progress monitor...`);
  switchView('test-run', { runId: resp.retestRunId });
};

// ==========================================================================
// 5. DYNAMIC VERSION COMPARISON, REPORTS & AUDIT LOGS
// ==========================================================================
async function renderVersionCompareView(container) {
  container.innerHTML = `<div class="card"><p style="color: var(--text-muted);">Loading Version Comparison...</p></div>`;

  try {
    const comp = await apiClient.compareVersions('PRJ-DEFAULT', 'v1.0', 'v1.4');

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fa-solid fa-code-compare"></i> APK Version Comparison Engine</h3>
          <span class="badge badge-info">Comparing ${comp.apk1 ? comp.apk1.version_name : 'v1.0'} vs ${comp.apk2 ? comp.apk2.version_name : 'v1.4'}</span>
        </div>

        <div class="grid grid-cols-2" style="margin-bottom: 24px;">
          <div class="card" style="background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.3);">
            <h4 style="color: var(--accent-emerald);"><i class="fa-solid fa-check-double"></i> Fixed Issues (${comp.fixed ? comp.fixed.length : 0})</h4>
            <ul style="margin-top: 12px; font-size: 13px; color: var(--text-muted); padding-left: 20px;">
              ${comp.fixed && comp.fixed.length > 0 ? comp.fixed.map(f => `<li>${f.title}</li>`).join('') : '<li>No fixed issues found in comparison diff.</li>'}
            </ul>
          </div>
          <div class="card" style="background: rgba(244, 63, 94, 0.05); border-color: rgba(244, 63, 94, 0.3);">
            <h4 style="color: var(--accent-rose);"><i class="fa-solid fa-bug"></i> New / Unchanged Issues (${(comp.new_issues ? comp.new_issues.length : 0) + (comp.unchanged ? comp.unchanged.length : 0)})</h4>
            <ul style="margin-top: 12px; font-size: 13px; color: var(--text-muted); padding-left: 20px;">
              ${comp.new_issues && comp.new_issues.length > 0 ? comp.new_issues.map(f => `<li>${f.title}</li>`).join('') : ''}
              ${comp.unchanged && comp.unchanged.length > 0 ? comp.unchanged.map(f => `<li>${f.title} (Unchanged)</li>`).join('') : ''}
              ${(!comp.new_issues || comp.new_issues.length === 0) && (!comp.unchanged || comp.unchanged.length === 0) ? '<li>No issues detected.</li>' : ''}
            </ul>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
  }
}

async function renderReportsView(container) {
  container.innerHTML = `<div class="card"><p style="color: var(--text-muted);">Loading QA Benchmark Report...</p></div>`;

  try {
    const report = await apiClient.getReport('latest');
    if (!report) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 48px;">
          <h3>No Reports Generated Yet</h3>
          <p style="color: var(--text-muted); margin-top: 8px;">Run a QA test to synthesize executive benchmark reports.</p>
          <button class="btn btn-primary" onclick="switchView('wizard')" style="margin-top: 16px;">+ New QA Test</button>
        </div>
      `;
      return;
    }

    let summary = {};
    try { summary = typeof report.summary_json === 'string' ? JSON.parse(report.summary_json) : report.summary_json; } catch(e) {}

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fa-solid fa-file-contract"></i> QA Executive Summary Report</h3>
          <button class="btn btn-primary" onclick="window.print()"><i class="fa-solid fa-print"></i> Export / Print Report</button>
        </div>

        <div style="padding: 24px; background: var(--bg-dark); border-radius: var(--radius-md);">
          <h3>QA Benchmark Executive Report</h3>
          <p style="color: var(--text-muted); font-size: 13px; margin-top: 4px;">Target Package: <strong>${summary.package_name || 'com.qa.app'}</strong> | Generated: ${new Date(report.created_at).toLocaleString()}</p>
          <hr style="border-color: var(--border-color); margin: 16px 0;">
          <div style="font-size: 14px; line-height: 1.8;">
            <p><strong>Overall QA Score:</strong> <span style="color: var(--accent-emerald); font-weight: 700;">${report.qa_score || summary.qaScore || 100} / 100</span></p>
            <p><strong>Total Discovered Findings:</strong> ${summary.total_findings || 0}</p>
            <p><strong>Critical Severity Findings:</strong> ${summary.critical || 0}</p>
            <p><strong>High Severity Findings:</strong> ${summary.high || 0}</p>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
  }
}

async function renderAuditLogsView(container) {
  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fa-solid fa-clock-rotate-left"></i> System Audit Log Trail</h3>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Timestamp</th><th>User ID</th><th>Action</th><th>Details</th></tr></thead>
          <tbody id="auditTableBody"><tr><td colspan="4">Loading audit logs...</td></tr></tbody>
        </table>
      </div>
    </div>
  `;

  try {
    const logs = await apiClient.getAuditLogs();
    document.getElementById('auditTableBody').innerHTML = logs.map(l => `
      <tr>
        <td>${l.timestamp}</td>
        <td><strong>${l.user_id}</strong></td>
        <td><span class="badge badge-info">${l.action}</span></td>
        <td style="font-family: monospace; font-size: 12px;">${l.details}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

function switchView(viewName, params = {}) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const targetTab = document.querySelector(`.nav-tab[data-view="${viewName}"]`);
  if (targetTab) targetTab.classList.add('active');
  renderView(viewName, params);
}
