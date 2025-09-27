// 'use client';
// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabase';

// interface Notice {
//   id: string;
//   title: string;
//   body: string;
//   created_at?: string;
// }

// export default function NoticesPage() {
//   const [notices, setNotices] = useState<Notice[]>([]);
//   const [title, setTitle] = useState('');
//   const [body, setBody] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     fetchNotices();
//   }, []);

//   async function fetchNotices() {
//     setLoading(true);
//     setErrorMsg('');
//     const { data, error } = await supabase
//       .from('notices')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (error) setErrorMsg(error.message);
//     else setNotices(data as Notice[]);
//     setLoading(false);
//   }

//   async function addNotice(e: React.FormEvent) {
//     e.preventDefault();
//     if (!title.trim() || !body.trim()) {
//       setErrorMsg('Title and content cannot be empty.');
//       return;
//     }
//     setIsSubmitting(true);
//     const { error } = await supabase.from('notices').insert([{ title, body }]);
//     if (error) {
//       setErrorMsg(error.message);
//       setIsSubmitting(false);
//       return;
//     }
//     setTitle('');
//     setBody('');
//     setIsSubmitting(false);
//     fetchNotices();
//   }

//   return (
//     <div className="min-vh-100" style={{
//       background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//     }}>
//       {/* Floating Background Orbs */}
//       <div style={{
//         position: 'fixed',
//         top: 0, left: 0, right: 0, bottom: 0,
//         overflow: 'hidden',
//         zIndex: 1,
//         pointerEvents: 'none'
//       }}>
//         {[...Array(5)].map((_, i) => (
//           <div key={i} style={{
//             position: 'absolute',
//             width: '180px',
//             height: '180px',
//             borderRadius: '50%',
//             background: `radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)`,
//             top: `${i * 18 + 10}%`,
//             left: `${i * 20 + 5}%`,
//             animation: `float 14s ease-in-out infinite ${i * 2.5}s`
//           }}/>
//         ))}
//       </div>

//       <div className="container py-5" style={{ position: 'relative', zIndex: 2 }}>
//         {/* Navigation & Header */}
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <button 
//             onClick={() => window.history.back()} 
//             className="btn back-btn d-flex align-items-center"
//             style={{
//               background: 'rgba(255,255,255,0.1)',
//               backdropFilter: 'blur(10px)',
//               border: '1px solid rgba(255,255,255,0.2)',
//               color: 'white',
//               borderRadius: '12px',
//               padding: '0.5rem 1rem',
//               transition: 'all 0.3s ease'
//             }}
//           >
//             <span className="me-2">🏠</span>Back to Dashboard
//           </button>
//         </div>

//         {/* Header */}
//         <div className="text-center mb-5">
//           <div className="d-inline-flex align-items-center p-4 mb-3 glass-card">
//             <div className="me-3" style={{
//               fontSize: '3rem', background: 'linear-gradient(135deg, #667eea, #764ba2)',
//               WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
//             }}>📢</div>
//             <h1 className="fw-bold mb-0 gradient-text" style={{ fontSize: '2.5rem' }}>Community Notices</h1>
//           </div>
//           <p className="text-light opacity-75">Stay informed with the latest community updates and announcements</p>
//         </div>

//         {/* Add Notice Form */}
//         <div className="row justify-content-center mb-5">
//           <div className="col-12 col-lg-8">
//             <div className="p-4 glass-card">
//               <h4 className="text-light mb-4 d-flex align-items-center">
//                 <span className="me-2 gradient-text">📝</span>Create New Notice
//               </h4>
//               <form onSubmit={addNotice}>
//                 <input 
//                   type="text" 
//                   placeholder="Notice title..." 
//                   value={title} 
//                   onChange={e => setTitle(e.target.value)}
//                   disabled={isSubmitting}
//                   className="form-control mb-3 glass-input" 
//                   required 
//                 />
//                 <textarea 
//                   placeholder="Notice content and details..." 
//                   value={body} 
//                   onChange={e => setBody(e.target.value)}
//                   disabled={isSubmitting}
//                   rows={4} 
//                   className="form-control mb-4 glass-input" 
//                   required 
//                 />
//                 <button 
//                   type="submit" 
//                   disabled={isSubmitting} 
//                   className="btn gradient-btn fw-bold d-flex align-items-center justify-content-center"
//                 >
//                   {isSubmitting ? (
//                     <><span className="spinner-border spinner-border-sm me-2" />Publishing...</>
//                   ) : (
//                     <><span className="me-2">🚀</span>Publish Notice</>
//                   )}
//                 </button>
//               </form>
//               {errorMsg && (
//                 <div className="alert alert-danger mt-3" style={{
//                   background: 'rgba(220,53,69,0.1)',
//                   border: '1px solid rgba(220,53,69,0.3)',
//                   color: '#ff6b6b'
//                 }}>
//                   {errorMsg}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Statistics */}
//         <div className="row mb-5">
//           <div className="col-12 col-md-6 col-lg-4 mb-3 mx-auto">
//             <div className="stats-card text-center">
//               <div className="stats-icon mx-auto mb-2" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
//                 📊
//               </div>
//               <h3 className="text-light fw-bold mb-0">{notices.length}</h3>
//               <p className="text-light opacity-75 mb-0">Total Notices</p>
//             </div>
//           </div>
//         </div>

