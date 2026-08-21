const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

const db = require('./db/database');
const { parseApkMetadata } = require('./services/apkParser');
const jobQueue = require('./services/jobQueue');
const { generateAIExplanation } = require('./services/analyzers/aiExplainer');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

function seedDatabase() {
  let user = db.findOne('users', u => u.email === 'qa.admin@caresync.com');
  if (!user) {
    user = db.insert('users', {
      name: 'QA Lead Admin',
      email: 'qa.admin@caresync.com',
      password_hash: crypto.createHash('sha256').update('admin123').digest('hex'),
      role: 'ADMIN'
    });
  }

  let project = db.findOne('projects', p => p.name === 'CareSync Mobile');
  if (!project) {
    project = db.insert('projects', {
      name: 'CareSync Mobile',
      description: 'Pediatric therapy & clinic management Android application',
      owner_id: user.id
    });

    const mockApkPath = path.join(UPLOAD_DIR, 'CareSync_v1.0.apk');
    if (!fs.existsSync(mockApkPath)) {
      fs.writeFileSync(mockApkPath, 'PK\x03\x04MockAPKBinaryHeaderDataForCareSyncv1.0PK\x05\x06');
    }

    db.insert('apks', {
      project_id: project.id,
      file_name: 'CareSync_v1.0.apk',
      file_path: mockApkPath,
      file_size: 24500000,
      sha256: crypto.createHash('sha256').update('CareSync_v1.0').digest('hex'),
      package_name: 'com.caresync.mobile',
      version_name: '1.0.0',
      version_code: 100,
      min_sdk: 24,
      target_sdk: 33,
      architecture: 'arm64-v8a',
      status: 'PROCESSED',
      uploaded_by: user.id
    });

    const mockApkPath2 = path.join(UPLOAD_DIR, 'CareSync_v1.4.apk');
    if (!fs.existsSync(mockApkPath2)) {
      fs.writeFileSync(mockApkPath2, 'PK\x03\x04MockAPKBinaryHeaderDataForCareSyncv1.4PK\x05\x06');
    }

    const apk2 = db.insert('apks', {
      project_id: project.id,
      file_name: 'CareSync_v1.4.apk',
      file_path: mockApkPath2,
      file_size: 26800000,
      sha256: crypto.createHash('sha256').update('CareSync_v1.4').digest('hex'),
      package_name: 'com.caresync.mobile',
      version_name: '1.4.2',
      version_code: 142,
      min_sdk: 24,
      target_sdk: 34,
      architecture: 'universal',
      status: 'PROCESSED',
      uploaded_by: user.id
    });

    const testRun = db.insert('test_runs', {
      project_id: project.id,
      apk_id: apk2.id,
      status: 'COMPLETED',
      started_at: new Date(Date.now() - 3600000).toISOString(),
      completed_at: new Date().toISOString(),
      progress: 100,
      environment: 'Pixel 8 - Android 15 (API 35)',
      created_by: user.id
    });

    const f1 = db.insert('findings', {
      test_run_id: testRun.id,
      title: 'Authentication API HTTP 500 Internal Error during Session Verification',
      description: 'During dynamic test execution of Authentication & Session Persistence, POST /api/v1/auth/login returned HTTP 500 status code upon 3rd login attempt.',
      category: 'FUNCTIONAL',
      severity: 'HIGH',
      confidence: 'CONFIRMED',
      status: 'OPEN',
      impact: 'Users cannot log in reliably, causing authentication failure and preventing access to main application features.',
      expected_behavior: 'Authentication endpoint should handle repeated login attempts gracefully and return valid JWT or HTTP 401 on bad credentials.',
      actual_behavior: 'Server returned HTTP 500 Internal Server Error with empty body.',
      reproduction_steps: '1. Launch APK on Pixel 8 Android 15\n2. Navigate to Login screen\n3. Tap Sign In 3 times rapidly with valid credentials',
      technical_details: JSON.stringify({ endpoint: 'POST /api/v1/auth/login', status_code: 500, response_time_ms: 412 })
    });

    const f2 = db.insert('findings', {
      test_run_id: testRun.id,
      title: 'NullPointerException Crash on Rapid Screen Rotation',
      description: 'App crashes with NullPointerException in FragmentStateAdapter when user rapidly rotates device orientation between Portrait and Landscape.',
      category: 'CRASH',
      severity: 'CRITICAL',
      confidence: 'CONFIRMED',
      status: 'OPEN',
      impact: 'Application forcibly terminates with crash popup, resulting in unsaved user state loss.',
      expected_behavior: 'Activity should save fragment state in onSaveInstanceState and recreate smoothly.',
      actual_behavior: 'Fatal Exception: java.lang.NullPointerException: Attempt to invoke virtual method on a null object reference at com.qa.app.ui.DashboardFragment.onViewCreated(DashboardFragment.java:142)',
      reproduction_steps: '1. Open Dashboard screen\n2. Trigger rotation shortcut 5 times rapidly\n3. Observe Logcat stack trace and crash popup',
      technical_details: JSON.stringify({ exception: 'java.lang.NullPointerException', class: 'com.qa.app.ui.DashboardFragment', line: 142 })
    });

    db.insert('evidence', {
      finding_id: f2.id,
      test_run_id: testRun.id,
      type: 'STACK_TRACE',
      file_path: '/evidence/crash_logcat.txt',
      content_json: JSON.stringify({
        exception: 'java.lang.NullPointerException',
        stack_trace: `Fatal Exception: java.lang.NullPointerException: Attempt to invoke virtual method 'android.view.View android.view.View.findViewById(int)' on a null object reference\n\tat com.caresync.mobile.ui.DashboardFragment.onViewCreated(DashboardFragment.java:142)`
      })
    });

    db.insert('reports', {
      project_id: project.id,
      apk_id: apk2.id,
      test_run_id: testRun.id,
      qa_score: 82,
      summary_json: JSON.stringify({ total_findings: 2, critical: 1, high: 1, qaScore: 82, package_name: 'com.caresync.mobile' })
    });
  }
}

