import React, { useState, useEffect } from 'react';
import { LanguageCode } from '../types/i18n';
import { getTranslation } from '../localization';
import { UserProfile, UserSession } from '../types/auth';
import {
  LogIn,
  UserPlus,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  Laptop,
  Smartphone,
  Globe,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  QrCode,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  currentLang: LanguageCode;
  user: UserProfile | null;
  onLoginSuccess: (user: UserProfile, token: string) => void;
  onLogout: () => void;
}

export const LoginSection: React.FC<Props> = ({
  currentLang,
  user,
  onLoginSuccess,
  onLogout,
}) => {
  const t = getTranslation(currentLang);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('demo@aetheria.io');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals & States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showEmailVerify, setShowEmailVerify] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');

  // Rate Limiting simulation state
  const [cooldownSecs, setCooldownSecs] = useState<number | null>(null);

  // Active Sessions state
  const [sessions, setSessions] = useState<UserSession[]>([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownSecs && cooldownSecs > 0) {
      timer = setInterval(() => {
        setCooldownSecs((prev) => (prev && prev > 1 ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownSecs]);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/auth/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/auth/sessions/${sessionId}`, { method: 'DELETE' });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        setSuccessMsg('Session revoked successfully.');
      }
    } catch (e) {
      setErrorMsg('Failed to revoke session.');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, provider: 'email' }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'ACCOUNT_LOCKED') {
          setCooldownSecs(data.remainingSecs || 30);
          setErrorMsg(data.message);
        } else {
          setErrorMsg(data.message || 'Authentication failed.');
        }
        setLoading(false);
        return;
      }

      if (data.require2FA) {
        setShow2FA(true);
        setLoading(false);
        return;
      }

      onLoginSuccess(data.user, data.tokens.accessToken);
      setSuccessMsg('Authentication successful!');
    } catch (err) {
      setErrorMsg('Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialOrGuest = async (provider: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `${provider}_user_${Math.floor(Math.random() * 1000)}@aetheria.io`,
          provider,
        }),
      });
      const data = await res.json();
      onLoginSuccess(data.user, data.tokens.accessToken);
      setSuccessMsg(`Logged in via ${provider.toUpperCase()}`);
    } catch (e) {
      setErrorMsg('Social login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerify = () => {
    if (twoFactorCode.length === 6) {
      setShow2FA(false);
      onLoginSuccess(
        {
          id: 'usr_2fa_demo',
          email,
          username: email.split('@')[0],
          provider: 'email',
          isGuest: false,
          emailVerified: true,
          twoFactorEnabled: true,
          createdAt: new Date().toISOString(),
          renameTickets: 2,
        },
        'mock_jwt_access_token_2fa_passed'
      );
      setSuccessMsg('2FA verification successful!');
    } else {
      setErrorMsg('Invalid 2FA verification code.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / User Status */}
      {user ? (
        <div className="p-6 bg-[#0F1116] border border-[#2D303E] text-[#E4E4E7] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border border-[#00F0FF] bg-[#1A1C23] flex items-center justify-center text-2xl font-bold font-mono text-[#00F0FF]">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold italic text-white">{user.username}</h3>
                {user.isGuest ? (
                  <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono uppercase">
                    Guest Account
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 font-mono uppercase">
                    AUTHENTICATED
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">{user.email}</p>
              <p className="text-xs text-[#64748B] mt-1 font-mono">
                PROVIDER: <span className="capitalize text-[#00F0FF]">{user.provider}</span> • RENAME TICKETS: <span className="text-amber-400 font-bold">{user.renameTickets}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEmailVerify(true)}
              className="px-4 py-2.5 bg-[#1A1C23] border border-[#2D303E] hover:border-[#00F0FF] text-xs font-mono uppercase tracking-wider text-[#E4E4E7] transition-all"
            >
              Email Verification
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-2.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <LogIn className="w-4 h-4 rotate-180" />
              <span>{t.logoutButton}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-[#0F1116] border border-[#2D303E] p-6 md:p-8 shadow-2xl text-[#E4E4E7]">
          <div className="text-center mb-6">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#64748B] mb-2 font-mono">
              SECURITY PROTOCOL
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter text-white">
              {mode === 'login' ? 'ACCESS CONTROL' : 'CREATE CREDENTIALS'}
            </h2>
            <p className="text-xs text-[#64748B] mt-1 font-mono">
              JWT session authentication with bcrypt hashing & rate limits.
            </p>
          </div>

          {/* Quick Tab Toggle */}
          <div className="grid grid-cols-2 gap-px bg-[#2D303E] p-px border border-[#2D303E] mb-6">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-mono uppercase tracking-wider transition-all ${
                mode === 'login'
                  ? 'bg-[#00F0FF] text-[#0A0B0E] font-bold'
                  : 'bg-[#1A1C23] text-[#64748B] hover:text-[#E4E4E7]'
              }`}
            >
              {t.loginButton}
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-mono uppercase tracking-wider transition-all ${
                mode === 'register'
                  ? 'bg-[#00F0FF] text-[#0A0B0E] font-bold'
                  : 'bg-[#1A1C23] text-[#64748B] hover:text-[#E4E4E7]'
              }`}
            >
              {t.registerButton}
            </button>
          </div>

          {/* Cooldown Warning Banner */}
          {cooldownSecs !== null && (
            <div className="p-3.5 bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="font-semibold uppercase font-mono">{t.accountLockedTitle}</p>
                <p className="text-[11px] text-rose-300/80">
                  Retry available in <span className="font-mono font-bold text-white">{cooldownSecs}s</span>
                </p>
              </div>
            </div>
          )}

          {/* Error & Success Messages */}
          {errorMsg && !cooldownSecs && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF] text-xs mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#64748B] mb-1">
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hero@aetheria.io"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0A0B0E] border border-[#2D303E] focus:border-[#00F0FF] text-white text-xs font-mono outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#64748B]">
                  {t.passwordLabel}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[10px] font-mono uppercase tracking-wider text-[#00F0FF] hover:underline"
                  >
                    {t.forgotPassword}
                  </button>
                )}
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#64748B] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0A0B0E] border border-[#2D303E] focus:border-[#00F0FF] text-white text-xs font-mono outline-none transition-colors"
                />
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="bg-[#0A0B0E] border-[#2D303E] text-[#00F0FF] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs text-[#64748B] cursor-pointer font-mono">
                  {t.rememberMe}
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || cooldownSecs !== null}
              className="w-full py-3 bg-[#00F0FF] hover:bg-[#00F0FF]/90 disabled:opacity-50 text-[#0A0B0E] font-bold text-xs font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#0A0B0E]/30 border-t-[#0A0B0E] rounded-full animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{t.loginButton}</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{t.registerButton}</span>
                </>
              )}
            </button>
          </form>

          {/* Social Auth & Guest Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2D303E]" />
            </div>
            <span className="relative px-3 bg-[#0F1116] text-[10px] text-[#64748B] uppercase tracking-widest font-mono">
              {t.socialLoginOr}
            </span>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => handleSocialOrGuest('google')}
              className="px-3 py-2 bg-[#1A1C23] border border-[#2D303E] hover:border-[#00F0FF] text-[#E4E4E7] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>🌐</span>
              <span>{t.loginWithGoogle}</span>
            </button>
            <button
              onClick={() => handleSocialOrGuest('apple')}
              className="px-3 py-2 bg-[#1A1C23] border border-[#2D303E] hover:border-[#00F0FF] text-[#E4E4E7] text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>🍎</span>
              <span>{t.loginWithApple}</span>
            </button>
          </div>

          <button
            onClick={() => handleSocialOrGuest('guest')}
            className="w-full py-2.5 bg-[#1A1C23] hover:border-[#00F0FF] border border-[#2D303E] text-[#E4E4E7] text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#00F0FF]" />
            <span>{t.guestLogin}</span>
          </button>
        </div>
      )}

      {/* Session & Device Management */}
      <div className="p-6 bg-[#0F1116] border border-[#2D303E] text-[#E4E4E7]">
        <div className="flex items-center justify-between mb-4 border-b border-[#2D303E] pb-3">
          <div className="flex items-center gap-2.5">
            <Laptop className="w-5 h-5 text-[#00F0FF]" />
            <h3 className="text-base font-bold font-mono uppercase tracking-wider text-white">{t.sessionManagement}</h3>
          </div>
          <span className="text-xs text-[#64748B] font-mono">
            {sessions.length} {t.activeDevices.toUpperCase()}
          </span>
        </div>

        <div className="space-y-3">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="p-4 bg-[#1A1C23] border border-[#2D303E] hover:border-[#00F0FF] flex items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0A0B0E] border border-[#2D303E] text-[#00F0FF]">
                  {sess.deviceType === 'Mobile' ? (
                    <Smartphone className="w-5 h-5" />
                  ) : (
                    <Laptop className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-mono font-bold text-white">{sess.deviceName}</h4>
                    {sess.isCurrent && (
                      <span className="px-1.5 py-0.5 text-[9px] bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 font-mono font-bold uppercase">
                        {t.currentDevice}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5 font-mono">
                    {sess.browser} • {sess.location} ({sess.ipAddress})
                  </p>
                  <p className="text-[10px] text-[#64748B] mt-0.5 font-mono">
                    {t.lastActive}: {sess.lastActive}
                  </p>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  onClick={() => handleRevokeSession(sess.id)}
                  className="p-2 bg-rose-950/80 border border-rose-500/40 hover:bg-rose-900 text-rose-300 text-xs font-mono uppercase transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.revokeSession}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#0F1116] border border-[#2D303E] p-6 text-[#E4E4E7]">
            <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-white mb-2">{t.resetPasswordTitle}</h3>
            <p className="text-xs text-[#64748B] mb-4 font-mono">
              Enter your email address to receive a secure password reset link.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#0A0B0E] border border-[#2D303E] text-xs font-mono text-white mb-4 outline-none focus:border-[#00F0FF]"
            />
            <div className="flex justify-end gap-2 font-mono uppercase text-xs">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="px-4 py-2 bg-[#1A1C23] border border-[#2D303E] text-[#64748B] hover:text-white"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setSuccessMsg('Reset password link sent to your email.');
                }}
                className="px-4 py-2 bg-[#00F0FF] text-[#0A0B0E] font-bold"
              >
                {t.sendResetLink}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#0F1116] border border-[#00F0FF]/50 p-6 text-[#E4E4E7] text-center">
            <QrCode className="w-10 h-10 text-[#00F0FF] mx-auto mb-3" />
            <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-white mb-1">{t.twoFactorAuth}</h3>
            <p className="text-xs text-[#64748B] mb-4 font-mono">{t.enter2FACode}</p>
            <input
              type="text"
              maxLength={6}
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              placeholder="123456"
              className="w-full py-3 text-center tracking-widest font-mono text-lg bg-[#0A0B0E] border border-[#00F0FF] text-white mb-4 outline-none"
            />
            <button
              onClick={handle2FAVerify}
              className="w-full py-2.5 bg-[#00F0FF] text-[#0A0B0E] font-bold text-xs font-mono uppercase tracking-wider"
            >
              {t.verify2FA}
            </button>
          </div>
        </div>
      )}

      {/* Email Verification Modal */}
      {showEmailVerify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#0F1116] border border-[#2D303E] p-6 text-[#E4E4E7]">
            <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-white mb-2">EMAIL VERIFICATION</h3>
            <p className="text-xs text-[#64748B] mb-4 font-mono">
              Enter the 4-digit code sent to your inbox ({user?.email}).
            </p>
            <input
              type="text"
              maxLength={4}
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="7788"
              className="w-full py-2.5 text-center font-mono text-base bg-[#0A0B0E] border border-[#2D303E] focus:border-[#00F0FF] text-white mb-4 outline-none"
            />
            <div className="flex justify-end gap-2 font-mono uppercase text-xs">
              <button
                onClick={() => setShowEmailVerify(false)}
                className="px-4 py-2 bg-[#1A1C23] border border-[#2D303E] text-[#64748B]"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  setShowEmailVerify(false);
                  setSuccessMsg('Email address verified successfully!');
                }}
                className="px-4 py-2 bg-[#00F0FF] text-[#0A0B0E] font-bold"
              >
                Verify Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
