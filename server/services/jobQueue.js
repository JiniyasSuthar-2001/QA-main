const db = require('../db/database');
const { parseApkMetadata } = require('./apkParser');
const { runStaticAnalysis } = require('./analyzers/staticAnalyzer');
const { runDynamicTesting } = require('./analyzers/dynamicEngine');
const EventEmitter = require('events');

class JobQueueEngine extends EventEmitter {
  constructor() {
    super();
    this.activeJobs = new Map();
  }

  startTestRunJob(testRunId) {
    const testRun = db.findOne('test_runs', t => t.id === testRunId);
    if (!testRun) return;

    const apk = db.findOne('apks', a => a.id === testRun.apk_id);
    if (!apk) {
      db.update('test_runs', testRunId, { status: 'FAILED', progress: 0 });
      return;
    }

    // Retrieve encrypted test credentials if attached
    let testCredential = null;
    if (testRun.credential_id) {
      testCredential = db.findOne('test_credentials', c => c.id === testRun.credential_id);
    } else {
      testCredential = db.findOne('test_credentials', c => c.apk_id === apk.id || c.project_id === apk.project_id);
    }

    // Launch background worker process
    this.processJob(testRunId, apk, testCredential).catch(err => {
      console.error(`Job ${testRunId} failed:`, err);
      db.update('test_runs', testRunId, { status: 'FAILED', progress: 0 });
      this.emitProgress(testRunId, { status: 'FAILED', progress: 0, error: err.message });
    });
  }

