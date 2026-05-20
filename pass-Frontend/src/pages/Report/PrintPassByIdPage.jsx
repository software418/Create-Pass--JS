import { useState, useEffect } from "react";
import { queryGet } from "@/shared/services/api";
import { useEmployees } from "@/features/employee/useEmployee";
import { Printer, Search, Loader, ShieldAlert, ArrowLeft, Building, User, MapPin } from "lucide-react";

// Default print configuration
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

export default function PrintPassByIdPage() {
  const [searchId, setSearchId] = useState("");
  const [passData, setPassData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [printSettings, setPrintSettings] = useState(DEFAULT_PRINT_SETTINGS);
  
  const { employees } = useEmployees();

  // Load configuration from local storage
  useEffect(() => {
    const saved = localStorage.getItem("vms_print_settings");
    if (saved) {
      try {
        setPrintSettings({ ...DEFAULT_PRINT_SETTINGS, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to parse print settings from localStorage", e);
      }
    }
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchId.trim()) return;

    setIsLoading(true);
    setError("");
    setPassData(null);

    try {
      const res = await queryGet(`/capture/${searchId.trim()}`);
      if (res.data && res.data.data) {
        setPassData(res.data.data);
      } else {
        setError("No Gate Pass found matching this ID/Short Code.");
      }
    } catch (err) {
      console.error("Failed to fetch pass data:", err);
      setError(err?.response?.data?.message || "Failed to locate Gate Pass. Please check backend connectivity.");
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeName = (id) => {
    if (!id) return "-";
    const emp = employees.find((e) => e._id === id || e.id === id);
    return emp ? emp.name : id;
  };

  const handlePrint = () => {
    window.print();
  };

  const activeColor = THEME_COLORS[printSettings.colorTheme] || THEME_COLORS.teal;
  const backendHost = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1").replace("/api/v1", "");
  const photoUrl = passData?.photoUrl ? `${backendHost}${passData.photoUrl}` : "";

  // Render pass depending on chosen settings
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
    <div style={{ padding: "0 1.5rem 4rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Styles for direct print filtering */}
      <style>{`
        @media print {
          /* Hide everything except the specific printed container */
          body * {
            visibility: hidden;
            background-color: transparent !important;
            box-shadow: none !important;
          }
          
          #printable-gatepass-frame, #printable-gatepass-frame * {
            visibility: visible;
          }
          
          #printable-gatepass-frame {
            position: absolute;
            left: 50%;
            top: 50px;
            transform: translateX(-50%);
            width: ${printSettings.paperSize === 'Thermal' ? '300px' : printSettings.paperSize === 'A4' ? '100%' : '440px'} !important;
            border: ${printSettings.showBorders ? `3px solid ${activeColor.primary}` : '1px solid #000000'} !important;
            box-shadow: none !important;
            padding: 2rem !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* Header Panel */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: "800",
            color: "#0f172a",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            letterSpacing: "-0.025em",
          }}
        >
          <Printer style={{ color: activeColor.primary }} />
          Print Gate Pass by ID
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0.35rem 0 0 0", fontWeight: "500" }}>
          Scan, input, or copy a visitor's Gate Pass ID / Short Code to immediately load and print their facility access badge.
        </p>
      </div>

      {/* Search Input Box */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          marginBottom: "2rem",
        }}
      >
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "280px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: "700",
                color: "#475569",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.025em",
              }}
              htmlFor="searchId"
            >
              Enter Gate Pass ID or Short Code
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                id="searchId"
                placeholder="e.g. A7B8C9 or standard Pass database ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                style={{
                  width: "100%",
                  height: "2.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #cbd5e1",
                  padding: "0 1rem 0 2.5rem",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "#f8fafc",
                  transition: "border-color 0.15s ease",
                }}
              />
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !searchId.trim()}
            style={{
              height: "2.75rem",
              padding: "0 1.5rem",
              borderRadius: "0.375rem",
              backgroundColor: !searchId.trim() ? "#cbd5e1" : activeColor.primary,
              color: "#ffffff",
              border: "none",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: !searchId.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              transition: "opacity 0.2s",
            }}
          >
            {isLoading ? <Loader className="animate-spin" size={16} /> : <Search size={16} />}
            Search Pass
          </button>
        </form>
      </div>

      {/* Main Results View */}
      {isLoading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 0" }}>
          <div
            style={{
              width: "3rem",
              height: "3rem",
              border: "4px solid #e2e8f0",
              borderTopColor: activeColor.primary,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <span style={{ marginTop: "1rem", color: "#64748b", fontWeight: "600" }}>Fetching Gate Pass records...</span>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fee2e2",
            color: "#991b1b",
            padding: "1.25rem",
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <ShieldAlert size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {passData && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "2.5rem", alignItems: "start", flexWrap: "wrap" }}>
          
          {/* Left Column: Pass Card Preview Frame */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "2px dashed #cbd5e1",
              borderRadius: "0.75rem",
              padding: "2rem",
              display: "flex",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            {/* The printable frame container */}
            <div id="printable-gatepass-frame" style={getPassStyle()}>
              
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderBottom: "2px solid #000000",
                  paddingBottom: "0.5rem",
                  marginBottom: "0.75rem",
                  textAlign: "center",
                }}
              >
                <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: "900", color: "#000000", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {passData.companyName ? passData.companyName.toUpperCase() : "FACILITY ACCESS"}
                </h2>
                <div style={{ fontSize: "0.7rem", color: "#1f2937", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.2em", marginTop: "1px" }}>
                  VISITOR GATE PASS
                </div>
                {printSettings.showPassType && (
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: "900",
                      border: "1.5px solid #000000",
                      backgroundColor: "#000000",
                      color: "#ffffff",
                      padding: "0.1rem 0.5rem",
                      borderRadius: "2px",
                      textTransform: "uppercase",
                      marginTop: "0.35rem",
                      letterSpacing: "0.05em"
                    }}
                  >
                    {passData.gatePassType === "single" ? "Single Day Pass" : "Multi Day Pass"}
                  </span>
                )}
              </div>

              {/* Body Content */}
              <div style={{ display: "flex", gap: "1rem", flex: 1, flexDirection: "row" }}>
                
                {/* Photo & QR verification side panel */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", width: "110px", flexShrink: 0 }}>
                  
                  {/* Visitor Photo */}
                  {printSettings.showPhoto && (
                    <div
                      style={{
                        width: "100px",
                        height: "115px",
                        border: "1.5px solid #000000",
                        backgroundColor: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      {photoUrl ? (
                        <img src={photoUrl} alt="Visitor" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%) contrast(1.1)" }} />
                      ) : (
                        <div style={{ textAlign: "center", color: "#000000", fontSize: "0.6rem", fontWeight: "700" }}>
                          <span style={{ fontSize: "1.5rem", display: "block" }}>👤</span>
                          NO PHOTO
                        </div>
                      )}
                    </div>
                  )}

                  {/* High Contrast Monochrome QR code Verification Box */}
                  <div style={{
                    width: "100px",
                    height: "100px",
                    border: "1px solid #000000",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffffff",
                    padding: "0.25rem",
                    boxSizing: "border-box"
                  }}>
                    <svg width="60" height="60" viewBox="0 0 29 29" style={{ shapeRendering: "crispEdges" }}>
                      <path fill="#000000" d="M0 0h9v9H0zm1 1v7h7V1zm8 0h1v1H9zm1 1h1v1h-1zm-1 1h1v1H9zm1 1h1v1h-1zm2-4h9v9h-9zm1 1v7h7V1zm-4 7h1v1H9zm1 0h1v1h-1zm-1 1h1v1H9zm3-1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm-5 2h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm3 0h1v1h-1zm-8 1h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 1h1v1h-1zm2-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 0h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm0 2h9v9h-9zm1 1v7h7V13zm-10 2h1v1h-1zm1 1h1v1h-1zm-1 1h1v1H9zm1 1h1v1h-1zm2-3h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm3 0h1v1h-1zm-8 1h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 1h1v1h-1zm2-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 0h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm2-2h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm3 0h1v1h-1zm-8 1h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 1h1v1h-1zm2-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 0h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm0 2h9v9h-9zm1 1v7h7v-7zm-10 2h1v1h-1zm1 1h1v1h-1zm-1 1h1v1H9zm1 1h1v1h-1zm2-3h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm3 0h1v1h-1zm-8 1h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 1h1v1h-1zm2-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 0h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1z" />
                    </svg>
                    <span style={{ fontSize: "0.45rem", fontWeight: "800", marginTop: "2px", color: "#000000", letterSpacing: "0.05em" }}>VERIFIED</span>
                  </div>
                </div>

                {/* Details list as formal ledger */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", color: "#000000", border: "1px solid #000000" }}>
                    <tbody>
                      {printSettings.showGatePassId && (
                        <tr style={{ borderBottom: "1px solid #000000" }}>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "800", width: "100px", textTransform: "uppercase", fontSize: "0.6rem", borderRight: "1px solid #000000", backgroundColor: "#f3f4f6" }}>PASS ID</td>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "900", fontSize: "0.8rem", letterSpacing: "0.025em" }}>{passData.gatePassId || "-"}</td>
                        </tr>
                      )}
                      {printSettings.showName && (
                        <tr style={{ borderBottom: "1px solid #000000" }}>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "800", textTransform: "uppercase", fontSize: "0.6rem", borderRight: "1px solid #000000", backgroundColor: "#f3f4f6" }}>VISITOR</td>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "900", fontSize: "0.8rem" }}>{passData.name ? passData.name.toUpperCase() : "-"}</td>
                        </tr>
                      )}
                      {printSettings.showCompanyName && passData.companyName && (
                        <tr style={{ borderBottom: "1px solid #000000" }}>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "800", textTransform: "uppercase", fontSize: "0.6rem", borderRight: "1px solid #000000", backgroundColor: "#f3f4f6" }}>REPRESENTING</td>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "800" }}>{passData.companyName.toUpperCase()}</td>
                        </tr>
                      )}
                      {printSettings.showEmployee && (
                        <tr style={{ borderBottom: "1px solid #000000" }}>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "800", textTransform: "uppercase", fontSize: "0.6rem", borderRight: "1px solid #000000", backgroundColor: "#f3f4f6" }}>HOST</td>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "800" }}>{getEmployeeName(passData.toMeetWith).toUpperCase()}</td>
                        </tr>
                      )}
                      {printSettings.showVisitArea && (
                        <tr style={{ borderBottom: "1px solid #000000" }}>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "800", textTransform: "uppercase", fontSize: "0.6rem", borderRight: "1px solid #000000", backgroundColor: "#f3f4f6" }}>ALLOWED AREAS</td>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "900", color: "#000000" }}>
                            {Array.isArray(passData.visitArea) ? passData.visitArea.join(", ").toUpperCase() : passData.visitArea ? passData.visitArea.toUpperCase() : "N/A"}
                          </td>
                        </tr>
                      )}
                      {printSettings.showPurpose && (
                        <tr style={{ borderBottom: "1px solid #000000" }}>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "800", textTransform: "uppercase", fontSize: "0.6rem", borderRight: "1px solid #000000", backgroundColor: "#f3f4f6" }}>PURPOSE</td>
                          <td style={{ padding: "0.35rem 0.5rem" }}>{passData.purpose || "General Meeting"}</td>
                        </tr>
                      )}
                      {printSettings.showMobileNo && (
                        <tr style={{ borderBottom: "1px solid #000000" }}>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "800", textTransform: "uppercase", fontSize: "0.6rem", borderRight: "1px solid #000000", backgroundColor: "#f3f4f6" }}>MOBILE NO</td>
                          <td style={{ padding: "0.35rem 0.5rem" }}>{passData.mobileNo || "-"}</td>
                        </tr>
                      )}
                      {printSettings.showPassDate && (
                        <tr style={{ borderBottom: "1px solid #000000" }}>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "800", textTransform: "uppercase", fontSize: "0.6rem", borderRight: "1px solid #000000", backgroundColor: "#f3f4f6" }}>DATE / TIME</td>
                          <td style={{ padding: "0.35rem 0.5rem" }}>
                            {new Date(passData.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      )}
                      {printSettings.showAllowedHours && passData.allowedHours && (
                        <tr>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "800", textTransform: "uppercase", fontSize: "0.6rem", borderRight: "1px solid #000000", backgroundColor: "#f3f4f6" }}>VALID LIMIT</td>
                          <td style={{ padding: "0.35rem 0.5rem", fontWeight: "900" }}>{passData.allowedHours} HOURS ONLY</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Accompanying Persons Table */}
              {printSettings.showAccompanyingPersons && passData.persons && passData.persons.length > 0 && (
                <div style={{ border: "1.5px solid #000000", padding: "0.5rem", fontSize: "0.7rem", marginTop: "0.5rem", backgroundColor: "#ffffff" }}>
                  <div style={{ fontWeight: "900", color: "#000000", marginBottom: "0.25rem", textTransform: "uppercase", fontSize: "0.6rem", letterSpacing: "0.05em" }}>
                    Accompanying Persons ({passData.persons.length} Total)
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1.5px solid #000000", color: "#000000", textAlign: "left" }}>
                        <th style={{ padding: "0.15rem 0", fontSize: "0.55rem", fontWeight: "800" }}>NAME</th>
                        <th style={{ padding: "0.15rem 0", fontSize: "0.55rem", fontWeight: "800" }}>CONTACT</th>
                        <th style={{ padding: "0.15rem 0", fontSize: "0.55rem", fontWeight: "800" }}>GOVT ID NO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passData.persons.map((person, index) => (
                        <tr key={person.id || index} style={{ borderBottom: index < passData.persons.length - 1 ? "1px dashed #cbd5e1" : "none" }}>
                          <td style={{ padding: "0.2rem 0", fontWeight: "700" }}>{person.name}</td>
                          <td style={{ padding: "0.2rem 0" }}>{person.phoneNo || "-"}</td>
                          <td style={{ padding: "0.2rem 0" }}>{person.aadharNumber || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Authorized Signatures Section (Highly Standard Corporate) */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1.25rem",
                paddingTop: "0.75rem",
                borderTop: "1.5px dashed #000000"
              }}>
                <div style={{ textAlign: "center", width: "45%" }}>
                  <div style={{ borderBottom: "1px solid #000000", width: "100%", height: "20px" }}></div>
                  <span style={{ fontSize: "0.55rem", fontWeight: "800", textTransform: "uppercase", marginTop: "3px", display: "block", color: "#000000" }}>
                    Visitor Signature
                  </span>
                </div>
                <div style={{ textAlign: "center", width: "45%" }}>
                  <div style={{ borderBottom: "1px solid #000000", width: "100%", height: "20px" }}></div>
                  <span style={{ fontSize: "0.55rem", fontWeight: "800", textTransform: "uppercase", marginTop: "3px", display: "block", color: "#000000" }}>
                    Security Officer / Sign
                  </span>
                </div>
              </div>

              {/* Custom Bottom Instructions */}
              {printSettings.bottomInstructions && (
                <div
                  style={{
                    borderTop: "1px dashed #000000",
                    paddingTop: "0.5rem",
                    marginTop: "0.75rem",
                    fontSize: "0.6rem",
                    lineHeight: "1.4",
                    color: "#000000",
                  }}
                >
                  <div style={{ fontWeight: "900", fontSize: "0.55rem", textTransform: "uppercase", color: "#000000", marginBottom: "0.15rem", letterSpacing: "0.05em" }}>
                    Security Access Terms:
                  </div>
                  {printSettings.bottomInstructions.split("\n").map((instruction, idx) => (
                    <div key={idx} style={{ marginBottom: "0.05rem" }}>{instruction}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Printing Details and Actions */}
          <div
            style={{
              width: "300px",
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>Pass Metadata</span>
              <h3 style={{ margin: "0.25rem 0 0.5rem 0", color: "#0f172a", fontSize: "1.1rem", fontWeight: "700" }}>
                {passData.name}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.85rem", color: "#475569" }}>
                <div>Status: <strong style={{ color: passData.status === "Approved" ? "#03543f" : "#b45309" }}>{passData.status}</strong></div>
                <div>Created: <strong>{new Date(passData.createdAt).toLocaleDateString()}</strong></div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
              <button
                onClick={handlePrint}
                style={{
                  width: "100%",
                  height: "2.75rem",
                  borderRadius: "0.375rem",
                  backgroundColor: activeColor.primary,
                  color: "#ffffff",
                  border: "none",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`,
                }}
              >
                <Printer size={18} /> Print Access Pass
              </button>
            </div>

            <div
              style={{
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "0.5rem",
                padding: "0.75rem",
                fontSize: "0.75rem",
                color: "#166534",
                lineHeight: "1.4",
              }}
            >
              🎉 <strong>Print Settings Active:</strong> This pass will be formatted into a <strong>{printSettings.paperSize}</strong> size badge with a <strong>{printSettings.colorTheme}</strong> color theme automatically.
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
