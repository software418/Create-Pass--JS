import { useState, useMemo } from "react";
// ─── Default status colors ───────────────────────────────────────────────────
const DEFAULT_STATUS_COLORS = {
  active: "bg-green-50 text-green-800 border border-green-200",
  blocked: "bg-amber-50 text-amber-800 border border-amber-200",
  deleted: "bg-red-50 text-red-800 border border-red-200",
};
// ─── Helpers ─────────────────────────────────────────────────────────────────
function getNestedValue(obj, key) {
  return key.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object") {
      return acc[part];
    }
    return undefined;
  }, obj);
}
function displayValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
const Modal = ({ title, fields, initialValues = {}, onSubmit, onClose }) => {
  const [values, setValues] = useState(() => {
    const defaults = {};
    fields.forEach((f) => {
      defaults[f.key] = initialValues[f.key] ?? f.defaultValue ?? "";
    });
    return defaults;
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };
  return (
    <div
      className="dynamic-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {
        <div className="dynamic-modal-container">
          {
            <div className="dynamic-modal-header">
              {
                <h2 className="dynamic-modal-title">
                  {title}
                </h2>
              }
              {
                <button
                  onClick={onClose}
                  className="dynamic-modal-close"
                >
                  ✕
                </button>
              }
            </div>
          }
          {
            <form onSubmit={handleSubmit} className="dynamic-modal-form">
              {fields.map((field) => (
                <div>
                  {
                    <label className="dynamic-label">
                      {field.label}
                      {field.required && (
                        <span className="dynamic-label-req">*</span>
                      )}
                    </label>
                  }
                  {field.type === "select" && field.options ? (
                    <select
                      value={values[field.key]}
                      onChange={(e) =>
                        setValues((v) => ({
                          ...v,
                          [field.key]: e.target.value,
                        }))
                      }
                      required={field.required}
                      className="dynamic-input"
                    >
                      {<option value="">Select {field.label}...</option>}
                      {field.options.map((opt) => (
                        <option value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type ?? "text"}
                      value={values[field.key]}
                      onChange={(e) =>
                        setValues((v) => ({
                          ...v,
                          [field.key]: e.target.value,
                        }))
                      }
                      placeholder={
                        field.placeholder ??
                        `Enter ${field.label.toLowerCase()}...`
                      }
                      required={field.required}
                      className="dynamic-input"
                    />
                  )}
                </div>
              ))}
              {
                <div className="dynamic-actions">
                  {
                    <button
                      type="button"
                      onClick={onClose}
                      className="dynamic-btn-cancel"
                    >
                      Cancel
                    </button>
                  }
                  {
                    <button
                      type="submit"
                      className="dynamic-btn-save"
                    >
                      Save
                    </button>
                  }
                </div>
              }
            </form>
          }
        </div>
      }
    </div>
  );
};
const Cell = ({ col, row, statusColors }) => {
  const value = getNestedValue(row, col.key);
  if (col.render) {
    return <>{col.render(value, row)}</>;
  }
  switch (col.type) {
    case "status": {
      const str = displayValue(value).toLowerCase();
      const cls =
        statusColors[str] ?? "dynamic-status-default";
      return (
        <span
          className={`dynamic-status-badge ${cls}`}
        >
          {str}
        </span>
      );
    }
    case "badge": {
      return (
        <span className="dynamic-badge">
          {displayValue(value)}
        </span>
      );
    }
    case "mono": {
      return (
        <span className="dynamic-mono">
          {displayValue(value)}
        </span>
      );
    }
    case "email": {
      const str = displayValue(value);
      return str === "—" ? (
        <span className="dynamic-empty">—</span>
      ) : (
        <a
          href={`mailto:${str}`}
          className="dynamic-email"
        >
          {str}
        </a>
      );
    }
    case "phone": {
      const str = displayValue(value);
      return str === "—" ? (
        <span className="dynamic-empty">—</span>
      ) : (
        <a
          href={`tel:${str}`}
          className="dynamic-phone"
        >
          {str}
        </a>
      );
    }
    default: {
      const str = displayValue(value);
      return str === "—" ? (
        <span className="dynamic-empty">—</span>
      ) : (
        <span className="dynamic-text">{str}</span>
      );
    }
  }
};
// ─── Main Component ───────────────────────────────────────────────────────────
export const DynamicDataPage = ({
  title,
  subtitle,
  data = [],
  idKey = "_id",
  columns,
  statusColors = DEFAULT_STATUS_COLORS,
  isLoading = false,
  error = null,
  onCreate,
  onEdit,
  onDelete,
  formFields = [],
}) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [modalMode, setModalMode] = useState(null);
  const [editRow, setEditRow] = useState(null);
  // ── Merge status colors ──
  const mergedStatusColors = { ...DEFAULT_STATUS_COLORS, ...statusColors };
  // ── Searchable columns ──
  const searchableCols = columns.filter((c) => c.searchable !== false);
  // ── Filter + sort ──
  const processedData = useMemo(() => {
    let result = Array.isArray(data) ? [...data] : [];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        searchableCols.some((col) => {
          const v = getNestedValue(row, col.key);
          return displayValue(v).toLowerCase().includes(q);
        }),
      );
    }
    if (sortKey) {
      result.sort((a, b) => {
        const av = displayValue(getNestedValue(a, sortKey));
        const bv = displayValue(getNestedValue(b, sortKey));
        const cmp = av.localeCompare(bv, undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, search, sortKey, sortDir]);
  // ── Sort toggle ──
  const handleSort = (key) => {
    if (!columns.find((c) => c.key === key)?.sortable) return;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };
  // ── CRUD ──
  const handleCreate = (values) => {
    onCreate?.(values);
    setModalMode(null);
  };
  const handleEdit = (values) => {
    if (!editRow) return;
    const id = String(editRow[idKey] ?? "");
    onEdit?.(id, values);
    setModalMode(null);
    setEditRow(null);
  };
  const handleDelete = (row) => {
    const id = String(row[idKey] ?? "");
    const label = formFields[0]
      ? String(getNestedValue(row, formFields[0].key) ?? id)
      : id;
    if (window.confirm(`Delete "${label}"? This cannot be undone.`)) {
      onDelete?.(id);
    }
  };
  const openEdit = (row) => {
    setEditRow(row);
    setModalMode("edit");
  };
  // ── Sort icon ──
  const SortIcon = ({ col }) => {
    if (!col.sortable) return null;
    const active = sortKey === col.key;
    return (
      <span
        className={`ml-1 inline-block text-xs ${active ? "text-blue-600" : "text-gray-300"}`}
      >
        {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
      </span>
    );
  };
  const hasActions = onCreate || onEdit || onDelete;
  const initialEditValues = editRow
    ? Object.fromEntries(
        formFields.map((f) => [
          f.key,
          displayValue(getNestedValue(editRow, f.key)) === "—"
            ? ""
            : displayValue(getNestedValue(editRow, f.key)),
        ]),
      )
    : {};
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-100">
          {
            <div>
              {
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {title}
                </h1>
              }
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          }
          {onCreate && formFields.length > 0 && (
            <button
              onClick={() => setModalMode("add")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors"
            >
              {<span className="text-lg leading-none">+</span>}Add{" "}
              {title.replace(/s$/, "")}
            </button>
          )}
        </div>
      }
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}
      {
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3">
          {<span className="text-gray-400 text-base">🔍</span>}
          {
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          }
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
          {
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {processedData.length} of {Array.isArray(data) ? data.length : 0}
            </span>
          }
        </div>
      }
      {
        <div className="overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm">
          {
            <div className="overflow-x-auto">
              {
                <table className="w-full text-sm text-left">
                  {
                    <thead className="bg-gray-50 border-b border-gray-200">
                      {
                        <tr>
                          {columns.map((col) => (
                            <th
                              style={
                                col.width ? { width: col.width } : undefined
                              }
                              onClick={() => handleSort(col.key)}
                              className={`px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap ${col.sortable ? "cursor-pointer select-none hover:text-gray-900 transition-colors" : ""}`}
                            >
                              {col.label}
                              {<SortIcon col={col} />}
                            </th>
                          ))}
                          {hasActions && (
                            <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wide text-right">
                              Actions
                            </th>
                          )}
                        </tr>
                      }
                    </thead>
                  }
                  {
                    <tbody className="divide-y divide-gray-50">
                      {isLoading ? (
                        <tr>
                          {
                            <td
                              colSpan={columns.length + (hasActions ? 1 : 0)}
                              className="text-center py-14 text-sm text-gray-400"
                            >
                              {
                                <span className="animate-pulse">
                                  Loading...
                                </span>
                              }
                            </td>
                          }
                        </tr>
                      ) : processedData.length === 0 ? (
                        <tr>
                          {
                            <td
                              colSpan={columns.length + (hasActions ? 1 : 0)}
                              className="text-center py-14 text-sm text-gray-400"
                            >
                              {search
                                ? `No results for "${search}"`
                                : "No records found."}
                            </td>
                          }
                        </tr>
                      ) : (
                        // eslint-disable-next-line no-unused-vars
                        processedData.map((row, rowIdx) => (
                          <tr className="hover:bg-blue-50/30 transition-colors">
                            {columns.map((col) => (
                              <td className="px-5 py-3.5 whitespace-nowrap">
                                {
                                  <Cell
                                    col={col}
                                    row={row}
                                    statusColors={mergedStatusColors}
                                  />
                                }
                              </td>
                            ))}
                            {hasActions && (
                              <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                {
                                  <div className="flex items-center justify-end gap-3">
                                    {onEdit && formFields.length > 0 && (
                                      <button
                                        onClick={() => openEdit(row)}
                                        className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                      >
                                        Edit
                                      </button>
                                    )}
                                    {onDelete && (
                                      <button
                                        onClick={() => handleDelete(row)}
                                        className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                }
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  }
                </table>
              }
            </div>
          }
          {!isLoading && processedData.length > 0 && (
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
              {
                <span>
                  Showing {processedData.length}{" "}
                  {processedData.length === 1 ? "record" : "records"}
                  {search && ` matching "${search}"`}
                </span>
              }
              {<span>Total: {Array.isArray(data) ? data.length : 0}</span>}
            </div>
          )}
        </div>
      }
      {modalMode === "add" && formFields.length > 0 && (
        <Modal
          title={`Add New ${title.replace(/s$/, "")}`}
          fields={formFields}
          onSubmit={handleCreate}
          onClose={() => setModalMode(null)}
        />
      )}
      {modalMode === "edit" && formFields.length > 0 && editRow && (
        <Modal
          title={`Edit ${title.replace(/s$/, "")}`}
          fields={formFields}
          initialValues={initialEditValues}
          onSubmit={handleEdit}
          onClose={() => {
            setModalMode(null);
            setEditRow(null);
          }}
        />
      )}
    </div>
  );
};
export default DynamicDataPage;
