---
title: "Homework 1: Security Analysis of a Web Application"
course: "css"
date: 2025-04-02
tags: ["Threat Modeling", "STRIDE", "Vulnerabilities", "Security"]
description: "Perform a security analysis of a provided web application, including threat modeling and vulnerability identification."
solutionsAvailable: false
---

## Overview

- **Due date**: April 16, 2025
- **Submission**: PDF report via the course portal
- **Collaboration policy**: Groups of up to 2 students.

## Context

You are given access to a simple web application (a student grade management system). The application allows:

- Students to view their own grades
- Professors to enter and modify grades
- Administrators to manage user accounts

The source code is available at the repository linked in the course resources.

## Task 1: Threat Model (40 points)

1. Draw a Data Flow Diagram (DFD) for the application, identifying:
   - External entities
   - Processes
   - Data stores
   - Data flows
   - Trust boundaries

2. Apply the STRIDE framework to identify at least **6 threats** (at least one per STRIDE category).

3. For each threat, propose a specific mitigation.

## Task 2: Vulnerability Identification (35 points)

Review the application source code and identify at least **4 vulnerabilities**. For each:

1. Describe the vulnerability and its location in the code.
2. Classify it (CWE number if possible, or OWASP Top 10 category).
3. Explain the potential impact.
4. Provide a concrete fix (code snippet or configuration change).

## Task 3: Risk Assessment (25 points)

Create a risk matrix for the threats and vulnerabilities you identified:

1. Rate each item on **likelihood** (Low/Medium/High) and **impact** (Low/Medium/High).
2. Prioritize the top 3 risks that should be addressed first.
3. Justify your prioritization.

## Deliverables

- [ ] PDF report (max 10 pages, excluding appendices)
- [ ] DFD diagram (can be created with any tool, embedded in report)
- [ ] Code fix snippets included in the report
- [ ] Names and student IDs of group members on the cover page