//         {/* Notices List */}
//         {loading ? (
//           <div className="text-center py-5">
//             <div className="spinner-border text-light" role="status" />
//             <p className="text-light opacity-75 mt-3">Loading notices...</p>
//           </div>
//         ) : notices.length === 0 ? (
//           <div className="text-center py-5 glass-card-empty">
//             <div style={{ fontSize: '4rem', opacity: 0.3 }}>📢</div>
//             <h5 className="text-light mb-2">No Notices Published</h5>
//             <p className="text-light opacity-50">Create your first community notice above to get started.</p>
//           </div>
//         ) : (
//           <div className="row">
//             {notices.map((notice, i) => (
//               <div key={notice.id} className="col-12 col-lg-6 mb-4">
//                 <div className="notice-card" style={{ animationDelay: `${i * 0.1}s` }}>
//                   <div className="d-flex align-items-start mb-3">
//                     <div className="notice-icon me-3" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
//                       📢
//                     </div>
//                     <div className="flex-grow-1">
//                       <h5 className="text-light fw-bold mb-2">{notice.title}</h5>
//                       <div className="notice-badge">
//                         <span className="me-1">📅</span>Community Notice
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="mb-3 p-3 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
//                     <p className="text-light opacity-85 mb-0">{notice.body}</p>
//                   </div>

