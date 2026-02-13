---
title: "Boolean Algebra and Logic Minimization"
course: "fsd"
date: 2025-03-10
tags: ["Boolean Algebra", "Logic", "Karnaugh Maps"]
description: "Fundamental laws of Boolean algebra, canonical forms, and systematic minimization using Karnaugh maps."
math: true
---

## Boolean Algebra Axioms

Boolean algebra operates on binary values ($0$ and $1$) with three basic operations:

- **AND** ($\cdot$): $A \cdot B$
- **OR** ($+$): $A + B$
- **NOT** ($\overline{A}$): complement of $A$

## Key Theorems

| Theorem | AND Form | OR Form |
|---------|----------|---------|
| Identity | $A \cdot 1 = A$ | $A + 0 = A$ |
| Null | $A \cdot 0 = 0$ | $A + 1 = 1$ |
| Idempotent | $A \cdot A = A$ | $A + A = A$ |
| Complement | $A \cdot \overline{A} = 0$ | $A + \overline{A} = 1$ |
| De Morgan's | $\overline{A \cdot B} = \overline{A} + \overline{B}$ | $\overline{A + B} = \overline{A} \cdot \overline{B}$ |

## Canonical Forms

Any Boolean function can be expressed as:

- **Sum of Products (SOP)**: OR of AND terms (minterms)
- **Product of Sums (POS)**: AND of OR terms (maxterms)

**Example**: For $f(A, B) = A \oplus B$:

$$f = \overline{A} \cdot B + A \cdot \overline{B} = \sum m(1, 2)$$

## Karnaugh Maps

Karnaugh maps (K-maps) provide a visual method for minimizing Boolean expressions. Adjacent cells that differ by one variable can be grouped.

**Rules for grouping**:

1. Groups must be powers of 2 (1, 2, 4, 8, ...)
2. Groups must be rectangular
3. Groups can wrap around edges
4. Make groups as large as possible
5. Cover all 1s with minimum number of groups

### Example: 3-Variable K-Map

For $f(A, B, C) = \sum m(0, 2, 4, 5, 6)$:

The minimized expression is: $f = \overline{C} + A \cdot \overline{B}$

## Key Takeaways

1. Boolean algebra provides the mathematical foundation for digital circuit design.
2. De Morgan's theorems are essential for converting between AND-OR and OR-AND implementations.
3. K-maps offer a practical, visual method for minimizing functions up to ~5 variables.
