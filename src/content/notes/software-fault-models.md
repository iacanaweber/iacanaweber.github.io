---
title: "Software Fault Models and Failure Classification"
course: "css"
date: 2025-03-05
tags: ["Fault Models", "Reliability", "Testing"]
description: "Understanding the distinction between faults, errors, and failures, and how fault models guide testing strategies."
---

## Faults, Errors, and Failures

These three concepts form the foundation of software reliability:

- **Fault** (defect/bug): A static flaw in the code. A fault exists even if it is never triggered.
- **Error**: An incorrect internal state caused by executing a fault.
- **Failure**: An externally visible deviation from the expected behavior, caused by an error propagating to the output.

The chain is: **Fault → Error → Failure**

Not every fault leads to a failure. A fault may never be executed, or the resulting error may not propagate.

## Fault Classification

Faults can be classified by:

### Origin
- **Development faults**: introduced during design, coding, or specification
- **Operational faults**: triggered by unusual operating conditions or environment

### Nature
- **Commission**: doing something wrong (e.g., incorrect formula)
- **Omission**: failing to do something (e.g., missing null check)

### Persistence
- **Permanent** (Bohrbugs): consistently reproducible
- **Intermittent** (Heisenbugs): appear and disappear unpredictably (often concurrency-related)

## Common Fault Types in Practice

| Fault Type | Example |
|-----------|---------|
| Off-by-one | Loop iterates one time too many/few |
| Null dereference | Accessing a field on a null reference |
| Race condition | Unsynchronized access to shared data |
| Resource leak | Opening a file/connection without closing it |
| Integer overflow | Arithmetic exceeds type range |
| Incorrect logic | Wrong comparison operator (`<` vs `<=`) |

## Fault Models for Testing

A **fault model** defines the types of faults a testing strategy targets. It guides test design:

- **Mutation testing**: introduces small syntactic changes (mutants) to the code and checks if tests detect them.
- **Fault injection**: deliberately introduces faults to assess system resilience.
- **Coverage criteria**: define what parts of code/logic must be exercised to achieve confidence.

## Key Takeaways

1. The fault-error-failure chain is fundamental to reasoning about software reliability.
2. Not all faults cause failures — testing aims to increase confidence that critical faults are caught.
3. Fault models provide a structured basis for designing test strategies.
