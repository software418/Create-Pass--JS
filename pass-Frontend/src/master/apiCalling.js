import {
  queryGet,
  queryPost,
  queryPut,
  queryDelete,
} from "@/shared/services/api";
import { API_ENDPOINTS } from "@/shared/const/api";
const unwrapData = (res) => res.data?.data || res.data;
//----------------------Employee CRUD Calling---------------------------------------
export const getEmployee = () => {
  return queryGet(
    API_ENDPOINTS.EMPLOYEE,
    {},
    { cache: true, tags: ["employee"] },
  ).then((res) => unwrapData(res).employee || unwrapData(res));
};
export const createEmployee = (payload) => {
  return queryPost(
    API_ENDPOINTS.EMPLOYEE,
    payload,
    {},
    { invalidateTags: ["employee"] },
  ).then(unwrapData);
};
export const updateEmployee = (id, payload) => {
  return queryPut(
    `${API_ENDPOINTS.EMPLOYEE}/${id}`,
    payload,
    {},
    { invalidateTags: ["employee", `employee/${id}`] },
  ).then(unwrapData);
};
export const deleteEmployee = (id) => {
  return queryDelete(
    `${API_ENDPOINTS.EMPLOYEE}/${id}`,
    {},
    { invalidateTags: ["employee", `employee/${id}`] },
  ).then(unwrapData);
};
//-----------------------Purposse CRUD Calling-------------------------------------
export const getPurpose = () => {
  return queryGet(
    API_ENDPOINTS.PURPOSE,
    {},
    { cache: true, tags: ["purpose"] },
  ).then((res) => unwrapData(res).purpose || unwrapData(res));
};
export const createpurpose = (payload) => {
  return queryPost(
    API_ENDPOINTS.PURPOSE,
    payload,
    {},
    { invalidateTags: ["purpose"] },
  ).then(unwrapData);
};
export const updatePurpose = (id, payload) => {
  return queryPut(
    `${API_ENDPOINTS.PURPOSE}/${id}`,
    payload,
    {},
    { invalidateTags: ["purpose", `purpose/${id}`] },
  ).then(unwrapData);
};
export const deletePurpose = (id) => {
  return queryDelete(
    `${API_ENDPOINTS.PURPOSE}/${id}`,
    {},
    { invalidateTags: ["purpose", `purpose/${id}`] },
  ).then(unwrapData);
};
//----------------------Visiting Area CRUD Calling--------------------------------
export const getVisitingArea = () => {
  return queryGet(
    API_ENDPOINTS.VISITING_AREA,
    {},
    { cache: true, tags: ["area"] },
  ).then((res) => unwrapData(res).visitingAreas || unwrapData(res));
};
export const createVisitingArea = (payload) => {
  return queryPost(
    API_ENDPOINTS.VISITING_AREA,
    payload,
    {},
    { invalidateTags: ["area"] },
  ).then(unwrapData);
};
export const updateVisitingArea = (id, payload) => {
  return queryPut(
    `${API_ENDPOINTS.VISITING_AREA}/${id}`,
    payload,
    {},
    { invalidateTags: ["area", `area/${id}`] },
  ).then(unwrapData);
};
export const deleteVisitingArea = (id) => {
  return queryDelete(
    `${API_ENDPOINTS.VISITING_AREA}/${id}`,
    {},
    { invalidateTags: ["area", `area/${id}`] },
  ).then(unwrapData);
};
//-----------------Visitor Type CRUD Calling---------------------------------------
export const getVisitorType = () => {
  return queryGet(
    API_ENDPOINTS.VISITOR_TYPE,
    {},
    { cache: true, tags: ["visitorType"] },
  ).then((res) => unwrapData(res).visitorTypes || unwrapData(res));
};
export const createVisitorType = (payload) => {
  return queryPost(
    API_ENDPOINTS.VISITOR_TYPE,
    payload,
    {},
    { invalidateTags: ["visitorType"] },
  ).then(unwrapData);
};
export const updateVisitorType = (id, payload) => {
  return queryPut(
    `${API_ENDPOINTS.VISITOR_TYPE}/${id}`,
    payload,
    {},
    { invalidateTags: ["visitorType", `visitorType/${id}`] },
  ).then(unwrapData);
};
export const deleteVisitorType = (id) => {
  return queryDelete(
    `${API_ENDPOINTS.VISITOR_TYPE}/${id}`,
    {},
    { invalidateTags: ["visitorType", `visitorType/${id}`] },
  ).then(unwrapData);
};
//---------------------Carry With CRUD calling--------------------------------
export const getCarryWith = () => {
  return queryGet(
    API_ENDPOINTS.CARRY_WITH,
    {},
    { cache: true, tags: ["carryWith"] },
  ).then((res) => unwrapData(res).carryWithItems || unwrapData(res));
};
export const createCarryWith = (payload) => {
  return queryPost(
    API_ENDPOINTS.CARRY_WITH,
    payload,
    {},
    { invalidateTags: ["carryWith"] },
  ).then(unwrapData);
};
export const updateCarryWith = (id, payload) => {
  return queryPut(
    `${API_ENDPOINTS.CARRY_WITH}/${id}`,
    payload,
    {},
    { invalidateTags: ["carryWith", `carryWith/${id}`] },
  ).then(unwrapData);
};
export const deleteCarryWith = (id) => {
  return queryDelete(
    `${API_ENDPOINTS.CARRY_WITH}/${id}`,
    {},
    { invalidateTags: ["carryWith", `carryWith/${id}`] },
  ).then(unwrapData);
};
