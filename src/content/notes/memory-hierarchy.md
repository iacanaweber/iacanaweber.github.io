---
title: "Memory Hierarchy and Cache Design"
course: "fsc"
date: 2025-04-22
tags: ["Memory", "Cache", "Performance"]
description: "Overview of the memory hierarchy, cache organization, and the trade-offs between speed, size, and cost."
math: true
---

## The Memory Wall

Processor speeds have improved much faster than memory speeds. This creates the **memory wall** — the processor often stalls waiting for data from memory.

**Solution**: Use a hierarchy of memories with different speeds, sizes, and costs.

## Memory Hierarchy Levels

| Level | Technology | Typical Size | Access Time |
|-------|-----------|-------------|-------------|
| Registers | SRAM (flip-flops) | ~1 KB | < 1 ns |
| L1 Cache | SRAM | 32–64 KB | ~1 ns |
| L2 Cache | SRAM | 256 KB–1 MB | ~5 ns |
| L3 Cache | SRAM | 4–32 MB | ~15 ns |
| Main Memory | DRAM | 4–64 GB | ~100 ns |
| Storage | SSD/HDD | 256 GB–4 TB | ~10 µs–10 ms |

## Cache Organization

A cache is organized into **sets**, each containing one or more **lines** (blocks). The key parameters are:

- **Block size** ($B$): number of bytes per cache line
- **Number of sets** ($S$): how the cache is indexed
- **Associativity** ($E$): lines per set

$$\text{Cache size} = S \times E \times B$$

### Direct-Mapped Cache ($E = 1$)

Each memory block maps to exactly one cache set. Simple but prone to **conflict misses**.

### Fully Associative Cache ($S = 1$)

Any block can go anywhere. No conflict misses, but expensive to search.

### Set-Associative Cache

A compromise: $E$-way set associative. Each block maps to one set but can occupy any of $E$ lines within that set.

## Address Decomposition

For an $m$-bit address with block size $B$ and $S$ sets:

| Field | Bits |
|-------|------|
| Tag   | $m - \log_2(S) - \log_2(B)$ |
| Set Index | $\log_2(S)$ |
| Block Offset | $\log_2(B)$ |

## Cache Misses

- **Compulsory** (cold): first access to a block
- **Capacity**: cache is full, block was evicted
- **Conflict**: multiple blocks compete for the same set

## Key Takeaways

1. Caches exploit **temporal** and **spatial locality** to bridge the memory gap.
2. Associativity reduces conflict misses but increases lookup cost.
3. Understanding cache behavior is critical for writing efficient code.
