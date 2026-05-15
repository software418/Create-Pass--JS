/* eslint-disable react-hooks/refs */
import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import React, { useState } from "react";
import { Button } from "@/shared/ui/atoms/Button";
import { Checkbox } from "@/shared/ui/atoms/Checkbox";
import { FormField } from "@/shared/ui/molecules/FormField";
import { Input } from "@/shared/ui/atoms/Input";
import { queryPost } from "@/shared/services/api";
import { API_ENDPOINTS } from "@/shared/const/api";
import { useLocation } from "@/shared/hooks/useLocation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../shared/ui/molecules/Card";
import { CameraInput } from "@/pages/CameraInput";
import { useEmployees } from "@/features/employee/useEmployee";
import { usePurpose } from "@/features/purpose/usePurpose";
import { useCarryWith } from "@/features/carry_with/useCarrywith";
import { useVisitorArea } from "@/features/visitor_area/useVisitorArea";
import { useVisitorType } from "@/features/visitor_type/useVisitorType";
const INITIAL_FORM_DATA = {
  gatePassType: "single",
  passDate: "",
  from: "",
  to: "",
  mobileNo: "",
  name: "",
  emailId: "",
  companyName: "",
  address: "",
  state: "",
  city: "",
  representingVisitorType: "",
  subLocation: "",
  toMeetWith: "",
  carryWith: [],
  idType: "PASSPORT",
  idNumber: "",
  description: "",
  maskCovid: "",
  noOfPerson: "",
  persons: [{ name: "", phoneNo: "", aadharNumber: "", aadharFile: null }],
  visitArea: [],
  purpose: "",
  allowedHours: "",
};
const CreatePassPage = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { states, cities, setSelectedState } = useLocation();
  const { employees } = useEmployees();
  const { carryWith } = useCarryWith();
  const { purposes } = usePurpose();
  const { visitorArea } = useVisitorArea();
  const { visitorType } = useVisitorType();
  const cameraInputRef = React.useRef(null);
  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handlePersonChange = (index, field, value) => {
    setFormData((prev) => {
      const newPersons = [...prev.persons];
      newPersons[index] = { ...newPersons[index], [field]: value };
      return { ...prev, persons: newPersons };
    });
  };
  const addPerson = () => {
    setFormData((prev) => ({
      ...prev,
      persons: [
        ...prev.persons,
        { name: "", phoneNo: "", aadharNumber: "", aadharFile: null },
      ],
    }));
  };
  const removePerson = (index) => {
    setFormData((prev) => ({
      ...prev,
      persons: prev.persons.filter((_, i) => i !== index),
    }));
  };
  const handleClear = () => {
    setFormData(INITIAL_FORM_DATA);
    cameraInputRef.current?.resetCamera();
  };
  const handleStateChange = (e) => {
    const value = e.target.value;
    setSelectedState(value);
    setFormData((prev) => ({
      ...prev,
      state: value,
      city: "",
    }));
  };
  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Capture photo
      const photoBlob = await cameraInputRef.current?.takePhoto();
      if (!photoBlob) {
        alert("Please take a photo before submitting!");
        setIsSubmitting(false);
        return;
      }
      // 2. Build FormData
      const payload = new FormData();
      // ── Scalar fields ──────────────────────────────────────────────────────
      const scalarFields = [
        "gatePassType",
        "passDate",
        "from",
        "to",
        "mobileNo",
        "name",
        "emailId",
        "companyName",
        "address",
        "state",
        "city",
        "representingVisitorType",
        "subLocation",
        "toMeetWith",
        "idType",
        "idNumber",
        "description",
        "maskCovid",
        "noOfPerson",
        "purpose",
        "allowedHours",
      ];
      scalarFields.forEach((key) => {
        payload.append(key, formData[key]);
      });
      // ── carryWith & visitArea: string[] → JSON string ──────────────────────
      payload.append("carryWith", JSON.stringify(formData.carryWith));
      payload.append("visitArea", JSON.stringify(formData.visitArea));
      // ── Persons: send metadata as JSON + each file separately ──────────────
      const personsMetadata = formData.persons.map(
        ({  ...rest }) => rest,
      );
      payload.append("persons", JSON.stringify(personsMetadata));
      // Append each person's aadhar file with a predictable key
      formData.persons.forEach((person, index) => {
        if (person.aadharFile) {
          payload.append(
            `aadharFile_${index}`,
            person.aadharFile,
            person.aadharFile.name,
          );
        }
      });
      // ── Camera photo ───────────────────────────────────────────────────────
      payload.append("photo", photoBlob, "visitor-photo.jpg");
      // 3. POST
      const response = await queryPost(API_ENDPOINTS.UPLOAD, payload);
      console.log("API Response:", response.data);
      alert("Gate pass created successfully!");
      handleClear();
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        error?.response?.data?.message ||
          "Submission failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  // const handleSubmit = async (e: React.FormEvent) =>
  // {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   try {
  //     // 1. Capture photo
  //     const photoBlob = await cameraInputRef.current?.takePhoto();
  //     if (!photoBlob) {
  //       alert("Please take a photo before submitting!");
  //       setIsSubmitting(false);
  //       return;
  //     }
  //     // 2. Build FormData
  //     const payload = new FormData();
  //     // ── Scalar fields ──────────────────────────────────────────────────────
  //     const scalarFields: Array<keyof Omit<FormData, "persons">> = [
  //       "gatePassType",
  //       "passDate",
  //       "from",
  //       "to",
  //       "mobileNo",
  //       "name",
  //       "emailId",
  //       "companyName",
  //       "address",
  //       "state",
  //       "city",
  //       "representingVisitorType",
  //       "subLocation",
  //       "toMeetWith",
  //       "carryWith",
  //       "idType",
  //       "idNumber",
  //       "description",
  //       "maskCovid",
  //       "noOfPerson",
  //       "visitArea",
  //       "purpose",
  //       "allowedHours",
  //     ];
  //     scalarFields.forEach((key) => {
  //       payload.append(key, formData[key] as string);
  //     });
  //     // ── Persons: send metadata as JSON + each file separately ──────────────
  //     const personsMetadata = formData.persons.map(
  //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //       ({ aadharFile: _, ...rest }) => rest,
  //     );
  //     payload.append("persons", JSON.stringify(personsMetadata));
  //     // Append each person's aadhar file with a predictable key
  //     formData.persons.forEach((person, index) => {
  //       if (person.aadharFile) {
  //         payload.append(
  //           `aadharFile_${index}`,
  //           person.aadharFile,
  //           person.aadharFile.name,
  //         );
  //       }
  //     });
  //     // ── Camera photo ───────────────────────────────────────────────────────
  //     payload.append("photo", photoBlob, "visitor-photo.jpg");
  //     // 3. POST
  //     const response = await queryPost(API_ENDPOINTS.UPLOAD, payload);
  //     console.log("API Response:", response.data);
  //     alert("Gate pass created successfully!");
  //     handleClear();
  //   } catch (error: any) {
  //     console.error("Submission error:", error);
  //     alert(
  //       error?.response?.data?.message ||
  //         "Submission failed. Please try again.",
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  // ── Render ─────────────────────────────────────────────────────────────────
  return _jsx("div", {
    className: "min-h-screen bg-surface",
    children: _jsxs(Card, {
      className: "max-w-6xl mx-auto shadow-lg bg-surface",
      children: [
        _jsx(CardHeader, {
          children: _jsx(CardTitle, { children: "Create Gate Pass" }),
        }),
        _jsx(CardContent, {
          className: "p-8",
          children: _jsxs("form", {
            onSubmit: handleSubmit,
            className: "space-y-8",
            children: [
              _jsxs("div", {
                className: "grid grid-cols-2 gap-8",
                children: [
                  _jsx(FormField, {
                    label: "Gate Pass Type",
                    htmlFor: "gatepass-type-single",
                    children: _jsx("div", {
                      className: "space-y-3",
                      children: ["single", "multi"].map((type) =>
                        _jsxs(
                          "label",
                          {
                            className: "flex items-center cursor-pointer",
                            children: [
                              _jsx("input", {
                                type: "radio",
                                id: `gatepass-type-${type}`,
                                name: "gatePassType",
                                value: type,
                                checked: formData.gatePassType === type,
                                onChange: handleInputChange,
                                className: "w-4 h-4 accent-teal-600",
                              }),
                              _jsx("span", {
                                className:
                                  "ml-3 text-sm font-medium capitalize",
                                children:
                                  type === "single"
                                    ? "Single Day"
                                    : "Multi Day",
                              }),
                            ],
                          },
                          type,
                        ),
                      ),
                    }),
                  }),
                  _jsx(FormField, {
                    label: "Pass Date",
                    htmlFor: "pass-date",
                    children: _jsx(Input, {
                      type: "date",
                      id: "pass-date",
                      name: "passDate",
                      value: formData.passDate,
                      onChange: handleInputChange,
                    }),
                  }),
                  formData.gatePassType === "multi" &&
                    _jsxs(_Fragment, {
                      children: [
                        _jsx(FormField, {
                          label: "From",
                          htmlFor: "from",
                          children: _jsx(Input, {
                            type: "date",
                            id: "from",
                            name: "from",
                            disabled: formData.gatePassType !== "multi",
                            value: formData.from,
                            onChange: handleInputChange,
                          }),
                        }),
                        _jsx(FormField, {
                          label: "To",
                          htmlFor: "to",
                          children: _jsx(Input, {
                            type: "date",
                            id: "to",
                            name: "to",
                            disabled: formData.gatePassType !== "multi",
                            value: formData.to,
                            onChange: handleInputChange,
                          }),
                        }),
                      ],
                    }),
                ],
              }),
              _jsxs("div", {
                className: "space-y-6 border-t-2 border-gray-200 pt-6",
                children: [
                  _jsx("h3", {
                    className: "text-lg font-semibold text-gray-800",
                    children: "Personal Information",
                  }),
                  _jsxs("div", {
                    className: "grid grid-cols-2 gap-6",
                    children: [
                      _jsx(FormField, {
                        label: "Name",
                        htmlFor: "name",
                        children: _jsx(Input, {
                          type: "text",
                          id: "name",
                          name: "name",
                          value: formData.name,
                          onChange: handleInputChange,
                          autoComplete: "name",
                          placeholder: "Enter name",
                        }),
                      }),
                      _jsx(FormField, {
                        label: "Mobile No",
                        htmlFor: "mobileNo",
                        children: _jsx(Input, {
                          type: "tel",
                          id: "mobileNo",
                          name: "mobileNo",
                          value: formData.mobileNo,
                          onChange: handleInputChange,
                          placeholder: "Enter mobile number",
                        }),
                      }),
                      _jsx(FormField, {
                        label: "Email-Id",
                        htmlFor: "Email-Id",
                        children: _jsx(Input, {
                          type: "email",
                          id: "Email-Id",
                          name: "emailId",
                          value: formData.emailId,
                          onChange: handleInputChange,
                          placeholder: "Enter email",
                        }),
                      }),
                      _jsx(FormField, {
                        label: "Address",
                        htmlFor: "address",
                        children: _jsx("textarea", {
                          name: "address",
                          id: "address",
                          value: formData.address,
                          onChange: handleInputChange,
                          placeholder: "Enter address",
                          autoComplete: "address",
                          className:
                            "w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none resize-none",
                          rows: 3,
                        }),
                      }),
                    ],
                  }),
                  _jsx("div", {
                    className: "grid grid-cols-2 gap-6",
                    children: _jsx(FormField, {
                      label: "Company Name",
                      htmlFor: "CompanyName",
                      children: _jsx(Input, {
                        type: "text",
                        id: "CompanyName",
                        name: "companyName",
                        value: formData.companyName,
                        onChange: handleInputChange,
                        placeholder: "Enter company name",
                      }),
                    }),
                  }),
                  _jsxs("div", {
                    className: "grid grid-cols-2 gap-6",
                    children: [
                      _jsx(FormField, {
                        label: "State",
                        htmlFor: "state",
                        children: _jsxs("select", {
                          name: "state",
                          id: "state",
                          value: formData.state,
                          onChange: handleStateChange,
                          className:
                            "w-full px-3 py-2 border-b-2 border-gray-300\r\n                    focus:border-red-600 focus:outline-none bg-white",
                          children: [
                            _jsx("option", {
                              value: "",
                              children: "Select State",
                            }),
                            states.map((s) =>
                              _jsx(
                                "option",
                                { value: s.isoCode, children: s.name },
                                s.isoCode,
                              ),
                            ),
                          ],
                        }),
                      }),
                      _jsx(FormField, {
                        label: "City",
                        htmlFor: "city",
                        children: _jsxs("select", {
                          name: "city",
                          id: "city",
                          value: formData.city,
                          disabled: !formData.state,
                          onChange: handleInputChange,
                          className:
                            "w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none bg-white disabled:bg-gray-100",
                          children: [
                            _jsx("option", {
                              value: "",
                              children: "Select City",
                            }),
                            cities.map((c) =>
                              _jsx(
                                "option",
                                { value: c.name, children: c.name },
                                c.name,
                              ),
                            ),
                          ],
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              _jsxs("div", {
                className: "grid grid-cols-2 gap-6",
                children: [
                  _jsx(FormField, {
                    label: "Representing Visitor Type",
                    htmlFor: "representingVisitorType",
                    children: _jsxs("select", {
                      name: "representingVisitorType",
                      id: "representingVisitorType",
                      value: formData.representingVisitorType,
                      onChange: handleInputChange,
                      className:
                        "w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none bg-white",
                      children: [
                        _jsx("option", {
                          value: "",
                          children: "Select Visitor Type",
                        }),
                        visitorType.map((v) =>
                          _jsx(
                            "option",
                            { value: v.name, children: v.name },
                            v._id,
                          ),
                        ),
                      ],
                    }),
                  }),
                  _jsx(FormField, {
                    label: "Sub Location",
                    htmlFor: "subLocation",
                    children: _jsxs("select", {
                      name: "subLocation",
                      id: "subLocation",
                      value: formData.subLocation,
                      onChange: handleInputChange,
                      className:
                        "w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none bg-white",
                      children: [
                        _jsx("option", { value: "", children: "Select" }),
                        _jsx("option", { value: "MAIN", children: "MAIN" }),
                        _jsx("option", { value: "BRANCH", children: "BRANCH" }),
                        _jsx("option", { value: "OFFICE", children: "OFFICE" }),
                      ],
                    }),
                  }),
                ],
              }),
              _jsxs("div", {
                className: "grid grid-cols-2 gap-6",
                children: [
                  _jsx(FormField, {
                    label: "To Meet with Employee",
                    htmlFor: "toMeetWith",
                    children: _jsxs("select", {
                      name: "toMeetWith",
                      id: "toMeetWith",
                      value: formData.toMeetWith,
                      onChange: handleInputChange,
                      className:
                        "w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none bg-white",
                      children: [
                        _jsx("option", { value: "", children: "Select" }),
                        employees.map((e) =>
                          _jsx(
                            "option",
                            { value: e._id, children: e.name },
                            e._id,
                          ),
                        ),
                      ],
                    }),
                  }),
                  _jsx(FormField, {
                    label: "Carry With",
                    htmlFor: "carryWith",
                    children: _jsx("div", {
                      className: "space-y-2",
                      children: carryWith.map((c) =>
                        _jsxs(
                          "label",
                          {
                            className: "flex items-center cursor-pointer",
                            children: [
                              _jsx(Checkbox, {
                                id: `carryWith-${c._id}`,
                                value: c.value,
                                checked: formData.carryWith.includes(c.name),
                                onChange: (e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    carryWith: e.target.checked
                                      ? [...prev.carryWith, c.name]
                                      : prev.carryWith.filter(
                                          (item) => item !== c.name,
                                        ),
                                  })),
                              }),
                              _jsx("span", {
                                className: "ml-2 text-sm uppercase",
                                children: c.name,
                              }),
                            ],
                          },
                          c._id,
                        ),
                      ),
                    }),
                  }),
                ],
              }),
              _jsxs("div", {
                className:
                  "grid grid-cols-2 gap-6 border-t-2 border-gray-200 pt-6",
                children: [
                  _jsx(FormField, {
                    label: "ID Type",
                    htmlFor: "idType",
                    children: _jsxs("select", {
                      name: "idType",
                      id: "idType",
                      value: formData.idType,
                      onChange: handleInputChange,
                      className:
                        "w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none bg-white",
                      children: [
                        _jsx("option", {
                          value: "PASSPORT",
                          children: "PASSPORT",
                        }),
                        _jsx("option", { value: "AADHAR", children: "AADHAR" }),
                        _jsx("option", { value: "PAN", children: "PAN" }),
                        _jsx("option", {
                          value: "DL",
                          children: "DRIVING LICENSE",
                        }),
                      ],
                    }),
                  }),
                  _jsx(FormField, {
                    label: "Id Number",
                    htmlFor: "idNumber",
                    children: _jsx(Input, {
                      type: "text",
                      name: "idNumber",
                      id: "idNumber",
                      value: formData.idNumber,
                      onChange: handleInputChange,
                      placeholder: "Enter ID number",
                    }),
                  }),
                ],
              }),
              _jsxs("div", {
                className: "grid grid-cols-2 gap-6",
                children: [
                  _jsx(FormField, {
                    label: "Description",
                    htmlFor: "description",
                    children: _jsx("textarea", {
                      name: "description",
                      id: "description",
                      value: formData.description,
                      onChange: handleInputChange,
                      placeholder: "Enter description",
                      className:
                        "w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-600 focus:outline-none resize-none",
                      rows: 3,
                    }),
                  }),
                  _jsxs("div", {
                    className: "space-y-4",
                    children: [
                      _jsx(FormField, {
                        label: "Mask/Covid Certificate",
                        htmlFor: "maskCovid",
                        children: _jsx("div", {
                          className: "space-y-2",
                          children: ["yes", "no"].map((val) =>
                            _jsxs(
                              "label",
                              {
                                className: "flex items-center cursor-pointer",
                                children: [
                                  _jsx("input", {
                                    type: "radio",
                                    id: `maskCovid-${val}`,
                                    name: "maskCovid",
                                    value: val,
                                    checked: formData.maskCovid === val,
                                    onChange: handleInputChange,
                                    className: "w-4 h-4 accent-teal-600",
                                  }),
                                  _jsx("span", {
                                    className: "ml-2 text-sm capitalize",
                                    children: val,
                                  }),
                                ],
                              },
                              val,
                            ),
                          ),
                        }),
                      }),
                      _jsx(FormField, {
                        label: "No of Person",
                        htmlFor: "noOfPerson",
                        children: _jsx(Input, {
                          type: "number",
                          id: "noOfPerson",
                          name: "noOfPerson",
                          value: formData.noOfPerson,
                          onChange: handleInputChange,
                          placeholder: "Enter number",
                          min: "1",
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              _jsxs("div", {
                className: "border-t-2 border-gray-200 pt-6",
                children: [
                  _jsx("h3", {
                    className: "text-lg font-semibold text-gray-800 mb-4",
                    children: "Person Details",
                  }),
                  formData.persons.map((person, index) =>
                    _jsx(
                      "div",
                      {
                        className: "mb-6 p-4 bg-gray-50 rounded-lg",
                        children: _jsxs("div", {
                          className: "grid grid-cols-4 gap-4",
                          children: [
                            _jsx(FormField, {
                              label: "Person Name",
                              htmlFor: `person-name-${index}`,
                              children: _jsx(Input, {
                                id: `person-name-${index}`,
                                name: `person[${index}].name`,
                                type: "text",
                                autoComplete: "name",
                                value: person.name,
                                onChange: (e) =>
                                  handlePersonChange(
                                    index,
                                    "name",
                                    e.target.value,
                                  ),
                              }),
                            }),
                            _jsx(FormField, {
                              label: "Person Phone No",
                              htmlFor: `person-phone-${index}`,
                              children: _jsx(Input, {
                                id: `person-phone-${index}`,
                                name: `person[${index}].phoneNo`,
                                type: "tel",
                                autoComplete: "tel",
                                value: person.phoneNo,
                                onChange: (e) =>
                                  handlePersonChange(
                                    index,
                                    "phoneNo",
                                    e.target.value,
                                  ),
                              }),
                            }),
                            _jsx(FormField, {
                              label: "Aadhar Number",
                              htmlFor: `person-aadhar-${index}`,
                              children: _jsx(Input, {
                                id: `person-aadhar-${index}`,
                                name: `person[${index}].aadharNumber`,
                                type: "text",
                                autoComplete: "off",
                                value: person.aadharNumber,
                                onChange: (e) =>
                                  handlePersonChange(
                                    index,
                                    "aadharNumber",
                                    e.target.value,
                                  ),
                              }),
                            }),
                            _jsx(FormField, {
                              label: "Aadhar File",
                              htmlFor: `file-${index}`,
                              children: _jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  _jsx("input", {
                                    type: "file",
                                    id: `file-${index}`,
                                    name: `person[${index}].aadharFile`,
                                    className: "hidden",
                                    accept: "image/*,.pdf",
                                    onChange: (e) =>
                                      handlePersonChange(
                                        index,
                                        "aadharFile",
                                        e.target.files?.[0] || null,
                                      ),
                                  }),
                                  _jsx("label", {
                                    htmlFor: `file-${index}`,
                                    className:
                                      "px-3 py-2 bg-white border border-gray-300 rounded cursor-pointer text-xs",
                                    children: person.aadharFile
                                      ? person.aadharFile.name
                                      : "Choose File",
                                  }),
                                  formData.persons.length > 1 &&
                                    _jsx(Button, {
                                      type: "button",
                                      onClick: () => removePerson(index),
                                      className:
                                        "bg-red-600 text-white text-xs px-2 py-1",
                                      children: "X",
                                    }),
                                ],
                              }),
                            }),
                          ],
                        }),
                      },
                      index,
                    ),
                  ),
                  _jsx(Button, {
                    type: "button",
                    onClick: addPerson,
                    className: "bg-red-600 text-white px-4 py-2",
                    children: "+ Add Person",
                  }),
                ],
              }),
              _jsxs("div", {
                className: "border-t-2 border-gray-200 pt-6",
                children: [
                  _jsx("h3", {
                    className: "text-lg font-semibold text-gray-800 mb-4",
                    children: "Visit Area",
                  }),
                  _jsx("div", {
                    className: "grid grid-cols-3 gap-4",
                    children: visitorArea.map((v) =>
                      _jsxs(
                        "label",
                        {
                          className: "flex items-center cursor-pointer",
                          children: [
                            _jsx(Checkbox, {
                              checked: formData.visitArea.includes(v.name),
                              onChange: (e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  visitArea: e.target.checked
                                    ? [...prev.visitArea, v.name]
                                    : prev.visitArea.filter(
                                        (item) => item !== v.name,
                                      ),
                                })),
                              value: v.name,
                            }),
                            _jsx("span", {
                              className: "ml-2 text-sm",
                              children: v.name,
                            }),
                          ],
                        },
                        v._id,
                      ),
                    ),
                  }),
                ],
              }),
              _jsxs("div", {
                className:
                  "grid grid-cols-2 gap-6 border-t-2 border-gray-200 pt-6",
                children: [
                  _jsx(FormField, {
                    label: "Purpose",
                    htmlFor: "purpose",
                    children: _jsxs("select", {
                      name: "purpose",
                      id: "purpose",
                      value: formData.purpose,
                      onChange: handleInputChange,
                      className:
                        "w-full px-3 py-2 border-b-2 border-gray-300 outline-none",
                      children: [
                        _jsx("option", { value: "", children: "Select" }),
                        purposes.map((e) =>
                          _jsx(
                            "option",
                            { value: e._id, children: e.name },
                            e._id,
                          ),
                        ),
                      ],
                    }),
                  }),
                  _jsx(FormField, {
                    label: "Allowed Hours",
                    htmlFor: "allowedHours",
                    children: _jsx(Input, {
                      name: "allowedHours",
                      id: "allowedHours",
                      value: formData.allowedHours,
                      onChange: handleInputChange,
                    }),
                  }),
                ],
              }),
              _jsxs("div", {
                className: "border-t-2 border-gray-200 pt-6",
                children: [
                  _jsx("h3", {
                    className: "text-lg font-semibold text-gray-800 mb-4",
                    children: "Visitor Photo",
                  }),
                  _jsx(CameraInput, {
                    ref: cameraInputRef,
                    width: "400px",
                    height: "300px",
                    onCapture: () => {},
                  }),
                ],
              }),
              _jsxs("div", {
                className:
                  "flex gap-4 justify-center border-t-2 border-gray-200 pt-6",
                children: [
                  _jsx(Button, {
                    type: "submit",
                    disabled: isSubmitting,
                    className:
                      "px-8 py-2 bg-red-600 text-white font-semibold rounded disabled:opacity-60",
                    children: isSubmitting ? "Submitting…" : "Submit",
                  }),
                  _jsx(Button, {
                    type: "button",
                    onClick: handleClear,
                    className:
                      "px-8 py-2 bg-gray-500 text-white font-semibold rounded",
                    children: "Clear",
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    }),
  });
};
export default CreatePassPage;