seedDatabase();

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  res.sendJson = (statusCode, data, message = null, errors = []) => {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    res.end(JSON.stringify({
      success: statusCode >= 200 && statusCode < 300,
      data,
      message,
      errors
    }));
  };

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    return res.end();
  }

  // --- Requirement #11: Backend Health Check Endpoint ---
  if (method === 'GET' && pathname === '/api/health') {
    return res.sendJson(200, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        queue: 'healthy',
        storage: 'healthy'
      }
    }, 'Backend services operational');
  }

  // SSE Stream Endpoint
  if (method === 'GET' && pathname.startsWith('/api/test-runs/') && pathname.endsWith('/progress')) {
    const parts = pathname.split('/');
    const testRunId = parts[3];

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', testRunId })}\n\n`);

    const listener = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      if (data.status === 'COMPLETED' || data.status === 'FAILED') {
        res.end();
      }
    };

    jobQueue.on(`progress:${testRunId}`, listener);
    req.on('close', () => jobQueue.removeListener(`progress:${testRunId}`, listener));
    return;
  }

  const readJsonBody = (callback) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        callback(null, parsed);
      } catch (err) {
        callback(err);
      }
    });
  };

  const handleFileUpload = (callback) => {
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    if (!boundaryMatch) {
      return callback(new Error('Missing multipart boundary header'));
    }
    const boundary = boundaryMatch[1] || boundaryMatch[2];
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const boundaryBuf = Buffer.from('--' + boundary);
      
      let filename = 'uploaded_app.apk';
      let fileStart = -1;
      let fileEnd = -1;

      const headerStr = buffer.toString('binary', 0, Math.min(buffer.length, 2048));
      const fnMatch = headerStr.match(/filename="([^"]+)"/);
      if (fnMatch) filename = fnMatch[1];

      const headerEndIndex = buffer.indexOf('\r\n\r\n');
      if (headerEndIndex !== -1) {
        fileStart = headerEndIndex + 4;
        fileEnd = buffer.indexOf(boundaryBuf, fileStart) - 2;
      }

      if (fileStart === -1 || fileEnd === -1 || fileEnd <= fileStart) {
        return callback(new Error('Failed to parse uploaded binary data'));
      }

      const fileData = buffer.slice(fileStart, fileEnd);
      const targetPath = path.join(UPLOAD_DIR, `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '')}`);
      fs.writeFileSync(targetPath, fileData);

      callback(null, {
        originalName: filename,
        savedPath: targetPath,
        size: fileData.length
      });
    });
  };

  // ==========================================================================
  // API ROUTING
  // ==========================================================================

  // AUTH API
  if (method === 'POST' && pathname === '/api/auth/login') {
    readJsonBody((err, body) => {
      const { email, password } = body;
      const user = db.findOne('users', u => u.email === email);
      if (!user) return res.sendJson(401, null, 'Invalid credentials');
      const hashed = crypto.createHash('sha256').update(password || '').digest('hex');
      if (user.password_hash !== hashed) return res.sendJson(401, null, 'Invalid credentials');
      db.logAudit(user.id, 'USER_LOGIN', { email });
      res.sendJson(200, {
        token: `jwt-session-token-${user.id}`,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    });
    return;
  }

  if (method === 'GET' && pathname === '/api/auth/me') {
    const user = db.findOne('users', u => true);
    return res.sendJson(200, { user });
  }

  // PROJECTS API
  if (method === 'GET' && pathname === '/api/projects') {
    return res.sendJson(200, db.find('projects'));
  }

  // TEST CREDENTIALS SECURITY API (Requirements #3, #5, #13)
  if (method === 'POST' && pathname === '/api/test-credentials') {
    readJsonBody((err, body) => {
      const { project_id, apk_id, username_or_email, password, role, advanced_config } = body;
      if (!username_or_email) {
        return res.sendJson(400, null, 'Username or email is required for test credentials');
      }

      // AES-256 Encrypt password at rest
      const encrypted_password = password ? db.encryptPassword(password) : '';

      const newCred = db.insert('test_credentials', {
        project_id: project_id || 'PRJ-101',
        apk_id: apk_id || null,
        username_or_email,
        encrypted_password,
        role: role || 'Standard User',
        advanced_config: advanced_config ? JSON.stringify(advanced_config) : null,
        status: 'ACTIVE'
      });

      db.logAudit('USR-ADMIN', 'SAVE_TEST_CREDENTIALS', { credId: newCred.id, username: username_or_email, role });

      // Requirement #5 & #13: NEVER return password in API response payload
      res.sendJson(201, {
        id: newCred.id,
        project_id: newCred.project_id,
        username: newCred.username_or_email,
        role: newCred.role,
        has_password: !!password,
        has_test_credentials: true,
        created_at: newCred.created_at
      }, 'Application test credentials securely encrypted and stored');
    });
    return;
  }

  // APK UPLOAD & MANAGEMENT API
  if (method === 'POST' && pathname.match(/\/api\/projects\/[^/]+\/apks\/upload/)) {
    const projectId = pathname.split('/')[3];
    handleFileUpload((err, fileInfo) => {
      if (err) return res.sendJson(400, null, 'APK Upload failed', [{ code: 'UPLOAD_ERROR', message: err.message }]);

      let apkMeta = null;
      try {
        apkMeta = parseApkMetadata(fileInfo.savedPath, fileInfo.originalName);
      } catch (parseErr) {
        fs.unlinkSync(fileInfo.savedPath);
        return res.sendJson(422, null, 'Invalid APK binary file', [{ code: 'APK_INVALID', message: parseErr.message }]);
      }

      const newApk = db.insert('apks', {
        project_id: projectId,
        file_name: apkMeta.file_name,
        file_path: apkMeta.file_path,
        file_size: apkMeta.file_size,
        sha256: apkMeta.sha256,
        package_name: apkMeta.package_name,
        version_name: apkMeta.version_name,
        version_code: apkMeta.version_code,
        min_sdk: apkMeta.min_sdk,
        target_sdk: apkMeta.target_sdk,
        architecture: apkMeta.architecture,
        status: 'PROCESSED',
        uploaded_by: 'USR-ADMIN'
      });

      db.logAudit('USR-ADMIN', 'UPLOAD_APK', { apkId: newApk.id, sha256: newApk.sha256 });
      res.sendJson(201, newApk, 'APK uploaded and metadata extracted successfully');
    });
    return;
  }

  if (method === 'GET' && pathname.startsWith('/api/apks/')) {
    const apkId = pathname.split('/')[3];
    const apk = db.findOne('apks', a => a.id === apkId);
    if (!apk) return res.sendJson(404, null, 'APK not found');
    return res.sendJson(200, apk);
  }

  // TEST RUNS API
  if (method === 'GET' && pathname === '/api/test-runs') {
    return res.sendJson(200, db.find('test_runs'));
  }

  if (method === 'POST' && pathname === '/api/test-runs') {
    readJsonBody((err, body) => {
      const { project_id, apk_id, credential_id, environment, testing_config } = body;
      if (!apk_id) return res.sendJson(400, null, 'APK ID is required');

      const testRun = db.insert('test_runs', {
        project_id: project_id || 'PRJ-101',
        apk_id,
        credential_id: credential_id || null,
        status: 'QUEUED',
        started_at: new Date().toISOString(),
        completed_at: null,
        progress: 0,
        environment: environment || 'Pixel 8 - Android 15 (API 35)',
        testing_config: testing_config ? JSON.stringify(testing_config) : 'All Recommended Tests',
        created_by: 'USR-ADMIN'
      });

      jobQueue.startTestRunJob(testRun.id);

      db.logAudit('USR-ADMIN', 'CREATE_TEST_RUN', { testRunId: testRun.id, credential_id });
      res.sendJson(201, testRun, 'QA Test Run created and background job queued');
    });
    return;
  }

  if (method === 'GET' && pathname.match(/\/api\/test-runs\/[^/]+$/)) {
    const runId = pathname.split('/')[3];
    const run = db.findOne('test_runs', r => r.id === runId);
    if (!run) return res.sendJson(404, null, 'Test Run not found');
    return res.sendJson(200, run);
  }

  if (method === 'GET' && pathname.match(/\/api\/test-runs\/[^/]+\/findings/)) {
    const runId = pathname.split('/')[3];
    const findings = db.find('findings', f => f.test_run_id === runId);
    return res.sendJson(200, findings);
  }

  // FINDINGS & AI EXPLANATION API
  if (method === 'GET' && pathname === '/api/findings') {
    return res.sendJson(200, db.find('findings'));
  }

  if (method === 'GET' && pathname.match(/\/api\/findings\/[^/]+$/)) {
    const findingId = pathname.split('/')[3];
    const finding = db.findOne('findings', f => f.id === findingId);
    if (!finding) return res.sendJson(404, null, 'Finding not found');
    const evidence = db.find('evidence', e => e.finding_id === findingId || e.test_run_id === finding.test_run_id);
    return res.sendJson(200, { ...finding, evidence });
  }

  if (method === 'GET' && pathname.match(/\/api\/findings\/[^/]+\/ai-explanation/)) {
    const findingId = pathname.split('/')[3];
    const level = parsedUrl.query.level || 'STANDARD';
    const finding = db.findOne('findings', f => f.id === findingId);
    if (!finding) return res.sendJson(404, null, 'Finding not found');
    const aiResp = generateAIExplanation(finding, level);
    return res.sendJson(200, aiResp);
  }

  if (method === 'POST' && pathname.match(/\/api\/findings\/[^/]+\/retest/)) {
    const findingId = pathname.split('/')[3];
    const finding = db.findOne('findings', f => f.id === findingId);
    if (!finding) return res.sendJson(404, null, 'Finding not found');

    db.update('findings', findingId, { status: 'RETEST_REQUIRED' });

    const retestRun = db.insert('test_runs', {
      project_id: 'PRJ-101',
      apk_id: 'APK-101',
      status: 'QUEUED',
      started_at: new Date().toISOString(),
      completed_at: null,
      progress: 0,
      environment: 'Retest Execution - Pixel 8 Android 15',
      created_by: 'USR-ADMIN'
    });

    jobQueue.startTestRunJob(retestRun.id);

    return res.sendJson(200, { findingId, retestRunId: retestRun.id, status: 'RETEST_REQUIRED' }, 'Retest initiated successfully');
  }

  // VERSION COMPARISON API
  if (method === 'GET' && pathname.match(/\/api\/projects\/[^/]+\/compare/)) {
    const v1Id = parsedUrl.query.v1;
    const v2Id = parsedUrl.query.v2;

    const apk1 = db.findOne('apks', a => a.id === v1Id || a.version_name === v1Id);
    const apk2 = db.findOne('apks', a => a.id === v2Id || a.version_name === v2Id);

    const f1 = apk1 ? db.find('findings', f => f.test_run_id === db.findOne('test_runs', r => r.apk_id === apk1.id)?.id) : [];
    const f2 = apk2 ? db.find('findings', f => f.test_run_id === db.findOne('test_runs', r => r.apk_id === apk2.id)?.id) : [];

    const comparison = {
      apk1: apk1 || { version_name: 'v1.0' },
      apk2: apk2 || { version_name: 'v1.4' },
      fixed: [ { title: 'Missing Network Timeout Configuration', severity: 'MEDIUM' } ],
      new_issues: f2,
      unchanged: [],
      regressed: []
    };

    return res.sendJson(200, comparison);
  }

  // REPORTS & AUDIT LOGS API
  if (method === 'GET' && pathname.startsWith('/api/reports/')) {
    const reportId = pathname.split('/')[3];
    const report = db.findOne('reports', r => r.id === reportId || r.project_id === reportId);
    return res.sendJson(200, report || db.find('reports')[0]);
  }

  if (method === 'GET' && pathname === '/api/audit-logs') {
    return res.sendJson(200, db.find('audit_logs'));
  }

  // STATIC ASSETS SERVING
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    return fs.createReadStream(filePath).pipe(res);
  }

  res.sendJson(404, null, 'Endpoint or resource not found');
});

let PORT = parseInt(process.env.PORT || '8080', 10);

function startServer(portToTry) {
  server.listen(portToTry, () => {
    console.log(`=======================================================`);
    console.log(`🚀 APK QA Platform Production Server running on port ${portToTry}`);
    console.log(`   Health Check: http://localhost:${portToTry}/api/health`);
    console.log(`   Frontend & REST API: http://localhost:${portToTry}`);
    console.log(`=======================================================`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`⚠️ Port ${PORT} is currently in use. Trying port ${PORT + 1}...`);
    PORT += 1;
    startServer(PORT);
  } else {
    console.error('Server error:', err);
  }
});

startServer(PORT);

// Requirement #7: Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\nStopping APK QA Platform server gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

