import { useState, useEffect } from "react";
import { Sliders, Save, CheckCircle, RotateCcw, Eye, ShieldAlert } from "lucide-react";

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
  colorTheme: "teal", // "teal", "blue", "dark", "emerald"
  showBorders: true,
  bottomInstructions: "1. Please wear this badge visibly at all times within the facility.\n2. This pass is non-transferable and valid only for authorized areas.\n3. Return this pass to the security desk upon check-out.\n4. In case of emergency, follow instructions of safety wardens.",
};

const THEME_COLORS = {
  teal: { primary: "#0f766e", secondary: "#14b8a6", bgLight: "#f0fdfa", text: "#115e59" },
  blue: { primary: "#1d4ed8", secondary: "#3b82f6", bgLight: "#eff6ff", text: "#1e40af" },
  dark: { primary: "#1f2937", secondary: "#4b5563", bgLight: "#f9fafb", text: "#111827" },
  emerald: { primary: "#065f46", secondary: "#10b981", bgLight: "#ecfdf5", text: "#065f46" },
};

export default function PrintSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_PRINT_SETTINGS);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Load configuration from local storage
  useEffect(() => {
    const saved = localStorage.getItem("vms_print_settings");
    if (saved) {
      try {
        setSettings({ ...DEFAULT_PRINT_SETTINGS, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to parse print settings from localStorage", e);
      }
    }
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("vms_print_settings", JSON.stringify(updated));
      return updated;
    });
    triggerSavedIndicator();
  };

  const handleSelect = (key, value) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem("vms_print_settings", JSON.stringify(updated));
      return updated;
    });
    triggerSavedIndicator();
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem("vms_print_settings", JSON.stringify(updated));
      return updated;
    });
    triggerSavedIndicator();
  };

  const triggerSavedIndicator = () => {
    setShowSavedToast(true);
    const timer = setTimeout(() => setShowSavedToast(false), 2000);
    return () => clearTimeout(timer);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset print configuration to default?")) {
      setSettings(DEFAULT_PRINT_SETTINGS);
      localStorage.setItem("vms_print_settings", JSON.stringify(DEFAULT_PRINT_SETTINGS));
      triggerSavedIndicator();
    }
  };

  const handleManualSave = () => {
    localStorage.setItem("vms_print_settings", JSON.stringify(settings));
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  // Live preview mockup details
  const activeColor = THEME_COLORS[settings.colorTheme] || THEME_COLORS.teal;

  // Render mock pass depending on chosen settings
  const getMockPassStyle = () => {
    const isThermal = settings.paperSize === "Thermal";
    const isA4 = settings.paperSize === "A4";

    return {
      width: isThermal ? "290px" : isA4 ? "100%" : "400px",
      minHeight: isThermal ? "400px" : isA4 ? "300px" : "260px",
      border: settings.showBorders ? `2px solid ${activeColor.primary}` : "1px solid #cbd5e1",
      borderRadius: isThermal ? "0" : isA4 ? "0.75rem" : "0.5rem",
      backgroundColor: "#ffffff",
      padding: isThermal ? "1.25rem 1rem" : "1.5rem",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      boxSizing: "border-box",
      fontFamily: "system-ui, -apple-system, sans-serif",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      color: "#1f2937",
    };
  };

  return (
    <div style={{ padding: "0 1.5rem 4rem 1.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Toast Notification */}
      <div
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          backgroundColor: "#10b981",
          color: "#ffffff",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          fontWeight: "600",
          boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.4)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          transform: showSavedToast ? "translateY(0)" : "translateY(-100px)",
          opacity: showSavedToast ? 1 : 0,
          transition: "transform 0.3s ease, opacity 0.3s ease",
          zIndex: 9999,
        }}
      >
        <CheckCircle size={18} />
        <span>Settings Auto-Saved!</span>
      </div>

      {/* Page Title Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div>
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
            <Sliders style={{ color: activeColor.primary }} />
            Print Settings Configuration
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0.35rem 0 0 0", fontWeight: "500" }}>
            Customize what fields appear on the gate pass, the size format, custom security instructions, and print themes.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={handleReset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#f1f5f9",
              color: "#475569",
              border: "1px solid #cbd5e1",
              borderRadius: "0.5rem",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            <RotateCcw size={16} /> Reset Default
          </button>
          <button
            onClick={handleManualSave}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: activeColor.primary,
              color: "#ffffff",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.5rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`,
              transition: "opacity 0.2s",
            }}
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      {/* Main Responsive Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem" }}>
        
        {/* Settings Panel Card (Left Side) */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "0.75rem",
            border: "1px solid #e2e8f0",
            padding: "1.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "1.75rem",
          }}
        >
          {/* Format Settings */}
          <div>
            <h3 style={{ margin: "0 0 1rem 0", color: "#334155", fontSize: "1rem", fontWeight: "700", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.5rem" }}>
              1. Print Layout Format
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                  Paper / Badge Size
                </label>
                <select
                  value={settings.paperSize}
                  onChange={(e) => handleSelect("paperSize", e.target.value)}
                  style={{
                    width: "100%",
                    height: "2.5rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #cbd5e1",
                    padding: "0 0.5rem",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <option value="Card">Standard ID Card (3.5" x 2.25")</option>
                  <option value="Thermal">Thermal Slip (80mm Continuous)</option>
                  <option value="A4">A4 Half-Page Document</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                  Color Accent
                </label>
                <select
                  value={settings.colorTheme}
                  onChange={(e) => handleSelect("colorTheme", e.target.value)}
                  style={{
                    width: "100%",
                    height: "2.5rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #cbd5e1",
                    padding: "0 0.5rem",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: "#ffffff",
                    textTransform: "capitalize",
                  }}
                >
                  <option value="teal">Teal (VMS Classic)</option>
                  <option value="blue">Royal Blue</option>
                  <option value="dark">Charcoal Black</option>
                  <option value="emerald">Forest Green</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: "600", color: "#475569" }}>
                <input
                  type="checkbox"
                  checked={settings.showBorders}
                  onChange={() => handleToggle("showBorders")}
                  style={{ width: "1.1rem", height: "1.1rem", accentColor: activeColor.primary, cursor: "pointer" }}
                />
                Show Accent Border
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: "600", color: "#475569" }}>
                <input
                  type="checkbox"
                  checked={settings.orientation === "Landscape"}
                  onChange={() => handleSelect("orientation", settings.orientation === "Portrait" ? "Landscape" : "Portrait")}
                  style={{ width: "1.1rem", height: "1.1rem", accentColor: activeColor.primary, cursor: "pointer" }}
                />
                Landscape Mode
              </label>
            </div>
          </div>

          {/* Toggle Fields */}
          <div>
            <h3 style={{ margin: "0 0 1rem 0", color: "#334155", fontSize: "1rem", fontWeight: "700", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.5rem" }}>
              2. Custom Visible Fields
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
              {[
                { key: "showPhoto", label: "Visitor Photo" },
                { key: "showPassType", label: "Pass Type Indicator" },
                { key: "showGatePassId", label: "Gate Pass ID Code" },
                { key: "showPassDate", label: "Pass Issue Date" },
                { key: "showAllowedHours", label: "Hours Allowed Limit" },
                { key: "showName", label: "Visitor Name" },
                { key: "showMobileNo", label: "Mobile Number" },
                { key: "showEmailId", label: "Email Address" },
                { key: "showCompanyName", label: "Company Name" },
                { key: "showEmployee", label: "Host Employee Name" },
                { key: "showVisitArea", label: "Allowed Office Areas" },
                { key: "showPurpose", label: "Purpose of Visit" },
                { key: "showAccompanyingPersons", label: "Accompanying Persons" },
              ].map((field) => (
                <div
                  key={field.key}
                  onClick={() => handleToggle(field.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.375rem",
                    backgroundColor: settings[field.key] ? activeColor.bgLight : "#f8fafc",
                    border: `1px solid ${settings[field.key] ? activeColor.secondary + "40" : "#e2e8f0"}`,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: "0.8rem", fontWeight: "600", color: settings[field.key] ? activeColor.text : "#64748b" }}>
                    {field.label}
                  </span>
                  
                  {/* Styled Mini Toggle Switch */}
                  <div
                    style={{
                      width: "1.75rem",
                      height: "0.9rem",
                      borderRadius: "9999px",
                      backgroundColor: settings[field.key] ? activeColor.primary : "#cbd5e1",
                      position: "relative",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: "0.75rem",
                        height: "0.75rem",
                        borderRadius: "50%",
                        backgroundColor: "#ffffff",
                        position: "absolute",
                        top: "0.075rem",
                        left: settings[field.key] ? "0.9rem" : "0.1rem",
                        transition: "left 0.2s",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Security Instructions */}
          <div>
            <h3 style={{ margin: "0 0 0.75rem 0", color: "#334155", fontSize: "1rem", fontWeight: "700", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.5rem" }}>
              3. Pass Bottom Instructions
            </h3>
            <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.75rem", color: "#64748b", fontWeight: "500" }}>
              Define rules and directions printed at the bottom of every pass. Keep each instruction on a new line.
            </p>
            <textarea
              name="bottomInstructions"
              value={settings.bottomInstructions}
              onChange={handleTextChange}
              placeholder="Enter directions..."
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.8rem",
                lineHeight: "1.4",
                borderRadius: "0.375rem",
                border: "1px solid #cbd5e1",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                backgroundColor: "#f8fafc",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            />
          </div>
        </div>

        {/* Live Mockup Preview Panel (Right Side) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "2px dashed #cbd5e1",
              borderRadius: "0.75rem",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              minHeight: "450px",
              boxSizing: "border-box",
            }}
          >
            {/* Live Indicator Badge */}
            <div
              style={{
                alignSelf: "stretch",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569", fontWeight: "700", fontSize: "0.85rem" }}>
                <Eye size={16} /> Live Printing Mockup Preview
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  backgroundColor: activeColor.primary,
                  color: "#ffffff",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "9999px",
                  fontWeight: "700",
                  letterSpacing: "0.05em",
                }}
              >
                REALTIME PREVIEW
              </div>
            </div>

            {/* Mock Pass Badge Container */}
            <div style={getMockPassStyle()}>
              {/* Header inside mock pass */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: `2px solid ${activeColor.primary}20`,
                  paddingBottom: "0.5rem",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: activeColor.primary }}>
                    FACILITY ACCESS PASS
                  </h2>
                  <div style={{ fontSize: "0.6rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>
                    Visitor Control Center
                  </div>
                </div>

                {settings.showPassType && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: "800",
                      backgroundColor: activeColor.bgLight,
                      color: activeColor.primary,
                      padding: "0.15rem 0.5rem",
                      borderRadius: "0.25rem",
                      textTransform: "uppercase",
                    }}
                  >
                    SINGLE DAY
                  </span>
                )}
              </div>

              {/* Main Content inside mock pass */}
              <div style={{ display: "flex", gap: "1rem", flex: 1, flexDirection: settings.orientation === "Landscape" ? "row" : "column" }}>
                
                {/* Photo section */}
                {settings.showPhoto && (
                  <div
                    style={{
                      width: "80px",
                      height: "90px",
                      borderRadius: "0.25rem",
                      border: `1px solid ${activeColor.primary}30`,
                      backgroundColor: "#f1f5f9",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#94a3b8",
                      fontSize: "0.5rem",
                      fontWeight: "700",
                      alignSelf: settings.orientation === "Landscape" ? "flex-start" : "center",
                    }}
                  >
                    {/* Simulated User Avatar */}
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#cbd5e1", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", fontSize: "0.8rem", color: "#fff", fontWeight: "800", marginBottom: "4px" }}>
                      JD
                    </div>
                    PHOTO AREA
                  </div>
                )}

                {/* Details Section */}
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr", gap: "0.45rem", fontSize: "0.75rem" }}>
                  
                  {settings.showGatePassId && (
                    <div>
                      <span style={{ color: "#64748b", fontSize: "0.6rem", fontWeight: "600", textTransform: "uppercase" }}>Pass ID:</span>
                      <strong style={{ marginLeft: "0.25rem", color: activeColor.primary, fontSize: "0.8rem" }}>GP-A7B8C9</strong>
                    </div>
                  )}

                  {settings.showName && (
                    <div>
                      <span style={{ color: "#64748b", fontSize: "0.6rem", fontWeight: "600", textTransform: "uppercase" }}>Visitor:</span>
                      <strong style={{ marginLeft: "0.25rem", color: "#0f172a" }}>Jane Doe</strong>
                    </div>
                  )}

                  {settings.showMobileNo && (
                    <div>
                      <span style={{ color: "#64748b", fontSize: "0.6rem", fontWeight: "600", textTransform: "uppercase" }}>Mobile:</span>
                      <span style={{ marginLeft: "0.25rem" }}>+1 (555) 019-2834</span>
                    </div>
                  )}

                  {settings.showEmailId && (
                    <div>
                      <span style={{ color: "#64748b", fontSize: "0.6rem", fontWeight: "600", textTransform: "uppercase" }}>Email:</span>
                      <span style={{ marginLeft: "0.25rem", textDecoration: "underline" }}>jane.doe@gmail.com</span>
                    </div>
                  )}

                  {settings.showCompanyName && (
                    <div>
                      <span style={{ color: "#64748b", fontSize: "0.6rem", fontWeight: "600", textTransform: "uppercase" }}>Company:</span>
                      <strong style={{ marginLeft: "0.25rem", color: "#334155" }}>Google DeepMind</strong>
                    </div>
                  )}

                  {settings.showEmployee && (
                    <div>
                      <span style={{ color: "#64748b", fontSize: "0.6rem", fontWeight: "600", textTransform: "uppercase" }}>Host Employee:</span>
                      <strong style={{ marginLeft: "0.25rem", color: "#1e293b" }}>John Smith (IT Dev)</strong>
                    </div>
                  )}

                  {settings.showVisitArea && (
                    <div>
                      <span style={{ color: "#64748b", fontSize: "0.6rem", fontWeight: "600", textTransform: "uppercase" }}>Allowed Areas:</span>
                      <span style={{ marginLeft: "0.25rem", color: activeColor.primary, fontWeight: "600" }}>Server Room, Conf Hall A</span>
                    </div>
                  )}

                  {settings.showPurpose && (
                    <div>
                      <span style={{ color: "#64748b", fontSize: "0.6rem", fontWeight: "600", textTransform: "uppercase" }}>Purpose:</span>
                      <span style={{ marginLeft: "0.25rem" }}>Technical Integration Meeting</span>
                    </div>
                  )}

                  {settings.showAllowedHours && (
                    <div>
                      <span style={{ color: "#64748b", fontSize: "0.6rem", fontWeight: "600", textTransform: "uppercase" }}>Allowed Duration:</span>
                      <span style={{ marginLeft: "0.25rem", backgroundColor: "#fffbeb", border: "1px solid #fef3c7", padding: "0.1rem 0.35rem", borderRadius: "0.25rem", color: "#b45309", fontWeight: "700" }}>8 Hours Limit</span>
                    </div>
                  )}

                  {settings.showPassDate && (
                    <div>
                      <span style={{ color: "#64748b", fontSize: "0.6rem", fontWeight: "600", textTransform: "uppercase" }}>Issue Date:</span>
                      <span style={{ marginLeft: "0.25rem" }}>{new Date().toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Accompanying Table Simulator */}
              {settings.showAccompanyingPersons && (
                <div style={{ border: "1px solid #e2e8f0", borderRadius: "0.25rem", padding: "0.35rem", fontSize: "0.65rem", backgroundColor: "#f8fafc" }}>
                  <div style={{ fontWeight: "700", color: "#475569", marginBottom: "0.15rem", textTransform: "uppercase", fontSize: "0.55rem" }}>
                    Accompanying Persons (2 Total)
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                    <span>1. Bob Smith (Mobile: +1...23)</span>
                    <span>2. Alice Johnson (Mobile: +1...56)</span>
                  </div>
                </div>
              )}

              {/* Bottom Instructions List inside mock pass */}
              {settings.bottomInstructions && (
                <div
                  style={{
                    borderTop: `1px dashed ${activeColor.primary}30`,
                    paddingTop: "0.5rem",
                    fontSize: "0.6rem",
                    lineHeight: "1.4",
                    color: "#475569",
                  }}
                >
                  <div style={{ fontWeight: "700", fontSize: "0.55rem", textTransform: "uppercase", color: activeColor.primary, marginBottom: "0.15rem" }}>
                    Terms & Instructions:
                  </div>
                  {settings.bottomInstructions.split("\n").map((instruction, idx) => (
                    <div key={idx} style={{ marginBottom: "0.05rem" }}>{instruction}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Notice about browser margins */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              padding: "1rem",
              backgroundColor: "#fffbe6",
              border: "1px solid #ffe58f",
              borderRadius: "0.5rem",
              color: "#d48806",
              fontSize: "0.8rem",
              lineHeight: "1.4",
            }}
          >
            <ShieldAlert size={18} style={{ flexShrink: 0, color: "#faad14" }} />
            <div>
              <strong>Printer Layout Tip:</strong> When using the physical browser print window, make sure to set <strong>Margins</strong> to <i>None</i> or <i>Minimum</i> and toggle <strong>Background graphics</strong> <i>ON</i> to get accurate colors and border formatting.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
