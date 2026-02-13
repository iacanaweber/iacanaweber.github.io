---
title: "Exercise List 1: RISC-V Basic Instructions"
course: "fsc"
date: 2025-03-11
tags: ["RISC-V", "Assembly", "ISA"]
description: "Practice problems on RISC-V instruction encoding, register usage, and simple programs."
solutionsAvailable: true
solutionsPublic: true
---

## Instructions

Answer the following questions about the RISC-V RV32I instruction set. Refer to the RISC-V reference card as needed.

## Questions

### Q1 — Register Operations

Write RISC-V assembly instructions to perform the following operations:

a) `x5 = x6 + x7`
b) `x10 = x10 - x11`
c) `x12 = x13 AND x14`
d) `x15 = x16 OR 0xFF`

### Q2 — Instruction Encoding

Encode the following instruction in binary and hexadecimal:

```asm
add x5, x6, x7
```

Identify each field: opcode, rd, funct3, rs1, rs2, funct7.

### Q3 — Immediate Values

a) What is the range of immediate values that can be used with the `addi` instruction?

b) How would you load the value `0x12345` into register `x5`? (Hint: you will need more than one instruction.)

### Q4 — Simple Program

Write a RISC-V assembly program that computes the sum of integers from 1 to N, where N is initially stored in `x10`. Store the result in `x11`.

### Q5 — Memory Access

Given an array of 32-bit integers starting at address `0x1000`:

a) Write an instruction to load the 3rd element into `x5`.

b) Write an instruction to store `x6` into the 5th element.

---

## Solutions

### S1

a) `add x5, x6, x7`
b) `sub x10, x10, x11`
c) `and x12, x13, x14`
d) `ori x15, x16, 0xFF`

### S2

`add x5, x6, x7` is an R-type instruction:

- opcode: `0110011` (OP)
- rd: `00101` (x5)
- funct3: `000` (ADD)
- rs1: `00110` (x6)
- rs2: `00111` (x7)
- funct7: `0000000`

Binary: `0000000 00111 00110 000 00101 0110011`
Hex: `0x007302B3`

### S3

a) 12-bit signed: from -2048 to 2047.

b)
```asm
lui   x5, 0x12       # x5 = 0x12000
addi  x5, x5, 0x345  # x5 = 0x12345
```

### S4

```asm
    addi x11, x0, 0    # sum = 0
    addi x6, x0, 1     # i = 1
loop:
    add  x11, x11, x6  # sum += i
    addi x6, x6, 1     # i++
    ble  x6, x10, loop # if i <= N, continue
```

### S5

a) `lw x5, 8(x8)` (where `x8 = 0x1000`; offset = 2 × 4 = 8)

b) `sw x6, 16(x8)` (offset = 4 × 4 = 16)
