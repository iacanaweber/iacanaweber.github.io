---
title: "Midterm Exam — 2024/2"
course: "fsd"
date: 2024-10-08
tags: ["Boolean Algebra", "Karnaugh Maps", "Combinational Logic", "Exam"]
description: "Midterm exam from 2024/2 covering Boolean algebra, Karnaugh maps, and combinational circuit design."
solutionsAvailable: true
solutionsPublic: true
---

## Exam Information

- **Duration**: 2 hours
- **Allowed materials**: None (closed book)
- **Total points**: 100

## Topics Covered

- Boolean algebra theorems and simplification
- Karnaugh maps (3- and 4-variable)
- Canonical forms (SOP, POS)
- Combinational circuit design and analysis
- Multiplexers, decoders, and encoders

## Questions

### Question 1 (20 points)

Simplify the following Boolean expressions using algebraic manipulation. Show all steps.

a) $f = \overline{A} \cdot B \cdot C + A \cdot \overline{B} \cdot C + A \cdot B \cdot \overline{C} + A \cdot B \cdot C$

b) $f = (A + B) \cdot (\overline{A} + C) \cdot (B + C)$

### Question 2 (25 points)

Minimize the following function using a 4-variable Karnaugh map:

$$f(A, B, C, D) = \sum m(0, 1, 2, 5, 8, 9, 10) + \sum d(3, 11)$$

Implement the minimized expression using only NOR gates.

### Question 3 (30 points)

Design a 2-bit comparator circuit. The circuit receives two 2-bit numbers A (A1A0) and B (B1B0) and produces three outputs:
- `GT` (A > B)
- `EQ` (A = B)
- `LT` (A < B)

Show the truth table, K-map minimization, and gate-level circuit.

### Question 4 (25 points)

Implement the function $f(A, B, C, D) = \sum m(1, 3, 5, 7, 9, 11)$ using:

a) An 8:1 multiplexer with A, B, C as select inputs.

b) A 4:16 decoder with OR gates.

## Solutions

Full solutions are available below.

### Solution 1a

$f = \overline{A}BC + A\overline{B}C + AB\overline{C} + ABC$

$= \overline{A}BC + A C(\overline{B} + B) + AB\overline{C}$

$= \overline{A}BC + AC + AB\overline{C}$

$= BC(\overline{A} + A) + AC + AB\overline{C} - ABC$

$= BC + AC + AB\overline{C} - ABC$

$= BC + AC + AB(\overline{C} + C) - ABC + ABC$

$= BC + AC + AB$

$= AB + AC + BC$
