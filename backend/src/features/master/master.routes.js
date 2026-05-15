"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const master_controller_1 = require("../master/master.controller");
const router = (0, express_1.Router)();
// ─────────────────────────────────────────────────────────────
// Employee Routes  →  /api/master/employee
// ─────────────────────────────────────────────────────────────
router.get("/employee", master_controller_1.getEmployee);
router.post("/employee", master_controller_1.createEmployee);
router.put("/employee/:id", master_controller_1.updateEmployee);
router.delete("/employee/:id", master_controller_1.deleteEmployee);
// ─────────────────────────────────────────────────────────────
// Purpose Routes  →  /api/master/purpose
// ─────────────────────────────────────────────────────────────
router.get("/purpose", master_controller_1.getPurpose);
router.post("/purpose", master_controller_1.createPurpose);
router.put("/purpose/:id", master_controller_1.updatePurpose);
router.delete("/purpose/:id", master_controller_1.deletePurpose);
// ─────────────────────────────────────────────────────────────
// Visiting Area Routes  →  /api/master/visiting-area
// ─────────────────────────────────────────────────────────────
router.get("/visiting-area", master_controller_1.getVisitingArea);
router.post("/visiting-area", master_controller_1.createVisitingArea);
router.put("/visiting-area/:id", master_controller_1.updateVisitingArea);
router.delete("/visiting-area/:id", master_controller_1.deleteVisitingArea);
// ─────────────────────────────────────────────────────────────
// Carry-With Routes  →  /api/master/carry-with
// ─────────────────────────────────────────────────────────────
router.get("/carry-with", master_controller_1.getCarryWith);
router.post("/carry-with", master_controller_1.createCarryWith);
router.put("/carry-with/:id", master_controller_1.updateCarryWith);
router.delete("/carry-with/:id", master_controller_1.deleteCarryWith);
// ─────────────────────────────────────────────────────────────
// Visitor Type Routes  →  /api/master/visitor-type
// ─────────────────────────────────────────────────────────────
router.get("/visitor-type", master_controller_1.getVisitorType);
router.post("/visitor-type", master_controller_1.createVisitorType);
router.put("/visitor-type/:id", master_controller_1.updateVisitorType);
router.delete("/visitor-type/:id", master_controller_1.deleteVisitorType);
exports.default = router;
