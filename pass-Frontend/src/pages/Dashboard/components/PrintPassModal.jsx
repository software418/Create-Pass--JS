import { useState, useEffect } from "react";
import { useEmployees } from "@/features/employee/useEmployee";
import { Printer, X, ShieldAlert } from "lucide-react";

const DEFAULT_PRINT_SETTINGS = {
  showPassType: true,
  showGatePassId: true,
  showPassDate: true,
  showAllowedHours: true,
  showName: true,
  showEmployee: true,
  showMobileNo: true,
  showEmailId: true,
  showCompanyName: true,
  showPurpose: true,
  showVisitArea: true,
  showPhoto: true,
  showAccompanyingPersons: true,
  paperSize: "Card", // "Card", "Thermal", "A4"
  orientation: "Portrait", // "Portrait", "Landscape"
  colorTheme: "dark", // "dark", "teal", "blue", "emerald"
  showBorders: true,
  bottomInstructions: "1. Please wear this badge visibly at all times within the facility.\n2. This pass is non-transferable and valid only for authorized areas.\n3. Return this pass to the security desk upon check-out.\n4. In case of emergency, follow instructions of safety wardens.",
};

const THEME_COLORS = {
  dark: { primary: "#000000", secondary: "#374151", bgLight: "#f3f4f6", text: "#000000" },
  teal: { primary: "#0f766e", secondary: "#134e4a", bgLight: "#f0fdfa", text: "#0f766e" },
  blue: { primary: "#1e3a8a", secondary: "#1e40af", bgLight: "#f0f9ff", text: "#1e3a8a" },
  emerald: { primary: "#064e3b", secondary: "#065f46", bgLight: "#f0fdf4", text: "#064e3b" },
};

