'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [msg, setMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setIsSubmitting(true);

    const fn =
      mode === 'signin'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });

    const { data, error } = await fn;

    if (error) {
      setMsg(error.message);
      setIsSubmitting(false);
      return;
    }

    if (mode === 'signup') {
      setMsg('Check your inbox to confirm your account.');
      setIsSubmitting(false);
    }

    if (mode === 'signin' && data.session) {
      router.push('/dashboard');
    }

    setIsSubmitting(false);
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4" style={{
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(102,126,234,${0.05 + i*0.02}) 0%, transparent 70%)`,
            top: `${10 + i*15}%`,
            left: `${5 + i*12}%`,
            animation: `float 12s ease-in-out infinite ${i*2}s`
          }} />
        ))}
      </div>

      {/* Main Login Container */}
      <div style={{ maxWidth: '450px', width: '100%', zIndex: 2 }}>
        {/* Header */}
        <div className="text-center mb-5">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            marginBottom: '15px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            fontSize: '2rem'
          }}>
            🏡
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #fff, #a0a0a0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Society Portal</h1>
          <p className="text-light opacity-75">
            {mode === 'signin' ? 'Welcome back! Sign in to access your dashboard' : 'Join our community and get started today'}
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={submit}>
          <div style={{
            padding: '30px',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4)'
          }}>
            {/* Mode Toggle */}
            <div style={{
              display: 'flex',
              marginBottom: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden'
            }}>
              <button type="button" className="btn flex-fill fw-bold"
                style={{
                  background: mode === 'signin' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                  color: mode === 'signin' ? 'white' : 'rgba(255,255,255,0.6)',
                  border: 'none',
                  padding: '12px',
                  transition: 'all 0.3s ease',
                  boxShadow: mode === 'signin' ? '0 4px 15px rgba(102,126,234,0.3)' : 'none'
                }}
                onClick={() => setMode('signin')}
              >
                Sign In
              </button>
              <button type="button" className="btn flex-fill fw-bold"
                style={{
                  background: mode === 'signup' ? 'linear-gradient(135deg, #43e97b, #38f9d7)' : 'transparent',
                  color: mode === 'signup' ? 'white' : 'rgba(255,255,255,0.6)',
                  border: 'none',
                  padding: '12px',
                  transition: 'all 0.3s ease',
                  boxShadow: mode === 'signup' ? '0 4px 15px rgba(67,233,123,0.3)' : 'none'
                }}
                onClick={() => setMode('signup')}
              >
                Sign Up
              </button>
            </div>

            {/* Email Input */}
            <div className="mb-3">
              <label className="form-label text-light opacity-75 small fw-bold">EMAIL ADDRESS</label>
              <div className="position-relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your email address..."
                  className="form-control"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    padding: '12px 16px 12px 45px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => { e.target.style.background='rgba(255,255,255,0.15)'; e.target.style.borderColor='rgba(102,126,234,0.5)'; e.target.style.boxShadow='0 0 20px rgba(102,126,234,0.2)'; }}
                  onBlur={(e) => { e.target.style.background='rgba(255,255,255,0.1)'; e.target.style.borderColor='rgba(255,255,255,0.2)'; e.target.style.boxShadow='none'; }}
                />
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', opacity: 0.5 }}>📧</div>
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="form-label text-light opacity-75 small fw-bold">PASSWORD</label>
              <div className="position-relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your password..."
                  className="form-control"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    padding: '12px 16px 12px 45px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => { e.target.style.background='rgba(255,255,255,0.15)'; e.target.style.borderColor='rgba(102,126,234,0.5)'; e.target.style.boxShadow='0 0 20px rgba(102,126,234,0.2)'; }}
                  onBlur={(e) => { e.target.style.background='rgba(255,255,255,0.1)'; e.target.style.borderColor='rgba(255,255,255,0.2)'; e.target.style.boxShadow='none'; }}
                />
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', opacity: 0.5 }}>🔐</div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn w-100 py-3 fw-bold d-flex align-items-center justify-content-center"
              style={{
                background: isSubmitting 
                  ? 'rgba(102,126,234,0.5)'
                  : (mode==='signin' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'linear-gradient(135deg, #43e97b, #38f9d7)'),
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                boxShadow: mode==='signin' ? '0 6px 25px rgba(102,126,234,0.4)' : '0 6px 25px rgba(67,233,123,0.4)',
                transition: 'all 0.3s ease',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? (
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : mode==='signin' ? '🚀 Sign In to Dashboard' : '✨ Create New Account'}
            </button>

            {/* Message */}
            {msg && (
              <div style={{
                marginTop: '15px',
                padding: '12px',
                borderRadius: '12px',
                textAlign: 'center',
                color: msg.includes('Check') ? '#43e97b' : '#ff758c',
                background: msg.includes('Check') ? 'rgba(67,233,123,0.1)' : 'rgba(255,71,87,0.1)',
                border: msg.includes('Check') ? '1px solid rgba(67,233,123,0.3)' : '1px solid rgba(255,71,87,0.3)'
              }}>
                {msg.includes('Check') ? '✅' : '⚠️'} {msg}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 text-light opacity-50" style={{ fontSize: '0.85rem' }}>
          Powered by Next.js & Supabase • Secure & Reliable
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0,0) rotate(0deg); opacity: 0.5; }
          50% { transform: translate(-20px,-20px) rotate(180deg); opacity: 0.8; }
        }
        .form-control::placeholder { color: rgba(255,255,255,0.5) !important; }
      `}</style>
    </div>
  );
}
