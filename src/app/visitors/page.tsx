'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Visitor = {
  id: number;
  name: string;
  phone: string;
  vehicle_no: string;
  unit: string;
  purpose: string;
  entry_time: string;
  exit_time: string | null;
  status: string;
};

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filtered, setFiltered] = useState<Visitor[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    vehicle_no: '',
    unit: '',
    purpose: '',
    status: 'In Society',
  });

  useEffect(() => {
    fetchVisitors();
  }, []);

  async function fetchVisitors() {
    setLoading(true);
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('entry_time', { ascending: false });
    if (!error && data) {
      setVisitors(data);
      setFiltered(data);
    }
    setLoading(false);
  }

  function applyFilters() {
    let result = [...visitors];
    if (search.trim()) {
      result = result.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.unit.toLowerCase().includes(search.toLowerCase()) ||
        v.phone.includes(search) ||
        v.vehicle_no.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterStatus !== 'All') {
      result = result.filter(v => v.status === filterStatus);
    }
    setFiltered(result);
  }

  useEffect(() => {
    applyFilters();
  }, [search, filterStatus, visitors]);

  function openForm(visitor?: Visitor) {
    if (visitor) {
      setEditing(visitor);
      setForm(visitor);
    } else {
      setEditing(null);
      setForm({ name: '', phone: '', vehicle_no: '', unit: '', purpose: '', status: 'In Society' });
    }
    setShowForm(true);
  }

  async function saveVisitor(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      const { error } = await supabase.from('visitors').update(form).eq('id', editing.id);
      if (error) { alert('Update failed: ' + error.message); return; }
      setVisitors(prev => prev.map(v => v.id === editing.id ? { ...v, ...form } : v));
    } else {
      const { data, error } = await supabase.from('visitors').insert([form]).select();
      if (error) { alert('Insert failed: ' + error.message); return; }
      if (data && data.length > 0) setVisitors(prev => [...prev, data[0]]);
    }
    setShowForm(false);
    applyFilters();
  }

  async function deleteVisitor(id: number) {
    if (!confirm('Are you sure you want to delete this visitor?')) return;
    await supabase.from('visitors').delete().eq('id', id);
    setVisitors(prev => prev.filter(v => v.id !== id));
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'in society': return 'linear-gradient(135deg, #43e97b, #38f9d7)';
      case 'exited': return 'linear-gradient(135deg, #ff758c, #ff7eb3)';
      default: return 'linear-gradient(135deg, #667eea, #764ba2)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'in society': return '🟢';
      case 'exited': return '🔴';
      default: return '🟡';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)', fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', minHeight:'100vh' }}>
      
      {/* Floating Orbs */}
      <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, overflow:'hidden', zIndex:1, pointerEvents:'none' }}>
        {[...Array(6)].map((_,i)=>(
          <div key={i} style={{ position:'absolute', width:'200px', height:'200px', borderRadius:'50%', background:`radial-gradient(circle, rgba(67,233,123,0.08) 0%, transparent 70%)`, top:`${i*15+10}%`, left:`${i*20+5}%`, animation:`float 15s ease-in-out infinite ${i*2.5}s`}}/>
        ))}
      </div>

      <div className="container py-5" style={{ position:'relative', zIndex:2 }}>

        {/* Back to Dashboard */}
        <div className="d-flex justify-content-start align-items-center mb-4">
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
            <div className="me-3" style={{ fontSize:'3rem', background:'linear-gradient(135deg, #43e97b, #38f9d7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>👥</div>
            <h1 className="fw-bold mb-0 gradient-text" style={{ fontSize:'2.5rem' }}>Visitors Management</h1>
          </div>
          <p className="text-light opacity-75">Track visitor entries and exits</p>
          <button onClick={()=>openForm()} className="btn gradient-btn fw-bold d-flex align-items-center justify-content-center mx-auto">
            <span className="me-2">➕</span>Add Visitor
          </button>
        </div>

        {/* Search & Filter */}
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-lg-10">
            <div className="p-4 glass-card">
              <h4 className="text-light mb-4 d-flex align-items-center"><span className="me-2 gradient-text">🔍</span>Search & Filter</h4>
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <input type="text" placeholder="Search by name, unit, phone, or vehicle..." value={search} onChange={e=>setSearch(e.target.value)} className="form-control glass-input" />
                </div>
                <div className="col-12 col-md-4">
                  <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="form-control glass-input">
                    <option value="All">All</option>
                    <option value="In Society">In Society</option>
                    <option value="Exited">Exited</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visitors Grid */}
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-light" role="status"/><p className="text-light opacity-75 mt-3">Loading visitors...</p></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 glass-card-empty"><div style={{ fontSize:'4rem', opacity:0.3 }}>👥</div><h5 className="text-light mb-2">No Visitors Found</h5><p className="text-light opacity-50">Add visitors using the button above.</p></div>
        ) : (
          <div className="row">
            {filtered.map((v,i)=>(
              <div key={v.id} className="col-12 col-lg-6 col-xl-4 mb-4">
                <div className="resident-card" style={{ animationDelay:`${i*0.1}s` }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="text-light fw-bold mb-1">{v.name}</h5>
                      <p className="text-light opacity-75 mb-0">🏠 Unit {v.unit}</p>
                    </div>
                    <div className="status-badge" style={{ background:getStatusColor(v.status) }}><span className="me-1">{getStatusIcon(v.status)}</span>{v.status}</div>
                  </div>

                  <div className="mb-3">
                    <div className="text-light opacity-85 mb-1">📞 {v.phone || 'No phone'}</div>
                    <div className="text-light opacity-85 mb-1">🚗 {v.vehicle_no || 'No vehicle'}</div>
                    <div className="text-light opacity-85">📝 {v.purpose || 'No purpose'}</div>
                  </div>

                  <div className="mb-3">
                    <div className="text-light opacity-85 mb-1">🕐 Entry: {formatTime(v.entry_time)}</div>
                    <div className="text-light opacity-85">🕓 Exit: {v.exit_time ? formatTime(v.exit_time) : 'Still inside'}</div>
                  </div>

                  <div className="d-flex gap-2">
                    <button onClick={()=>openForm(v)} className="btn btn-outline-light btn-sm flex-fill" style={{ borderRadius:'12px', transition:'all 0.3s ease' }}>✏️ Edit</button>
                    <button onClick={()=>deleteVisitor(v.id)} className="btn btn-outline-danger btn-sm flex-fill" style={{ borderRadius:'12px', transition:'all 0.3s ease' }}>🗑️ Delete</button>
                  </div>

                  <div className="text-light opacity-50 small mt-2 text-end">🆔 #{String(v.id).slice(-6).toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Visitor Modal */}
      {showForm && (
        <div className="modal fade show d-block" style={{ backgroundColor:'rgba(0,0,0,0.7)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-modal">
              <form onSubmit={saveVisitor}>
                <div className="modal-header border-0">
                  <h5 className="modal-title text-light fw-bold"><span className="me-2 gradient-text">{editing ? '✏️' : '➕'}</span>{editing ? 'Edit Visitor' : 'Add Visitor'}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={()=>setShowForm(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <input type="text" placeholder="Full Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="form-control glass-input" required/>
                    </div>
                    <div className="col-12 col-md-6">
                      <input type="tel" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="form-control glass-input"/>
                    </div>
                    <div className="col-12 col-md-6">
                      <input type="text" placeholder="Vehicle No" value={form.vehicle_no} onChange={e=>setForm({...form, vehicle_no:e.target.value})} className="form-control glass-input"/>
                    </div>
                    <div className="col-12 col-md-6">
                      <input type="text" placeholder="Unit" value={form.unit} onChange={e=>setForm({...form, unit:e.target.value})} className="form-control glass-input"/>
                    </div>
                    <div className="col-12">
                      <input type="text" placeholder="Purpose" value={form.purpose} onChange={e=>setForm({...form, purpose:e.target.value})} className="form-control glass-input"/>
                    </div>
                    <div className="col-12">
                      <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className="form-control glass-input">
                        <option value="In Society">In Society</option>
                        <option value="Exited">Exited</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn gradient-btn fw-bold"><span className="me-2">💾</span>Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .glass-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); box-shadow:0 8px 32px rgba(0,0,0,0.3); transition:all 0.3s ease;}
        .glass-card:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px);}
        .glass-card-empty { background: rgba(255,255,255,0.03); backdrop-filter: blur(15px); border-radius:20px; padding:4rem; text-align:center; border:1px solid rgba(255,255,255,0.1);}
        .glass-input { background: rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:12px; color:white; padding:12px 16px; transition:all 0.3s ease; }
        .glass-input:focus { background: rgba(255,255,255,0.15); border-color: rgba(255,117,140,0.5); box-shadow:0 0 20px rgba(255,117,140,0.2); outline:none; color:white; }
        .glass-input::placeholder { color: rgba(255,255,255,0.6); }
        .glass-input option { background:#1a1a2e; color:white; }
        .gradient-btn { background: linear-gradient(135deg, #43e97b, #38f9d7); color:white; border:none; border-radius:12px; padding:0.75rem 1.5rem; transition:all 0.3s ease;}
        .gradient-btn:hover { transform: translateY(-2px); box-shadow:0 6px 25px rgba(67,233,123,0.5); color:white;}
        .gradient-text { background: linear-gradient(135deg, #43e97b, #38f9d7); -webkit-background-clip:text; -webkit-text-fill-color:transparent;}
        .resident-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border-radius:20px; border:1px solid rgba(255,255,255,0.1); padding:1.5rem; box-shadow:0 8px 32px rgba(0,0,0,0.3); transition:all 0.3s ease; animation: slideIn 0.6s forwards; height:100%; }
        .resident-card:hover { transform: translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,0.4); background: rgba(255,255,255,0.08);}
        .status-badge { padding:0.25rem 0.75rem; border-radius:50px; font-size:0.85rem; color:white; font-weight:600; display:inline-flex; align-items:center;}
        .glass-modal { background: rgba(15,15,15,0.95); backdrop-filter: blur(25px); border-radius:20px; border:1px solid rgba(255,255,255,0.1); color:white;}
        @keyframes float {0%,100% { transform: translateY(0px);} 50% { transform: translateY(-20px); }}
        @keyframes slideIn {0% { opacity:0; transform: translateY(20px);} 100% { opacity:1; transform: translateY(0);}}
      `}</style>
    </div>
  );
}
