import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { DEMO_USERS } from '../data/users.js';

const ROLE_LABEL = { admin: 'Administrator', cashier: 'Cashier', kitchen: 'Kitchen Staff' };

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Controlled inputs: the DOM input's displayed value is always driven by
  // React state, not read from the DOM directly — the standard React form pattern.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // Stop the browser's native full-page-reload form submit.
    setError('');
    setSubmitting(true);
    try {
      // login() returns a Promise (simulated network call) — awaiting it
      // here is what lets us show the spinner button state realistically.
      await login(username, password);
      navigate('/', { replace: true }); // App.jsx's index route sorts out where to land.
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Clicking a demo account row fills the form fields but does NOT
  // auto-submit — lets a stakeholder see the credentials land in the
  // fields before demonstrating the login click itself.
  function fillDemo(u) {
    setUsername(u.username);
    setPassword(u.password);
    setError('');
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo"><UtensilsCrossed size={24} /></div>
        <h1>One Hotel's Avenue</h1>
        <p>Restaurant Management System</p>

        {error && (
          <div className="login-error">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              className="text-input w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                className="text-input w-full"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={submitting}>
            {submitting ? <><Loader2 size={16} className="spin-icon" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div className="demo-accounts">
          <h4>Demo Accounts — click to autofill</h4>
          {DEMO_USERS.map((u) => (
            <div className="demo-account-row" key={u.username}>
              <span>
                <strong>{ROLE_LABEL[u.role]}</strong> — {u.username} / {u.password}
              </span>
              <button className="fill-btn" onClick={() => fillDemo(u)} type="button">
                Use
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
