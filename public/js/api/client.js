/**
 * Centralized API Client Module.
 * Provides unified HTTP request methods with authorization, error handling, and response validation.
 */
const API_BASE = '/api';

async function apiRequest(endpoint, method = 'GET', data = null, customHeaders = {}) {
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      ...customHeaders
    }
  };

  const token = localStorage.getItem('qa_token');
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data && !(data instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  } else if (data instanceof FormData) {
    options.body = data;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const json = await response.json();

    if (!response.ok || json.success === false) {
      const errorMsg = json.message || `HTTP Error ${response.status}`;
      const err = new Error(errorMsg);
      err.errors = json.errors || [];
      err.status = response.status;
      throw err;
    }

    return json.data !== undefined ? json.data : json;
  } catch (err) {
    console.error(`[API Error] ${method} ${endpoint}:`, err);
    throw err;
  }
}

const apiClient = {
  // System Health Check
  getHealth: () => apiRequest('/health'),

  // Auth
  login: (email, password) => apiRequest('/auth/login', 'POST', { email, password }),
  getMe: () => apiRequest('/auth/me'),

  // Projects
  getProjects: () => apiRequest('/projects'),
  createProject: (name, description) => apiRequest('/projects', 'POST', { name, description }),

  // APKs
  uploadApk: (projectId, formData) => apiRequest(`/projects/${projectId}/apks/upload`, 'POST', formData),
  getApk: (apkId) => apiRequest(`/apks/${apkId}`),

  // Test Credentials Security API
  saveTestCredentials: (credData) => apiRequest('/test-credentials', 'POST', credData),

  // Test Runs
  createTestRun: (runData) => apiRequest('/test-runs', 'POST', runData),
  getTestRun: (runId) => apiRequest(`/test-runs/${runId}`),
  getTestRunFindings: (runId) => apiRequest(`/test-runs/${runId}/findings`),

  // Findings & AI
  getFindings: () => apiRequest('/findings'),
  getFindingDetails: (findingId) => apiRequest(`/findings/${findingId}`),
  getAIExplanation: (findingId, level) => apiRequest(`/findings/${findingId}/ai-explanation?level=${level}`),
  retestFinding: (findingId) => apiRequest(`/findings/${findingId}/retest`, 'POST'),

  // Comparison & Reports
  compareVersions: (projectId, v1, v2) => apiRequest(`/projects/${projectId}/compare?v1=${v1}&v2=${v2}`),
  getReport: (reportId) => apiRequest(`/reports/${reportId}`),
  getAuditLogs: () => apiRequest('/audit-logs')
};

window.apiClient = apiClient;
