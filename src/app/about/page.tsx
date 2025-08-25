'use client';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-start py-5"
      style={{
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ width: '100%', maxWidth: '800px' }}>
        {/* Back Button */}
        <div className="mb-4 text-start">
          <button
            onClick={() => router.push('/dashboard')}
            className="btn d-flex align-items-center"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '12px',
              padding: '0.5rem 1rem',
              transition: 'all 0.3s ease',
            }}
          >
            <span className="me-2">🏠</span>Back to Dashboard
          </button>
        </div>

        {/* About Card */}
        <div
          className="card p-5"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            color: 'white',
          }}
        >
          <h1
            className="h3 mb-4"
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ℹ️ About Our Society Management System
          </h1>
          <p className="mb-3" style={{ lineHeight: '1.8', opacity: 0.85 }}>
            This portal is designed to make society management simple, transparent, 
            and accessible to all residents. It allows residents to view notices, 
            register complaints, track payments, and more — all in one place.
          </p>
          <p style={{ lineHeight: '1.8', opacity: 0.85 }}>
            Our mission is to improve communication between residents and society 
            administrators, and to streamline day-to-day management tasks.
          </p>
        </div>
      </div>
    </div>
  );
}
