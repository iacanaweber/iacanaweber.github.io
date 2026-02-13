---
title: "Exercise List 2: Mutation Testing"
course: "css"
date: 2025-04-30
tags: ["Mutation Testing", "Testing", "Fault Models"]
description: "Hands-on exercises on creating mutants, calculating mutation scores, and designing tests to kill mutants."
solutionsAvailable: false
math: true
---

## Instructions

These exercises cover mutation testing concepts and practice. You may use any programming language for your answers.

## Questions

### Q1 — Understanding Mutants

Consider the following function:

```python
def classify_triangle(a, b, c):
    if a <= 0 or b <= 0 or c <= 0:
        return "invalid"
    if a + b <= c or a + c <= b or b + c <= a:
        return "not a triangle"
    if a == b == c:
        return "equilateral"
    if a == b or b == c or a == c:
        return "isosceles"
    return "scalene"
```

For each mutant below, state whether the test case `classify_triangle(3, 4, 5)` would **kill** the mutant:

a) Change `a <= 0` to `a < 0`
b) Change `a + b <= c` to `a + b < c`
c) Change `a == b == c` to `a == b != c`
d) Change `return "scalene"` to `return "isosceles"`

### Q2 — Mutation Operators

List five common mutation operators for imperative languages and give an example of each applied to real code.

### Q3 — Mutation Score

A test suite is run against 40 mutants. Results:
- 28 mutants killed
- 5 equivalent mutants
- 7 surviving mutants

Calculate the mutation score using:

$$\text{Mutation Score} = \frac{\text{Killed Mutants}}{\text{Total Mutants} - \text{Equivalent Mutants}}$$

Is this test suite adequate? What would you do to improve it?

### Q4 — Designing Killing Tests

Given the function:

```python
def absolute_value(x):
    if x < 0:
        return -x
    return x
```

And the mutant where `x < 0` is changed to `x <= 0`:

Design a test case that kills this mutant. Explain why your test works.

### Q5 — Equivalent Mutants

Explain why equivalent mutants are a problem in mutation testing. Give an example of a code change that produces an equivalent mutant.
