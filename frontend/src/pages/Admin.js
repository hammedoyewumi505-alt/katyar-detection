import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [scans, setScans] = useState([]);
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const ADMIN_EMAIL = 'developerhallins@gmail.com';

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data } = await supabase.auth.getUser();
        const email = data?.user?.email;
        setUserEmail(email || 'not logged in');
        if (email === ADMIN_EMAIL) {
          setIsAdmin(true);
          loadPending();
        }
      } catch (err) {
        console.log('Auth error:', err);
      }
      setLoading(false);
    }
    checkAdmin();
  }, []);

  async function loadPending() {
    const { data, error } = await supabase
      .from('user_plans')
      .select('*, plans(name, slots, price_pkr)')
      .eq('status', 'pending');
    if (error) console.log('Pending error:', error);
    setPending(data || []);
  }

  async function loadUsers() {
    const { data, error } = await supabase
      .from('user_plans')
      .select('*, plans(name, slots)');
    if (error) console.log('Users error:', error);
    setUsers(data || []);
  }

  async function loadScans() {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.log('Scans error:', error);
    setScans(data || []);
  }

  async function handleApprove(row) {
    const { error } = await supabase
      .from('user_plans')
      .update({
        status: 'active',
        slots_remaining: row.plans?.slots || 10,
        slots_total: row.plans?.slots || 10,
        approved_at: new Date().toISOString()
      })
      .eq('id', row.id);
    if (!error) {
      setMessage('User approved successfully!');
      setTimeout(() => setMessage(''), 3000);
      loadPending();
    }
  }

  async function handleReject(id) {
    const { error } = await supabase
      .from('user_plans')
      .update({ status: 'rejected' })
      .eq('id', id);
    if (!error) {
      setMessage('User rejected.');
      setTimeout(() => setMessage(''), 3000);
      loadPending();
    }
  }

  function switchTab(t) {
    setTab(t);
    if (t === 'users') loadUsers();
    if (t === 'scans') loadScans();
    if (t === 'pending') loadPending();
  }

  const thStyle = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  };

  const tdStyle = {
    padding: '14px 16px',
    borderBottom: '1px solid #f3f4f6',
    fontSize: '14px',
    color: '#374151'
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh',
        flexDirection: 'column', gap: '16px'
      }}>
        <div style={{ fontSize: '32px' }}>⏳</div>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Loading admin panel...
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh',
        flexDirection: 'column', gap: '16px',
        background: '#f8fafc'
      }}>
        <div style={{ fontSize: '60px' }}>🚫</div>
        <h1 style={{
          fontSize: '28px', fontWeight: '800',
          color: '#1e3a8a', margin: '0'
        }}>
          Access Denied
        </h1>
        <p style={{ color: '#6b7280', margin: '0' }}>
          You must be logged in as admin.
        </p>
        <div style={{
          background: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '10px',
          padding: '12px 20px',
          fontSize: '14px',
          color: '#92400e'
        }}>
          Current email: <strong>{userEmail}</strong><br />
          Required: <strong>{ADMIN_EMAIL}</strong>
        </div>
        <a href="/signin" style={{
          background: '#1e40af', color: '#fff',
          padding: '12px 24px', borderRadius: '10px',
          textDecoration: 'none', fontWeight: '700'
        }}>
          Sign In as Admin
        </a>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '240px',
        background: '#1e3a8a',
        minHeight: '100vh',
        padding: '24px 16px',
        flexShrink: '0'
      }}>
        <div style={{
          color: '#ffffff',
          fontWeight: '800',
          fontSize: '18px',
          marginBottom: '4px',
          padding: '0 8px'
        }}>
          🛡️ Katyar Detection
        </div>
        <div style={{
          color: '#93c5fd',
          fontSize: '12px',
          padding: '0 8px',
          marginBottom: '32px'
        }}>
          Admin Panel
        </div>

        {[
          { key: 'pending', icon: '📋', label: 'Pending Approvals' },
          { key: 'users', icon: '👥', label: 'All Users' },
          { key: 'scans', icon: '📊', label: 'All Scans' }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => switchTab(item.key)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontWeight: '600',
              fontSize: '14px',
              marginBottom: '6px',
              transition: 'all 0.2s',
              background: tab === item.key ? '#3b82f6' : 'transparent',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

        {message && (
          <div style={{
            background: '#d1fae5',
            border: '1px solid #6ee7b7',
            color: '#065f46',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            ✅ {message}
          </div>
        )}

        {/* PENDING TAB */}
        {tab === 'pending' && (
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#1e3a8a',
              marginBottom: '24px'
            }}>
              Pending Approvals
              <span style={{
                background: '#fee2e2',
                color: '#991b1b',
                fontSize: '14px',
                padding: '4px 10px',
                borderRadius: '20px',
                marginLeft: '12px',
                fontWeight: '700'
              }}>
                {pending.length}
              </span>
            </h2>

            {pending.length === 0 ? (
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '60px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  No pending approvals
                </p>
                <p style={{ color: '#6b7280', marginTop: '8px' }}>
                  All payments have been reviewed
                </p>
              </div>
            ) : (
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>User ID</th>
                      <th style={thStyle}>Plan</th>
                      <th style={thStyle}>Price</th>
                      <th style={thStyle}>Transaction ID</th>
                      <th style={thStyle}>Screenshot</th>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map(row => (
                      <tr key={row.id}>
                        <td style={tdStyle}>
                          <span style={{
                            fontFamily: 'monospace',
                            background: '#f3f4f6',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '12px'
                          }}>
                            {row.user_id?.slice(0, 8)}...
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            background: '#dbeafe',
                            color: '#1e40af',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700'
                          }}>
                            {row.plans?.name || 'N/A'}
                          </span>
                        </td>
                        <td style={{
                          ...tdStyle,
                          fontWeight: '700',
                          color: '#1e40af'
                        }}>
                          ₨{row.plans?.price_pkr?.toLocaleString() || 'N/A'}
                        </td>
                        <td style={tdStyle}>
                          {row.transaction_id || 'Not provided'}
                        </td>
                        <td style={tdStyle}>
                          {row.payment_screenshot_url ? (
                            <a
                              href={row.payment_screenshot_url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color: '#1e40af',
                                fontWeight: '600',
                                textDecoration: 'none'
                              }}
                            >
                              View 📎
                            </a>
                          ) : (
                            <span style={{ color: '#9ca3af', fontSize: '13px' }}>
                              No file
                            </span>
                          )}
                        </td>
                        <td style={{
                          ...tdStyle,
                          fontSize: '13px',
                          color: '#6b7280'
                        }}>
                          {new Date(row.created_at).toLocaleDateString()}
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleApprove(row)}
                              style={{
                                background: '#22c55e',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '13px'
                              }}
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleReject(row.id)}
                              style={{
                                background: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '13px'
                              }}
                            >
                              ✗ Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#1e3a8a',
              marginBottom: '24px'
            }}>
              All Users ({users.length})
            </h2>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              overflow: 'hidden'
            }}>
              {users.length === 0 ? (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  No users found
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>User ID</th>
                      <th style={thStyle}>Plan</th>
                      <th style={thStyle}>Slots Remaining</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(row => (
                      <tr key={row.id}>
                        <td style={tdStyle}>
                          <span style={{
                            fontFamily: 'monospace',
                            fontSize: '12px'
                          }}>
                            {row.user_id?.slice(0, 8)}...
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {row.plans?.name || 'N/A'}
                        </td>
                        <td style={tdStyle}>
                          {row.slots_remaining} / {row.slots_total}
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            background:
                              row.status === 'active' ? '#d1fae5' :
                              row.status === 'pending' ? '#fef3c7' : '#fee2e2',
                            color:
                              row.status === 'active' ? '#065f46' :
                              row.status === 'pending' ? '#92400e' : '#991b1b'
                          }}>
                            {row.status}
                          </span>
                        </td>
                        <td style={{
                          ...tdStyle,
                          color: '#6b7280',
                          fontSize: '13px'
                        }}>
                          {new Date(row.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* SCANS TAB */}
        {tab === 'scans' && (
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#1e3a8a',
              marginBottom: '24px'
            }}>
              All Scans ({scans.length})
            </h2>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              overflow: 'hidden'
            }}>
              {scans.length === 0 ? (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  No scans yet
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Filename</th>
                      <th style={thStyle}>AI %</th>
                      <th style={thStyle}>Plagiarism %</th>
                      <th style={thStyle}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scans.map(row => (
                      <tr key={row.id}>
                        <td style={tdStyle}>{row.filename}</td>
                        <td style={tdStyle}>
                          <span style={{
                            fontWeight: '700',
                            color: row.ai_percentage > 50 ? '#ef4444' : '#22c55e'
                          }}>
                            {row.ai_percentage}%
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            fontWeight: '700',
                            color: row.plagiarism_percentage > 30
                              ? '#ef4444' : '#22c55e'
                          }}>
                            {row.plagiarism_percentage}%
                          </span>
                        </td>
                        <td style={{
                          ...tdStyle,
                          color: '#6b7280',
                          fontSize: '13px'
                        }}>
                          {new Date(row.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}