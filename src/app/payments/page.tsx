'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MaintenancePage() {
  const router = useRouter();

  const [stats, setStats] = useState({ totalAmount: 10000, paidAmount: 3000, dueAmount: 7000 });
  const [amount, setAmount] = useState<number>(0);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const storedStats = localStorage.getItem('paymentStats');
    if (storedStats) setStats(JSON.parse(storedStats));
  }, []);

  const handlePayment = (type: string) => {
    if (amount <= 0) {
      setMsg('Enter a valid amount');
      return;
    }
    const newPaid = stats.paidAmount + amount;
    const newDue = stats.totalAmount - newPaid;
    const updatedStats = { ...stats, paidAmount: newPaid, dueAmount: newDue };
    setStats(updatedStats);
    localStorage.setItem('paymentStats', JSON.stringify(updatedStats));
    setMsg(`₹${amount} paid successfully via ${type}`);
    setAmount(0);
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div className="container py-5">
        {/* Back to Dashboard */}
        <div className="mb-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="btn"
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
            🏠 Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center p-4 mb-3" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}>
            <div className="me-3" style={{
              fontSize: '3rem',
              background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>🏠</div>
            <h1 className="fw-bold mb-0" style={{
              background: 'linear-gradient(135deg, #fff, #a0a0a0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '2.5rem',
            }}>
              Maintenance Dashboard
            </h1>
          </div>
          <p className="text-light opacity-75">Check your payment summary and pay dues</p>
        </div>

        {/* Stats Cards */}
        <div className="row justify-content-center g-4 mb-5">
          {[
            { label: 'Total Paid', value: stats.paidAmount, icon: '✅', bg: 'rgba(67, 233, 123, 0.1)', border: 'rgba(67, 233, 123, 0.2)' },
            { label: 'Total Due', value: stats.dueAmount, icon: '❌', bg: 'rgba(255, 117, 140, 0.1)', border: 'rgba(255, 117, 140, 0.2)' },
            { label: 'Balance', value: stats.totalAmount - stats.paidAmount, icon: '💰', bg: 'rgba(247, 151, 30, 0.1)', border: 'rgba(247, 151, 30, 0.2)' },
          ].map((card) => (
            <div className="col-12 col-md-4" key={card.label}>
              <div className="p-4 text-center" style={{
                background: card.bg,
                border: `1px solid ${card.border}`,
                borderRadius: '16px',
              }}>
                <div style={{ fontSize: '2rem' }}>{card.icon}</div>
                <h5 className="text-light mt-2">{card.label}</h5>
                <p className="fw-bold text-light fs-4">₹{card.value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Options */}
        <div className="card p-4 mb-5" style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          color: 'white',
        }}>
          <h4 className="mb-4">Pay Maintenance</h4>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Enter amount"
              value={amount > 0 ? amount : ''}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: '12px',
              }}
            />
          </div>
          <div className="d-flex flex-wrap gap-3">
            {['Credit/Debit Card', 'UPI', 'Net Banking'].map((type) => (
              <button
                key={type}
                className="btn flex-grow-1"
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  borderRadius: '12px',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  minWidth: '120px',
                }}
                onClick={() => handlePayment(type)}
              >
                {type}
              </button>
            ))}
          </div>
          {msg && <p className="mt-3 text-success">{msg}</p>}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .container { padding-left: 1rem; padding-right: 1rem; }
        }
      `}</style>
    </div>
  );
}
