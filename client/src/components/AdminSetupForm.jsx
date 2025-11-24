import React, { useState, useEffect } from 'react';
import './AdminSetupForm.css';

const AdminSetupForm = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    siteName: '',
    siteDescription: '',
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    maxUsersPerEvent: 100,
    defaultUserRole: 'student'
  });

  // Admin User State
  const [adminUser, setAdminUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: ''
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireSpecialChars: true,
    enableTwoFactor: false,
    loginAttempts: 5,
    lockoutDuration: 15
  });

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    fetchCurrentSettings();
  }, []);

  const fetchCurrentSettings = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setGeneralSettings(data.data.general || generalSettings);
          setEmailSettings(data.data.email || emailSettings);
          setSecuritySettings(data.data.security || securitySettings);
        }
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };

  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAdminUserChange = (e) => {
    const { name, value } = e.target;
    setAdminUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const validateAdminUser = () => {
    if (!adminUser.firstName || !adminUser.lastName || !adminUser.email || !adminUser.password) {
      showMessage('error', 'All admin user fields are required');
      return false;
    }
    if (adminUser.password !== adminUser.confirmPassword) {
      showMessage('error', 'Passwords do not match');
      return false;
    }
    if (adminUser.password.length < securitySettings.passwordMinLength) {
      showMessage('error', `Password must be at least ${securitySettings.passwordMinLength} characters`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let endpoint = '';
      let payload = {};

      switch (activeTab) {
        case 'general':
          endpoint = 'http://localhost:3000/api/admin/settings/general';
          payload = generalSettings;
          break;
        case 'admin':
          if (!validateAdminUser()) {
            setLoading(false);
            return;
          }
          endpoint = 'http://localhost:3000/api/admin/create-admin';
          payload = {
            first_name: adminUser.firstName,
            last_name: adminUser.lastName,
            email: adminUser.email,
            password: adminUser.password,
            role: 'admin'
          };
          break;
        case 'email':
          endpoint = 'http://localhost:3000/api/admin/settings/email';
          payload = emailSettings;
          break;
        case 'security':
          endpoint = 'http://localhost:3000/api/admin/settings/security';
          payload = securitySettings;
          break;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        showMessage('success', data.message || 'Settings updated successfully');
        if (activeTab === 'admin') {
          setAdminUser({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
        }
      } else {
        showMessage('error', data.message || 'Failed to update settings');
      }
    } catch (err) {
      showMessage('error', 'Network error occurred');
      console.error('Submit error:', err);
    }

    setLoading(false);
  };

  const testEmailConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(emailSettings)
      });

      const data = await res.json();
      
      if (data.success) {
        showMessage('success', 'Email connection test successful');
      } else {
        showMessage('error', 'Email connection test failed: ' + data.message);
      }
    } catch (err) {
      showMessage('error', 'Email test failed');
    }
    setLoading(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="form-section">
            <h3>General Settings</h3>
            
            <div className="form-group">
              <label htmlFor="siteName">Site Name</label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={generalSettings.siteName}
                onChange={handleGeneralChange}
                placeholder="Connect Platform"
              />
            </div>

            <div className="form-group">
              <label htmlFor="siteDescription">Site Description</label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                value={generalSettings.siteDescription}
                onChange={handleGeneralChange}
                placeholder="A platform for connecting students and organizing events"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxUsersPerEvent">Max Users Per Event</label>
              <input
                type="number"
                id="maxUsersPerEvent"
                name="maxUsersPerEvent"
                value={generalSettings.maxUsersPerEvent}
                onChange={handleGeneralChange}
                min="1"
                max="1000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="defaultUserRole">Default User Role</label>
              <select
                id="defaultUserRole"
                name="defaultUserRole"
                value={generalSettings.defaultUserRole}
                onChange={handleGeneralChange}
              >
                <option value="student">Student</option>
                <option value="organizer">Organizer</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={generalSettings.maintenanceMode}
                  onChange={handleGeneralChange}
                />
                <span>Maintenance Mode</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="userRegistration"
                  checked={generalSettings.userRegistration}
                  onChange={handleGeneralChange}
                />
                <span>Allow User Registration</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={generalSettings.emailNotifications}
                  onChange={handleGeneralChange}
                />
                <span>Enable Email Notifications</span>
              </label>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="form-section">
            <h3>Create Admin User</h3>
            
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={adminUser.firstName}
                onChange={handleAdminUserChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={adminUser.lastName}
                onChange={handleAdminUserChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={adminUser.email}
                onChange={handleAdminUserChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={adminUser.password}
                onChange={handleAdminUserChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={adminUser.confirmPassword}
                onChange={handleAdminUserChange}
                required
              />
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="form-section">
            <h3>Email Settings</h3>
            
            <div className="form-group">
              <label htmlFor="smtpHost">SMTP Host</label>
              <input
                type="text"
                id="smtpHost"
                name="smtpHost"
                value={emailSettings.smtpHost}
                onChange={handleEmailChange}
                placeholder="smtp.gmail.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="smtpPort">SMTP Port</label>
              <input
                type="number"
                id="smtpPort"
                name="smtpPort"
                value={emailSettings.smtpPort}
                onChange={handleEmailChange}
                placeholder="587"
              />
            </div>

            <div className="form-group">
              <label htmlFor="smtpUser">SMTP Username</label>
              <input
                type="text"
                id="smtpUser"
                name="smtpUser"
                value={emailSettings.smtpUser}
                onChange={handleEmailChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="smtpPassword">SMTP Password</label>
              <input
                type="password"
                id="smtpPassword"
                name="smtpPassword"
                value={emailSettings.smtpPassword}
                onChange={handleEmailChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fromEmail">From Email</label>
              <input
                type="email"
                id="fromEmail"
                name="fromEmail"
                value={emailSettings.fromEmail}
                onChange={handleEmailChange}
                placeholder="noreply@connect.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fromName">From Name</label>
              <input
                type="text"
                id="fromName"
                name="fromName"
                value={emailSettings.fromName}
                onChange={handleEmailChange}
                placeholder="Connect Platform"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={testEmailConnection}
                className="test-btn"
                disabled={loading}
              >
                Test Connection
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="form-section">
            <h3>Security Settings</h3>
            
            <div className="form-group">
              <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
              <input
                type="number"
                id="sessionTimeout"
                name="sessionTimeout"
                value={securitySettings.sessionTimeout}
                onChange={handleSecurityChange}
                min="5"
                max="480"
              />
            </div>

            <div className="form-group">
              <label htmlFor="passwordMinLength">Minimum Password Length</label>
              <input
                type="number"
                id="passwordMinLength"
                name="passwordMinLength"
                value={securitySettings.passwordMinLength}
                onChange={handleSecurityChange}
                min="6"
                max="50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginAttempts">Max Login Attempts</label>
              <input
                type="number"
                id="loginAttempts"
                name="loginAttempts"
                value={securitySettings.loginAttempts}
                onChange={handleSecurityChange}
                min="3"
                max="10"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lockoutDuration">Account Lockout Duration (minutes)</label>
              <input
                type="number"
                id="lockoutDuration"
                name="lockoutDuration"
                value={securitySettings.lockoutDuration}
                onChange={handleSecurityChange}
                min="5"
                max="60"
              />
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="requireSpecialChars"
                  checked={securitySettings.requireSpecialChars}
                  onChange={handleSecurityChange}
                />
                <span>Require Special Characters in Password</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="enableTwoFactor"
                  checked={securitySettings.enableTwoFactor}
                  onChange={handleSecurityChange}
                />
                <span>Enable Two-Factor Authentication</span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-setup-container">
      <div className="admin-setup-header">
        <h2>Admin Setup & Configuration</h2>
        <p>Configure your platform settings and create admin accounts</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="admin-setup-content">
        <nav className="setup-tabs">
          <button
            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Admin User
          </button>
          <button
            className={`tab-btn ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
          >
            Email
          </button>
          <button
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </nav>

        <form onSubmit={handleSubmit} className="setup-form">
          {renderTabContent()}

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSetupForm;