export const PrintPassModal = ({ isOpen, onClose, passData }) => {
  const [printSettings, setPrintSettings] = useState(DEFAULT_PRINT_SETTINGS);
  const { employees } = useEmployees();

  // Load configuration from local storage
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("vms_print_settings");
      if (saved) {
        try {
          setPrintSettings({ ...DEFAULT_PRINT_SETTINGS, ...JSON.parse(saved) });
        } catch (e) {
          console.error("Failed to parse print settings from localStorage", e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen || !passData) return null;

  const activeColor = THEME_COLORS[printSettings.colorTheme] || THEME_COLORS.teal;
  const backendHost = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1").replace("/api/v1", "");
  const photoUrl = passData.photoUrl ? `${backendHost}${passData.photoUrl}` : "";

  const getEmployeeName = (id) => {
    if (!id) return "-";
    const emp = employees.find((e) => e._id === id || e.id === id);
    return emp ? emp.name : id;
  };

  const handlePrint = () => {
    window.print();
  };

  const getPassStyle = () => {
    const isThermal = printSettings.paperSize === "Thermal";
    const isA4 = printSettings.paperSize === "A4";

    return {
      width: isThermal ? "300px" : isA4 ? "100%" : "440px",
      minHeight: isThermal ? "450px" : isA4 ? "320px" : "280px",
      border: printSettings.showBorders ? "2px solid #000000" : "1px solid #000000",
      borderRadius: isThermal ? "0" : isA4 ? "4px" : "4px",
      backgroundColor: "#ffffff",
      padding: isThermal ? "1rem 0.75rem" : "1.5rem",
      boxShadow: "none",
      boxSizing: "border-box",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      color: "#000000",
    };
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      {/* Styles for direct print filtering */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
            background-color: transparent !important;
            box-shadow: none !important;
          }
          
          #printable-modal-pass-frame, #printable-modal-pass-frame * {
            visibility: visible !important;
          }
          
          #printable-modal-pass-frame {
            position: absolute !important;
            left: 50% !important;
            top: 50px !important;
            transform: translateX(-50%) !important;
            width: ${printSettings.paperSize === 'Thermal' ? '300px' : printSettings.paperSize === 'A4' ? '100%' : '440px'} !important;
            border: ${printSettings.showBorders ? `3px solid ${activeColor.primary}` : '1px solid #000000'} !important;
            box-shadow: none !important;
            padding: 2rem !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Printer size={20} style={{ color: activeColor.primary }} />
            <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "1.1rem" }}>
              Access Pass Printer Preview
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.25rem",
              borderRadius: "0.25rem",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e2e8f0")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center", flex: 1 }}>
          
          {/* Printable Frame Container */}
          <div id="printable-modal-pass-frame" style={getPassStyle()}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `2px solid ${activeColor.primary}20`,
                paddingBottom: "0.75rem",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800", color: activeColor.primary }}>
                  FACILITY ACCESS PASS
                </h2>
                <div style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>
                  Visitor Control Center
                </div>
              </div>

              {printSettings.showPassType && (
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "800",
                    backgroundColor: activeColor.bgLight,
                    color: activeColor.primary,
                    padding: "0.2rem 0.625rem",
                    borderRadius: "0.25rem",
                    textTransform: "uppercase",
                  }}
                >
                  {passData.gatePassType === "single" ? "Single Day" : "Multi Day"}
                </span>
              )}
            </div>

            {/* Body Content */}
            <div style={{ display: "flex", gap: "1.25rem", flex: 1, flexDirection: printSettings.orientation === "Landscape" ? "row" : "column" }}>
              
              {/* Photo Section */}
              {printSettings.showPhoto && (
                <div
                  style={{
                    width: "100px",
                    height: "115px",
                    borderRadius: "0.375rem",
                    border: `1px solid ${activeColor.primary}30`,
                    backgroundColor: "#f1f5f9",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                    fontSize: "0.55rem",
                    fontWeight: "700",
                    alignSelf: printSettings.orientation === "Landscape" ? "flex-start" : "center",
                    overflow: "hidden",
                  }}
                >
                  {photoUrl ? (
                    <img src={photoUrl} alt="Visitor" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", color: "#fff", fontWeight: "800", marginBottom: "4px" }}>
                        {passData.name ? passData.name.substring(0, 2).toUpperCase() : "VI"}
                      </div>
                      NO PHOTO
                    </>
                  )}
                </div>
              )}

              {/* Details list */}
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem", fontSize: "0.825rem" }}>
                
                {printSettings.showGatePassId && (
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ color: "#64748b", width: "110px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase" }}>Pass ID:</span>
                    <strong style={{ color: activeColor.primary, fontSize: "0.9rem" }}>{passData.gatePassId || "-"}</strong>
                  </div>
                )}

                {printSettings.showName && (
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ color: "#64748b", width: "110px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase" }}>Visitor Name:</span>
                    <strong style={{ color: "#0f172a" }}>{passData.name}</strong>
                  </div>
                )}

                {printSettings.showMobileNo && (
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ color: "#64748b", width: "110px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase" }}>Mobile No:</span>
                    <span>{passData.mobileNo}</span>
                  </div>
                )}

                {printSettings.showEmailId && passData.emailId && (
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ color: "#64748b", width: "110px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase" }}>Email-Id:</span>
                    <span>{passData.emailId}</span>
                  </div>
                )}

                {printSettings.showCompanyName && passData.companyName && (
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ color: "#64748b", width: "110px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase" }}>Company Name:</span>
                    <span style={{ color: "#334155", fontWeight: "500" }}>{passData.companyName}</span>
                  </div>
                )}

                {printSettings.showEmployee && (
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ color: "#64748b", width: "110px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase" }}>Host Employee:</span>
                    <span style={{ fontWeight: "600", color: "#1e293b" }}>{getEmployeeName(passData.toMeetWith)}</span>
                  </div>
                )}

                {printSettings.showVisitArea && (
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ color: "#64748b", width: "110px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase" }}>Allowed Areas:</span>
                    <span style={{ color: activeColor.primary, fontWeight: "700" }}>
                      {Array.isArray(passData.visitArea) ? passData.visitArea.join(", ") : passData.visitArea || "N/A"}
                    </span>
                  </div>
                )}

                {printSettings.showPurpose && (
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ color: "#64748b", width: "110px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase" }}>Purpose:</span>
                    <span>{passData.purpose || "General Meeting"}</span>
                  </div>
                )}

                {printSettings.showAllowedHours && passData.allowedHours && (
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ color: "#64748b", width: "110px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase" }}>Timer Limit:</span>
                    <span style={{ backgroundColor: "#fffbeb", border: "1px solid #fef3c7", padding: "0.15rem 0.5rem", borderRadius: "0.25rem", color: "#b45309", fontWeight: "700" }}>
                      {passData.allowedHours} Hours
                    </span>
                  </div>
                )}

                {printSettings.showPassDate && (
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    <span style={{ color: "#64748b", width: "110px", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase" }}>Pass Date:</span>
                    <span>{passData.passDate ? new Date(passData.passDate).toLocaleDateString() : new Date(passData.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Accompanying Persons Table */}
            {printSettings.showAccompanyingPersons && passData.persons && passData.persons.length > 0 && (
              <div style={{ border: "1px solid #e2e8f0", borderRadius: "0.375rem", padding: "0.5rem", fontSize: "0.7rem", backgroundColor: "#f8fafc" }}>
                <div style={{ fontWeight: "700", color: "#475569", marginBottom: "0.25rem", textTransform: "uppercase", fontSize: "0.6rem" }}>
                  Accompanying Persons ({passData.persons.length} Total)
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e2e8f0", color: "#64748b", textAlign: "left" }}>
                      <th style={{ padding: "0.15rem", fontSize: "0.55rem", fontWeight: "700" }}>Name</th>
                      <th style={{ padding: "0.15rem", fontSize: "0.55rem", fontWeight: "700" }}>Phone No</th>
                      <th style={{ padding: "0.15rem", fontSize: "0.55rem", fontWeight: "700" }}>Aadhar No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passData.persons.map((person, index) => (
                      <tr key={person.id || index} style={{ borderBottom: index < passData.persons.length - 1 ? "1px dashed #f1f5f9" : "none" }}>
                        <td style={{ padding: "0.2rem 0.15rem", fontWeight: "600" }}>{person.name}</td>
                        <td style={{ padding: "0.2rem 0.15rem" }}>{person.phoneNo || "-"}</td>
                        <td style={{ padding: "0.2rem 0.15rem" }}>{person.aadharNumber || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bottom Instructions */}
            {printSettings.bottomInstructions && (
              <div
                style={{
                  borderTop: `1px dashed ${activeColor.primary}40`,
                  paddingTop: "0.75rem",
                  fontSize: "0.65rem",
                  lineHeight: "1.4",
                  color: "#475569",
                }}
              >
                <div style={{ fontWeight: "700", fontSize: "0.6rem", textTransform: "uppercase", color: activeColor.primary, marginBottom: "0.25rem" }}>
                  Security Directions & Rules:
                </div>
                {printSettings.bottomInstructions.split("\n").map((instruction, idx) => (
                  <div key={idx} style={{ marginBottom: "0.1rem" }}>{instruction}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
              color: "#475569",
              fontSize: "0.85rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "0.375rem",
              border: "none",
              backgroundColor: activeColor.primary,
              color: "#ffffff",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <Printer size={16} /> Print Now
          </button>
        </div>
      </div>
    </div>
  );
};
