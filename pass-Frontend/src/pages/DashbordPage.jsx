/* eslint-disable react-hooks/set-state-in-effect */
import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { queryGet, queryPatch } from "@/shared/services/api";

// --- REUSABLE COMPONENTS ---

const StatCard = ({ title, value, icon, colorHex }) => (
  <div style={{
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
  }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '1rem',
        height: '3.5rem',
        width: '3.5rem',
        fontSize: '1.75rem',
        backgroundColor: colorHex,
        color: '#ffffff',
        flexShrink: 0,
        boxShadow: `0 4px 10px ${colorHex}40`
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.875rem', lineHeight: '1.25rem', color: '#64748b', fontWeight: '600' }}>
          {title}
        </div>
        <div style={{ fontSize: '2rem', lineHeight: 1.1, fontWeight: '700', letterSpacing: '-0.025em', marginTop: '0.25rem', color: '#0f172a' }}>
          {value}
        </div>
      </div>
    </div>
  </div>
);

const ActionFormCard = ({ title, buttonText, onSubmit }) => {
  const [visitorId, setVisitorId] = useState('');
  
  const handleSubmit = () => {
    if (!visitorId.trim()) {
      alert("Please enter a valid Visitor ID.");
      return;
    }
    onSubmit && onSubmit(visitorId.trim());
    setVisitorId('');
  };

  return (
    <div style={{
      borderRadius: '0.75rem',
      border: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem' }}>
        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', textTransform: 'uppercase', color: '#334155', letterSpacing: '0.05em' }}>
          {title}
        </h3>
      </div>
      <div style={{ padding: '1.5rem' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569', display: 'block' }}>
          Visitor Id
        </label>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="Enter ID..." 
            value={visitorId}
            onChange={(e) => setVisitorId(e.target.value)}
            style={{
              flex: 1,
              height: '2.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              padding: '0.5rem 0.875rem',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              backgroundColor: '#f8fafc'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
          />
          <button 
            onClick={handleSubmit}
            style={{
              backgroundColor: '#0f766e',
              color: '#ffffff',
              borderRadius: '0.5rem',
              padding: '0 1.5rem',
              height: '2.75rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(15, 118, 110, 0.2)',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0d5c56'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#0f766e'}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardTable = ({ title, columns, data, actionLabel, actionButtonColor, onAction }) => (
  <div style={{ marginTop: '2.5rem' }}>
    <h2 style={{ 
      color: '#0f766e', 
      marginBottom: '1rem',
      fontSize: '1.25rem',
      fontWeight: '700',
      letterSpacing: '-0.015em',
      margin: '0 0 1rem 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <span>{title}</span>
      <span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontWeight: '600' }}>
        {data.length} records
      </span>
    </h2>
    <div style={{
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      borderRadius: '0.75rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
    }}>
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ 
          width: '100%', 
          fontSize: '0.875rem', 
          textAlign: 'left',
          borderCollapse: 'collapse',
          whiteSpace: 'nowrap'
        }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{
                  padding: '0.875rem 1.25rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {col}
                </th>
              ))}
              {actionLabel && (
                <th style={{
                  padding: '0.875rem 1.25rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#475569',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textAlign: 'center'
                }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  {columns.map((col, colIndex) => {
                    const key = col.toLowerCase().replace(/ /g, '_');
                    const val = row[key] || '-';
                    
                    if (key === 'status' || col === 'Status') {
                      const isApproved = val === 'Approved';
                      const isPending = val === 'Pending';
                      const isCheckedIn = val === 'Checked-In';
                      const isCheckedOut = val === 'Checked-Out';
                      const bg = isApproved ? '#def7ec' : isPending ? '#fef3c7' : isCheckedIn ? '#e1f5fe' : isCheckedOut ? '#f3f4f6' : '#fee2e2';
                      const color = isApproved ? '#03543f' : isPending ? '#92400e' : isCheckedIn ? '#0288d1' : isCheckedOut ? '#374151' : '#9b1c1c';
                      return (
                        <td key={colIndex} style={{ padding: '0.875rem 1.25rem' }}>
                          <span style={{
                            padding: '0.25rem 0.625rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: bg,
                            color: color
                          }}>
                            {val}
                          </span>
                        </td>
                      );
                    }
                    
                    if (key === 'pass' || col === 'PASS') {
                      const isMulti = val.toLowerCase().includes('multi');
                      const bg = isMulti ? '#ede9fe' : '#e0f2fe';
                      const color = isMulti ? '#5b21b6' : '#075985';
                      return (
                        <td key={colIndex} style={{ padding: '0.875rem 1.25rem' }}>
                          <span style={{
                            padding: '0.25rem 0.625rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: bg,
                            color: color
                          }}>
                            {val}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td key={colIndex} style={{ padding: '0.875rem 1.25rem', color: '#1f2937' }}>
                        {val}
                      </td>
                    );
                  })}
                  {actionLabel && (
                    <td style={{ padding: '0.5rem 1.25rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => onAction && onAction(row)}
                        style={{
                          backgroundColor: actionButtonColor || '#0f766e',
                          color: '#ffffff',
                          borderRadius: '0.375rem',
                          padding: '0 1rem',
                          height: '2rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                      >
                        {actionLabel}
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (actionLabel ? 1 : 0)} 
                  style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.875rem' }}
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);


// --- MAIN PAGE COMPONENT ---

export default function DashbordPage() {
  const navigate = useNavigate();
  const [dashboardState, setDashboardState] = useState({
    stats: { totalCompaniesGuest: 0, todaysGuest: 0 },
    requestPassData: [],
    approvedPassData: [],
    multiDayPassData: [],
    insidePassData: [],
    exitApprovedPassData: [],
    pendingApprovalPassData: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await queryGet('/capture/dashboard/data');
      if (res.data && res.data.data) {
        setDashboardState(res.data.data);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to fetch initial dashboard data. Check backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // SSE connection for Real-time database changes
    const apiUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1").trim();
    const sseUrl = `${apiUrl}/capture/dashboard/stream`;
    console.log("Connecting to SSE stream:", sseUrl);
    
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log("SSE Message Received:", parsed.event);
        if (parsed.event === "dashboard-update" && parsed.data) {
          setDashboardState(parsed.data);
          setError(null);
        }
      } catch (err) {
        console.error("SSE parse message error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection error, retrying...", err);
      // Wait for 5 seconds before attempting to show error
      setTimeout(() => {
        setError("Real-time connection interrupted. Offline mode.");
      }, 5000);
    };

    return () => {
      console.log("Closing SSE connection");
      eventSource.close();
    };
  }, []);

  const handleUpdateStatus = async (passId, newStatus, additionalData = {}) => {
    try {
      await queryPatch(`/capture/${passId}/status`, { status: newStatus, ...additionalData });
      // The SSE broadcast will update all states automatically and instantly!
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(err?.response?.data?.message || "Failed to update pass status.");
    }
  };

  const handleCheckIn = (row) => {
    const securityName = prompt("Please enter the name of the security personnel logging this visitor IN:", "Security Gate 1");
    if (securityName === null) return; // cancelled
    if (!securityName.trim()) {
      alert("Security personnel name is required.");
      return;
    }
    handleUpdateStatus(row.id, "Checked-In", { checkedInBy: securityName.trim() });
  };

  const handleCheckOut = (row) => {
    const securityName = prompt("Please enter the name of the security personnel logging this visitor OUT:", "Security Gate 1");
    if (securityName === null) return; // cancelled
    if (!securityName.trim()) {
      alert("Security personnel name is required.");
      return;
    }
    handleUpdateStatus(row.id, "Checked-Out", { checkedOutBy: securityName.trim() });
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(0.9);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
          100% {
            transform: scale(0.9);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
      `}</style>

      {/* Top Navbar */}
      <header style={{
        width: '100%',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4rem',
          padding: '0 2rem',
          maxWidth: '100%',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontWeight: '800', fontSize: '1.4rem', color: '#0f766e', letterSpacing: '-0.025em' }}>
              Visitor Control Center
            </div>
            {/* Live syncing indicator */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: '#f0fdf4', 
              padding: '0.375rem 0.75rem', 
              borderRadius: '9999px',
              border: '1px solid #dcfce7'
            }}>
              <span style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                animation: 'pulse 2s infinite'
              }} />
              <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '600' }}>
                Real-Time Live
              </span>
            </div>
          </div>

          <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
            Today: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, boxSizing: 'border-box' }}>
        <div style={{ flex: 1, padding: '2rem 0', boxSizing: 'border-box' }}>
          <div style={{ maxWidth: '85rem', margin: '0 auto', boxSizing: 'border-box' }}>
            
            {/* Error notifications */}
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fee2e2',
                color: '#991b1b',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Top Stats Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {/* Primary Action Button acting as a card */}
              <button 
                onClick={() => navigate("/create-pass")}
                style={{ 
                  height: 'auto', 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2rem 1.5rem', 
                  backgroundColor: '#f59e0b', 
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)',
                  transition: 'transform 0.2s, background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.backgroundColor = '#d97706';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.backgroundColor = '#f59e0b';
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>➕</div>
                <span>Create New Gate Pass</span>
              </button>
              
              <StatCard 
                title="Total Visitors Registered" 
                value={dashboardState.stats.totalCompaniesGuest} 
                icon="👥" 
                colorHex="#ef4444" 
              />
              <StatCard 
                title="Today's Guests" 
                value={dashboardState.stats.todaysGuest} 
                icon="📅" 
                colorHex="#3b82f6" 
              />
            </div>

            {/* Quick Actions / Forms */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '1.5rem',
              marginTop: '2rem'
            }}>
              <ActionFormCard 
                title="PASS LOG IN (Check-In)" 
                buttonText="Log In" 
                onSubmit={(visitorId) => handleUpdateStatus(visitorId, "Checked-In")}
              />
              <ActionFormCard 
                title="PASS LOG OUT (Check-Out)" 
                buttonText="Log Out" 
                onSubmit={(visitorId) => handleUpdateStatus(visitorId, "Checked-Out")}
              />
            </div>

            {/* Loading Indicator */}
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  border: '4px solid #e2e8f0',
                  borderTopColor: '#0f766e',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <span style={{ marginTop: '1rem', color: '#64748b', fontWeight: '500' }}>Loading real data...</span>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ) : (
              /* Tables Section */
              <div style={{ marginTop: '1rem', paddingBottom: '5rem' }}>
                
                <DashboardTable 
                  title="Requested Passes (Awaiting Creation)"
                  columns={['PASS', 'GATE PASS ID', 'Pass Date', 'Name', 'Employee', 'Mobile No', 'Email-Id']}
                  data={dashboardState.requestPassData}
                  actionLabel="Create Pass"
                  actionButtonColor="#f59e0b"
                  onAction={(row) => navigate(`/pass/${row.id}/action?mode=review-request`)}
                />

                <DashboardTable 
                  title="Pending Approval Passes"
                  columns={['PASS', 'GATE PASS ID', 'Pass Date', 'Name', 'Employee', 'Mobile No', 'Email-Id']}
                  data={dashboardState.pendingApprovalPassData}
                  actionLabel="Review & Approve"
                  actionButtonColor="#0f766e"
                  onAction={(row) => navigate(`/pass/${row.id}/action?mode=approve`)}
                />

                <DashboardTable 
                  title="Approved Visitor Passes (Ready to Check In)"
                  columns={['PASS', 'GATE PASS ID', 'Pass Date', 'Timer', 'Name', 'Employee', 'Mobile No']}
                  data={dashboardState.approvedPassData}
                  actionLabel="Check-In"
                  actionButtonColor="#3b82f6"
                  onAction={(row) => handleCheckIn(row)}
                />

                <DashboardTable 
                  title="Currently Inside Facility"
                  columns={['PASS', 'GATE PASS ID', 'Pass Date', 'Timer', 'Name', 'Employee', 'Mobile No', 'Checked-In By', 'Checked-In At']}
                  data={dashboardState.insidePassData}
                  actionLabel="Check-Out"
                  actionButtonColor="#e11d48"
                  onAction={(row) => handleCheckOut(row)}
                />

                <DashboardTable 
                  title="Multi Day Visit Passes"
                  columns={['GATE PASS ID', 'Name', 'Date', 'Employee', 'Mobile No', 'Email-Id', 'EXP Date', 'Status']}
                  data={dashboardState.multiDayPassData}
                  actionLabel="View Details"
                  actionButtonColor="#6d28d9"
                  onAction={(row) => navigate(`/pass/${row.id}/action?mode=view`)}
                />

                <DashboardTable 
                  title="Exited Visitors (Exit Pass)"
                  columns={['PASS', 'GATE PASS ID', 'Pass Date', 'Name', 'Employee', 'Mobile No', 'Checked-In', 'Checked-Out']}
                  data={dashboardState.exitApprovedPassData}
                  actionLabel="View Details"
                  actionButtonColor="#475569"
                  onAction={(row) => navigate(`/pass/${row.id}/action?mode=view`)}
                />

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}