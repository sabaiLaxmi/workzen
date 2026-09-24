import React from 'react';
import './PrivacyPolicy.css';

export default function PrivacyPolicy() {
  return (
    <main className="privacy-page">
      <div className="reading-container">
        <header className="privacy-header">
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-updated">Last Updated: September 19, 2026</p>
        </header>

        <section className="privacy-content">
          <p>
            At Workzen, we believe that tracking time shouldn't require compromising your privacy. This Privacy Policy explains how we collect, use, and protect the information of our users across our timesheet and workforce management platform.
          </p>

          <h2>What information we collect</h2>
          <p>
            Because Workzen is an enterprise tool, we collect data necessary to provide accurate timesheet and approval services to your organization. This includes:
          </p>
          <ul>
            <li><strong>Account Data:</strong> Your name, email address, role (Admin, Manager, or Employee), and authentication credentials.</li>
            <li><strong>Work Data:</strong> Information you submit through the platform, including timesheet entries, project assignments, hours worked, and timesheet approval history.</li>
            <li><strong>System Data:</strong> Standard access logs, IP addresses, and device information used automatically to secure your session and troubleshoot platform issues.</li>
          </ul>

          <h2>How we use it</h2>
          <p>
            We strictly use your information to provide, maintain, and improve the Workzen platform. This includes authenticating your logins, processing timesheet submissions, routing those submissions to the appropriate manager for approval, and generating workforce reports for administrators. We do not sell your personal or work data to third parties.
          </p>

          <h2>Data retention</h2>
          <p>
            We retain your account and timesheet data for as long as your organization maintains an active subscription with Workzen. If an organization cancels their account, or if an administrator deletes a specific user account, we securely delete or anonymize all associated personal and work data within 60 days, subject to legal payroll data retention obligations that your employer may mandate.
          </p>

          <h2>Your rights</h2>
          <p>
            You have the right to access, correct, or request the deletion of your personal data. Because Workzen operates on behalf of your employer, most data requests (such as correcting a submitted timesheet or updating your email) should be directed to your organization's internal Workzen Administrator. Your data is strictly segmented by our role-based access rules: employees can only see their own timesheets, managers can see their direct reports, and administrators oversee the organizational data. 
          </p>

          <h2>Cookies</h2>
          <p>
            Workzen uses essential cookies necessary to keep you logged in and secure your session. We do not use third-party tracking or advertising cookies. Disabling essential cookies in your browser will prevent you from authenticating and using the platform.
          </p>

          <h2>Contact us</h2>
          <p>
            If you have specific questions about this Privacy Policy or need to submit a data request that cannot be handled by your organizational Administrator, please contact our privacy team at privacy@workzen.com.
          </p>
        </section>
      </div>
    </main>
  );
}
