---
title: "Exercise List 2: Sequential Circuits and FSMs"
course: "fsd"
date: 2025-05-05
tags: ["FSM", "Sequential Logic", "Flip-Flops"]
description: "Design exercises on latches, flip-flops, counters, and finite state machines."
solutionsAvailable: false
---

## Instructions

Complete the following sequential circuit design exercises. Show all intermediate steps.

## Questions

### Q1 — Flip-Flop Behavior

Draw the output waveform for a D flip-flop given the following clock and D input signals. Assume the flip-flop is positive-edge triggered and initially Q = 0.

```
CLK:  _|‾|_|‾|_|‾|_|‾|_|‾|_
D:    ‾‾‾|___|‾‾‾‾‾‾‾|___|‾
Q:    ?
```

### Q2 — 3-Bit Counter

Design a synchronous 3-bit up-counter using D flip-flops.

a) Draw the state diagram showing all 8 states (000 → 001 → ... → 111 → 000).

b) Write the state table.

c) Derive the next-state equations for each flip-flop (D2, D1, D0).

### Q3 — FSM Design

Design a Moore FSM that controls a traffic light at an intersection. The system has:
- A sensor input `S` that detects a car waiting on the side street.
- Outputs for the main street light (Green, Yellow, Red) and side street light.

Requirements:
- Main street green is the default state.
- When a car is detected (`S=1`), transition through yellow to red on the main street, then green on the side street for a fixed period.

a) Identify the states and draw the state diagram.
b) Create the state table.

### Q4 — Shift Register

Design a 4-bit serial-in, parallel-out shift register using D flip-flops.

a) Draw the circuit diagram.
b) Show the register contents after shifting in the sequence: `1, 0, 1, 1` (starting from `0000`).

### Q5 — Analysis

Analyze the following sequential circuit and determine its behavior:

Given a circuit with two D flip-flops (DA, DB) where:
- `DA = A XOR B`
- `DB = A AND (NOT B)`
- Output `Z = A AND B`

a) Complete the state table.
b) Draw the state diagram.
c) What sequence does the output Z produce?
