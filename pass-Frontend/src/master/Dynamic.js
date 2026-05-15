import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
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
  return _jsx("div", {
    className:
      "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm",
    onClick: (e) => e.target === e.currentTarget && onClose(),
    children: _jsxs("div", {
      className:
        "bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden",
      children: [
        _jsxs("div", {
          className:
            "flex items-center justify-between px-6 py-4 border-b border-gray-100",
          children: [
            _jsx("h2", {
              className: "text-base font-semibold text-gray-900",
              children: title,
            }),
            _jsx("button", {
              onClick: onClose,
              className:
                "w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors",
              children: "\u2715",
            }),
          ],
        }),
        _jsxs("form", {
          onSubmit: handleSubmit,
          className: "px-6 py-5 space-y-4",
          children: [
            fields.map((field) =>
              _jsxs(
                "div",
                {
                  children: [
                    _jsxs("label", {
                      className:
                        "block text-xs font-medium text-gray-600 mb-1.5",
                      children: [
                        field.label,
                        field.required &&
                          _jsx("span", {
                            className: "text-red-500 ml-0.5",
                            children: "*",
                          }),
                      ],
                    }),
                    field.type === "select" && field.options
                      ? _jsxs("select", {
                          value: values[field.key],
                          onChange: (e) =>
                            setValues((v) => ({
                              ...v,
                              [field.key]: e.target.value,
                            })),
                          required: field.required,
                          className:
                            "w-full border border-gray-200 rounded-lg text-sm px-3 py-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all",
                          children: [
                            _jsxs("option", {
                              value: "",
                              children: ["Select ", field.label, "..."],
                            }),
                            field.options.map((opt) =>
                              _jsx(
                                "option",
                                { value: opt, children: opt },
                                opt,
                              ),
                            ),
                          ],
                        })
                      : _jsx("input", {
                          type: field.type ?? "text",
                          value: values[field.key],
                          onChange: (e) =>
                            setValues((v) => ({
                              ...v,
                              [field.key]: e.target.value,
                            })),
                          placeholder:
                            field.placeholder ??
                            `Enter ${field.label.toLowerCase()}...`,
                          required: field.required,
                          className:
                            "w-full border border-gray-200 rounded-lg text-sm px-3 py-2.5 bg-white text-gray-900 placeholder-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all",
                        }),
                  ],
                },
                field.key,
              ),
            ),
            _jsxs("div", {
              className: "flex gap-3 pt-2",
              children: [
                _jsx("button", {
                  type: "button",
                  onClick: onClose,
                  className:
                    "flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
                  children: "Cancel",
                }),
                _jsx("button", {
                  type: "submit",
                  className:
                    "flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors",
                  children: "Save",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
};
const Cell = ({ col, row, statusColors }) => {
  const value = getNestedValue(row, col.key);
  if (col.render) {
    return _jsx(_Fragment, { children: col.render(value, row) });
  }
  switch (col.type) {
    case "status": {
      const str = displayValue(value).toLowerCase();
      const cls =
        statusColors[str] ?? "bg-gray-100 text-gray-600 border border-gray-200";
      return _jsx("span", {
        className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`,
        children: str,
      });
    }
    case "badge": {
      return _jsx("span", {
        className:
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200",
        children: displayValue(value),
      });
    }
    case "mono": {
      return _jsx("span", {
        className: "font-mono text-xs font-semibold text-gray-700",
        children: displayValue(value),
      });
    }
    case "email": {
      const str = displayValue(value);
      return str === "—"
        ? _jsx("span", { className: "text-gray-300", children: "\u2014" })
        : _jsx("a", {
            href: `mailto:${str}`,
            className:
              "text-blue-600 hover:underline text-sm truncate max-w-40 block",
            children: str,
          });
    }
    case "phone": {
      const str = displayValue(value);
      return str === "—"
        ? _jsx("span", { className: "text-gray-300", children: "\u2014" })
        : _jsx("a", {
            href: `tel:${str}`,
            className: "text-gray-700 hover:text-blue-600 text-sm",
            children: str,
          });
    }
    default: {
      const str = displayValue(value);
      return str === "—"
        ? _jsx("span", { className: "text-gray-300", children: "\u2014" })
        : _jsx("span", { className: "text-gray-800 text-sm", children: str });
    }
  }
};
// ─── Main Component ───────────────────────────────────────────────────────────
export const DynamicDataPage = ({
  title,
  subtitle,
  data,
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
    let result = [...data];
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
    return _jsx("span", {
      className: `ml-1 inline-block text-xs ${active ? "text-blue-600" : "text-gray-300"}`,
      children: active ? (sortDir === "asc" ? "↑" : "↓") : "↕",
    });
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
  return _jsxs("div", {
    className: "p-6 max-w-7xl mx-auto space-y-5",
    children: [
      _jsxs("div", {
        className:
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-100",
        children: [
          _jsxs("div", {
            children: [
              _jsx("h1", {
                className: "text-2xl font-bold text-gray-900 tracking-tight",
                children: title,
              }),
              subtitle &&
                _jsx("p", {
                  className: "text-sm text-gray-500 mt-1",
                  children: subtitle,
                }),
            ],
          }),
          onCreate &&
            formFields.length > 0 &&
            _jsxs("button", {
              onClick: () => setModalMode("add"),
              className:
                "inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors",
              children: [
                _jsx("span", {
                  className: "text-lg leading-none",
                  children: "+",
                }),
                "Add ",
                title.replace(/s$/, ""),
              ],
            }),
        ],
      }),
      error &&
        _jsx("div", {
          className:
            "p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium",
          children: error,
        }),
      _jsxs("div", {
        className:
          "flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3",
        children: [
          _jsx("span", {
            className: "text-gray-400 text-base",
            children: "\uD83D\uDD0D",
          }),
          _jsx("input", {
            type: "text",
            placeholder: `Search ${title.toLowerCase()}...`,
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className:
              "flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none",
          }),
          search &&
            _jsx("button", {
              onClick: () => setSearch(""),
              className:
                "text-xs text-gray-400 hover:text-gray-600 transition-colors",
              children: "Clear",
            }),
          _jsxs("span", {
            className: "text-xs text-gray-400 whitespace-nowrap",
            children: [processedData.length, " of ", data.length],
          }),
        ],
      }),
      _jsxs("div", {
        className:
          "overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm",
        children: [
          _jsx("div", {
            className: "overflow-x-auto",
            children: _jsxs("table", {
              className: "w-full text-sm text-left",
              children: [
                _jsx("thead", {
                  className: "bg-gray-50 border-b border-gray-200",
                  children: _jsxs("tr", {
                    children: [
                      columns.map((col) =>
                        _jsxs(
                          "th",
                          {
                            style: col.width ? { width: col.width } : undefined,
                            onClick: () => handleSort(col.key),
                            className: `px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap ${col.sortable ? "cursor-pointer select-none hover:text-gray-900 transition-colors" : ""}`,
                            children: [col.label, _jsx(SortIcon, { col: col })],
                          },
                          col.key,
                        ),
                      ),
                      hasActions &&
                        _jsx("th", {
                          className:
                            "px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wide text-right",
                          children: "Actions",
                        }),
                    ],
                  }),
                }),
                _jsx("tbody", {
                  className: "divide-y divide-gray-50",
                  children: isLoading
                    ? _jsx("tr", {
                        children: _jsx("td", {
                          colSpan: columns.length + (hasActions ? 1 : 0),
                          className: "text-center py-14 text-sm text-gray-400",
                          children: _jsx("span", {
                            className: "animate-pulse",
                            children: "Loading...",
                          }),
                        }),
                      })
                    : processedData.length === 0
                      ? _jsx("tr", {
                          children: _jsx("td", {
                            colSpan: columns.length + (hasActions ? 1 : 0),
                            className:
                              "text-center py-14 text-sm text-gray-400",
                            children: search
                              ? `No results for "${search}"`
                              : "No records found.",
                          }),
                        })
                      : processedData.map((row, rowIdx) =>
                          _jsxs(
                            "tr",
                            {
                              className:
                                "hover:bg-blue-50/30 transition-colors",
                              children: [
                                columns.map((col) =>
                                  _jsx(
                                    "td",
                                    {
                                      className:
                                        "px-5 py-3.5 whitespace-nowrap",
                                      children: _jsx(Cell, {
                                        col: col,
                                        row: row,
                                        statusColors: mergedStatusColors,
                                      }),
                                    },
                                    col.key,
                                  ),
                                ),
                                hasActions &&
                                  _jsx("td", {
                                    className:
                                      "px-5 py-3.5 text-right whitespace-nowrap",
                                    children: _jsxs("div", {
                                      className:
                                        "flex items-center justify-end gap-3",
                                      children: [
                                        onEdit &&
                                          formFields.length > 0 &&
                                          _jsx("button", {
                                            onClick: () => openEdit(row),
                                            className:
                                              "text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors",
                                            children: "Edit",
                                          }),
                                        onDelete &&
                                          _jsx("button", {
                                            onClick: () => handleDelete(row),
                                            className:
                                              "text-xs font-medium text-red-600 hover:text-red-700 transition-colors",
                                            children: "Delete",
                                          }),
                                      ],
                                    }),
                                  }),
                              ],
                            },
                            String(row[idKey] ?? rowIdx),
                          ),
                        ),
                }),
              ],
            }),
          }),
          !isLoading &&
            processedData.length > 0 &&
            _jsxs("div", {
              className:
                "px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between",
              children: [
                _jsxs("span", {
                  children: [
                    "Showing ",
                    processedData.length,
                    " ",
                    processedData.length === 1 ? "record" : "records",
                    search && ` matching "${search}"`,
                  ],
                }),
                _jsxs("span", { children: ["Total: ", data.length] }),
              ],
            }),
        ],
      }),
      modalMode === "add" &&
        formFields.length > 0 &&
        _jsx(Modal, {
          title: `Add New ${title.replace(/s$/, "")}`,
          fields: formFields,
          onSubmit: handleCreate,
          onClose: () => setModalMode(null),
        }),
      modalMode === "edit" &&
        formFields.length > 0 &&
        editRow &&
        _jsx(Modal, {
          title: `Edit ${title.replace(/s$/, "")}`,
          fields: formFields,
          initialValues: initialEditValues,
          onSubmit: handleEdit,
          onClose: () => {
            setModalMode(null);
            setEditRow(null);
          },
        }),
    ],
  });
};
export default DynamicDataPage;
