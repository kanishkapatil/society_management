'use client';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';

export default function MaintenancePage() {
  const [user, setUser] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    due: 0,
    failed: 0,
    totalAmount: 0,
    paidAmount: 0
  });
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) fetchPayments(data.user.id);
    });
  }, []);

  async function fetchPayments(userId: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: false });

    if (error) console.error('Error fetching payments:', error.message);
    else {
      const paymentsData = data || [];
      setPayments(paymentsData);

      const total = paymentsData.length;
      const paid = paymentsData.filter(p => p.status === 'paid').length;
      const due = paymentsData.filter(p => p.status === 'due').length;
      const failed = paymentsData.filter(p => p.status === 'failed').length;
      const totalAmount = paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0);
      const paidAmount = paymentsData.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0);

      setStats({ total, paid, due, failed, totalAmount, paidAmount });
    }
    setLoading(false);
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'linear-gradient(135deg, #43e97b, #38f9d7)';
      case 'failed': return 'linear-gradient(135deg, #ff758c, #ff7eb3)';
      case 'due': return 'linear-gradient(135deg, #f7971e, #ffd200)';
      default: return 'linear-gradient(135deg, #f7971e, #ffd200)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return '✅';
      case 'failed': return '❌';
      case 'due': return '⏳';
      default: return '⏳';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'upi': return '📱';
      case 'card': return '💳';
      case 'net banking':
      case 'netbanking': return '🏦';
      case 'cash': return '💵';
      default: return '💰';
    }
  };

  const downloadReceipt = (payment: any) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Maintenance Payment Receipt', 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${user?.email || 'N/A'}`, 20, 40);
    doc.text(`Payment ID: ${payment.id}`, 20, 50);
    doc.text(`Amount: ₹${payment.amount}`, 20, 60);
    doc.text(`Status: ${payment.status}`, 20, 70);
    doc.text(`Method: ${payment.method}`, 20, 80);
    doc.text(`Date: ${new Date(payment.due_date).toLocaleDateString()}`, 20, 90);
    doc.save(`Receipt_${payment.id}.pdf`);
  };

  if (!user) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      <div className="text-center p-5" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div className="mb-4" style={{
          fontSize: '4rem',
          background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>🔐</div>
        <h2 className="text-light mb-3">Access Required</h2>
        <p className="text-light opacity-75 mb-4">Please authenticate to view your payment history</p>
        <Link href="/login" className="btn px-4 py-2 fw-bold text-decoration-none" style={{
          background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(67, 233, 123, 0.4)',
          transition: 'all 0.3s ease'
        }}>Login</Link>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100" style={{
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Floating Background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        overflow: 'hidden', zIndex: 1, pointerEvents: 'none'
      }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${150 + i * 40}px`,
            height: `${150 + i * 40}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(67,233,123,0.08) 0%, transparent 70%)`,
            top: `${10 + i * 20}%`,
            left: `${5 + i * 15}%`,
            animation: `float 10s ease-in-out infinite ${i * 2}s`
          }} />
        ))}
      </div>

      <div className="container py-5" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 p-4" style={{
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          <div className="text-center text-md-start mb-3 mb-md-0">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-2">
              <div className="me-3" style={{
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>💳</div>
              <h1 className="fw-bold mb-0" style={{
                background: 'linear-gradient(135deg, #fff, #a0a0a0)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                fontSize: '2.2rem'
              }}>Payment History</h1>
            </div>
            <p className="text-light opacity-75 mb-0">Track your maintenance payments and dues</p>
          </div>

          <Link href="/dashboard" className="btn px-4 py-2 fw-bold text-decoration-none d-flex align-items-center" style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            transition: 'all 0.3s ease'
          }} onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.15)'; e.currentTarget.style.transform='translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.transform='translateY(0)'; }}>
            <span className="me-2">←</span>Dashboard
          </Link>
        </div>

        {/* Stats Cards */}
        {!loading && payments.length > 0 && (
          <div className="row g-4 mb-5">
            {['total','paid','due','failed'].map((key, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="text-center p-3" style={{
                  background: key==='paid'? 'rgba(67,233,123,0.1)' : key==='due'? 'rgba(247,151,30,0.1)' : key==='failed'? 'rgba(255,117,140,0.1)' : 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  border: `1px solid ${key==='paid'? 'rgba(67,233,123,0.2)' : key==='due'? 'rgba(247,151,30,0.2)' : key==='failed'? 'rgba(255,117,140,0.2)' : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                }}>
                  <div className="fw-bold mb-1" style={{ fontSize:'1.5rem', color: key==='paid'? '#43e97b': key==='due'? '#f7971e': key==='failed'? '#ff758c': 'white'}}>{stats[key as keyof typeof stats]}</div>
                  <small className="text-light opacity-75">{key.charAt(0).toUpperCase() + key.slice(1)}</small>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Previous Transactions Button */}
        <button
          className="btn gradient-btn mb-4"
          onClick={() => setShowHistory(prev => !prev)}
        >
          {showHistory ? 'Hide Previous Transactions' : 'View Previous Transactions'}
        </button>

        {/* Transactions Table */}
        {showHistory && payments.length > 0 && (
          <div className="table-responsive glass-card p-3 mb-5">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Method</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td>{new Date(p.due_date).toLocaleDateString()}</td>
                    <td>₹{p.amount}</td>
                    <td>
                      <span style={{background: getStatusColor(p.status), borderRadius:'12px', padding:'2px 8px'}}>
                        {getStatusIcon(p.status)} {p.status}
                      </span>
                    </td>
                    <td>{getMethodIcon(p.method)} {p.method}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-light"
                        onClick={() => downloadReceipt(p)}
                      >
                        📄 Download Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {0%,100%{transform:translate(0,0) rotate(0deg);}50%{transform:translate(-15px,-15px) rotate(90deg);}}
        @keyframes slideIn {from {opacity:0; transform:translateY(20px);} to {opacity:1; transform:translateY(0);}}
      `}</style>
    </div>
  );
}
