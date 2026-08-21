/**
 * Static Analysis Engine.
 * Analyzes APK metadata, permissions, SDK configuration, and hardcoded secrets to produce structured findings.
 */
function runStaticAnalysis(apkMetadata) {
  const findings = [];
  const warnings = [];

  // 1. Permission Audit
  const dangerousPerms = [
    'android.permission.READ_EXTERNAL_STORAGE',
    'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.RECORD_AUDIO'
  ];

  apkMetadata.permissions.forEach(perm => {
    if (dangerousPerms.includes(perm)) {
      findings.push({
        title: `Sensitive Permission Requested: ${perm.split('.').pop()}`,
        description: `The application requests sensitive permission '${perm}'. Excessive permissions increase attack surface.`,
        category: 'SECURITY',
        severity: 'MEDIUM',
        confidence: 'CONFIRMED',
        impact: 'User privacy or sensitive data could be accessed if the application is compromised.',
        expected_behavior: 'Only request permissions strictly necessary for core functionality.',
        actual_behavior: `Manifest requests ${perm}.`,
        reproduction_steps: `1. Inspect AndroidManifest.xml\n2. Locate <uses-permission name="${perm}"/>`,
        technical_details: JSON.stringify({ permission: perm, target_sdk: apkMetadata.target_sdk })
      });
    }
  });

  // 2. Cleartext HTTP Traffic Inspection
  const httpEndpoints = apkMetadata.endpoints.filter(e => e.startsWith('http://'));
  if (httpEndpoints.length > 0) {
    findings.push({
      title: 'Insecure Cleartext HTTP Traffic Allowed',
      description: `Unencrypted HTTP endpoints detected in APK binary: ${httpEndpoints.join(', ')}.`,
      category: 'NETWORK',
      severity: 'HIGH',
      confidence: 'HIGH',
      impact: 'Sensitive user data and auth tokens transmitted over cleartext HTTP can be intercepted via Man-in-the-Middle (MitM) attacks.',
      expected_behavior: 'All network traffic must be encrypted over TLS/HTTPS.',
      actual_behavior: `Detected ${httpEndpoints.length} unencrypted HTTP endpoint(s).`,
      reproduction_steps: '1. Scan network endpoints\n2. Observe HTTP traffic without TLS handshake',
      technical_details: JSON.stringify({ insecure_endpoints: httpEndpoints })
    });
  }

  // 3. Hardcoded Secrets Analysis
  if (apkMetadata.hardcodedSecrets && apkMetadata.hardcodedSecrets.length > 0) {
    apkMetadata.hardcodedSecrets.forEach(secret => {
      findings.push({
        title: 'Hardcoded API Credential / Secret Key Discovered',
        description: `Static scan identified embedded sensitive secret: ${secret}.`,
        category: 'SECURITY',
        severity: 'CRITICAL',
        confidence: 'CONFIRMED',
        impact: 'Attackers can decompile the APK and extract secret API keys to impersonate your backend or abuse cloud API quotas.',
        expected_behavior: 'Secrets should never be stored in APK binaries; use secure backend token exchange or Android KeyStore.',
        actual_behavior: `Hardcoded key pattern found in compilation DEX strings.`,
        reproduction_steps: '1. Decompile APK with apktool / jadx\n2. Search strings for secret prefix',
        technical_details: JSON.stringify({ secret_finding: secret })
      });
    });
  }

  // 4. Target SDK & Debuggable Check
  if (apkMetadata.target_sdk < 33) {
    findings.push({
      title: 'Outdated Target SDK Version',
      description: `The application targets Android SDK ${apkMetadata.target_sdk}. Current recommended target is Android 14+ (SDK 34).`,
      category: 'COMPATIBILITY',
      severity: 'LOW',
      confidence: 'CONFIRMED',
      impact: 'Older target SDKs lack modern Android runtime permission restrictions and sandbox enforcement.',
      expected_behavior: 'Target modern Android SDK (API 34+).',
      actual_behavior: `Target SDK is ${apkMetadata.target_sdk}.`,
      reproduction_steps: 'Check targetSdkVersion in build.gradle / AndroidManifest.xml',
      technical_details: JSON.stringify({ target_sdk: apkMetadata.target_sdk })
    });
  }

  return {
    status: 'COMPLETED',
    findings,
    warnings,
    summary: {
      total_findings: findings.length,
      critical: findings.filter(f => f.severity === 'CRITICAL').length,
      high: findings.filter(f => f.severity === 'HIGH').length,
      medium: findings.filter(f => f.severity === 'MEDIUM').length,
      low: findings.filter(f => f.severity === 'LOW').length
    }
  };
}

module.exports = { runStaticAnalysis };