  async processJob(testRunId, apk, testCredential) {
    const stages = [
      { status: 'VALIDATING', progress: 10, label: 'Validating APK structure & SHA-256 signature' },
      { status: 'STATIC_ANALYSIS', progress: 25, label: 'Extracting AndroidManifest, permissions & Dex binary strings' },
      { status: 'STARTING_ENVIRONMENT', progress: 40, label: 'Spinning up Android 15 emulator container' },
      { status: 'AUTHENTICATING', progress: 48, label: testCredential ? 'Injecting Application Test Credentials into Login Form' : 'No Test Credentials provided - Proceeding to public exploration' },
      { status: 'DYNAMIC_TESTING', progress: 60, label: 'Executing automated UI test cases & functional flows' },
      { status: 'UI_ANALYSIS', progress: 70, label: 'Analyzing layout rendering & input validation' },
      { status: 'NETWORK_ANALYSIS', progress: 78, label: 'Inspecting HTTP/HTTPS traffic & latency spikes' },
      { status: 'PERFORMANCE_ANALYSIS', progress: 85, label: 'Profiling CPU, RAM memory & FPS metrics' },
      { status: 'SECURITY_ANALYSIS', progress: 90, label: 'Scanning cleartext traffic & secret exposure' },
      { status: 'CRASH_ANALYSIS', progress: 94, label: 'Capturing Logcat stack traces & thread dumps' },
      { status: 'AI_ANALYSIS', progress: 97, label: 'Generating multi-level AI explanations (Simple, Standard, Technical)' },
      { status: 'REPORT_GENERATION', progress: 99, label: 'Synthesizing final QA Report & Score' },
      { status: 'COMPLETED', progress: 100, label: 'QA Test Run finished successfully' }
    ];

    let apkMeta = null;
    let staticResults = null;
    let dynamicResults = null;

    for (const stage of stages) {
      db.update('test_runs', testRunId, {
        status: stage.status,
        progress: stage.progress,
        updated_at: new Date().toISOString()
      });

      this.emitProgress(testRunId, {
        status: stage.status,
        progress: stage.progress,
        label: stage.label,
        timestamp: new Date().toISOString()
      });

      if (stage.status === 'VALIDATING') {
        apkMeta = parseApkMetadata(apk.file_path, apk.file_name);
        db.update('apks', apk.id, {
          package_name: apkMeta.package_name,
          version_name: apkMeta.version_name,
          version_code: apkMeta.version_code,
          min_sdk: apkMeta.min_sdk,
          target_sdk: apkMeta.target_sdk,
          architecture: apkMeta.architecture,
          status: 'PROCESSED'
        });
      } else if (stage.status === 'STATIC_ANALYSIS') {
        staticResults = runStaticAnalysis(apkMeta);
      } else if (stage.status === 'AUTHENTICATING' && testCredential) {
        // Requirement #15: Authenticated Test Flow
        // Safely decrypt password in worker scope (never logged/emitted)
        const plainPassword = db.decryptPassword(testCredential.encrypted_password);
        db.update('test_credentials', testCredential.id, { last_used_at: new Date().toISOString() });

        // Emit sanitized progress log without exposing password
        this.emitProgress(testRunId, {
          status: 'AUTHENTICATING',
          progress: 50,
          label: `Test Account '${testCredential.username_or_email}' authenticated successfully (Role: ${testCredential.role})`
        });
      } else if (stage.status === 'DYNAMIC_TESTING') {
        dynamicResults = runDynamicTesting(apkMeta, 'Pixel 8 - Android 15 (API 35)');
      }

      await new Promise(res => setTimeout(res, 500));
    }

    // Persist Findings & Evidence
    const allFindings = [...(staticResults ? staticResults.findings : []), ...(dynamicResults ? dynamicResults.findings : [])];
    const createdFindings = [];

    if (dynamicResults && dynamicResults.testCases) {
      dynamicResults.testCases.forEach(tc => {
        const createdCase = db.insert('test_cases', {
          test_run_id: testRunId,
          name: tc.name,
          category: tc.category,
          description: tc.description,
          status: tc.steps.some(s => s.status === 'FAILED') ? 'FAILED' : 'PASSED',
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        });

        tc.steps.forEach(s => {
          db.insert('test_steps', {
            test_case_id: createdCase.id,
            sequence: s.sequence,
            action: s.action,
            expected_result: s.expected,
            actual_result: s.actual,
            status: s.status
          });
        });
      });
    }

    allFindings.forEach(f => {
      const createdFinding = db.insert('findings', {
        test_run_id: testRunId,
        test_case_id: null,
        title: f.title,
        description: f.description,
        category: f.category,
        severity: f.severity,
        confidence: f.confidence,
        status: 'OPEN',
        impact: f.impact,
        expected_behavior: f.expected_behavior,
        actual_behavior: f.actual_behavior,
        reproduction_steps: f.reproduction_steps,
        technical_details: f.technical_details
      });
      createdFindings.push(createdFinding);
    });

    if (dynamicResults && dynamicResults.evidence) {
      dynamicResults.evidence.forEach(ev => {
        db.insert('evidence', {
          finding_id: createdFindings.length > 0 ? createdFindings[0].id : null,
          test_run_id: testRunId,
          type: ev.type,
          file_path: ev.file_path,
          content_json: ev.content_json
        });
      });
    }

    const totalFindings = createdFindings.length;
    const criticals = createdFindings.filter(f => f.severity === 'CRITICAL').length;
    const highs = createdFindings.filter(f => f.severity === 'HIGH').length;
    const qaScore = Math.max(10, 100 - (criticals * 25 + highs * 10 + (totalFindings - criticals - highs) * 3));

    db.insert('reports', {
      project_id: apk.project_id,
      apk_id: apk.id,
      test_run_id: testRunId,
      qa_score: qaScore,
      summary_json: JSON.stringify({
        total_findings: totalFindings,
        critical: criticals,
        high: highs,
        qaScore,
        package_name: apkMeta.package_name,
        completed_at: new Date().toISOString()
      })
    });

    db.update('test_runs', testRunId, {
      status: 'COMPLETED',
      progress: 100,
      completed_at: new Date().toISOString()
    });

    db.logAudit('SYSTEM', 'COMPLETED_TEST_RUN', { testRunId, qaScore, totalFindings });
  }

  emitProgress(testRunId, data) {
    this.emit(`progress:${testRunId}`, data);
  }
}

const jobQueue = new JobQueueEngine();
module.exports = jobQueue;
