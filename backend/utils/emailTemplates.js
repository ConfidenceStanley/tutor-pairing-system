const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TutorPair</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                   'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f7;
      color: #1a1a2e;
    }
    .wrapper {
      max-width: 600px;
      margin: 32px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
      padding: 32px 40px;
      text-align: center;
    }
    .header-logo {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .logo-icon {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .logo-text {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.3px;
    }
    .body {
      padding: 40px;
    }
    .greeting {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 12px;
    }
    .text {
      font-size: 15px;
      color: #4b5563;
      line-height: 1.7;
      margin-bottom: 16px;
    }
    .card {
      background: #f9f7ff;
      border: 1px solid #ede9fe;
      border-radius: 12px;
      padding: 20px 24px;
      margin: 24px 0;
    }
    .card-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #ede9fe;
      font-size: 14px;
    }
    .card-row:last-child { border-bottom: none; }
    .card-label {
      color: #6b7280;
      font-weight: 500;
    }
    .card-value {
      color: #1a1a2e;
      font-weight: 600;
      text-align: right;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-success { background: #d1fae5; color: #065f46; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger  { background: #fee2e2; color: #991b1b; }
    .badge-info    { background: #ede9fe; color: #5b21b6; }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      margin: 8px 0;
    }
    .btn-center { text-align: center; margin: 28px 0; }
    .divider {
      border: none;
      border-top: 1px solid #f3f4f6;
      margin: 28px 0;
    }
    .footer {
      background: #f9fafb;
      border-top: 1px solid #f3f4f6;
      padding: 24px 40px;
      text-align: center;
    }
    .footer-text {
      font-size: 13px;
      color: #9ca3af;
      line-height: 1.6;
    }
    .footer-brand {
      font-size: 13px;
      color: #7c3aed;
      font-weight: 600;
    }
    .highlight {
      color: #7c3aed;
      font-weight: 600;
    }
    .alert-box {
      border-radius: 10px;
      padding: 14px 18px;
      margin: 20px 0;
      font-size: 14px;
      line-height: 1.6;
    }
    .alert-warning {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      color: #92400e;
    }
    .alert-success {
      background: #ecfdf5;
      border-left: 4px solid #22c55e;
      color: #065f46;
    }
    .alert-danger {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
      color: #991b1b;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-logo">
        <div class="logo-icon">🎓</div>
        <span class="logo-text">TutorPair</span>
      </div>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p class="footer-brand">TutorPair</p>
      <p class="footer-text">
        University Tutoring Platform<br/>
        This is an automated message — please do not reply directly to this email.
      </p>
    </div>
  </div>
</body>
</html>
`;

// ─── Welcome Email ───────────────────────────────────────────────────────────

const welcomeEmail = (name) => ({
  subject: "Welcome to TutorPair! 🎓",
  html: baseTemplate(`
    <p class="greeting">Welcome aboard, ${name}! 👋</p>
    <p class="text">
      We're thrilled to have you join <span class="highlight">TutorPair</span> —
      the university tutoring platform built to connect students with expert tutors.
    </p>
    <p class="text">Here's what you can do right now:</p>
    <div class="card">
      <div class="card-row">
        <span class="card-label">🔍 Find Tutors</span>
        <span class="card-value">Search by subject, department, or level</span>
      </div>
      <div class="card-row">
        <span class="card-label">📅 Book Sessions</span>
        <span class="card-value">Schedule at your convenience</span>
      </div>
      <div class="card-row">
        <span class="card-label">💳 Pay Securely</span>
        <span class="card-value">Powered by Paystack</span>
      </div>
      <div class="card-row">
        <span class="card-label">⭐ Leave Reviews</span>
        <span class="card-value">Help others find great tutors</span>
      </div>
    </div>
    <div class="alert-success">
      Your account is ready to go. Complete your profile to get the most out of TutorPair!
    </div>
    <hr class="divider" />
    <p class="text" style="font-size:13px; color:#9ca3af;">
      If you didn't create this account, please ignore this email.
    </p>
  `),
});

// ─── Session Request Email (to Tutor) ────────────────────────────────────────

const sessionRequestEmail = (tutorName, studentName, subject, date, time) => ({
  subject: `New Session Request — ${subject}`,
  html: baseTemplate(`
    <p class="greeting">New Session Request! 📬</p>
    <p class="text">
      Hi <span class="highlight">${tutorName}</span>, you have a new session request
      from a student. Review the details below and accept or decline from your dashboard.
    </p>
    <div class="card">
      <div class="card-row">
        <span class="card-label">Student</span>
        <span class="card-value">${studentName}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Subject</span>
        <span class="card-value">${subject}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Date</span>
        <span class="card-value">${date}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Time</span>
        <span class="card-value">${time}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Status</span>
        <span class="card-value">
          <span class="badge badge-warning">Pending</span>
        </span>
      </div>
    </div>
    <div class="alert-warning">
      Please respond promptly. Students are waiting for your confirmation.
    </div>
    <p class="text">
      Log in to your dashboard to accept or decline this request.
    </p>
  `),
});

// ─── Session Accepted Email (to Student) ─────────────────────────────────────

const sessionAcceptedEmail = (studentName, tutorName, subject, date, time) => ({
  subject: `Session Confirmed — ${subject} with ${tutorName} ✅`,
  html: baseTemplate(`
    <p class="greeting">Your Session is Confirmed! ✅</p>
    <p class="text">
      Great news, <span class="highlight">${studentName}</span>!
      <span class="highlight">${tutorName}</span> has accepted your session request.
      Here are your session details:
    </p>
    <div class="card">
      <div class="card-row">
        <span class="card-label">Tutor</span>
        <span class="card-value">${tutorName}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Subject</span>
        <span class="card-value">${subject}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Date</span>
        <span class="card-value">${date}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Time</span>
        <span class="card-value">${time}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Status</span>
        <span class="card-value">
          <span class="badge badge-info">Accepted</span>
        </span>
      </div>
    </div>
    <div class="alert-success">
      Add this to your calendar so you don't miss it!
    </div>
    <p class="text">
      Need to cancel? You can do so from your dashboard. Please cancel at least
      a few hours in advance as a courtesy to your tutor.
    </p>
  `),
});

// ─── Session Declined Email (to Student) ─────────────────────────────────────

const sessionDeclinedEmail = (studentName, tutorName, subject, reason) => ({
  subject: `Session Request Declined — ${subject}`,
  html: baseTemplate(`
    <p class="greeting">Session Request Declined</p>
    <p class="text">
      Hi <span class="highlight">${studentName}</span>, unfortunately
      <span class="highlight">${tutorName}</span> was unable to accept your
      session request for <span class="highlight">${subject}</span>.
    </p>
    ${
      reason
        ? `
    <div class="card">
      <div class="card-row">
        <span class="card-label">Reason</span>
        <span class="card-value">${reason}</span>
      </div>
    </div>
    `
        : ""
    }
    <div class="alert-danger">
      Don't be discouraged! There are many other qualified tutors available.
    </div>
    <p class="text">
      Head back to the tutor search to find another tutor who teaches
      <span class="highlight">${subject}</span>.
    </p>
  `),
});

// ─── Session Cancelled Email (to Tutor) ──────────────────────────────────────

const sessionCancelledEmail = (tutorName, studentName, subject, reason) => ({
  subject: `Session Cancelled — ${subject}`,
  html: baseTemplate(`
    <p class="greeting">Session Cancelled</p>
    <p class="text">
      Hi <span class="highlight">${tutorName}</span>,
      <span class="highlight">${studentName}</span> has cancelled their
      upcoming session for <span class="highlight">${subject}</span>.
    </p>
    ${
      reason
        ? `
    <div class="card">
      <div class="card-row">
        <span class="card-label">Reason given</span>
        <span class="card-value">${reason}</span>
      </div>
    </div>
    `
        : ""
    }
    <div class="alert-warning">
      Your time slot is now free. You may receive new bookings for that period.
    </div>
    <p class="text">
      Check your dashboard for any other pending session requests.
    </p>
  `),
});

// ─── Session Completed Email (to Student) ────────────────────────────────────

const sessionCompletedEmail = (studentName, tutorName, subject) => ({
  subject: `Session Completed — ${subject} ⭐`,
  html: baseTemplate(`
    <p class="greeting">Session Completed! 🎉</p>
    <p class="text">
      Hi <span class="highlight">${studentName}</span>, your
      <span class="highlight">${subject}</span> session with
      <span class="highlight">${tutorName}</span> has been marked as completed.
      We hope it was a productive experience!
    </p>
    <div class="alert-success">
      Your learning journey continues! Great work showing up.
    </div>
    <p class="text">
      Please take a moment to leave a review for <span class="highlight">${tutorName}</span>.
      Your feedback helps other students find the right tutor and helps tutors improve.
    </p>
    <div class="card">
      <div class="card-row">
        <span class="card-label">⭐ Rate your experience</span>
        <span class="card-value">Visit your dashboard to review</span>
      </div>
      <div class="card-row">
        <span class="card-label">📚 Book another session</span>
        <span class="card-value">Keep up the momentum</span>
      </div>
    </div>
  `),
});

// ─── Payment Confirmation Email (to Student) ─────────────────────────────────

const paymentConfirmationEmail = (
  studentName,
  amount,
  subject,
  tutorName,
  reference
) => ({
  subject: `Payment Confirmed — ₦${amount.toLocaleString()} for ${subject}`,
  html: baseTemplate(`
    <p class="greeting">Payment Successful! 💳</p>
    <p class="text">
      Hi <span class="highlight">${studentName}</span>, your payment has been
      processed successfully and your session has been booked. Here's your receipt:
    </p>
    <div class="card">
      <div class="card-row">
        <span class="card-label">Amount Paid</span>
        <span class="card-value highlight">₦${amount.toLocaleString()}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Subject</span>
        <span class="card-value">${subject}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Tutor</span>
        <span class="card-value">${tutorName}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Reference</span>
        <span class="card-value" style="font-family: monospace; font-size: 12px;">${reference}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Status</span>
        <span class="card-value">
          <span class="badge badge-success">Paid</span>
        </span>
      </div>
    </div>
    <div class="alert-success">
      Your session request has been sent to ${tutorName}. You'll receive an
      email when they respond.
    </div>
    <p class="text">
      Keep this email for your records. You can also view your full payment
      history from your dashboard.
    </p>
  `),
});

module.exports = {
  welcomeEmail,
  sessionRequestEmail,
  sessionAcceptedEmail,
  sessionDeclinedEmail,
  sessionCancelledEmail,
  sessionCompletedEmail,
  paymentConfirmationEmail,
};