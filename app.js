/* ==========================================================================
   CareSync Pro - SPA Logic, State Management & Audit QA Fixes
   ========================================================================== */

// --- Global Application State & Seed Data ---
const state = {
  currentView: 'home',
  
  // Leads (Ref: Issues 2, 5, 6, 7)
  leads: [
    {
      id: 'LD-101',
      name: 'Liam Johnson',
      parentName: 'Robert Johnson',
      phone: '+1 555-0192',
      email: 'robert.j@example.com',
      status: 'New',
      source: 'Google Ads',
      preferredDate: '2026-08-25',
      notes: 'Parent inquiring about speech therapy for 5yo child.',
      statusHistory: [
        { status: 'New', date: '2026-08-20 10:30 AM', updatedBy: 'Front Desk', notes: 'Lead created from website inquiry.' }
      ]
    },
    {
      id: 'LD-102',
      name: 'Emma Watson',
      parentName: 'Claire Watson',
      phone: '+1 555-0143',
      email: 'claire.w@example.com',
      status: 'Scheduled',
      source: 'Referral',
      preferredDate: '2026-08-23',
      notes: 'Occupational assessment scheduled.',
      statusHistory: [
        { status: 'New', date: '2026-08-18 02:15 PM', updatedBy: 'System', notes: 'Imported from phone call.' },
        { status: 'Scheduled', date: '2026-08-19 11:00 AM', updatedBy: 'Dr. Sarah', notes: 'Assessment scheduled for 23rd.' }
      ]
    }
  ],

  // Appointments (Ref: Issue 4)
  appointments: [
    { id: 'APT-301', patientName: 'Noah Smith', therapist: 'Dr. Michael Chen', date: '2026-08-21', time: '09:00 AM', status: 'Scheduled', type: 'Speech Therapy' },
    { id: 'APT-302', patientName: 'Ava Davis', therapist: 'Dr. Sarah Jenkins', date: '2026-08-21', time: '11:30 AM', status: 'Completed', type: 'Occupational Therapy' },
    { id: 'APT-303', patientName: 'Oliver Taylor', therapist: 'Dr. Lisa Ray', date: '2026-08-22', time: '02:00 PM', status: 'Scheduled', type: 'Behavioral Therapy' }
  ],

  // Follow-ups (Ref: Issue 8)
  followups: [
    { id: 'FL-201', patientName: 'Lucas Brown', phone: '+1 555-0188', date: '2026-08-21', status: 'Pending', notes: 'Check progress after 2 weeks of exercises.' },
    { id: 'FL-202', patientName: 'Sophia Miller', phone: '+1 555-0177', date: '2026-08-21', status: 'Completed', notes: 'Parent confirmed attendance for next session.' },
    { id: 'FL-203', patientName: 'Ethan Wilson', phone: '+1 555-0166', date: '2026-08-22', status: 'Pending', notes: 'Billing clarification follow-up.' }
  ],

  // Children / Patients (Ref: Issues 3, 9, 10, 11, 12)
  children: [
    {
      id: 'CH-001',
      name: 'Noah Smith',
      parentName: 'Daniel Smith',
      age: 6,
      gender: 'Male',
      phone: '+1 555-0122',
      joiningDate: '2026-01-10',
      therapyRate: 50,
      nextObservationDate: '2026-08-28',
      observations: [
        { id: 'OBS-101', date: '2026-07-15', title: 'Initial Assessment', notes: 'Good response to sensory integration tools.', evaluator: 'Dr. Michael Chen', status: 'Completed' },
        { id: 'OBS-102', date: '2026-08-01', title: 'Mid-term Review', notes: 'Motor coordination improved by 25%.', evaluator: 'Dr. Sarah Jenkins', status: 'Completed' }
      ],
      payments: [
        { id: 'PAY-801', date: '2026-07-01', amount: 400, method: 'Credit Card', status: 'Paid' },
        { id: 'PAY-802', date: '2026-08-01', amount: 500, method: 'Bank Transfer', status: 'Paid' }
      ]
    },
    {
      id: 'CH-002',
      name: 'Ava Davis',
      parentName: 'Jessica Davis',
      age: 4,
      gender: 'Female',
      phone: '+1 555-0199',
      joiningDate: '2026-03-15',
      therapyRate: 50,
      nextObservationDate: '2026-09-05',
      observations: [
        { id: 'OBS-103', date: '2026-08-10', title: 'Language Milestones', notes: 'Showing eagerness to articulate multi-syllable words.', evaluator: 'Dr. Lisa Ray', status: 'Completed' }
      ],
      payments: [
        { id: 'PAY-803', date: '2026-08-05', amount: 450, method: 'Cash', status: 'Paid' }
      ]
    }
  ],

  // Attendance Records (Ref: Issues 3 & 12)
  childrenAttendance: [
    { childId: 'CH-001', childName: 'Noah Smith', date: '2026-08-21', status: 'Present', markedAt: '08:45 AM' }
  ],

  employeeAttendance: [
    { employeeId: 'EMP-01', name: 'Dr. Michael Chen', date: '2026-08-21', status: 'Present', checkIn: '08:00 AM', checkOut: '05:00 PM' },
    { employeeId: 'EMP-02', name: 'Dr. Lisa Ray', date: '2026-08-21', status: 'Present', checkIn: '08:15 AM', checkOut: '05:15 PM' },
    { employeeId: 'EMP-03', name: 'James Carter', date: '2026-08-21', status: 'On Leave', checkIn: '-', checkOut: '-' }
  ],

  // Organization Data (Ref: Issues 13 & 14)
  departments: [
    { id: 'DEP-01', name: 'Speech Therapy', code: 'ST', manager: 'Dr. Michael Chen', active: true },
    { id: 'DEP-02', name: 'Occupational Therapy', code: 'OT', manager: 'Dr. Sarah Jenkins', active: true },
    { id: 'DEP-03', name: 'Behavioral Psychology', code: 'BP', manager: 'Dr. Lisa Ray', active: true },
    { id: 'DEP-04', name: 'Physiotherapy', code: 'PT', manager: 'Dr. Alan Grant', active: false }
  ],

  designations: [
    { id: 'DES-01', title: 'Senior Speech Therapist', department: 'Speech Therapy', active: true },
    { id: 'DES-02', title: 'Lead Pediatric Occupational Therapist', department: 'Occupational Therapy', active: true },
    { id: 'DES-03', title: 'Behavioral Specialist', department: 'Behavioral Psychology', active: true },
    { id: 'DES-04', title: 'Junior Assistant Therapist', department: 'Speech Therapy', active: false }
  ],

  // Leave System Data (Ref: Issues 15, 17, 18)
  leaveRequests: [
    {
      id: 'LV-501',
      employeeId: 'EMP-03',
      employeeName: 'James Carter',
      type: 'Casual Leave',
      startDate: '2026-08-21',
      endDate: '2026-08-22',
      totalDays: 2,
      reason: 'Attending family wedding in home town.',
      status: 'Pending',
      rejectionReason: '',
      isOwnRequest: false
    },
    {
      id: 'LV-502',
      employeeId: 'EMP-04',
      employeeName: 'Dr. Sarah Jenkins (You)',
      type: 'Sick Leave',
      startDate: '2026-09-01',
      endDate: '2026-09-01',
      totalDays: 1,
      reason: 'Medical checkup and routine test.',
      status: 'Pending',
      rejectionReason: '',
      isOwnRequest: true // Demonstrates Issue 15 self-edit restriction
    }
  ],

  leaveQuota: {
    casual: { allocated: 12, used: 3 },
    sick: { allocated: 10, used: 2 },
    earned: { allocated: 15, used: 5 }
  },

  // Employees (Ref: Issue 19)
  employees: [
    { id: 'EMP-01', name: 'Dr. Michael Chen', role: 'Therapist', department: 'Speech Therapy', designation: 'Senior Speech Therapist', email: 'michael@clinic.com', dutyTime: '08:00 AM - 05:00 PM', active: true },
    { id: 'EMP-02', name: 'Dr. Lisa Ray', role: 'Doctor', department: 'Behavioral Psychology', designation: 'Behavioral Specialist', email: 'lisa@clinic.com', dutyTime: '09:00 AM - 06:00 PM', active: true },
    { id: 'EMP-03', name: 'James Carter', role: 'Assistant', department: 'Occupational Therapy', designation: 'Junior Assistant Therapist', email: 'james@clinic.com', dutyTime: '08:30 AM - 05:30 PM', active: true }
  ],

  // Contacts (Ref: Issue 22)
  contacts: [
    { id: 'CON-101', name: 'Dr. Amanda Vance', occupation: 'Pediatric Neurologist', phone: '+1 555-9081', email: 'amanda.vance@medcenter.org', city: 'New York' },
    { id: 'CON-102', name: 'Mark Stevens', occupation: 'Equipment Supplier', phone: '+1 555-3412', email: 'mark@therapyequip.com', city: 'Boston' },
    { id: 'CON-103', name: 'Sophia Sterling', occupation: 'Special Education Director', phone: '+1 555-7823', email: 's.sterling@school.edu', city: 'Chicago' }
  ],

  // Expenses (Ref: Issue 23)
  expenses: [
    { id: 'EXP-401', title: 'Sensory Toys & Balls', category: 'Therapy Supplies', amount: 245.00, date: '2026-08-15', status: 'Paid' },
    { id: 'EXP-402', title: 'Air Conditioning Maintenance', category: 'Facility Repair', amount: 180.00, date: '2026-08-18', status: 'Paid' }
  ],

  // Invoices (Ref: Issue 24)
  invoices: [
    {
      id: 'INV-901',
      childId: 'CH-001',
      childName: 'Noah Smith',
      month: 'August 2026',
      startDate: '2026-08-01',
      endDate: '2026-08-21',
      autoBillFromJoining: false,
      presentDays: 10,
      therapyRate: 50,
      lineItems: [ { description: 'Specialized Assessment Kit', amount: 50 } ],
      totalAmount: 550,
      status: 'Pending'
    }
  ],

  // User Management & Roles (Ref: Issues 27 & 28)
  users: [
    { id: 'USR-01', name: 'Dr. Sarah Jenkins', email: 'sarah@caresync.com', role: 'Clinic Administrator', active: true },
    { id: 'USR-02', name: 'Dr. Michael Chen', email: 'michael@caresync.com', role: 'Therapist', active: true },
    { id: 'USR-03', name: 'Reception Desk', email: 'frontdesk@caresync.com', role: 'Receptionist', active: true }
  ],

  roles: [
    { id: 'ROL-01', name: 'Clinic Administrator', permissions: ['Leads', 'Children', 'Leave Approval', 'Expenses', 'Invoices', 'User Management'] },
    { id: 'ROL-02', name: 'Therapist', permissions: ['Children', 'Observation', 'Attendance'] },
    { id: 'ROL-03', name: 'Receptionist', permissions: ['Leads', 'Followups', 'Attendance', 'Contacts'] }
  ]
};

