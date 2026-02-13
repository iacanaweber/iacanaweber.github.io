---
title: "RISC-V Instruction Set Architecture Overview"
course: "fsc"
date: 2025-03-04
tags: ["RISC-V", "ISA", "Architecture"]
description: "Introduction to the RISC-V ISA, register file, instruction formats, and design philosophy."
math: true
---

## What is an ISA?

An **Instruction Set Architecture** (ISA) defines the interface between hardware and software. It specifies:

- The set of instructions the processor can execute
- Register organization
- Memory addressing modes
- Data types and sizes

## RISC-V Design Philosophy

RISC-V is an open-source ISA designed with simplicity and modularity in mind:

- **Base integer ISA** (RV32I / RV64I) with optional extensions
- **Fixed-width 32-bit instructions** (with compressed 16-bit extension available)
- **Load-store architecture**: only load/store instructions access memory
- **Three operand format**: most instructions have the form `rd, rs1, rs2`

## Register File

RISC-V has 32 general-purpose registers (`x0`–`x31`), each 32 bits wide in RV32I:

| Register | ABI Name | Description |
|----------|----------|-------------|
| `x0`     | `zero`   | Hard-wired zero |
| `x1`     | `ra`     | Return address |
| `x2`     | `sp`     | Stack pointer |
| `x5-x7`  | `t0-t2`  | Temporaries |
| `x10-x11`| `a0-a1`  | Function arguments / return values |
| `x10-x17`| `a0-a7`  | Function arguments |

## Instruction Formats

RISC-V uses six instruction formats. For example, the **R-type** format:

| Bits    | 31-25  | 24-20 | 19-15 | 14-12  | 11-7 | 6-0    |
|---------|--------|-------|-------|--------|------|--------|
| Field   | funct7 | rs2   | rs1   | funct3 | rd   | opcode |

## Example: Addition

```asm
add  x5, x6, x7    # x5 = x6 + x7
addi x5, x6, 10    # x5 = x6 + 10
```

The immediate in `addi` is a 12-bit signed value, supporting values from $-2048$ to $2047$.

## Key Takeaways

1. RISC-V is a clean, modular ISA ideal for teaching and research.
2. The base ISA (RV32I) has only ~47 instructions.
3. Extensions (M for multiply, F for float, etc.) add functionality without bloating the core.
