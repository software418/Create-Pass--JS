export const BLANK_COMPANY_REGISTER = {
  companyFullName: "",
  companyShortName: "",
  companyContactNo: "",
  logoUrl: "",
  hostName: "",
  portNo: "",
  userEmailId: "",
  emailPassword: "",
};

export function mapRecordToForm(record) {
  if (!record) return { ...BLANK_COMPANY_REGISTER };
  return {
    companyFullName: record.companyFullName ?? "",
    companyShortName: record.companyShortName ?? "",
    companyContactNo: record.companyContactNo ?? "",
    logoUrl: record.logoUrl ?? "",
    hostName: record.hostName ?? "",
    portNo:
      record.portNo === 0 || record.portNo
        ? String(record.portNo)
        : "",
    userEmailId: record.userEmailId ?? "",
    emailPassword: record.emailPassword ?? "",
  };
}

export function buildCompanyRegisterFormData(form, logoFile) {
  const fd = new FormData();
  fd.append("companyFullName", form.companyFullName.trim());
  fd.append("companyShortName", form.companyShortName.trim());
  fd.append("companyContactNo", form.companyContactNo.trim());
  fd.append("hostName", form.hostName.trim());
  fd.append("portNo", form.portNo === "" ? "0" : String(form.portNo));
  fd.append("userEmailId", form.userEmailId.trim());
  fd.append("emailPassword", form.emailPassword);
  if (logoFile) fd.append("logo", logoFile);
  return fd;
}
