import { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { MOCK_SETTINGS, SETTINGS_GROUPS } from '../data/settings.js';

export default function SettingsPage() {
  // Flatten the settings array into { key: value } for easy controlled-input
  // binding, same shape the real PHP endpoint would receive on save.
  const [values, setValues] = useState(
    Object.fromEntries(MOCK_SETTINGS.map((s) => [s.key, s.value]))
  );
  const [saving, setSaving] = useState(false);

  function handleChange(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved');
    }, 600);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Restaurant configuration — branding, contact, billing, and receipts</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {SETTINGS_GROUPS.map((group) => {
          const groupSettings = MOCK_SETTINGS.filter((s) => s.group === group.key);
          if (groupSettings.length === 0) return null;
          return (
            <div className="card mb-2" key={group.key}>
              <h3 className="card-title">{group.label}</h3>
              <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {groupSettings.map((s) => (
                  <div className="form-group" key={s.key}>
                    <label>{s.label}</label>
                    <input
                      className="text-input w-full"
                      value={values[s.key]}
                      onChange={(e) => handleChange(s.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <button type="submit" className="btn btn--primary" disabled={saving}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
