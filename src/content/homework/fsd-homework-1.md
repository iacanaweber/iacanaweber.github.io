---
title: "Homework 1: Combinational Circuit Design"
course: "fsd"
date: 2025-03-24
tags: ["Combinational Logic", "VHDL", "Design"]
description: "Design and implement combinational circuits including a BCD-to-7-segment decoder and a 4-bit ALU."
solutionsAvailable: false
math: true
---

## Overview

- **Due date**: April 7, 2025
- **Submission**: Upload a PDF report and VHDL source files to the course portal
- **Collaboration policy**: Individual work.

## Task 1: BCD to 7-Segment Decoder (40 points)

Design a BCD (Binary-Coded Decimal) to 7-segment display decoder.

**Requirements**:

1. Input: 4-bit BCD value (0–9). Values 10–15 are don't-care.
2. Output: 7 signals (a–g) for the 7-segment display.
3. Use K-maps to minimize each output function.
4. Show the complete truth table, K-maps, and minimized expressions.
5. Implement the design in VHDL.

## Task 2: 4-Bit ALU (60 points)

Design a 4-bit Arithmetic Logic Unit (ALU) that supports the following operations:

| `op` (2 bits) | Operation |
|--------------|-----------|
| 00 | $A + B$ (addition) |
| 01 | $A - B$ (subtraction) |
| 10 | $A \text{ AND } B$ |
| 11 | $A \text{ OR } B$ |

**Requirements**:

1. Inputs: two 4-bit operands (A, B) and a 2-bit operation selector (op).
2. Outputs: 4-bit result and a carry/overflow flag.
3. Draw a block diagram showing the ALU architecture.
4. Implement in VHDL with a testbench that tests at least 3 cases per operation.

## Deliverables

- [ ] PDF report with truth tables, K-maps, equations, and block diagrams
- [ ] VHDL source files (`.vhd`)
- [ ] VHDL testbench files
- [ ] Simulation waveform screenshots
