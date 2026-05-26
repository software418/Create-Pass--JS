# Enterprise VMS Feature & Workflow Plan

This document outlines the high-level features and operational workflows for the new Enterprise Visitor Management System (VMS) architecture. 

## 1. Dynamic Roles & Permissions System
Instead of hardcoded roles, the system will use a fully dynamic, permission-based architecture.
*   **Super Admin Control Panel:** A dedicated page where the Super Admin can create custom User Types (Roles) like "Senior Guard" or "HR Auditor".
*   **Granular Permissions:** The Super Admin can toggle specific CRUD (Create, Read, Update, Delete) permissions for every feature in the system and assign them to roles.
*   **Permission-Based UI:** The VMS interface (Sidebar, Dashboards, Buttons) will dynamically render based *only* on the permissions assigned to the logged-in user. If a user does not have permission to view a field, it will be strictly hidden.

## 2. In-App Notification Center
We are completely removing the external SMTP email service to improve reliability and security.
*   **Real-Time Alerts:** A notification bell icon will be added to the top navigation bar.
*   **Triggers:** The system will send instant, in-app notifications to users when:
    *   A visitor checks in at the gate.
    *   A pass requires their approval.

## 3. Manager Approval Hierarchy
We are introducing a strict organizational hierarchy to handle gate pass approvals securely.
*   **Employee-Manager Link:** Every Employee profile will be linked to a `managerId`.
*   **The Workflow:** 
    *   When an Employee requests a pass for a visitor, the request is automatically routed to their Manager (or higher level) for approval.
    *   If a walk-in visitor arrives and the Guard logs them at the gate, the approval request is sent to the Host Employee's Manager.
*   **Manager Dashboard:** Managers will have a dedicated "Approvals Queue" to manage pending passes from their subordinates.

## 4. Guard & User Management
*   **User Creation:** Admins and Super Admins can create new system users (Employees, Managers, Guards) from the dashboard.
*   **Checkpost Assignments:** When creating a Guard account, the Admin permanently assigns them to a specific `Location` (e.g., Main Gate, Service Entry). Guards cannot change this location and will only see traffic logs relevant to their checkpost.
*   **Linked Accounts:** Every login `User` is strictly tied to an `Employee` profile using an `employeeId`. Managers are treated as Employees who hold an Admin/Manager Role.
