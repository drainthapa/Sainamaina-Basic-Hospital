import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import LanguageToggle from '../../components/LanguageToggle';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
      toast.success(t('auth.welcomeBack'));
    } catch (err) {
      setError(err.response?.data?.message || t('auth.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-root">

      {/* ── Left brand panel ── */}
      <div className="login-panel-left">

        {/* Large swooping curves — matching IMIS reference exactly */}
        <svg
          className="login-swoop"
          viewBox="0 0 700 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Darkening overlay base */}
          <rect width="700" height="900" fill="#0745a8" opacity="0.25" />

          {/* Large swoop — top-right, flows down and left */}
          <ellipse cx="780" cy="200" rx="480" ry="520"
            fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="120" />

          {/* Second swoop — mid panel, similar orientation */}
          <ellipse cx="760" cy="580" rx="420" ry="460"
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="90" />

          {/* Inner arc — tighter, brighter */}
          <ellipse cx="750" cy="250" rx="300" ry="340"
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="60" />

          {/* Bottom accent arc */}
          <ellipse cx="700" cy="820" rx="380" ry="340"
            fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="80" />
        </svg>

        {/* Top bar — copyright / language */}
        <div className="login-panel-footer-top">
          <span>© {new Date().getFullYear()} सैनामैना आधारभुत अस्पताल.</span>
          <span>All rights reserved.</span>
        </div>

        {/* Divider */}
        <hr className="login-panel-divider" />

        {/* Hospital identity — Nepal emblem + name */}
        <div className="login-brand-content">
          {/* Nepal Coat of Arms placeholder — circular white ring with cross */}
          <div className="login-emblem-img">
            <img
              src="/nepal-logo.png"
              alt="Nepal Government Emblem"
              style={{ width: 72, height: 72, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }}
            />
          </div>

          <div className="login-hospital-name">
            <h1>सैनामैना आधारभुत अस्पताल</h1>
            <h2>Sainamaina Primary Hospital</h2>

          </div>
        </div>

        {/* Divider */}
        <hr className="login-panel-divider" />
      </div>

      {/* ── Right form panel ── */}
      <div className="login-panel-right">
        <div className="login-lang-row">
          <LanguageToggle variant="light" />
        </div>

        <div className="login-form-wrap">
          <h2 className="login-form-title">{t('auth.login')}</h2>

          {error && (
            <div className="login-error" role="alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label className="login-label" htmlFor="login-email">
                {t('auth.email')}
              </label>
              <div className="login-input-wrap">
                <input
                  id="login-email"
                  className="login-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sainamainahospital.gov.np"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="login-password">
                {t('auth.password')}
              </label>
              <div className="login-input-wrap">
                <input
                  id="login-password"
                  className="login-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`login-btn ${isLoading ? 'login-btn-loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="login-spinner" />
                  {t('common.pleaseWait')}
                </>
              ) : t('auth.login')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
