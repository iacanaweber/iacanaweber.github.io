---
title: "Exercise List 1: Boolean Algebra and Karnaugh Maps"
course: "fsd"
date: 2025-03-17
tags: ["Boolean Algebra", "Karnaugh Maps", "Logic"]
description: "Practice simplifying Boolean expressions using algebraic manipulation and Karnaugh maps."
solutionsAvailable: true
solutionsPublic: true
math: true
---

## Instructions

Simplify the following Boolean expressions using both algebraic methods and Karnaugh maps where applicable.

## Questions

### Q1 — Algebraic Simplification

Simplify the following using Boolean algebra theorems:

a) $f = A \cdot B + A \cdot \overline{B}$

b) $f = (A + B) \cdot (A + \overline{B})$

c) $f = \overline{\overline{A \cdot B} \cdot \overline{C \cdot D}}$

d) $f = A \cdot B + A \cdot B \cdot C + \overline{A} \cdot B$

### Q2 — Truth Table to Expression

Given the truth table below, write the SOP and POS expressions:

| A | B | C | f |
|---|---|---|---|
| 0 | 0 | 0 | 1 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 0 |

### Q3 — 3-Variable K-Map

Minimize the following function using a 3-variable Karnaugh map:

$$f(A, B, C) = \sum m(1, 2, 5, 6, 7)$$

### Q4 — 4-Variable K-Map

Minimize the following function with don't-care conditions:

$$f(A, B, C, D) = \sum m(0, 2, 5, 7, 8, 10, 13) + \sum d(1, 15)$$

### Q5 — Implementation

Given $f(A, B, C) = \sum m(0, 2, 4, 5, 6)$:

a) Minimize using a K-map.
b) Draw the gate-level circuit using only NAND gates.

---

## Solutions

### S1

a) $f = A \cdot B + A \cdot \overline{B} = A \cdot (B + \overline{B}) = A$

b) $f = (A + B) \cdot (A + \overline{B}) = A + B \cdot \overline{B} = A$

c) Apply De Morgan's: $f = A \cdot B + C \cdot D$

d) $f = B \cdot (A + A \cdot C + \overline{A}) = B \cdot (1 + A \cdot C) = B$
