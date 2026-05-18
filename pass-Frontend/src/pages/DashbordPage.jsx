
// --- REUSABLE COMPONENTS ---

const StatCard = ({ title, value, icon, colorHex }) => (
  <div style={{
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '9999px',
        height: '3.5rem',
        width: '3.5rem',
        fontSize: '1.5rem',
        backgroundColor: colorHex,
        color: '#ffffff',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.875rem', lineHeight: '1.25rem', color: '#64748b', fontWeight: '600' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.875rem', lineHeight: 1, fontWeight: '600', letterSpacing: '-0.025em', marginTop: '0.25rem' }}>
          {value}
        </div>
      </div>
    </div>
  </div>
);

const ActionFormCard = ({ title, buttonText }) => (
  <div style={{
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', textTransform: 'uppercase', color: '#0f172a' }}>
        {title}
      </h3>
    </div>
    <div style={{ padding: '1.5rem' }}>
      <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#0f172a', display: 'block' }}>
        Visitor Id
      </label>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <input 
          type="text" 
          placeholder="Enter ID..." 
          style={{
            flex: 1,
            height: '2.5rem',
            borderRadius: '0.375rem',
            border: '1px solid #e2e8f0',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            outline: 'none',
            boxSizing: 'border-box'
          }} 
        />
        <button style={{
          backgroundColor: '#dc2626',
          color: '#ffffff',
          borderRadius: '0.375rem',
          padding: '0 1.25rem',
          height: '2.5rem',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '0.875rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {buttonText}
        </button>
      </div>
    </div>
  </div>
);

const DashboardTable = ({ title, columns, data, actionLabel, actionButtonColor }) => (
  <div style={{ marginTop: '3rem' }}>
    <h2 style={{ 
      textAlign: 'center', 
      color: '#b91c1c', 
      marginBottom: '1.5rem',
      fontSize: '1.5rem',
      fontWeight: '700',
      letterSpacing: '-0.025em',
      margin: '0 0 1.5rem 0'
    }}>
      {title}
    </h2>
    <div style={{
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ 
          width: '100%', 
          fontSize: '0.875rem', 
          textAlign: 'left',
          borderCollapse: 'collapse',
          whiteSpace: 'nowrap'
        }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{
                  padding: '0.875rem 1.25rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#4b5563',
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em'
                }}>
                  {col}
                </th>
              ))}
              {actionLabel && (
                <th style={{
                  padding: '0.875rem 1.25rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#4b5563',
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em',
                  textAlign: 'center'
                }}>
                  {actionLabel}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} style={{ padding: '0.875rem 1.25rem', color: '#1f2937' }}>
                      {row[col.toLowerCase().replace(/ /g, '_')] || '-'}
                    </td>
                  ))}
                  {actionLabel && (
                    <td style={{ padding: '0.5rem 1.25rem', textAlign: 'center' }}>
                      <button style={{
                        backgroundColor: actionButtonColor || '#dc2626',
                        color: '#ffffff',
                        borderRadius: '0.375rem',
                        padding: '0 0.75rem',
                        height: '2.25rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
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
                  style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}
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
  // Sample Data mapping to your screenshots
  const requestPassData = [
    { pass: 'Single', id: '3', pass_date: '2024-02-08', timer: '', name: 'jeenweb test', employee: 'jeen user', mobile_no: '7201023222', 'email-id': 'software@jeenweb.com' },
    { pass: 'Single', id: '2', pass_date: '2024-02-08', timer: '', name: 'tatvam shah', employee: 'jeen user', mobile_no: '9824466017', 'email-id': 'tatvam@jeenweb.com' },
  ];

  const approvedPassData = [
    { pass: 'Single', id: '1', pass_date: '2024-02-08', timer: '', name: 'jeenweb test', employee: 'jeenweb admin', mobile_no: '7201023226', 'email-id': 'jeenofficework@gmail.com' },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      height: '100%', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      boxSizing: 'border-box'
    }}>
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
          height: '3.5rem',
          padding: '0 1.5rem',
          maxWidth: '100%',
          margin: '0 auto'
        }}>
          <div style={{ fontWeight: '700', fontSize: '1.25rem', color: '#0f766e', letterSpacing: '-0.025em' }}>
            Visitor Dashboard
          </div>
         
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', boxSizing: 'border-box' }}>
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', boxSizing: 'border-box' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', boxSizing: 'border-box' }}>
            
            {/* Top Stats Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {/* Primary Action Button acting as a card */}
              <button style={{ 
                height: 'auto', 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem', 
                backgroundColor: '#f59e0b', 
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}>
                Create Gate Pass
              </button>
              
              <StatCard 
                title="Total Companies Guest" 
                value="3" 
                icon="👤" 
                colorHex="#ef4444" 
              />
              <StatCard 
                title="Today's Guest" 
                value="0" 
                icon="👤" 
                colorHex="#3b82f6" 
              />
            </div>

            {/* Quick Actions / Forms */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem',
              marginTop: '2rem'
            }}>
              <ActionFormCard title="LOG OUT" buttonText="Submit" />
              <ActionFormCard title="PASS LOG IN" buttonText="Submit" />
            </div>

            {/* Tables Section */}
            <div style={{ marginTop: '2rem', paddingBottom: '3rem' }}>
              
              <DashboardTable 
                title="Request Visitor Pass"
                columns={['PASS', 'ID', 'Pass Date', 'Timer', 'Name', 'Employee', 'Mobile No', 'Email-Id']}
                data={requestPassData}
                actionLabel="Create"
              />

              <DashboardTable 
                title="Approved Visitor Pass"
                columns={['PASS', 'ID', 'Pass Date', 'Timer', 'Name', 'Employee', 'Mobile No', 'Email-Id']}
                data={approvedPassData}
                actionLabel="Print"
              />

              <DashboardTable 
                title="Multi Day Visit Pass"
                columns={['ID', 'Name', 'Date', 'Employee', 'Mobile No', 'Email-Id', 'EXP Date']}
                data={[]} // Empty array to show fallback state
                actionLabel="Create"
              />

              <DashboardTable 
                title="Inside Visitor Pass"
                columns={['PASS', 'ID', 'Pass Date', 'Timer', 'Name', 'Employee', 'Mobile No']}
                data={approvedPassData}
                actionLabel="View"
              />

              <DashboardTable 
                title="Exit/Approved Visitor Pass"
                columns={['PASS', 'ID', 'Pass Date', 'Name', 'Employee', 'Mobile No', 'Email-Id']}
                data={[]}
                actionLabel="Action"
              />

              <DashboardTable 
                title="Pending Approval Visitor Pass"
                columns={['PASS', 'ID', 'Pass Date', 'Name', 'Employee', 'Mobile No', 'Email-Id']}
                data={[]}
                actionLabel="Action"
              />

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}