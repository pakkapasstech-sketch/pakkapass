import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/AuthProvider';
import { useTheme } from '../../contexts/ThemeContext';
import { authService } from '../../services/auth.service';
import { usePermissions } from '../../auth/usePermissions';
import { ROLES } from '../../auth/roles';
import '../../styles/settings.css';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { isDark, setIsDark } = useTheme();
  const { role } = usePermissions();

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.mobile || '' });
  const [passwords, setPasswords] = useState({ current: '', newPassword: '', confirm: '' });
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async () => {
    if (role !== ROLES.ADMIN) {
      updateUser(profile);
      toast.success('Profile updated');
      return;
    }
    try {
      setSaving(true);
      await authService.updateProfile(user.id, { name: profile.name, phone: profile.phone });
      updateUser(profile);
      toast.success('Profile updated successfully');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setSaving(true);
      await authService.changePassword({ currentPassword: passwords.current, newPassword: passwords.newPassword });
      toast.success('Password changed successfully');
      setPasswords({ current: '', newPassword: '', confirm: '' });
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page">
      <section className="settings-section">
        <h3>Profile</h3>
        <div className="settings-form">
          <input placeholder="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <input placeholder="Email" value={profile.email} disabled />
          <input placeholder="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          <button type="button" className="btn-primary" onClick={handleProfileSave} disabled={saving}>Save Profile</button>
        </div>
      </section>

      {role === ROLES.ADMIN && (
        <section className="settings-section">
          <h3>Change Password</h3>
          <div className="settings-form">
            <input type="password" placeholder="Current Password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
            <input type="password" placeholder="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
            <input type="password" placeholder="Confirm Password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
            <button type="button" className="btn-primary" onClick={handlePasswordChange} disabled={saving}>Change Password</button>
          </div>
        </section>
      )}

      <section className="settings-section">
        <h3>Preferences</h3>
        <div className="settings-toggle">
          <span>Dark Mode</span>
          <input type="checkbox" checked={isDark} onChange={(e) => setIsDark(e.target.checked)} />
        </div>
        <div className="settings-toggle">
          <span>Email Notifications</span>
          <input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })} />
        </div>
        <div className="settings-toggle">
          <span>Push Notifications</span>
          <input type="checkbox" checked={notifications.push} onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })} />
        </div>
      </section>

      {/* <section className="settings-section">
        <h3>Security</h3>
        <p>Session management and logout from all devices will be available in a future update.</p>
      </section> */}
    </div>
  );
};

export default SettingsPage;