// --- Initialization & Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initModal();
  renderView('home');
});

// --- Navigation Router ---
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.getAttribute('data-view');
      if (view) {
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        renderView(view);
      }
    });
  });

  const toggleBtn = document.getElementById('toggleSidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
  }
}

// --- Global Header Renderer (Ref: Issue 16 - Leave Approval Reference Header) ---
function updateHeader(title, subtitle, actionsHtml = '') {
  document.getElementById('headerTitle').textContent = title;
  document.getElementById('headerSubtitle').textContent = subtitle;
  document.getElementById('headerActions').innerHTML = actionsHtml;
}

// --- View Router Switcher ---
function renderView(viewName) {
  state.currentView = viewName;
  const container = document.getElementById('contentBody');
  container.innerHTML = '';

  switch (viewName) {
    case 'home':
      renderHomeView(container);
      break;
    case 'leads':
      renderLeadsView(container);
      break;
    case 'followups':
      renderFollowupsView(container);
      break;
    case 'children':
      renderChildrenView(container);
      break;
    case 'children-attendance':
      renderChildrenAttendanceView(container);
      break;
    case 'employee-attendance':
      renderEmployeeAttendanceView(container);
      break;
    case 'department':
      renderDepartmentView(container);
      break;
    case 'designation':
      renderDesignationView(container);
      break;
    case 'leave-requests':
      renderLeaveRequestsView(container);
      break;
    case 'leave-approval':
      renderLeaveApprovalView(container);
      break;
    case 'employees':
      renderEmployeesView(container);
      break;
    case 'contacts':
      renderContactsView(container);
      break;
    case 'expenses':
      renderExpensesView(container);
      break;
    case 'invoices':
      renderInvoicesView(container);
      break;
    case 'payment-reminders':
      renderPaymentRemindersView(container);
      break;
    case 'users':
      renderUsersView(container);
      break;
    case 'roles':
      renderRolesView(container);
      break;
    default:
      renderHomeView(container);
  }
}

