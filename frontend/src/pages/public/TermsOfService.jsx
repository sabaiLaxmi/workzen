import React from 'react';
import './PrivacyPolicy.css';

export default function TermsOfService() {
  return (
    <main className="privacy-page">
      <div className="reading-container">
        <header className="privacy-header">
          <h1 className="privacy-title">Terms of Service</h1>
          <p className="privacy-updated">Last Updated: October 2026</p>
        </header>

        <section className="privacy-content">
          <p>
            Welcome to Workzen. By accessing or using our workforce and timesheet management software, you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these terms.
          </p>

          <h2>1. Platform Usage & Accounts</h2>
          <p>
            Workzen provides organization-level timesheet tracking, approval workflows, and workforce reporting. You must provide accurate and complete registration information and maintain the security of your account credentials. You are responsible for all activities that occur under your account.
          </p>

          <h2>2. Role-Based Permissions</h2>
          <p>
            Workzen enforces strict role-based separation:
          </p>
          <ul>
            <li><strong>Employees</strong> may log and manage their assigned project timesheets.</li>
            <li><strong>Managers</strong> review, approve, or reject submissions for their direct teams and projects.</li>
            <li><strong>Administrators</strong> oversee all user records, organizational settings, and overall payroll reports.</li>
          </ul>

          <h2>3. Timesheet Integrity & Accuracy</h2>
          <p>
            Users are required to submit truthful and accurate records of their work hours. Falsification of timesheet records may result in immediate suspension of account privileges and notification to your organization's administrative authorities.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            Workzen and its original content, features, workflows, and functionality are and will remain the exclusive property of Workzen and its licensors.
          </p>

          <h2>5. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please reach out to our legal and support team at <strong>legal@workzen.com</strong>.
          </p>
        </section>
      </div>
    </main>
  );
}
