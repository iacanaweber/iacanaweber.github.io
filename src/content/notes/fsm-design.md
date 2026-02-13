---
title: "Finite State Machines: Design and Implementation"
course: "fsd"
date: 2025-04-28
tags: ["FSM", "Sequential Logic", "State Diagrams"]
description: "Designing Moore and Mealy finite state machines, from state diagrams to circuit implementation."
---

## What is a Finite State Machine?

A **Finite State Machine** (FSM) is a computational model with:

- A finite set of **states**
- **Inputs** that trigger transitions between states
- **Outputs** determined by the current state (and possibly inputs)
- An **initial state**

FSMs are fundamental to digital design — they model controllers, protocol handlers, and sequential decision logic.

## Moore vs. Mealy Machines

| Property | Moore | Mealy |
|----------|-------|-------|
| Output depends on | Current state only | Current state + inputs |
| Output changes | On state transition | Immediately with input |
| Typical states | More states needed | Fewer states |
| Output timing | Synchronous | May be asynchronous |

## Design Process

1. **Understand the problem**: Write a clear specification of behavior.
2. **Draw the state diagram**: Identify states, transitions, and outputs.
3. **Create the state table**: Tabulate next state and output for each state-input combination.
4. **Assign state encoding**: Binary encoding for each state (e.g., `S0=00`, `S1=01`).
5. **Derive logic equations**: Use K-maps or Boolean algebra for next-state and output logic.
6. **Implement the circuit**: Connect flip-flops and combinational logic.

## Example: Sequence Detector

Design a Moore FSM that detects the sequence `101` in a serial input stream.

**States**:
- `S0`: Initial / no match
- `S1`: Detected `1`
- `S2`: Detected `10`
- `S3`: Detected `101` (output = 1)

**State transitions**:

| Current State | Input = 0 | Input = 1 |
|--------------|-----------|-----------|
| S0 | S0 | S1 |
| S1 | S2 | S1 |
| S2 | S0 | S3 |
| S3 | S2 | S1 |

The output is `1` only in state `S3`.

## Implementation with D Flip-Flops

Using binary encoding (`S0=00`, `S1=01`, `S2=10`, `S3=11`) and two D flip-flops, we derive the next-state equations using K-maps:

```
D1 = Q1'.Q0.X' + Q1.Q0'.X
D0 = X
Output = Q1.Q0
```

Where `Q1, Q0` are the current state bits and `X` is the input.

## Key Takeaways

1. FSMs are the primary design tool for sequential control logic.
2. Moore machines are simpler to design; Mealy machines can be more compact.
3. A systematic design process (specification, state diagram, state table, equations, circuit) prevents errors.
