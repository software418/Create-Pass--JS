/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { queryGet } from "@/shared/services/api";
import { Button } from '@/shared/ui/atoms/Button';
import { useEmployees } from "@/features/employee/useEmployee";
import { useVisitorArea } from "@/features/visitor_area/useVisitorArea";
import { 
  Calendar, 
  Filter, 
  Download, 
  Search, 
  FileText, 
  Eye, 
  User, 
  Building, 
  MapPin, 
  Clock, 
  Tag 
} from 'lucide-react';

const ReportsPage = ({ mode = "generate" }) => {
  const navigate = useNavigate();
  const { employees, isLoading: loadingEmployees } = useEmployees();
  const { visitorArea, isLoading: loadingAreas } = useVisitorArea();

  const [passes, setPasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Filters State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [passType, setPassType] = useState('All'); // For today's report
  const [searchId, setSearchId] = useState(''); // For today's report

  // Set default dates on mount (for generate mode)
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  // Fetch passes by date range
  const fetchPassesData = async (start, end) => {
    setIsLoading(true);
    setError('');

    try {
      let queryParams = [];
      if (start) queryParams.push(`startDate=${start}`);
      if (end) queryParams.push(`endDate=${end}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const response = await queryGet(`/capture${queryString}`, {}, { cache: true, ttlMs: 10000 });

      if (response.data && response.data.data) {
        setPasses(response.data.data);
      } else {
        setPasses([]);
      }
    } catch (err) {
      console.error('Error fetching passes:', err);
      setError('Failed to load gate passes. Please verify database connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch today's report on mount / whenever today mode active
  useEffect(() => {
    if (mode === "today") {
      const todayStr = new Date().toISOString().split('T')[0];
      fetchPassesData(todayStr, todayStr);
    }
  }, [mode]);

  // Click handler to manually generate historical report
  const handleGenerateReport = () => {
    if (mode === "generate") {
      fetchPassesData(startDate, endDate);
    }
  };

  // Resolve Employee Host Name from ID
  const getEmployeeName = (id) => {
    if (!id) return "-";
    const emp = employees.find(e => e._id === id || e.id === id);
    return emp ? emp.name : id;
  };

  // Client-side filtering logic
  const filteredPasses = useMemo(() => {
    return passes.filter(pass => {
      // 1. Status Filter
      if (status !== 'All' && pass.status !== status) {
        return false;
      }

      // 2. Employee Host Filter
      if (selectedEmployee !== 'All' && pass.toMeetWith !== selectedEmployee) {
        return false;
      }

      // 3. Visiting Area Filter
      if (selectedArea !== 'All') {
        const areaName = selectedArea.toLowerCase();
        const hasArea = Array.isArray(pass.visitArea) 
          ? pass.visitArea.some(a => a.toLowerCase() === areaName)
          : typeof pass.visitArea === 'string' && pass.visitArea.toLowerCase() === areaName;
        
        if (!hasArea) return false;
      }

      // 4. Pass Type (Single / Multi) Filter - for today's report
      if (mode === "today" && passType !== 'All') {
        if (passType === 'single' && pass.gatePassType !== 'single') return false;
        if (passType === 'multi' && pass.gatePassType !== 'multi') return false;
      }

      // 5. Search by ID / Name - for today's report
      if (mode === "today" && searchId.trim() !== '') {
        const search = searchId.toLowerCase().trim();
        const matchId = pass.gatePassId && pass.gatePassId.toLowerCase().includes(search);
        const matchName = pass.name && pass.name.toLowerCase().includes(search);
        if (!matchId && !matchName) return false;
      }

      return true;
    });
  }, [passes, status, selectedEmployee, selectedArea, passType, searchId, mode]);

  // Export CSV Handler
  const handleExportCSV = () => {
    if (filteredPasses.length === 0) return;

    const headers = ['ID', 'Visitor Name', 'Mobile No', 'Email', 'Company', 'Purpose', 'Status', 'Date Created', 'Host Employee', 'Allowed Visiting Areas'];
    const csvContent = [
      headers.join(','),
      ...filteredPasses.map(p => [
        p.gatePassId || p.id,
        `"${p.name}"`,
        `"${p.mobileNo}"`,
        `"${p.emailId || ''}"`,
        `"${p.companyName || ''}"`,
        `"${p.purpose || ''}"`,
        p.status,
        new Date(p.createdAt).toLocaleString(),
        `"${getEmployeeName(p.toMeetWith)}"`,
        `"${Array.isArray(p.visitArea) ? p.visitArea.join(', ') : p.visitArea || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VMS_report_${mode === 'today' ? 'today' : startDate + '_to_' + endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Panel */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#0f172a',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            letterSpacing: '-0.025em'
          }}>
            <FileText className="dashboard-icon" style={{ width: '28px', height: '28px', color: '#0f766e' }} />
            {mode === "generate" ? "Generate Historical Report" : "Today's Live Report"}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.35rem 0 0 0', fontWeight: '500' }}>
            {mode === "generate" 
              ? "Query, filter, and extract VMS historical data records." 
              : "Monitor today's active gate passes and group them interactively."}
          </p>
        </div>

        <div>
          <Button
            onClick={handleExportCSV}
            disabled={filteredPasses.length === 0 || isLoading}
            style={{
              backgroundColor: filteredPasses.length === 0 ? '#cbd5e1' : '#0f766e',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              border: 'none',
              cursor: filteredPasses.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <Download size={16} /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          alignItems: 'end'
        }}>
          {/* Mode Generate Inputs */}
          {mode === "generate" && (
            <>
              <div>
                <label style={labelStyle}>Start Date</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={inputStyle}
                  />
                  <Calendar size={16} style={iconStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>End Date</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={inputStyle}
                  />
                  <Calendar size={16} style={iconStyle} />
                </div>
              </div>
            </>
          )}

          {/* Mode Today Lock Indicator */}
          {mode === "today" && (
            <div>
              <label style={labelStyle}>Reporting Period</label>
              <div style={{
                height: '2.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #cbd5e1',
                padding: '0 0.75rem',
                fontSize: '0.9rem',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                boxSizing: 'border-box'
              }}>
                <Clock size={16} style={{ color: '#0f766e' }} />
                <span>Today ({new Date().toLocaleDateString()})</span>
              </div>
            </div>
          )}

          {/* Find by ID/Name Search - for Today mode */}
          {mode === "today" && (
            <div>
              <label style={labelStyle}>Search Visitor / Pass ID</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Enter ID or Visitor Name..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  style={inputStyle}
                />
                <Search size={16} style={iconStyle} />
              </div>
            </div>
          )}

          {/* Host Employee Select */}
          <div>
            <label style={labelStyle}>Host Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              disabled={loadingEmployees}
              style={selectStyle}
            >
              <option value="All">All Employees</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {/* Visiting Area Select */}
          <div>
            <label style={labelStyle}>Visiting Area</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              disabled={loadingAreas}
              style={selectStyle}
            >
              <option value="All">All Visiting Areas</option>
              {visitorArea.map(area => (
                <option key={area._id || area.id} value={area.name}>{area.name}</option>
              ))}
            </select>
          </div>

          {/* Pass Type (Single / Multi) Select - for Today mode */}
          {mode === "today" && (
            <div>
              <label style={labelStyle}>Pass Type</label>
              <select
                value={passType}
                onChange={(e) => setPassType(e.target.value)}
                style={selectStyle}
              >
                <option value="All">All Types</option>
                <option value="single">Single Day Pass</option>
                <option value="multi">Multi Day Pass</option>
              </select>
            </div>
          )}

          {/* Status Select */}
          <div>
            <label style={labelStyle}>Pass Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={selectStyle}
            >
              <option value="All">All Statuses</option>
              <option value="Requested">Requested</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Checked-In">Checked-In</option>
              <option value="Checked-Out">Checked-Out</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Generate Button - only visible for generate mode */}
          {mode === "generate" && (
            <Button
              onClick={handleGenerateReport}
              disabled={isLoading}
              style={{
                backgroundColor: '#0f766e',
                color: '#ffffff',
                height: '2.5rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(15, 118, 110, 0.2)'
              }}
            >
              <Search size={16} /> Generate Report
            </Button>
          )}
        </div>
      </div>

      {/* Results Notification / Table */}
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

      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
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
                <th style={thStyle}>ID / Type</th>
                <th style={thStyle}>Visitor Info</th>
                <th style={thStyle}>Company & Purpose</th>
                <th style={thStyle}>Host / Areas</th>
                <th style={thStyle}>Date of Create</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        border: '3px solid #cbd5e1',
                        borderTopColor: '#0f766e',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      <span style={{ color: '#64748b', fontWeight: '500' }}>Loading passes...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPasses.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '4rem 1.5rem', color: '#94a3b8' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <Search size={32} style={{ color: '#cbd5e1' }} />
                      <span style={{ fontSize: '1rem', fontWeight: '700', color: '#64748b' }}>No gate passes found</span>
                      <span style={{ fontSize: '0.8rem' }}>
                        {mode === "generate" 
                          ? "Make sure you generated the report for dates containing records."
                          : "No passes match current filter specifications."}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPasses.map((pass) => {
                  const isMulti = pass.gatePassType === 'multi';
                  const statusColors = getStatusBadgeColors(pass.status);
                  
                  return (
                    <tr 
                      key={pass.id} 
                      style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* ID & Type */}
                      <td style={tdStyle}>
                        <div style={{ fontWeight: '700', color: '#0f766e' }}>
                          {pass.gatePassId || pass.id.substring(0, 8)}
                        </div>
                        <div style={{ marginTop: '0.25rem' }}>
                          <span style={{
                            padding: '0.15rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            backgroundColor: isMulti ? '#ede9fe' : '#e0f2fe',
                            color: isMulti ? '#5b21b6' : '#0369a1'
                          }}>
                            {isMulti ? "Multi Day" : "Single Day"}
                          </span>
                        </div>
                      </td>

                      {/* Visitor Info */}
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <User size={14} style={{ color: '#64748b' }} />
                          <strong style={{ color: '#1e293b' }}>{pass.name}</strong>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                          📞 {pass.mobileNo}
                        </div>
                        {pass.emailId && (
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.1rem' }}>
                            ✉️ {pass.emailId}
                          </div>
                        )}
                      </td>

                      {/* Company & Purpose */}
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Building size={14} style={{ color: '#64748b' }} />
                          <span style={{ color: '#334155', fontWeight: '500' }}>{pass.companyName || "-"}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', whiteSpace: 'normal', maxWidth: '200px' }}>
                          {pass.purpose || "-"}
                        </div>
                      </td>

                      {/* Host / Visiting Areas */}
                      <td style={tdStyle}>
                        <div>
                          Host: <strong style={{ color: '#0f172a' }}>{getEmployeeName(pass.toMeetWith)}</strong>
                        </div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: '#0d9488', 
                          marginTop: '0.25rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.25rem',
                          whiteSpace: 'normal',
                          maxWidth: '220px'
                        }}>
                          <MapPin size={12} />
                          <span>
                            {Array.isArray(pass.visitArea) 
                              ? pass.visitArea.join(', ') 
                              : pass.visitArea || 'No areas set'}
                          </span>
                        </div>
                      </td>

                      {/* Date of Create */}
                      <td style={tdStyle}>
                        <div style={{ fontWeight: '500', color: '#334155' }}>
                          {new Date(pass.createdAt).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                          {new Date(pass.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={tdStyle}>
                        <span style={{
                          padding: '0.25rem 0.625rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: statusColors.bg,
                          color: statusColors.text,
                          textTransform: 'uppercase'
                        }}>
                          {pass.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <button
                          onClick={() => navigate(`/pass/${pass.id}/action?mode=view`)}
                          style={{
                            backgroundColor: '#0f766e',
                            color: '#ffffff',
                            borderRadius: '0.375rem',
                            padding: '0 0.85rem',
                            height: '2rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                            transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                          onMouseLeave={(e) => e.target.style.opacity = '1'}
                        >
                          <Eye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Total Records Footer summary */}
        {!isLoading && filteredPasses.length > 0 && (
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            fontSize: '0.85rem',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>
              Total records matched: <strong style={{ color: '#0f172a' }}>{filteredPasses.length}</strong>
            </span>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#def7ec', border: '1px solid #86efac' }}></span>
                Approved: {filteredPasses.filter(p => p.status === 'Approved').length}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e1f5fe', border: '1px solid #0288d1' }}></span>
                Inside: {filteredPasses.filter(p => p.status === 'Checked-In').length}
              </span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// --- REUSABLE CSS PROPS ---

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: '700',
  color: '#475569',
  marginBottom: '0.375rem',
  textTransform: 'uppercase',
  letterSpacing: '0.025em'
};

const inputStyle = {
  width: '100%',
  height: '2.5rem',
  borderRadius: '0.375rem',
  border: '1px solid #cbd5e1',
  padding: '0 2.25rem 0 0.75rem',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: '#f8fafc',
  transition: 'border-color 0.15s ease'
};

const iconStyle = {
  position: 'absolute',
  right: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#94a3b8',
  pointerEvents: 'none'
};

const selectStyle = {
  width: '100%',
  height: '2.5rem',
  borderRadius: '0.375rem',
  border: '1px solid #cbd5e1',
  padding: '0 0.5rem',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: '#ffffff'
};

const thStyle = {
  padding: '0.875rem 1.25rem',
  fontSize: '0.75rem',
  fontWeight: '700',
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const tdStyle = {
  padding: '0.875rem 1.25rem',
  verticalAlign: 'middle'
};

// Color mapper for statuses
const getStatusBadgeColors = (status) => {
  switch (status) {
    case 'Approved':
      return { bg: '#def7ec', text: '#03543f' };
    case 'Pending':
      return { bg: '#fef3c7', text: '#92400e' };
    case 'Requested':
      return { bg: '#e0f2fe', text: '#075985' };
    case 'Checked-In':
      return { bg: '#e1f5fe', text: '#0288d1' };
    case 'Checked-Out':
      return { bg: '#f3f4f6', text: '#374151' };
    default:
      return { bg: '#fee2e2', text: '#9b1c1c' };
  }
};

export default ReportsPage;
