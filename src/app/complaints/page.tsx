'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user);
    });
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
    setLoading(true);
    setErrorMsg('');
    const { data, error } = await supabase.from('complaints').select(`id, title, description, status, created_at`);
    if (error) setErrorMsg(error.message);
    else setComplaints(data || []);
    setLoading(false);
  }

  async function addComplaint(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (!user?.id) {
      setErrorMsg('You must be logged in to submit a complaint');
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from('complaints').insert([{
      user_id: user.id,
      title,
      description,
      category: 'Other',
    }]);

    if (error) setErrorMsg(error.message);
    else {
      setTitle('');
      setDescription('');
      fetchComplaints();
    }
    setIsSubmitting(false);
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'linear-gradient(135deg, #f7971e, #ffd200)';
      case 'in_progress':
      case 'in progress': return 'linear-gradient(135deg, #667eea, #764ba2)';
      case 'resolved': return 'linear-gradient(135deg, #43e97b, #38f9d7)';
      case 'closed': return 'linear-gradient(135deg, #30cfd0, #330867)';
      default: return 'linear-gradient(135deg, #ff758c, #ff7eb3)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '⏳';
      case 'in_progress':
      case 'in progress': return '🔄';
      case 'resolved': return '✅';
      case 'closed': return '🔒';
      default: return '📝';
    }
  };

  return (
    <div className="min-vh-100" style={{
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Floating Background Orbs */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 1, pointerEvents: 'none'
      }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', width: '150px', height: '150px', borderRadius: '50%',
            background: `radial-gradient(circle, rgba(255,117,140,0.1) 0%, transparent 70%)`,
            top: `${i * 20 + 5}%`, left: `${i * 18 + 5}%`,
            animation: `float 12s ease-in-out infinite ${i * 2}s`
          }} />
        ))}
      </div>

      <div className="container py-5" style={{ position: 'relative', zIndex: 2 }}>
        {/* Navigation & Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button 
            onClick={() => window.history.back()} 
            className="btn back-btn d-flex align-items-center"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '12px',
              padding: '0.5rem 1rem',
              transition: 'all 0.3s ease'
            }}
          >
            <span className="me-2">🏠</span>Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center p-4 mb-3 glass-card">
            <div className="me-3" style={{
              fontSize: '3rem', background: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>🛠️</div>
            <h1 className="fw-bold mb-0 gradient-text" style={{ fontSize: '2.5rem' }}>Complaints & Issues</h1>
          </div>
          <p className="text-light opacity-75">Report issues and track resolution progress</p>
        </div>

        {/* Complaint Form */}
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-lg-8">
            <div className="p-4 glass-card">
              <h4 className="text-light mb-4 d-flex align-items-center">
                <span className="me-2 gradient-text">📝</span>Submit New Complaint
              </h4>
              <form onSubmit={addComplaint}>
                <input type="text" placeholder="Complaint title..." value={title} onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting} className="form-control mb-3 glass-input" required />
                <textarea placeholder="Detailed description..." value={description} onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting} rows={4} className="form-control mb-4 glass-input" required />
                <button type="submit" disabled={isSubmitting} className="btn gradient-btn fw-bold d-flex align-items-center justify-content-center">
                  {isSubmitting ? <span className="spinner-border spinner-border-sm me-2" /> : <span className="me-2">🚀</span>}
                  {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </form>
              {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
            </div>
          </div>
        </div>

        {/* Complaints List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-light" role="status" />
            <p className="text-light opacity-75 mt-3">Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-5 glass-card-empty">
            <div style={{ fontSize: '4rem', opacity: 0.3 }}>📋</div>
            <h5 className="text-light mb-2">No Complaints Submitted</h5>
            <p className="text-light opacity-50">All systems running smoothly! Submit your first complaint above.</p>
          </div>
        ) : (
          <div className="row">
            {complaints.map((c, i) => (
              <div key={c.id} className="col-12 col-lg-6 mb-4">
                <div className="complaint-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="text-light fw-bold mb-0">{c.title}</h5>
                    <div className="status-badge" style={{ background: getStatusColor(c.status) }}>
                      <span className="me-1">{getStatusIcon(c.status)}</span>{c.status || 'Pending'}
                    </div>
                  </div>
                  <p className="text-light opacity-85">{c.description}</p>
                  <div className="d-flex justify-content-between text-light opacity-50 small">
                    <span>🕒 {new Date(c.created_at).toLocaleDateString()}</span>
                    <span>🆔 #{String(c.id).slice(-6).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 2rem;
        }
        .glass-card-empty {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 4rem;
          text-align: center;
        }
        .glass-input {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          color: white;
          padding: 12px 16px;
          transition: all 0.3s ease;
        }
        .glass-input:focus {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,117,140,0.5);
          box-shadow: 0 0 20px rgba(255,117,140,0.2);
          outline: none;
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.6); }
        .gradient-btn {
          background: linear-gradient(135deg, #ff758c, #ff7eb3);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          transition: all 0.3s ease;
        }
        .gradient-btn:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 6px 25px rgba(255,117,140,0.5); 
        }
        .gradient-text { 
          background: linear-gradient(135deg, #ff758c, #ff7eb3); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
        }
        .complaint-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          animation: slideIn 0.6s forwards;
        }
        .complaint-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
          background: rgba(255,255,255,0.08);
        }
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
        }
        .back-btn:hover {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,117,140,0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255,117,140,0.3);
        }
        @keyframes float { 
          0%,100%{transform:translate(0,0) rotate(0deg);} 
          50%{transform:translate(-10px,-10px) rotate(45deg);} 
        }
        @keyframes slideIn { 
          from{opacity:0; transform:translateY(20px);} 
          to{opacity:1; transform:translateY(0);} 
        }
      `}</style>
    </div>
  );
}