// ==========================================================================
// 1. HOME DASHBOARD (Ref: Issues 1, 2, 3, 4)
// ==========================================================================
function renderHomeView(container) {
  updateHeader('Home Dashboard', 'Overview of clinic operations, face scan attendance, and today\'s schedule', `
    <button class="btn btn-outline" id="homeAddLeadBtn"><i class="fa-solid fa-user-plus"></i> Add Lead</button>
  `);

  // Issue 2: Clicking Add Lead opens Lead Page
  document.getElementById('homeAddLeadBtn').addEventListener('click', () => {
    switchNavTo('leads');
  });

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
      <!-- Issue 3: Face Scan Simulator -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fa-solid fa-face-smile"></i> Children Face Scan Attendance</h3>
          <span class="badge badge-primary">AI Recognition</span>
        </div>
        <div class="face-scan-box">
          <p style="font-size: 13px; color: #94a3b8;">Position child's face in the camera view for instant attendance marking</p>
          <div class="scan-viewport">
            <i class="fa-solid fa-user-astronaut" style="font-size: 54px; color: var(--secondary);"></i>
          </div>
          <div class="form-group" style="max-width: 260px; margin: 0 auto 12px;">
            <select class="form-control form-select" id="scanChildSelect">
              ${state.children.map(c => `<option value="${c.id}">${c.name} (${c.id})</option>`).join('')}
            </select>
          </div>
          <button class="btn btn-secondary btn-sm" id="triggerScanBtn"><i class="fa-solid fa-camera"></i> Scan Face & Mark Attendance</button>
        </div>
      </div>

      <!-- Issue 1: Theme Matching Calendar -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fa-solid fa-calendar-days"></i> Clinic Calendar</h3>
          <span class="badge badge-secondary">August 2026</span>
        </div>
        <div class="theme-calendar">
          <div class="calendar-grid">
            <div class="calendar-day-head">Su</div><div class="calendar-day-head">Mo</div><div class="calendar-day-head">Tu</div>
            <div class="calendar-day-head">We</div><div class="calendar-day-head">Th</div><div class="calendar-day-head">Fr</div><div class="calendar-day-head">Sa</div>

            <div class="calendar-day-cell">1</div><div class="calendar-day-cell">2</div><div class="calendar-day-cell">3</div><div class="calendar-day-cell">4</div><div class="calendar-day-cell">5</div><div class="calendar-day-cell">6</div><div class="calendar-day-cell">7</div>
            <div class="calendar-day-cell">8</div><div class="calendar-day-cell">9</div><div class="calendar-day-cell">10</div><div class="calendar-day-cell">11</div><div class="calendar-day-cell">12</div><div class="calendar-day-cell">13</div><div class="calendar-day-cell">14</div>
            <div class="calendar-day-cell">15</div><div class="calendar-day-cell">16</div><div class="calendar-day-cell">17</div><div class="calendar-day-cell">18</div><div class="calendar-day-cell">19</div><div class="calendar-day-cell">20</div>
            <div class="calendar-day-cell today has-event">21</div><div class="calendar-day-cell has-event">22</div><div class="calendar-day-cell">23</div><div class="calendar-day-cell">24</div><div class="calendar-day-cell">25</div><div class="calendar-day-cell">26</div><div class="calendar-day-cell">27</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Issue 4: Today's Appointments -->
    <div class="card" style="margin-top: 24px;">
      <div class="card-header">
        <h3 class="card-title"><i class="fa-solid fa-clock"></i> Today's Appointments</h3>
        <button class="btn btn-primary btn-sm" id="addAppointmentBtn"><i class="fa-solid fa-plus"></i> Add Appointment</button>
      </div>
      <div class="filter-bar">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" class="form-control" id="aptSearch" placeholder="Search patient or therapist...">
        </div>
        <input type="date" class="form-control" id="aptDateFilter" value="2026-08-21" style="width: auto;">
        <select class="form-control form-select" id="aptStatusFilter" style="width: auto;">
          <option value="All">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Therapist / Doctor</th>
              <th>Time</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="aptTableBody">
            ${renderAppointmentsRows(state.appointments)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Issue 3 Logic: Scan Face Safety Check
  document.getElementById('triggerScanBtn').addEventListener('click', () => {
    const selectedChildId = document.getElementById('scanChildSelect').value;
    const child = state.children.find(c => c.id === selectedChildId);
    const today = '2026-08-21';

    // Duplicate check
    const existing = state.childrenAttendance.find(a => a.childId === selectedChildId && a.date === today);
    if (existing) {
      showToast(`Attendance for ${child.name} has already been marked for today! Duplicate entry prevented.`, 'danger');
    } else {
      state.childrenAttendance.push({
        childId: child.id,
        childName: child.name,
        date: today,
        status: 'Present',
        markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      showToast(`Face recognized! Attendance successfully marked for ${child.name}.`, 'success');
    }
  });

  // Issue 4 Logic: Add Appointment Modal
  document.getElementById('addAppointmentBtn').addEventListener('click', () => {
    openModal('Add New Appointment', `
      <form id="addAptForm">
        <div class="form-group">
          <label class="form-label">Patient Name</label>
          <input type="text" class="form-control" id="newAptPatient" required placeholder="e.g. Liam Johnson">
        </div>
        <div class="form-group">
          <label class="form-label">Therapist / Doctor</label>
          <input type="text" class="form-control" id="newAptTherapist" required value="Dr. Sarah Jenkins">
        </div>
        <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label class="form-label">Date</label>
            <input type="date" class="form-control" id="newAptDate" value="2026-08-21" required>
          </div>
          <div>
            <label class="form-label">Time</label>
            <input type="time" class="form-control" id="newAptTime" value="10:00" required>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Therapy Type</label>
          <select class="form-control form-select" id="newAptType">
            <option>Speech Therapy</option>
            <option>Occupational Therapy</option>
            <option>Behavioral Therapy</option>
          </select>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitAddAppointment()">Save Appointment</button>
    `);
  });
}

function renderAppointmentsRows(apts) {
  if (apts.length === 0) return `<tr><td colspan="7" style="text-align: center; color: var(--slate-500);">No appointments found for the selected criteria.</td></tr>`;
  return apts.map(a => `
    <tr>
      <td><strong>${a.id}</strong></td>
      <td>${a.patientName}</td>
      <td>${a.therapist}</td>
      <td><i class="fa-regular fa-clock" style="color: var(--slate-400);"></i> ${a.time}</td>
      <td><span class="badge badge-secondary">${a.type}</span></td>
      <td><span class="badge badge-${a.status === 'Completed' ? 'success' : 'primary'}">${a.status}</span></td>
      <td><button class="btn btn-outline btn-sm" onclick="showToast('Appointment details for ${a.patientName}', 'success')">Details</button></td>
    </tr>
  `).join('');
}

window.submitAddAppointment = function() {
  const name = document.getElementById('newAptPatient').value;
  const therapist = document.getElementById('newAptTherapist').value;
  const date = document.getElementById('newAptDate').value;
  const time = document.getElementById('newAptTime').value;
  const type = document.getElementById('newAptType').value;

  if (!name) { showToast('Please enter patient name', 'danger'); return; }

  const newApt = {
    id: `APT-${Math.floor(100 + Math.random() * 900)}`,
    patientName: name,
    therapist,
    date,
    time,
    status: 'Scheduled',
    type
  };

  state.appointments.unshift(newApt);
  closeModal();
  showToast('New appointment scheduled successfully!', 'success');
  if (state.currentView === 'home') renderView('home');
};

// ==========================================================================
// 2. LEAD MANAGEMENT (Ref: Issues 5, 6, 7)
// ==========================================================================
function renderLeadsView(container) {
  updateHeader('Lead Management', 'Track, update, and manage prospective clinic leads and inquiries', `
    <button class="btn btn-primary" id="openAddLeadModalBtn"><i class="fa-solid fa-plus"></i> New Lead</button>
  `);

  container.innerHTML = `
    <div class="card">
      <div class="filter-bar">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" class="form-control" id="leadSearch" placeholder="Search lead by name, parent, phone...">
        </div>
        <select class="form-control form-select" id="leadStatusFilter" style="width: auto;">
          <option value="All">All Lead Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Converted">Converted</option>
        </select>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Lead ID</th>
              <th>Child Name</th>
              <th>Parent Name</th>
              <th>Phone</th>
              <th>Source</th>
              <th>Status (Dropdown Edit)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="leadTableBody">
            ${state.leads.map(l => `
              <tr>
                <td><strong>${l.id}</strong></td>
                <td><a href="#" style="font-weight: 600;" onclick="openLeadDetailsModal('${l.id}'); return false;">${l.name}</a></td>
                <td>${l.parentName}</td>
                <td>${l.phone}</td>
                <td><span class="badge badge-secondary">${l.source}</span></td>
                <td>
                  <!-- Issue 5: Dropdown Selection for Status Update -->
                  <select class="form-control form-select btn-sm" onchange="updateLeadStatus('${l.id}', this.value)" style="width: 130px; font-weight: 600;">
                    <option value="New" ${l.status === 'New' ? 'selected' : ''}>New</option>
                    <option value="Contacted" ${l.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                    <option value="Scheduled" ${l.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                    <option value="Converted" ${l.status === 'Converted' ? 'selected' : ''}>Converted</option>
                  </select>
                </td>
                <td>
                  <div style="display: flex; gap: 6px;">
                    <button class="btn btn-outline btn-sm" onclick="openLeadDetailsModal('${l.id}')"><i class="fa-solid fa-eye"></i> Details</button>
                    <button class="btn btn-secondary btn-sm" onclick="openLeadHistoryModal('${l.id}')"><i class="fa-solid fa-history"></i> History</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('openAddLeadModalBtn').addEventListener('click', () => {
    openModal('Create New Lead', `
      <form id="newLeadForm">
        <div class="form-group">
          <label class="form-label">Child Name</label>
          <input type="text" class="form-control" id="leadNameInput" required placeholder="Child's full name">
        </div>
        <div class="form-group">
          <label class="form-label">Parent Name</label>
          <input type="text" class="form-control" id="leadParentInput" required placeholder="Parent or Guardian name">
        </div>
        <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label class="form-label">Phone</label>
            <input type="tel" class="form-control" id="leadPhoneInput" required placeholder="+1 555-0000">
          </div>
          <div>
            <label class="form-label">Email</label>
            <input type="email" class="form-control" id="leadEmailInput" placeholder="parent@example.com">
          </div>
        </div>
        <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label class="form-label">Lead Source</label>
            <select class="form-control form-select" id="leadSourceInput">
              <option>Google Ads</option>
              <option>Social Media</option>
              <option>Doctor Referral</option>
              <option>Walk-in</option>
            </select>
          </div>
          <div>
            <label class="form-label">Preferred Date</label>
            <input type="date" class="form-control" id="leadPrefDateInput" value="2026-08-25">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Notes</label>
          <textarea class="form-control" id="leadNotesInput" rows="3" placeholder="Enter preliminary details or therapy requirements..."></textarea>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitCreateLead()">Create Lead</button>
    `);
  });
}

// Issue 5: Update Lead Status with History Track
window.updateLeadStatus = function(leadId, newStatus) {
  const lead = state.leads.find(l => l.id === leadId);
  if (lead) {
    const oldStatus = lead.status;
    lead.status = newStatus;
    lead.statusHistory.unshift({
      status: newStatus,
      date: new Date().toLocaleString(),
      updatedBy: 'Dr. Sarah Jenkins',
      notes: `Status changed from ${oldStatus} to ${newStatus}`
    });
    showToast(`Lead ${lead.id} status updated to ${newStatus}`, 'success');
  }
};

// Issue 5: Sticky Header/Footer Status History Modal
window.openLeadHistoryModal = function(leadId) {
  const lead = state.leads.find(l => l.id === leadId);
  openModal(`Status History - ${lead.name} (${lead.id})`, `
    <div style="margin-bottom: 16px;">
      <p style="font-size: 13px; color: var(--slate-500);">Complete chronological audit log of status updates for this lead.</p>
    </div>
    <div class="timeline">
      ${lead.statusHistory.map(h => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-date">${h.date} &bull; Updated by <strong>${h.updatedBy}</strong></div>
            <div class="timeline-title">Status: <span class="badge badge-primary">${h.status}</span></div>
            <p style="font-size: 13px; color: var(--slate-600); margin-top: 4px;">${h.notes}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `, `
    <button class="btn btn-primary" onclick="closeModal()">Done</button>
  `);
};

// Issue 6 & 7: Lead Details Modal with Complete Overview & Delete Confirmation
window.openLeadDetailsModal = function(leadId) {
  const lead = state.leads.find(l => l.id === leadId);
  openModal(`Lead Overview & Details - ${lead.name}`, `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
      <div class="form-group">
        <label class="form-label">Child Name</label>
        <input type="text" class="form-control" id="detLeadName" value="${lead.name}">
      </div>
      <div class="form-group">
        <label class="form-label">Parent Name</label>
        <input type="text" class="form-control" id="detLeadParent" value="${lead.parentName}">
      </div>
      <div class="form-group">
        <label class="form-label">Lead Source</label>
        <input type="text" class="form-control" id="detLeadSource" value="${lead.source}">
      </div>
      <div class="form-group">
        <label class="form-label">Preferred Date</label>
        <input type="date" class="form-control" id="detLeadPrefDate" value="${lead.preferredDate}">
      </div>
      <div class="form-group">
        <label class="form-label">Phone</label>
        <input type="text" class="form-control" id="detLeadPhone" value="${lead.phone}">
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="text" class="form-control" id="detLeadEmail" value="${lead.email}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Lead Notes</label>
      <textarea class="form-control" id="detLeadNotes" rows="3">${lead.notes}</textarea>
    </div>
  `, `
    <button class="btn btn-danger" onclick="confirmDeleteLead('${lead.id}')"><i class="fa-solid fa-trash"></i> Delete Lead</button>
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveLeadDetails('${lead.id}')"><i class="fa-solid fa-check"></i> Save Changes</button>
  `);
};

window.saveLeadDetails = function(leadId) {
  const lead = state.leads.find(l => l.id === leadId);
  lead.name = document.getElementById('detLeadName').value;
  lead.parentName = document.getElementById('detLeadParent').value;
  lead.source = document.getElementById('detLeadSource').value;
  lead.preferredDate = document.getElementById('detLeadPrefDate').value;
  lead.phone = document.getElementById('detLeadPhone').value;
  lead.email = document.getElementById('detLeadEmail').value;
  lead.notes = document.getElementById('detLeadNotes').value;
  closeModal();
  showToast('Lead details updated successfully!', 'success');
  renderView('leads');
};

// Issue 7: Delete Lead Confirmation Modal
window.confirmDeleteLead = function(leadId) {
  closeModal();
  openModal('Confirm Delete Lead', `
    <div style="text-align: center; padding: 16px;">
      <i class="fa-solid fa-triangle-exclamation" style="font-size: 48px; color: var(--danger); margin-bottom: 16px;"></i>
      <h4 style="font-size: 16px;">Are you sure you want to delete lead ${leadId}?</h4>
      <p style="font-size: 13px; color: var(--slate-500); margin-top: 8px;">This action cannot be undone and will permanently erase lead record and history.</p>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-danger" onclick="executeDeleteLead('${leadId}')">Yes, Delete Lead</button>
  `);
};

window.executeDeleteLead = function(leadId) {
  state.leads = state.leads.filter(l => l.id !== leadId);
  closeModal();
  showToast(`Lead ${leadId} deleted successfully.`, 'danger');
  renderView('leads');
};

window.submitCreateLead = function() {
  const name = document.getElementById('leadNameInput').value;
  const parentName = document.getElementById('leadParentInput').value;
  const phone = document.getElementById('leadPhoneInput').value;
  if (!name || !phone) { showToast('Please enter required lead fields', 'danger'); return; }

  state.leads.unshift({
    id: `LD-${Math.floor(100 + Math.random() * 900)}`,
    name,
    parentName,
    phone,
    email: document.getElementById('leadEmailInput').value || 'n/a',
    status: 'New',
    source: document.getElementById('leadSourceInput').value,
    preferredDate: document.getElementById('leadPrefDateInput').value,
    notes: document.getElementById('leadNotesInput').value,
    statusHistory: [{ status: 'New', date: new Date().toLocaleString(), updatedBy: 'Dr. Sarah Jenkins', notes: 'Created new lead' }]
  });
  closeModal();
  showToast('New lead created successfully!', 'success');
  renderView('leads');
};

// ==========================================================================
// 3. FOLLOW-UP MANAGEMENT (Ref: Issue 8)
// ==========================================================================
function renderFollowupsView(container) {
  // Issue 8: Main Title "Today's Follow-ups"
  updateHeader('Today\'s Follow-ups', 'Manage daily patient follow-ups, date filters, and quick call/WhatsApp communication', `
    <button class="btn btn-primary" onclick="showToast('Schedule Follow-up Feature', 'success')"><i class="fa-solid fa-plus"></i> Add Follow-up</button>
  `);

  container.innerHTML = `
    <div class="card">
      <!-- Calendar-based Date Filter -->
      <div class="filter-bar">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" class="form-control" placeholder="Search patient by name or phone...">
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <label class="form-label" style="margin: 0;">Date Filter:</label>
          <input type="date" class="form-control" value="2026-08-21" style="width: auto;">
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Phone</th>
              <th>Follow-up Date</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.followups.map(f => `
              <tr>
                <td><strong>${f.id}</strong></td>
                <td><a href="#" style="font-weight: 600;" onclick="openFollowupDetailModal('${f.id}'); return false;">${f.patientName}</a></td>
                <td>${f.phone}</td>
                <td><i class="fa-regular fa-calendar" style="color: var(--slate-400);"></i> ${f.date}</td>
                <td><span class="badge badge-${f.status === 'Completed' ? 'success' : 'warning'}">${f.status}</span></td>
                <td>${f.notes}</td>
                <td>
                  <!-- Issue 8: Quick Action Buttons (Call & WhatsApp) -->
                  <div style="display: flex; gap: 6px;">
                    <a href="tel:${f.phone}" class="btn btn-outline btn-sm" style="color: var(--primary);"><i class="fa-solid fa-phone"></i> Call</a>
                    <a href="https://wa.me/${f.phone.replace(/[^0-9]/g, '')}" target="_blank" class="btn btn-outline btn-sm" style="color: var(--success);"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.openFollowupDetailModal = function(fId) {
  const f = state.followups.find(item => item.id === fId);
  openModal(`Follow-up Details - ${f.patientName}`, `
    <div class="form-group">
      <label class="form-label">Patient Name</label>
      <input type="text" class="form-control" value="${f.patientName}" readonly>
    </div>
    <div class="form-group">
      <label class="form-label">Phone Number</label>
      <input type="text" class="form-control" value="${f.phone}" readonly>
    </div>
    <div class="form-group">
      <label class="form-label">Follow-up Status</label>
      <select class="form-control form-select" id="folStatusSelect">
        <option value="Pending" ${f.status === 'Pending' ? 'selected' : ''}>Pending</option>
        <option value="Completed" ${f.status === 'Completed' ? 'selected' : ''}>Completed</option>
        <option value="Rescheduled" ${f.status === 'Rescheduled' ? 'selected' : ''}>Rescheduled</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Follow-up Notes</label>
      <textarea class="form-control" id="folNotesText" rows="3">${f.notes}</textarea>
    </div>
  `, `
    <a href="tel:${f.phone}" class="btn btn-outline" style="color: var(--primary);"><i class="fa-solid fa-phone"></i> Call Patient</a>
    <a href="https://wa.me/${f.phone.replace(/[^0-9]/g, '')}" target="_blank" class="btn btn-success"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
    <button class="btn btn-primary" onclick="saveFollowupDetails('${f.id}')">Save Updates</button>
  `);
};

window.saveFollowupDetails = function(fId) {
  const f = state.followups.find(item => item.id === fId);
  f.status = document.getElementById('folStatusSelect').value;
  f.notes = document.getElementById('folNotesText').value;
  closeModal();
  showToast('Follow-up status and notes updated!', 'success');
  renderView('followups');
};

// ==========================================================================
// 4. CHILDREN / PATIENTS & OBSERVATION (Ref: Issues 9, 10, 11)
// ==========================================================================
function renderChildrenView(container) {
  updateHeader('Children / Patients', 'Manage registered children, observations, timelines, and payment history', `
    <button class="btn btn-primary" onclick="showToast('Register New Child Feature', 'success')"><i class="fa-solid fa-plus"></i> Register Child</button>
  `);

  container.innerHTML = `
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Child Name</th>
              <th>Parent Name</th>
              <th>Age / Gender</th>
              <th>Phone</th>
              <th>Joining Date</th>
              <th>Next Scheduled Observation Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.children.map(c => `
              <tr>
                <td><strong>${c.id}</strong></td>
                <!-- Issue 9: Clicking child opens Child Details (NOT observation screen directly) -->
                <td><a href="#" style="font-weight: 600;" onclick="openChildDetailsPage('${c.id}'); return false;">${c.name}</a></td>
                <td>${c.parentName}</td>
                <td>${c.age} yrs (${c.gender})</td>
                <td>${c.phone}</td>
                <td>${c.joiningDate}</td>
                <!-- Issue 9: Clear Display of Next Observation Date -->
                <td><span class="badge badge-warning"><i class="fa-solid fa-calendar-check"></i> ${c.nextObservationDate}</span></td>
                <td>
                  <div style="display: flex; gap: 6px;">
                    <button class="btn btn-outline btn-sm" onclick="openChildDetailsPage('${c.id}')"><i class="fa-solid fa-user-gear"></i> Details & Timeline</button>
                    <button class="btn btn-secondary btn-sm" onclick="openChildObservationScreen('${c.id}')"><i class="fa-solid fa-notes-medical"></i> Observations</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Issue 9: Child Details Page Modal with Complete Payment & Observation Timeline + PDF Export
window.openChildDetailsPage = function(childId) {
  const c = state.children.find(item => item.id === childId);
  openModal(`Child Profile & History - ${c.name} (${c.id})`, `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; background: var(--slate-50); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--slate-200);">
      <div>
        <p style="font-size: 12px; color: var(--slate-500);">Child Info</p>
        <h4 style="font-size: 16px;">${c.name} (${c.age} yrs, ${c.gender})</h4>
        <p style="font-size: 13px; color: var(--slate-600);">Parent: ${c.parentName} | ${c.phone}</p>
      </div>
      <div>
        <p style="font-size: 12px; color: var(--slate-500);">Next Scheduled Observation Date</p>
        <span class="badge badge-warning" style="font-size: 14px; padding: 6px 12px;"><i class="fa-solid fa-calendar-day"></i> ${c.nextObservationDate}</span>
      </div>
    </div>

    <!-- Observation Timeline -->
    <h4 style="font-size: 15px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-stethoscope" style="color: var(--primary);"></i> Observation Timeline</h4>
    <div class="timeline" style="margin-bottom: 24px;">
      ${c.observations.map(o => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-date">${o.date} &bull; ${o.evaluator}</div>
            <div class="timeline-title">${o.title}</div>
            <p style="font-size: 13px; color: var(--slate-600); margin-top: 4px;">${o.notes}</p>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Payment Timeline -->
    <h4 style="font-size: 15px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-credit-card" style="color: var(--success);"></i> Payment Timeline</h4>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${c.payments.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.date}</td>
              <td><strong>$${p.amount}</strong></td>
              <td>${p.method}</td>
              <td><span class="badge badge-success">${p.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `, `
    <!-- Issue 9: Download PDF Option -->
    <button class="btn btn-outline" onclick="downloadChildPDF('${c.id}')"><i class="fa-solid fa-file-pdf" style="color: var(--danger);"></i> Download PDF Summary</button>
    <button class="btn btn-primary" onclick="closeModal()">Close</button>
  `);
};

// Issue 9 PDF Download Simulation
window.downloadChildPDF = function(childId) {
  const c = state.children.find(item => item.id === childId);
  showToast(`Generating PDF Report for ${c.name}...`, 'success');
  setTimeout(() => {
    window.print();
  }, 600);
};

// Issue 10 & 11: Observation Screen & Crash-free Edit Fix
window.openChildObservationScreen = function(childId) {
  const c = state.children.find(item => item.id === childId);
  openModal(`Observation Timeline & Management - ${c.name}`, `
    <!-- Issue 10: Prominent Highlight for Next Observation Date & Total Completed Count -->
    <div style="display: flex; gap: 16px; margin-bottom: 20px;">
      <div style="flex: 1; background: var(--primary-light); border: 1px solid #c7d2fe; padding: 14px; border-radius: var(--radius-md); text-align: center;">
        <span style="font-size: 11px; font-weight: 700; color: #3730a3; text-transform: uppercase;">Next Observation Date</span>
        <h3 style="color: var(--primary); font-size: 18px; margin-top: 4px;"><i class="fa-solid fa-calendar-star"></i> ${c.nextObservationDate}</h3>
      </div>
      <div style="flex: 1; background: var(--success-light); border: 1px solid #a7f3d0; padding: 14px; border-radius: var(--radius-md); text-align: center;">
        <span style="font-size: 11px; font-weight: 700; color: #065f46; text-transform: uppercase;">Completed Observations</span>
        <h3 style="color: var(--success); font-size: 18px; margin-top: 4px;"><i class="fa-solid fa-clipboard-check"></i> ${c.observations.length} Completed</h3>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h4 style="font-size: 15px;">Past Observation Logs</h4>
      <button class="btn btn-primary btn-sm" onclick="addNewObservationModal('${c.id}')"><i class="fa-solid fa-plus"></i> Add Observation</button>
    </div>

    <div class="timeline">
      ${c.observations.map(o => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div class="timeline-date">${o.date} &bull; ${o.evaluator}</div>
                <div class="timeline-title">${o.title}</div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="editObservationModal('${c.id}', '${o.id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
            </div>
            <p style="font-size: 13px; color: var(--slate-600); margin-top: 6px;">${o.notes}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
  `);
};

// Issue 11: Edit Observation with Safe Save (Fix App Crash)
window.editObservationModal = function(childId, obsId) {
  const c = state.children.find(item => item.id === childId);
  const obs = c.observations.find(o => o.id === obsId);

  openModal(`Edit Observation - ${obs.title}`, `
    <form id="editObsForm">
      <div class="form-group">
        <label class="form-label">Observation Title</label>
        <input type="text" class="form-control" id="editObsTitle" value="${obs.title}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Date</label>
        <input type="date" class="form-control" id="editObsDate" value="${obs.date}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Evaluator / Doctor</label>
        <input type="text" class="form-control" id="editObsEvaluator" value="${obs.evaluator}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Observation Notes</label>
        <textarea class="form-control" id="editObsNotes" rows="4" required>${obs.notes}</textarea>
      </div>
    </form>
  `, `
    <button class="btn btn-secondary" onclick="openChildObservationScreen('${childId}')">Back</button>
    <button class="btn btn-primary" onclick="saveChildObservation('${childId}', '${obsId}')">Save Child Observation</button>
  `);
};

// Issue 11: Safe Save Handler
window.saveChildObservation = function(childId, obsId) {
  try {
    const c = state.children.find(item => item.id === childId);
    if (!c) throw new Error('Child record not found');
    const obs = c.observations.find(o => o.id === obsId);
    if (!obs) throw new Error('Observation record not found');

    obs.title = document.getElementById('editObsTitle').value;
    obs.date = document.getElementById('editObsDate').value;
    obs.evaluator = document.getElementById('editObsEvaluator').value;
    obs.notes = document.getElementById('editObsNotes').value;

    showToast('Child observation saved successfully without crashing!', 'success');
    openChildObservationScreen(childId);
  } catch (err) {
    showToast(`Failed to save observation: ${err.message}`, 'danger');
  }
};

window.addNewObservationModal = function(childId) {
  openModal('Add New Observation', `
    <div class="form-group">
      <label class="form-label">Observation Title</label>
      <input type="text" class="form-control" id="newObsTitle" placeholder="e.g. Fine Motor Skills Evaluation">
    </div>
    <div class="form-group">
      <label class="form-label">Date</label>
      <input type="date" class="form-control" id="newObsDate" value="2026-08-21">
    </div>
    <div class="form-group">
      <label class="form-label">Evaluator</label>
      <input type="text" class="form-control" id="newObsEvaluator" value="Dr. Sarah Jenkins">
    </div>
    <div class="form-group">
      <label class="form-label">Notes & Observations</label>
      <textarea class="form-control" id="newObsNotes" rows="3" placeholder="Enter findings..."></textarea>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="openChildObservationScreen('${childId}')">Cancel</button>
    <button class="btn btn-primary" onclick="submitNewObservation('${childId}')">Save Observation</button>
  `);
};

window.submitNewObservation = function(childId) {
  const c = state.children.find(item => item.id === childId);
  c.observations.unshift({
    id: `OBS-${Math.floor(100 + Math.random() * 900)}`,
    title: document.getElementById('newObsTitle').value || 'General Progress Note',
    date: document.getElementById('newObsDate').value,
    evaluator: document.getElementById('newObsEvaluator').value,
    notes: document.getElementById('newObsNotes').value,
    status: 'Completed'
  });
  showToast('New observation log added!', 'success');
  openChildObservationScreen(childId);
};

// ==========================================================================
// 5. CHILDREN ATTENDANCE (Ref: Issue 12)
// ==========================================================================
function renderChildrenAttendanceView(container) {
  updateHeader('Children Attendance', 'Mark, edit, and filter daily attendance logs for children', '');

  container.innerHTML = `
    <div class="card">
      <!-- Issue 12: Comprehensive Date Filters (Start/End Date, Month, Week) -->
      <div class="filter-bar">
        <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
          <div>
            <label class="form-label" style="margin: 0; font-size: 11px;">Start Date:</label>
            <input type="date" class="form-control" value="2026-08-01" style="width: auto;">
          </div>
          <div>
            <label class="form-label" style="margin: 0; font-size: 11px;">End Date:</label>
            <input type="date" class="form-control" value="2026-08-21" style="width: auto;">
          </div>
          <div>
            <label class="form-label" style="margin: 0; font-size: 11px;">Filter Month:</label>
            <select class="form-control form-select" style="width: auto;">
              <option>August 2026</option>
              <option>July 2026</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Child ID</th>
              <th>Child Name</th>
              <th>Date</th>
              <th>Attendance Status</th>
              <th>Marked Time</th>
              <th>Action Buttons</th>
            </tr>
          </thead>
          <tbody>
            ${state.children.map(c => {
              const att = state.childrenAttendance.find(a => a.childId === c.id && a.date === '2026-08-21');
              const isMarked = !!att;
              return `
                <tr>
                  <td><strong>${c.id}</strong></td>
                  <td>${c.name}</td>
                  <td>2026-08-21</td>
                  <td>
                    <!-- Issue 12: Display Current Marked Status -->
                    <span class="badge badge-${isMarked && att.status === 'Present' ? 'success' : 'secondary'}">
                      ${isMarked ? att.status : 'Not Marked'}
                    </span>
                  </td>
                  <td>${isMarked ? att.markedAt : '-'}</td>
                  <td>
                    <!-- Issue 12: Action buttons. If already marked -> show "Edit Attendance Status" instead of "Mark Attendance" -->
                    ${isMarked ? `
                      <button class="btn btn-outline btn-sm" onclick="openEditAttendanceModal('${c.id}')"><i class="fa-solid fa-pen-to-square"></i> Edit Attendance Status</button>
                    ` : `
                      <button class="btn btn-primary btn-sm" onclick="markChildAttendanceDirect('${c.id}', 'Present')"><i class="fa-solid fa-check"></i> Mark Attendance (Yes)</button>
                    `}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.markChildAttendanceDirect = function(childId, status) {
  const child = state.children.find(c => c.id === childId);
  state.childrenAttendance.push({
    childId: child.id,
    childName: child.name,
    date: '2026-08-21',
    status: status,
    markedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  showToast(`Attendance marked as ${status} for ${child.name}`, 'success');
  renderView('children-attendance');
};

window.openEditAttendanceModal = function(childId) {
  const child = state.children.find(c => c.id === childId);
  const att = state.childrenAttendance.find(a => a.childId === childId && a.date === '2026-08-21');

  openModal(`Edit Attendance Status - ${child.name}`, `
    <div class="form-group">
      <label class="form-label">Select Attendance Status</label>
      <select class="form-control form-select" id="editAttStatusSelect">
        <option value="Present" ${att && att.status === 'Present' ? 'selected' : ''}>Present</option>
        <option value="Absent" ${att && att.status === 'Absent' ? 'selected' : ''}>Absent</option>
      </select>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveEditedAttendance('${childId}')">Update Status</button>
  `);
};

window.saveEditedAttendance = function(childId) {
  const newStatus = document.getElementById('editAttStatusSelect').value;
  const att = state.childrenAttendance.find(a => a.childId === childId && a.date === '2026-08-21');
  if (att) {
    att.status = newStatus;
  }
  closeModal();
  showToast('Attendance status successfully updated!', 'success');
  renderView('children-attendance');
};

// ==========================================================================
// 6. DEPARTMENT & DESIGNATION (Ref: Issues 13 & 14 - Android Layouts)
// ==========================================================================
function renderDepartmentView(container) {
  updateHeader('Department Management', 'Manage clinic departments, active status toggles, and Android card view', `
    <button class="btn btn-primary" onclick="showToast('Add Department Feature', 'success')"><i class="fa-solid fa-plus"></i> New Department</button>
  `);

  container.innerHTML = `
    <!-- Issue 13: Clean Modern Android Layout with Toggle Switch Directly on Cards -->
    <div class="card-grid">
      ${state.departments.map(d => `
        <div class="android-card" onclick="openEditDepartmentModal('${d.id}')">
          <div>
            <div class="card-top">
              <div class="card-icon"><i class="fa-solid fa-building-user"></i></div>
              <label class="toggle-switch" onclick="event.stopPropagation();">
                <input type="checkbox" ${d.active ? 'checked' : ''} onchange="toggleDepartmentStatus('${d.id}', this.checked)">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <h4 style="font-size: 16px;">${d.name}</h4>
            <p style="font-size: 12px; color: var(--slate-500); margin-top: 2px;">Code: ${d.code} | Manager: ${d.manager}</p>
          </div>
          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--slate-100); display: flex; justify-content: space-between; align-items: center;">
            <span class="badge badge-${d.active ? 'success' : 'secondary'}">${d.active ? 'Active' : 'Inactive'}</span>
            <span style="font-size: 12px; color: var(--primary); font-weight: 600;">Edit &rarr;</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.toggleDepartmentStatus = function(deptId, active) {
  const d = state.departments.find(item => item.id === deptId);
  if (d) {
    d.active = active;
    showToast(`Department ${d.name} status set to ${active ? 'Active' : 'Inactive'}`, 'success');
  }
};

window.openEditDepartmentModal = function(deptId) {
  const d = state.departments.find(item => item.id === deptId);
  openModal(`Edit Department - ${d.name}`, `
    <form id="editDeptForm">
      <div class="form-group">
        <label class="form-label">Department Name</label>
        <input type="text" class="form-control" id="deptName" value="${d.name}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Department Code</label>
        <input type="text" class="form-control" id="deptCode" value="${d.code}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Department Manager</label>
        <input type="text" class="form-control" id="deptManager" value="${d.manager}" required>
      </div>
    </form>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveDepartment('${d.id}')">Save Changes</button>
  `);
};

window.saveDepartment = function(deptId) {
  const d = state.departments.find(item => item.id === deptId);
  d.name = document.getElementById('deptName').value;
  d.code = document.getElementById('deptCode').value;
  d.manager = document.getElementById('deptManager').value;
  closeModal();
  showToast('Department saved successfully!', 'success');
  renderView('department');
};

function renderDesignationView(container) {
  // Issue 14: Same Android Card layout as Department
  updateHeader('Designation Management', 'Manage job titles, department mappings, and status toggles', `
    <button class="btn btn-primary" onclick="showToast('Add Designation Feature', 'success')"><i class="fa-solid fa-plus"></i> New Designation</button>
  `);

  container.innerHTML = `
    <div class="card-grid">
      ${state.designations.map(des => `
        <div class="android-card" onclick="openEditDesignationModal('${des.id}')">
          <div>
            <div class="card-top">
              <div class="card-icon" style="background: var(--purple-light); color: var(--purple);"><i class="fa-solid fa-id-badge"></i></div>
              <label class="toggle-switch" onclick="event.stopPropagation();">
                <input type="checkbox" ${des.active ? 'checked' : ''} onchange="toggleDesignationStatus('${des.id}', this.checked)">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <h4 style="font-size: 16px;">${des.title}</h4>
            <p style="font-size: 12px; color: var(--slate-500); margin-top: 2px;">Department: ${des.department}</p>
          </div>
          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--slate-100); display: flex; justify-content: space-between; align-items: center;">
            <span class="badge badge-${des.active ? 'success' : 'secondary'}">${des.active ? 'Active' : 'Inactive'}</span>
            <span style="font-size: 12px; color: var(--primary); font-weight: 600;">Edit &rarr;</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.toggleDesignationStatus = function(desId, active) {
  const des = state.designations.find(item => item.id === desId);
  if (des) {
    des.active = active;
    showToast(`Designation ${des.title} status set to ${active ? 'Active' : 'Inactive'}`, 'success');
  }
};

window.openEditDesignationModal = function(desId) {
  const des = state.designations.find(item => item.id === desId);
  openModal(`Edit Designation - ${des.title}`, `
    <div class="form-group">
      <label class="form-label">Designation Title</label>
      <input type="text" class="form-control" id="desTitle" value="${des.title}">
    </div>
    <div class="form-group">
      <label class="form-label">Department</label>
      <select class="form-control form-select" id="desDept">
        ${state.departments.map(d => `<option ${d.name === des.department ? 'selected' : ''}>${d.name}</option>`).join('')}
      </select>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveDesignation('${des.id}')">Save Changes</button>
  `);
};

window.saveDesignation = function(desId) {
  const des = state.designations.find(item => item.id === desId);
  des.title = document.getElementById('desTitle').value;
  des.department = document.getElementById('desDept').value;
  closeModal();
  showToast('Designation details saved!', 'success');
  renderView('designation');
};

// ==========================================================================
// 7. LEAVE & LEAVE APPROVAL (Ref: Issues 15, 16, 17, 18)
// ==========================================================================
function renderLeaveRequestsView(container) {
  updateHeader('Leave Requests', 'Apply for leave and inspect your leave quotas and status', '');

  // Issue 15: Leave Quota Engine Math Calculation
  const q = state.leaveQuota;
  const casualRemaining = q.casual.allocated - q.casual.used;
  const sickRemaining = q.sick.allocated - q.sick.used;
  const earnedRemaining = q.earned.allocated - q.earned.used;

  container.innerHTML = `
    <!-- Issue 15: Fixed Leave Quota Display -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
      <div class="card" style="padding: 16px; margin: 0;">
        <span style="font-size: 12px; font-weight: 600; color: var(--slate-500);">Casual Leave Quota</span>
        <h3 style="font-size: 20px; color: var(--primary); margin-top: 4px;">${casualRemaining} <span style="font-size: 12px; color: var(--slate-400);">/ ${q.casual.allocated} Left</span></h3>
        <p style="font-size: 11px; color: var(--slate-500); margin-top: 4px;">Used: ${q.casual.used} Days</p>
      </div>
      <div class="card" style="padding: 16px; margin: 0;">
        <span style="font-size: 12px; font-weight: 600; color: var(--slate-500);">Sick Leave Quota</span>
        <h3 style="font-size: 20px; color: var(--warning); margin-top: 4px;">${sickRemaining} <span style="font-size: 12px; color: var(--slate-400);">/ ${q.sick.allocated} Left</span></h3>
        <p style="font-size: 11px; color: var(--slate-500); margin-top: 4px;">Used: ${q.sick.used} Days</p>
      </div>
      <div class="card" style="padding: 16px; margin: 0;">
        <span style="font-size: 12px; font-weight: 600; color: var(--slate-500);">Earned Leave Quota</span>
        <h3 style="font-size: 20px; color: var(--success); margin-top: 4px;">${earnedRemaining} <span style="font-size: 12px; color: var(--slate-400);">/ ${q.earned.allocated} Left</span></h3>
        <p style="font-size: 11px; color: var(--slate-500); margin-top: 4px;">Used: ${q.earned.used} Days</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">My Leave History</h3>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Dates</th>
              <th>Total Days</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Note / Rejection Reason</th>
            </tr>
          </thead>
          <tbody>
            ${state.leaveRequests.map(l => `
              <tr>
                <td><strong>${l.id}</strong></td>
                <td>${l.type}</td>
                <td>${l.startDate} to ${l.endDate}</td>
                <td><strong>${l.totalDays} Day(s)</strong></td>
                <td>${l.reason}</td>
                <td><span class="badge badge-${l.status === 'Approved' ? 'success' : (l.status === 'Rejected' ? 'danger' : 'warning')}">${l.status}</span></td>
                <td>${l.rejectionReason ? `<span style="color: var(--danger); font-size: 12px;">${l.rejectionReason}</span>` : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderLeaveApprovalView(container) {
  updateHeader('Leave Approvals', 'Review, approve, or reject employee leave applications with staff availability checks', '');

  container.innerHTML = `
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Name</th>
              <th>Leave Type</th>
              <th>Date Range</th>
              <th>Total Days</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.leaveRequests.map(l => `
              <tr>
                <td><strong>${l.id}</strong></td>
                <td><strong>${l.employeeName}</strong></td>
                <td>${l.type}</td>
                <td>${l.startDate} to ${l.endDate}</td>
                <td>${l.totalDays} Days</td>
                <td><span class="badge badge-${l.status === 'Approved' ? 'success' : (l.status === 'Rejected' ? 'danger' : 'warning')}">${l.status}</span></td>
                <td>
                  <!-- Issue 17: Clicking opens details modal -->
                  <button class="btn btn-outline btn-sm" onclick="openLeaveApprovalModal('${l.id}')"><i class="fa-solid fa-eye"></i> Review Request</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Issue 17 & 18: Leave Approval Details Modal with Scrollable Area & Availability Summary
window.openLeaveApprovalModal = function(leaveId) {
  const l = state.leaveRequests.find(item => item.id === leaveId);

  // Issue 18: Staff Availability Summary for selected dates
  const otherStaffOnLeave = state.employeeAttendance.filter(a => a.date === l.startDate && a.status === 'On Leave');

  openModal(`Leave Application Review - ${l.employeeName}`, `
    <div style="margin-bottom: 16px;">
      <h4 style="font-size: 16px; font-weight: 600;">Applicant: ${l.employeeName}</h4>
      <p style="font-size: 13px; color: var(--slate-500);">Type: <strong>${l.type}</strong> | Duration: <strong>${l.startDate} to ${l.endDate} (${l.totalDays} Days)</strong></p>
    </div>

    <!-- Issue 17: Scrollable content container -->
    <div style="background: var(--slate-50); border: 1px solid var(--slate-200); padding: 16px; border-radius: var(--radius-md); margin-bottom: 20px; max-height: 140px; overflow-y: auto;">
      <h5 style="font-size: 12px; text-transform: uppercase; color: var(--slate-500); margin-bottom: 6px;">Leave Reason Description</h5>
      <p style="font-size: 14px; color: var(--slate-700); line-height: 1.6;">${l.reason}</p>
    </div>

    <!-- Issue 18: Availability Summary Panel -->
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
      <h5 style="font-size: 13px; color: #166534; display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <i class="fa-solid fa-users"></i> Staff Availability Summary (${l.startDate})
      </h5>
      ${otherStaffOnLeave.length > 0 ? `
        <p style="font-size: 12px; color: #15803d;">Employees currently on leave on this date: ${otherStaffOnLeave.map(s => `<strong>${s.name}</strong>`).join(', ')}</p>
      ` : `
        <p style="font-size: 12px; color: #15803d;">All other clinic employees are fully available on this date.</p>
      `}
    </div>

    <!-- Issue 15: Mandatory Rejection Reason Input -->
    <div class="form-group" id="rejectReasonGroup" style="display: none;">
      <label class="form-label" style="color: var(--danger);">Mandatory Rejection Reason *</label>
      <textarea class="form-control" id="rejectionReasonText" rows="2" placeholder="Specify clear reason for rejecting leave application..."></textarea>
    </div>
  `, `
    ${l.isOwnRequest ? `
      <!-- Issue 15: Self-Leave restriction -->
      <span style="font-size: 12px; color: var(--warning); margin-right: auto;"><i class="fa-solid fa-lock"></i> You cannot approve your own leave request.</span>
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    ` : `
      <button class="btn btn-danger" onclick="triggerRejectLeave('${l.id}')"><i class="fa-solid fa-xmark"></i> Reject Request</button>
      <button class="btn btn-success" onclick="approveLeave('${l.id}')"><i class="fa-solid fa-check"></i> Approve Request</button>
    `}
  `);
};

window.approveLeave = function(leaveId) {
  const l = state.leaveRequests.find(item => item.id === leaveId);
  l.status = 'Approved';
  closeModal();
  showToast(`Leave request ${leaveId} approved!`, 'success');
  renderView('leave-approval');
};

// Issue 15: Mandatory Rejection Reason Logic
window.triggerRejectLeave = function(leaveId) {
  const grp = document.getElementById('rejectReasonGroup');
  const txt = document.getElementById('rejectionReasonText');
  if (grp.style.display === 'none') {
    grp.style.display = 'block';
    txt.focus();
    showToast('Please enter mandatory rejection reason below and click Reject again.', 'warning');
  } else {
    if (!txt.value.trim()) {
      showToast('Rejection reason is mandatory!', 'danger');
      return;
    }
    const l = state.leaveRequests.find(item => item.id === leaveId);
    l.status = 'Rejected';
    l.rejectionReason = txt.value;
    closeModal();
    showToast(`Leave request ${leaveId} rejected with reason logged.`, 'danger');
    renderView('leave-approval');
  }
};

// ==========================================================================
// 8. EMPLOYEE & ATTENDANCE (Ref: Issues 19, 20, 21)
// ==========================================================================
function renderEmployeesView(container) {
  updateHeader('Employee Management', 'View staff details, duty working hours, and status filters', `
    <button class="btn btn-primary" onclick="showToast('Add Employee Feature', 'success')"><i class="fa-solid fa-user-plus"></i> Add Employee</button>
  `);

  container.innerHTML = `
    <div class="card">
      <!-- Issue 19: Active/Inactive Filter Option -->
      <div class="filter-bar">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" class="form-control" placeholder="Search employee by name, role, email...">
        </div>
        <select class="form-control form-select" style="width: auto;">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Duty Hours</th>
              <th>Status Toggle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${state.employees.map(e => `
              <tr>
                <td><strong>${e.id}</strong></td>
                <!-- Issue 19: Clicking opens view-only details modal -->
                <td><a href="#" style="font-weight: 600;" onclick="openViewOnlyEmployeeModal('${e.id}'); return false;">${e.name}</a></td>
                <td>${e.department}</td>
                <td>${e.designation}</td>
                <!-- Issue 19: Duty Time Fields -->
                <td><span class="badge badge-secondary"><i class="fa-regular fa-clock"></i> ${e.dutyTime}</span></td>
                <td>
                  <!-- Issue 19: Active/Inactive Toggle directly on list -->
                  <label class="toggle-switch">
                    <input type="checkbox" ${e.active ? 'checked' : ''} onchange="toggleEmployeeActive('${e.id}', this.checked)">
                    <span class="toggle-slider"></span>
                  </label>
                </td>
                <td>
                  <div style="display: flex; gap: 6px;">
                    <button class="btn btn-outline btn-sm" onclick="openViewOnlyEmployeeModal('${e.id}')"><i class="fa-solid fa-eye"></i> View</button>
                    <!-- Issue 19: Separate Edit Employee Button -->
                    <button class="btn btn-secondary btn-sm" onclick="openEditableEmployeeModal('${e.id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.toggleEmployeeActive = function(empId, active) {
  const e = state.employees.find(item => item.id === empId);
  if (e) {
    e.active = active;
    showToast(`Employee ${e.name} status updated to ${active ? 'Active' : 'Inactive'}`, 'success');
  }
};

// Issue 19: View-only Employee Details Modal
window.openViewOnlyEmployeeModal = function(empId) {
  const e = state.employees.find(item => item.id === empId);
  openModal(`Employee Details (View Only) - ${e.name}`, `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      <div class="form-group"><label class="form-label">Name</label><p style="font-weight: 600;">${e.name}</p></div>
      <div class="form-group"><label class="form-label">Email</label><p style="font-weight: 600;">${e.email}</p></div>
      <div class="form-group"><label class="form-label">Department</label><p style="font-weight: 600;">${e.department}</p></div>
      <div class="form-group"><label class="form-label">Designation</label><p style="font-weight: 600;">${e.designation}</p></div>
      <div class="form-group"><label class="form-label">Duty Working Hours</label><p style="font-weight: 600;">${e.dutyTime}</p></div>
      <div class="form-group"><label class="form-label">Status</label><p style="font-weight: 600;">${e.active ? 'Active' : 'Inactive'}</p></div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    <button class="btn btn-primary" onclick="openEditableEmployeeModal('${e.id}')"><i class="fa-solid fa-pen-to-square"></i> Edit Employee</button>
  `);
};

window.openEditableEmployeeModal = function(empId) {
  const e = state.employees.find(item => item.id === empId);
  openModal(`Edit Employee - ${e.name}`, `
    <div class="form-group">
      <label class="form-label">Full Name</label>
      <input type="text" class="form-control" id="editEmpName" value="${e.name}">
    </div>
    <div class="form-group">
      <label class="form-label">Email</label>
      <input type="email" class="form-control" id="editEmpEmail" value="${e.email}">
    </div>
    <div class="form-group">
      <label class="form-label">Duty Working Hours</label>
      <input type="text" class="form-control" id="editEmpDutyTime" value="${e.dutyTime}" placeholder="e.g. 08:00 AM - 06:00 PM">
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveEmployee('${e.id}')">Save Changes</button>
  `);
};

window.saveEmployee = function(empId) {
  const e = state.employees.find(item => item.id === empId);
  e.name = document.getElementById('editEmpName').value;
  e.email = document.getElementById('editEmpEmail').value;
  e.dutyTime = document.getElementById('editEmpDutyTime').value;
  closeModal();
  showToast('Employee details updated!', 'success');
  renderView('employees');
};

// Issue 20: Employee Attendance with Search Bar & Comprehensive Date Filters
function renderEmployeeAttendanceView(container) {
  updateHeader('Employee Attendance', 'Track staff check-ins, check-outs, and search attendance records', '');

  container.innerHTML = `
    <div class="card">
      <div class="filter-bar">
        <!-- Issue 20: Prominent Employee Search Bar -->
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" class="form-control" id="empAttSearch" placeholder="Search employee by name or ID...">
        </div>
        <!-- Issue 20: Date Filters (Start/End Date, Month, Week) -->
        <input type="date" class="form-control" value="2026-08-21" style="width: auto;">
        <select class="form-control form-select" style="width: auto;">
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>
          <tbody>
            ${state.employeeAttendance.map(a => `
              <tr>
                <td><strong>${a.employeeId}</strong></td>
                <td>${a.name}</td>
                <td>${a.date}</td>
                <td><span class="badge badge-${a.status === 'Present' ? 'success' : 'warning'}">${a.status}</span></td>
                <td>${a.checkIn}</td>
                <td>${a.checkOut}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ==========================================================================
// 9. CONTACT MANAGEMENT (Ref: Issue 22)
// ==========================================================================
function renderContactsView(container) {
  updateHeader('Contact Management', 'Search contacts by Name, Occupation, and connect via direct call', `
    <button class="btn btn-primary" onclick="showToast('Add Contact Feature', 'success')"><i class="fa-solid fa-plus"></i> New Contact</button>
  `);

  container.innerHTML = `
    <div class="card">
      <!-- Issue 22: Search Bar remains visible during outside taps -->
      <div class="filter-bar">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" class="form-control" id="contactSearchInput" oninput="filterContacts(this.value)" placeholder="Search by Name, Occupation, Email, City...">
        </div>
      </div>

      <div class="card-grid" id="contactsGrid">
        ${renderContactsCards(state.contacts)}
      </div>
    </div>
  `;
}

function renderContactsCards(list) {
  return list.map(c => `
    <div class="android-card">
      <div>
        <div class="card-top">
          <div class="card-icon" style="background: var(--secondary-light); color: var(--secondary);"><i class="fa-solid fa-address-book"></i></div>
        </div>
        <h4 style="font-size: 16px;">${c.name}</h4>
        <!-- Issue 22: Searchable by Occupation -->
        <p style="font-size: 13px; color: var(--primary); font-weight: 600; margin-top: 2px;">${c.occupation}</p>
        <p style="font-size: 12px; color: var(--slate-500); margin-top: 4px;">${c.email} &bull; ${c.city}</p>
      </div>
      <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--slate-100);">
        <!-- Issue 22: Direct Call Button -->
        <a href="tel:${c.phone}" class="btn btn-primary btn-sm" style="width: 100%;"><i class="fa-solid fa-phone"></i> Direct Call (${c.phone})</a>
      </div>
    </div>
  `).join('');
}

window.filterContacts = function(query) {
  const q = query.toLowerCase();
  const filtered = state.contacts.filter(c => 
    c.name.toLowerCase().includes(q) ||
    c.occupation.toLowerCase().includes(q) ||
    c.email.toLowerCase().includes(q) ||
    c.city.toLowerCase().includes(q)
  );
  document.getElementById('contactsGrid').innerHTML = renderContactsCards(filtered);
};

// ==========================================================================
// 10. EXPENSE MANAGEMENT (Ref: Issue 23)
// ==========================================================================
function renderExpensesView(container) {
  updateHeader('Expense Management', 'Track clinic expenses, fast process, and duplicate submit protection', `
    <button class="btn btn-primary" id="openAddExpenseBtn"><i class="fa-solid fa-plus"></i> Add Expense</button>
  `);

  container.innerHTML = `
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Expense Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="expenseTableBody">
            ${state.expenses.map(e => `
              <tr>
                <td><strong>${e.id}</strong></td>
                <td>${e.title}</td>
                <td><span class="badge badge-secondary">${e.category}</span></td>
                <td><strong>$${e.amount.toFixed(2)}</strong></td>
                <td>${e.date}</td>
                <td><span class="badge badge-success">${e.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('openAddExpenseBtn').addEventListener('click', () => {
    openModal('Add New Clinic Expense', `
      <form id="expenseForm">
        <div class="form-group">
          <label class="form-label">Expense Title</label>
          <input type="text" class="form-control" id="expTitle" required placeholder="e.g. Office Stationery Supplies">
        </div>
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-control form-select" id="expCategory">
            <option>Therapy Supplies</option>
            <option>Facility Repair</option>
            <option>Utilities & Internet</option>
            <option>Staff Welfare</option>
          </select>
        </div>
        <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label class="form-label">Amount ($)</label>
            <input type="number" class="form-control" id="expAmount" step="0.01" required placeholder="0.00">
          </div>
          <div>
            <label class="form-label">Date</label>
            <input type="date" class="form-control" id="expDate" value="2026-08-21" required>
          </div>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <!-- Issue 23: Fast Save Process with Button Loading State -->
      <button class="btn btn-primary" id="saveExpenseBtn" onclick="submitFastExpense()">Save Expense</button>
    `);
  });
}

// Issue 23: Fast Save Process with Duplicate Submit Prevention & Toast Feedback
window.submitFastExpense = function() {
  const btn = document.getElementById('saveExpenseBtn');
  const title = document.getElementById('expTitle').value;
  const amount = parseFloat(document.getElementById('expAmount').value);

  if (!title || !amount) { showToast('Please enter expense title and amount', 'danger'); return; }

  // Prevent Duplicate Entries: Disable Button & Show Loading
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

  setTimeout(() => {
    state.expenses.unshift({
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      title,
      category: document.getElementById('expCategory').value,
      amount,
      date: document.getElementById('expDate').value,
      status: 'Paid'
    });

    closeModal();
    // Issue 23: Success Confirmation Toast Message
    showToast('Expense added successfully!', 'success');
    renderView('expenses');
  }, 400); // Fast response time
};

// ==========================================================================
// 11. INVOICE MANAGEMENT (Ref: Issue 24)
// ==========================================================================
function renderInvoicesView(container) {
  updateHeader('Invoice Management', 'Generate automated invoices based on child present days & therapy session rates', `
    <button class="btn btn-primary" id="createInvoiceBtn"><i class="fa-solid fa-plus"></i> Generate Invoice</button>
  `);

  container.innerHTML = `
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Child Name</th>
              <th>Period</th>
              <th>Present Days</th>
              <th>Rate / Session</th>
              <th>Total Bill</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${state.invoices.map(inv => `
              <tr>
                <td><strong>${inv.id}</strong></td>
                <td>${inv.childName}</td>
                <td>${inv.month} (${inv.startDate} to ${inv.endDate})</td>
                <td><span class="badge badge-primary">${inv.presentDays} Days Present</span></td>
                <td>$${inv.therapyRate} / day</td>
                <td><strong style="color: var(--success);">$${inv.totalAmount}</strong></td>
                <td><span class="badge badge-${inv.status === 'Paid' ? 'success' : 'warning'}">${inv.status}</span></td>
                <td><button class="btn btn-outline btn-sm" onclick="openPrintInvoiceModal('${inv.id}')"><i class="fa-solid fa-receipt"></i> View Invoice</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('createInvoiceBtn').addEventListener('click', () => {
    openModal('Create Automated Therapy Invoice', `
      <form id="invoiceForm">
        <!-- Issue 24: Child Selection -->
        <div class="form-group">
          <label class="form-label">Select Child / Patient</label>
          <select class="form-control form-select" id="invChildSelect" onchange="calculateInvoicePreview()">
            ${state.children.map(c => `<option value="${c.id}">${c.name} (${c.id})</option>`).join('')}
          </select>
        </div>

        <!-- Issue 24: Month or Custom Start/End Date -->
        <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label class="form-label">Start Date</label>
            <input type="date" class="form-control" id="invStartDate" value="2026-08-01" onchange="calculateInvoicePreview()">
          </div>
          <div>
            <label class="form-label">End Date</label>
            <input type="date" class="form-control" id="invEndDate" value="2026-08-21" onchange="calculateInvoicePreview()">
          </div>
        </div>

        <!-- Issue 24: Auto-bill from Joining Date option -->
        <div class="form-group" style="display: flex; align-items: center; gap: 10px;">
          <input type="checkbox" id="invAutoJoin" onchange="calculateInvoicePreview()">
          <label for="invAutoJoin" style="font-size: 13px; cursor: pointer;">Auto-bill based on Child's Joining Date</label>
        </div>

        <!-- Issue 24: Automatic Therapy Math Calculation Preview -->
        <div style="background: var(--slate-50); border: 1px solid var(--slate-200); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;" id="invMathPreview">
          <!-- Dynamic Math Preview -->
        </div>

        <!-- Issue 24: Additional Line Item Expenses -->
        <div class="form-group">
          <label class="form-label">Additional Expense Line Item (Optional)</label>
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 10px;">
            <input type="text" class="form-control" id="invExtraDesc" placeholder="Description (e.g. Assessment Book)">
            <input type="number" class="form-control" id="invExtraAmount" placeholder="Amount ($)" value="0" oninput="calculateInvoicePreview()">
          </div>
        </div>
      </form>
    `, `
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitGenerateInvoice()">Generate & Save Invoice</button>
    `);

    calculateInvoicePreview();
  });
}

// Issue 24: Therapy Billing Math Engine: Present Days * Therapy Session Rate
window.calculateInvoicePreview = function() {
  const childId = document.getElementById('invChildSelect').value;
  const child = state.children.find(c => c.id === childId);
  const autoJoin = document.getElementById('invAutoJoin').checked;
  const extraAmount = parseFloat(document.getElementById('invExtraAmount').value) || 0;

  let presentCount = state.childrenAttendance.filter(a => a.childId === childId && a.status === 'Present').length || 10;
  let rate = child.therapyRate || 50;
  let therapyTotal = presentCount * rate;
  let finalBill = therapyTotal + extraAmount;

  document.getElementById('invMathPreview').innerHTML = `
    <h5 style="font-size: 13px; color: var(--slate-700); margin-bottom: 8px;">Calculation Breakdown:</h5>
    <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--slate-600);">
      <span>Attendance Count (${autoJoin ? 'From Joining Date' : 'Selected Period'}):</span>
      <strong>${presentCount} Present Days</strong>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--slate-600); margin-top: 4px;">
      <span>Therapy Rate per Session:</span>
      <strong>$${rate} / day</strong>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--slate-600); margin-top: 4px;">
      <span>Therapy Charge Subtotal (${presentCount} x $${rate}):</span>
      <strong>$${therapyTotal}</strong>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; color: var(--success); margin-top: 8px; border-top: 1px dashed var(--slate-300); padding-top: 8px;">
      <span>Final Calculated Invoice Total:</span>
      <span>$${finalBill}</span>
    </div>
  `;
};

window.submitGenerateInvoice = function() {
  const childId = document.getElementById('invChildSelect').value;
  const child = state.children.find(c => c.id === childId);
  const extraDesc = document.getElementById('invExtraDesc').value;
  const extraAmount = parseFloat(document.getElementById('invExtraAmount').value) || 0;
  const presentDays = 10;
  const rate = child.therapyRate || 50;

  const lineItems = [];
  if (extraDesc && extraAmount > 0) lineItems.push({ description: extraDesc, amount: extraAmount });

  const newInv = {
    id: `INV-${Math.floor(100 + Math.random() * 900)}`,
    childId,
    childName: child.name,
    month: 'August 2026',
    startDate: document.getElementById('invStartDate').value,
    endDate: document.getElementById('invEndDate').value,
    presentDays,
    therapyRate: rate,
    lineItems,
    totalAmount: (presentDays * rate) + extraAmount,
    status: 'Pending'
  };

  state.invoices.unshift(newInv);
  closeModal();
  showToast('Automated invoice generated successfully!', 'success');
  renderView('invoices');
};

window.openPrintInvoiceModal = function(invId) {
  const inv = state.invoices.find(i => i.id === invId);
  openModal(`Invoice ${inv.id} - ${inv.childName}`, `
    <div style="background: white; border: 1px solid var(--slate-200); padding: 20px; border-radius: var(--radius-md);">
      <div style="display: flex; justify-content: space-between; border-bottom: 2px solid var(--primary); padding-bottom: 12px; margin-bottom: 16px;">
        <div>
          <h3 style="color: var(--primary);">CareSync Pro Clinic</h3>
          <p style="font-size: 12px; color: var(--slate-500);">Official Therapy Invoice</p>
        </div>
        <div style="text-align: right;">
          <h4>${inv.id}</h4>
          <p style="font-size: 12px; color: var(--slate-500);">Period: ${inv.month}</p>
        </div>
      </div>
      <p style="font-size: 14px; margin-bottom: 12px;">Billed To: <strong>${inv.childName}</strong></p>
      <table class="data-table" style="margin-bottom: 16px;">
        <thead>
          <tr><th>Description</th><th>Qty / Rate</th><th>Total</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Therapy Sessions (${inv.presentDays} Present Days)</td>
            <td>${inv.presentDays} days x $${inv.therapyRate}</td>
            <td><strong>$${inv.presentDays * inv.therapyRate}</strong></td>
          </tr>
          ${inv.lineItems.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>1</td>
              <td><strong>$${item.amount}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="text-align: right; font-size: 16px; font-weight: 700; color: var(--success);">
        Total Due: $${inv.totalAmount}
      </div>
    </div>
  `, `
    <button class="btn btn-outline" onclick="window.print()"><i class="fa-solid fa-print"></i> Print Invoice</button>
    <button class="btn btn-primary" onclick="closeModal()">Close</button>
  `);
};

// ==========================================================================
// 12. PAYMENT REMINDER EXPLANATION & WORKFLOW (Ref: Issue 25)
// ==========================================================================
function renderPaymentRemindersView(container) {
  updateHeader('Payment Reminders', 'Automated reminder triggers, WhatsApp integration & workflow overview', '');

  container.innerHTML = `
    <!-- Issue 25 Explanation Card -->
    <div class="card" style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: white;">
      <h3 style="color: white; font-size: 20px; margin-bottom: 8px;"><i class="fa-solid fa-circle-info" style="color: var(--secondary);"></i> How Payment Reminders Work</h3>
      <p style="font-size: 14px; color: #c7d2fe; line-height: 1.6;">
        Payment Reminders operate on an automated lifecycle engine:
        <br>1. <strong>Trigger Schedule</strong>: Automatically scans pending invoices 3 days prior to due date and post due date.
        <br>2. <strong>Multi-Channel Messaging</strong>: Generates direct one-click <strong>WhatsApp API link</strong> and SMS templates formatted with student details & payment link.
        <br>3. <strong>Reminder Log Audit</strong>: Records every dispatched notice in the audit trail to prevent over-notifying parents.
      </p>
    </div>

    <!-- Live Interactive Reminder Trigger -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fa-solid fa-bell"></i> Send One-Click Payment Reminder</h3>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Child Name</th>
              <th>Invoice ID</th>
              <th>Pending Amount</th>
              <th>Due Status</th>
              <th>Trigger Reminder</th>
            </tr>
          </thead>
          <tbody>
            ${state.invoices.filter(i => i.status === 'Pending').map(inv => `
              <tr>
                <td><strong>${inv.childName}</strong></td>
                <td>${inv.id}</td>
                <td><strong style="color: var(--danger);">$${inv.totalAmount}</strong></td>
                <td><span class="badge badge-warning">Due Now</span></td>
                <td>
                  <button class="btn btn-success btn-sm" onclick="sendWhatsAppPaymentReminder('${inv.childName}', '${inv.totalAmount}')">
                    <i class="fa-brands fa-whatsapp"></i> Send WhatsApp Reminder
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.sendWhatsAppPaymentReminder = function(childName, amount) {
  const text = encodeURIComponent(`Hello! This is a friendly payment reminder from CareSync Pro Clinic for ${childName}. Pending amount due is $${amount}. Please complete the payment at your earliest convenience.`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
  showToast(`WhatsApp payment reminder link opened for ${childName}!`, 'success');
};

// ==========================================================================
// 13. USER MANAGEMENT & USER ROLES (Ref: Issues 27 & 28)
// ==========================================================================
function renderUsersView(container) {
  updateHeader('User Management', 'Manage system access accounts, roles, and status toggles', `
    <button class="btn btn-primary" onclick="showToast('Add User Account', 'success')"><i class="fa-solid fa-user-plus"></i> Add System User</button>
  `);

  container.innerHTML = `
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Email Address</th>
              <th>Assigned Role</th>
              <th>Account Status</th>
            </tr>
          </thead>
          <tbody>
            ${state.users.map(u => `
              <tr>
                <td><strong>${u.id}</strong></td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td><span class="badge badge-primary">${u.role}</span></td>
                <td>
                  <label class="toggle-switch">
                    <input type="checkbox" ${u.active ? 'checked' : ''} onchange="showToast('User status updated', 'success')">
                    <span class="toggle-slider"></span>
                  </label>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderRolesView(container) {
  updateHeader('User Roles & Permissions Matrix', 'Define granular feature access permissions per role', `
    <button class="btn btn-primary" onclick="showToast('Add Role Feature', 'success')"><i class="fa-solid fa-shield-plus"></i> Create New Role</button>
  `);

  const allPermissions = ['Leads', 'Children', 'Leave Approval', 'Expenses', 'Invoices', 'User Management'];

  container.innerHTML = `
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Role Name</th>
              ${allPermissions.map(p => `<th>${p}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${state.roles.map(r => `
              <tr>
                <td><strong>${r.name}</strong></td>
                ${allPermissions.map(p => `
                  <td>
                    <input type="checkbox" ${r.permissions.includes(p) ? 'checked' : ''} onchange="showToast('Role permissions updated', 'success')">
                  </td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ==========================================================================
// UTILITY FUNCTIONS (Modal & Toast Systems)
// ==========================================================================
function switchNavTo(viewName) {
  const item = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (item) item.click();
}

function initModal() {
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', (e) => {
    if (e.target.id === 'modalBackdrop') closeModal();
  });
}

function openModal(title, bodyHtml, footerHtml = '') {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  document.getElementById('modalFooter').innerHTML = footerHtml;
  document.getElementById('modalBackdrop').classList.add('active');
}

function closeModal() {
  document.getElementById('modalBackdrop').classList.remove('active');
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : (type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-xmark')}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
