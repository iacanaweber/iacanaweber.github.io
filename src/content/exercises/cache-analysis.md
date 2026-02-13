---
title: "Exercise List 2: Cache Analysis"
course: "fsc"
date: 2025-04-29
tags: ["Cache", "Memory", "Performance"]
description: "Practice problems on cache organization, hit/miss analysis, and performance calculation."
solutionsAvailable: true
solutionsPublic: false
math: true
---

## Instructions

Solve the following problems about cache organization and performance.

## Questions

### Q1 — Cache Parameters

A cache has the following specifications: 16 KB total size, 64-byte blocks, 4-way set associative, 32-bit addresses.

a) How many sets does this cache have?

b) How many bits are used for the tag, set index, and block offset?

c) How many total bits of storage does the cache require (including tag and valid bits)?

### Q2 — Hit/Miss Analysis

Consider a direct-mapped cache with 4 sets and 1-word (4-byte) blocks. Trace the following sequence of byte addresses and determine whether each access is a hit (H) or miss (M):

`0, 4, 16, 132, 0, 4, 16, 132`

### Q3 — Average Memory Access Time

A system has the following characteristics:
- L1 cache hit time: 1 cycle
- L1 miss rate: 5%
- L2 cache hit time: 10 cycles
- L2 miss rate: 20% (of L1 misses)
- Main memory access time: 200 cycles

Calculate the Average Memory Access Time (AMAT):

$$\text{AMAT} = \text{Hit time}_{L1} + \text{Miss rate}_{L1} \times (\text{Hit time}_{L2} + \text{Miss rate}_{L2} \times \text{Penalty}_{mem})$$

### Q4 — Locality Analysis

Consider the following C code:

```c
int sum = 0;
for (int i = 0; i < N; i++)
    for (int j = 0; j < M; j++)
        sum += A[i][j];
```

a) Does this code exhibit good spatial locality for array A? Explain why.

b) What happens to cache performance if we swap the loop order (iterate `j` in the outer loop and `i` in the inner loop)?

### Q5 — Write Policies

Explain the difference between:
a) Write-through vs. write-back
b) Write-allocate vs. no-write-allocate

Which combination is most common in modern L1 caches? Why?