//                   <div className="d-flex justify-content-between text-light opacity-50 small">
//                     <span>🕒 {notice.created_at ? new Date(notice.created_at).toLocaleDateString() : 'Recently'}</span>
//                     <span>🆔 #{String(notice.id).slice(-6).toUpperCase()}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         .glass-card {
//           background: rgba(255,255,255,0.05);
//           backdrop-filter: blur(20px);
//           border-radius: 20px;
//           border: 1px solid rgba(255,255,255,0.1);
//           box-shadow: 0 8px 32px rgba(0,0,0,0.3);
//           transition: all 0.3s ease;
//         }
//         .glass-card:hover {
//           background: rgba(255,255,255,0.08);
//           transform: translateY(-2px);
//         }
//         .glass-card-empty {
//           background: rgba(255,255,255,0.03);
//           backdrop-filter: blur(15px);
//           border-radius: 20px;
//           padding: 4rem;
//           text-align: center;
//           border: 1px solid rgba(255,255,255,0.1);
//         }
//         .glass-input {
//           background: rgba(255,255,255,0.1);
//           border: 1px solid rgba(255,255,255,0.2);
//           border-radius: 12px;
//           color: white;
//           padding: 12px 16px;
//           transition: all 0.3s ease;
//         }
//         .glass-input:focus {
//           background: rgba(255,255,255,0.15);
//           border-color: rgba(102,126,234,0.5);
//           box-shadow: 0 0 20px rgba(102,126,234,0.2);
//           outline: none;
//           color: white;
//         }
//         .glass-input::placeholder { color: rgba(255,255,255,0.6); }
//         .gradient-btn {
//           background: linear-gradient(135deg, #667eea, #764ba2);
//           color: white;
//           border: none;
//           border-radius: 12px;
//           padding: 0.75rem 1.5rem;
//           transition: all 0.3s ease;
//         }
//         .gradient-btn:hover { 
//           transform: translateY(-2px); 
//           box-shadow: 0 6px 25px rgba(102,126,234,0.5);
//           color: white;
//         }
//         .gradient-text { 
//           background: linear-gradient(135deg, #667eea, #764ba2); 
//           -webkit-background-clip: text; 
//           -webkit-text-fill-color: transparent; 
//         }
//         .stats-card {
//           background: rgba(255,255,255,0.05);
//           backdrop-filter: blur(20px);
//           border-radius: 16px;
//           border: 1px solid rgba(255,255,255,0.1);
//           padding: 1.5rem;
//           transition: all 0.3s ease;
//         }
//         .stats-card:hover {
//           background: rgba(255,255,255,0.08);
//           transform: translateY(-2px);
//           box-shadow: 0 8px 25px rgba(0,0,0,0.3);
//         }
//         .stats-icon {
//           width: 50px;
//           height: 50px;
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 1.5rem;
//         }
//         .notice-card {
//           background: rgba(255,255,255,0.05);
//           backdrop-filter: blur(20px);
//           border-radius: 20px;
//           border: 1px solid rgba(255,255,255,0.1);
//           padding: 1.5rem;
//           box-shadow: 0 8px 32px rgba(0,0,0,0.3);
//           transition: all 0.3s ease;
//           animation: slideIn 0.6s forwards;
//           height: 100%;
//         }
//         .notice-card:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 12px 40px rgba(0,0,0,0.4);
//           background: rgba(255,255,255,0.08);
//         }
//         .notice-icon {
//           width: 40px;
//           height: 40px;
//           border-radius: 10px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 1.2rem;
//           flex-shrink: 0;
//         }
//         .notice-badge {
//           padding: 0.25rem 0.75rem;
//           border-radius: 50px;
//           font-size: 0.8rem;
//           font-weight: 600;
//           background: linear-gradient(135deg, #667eea, #764ba2);
//           display: inline-flex;
//           align-items: center;
//         }
//         .back-btn:hover {
//           background: rgba(255,255,255,0.15);
//           border-color: rgba(102,126,234,0.5);
//           transform: translateY(-2px);
//           box-shadow: 0 4px 15px rgba(102,126,234,0.3);
//         }
//         @keyframes float { 
//           0%,100%{transform:translate(0,0) rotate(0deg);} 
//           50%{transform:translate(-15px,-15px) rotate(45deg);} 
//         }
//         @keyframes slideIn { 
//           from{opacity:0; transform:translateY(30px);} 
//           to{opacity:1; transform:translateY(0);} 
//         }
//         .container { max-width: 1200px; }
//         .spinner-border { border-color: rgba(102,126,234,0.3); border-top-color: #667eea; }
//       `}</style>
//     </div>
//   );
// }
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Notice {
  id: string;
  title: string;
  body: string;
  created_at?: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    setLoading(true);
    setErrorMsg('');
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) setErrorMsg(error.message);
    else setNotices(data as Notice[]);
    setLoading(false);
  }

  async function addNotice(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setErrorMsg('Title and content cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from('notices').insert([{ title, body }]);
    if (error) {
      setErrorMsg(error.message);
      setIsSubmitting(false);
      return;
    }
    setTitle('');
    setBody('');
    setIsSubmitting(false);
    fetchNotices();
  }

  async function deleteNotice(id: string) {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setNotices(notices.filter(n => n.id !== id));
  }

  async function updateNotice(id: string) {
    if (!editTitle.trim() || !editBody.trim()) {
      setErrorMsg('Title and content cannot be empty.');
      return;
    }
    const { error } = await supabase
      .from('notices')
      .update({ title: editTitle, body: editBody })
      .eq('id', id);

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setEditingId(null);
    setEditTitle('');
    setEditBody('');
    fetchNotices();
  }

  return (
    <div className="min-vh-100" style={{
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Floating Background Orbs */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)`,
            top: `${i * 18 + 10}%`,
            left: `${i * 20 + 5}%`,
            animation: `float 14s ease-in-out infinite ${i * 2.5}s`
          }}/>
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
              fontSize: '3rem', background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>📢</div>
            <h1 className="fw-bold mb-0 gradient-text" style={{ fontSize: '2.5rem' }}>Community Notices</h1>
          </div>
          <p className="text-light opacity-75">Stay informed with the latest community updates and announcements</p>
        </div>

        {/* Add Notice Form */}
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-lg-8">
            <div className="p-4 glass-card">
              <h4 className="text-light mb-4 d-flex align-items-center">
                <span className="me-2 gradient-text">📝</span>Create New Notice
              </h4>
              <form onSubmit={addNotice}>
                <input 
                  type="text" 
                  placeholder="Notice title..." 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  className="form-control mb-3 glass-input" 
                  required 
                />
                <textarea 
                  placeholder="Notice content and details..." 
                  value={body} 
                  onChange={e => setBody(e.target.value)}
                  disabled={isSubmitting}
                  rows={4} 
                  className="form-control mb-4 glass-input" 
                  required 
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="btn gradient-btn fw-bold d-flex align-items-center justify-content-center"
                >
                  {isSubmitting ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Publishing...</>
                  ) : (
                    <><span className="me-2">🚀</span>Publish Notice</>
                  )}
                </button>
              </form>
              {errorMsg && (
                <div className="alert alert-danger mt-3" style={{
                  background: 'rgba(220,53,69,0.1)',
                  border: '1px solid rgba(220,53,69,0.3)',
                  color: '#ff6b6b'
                }}>
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="row mb-5">
          <div className="col-12 col-md-6 col-lg-4 mb-3 mx-auto">
            <div className="stats-card text-center">
              <div className="stats-icon mx-auto mb-2" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                📊
              </div>
              <h3 className="text-light fw-bold mb-0">{notices.length}</h3>
              <p className="text-light opacity-75 mb-0">Total Notices</p>
            </div>
          </div>
        </div>

        {/* Notices List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-light" role="status" />
            <p className="text-light opacity-75 mt-3">Loading notices...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-5 glass-card-empty">
            <div style={{ fontSize: '4rem', opacity: 0.3 }}>📢</div>
            <h5 className="text-light mb-2">No Notices Published</h5>
            <p className="text-light opacity-50">Create your first community notice above to get started.</p>
          </div>
        ) : (
          <div className="row">
            {notices.map((notice, i) => (
              <div key={notice.id} className="col-12 col-lg-6 mb-4">
                <div className="notice-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  {editingId === notice.id ? (
                    <>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="form-control mb-2 glass-input"
                      />
                      <textarea
                        rows={3}
                        value={editBody}
                        onChange={e => setEditBody(e.target.value)}
                        className="form-control mb-2 glass-input"
                      />
                      <div className="d-flex justify-content-end">
                        <button onClick={() => updateNotice(notice.id)} className="btn gradient-btn me-2">
                          💾 Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="btn btn-secondary">
                          ❌ Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="d-flex align-items-start mb-3">
                        <div className="notice-icon me-3" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                          📢
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="text-light fw-bold mb-2">{notice.title}</h5>
                          <div className="notice-badge">
                            <span className="me-1">📅</span>Community Notice
                          </div>
                        </div>
                        <div className="ms-2">
                          <button
                            className="btn btn-sm btn-light me-2"
                            onClick={() => {
                              setEditingId(notice.id);
                              setEditTitle(notice.title);
                              setEditBody(notice.body);
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteNotice(notice.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-3 p-3 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <p className="text-light opacity-85 mb-0">{notice.body}</p>
                      </div>

                      <div className="d-flex justify-content-between text-light opacity-50 small">
                        <span>🕒 {notice.created_at ? new Date(notice.created_at).toLocaleDateString() : 'Recently'}</span>
                        <span>🆔 #{String(notice.id).slice(-6).toUpperCase()}</span>
                      </div>
                    </>
                  )}
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
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }
        .glass-card:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-2px);
        }
        .glass-card-empty {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 4rem;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.1);
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
          border-color: rgba(102,126,234,0.5);
          box-shadow: 0 0 20px rgba(102,126,234,0.2);
          outline: none;
          color: white;
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.6); }
        .gradient-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          transition: all 0.3s ease;
        }
        .gradient-btn:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 6px 25px rgba(102,126,234,0.5);
          color: white;
        }
        .gradient-text { 
          background: linear-gradient(135deg, #667eea, #764ba2); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
        }
        .stats-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 1.5rem;
          transition: all 0.3s ease;
        }
        .stats-card:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        .stats-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .notice-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          animation: slideIn 0.6s forwards;
          height: 100%;
        }
        .notice-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
          background: rgba(255,255,255,0.08);
        }
        .notice-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        .notice-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: inline-flex;
          align-items: center;
        }
        .back-btn:hover {
          background: rgba(255,255,255,0.15);
          border-color: rgba(102,126,234,0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102,126,234,0.3);
        }
        @keyframes float { 
          0%,100%{transform:translate(0,0) rotate(0deg);} 
          50%{transform:translate(-15px,-15px) rotate(45deg);} 
        }
        @keyframes slideIn { 
          from{opacity:0; transform:translateY(30px);} 
          to{opacity:1; transform:translateY(0);} 
        }
        .container { max-width: 1200px; }
        .spinner-border { border-color: rgba(102,126,234,0.3); border-top-color: #667eea; }
      `}</style>
    </div>
  );
}
