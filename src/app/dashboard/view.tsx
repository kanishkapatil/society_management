'use client';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardClient() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    location.href = '/';
  }

  if (!user) {
    return (
      <div className="p-4">
        <p>
          Please{' '}
          <Link href="/login" className="text-decoration-underline">
            login
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Top bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">Dashboard</h1>
        <button onClick={signOut} className="btn btn-outline-secondary btn-sm">
          Sign out
        </button>
      </div>

      {/* Links grid */}
      <div className="row g-3">
        <div className="col-md-4">
          <Link
            href="/notices"
            className="card shadow-sm text-decoration-none text-dark"
          >
            <div className="card-body text-center">📢 Notices</div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link
            href="/complaints"
            className="card shadow-sm text-decoration-none text-dark"
          >
            <div className="card-body text-center">🛠️ Complaints</div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link
            href="/payments"
            className="card shadow-sm text-decoration-none text-dark"
          >
            <div className="card-body text-center">💳 Payments</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
