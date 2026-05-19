/* eslint-disable react-hooks/refs */

import React, { useState } from "react";
import { Button } from "@/shared/ui/atoms/Button";
import { Checkbox } from "@/shared/ui/atoms/Checkbox";
import { FormField } from "@/shared/ui/molecules/FormField";
import { Input } from "@/shared/ui/atoms/Input";
import { queryPost } from "@/shared/services/api";
import { API_ENDPOINTS } from "@/shared/const/api";
import { useLocationUtils } from "@/shared/hooks/useLocation";
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
import { useLocation } from "@/features/location/useLocation";
import { useIdType } from "@/features/id_type/useIdType";
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
  const { states, cities, setSelectedState } = useLocationUtils();
  const { employees } = useEmployees();
  const { carryWith } = useCarryWith();
  const { purposes } = usePurpose();
  const { visitorArea } = useVisitorArea();
  const { visitorType } = useVisitorType();
  const { location } = useLocation();
  const { idType } = useIdType();
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
      const personsMetadata = formData.persons.map(({ ...rest }) => rest);
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
  return (
    <div className="page-container">
      {
        <Card className="page-card">
          {<CardHeader>{<CardTitle>Create Gate Pass</CardTitle>}</CardHeader>}
          {
            <CardContent className="page-card-content">
              {
                <form onSubmit={handleSubmit} className="form-container">
                  {
                    <div className="form-grid-2">
                      {
                        <FormField
                          label="Gate Pass Type"
                          htmlFor="gatepass-type-single"
                        >
                          {
                            <div className="form-radio-group">
                              {["single", "multi"].map((type) => (
                                <label key={type} className="form-radio-label">
                                  {
                                    <input
                                      type="radio"
                                      id={`gatepass-type-${type}`}
                                      name="gatePassType"
                                      value={type}
                                      checked={formData.gatePassType === type}
                                      onChange={handleInputChange}
                                      className="form-radio-input"
                                    />
                                  }
                                  {
                                    <span className="form-radio-text">
                                      {type === "single"
                                        ? "Single Day"
                                        : "Multi Day"}
                                    </span>
                                  }
                                </label>
                              ))}
                            </div>
                          }
                        </FormField>
                      }
                      {
                        <FormField label="Pass Date" htmlFor="pass-date">
                          {
                            <Input
                              type="date"
                              id="pass-date"
                              name="passDate"
                              value={formData.passDate}
                              onChange={handleInputChange}
                            />
                          }
                        </FormField>
                      }
                      {formData.gatePassType === "multi" && (
                        <>
                          {
                            <FormField label="From" htmlFor="from">
                              {
                                <Input
                                  type="date"
                                  id="from"
                                  name="from"
                                  disabled={formData.gatePassType !== "multi"}
                                  value={formData.from}
                                  onChange={handleInputChange}
                                />
                              }
                            </FormField>
                          }
                          {
                            <FormField label="To" htmlFor="to">
                              {
                                <Input
                                  type="date"
                                  id="to"
                                  name="to"
                                  disabled={formData.gatePassType !== "multi"}
                                  value={formData.to}
                                  onChange={handleInputChange}
                                />
                              }
                            </FormField>
                          }
                        </>
                      )}
                    </div>
                  }
                  {
                    <div className="form-section">
                      {
                        <h3 className="form-section-title">
                          Personal Information
                        </h3>
                      }
                      {
                        <div className="form-grid-2 gap-6">
                          {
                            <FormField label="Name" htmlFor="name">
                              {
                                <Input
                                  type="text"
                                  id="name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  autoComplete="name"
                                  placeholder="Enter name"
                                />
                              }
                            </FormField>
                          }
                          {
                            <FormField label="Mobile No" htmlFor="mobileNo">
                              {
                                <Input
                                  type="tel"
                                  id="mobileNo"
                                  name="mobileNo"
                                  value={formData.mobileNo}
                                  onChange={handleInputChange}
                                  placeholder="Enter mobile number"
                                />
                              }
                            </FormField>
                          }
                          {
                            <FormField label="Email-Id" htmlFor="Email-Id">
                              {
                                <Input
                                  type="email"
                                  id="Email-Id"
                                  name="emailId"
                                  value={formData.emailId}
                                  onChange={handleInputChange}
                                  placeholder="Enter email"
                                />
                              }
                            </FormField>
                          }
                          {
                            <FormField label="Address" htmlFor="address">
                              {
                                <textarea
                                  name="address"
                                  id="address"
                                  value={formData.address}
                                  onChange={handleInputChange}
                                  placeholder="Enter address"
                                  autoComplete="address"
                                  className="form-textarea"
                                  rows={3}
                                />
                              }
                            </FormField>
                          }
                        </div>
                      }
                      {
                        <div className="form-grid-2 gap-6">
                          {
                            <FormField
                              label="Company Name"
                              htmlFor="CompanyName"
                            >
                              {
                                <Input
                                  type="text"
                                  id="CompanyName"
                                  name="companyName"
                                  value={formData.companyName}
                                  onChange={handleInputChange}
                                  placeholder="Enter company name"
                                />
                              }
                            </FormField>
                          }
                        </div>
                      }
                      {
                        <div className="form-grid-2 gap-6">
                          {
                            <FormField label="State" htmlFor="state">
                              {
                                <select
                                  name="state"
                                  id="state"
                                  value={formData.state}
                                  onChange={handleStateChange}
                                  className="form-select"
                                >
                                  <option value="">Select State</option>
                                  {states.map((s, index) => (
                                    <option key={s.isoCode || index} value={s.isoCode}>{s.name}</option>
                                  ))}
                                </select>
                              }
                            </FormField>
                          }
                          {
                            <FormField label="City" htmlFor="city">
                              {
                                <select
                                  name="city"
                                  id="city"
                                  value={formData.city}
                                  disabled={!formData.state}
                                  onChange={handleInputChange}
                                  className="form-select-disabled"
                                >
                                  <option value="">Select City</option>
                                  {cities.map((c, index) => (
                                    <option key={c.name || index} value={c.name}>{c.name}</option>
                                  ))}
                                </select>
                              }
                            </FormField>
                          }
                        </div>
                      }
                    </div>
                  }
                  {
                    <div className="form-grid-2 gap-6">
                      {
                        <FormField
                          label="Representing Visitor Type"
                          htmlFor="representingVisitorType"
                        >
                          {
                            <select
                              name="representingVisitorType"
                              id="representingVisitorType"
                              value={formData.representingVisitorType}
                              onChange={handleInputChange}
                              className="form-select"
                            >
                              <option value="">Select Visitor Type</option>
                              {visitorType.map((v, index) => (
                                <option key={v._id || v.name || index} value={v.name}>{v.name}</option>
                              ))}
                            </select>
                          }
                        </FormField>
                      }
                      {
                        <FormField label="Sub Location" htmlFor="subLocation">
                          {
                            <select
                              name="subLocation"
                              id="subLocation"
                              value={formData.subLocation}
                              onChange={handleInputChange}
                              className="form-select"
                            >
                              <option value="">Select Location</option>
                              {location.map((v, index) => (
                                <option key={v._id || v.name || index} value={v.name}>{v.name}</option>
                              ))}
                            </select>
                          }
                        </FormField>
                      }
                    </div>
                  }
                  {
                    <div className="form-grid-2 gap-6">
                      {
                        <FormField
                          label="To Meet with Employee"
                          htmlFor="toMeetWith"
                        >
                          {
                            <select
                              name="toMeetWith"
                              id="toMeetWith"
                              value={formData.toMeetWith}
                              onChange={handleInputChange}
                              className="form-select"
                            >
                              <option value="">Select</option>
                              {employees.map((e, index) => (
                                <option key={e._id || index} value={e._id}>{e.name}</option>
                              ))}
                            </select>
                          }
                        </FormField>
                      }
                      {
                        <FormField label="Carry With" htmlFor="carryWith">
                          {
                            <div className="form-radio-group-compact">
                              {carryWith.map((c) => (
                                <label key={c._id || c.name} className="form-radio-label">
                                  {
                                    <Checkbox
                                      id={`carryWith`}
                                      value={c.value}
                                      checked={formData.carryWith.includes(
                                        c.name,
                                      )}
                                      onChange={(e) =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          carryWith: e.target.checked
                                            ? [...prev.carryWith, c.name]
                                            : prev.carryWith.filter(
                                              (item) => item !== c.name,
                                            ),
                                        }))
                                      }
                                    />
                                  }
                                  {
                                    <span className="form-radio-text-sm">
                                      {c.name}
                                    </span>
                                  }
                                </label>
                              ))}
                            </div>
                          }
                        </FormField>
                      }
                    </div>
                  }
                  {
                    <div className="form-section form-grid-2 gap-6">
                      {
                        <FormField label="ID Type" htmlFor="idType">
                          {
                            <select
                              name="idType"
                              id="idType"
                              value={formData.idType}
                              onChange={handleInputChange}
                              className="form-select"
                            >
                              <option value="">Select ID Type</option>
                              {idType.map((v, index) => (
                                <option key={v._id || v.name || index} value={v.name}>{v.name}</option>
                              ))}
                            </select>
                          }
                        </FormField>
                      }
                      {
                        <FormField label="Id Number" htmlFor="idNumber">
                          {
                            <Input
                              type="text"
                              name="idNumber"
                              id="idNumber"
                              value={formData.idNumber}
                              onChange={handleInputChange}
                              placeholder="Enter ID number"
                            />
                          }
                        </FormField>
                      }
                    </div>
                  }
                  {
                    <div className="form-grid-2 gap-6">
                      {
                        <FormField label="Description" htmlFor="description">
                          {
                            <textarea
                              name="description"
                              id="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              placeholder="Enter description"
                              className="form-textarea"
                              rows={3}
                            />
                          }
                        </FormField>
                      }
                      {
                        <div className="space-y-4">
                          {
                            <FormField
                              label="Mask/Covid Certificate"
                              htmlFor="maskCovid"
                            >
                              {
                                <div className="form-radio-group-compact">
                                  {["yes", "no"].map((val) => (
                                    <label key={val} className="form-radio-label">
                                      {
                                        <input
                                          type="radio"
                                          id={`maskCovid`}
                                          name="maskCovid"
                                          value={val}
                                          checked={formData.maskCovid === val}
                                          onChange={handleInputChange}
                                          className="form-radio-input"
                                        />
                                      }
                                      {
                                        <span className="form-radio-text-sm">
                                          {val}
                                        </span>
                                      }
                                    </label>
                                  ))}
                                </div>
                              }
                            </FormField>
                          }
                          {
                            <FormField
                              label="No of Person"
                              htmlFor="noOfPerson"
                            >
                              {
                                <Input
                                  type="number"
                                  id="noOfPerson"
                                  name="noOfPerson"
                                  value={formData.noOfPerson}
                                  onChange={handleInputChange}
                                  placeholder="Enter number"
                                  min="1"
                                />
                              }
                            </FormField>
                          }
                        </div>
                      }
                    </div>
                  }
                  {
                    <div className="form-section">
                      {
                        <h3 className="form-section-title-mb">
                          Person Details
                        </h3>
                      }
                      {formData.persons.map((person, index) => (
                        <div key={index} className="person-card">
                          {
                            <div className="form-grid-4">
                              {
                                <FormField
                                  label="Person Name"
                                  htmlFor={`person-name-${index}`}
                                >
                                  {
                                    <Input
                                      id={`person-name-${index}`}
                                      name={`person[${index}].name`}
                                      type="text"
                                      autoComplete="name"
                                      value={person.name}
                                      onChange={(e) =>
                                        handlePersonChange(
                                          index,
                                          "name",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  }
                                </FormField>
                              }
                              {
                                <FormField
                                  label="Person Phone No"
                                  htmlFor={`person-phone-${index}`}
                                >
                                  {
                                    <Input
                                      id={`person-phone-${index}`}
                                      name={`person[${index}].phoneNo`}
                                      type="tel"
                                      autoComplete="tel"
                                      value={person.phoneNo}
                                      onChange={(e) =>
                                        handlePersonChange(
                                          index,
                                          "phoneNo",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  }
                                </FormField>
                              }
                              {
                                <FormField
                                  label="Aadhar Number"
                                  htmlFor={`person-aadhar-${index}`}
                                >
                                  {
                                    <Input
                                      id={`person-aadhar-${index}`}
                                      name={`person[${index}].aadharNumber`}
                                      type="text"
                                      autoComplete="off"
                                      value={person.aadharNumber}
                                      onChange={(e) =>
                                        handlePersonChange(
                                          index,
                                          "aadharNumber",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  }
                                </FormField>
                              }
                              {
                                <FormField
                                  label="Aadhar File"
                                  htmlFor={`file-${index}`}
                                >
                                  {
                                    <div className="flex items-center gap-2">
                                      {
                                        <input
                                          type="file"
                                          id={`file-${index}`}
                                          name={`person[${index}].aadharFile`}
                                          className="hidden"
                                          accept="image/*,.pdf"
                                          onChange={(e) =>
                                            handlePersonChange(
                                              index,
                                              "aadharFile",
                                              e.target.files?.[0] || null,
                                            )
                                          }
                                        />
                                      }
                                      {
                                        <label
                                          htmlFor={`file-${index}`}
                                          className="form-file-label"
                                        >
                                          {person.aadharFile
                                            ? person.aadharFile.name
                                            : "Choose File"}
                                        </label>
                                      }
                                      {formData.persons.length > 1 && (
                                        <Button
                                          type="button"
                                          onClick={() => removePerson(index)}
                                          className="person-remove-btn"
                                        >
                                          X
                                        </Button>
                                      )}
                                    </div>
                                  }
                                </FormField>
                              }
                            </div>
                          }
                        </div>
                      ))}
                      {
                        <Button
                          type="button"
                          onClick={addPerson}
                          className="person-add-btn"
                        >
                          + Add Person
                        </Button>
                      }
                    </div>
                  }
                  {
                    <div className="form-section">
                      {
                        <h3 className="form-section-title-mb">
                          Visit Area
                        </h3>
                      }
                      {
                        <div className="grid grid-cols-3 gap-4">
                          {visitorArea.map((v) => (
                            <label key={v._id || v.name} className="form-radio-label">
                              {
                                <Checkbox
                                  checked={formData.visitArea.includes(v.name)}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      visitArea: e.target.checked
                                        ? [...prev.visitArea, v.name]
                                        : prev.visitArea.filter(
                                          (item) => item !== v.name,
                                        ),
                                    }))
                                  }
                                  value={v.name}
                                />
                              }
                              {<span className="form-radio-text-sm">{v.name}</span>}
                            </label>
                          ))}
                        </div>
                      }
                    </div>
                  }
                  {
                    <div className="form-section form-grid-2 gap-6">
                      {
                        <FormField label="Purpose" htmlFor="purpose">
                          {
                            <select
                              name="purpose"
                              id="purpose"
                              value={formData.purpose}
                              onChange={handleInputChange}
                              className="form-select"
                            >
                              <option value="">Select</option>
                              {purposes.map((e, index) => (
                                <option key={e._id || index} value={e._id}>{e.name}</option>
                              ))}
                            </select>
                          }
                        </FormField>
                      }
                      {
                        <FormField label="Allowed Hours" htmlFor="allowedHours">
                          {
                            <Input
                              name="allowedHours"
                              id="allowedHours"
                              value={formData.allowedHours}
                              onChange={handleInputChange}
                            />
                          }
                        </FormField>
                      }
                    </div>
                  }
                  {
                    <div className="form-section">
                      {
                        <h3 className="form-section-title-mb">
                          Visitor Photo
                        </h3>
                      }
                      {
                        <CameraInput
                          ref={cameraInputRef}
                          width="400px"
                          height="300px"
                          onCapture={() => { }}
                        />
                      }
                    </div>
                  }
                  {
                    <div className="form-actions">
                      {
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-danger px-8 py-2"
                        >
                          {isSubmitting ? "Submitting…" : "Submit"}
                        </Button>
                      }
                      {
                        <Button
                          type="button"
                          onClick={handleClear}
                          className="btn btn-secondary px-8 py-2"
                        >
                          Clear
                        </Button>
                      }
                    </div>
                  }
                </form>
              }
            </CardContent>
          }
        </Card>
      }
    </div>
  );
};
export default CreatePassPage;
