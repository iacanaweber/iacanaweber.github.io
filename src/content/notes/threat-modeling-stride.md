---
title: "Threat Modeling with STRIDE"
course: "css"
date: 2025-04-23
tags: ["Threat Modeling", "STRIDE", "Security"]
description: "Systematic threat identification using the STRIDE framework, data flow diagrams, and mitigation strategies."
---

## What is Threat Modeling?

Threat modeling is a structured approach to identifying, analyzing, and addressing security threats in a system. It answers four key questions:

1. **What are we building?** (system model)
2. **What can go wrong?** (threat identification)
3. **What are we going to do about it?** (mitigation)
4. **Did we do a good enough job?** (validation)

## The STRIDE Framework

STRIDE is a mnemonic for six categories of security threats, developed at Microsoft:

| Category | Description | Violated Property |
|----------|-------------|-------------------|
| **S**poofing | Pretending to be someone else | Authentication |
| **T**ampering | Modifying data or code | Integrity |
| **R**epudiation | Denying having performed an action | Non-repudiation |
| **I**nformation Disclosure | Exposing data to unauthorized parties | Confidentiality |
| **D**enial of Service | Making a system unavailable | Availability |
| **E**levation of Privilege | Gaining unauthorized access | Authorization |

## Process

### Step 1: Create a Data Flow Diagram (DFD)

Model the system with:
- **External entities** (users, external systems)
- **Processes** (components that transform data)
- **Data stores** (databases, files)
- **Data flows** (communication between elements)
- **Trust boundaries** (where privilege levels change)

### Step 2: Apply STRIDE to Each Element

Systematically evaluate each DFD element against the STRIDE categories:

| Element Type | Applicable Threats |
|-------------|-------------------|
| External entity | S, R |
| Process | S, T, R, I, D, E |
| Data store | T, R, I, D |
| Data flow | T, I, D |

### Step 3: Identify Mitigations

For each identified threat, determine an appropriate countermeasure:

- **Spoofing** → Strong authentication (MFA, certificates)
- **Tampering** → Input validation, checksums, digital signatures
- **Repudiation** → Audit logging, digital signatures
- **Information Disclosure** → Encryption, access controls
- **Denial of Service** → Rate limiting, resource quotas
- **Elevation of Privilege** → Least privilege, role-based access control

### Step 4: Prioritize

Use a risk rating system (e.g., DREAD or a simple likelihood × impact matrix) to prioritize which threats to address first.

## Key Takeaways

1. Threat modeling is most effective when done early in the design phase.
2. STRIDE provides a systematic checklist to avoid overlooking threat categories.
3. Every identified threat should have a documented mitigation or an accepted risk rationale.
