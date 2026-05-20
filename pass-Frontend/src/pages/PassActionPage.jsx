/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { queryGet, queryPatch } from "@/shared/services/api";
import { useEmployees } from "@/features/employee/useEmployee";
import { useLocationUtils } from "@/shared/hooks/useLocation";

export default function PassActionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "view"; // "review-request", "approve", "view"

  const [passData, setPassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load employee choices for request review mode
  const { employees } = useEmployees();
  const { states, cities, setSelectedState } = useLocationUtils();

  // Fetch gate pass data
  const fetchPassData = async () => {
    try {
      setIsLoading(true);
      const res = await queryGet(`/capture/${id}`);
      if (res.data && res.data.data) {
        setPassData(res.data.data);
        if (res.data.data.state) {
          setSelectedState(res.data.data.state);
        }
      } else {
        setError("Pass not found.");
      }
    } catch (err) {
      console.error("Error fetching pass data:", err);
      setError("Failed to fetch pass details. Check backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPassData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Form field state change handler for "review-request" mode
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setPassData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for state transitions
  const handleSubmitAction = async (status, isRejection = false) => {
    let rejectionReason = "";
    if (isRejection) {
      rejectionReason = prompt("Please enter the reason for rejection:");
      if (rejectionReason === null) return; // user cancelled prompt
      if (!rejectionReason.trim()) {
        alert("Rejection reason is required.");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      
      const payload = { status };
      if (isRejection) {
        payload.rejectionReason = rejectionReason.trim();
        payload.rejectedBy = "System Admin";
      }

      // If in review-request mode and moving to Pending, we also save the edited data
      if (mode === "review-request" && status === "Pending") {
        Object.assign(payload, {
          name: passData.name,
          mobileNo: passData.mobileNo,
          emailId: passData.emailId,
          companyName: passData.companyName,
          address: passData.address,
          state: passData.state,
          city: passData.city,
          representingVisitorType: passData.representingVisitorType,
          subLocation: passData.subLocation,
          toMeetWith: passData.toMeetWith,
          allowedHours: passData.allowedHours,
          purpose: passData.purpose,
        });
      }

      if (status === "Approved") {
        payload.approvedBy = "System Admin";
      }

      await queryPatch(`/capture/${id}/status`, payload);
      alert(`Gate pass successfully ${status === "Pending" ? "created" : status.toLowerCase()}!`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Action failed:", err);
      alert(err?.response?.data?.message || "Failed to update gate pass.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="spinner" style={{
          width: '3rem',
          height: '3rem',
          border: '4px solid #e2e8f0',
          borderTopColor: '#0f766e',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ marginTop: '1rem', color: '#64748b', fontWeight: '500' }}>Loading pass details...</span>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !passData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#991b1b' }}>
        <h2>⚠️ Error</h2>
        <p>{error || "Gate pass not found."}</p>
        <button onClick={() => navigate("/dashboard")} className="btn-secondary" style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', borderRadius: '0.375rem', cursor: 'pointer' }}>Back to Dashboard</button>
      </div>
    );
  }

  const backendHost = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1").replace("/api/v1", "");
  const photoUrl = passData.photoUrl ? `${backendHost}${passData.photoUrl}` : "";

  // Helper to color-code status badge
  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved": return { bg: '#def7ec', text: '#03543f' };
      case "Pending": return { bg: '#fef3c7', text: '#92400e' };
      case "Requested": return { bg: '#e0f2fe', text: '#075985' };
      case "Checked-In": return { bg: '#e1f5fe', text: '#0288d1' };
      case "Checked-Out": return { bg: '#f3f4f6', text: '#374151' };
      case "Rejected": return { bg: '#fee2e2', text: '#9b1c1c' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const statusStyle = getStatusStyle(passData.status);
  const isEditable = mode === "review-request";

  return (
    <div style={{
      maxWidth: '65rem',
      margin: '2rem auto',
      padding: '0 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Back to Dashboard Link */}
      <button 
        onClick={() => navigate("/dashboard")}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'none',
          border: 'none',
          color: '#0f766e',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          fontSize: '0.95rem'
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Main card */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '1rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden'
      }}>
        {/* Header Section */}
        <div style={{
          padding: '2rem',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.025em' }}>
                Review Gate Pass
              </h1>
              <span style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: '700',
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
                textTransform: 'uppercase'
              }}>
                {passData.status}
              </span>
            </div>
            <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
              ID: <strong style={{ color: '#0f766e' }}>{passData.gatePassId || passData.id}</strong> (Short Code: {passData.gatePassId || "-"})
            </p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <span style={{
              fontSize: '0.75rem',
              color: '#64748b',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Pass Type
            </span>
            <div style={{
              marginTop: '0.25rem',
              backgroundColor: passData.gatePassType === 'single' ? '#e0f2fe' : '#ede9fe',
              color: passData.gatePassType === 'single' ? '#0369a1' : '#6d28d9',
              padding: '0.35rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: '700',
              fontSize: '0.875rem',
              display: 'inline-block'
            }}>
              {passData.gatePassType === 'single' ? 'Single Day' : 'Multi Day'}
            </div>
          </div>
        </div>

        {/* Content body */}
        <div style={{ padding: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {/* Form Fields Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Personal Section */}
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: '700', color: '#0f766e', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  Personal Details
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Visitor Name</label>
                    {isEditable ? (
                      <input type="text" name="name" value={passData.name || ""} onChange={handleFieldChange} style={inputStyle} />
                    ) : (
                      <div style={detailValueStyle}>{passData.name || "-"}</div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Mobile No</label>
                      {isEditable ? (
                        <input type="text" name="mobileNo" value={passData.mobileNo || ""} onChange={handleFieldChange} style={inputStyle} />
                      ) : (
                        <div style={detailValueStyle}>{passData.mobileNo || "-"}</div>
                      )}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Email Address</label>
                      {isEditable ? (
                        <input type="email" name="emailId" value={passData.emailId || ""} onChange={handleFieldChange} style={inputStyle} />
                      ) : (
                        <div style={detailValueStyle}>{passData.emailId || "-"}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Company Name</label>
                    {isEditable ? (
                      <input type="text" name="companyName" value={passData.companyName || ""} onChange={handleFieldChange} style={inputStyle} />
                    ) : (
                      <div style={detailValueStyle}>{passData.companyName || "-"}</div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Address</label>
                    {isEditable ? (
                      <textarea name="address" value={passData.address || ""} onChange={handleFieldChange} style={{ ...inputStyle, height: '60px', resize: 'vertical' }} />
                    ) : (
                      <div style={{ ...detailValueStyle, whiteSpace: 'pre-wrap' }}>{passData.address || "-"}</div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>State</label>
                      {isEditable ? (
                        <select name="state" value={passData.state || ""} onChange={(e) => {
                          setSelectedState(e.target.value);
                          setPassData(prev => ({ ...prev, state: e.target.value, city: "" }));
                        }} style={inputStyle}>
                          <option value="">Select State</option>
                          {states.map((s, idx) => (
                            <option key={idx} value={s.isoCode}>{s.name}</option>
                          ))}
                        </select>
                      ) : (
                        <div style={detailValueStyle}>{passData.state || "-"}</div>
                      )}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>City</label>
                      {isEditable ? (
                        <select name="city" value={passData.city || ""} onChange={handleFieldChange} disabled={!passData.state} style={inputStyle}>
                          <option value="">Select City</option>
                          {cities.map((c, idx) => (
                            <option key={idx} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      ) : (
                        <div style={detailValueStyle}>{passData.city || "-"}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Visit Information Section */}
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: '700', color: '#0f766e', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  Visit Details
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Visitor Type</label>
                      {isEditable ? (
                        <input type="text" name="representingVisitorType" value={passData.representingVisitorType || ""} onChange={handleFieldChange} style={inputStyle} />
                      ) : (
                        <div style={detailValueStyle}>{passData.representingVisitorType || "-"}</div>
                      )}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>To Meet Employee</label>
                      {isEditable ? (
                        <select name="toMeetWith" value={passData.toMeetWith || ""} onChange={handleFieldChange} style={inputStyle}>
                          <option value="">Select Employee</option>
                          {employees.map((e, idx) => (
                            <option key={idx} value={e._id}>{e.name}</option>
                          ))}
                        </select>
                      ) : (
                        <div style={detailValueStyle}>{employees.find(e => e._id === passData.toMeetWith)?.name || passData.toMeetWith || "-"}</div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Sub Location</label>
                      {isEditable ? (
                        <input type="text" name="subLocation" value={passData.subLocation || ""} onChange={handleFieldChange} style={inputStyle} />
                      ) : (
                        <div style={detailValueStyle}>{passData.subLocation || "-"}</div>
                      )}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Allowed Hours</label>
                      {isEditable ? (
                        <input type="text" name="allowedHours" value={passData.allowedHours || ""} onChange={handleFieldChange} style={inputStyle} />
                      ) : (
                        <div style={detailValueStyle}>{passData.allowedHours ? `${passData.allowedHours} hrs` : "-"}</div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>ID Type</label>
                      <div style={detailValueStyle}>{passData.idType || "-"}</div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>ID Number</label>
                      <div style={detailValueStyle}>{passData.idNumber || "-"}</div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>Purpose</label>
                    {isEditable ? (
                      <input type="text" name="purpose" value={passData.purpose || ""} onChange={handleFieldChange} style={inputStyle} />
                    ) : (
                      <div style={detailValueStyle}>{passData.purpose || "-"}</div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Photo & Audit Timeline Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Visitor Photo Card */}
              <div style={{
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                padding: '1.25rem',
                backgroundColor: '#f8fafc',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#475569', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Visitor Photo Capture
                </h4>
                {photoUrl ? (
                  <img 
                    src={photoUrl} 
                    alt="Captured Visitor" 
                    style={{
                      width: '100%',
                      maxHeight: '260px',
                      objectFit: 'cover',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }} 
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#cbd5e1',
                    borderRadius: '0.5rem',
                    color: '#64748b',
                    fontWeight: '500'
                  }}>
                    No Image Captured
                  </div>
                )}
              </div>

              {/* Carry With & Visit Area Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>Carry With</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {Array.isArray(passData.carryWith) && passData.carryWith.length > 0 ? (
                      passData.carryWith.map((item, idx) => (
                        <span key={idx} style={badgeStyle}>{item}</span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>None</span>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>Allowed Visit Areas</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {Array.isArray(passData.visitArea) && passData.visitArea.length > 0 ? (
                      passData.visitArea.map((item, idx) => (
                        <span key={idx} style={{ ...badgeStyle, backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>{item}</span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>None</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Audit Timeline */}
              <div style={{
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                padding: '1.5rem',
                backgroundColor: '#ffffff'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '700', color: '#0f766e' }}>
                  Pass Lifecycle & Audits
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                  {/* Vertical bar */}
                  <div style={{
                    position: 'absolute',
                    left: '11px',
                    top: '8px',
                    bottom: '8px',
                    width: '2px',
                    backgroundColor: '#e2e8f0',
                    zIndex: 1
                  }} />

                  <TimelineNode 
                    title="Created / Requested" 
                    time={passData.createdAt ? new Date(passData.createdAt).toLocaleString() : "-"} 
                    desc={`Pass requested for date: ${new Date(passData.passDate).toLocaleDateString()}`}
                    active={true}
                  />

                  {passData.status === "Rejected" ? (
                    <TimelineNode 
                      title="Rejected" 
                      time={passData.rejectedAt ? new Date(passData.rejectedAt).toLocaleString() : "-"} 
                      desc={`Rejected by: ${passData.rejectedBy || "Admin"}`}
                      subDesc={`Reason: "${passData.rejectionReason || "No reason provided"}"`}
                      active={true}
                      isError={true}
                    />
                  ) : (
                    <>
                      <TimelineNode 
                        title="Approved" 
                        time={passData.approvedAt ? new Date(passData.approvedAt).toLocaleString() : "-"} 
                        desc={passData.approvedAt ? `Approved by: ${passData.approvedBy || "Admin"}` : "Awaiting approval"}
                        active={!!passData.approvedAt}
                      />

                      <TimelineNode 
                        title="Checked-In" 
                        time={passData.checkedInAt ? new Date(passData.checkedInAt).toLocaleString() : "-"} 
                        desc={passData.checkedInAt ? `Checked in by: ${passData.checkedInBy || "Security"}` : "Not checked in yet"}
                        active={!!passData.checkedInAt}
                      />

                      <TimelineNode 
                        title="Checked-Out" 
                        time={passData.checkedOutAt ? new Date(passData.checkedOutAt).toLocaleString() : "-"} 
                        desc={passData.checkedOutAt ? `Checked out by: ${passData.checkedOutBy || "Security"}` : "Not checked out yet"}
                        active={!!passData.checkedOutAt}
                      />
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Additional Accompanying Persons Section */}
          {Array.isArray(passData.persons) && passData.persons.length > 0 && (
            <div style={{ marginTop: '2.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '700', color: '#0f766e', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                Accompanying Visitors ({passData.persons.length})
              </h3>
              
              <div style={{
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                backgroundColor: '#ffffff'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#475569' }}>Name</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#475569' }}>Phone No</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#475569' }}>Aadhar Number</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#475569', textAlign: 'center' }}>Identity File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passData.persons.map((person, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 1rem', color: '#1f2937', fontWeight: '500' }}>{person.name || "-"}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#4b5563' }}>{person.phoneNo || "-"}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#4b5563' }}>{person.aadharNumber || "-"}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          {person.aadharFileUrl ? (
                            <a 
                              href={`${backendHost}${person.aadharFileUrl}`} 
                              target="_blank" 
                              rel="noreferrer"
                              style={{
                                color: '#0f766e',
                                fontWeight: '600',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              📄 View File
                            </a>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>No File</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Footer Panel */}
          <div style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            
            {/* Back Button always present */}
            <button 
              onClick={() => navigate("/dashboard")} 
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                fontWeight: '600',
                padding: '0.625rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
            >
              Cancel
            </button>

            {/* Mode 1: review-request action buttons */}
            {mode === "review-request" && passData.status === "Requested" && (
              <>
                <button 
                  onClick={() => handleSubmitAction("Rejected", true)}
                  disabled={isSubmitting}
                  style={{ ...buttonBaseStyle, backgroundColor: '#dc2626', color: '#ffffff' }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Reject Request
                </button>
                <button 
                  onClick={() => handleSubmitAction("Pending")}
                  disabled={isSubmitting}
                  style={{ ...buttonBaseStyle, backgroundColor: '#0f766e', color: '#ffffff' }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  {isSubmitting ? "Processing..." : "Create Pass & Queue for Approval"}
                </button>
              </>
            )}

            {/* Mode 2: approve action buttons */}
            {mode === "approve" && passData.status === "Pending" && (
              <>
                <button 
                  onClick={() => handleSubmitAction("Rejected", true)}
                  disabled={isSubmitting}
                  style={{ ...buttonBaseStyle, backgroundColor: '#dc2626', color: '#ffffff' }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Reject Pass
                </button>
                <button 
                  onClick={() => handleSubmitAction("Approved")}
                  disabled={isSubmitting}
                  style={{ ...buttonBaseStyle, backgroundColor: '#10b981', color: '#ffffff' }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  {isSubmitting ? "Approving..." : "Approve Pass"}
                </button>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

// --- SLEEK CSS STYLES ---

const inputStyle = {
  width: '100%',
  height: '2.5rem',
  borderRadius: '0.375rem',
  border: '1px solid #cbd5e1',
  padding: '0 0.75rem',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
  backgroundColor: '#f8fafc'
};

const detailValueStyle = {
  padding: '0.625rem 0.875rem',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '0.375rem',
  fontSize: '0.9rem',
  fontWeight: '500',
  color: '#334155',
  boxSizing: 'border-box'
};

const badgeStyle = {
  fontSize: '0.75rem',
  backgroundColor: '#f1f5f9',
  color: '#475569',
  border: '1px solid #cbd5e1',
  padding: '0.25rem 0.5rem',
  borderRadius: '0.25rem',
  fontWeight: '600'
};

const buttonBaseStyle = {
  border: 'none',
  fontWeight: '700',
  padding: '0.625rem 1.5rem',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  fontSize: '0.9rem',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  transition: 'opacity 0.15s'
};

// --- TIMELINE COMPONENT ---
function TimelineNode({ title, time, desc, subDesc, active, isError }) {
  const iconBg = active ? (isError ? '#fee2e2' : '#dcfce7') : '#f1f5f9';
  const iconColor = active ? (isError ? '#dc2626' : '#166534') : '#94a3b8';
  const iconBorder = active ? (isError ? '2px solid #fca5a5' : '2px solid #86efac') : '2px solid #cbd5e1';

  return (
    <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 2 }}>
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: iconBg,
        border: iconBorder,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        color: iconColor,
        fontWeight: 'bold',
        flexShrink: 0
      }}>
        {active ? (isError ? "✗" : "✓") : "•"}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: '700', color: active ? '#0f172a' : '#64748b' }}>
            {title}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>
            {time}
          </span>
        </div>
        <span style={{ fontSize: '0.8rem', color: active ? '#475569' : '#94a3b8', fontWeight: '500' }}>
          {desc}
        </span>
        {subDesc && (
          <span style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: '600', marginTop: '0.1rem' }}>
            {subDesc}
          </span>
        )}
      </div>
    </div>
  );
}
