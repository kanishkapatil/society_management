'use client';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardClient() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoading(false);
    });
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    location.href = '/';
  }

  if (isLoading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-light mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-light opacity-75">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        }}
      >
        <div
          className="text-center p-5"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            className="mb-4"
            style={{
              fontSize: '4rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🔐
          </div>
          <h2 className="text-light mb-3">Access Required</h2>
          <p className="text-light opacity-75 mb-4">
            Please authenticate to access your dashboard
          </p>
          <Link
            href="/login"
            className="btn px-4 py-2 fw-bold text-decoration-none"
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
            }}
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  const modules = [
    {
      name: 'Notices',
      href: '/notices',
      icon: '📢',
      gradient: 'linear-gradient(135deg, #667eea, #5a67d8)',
      description: 'View announcements & updates',
    },
    {
      name: 'Complaints',
      href: '/complaints',
      icon: '🛠️',
      gradient: 'linear-gradient(135deg, #ff758c, #ff6b81)',
      description: 'Report & track issues',
    },
    {
      name: 'Payments',
      href: '/payments',
      icon: '💳',
      gradient: 'linear-gradient(135deg, #43e97b, #38d9a9)',
      description: 'Manage transactions',
    },
    {
      name: 'Visitors',
      href: '/visitors',
      icon: '👥',
      gradient: 'linear-gradient(135deg, #f7971e, #ffd200)',
      description: 'Guest management system',
    },
    {
      name: 'Residents',
      href: '/residents',
      icon: '🏠',
      gradient: 'linear-gradient(135deg, #30cfd0, #2c9fa1)',
      description: 'Community directory',
    },
    {
      name: 'Amenities',
      href: '/amenities',
      icon: '🛀',
      gradient: 'linear-gradient(135deg, #ff9a8b, #ff6a88)',
      description: 'Book society facilities like Pool, Spa, Gym',
    },
    {
      name: 'About Us',
      href: '/about',
      icon: 'ℹ️',
      gradient: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
      description: 'Learn more about the system',
    },
  ];

  return (
    <div
      className="min-vh-100"
      style={{
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Background Animation */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)`,
              top: `${20 + i * 30}%`,
              left: `${10 + i * 40}%`,
              animation: `float 6s ease-in-out infinite ${i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container py-5" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 p-4"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className="text-center text-md-start mb-3 mb-md-0">
            <h1
              className="fw-bold mb-2"
              style={{
                background: 'linear-gradient(135deg, #fff, #a0a0a0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '2.5rem',
              }}
            >
              🏡 Society Dashboard
            </h1>
            <p className="text-light opacity-75 mb-0">
              Welcome back, {user?.email || 'User'}
            </p>
          </div>
          <button
            onClick={signOut}
            className="btn px-4 py-2 fw-bold"
            style={{
              background: 'linear-gradient(135deg, #ff4757, #ff3838)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(255, 71, 87, 0.4)',
              transition: 'all 0.3s ease',
            }}
          >
            Sign Out
          </button>
        </div>

        {/* Module Grid */}
        <div className="row g-4">
          {modules.map((mod) => (
            <div className="col-12 col-md-6 col-xl-4" key={mod.name}>
              <Link href={mod.href} className="text-decoration-none d-block h-100">
                <div
                  className="h-100 p-4 d-flex flex-column justify-content-between position-relative overflow-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    minHeight: '180px',
                  }}
                >
                  <div className="position-relative" style={{ zIndex: 2 }}>
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="me-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: '50px',
                          height: '50px',
                          background: mod.gradient,
                          borderRadius: '12px',
                          fontSize: '1.5rem',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        {mod.icon}
                      </div>
                      <div>
                        <h5 className="fw-bold mb-1 text-light">{mod.name}</h5>
                        <p className="text-light opacity-75 mb-0 small">{mod.description}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-end">
                      <span
                        className="small fw-bold"
                        style={{
                          background: mod.gradient,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        Access →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div
          className="text-center mt-5 p-4"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
          }}
        >
          <p className="text-light opacity-50 mb-0 small">
            Society Management System • Secure & Efficient
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, -20px) rotate(180deg); }
        }

        @media (max-width: 768px) {
          .container { padding-left: 1rem; padding-right: 1rem; }
        }
      `}</style>
    </div>
  );
}
