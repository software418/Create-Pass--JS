"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormData = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PersonDetailSchema = new mongoose_1.Schema(
  {
    name: { type: String, required: true },
    phoneNo: { type: String, required: true },
    aadharNumber: { type: String, required: true },
    aadharFileUrl: { type: String, default: "" }, // URL set by the service after saving the file
  },
  { _id: false },
);
const FormDataSchema = new mongoose_1.Schema(
  {
    gatePassType: { type: String, enum: ["single", "multi"], required: true },
    passDate: { type: Date, required: true },
    from: { type: Date },
    to: { type: Date },
    mobileNo: { type: String, required: true, index: true },
    name: { type: String, required: true },
    emailId: { type: String, required: true },
    companyName: String,
    address: String,
    state: String,
    city: String,
    representingVisitorType: String,
    subLocation: String,
    toMeetWith: String,
    carryWith: { type: [String], default: [] },
    idType: String,
    idNumber: String,
    description: String,
    maskCovid: { type: String, enum: ["yes", "no", ""], default: "" },
    noOfPerson: { type: Number, default: 0 },
    persons: [PersonDetailSchema],
    visitArea: [String],
    purpose: String,
    allowedHours: String,
    photoUrl: { type: String, default: "" }, // Visitor webcam photo URL
  },
  { timestamps: true },
);
exports.FormData = mongoose_1.default.model("FormData", FormDataSchema);
