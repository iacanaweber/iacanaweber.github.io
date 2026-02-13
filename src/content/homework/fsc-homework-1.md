---
title: "Homework 1: RISC-V Assembly Programming"
course: "fsc"
date: 2025-03-18
tags: ["RISC-V", "Assembly", "Programming"]
description: "Write RISC-V assembly programs to solve algorithmic problems involving arrays, procedures, and the stack."
solutionsAvailable: false
---

## Overview

- **Due date**: April 1, 2025
- **Submission**: Upload your `.s` files to the course portal
- **Collaboration policy**: Individual work. You may discuss concepts but must write your own code.

## Task 1: Array Sum (30 points)

Write a RISC-V assembly program that:

1. Defines an array of 10 integers in the `.data` section.
2. Calculates the sum of all elements.
3. Stores the result in memory at a labeled location `result`.

Your program should use a loop (not manually adding each element).

## Task 2: Fibonacci Procedure (35 points)

Implement a **recursive** Fibonacci function in RISC-V assembly:

- The function takes `n` in register `a0` and returns `fib(n)` in `a0`.
- Base cases: `fib(0) = 0`, `fib(1) = 1`.
- The function must correctly use the stack to save/restore registers.

Write a `main` that calls `fib(10)` and stores the result.

## Task 3: String Length (35 points)

Write a RISC-V assembly function `strlen` that:

- Receives a pointer to a null-terminated ASCII string in `a0`.
- Returns the length of the string (not counting the null terminator) in `a0`.
- Uses only `lb` (load byte) for memory access.

Include a test string in the `.data` section and call `strlen` from `main`.

## Submission Checklist

- [ ] Three separate `.s` files (one per task)
- [ ] Each file assembles and runs correctly in the RISC-V simulator
- [ ] Code is commented to explain your logic
- [ ] Your name and student ID are in a comment at the top of each file
