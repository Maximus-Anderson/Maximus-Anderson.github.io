---
title: CR29 Accumulator: Manufacture
ledger-title: CR29 Battery Module: Manufacture
date: March 2025
read: 6
order: 6
tags:
  - Manufacture
  - Validation
hero: images/tractivebatterymodule.jpg
hero-alt: CR29 Battery Module: Manufacture
hero-caption: A finished 28s1p tractive battery module with BMS sense wires harnessed.
lead: Building Cyclone Racing's first tractive system from scratch: the aluminum housing, five battery modules, and everything that went wrong along the way.
specs:
  - Configuration: 28s1p per module
  - Cells: COSMX CA95B0D0HD
  - 5 modules total
timeline:
  - Early March 2025 | Housing Fabrication
    Aluminum panels were water jet cut and welded into the housing enclosure. The planned bending process was abandoned after tolerances proved too loose. Weld distortion in the 2.3mm interior walls required mallet correction before modules could fit. Self-jigging slots flagged as a CR30 improvement.
  - March 20, 2025 | First Module Assembly
    The first module came together over the course of a full day. Cross-threading from misaligned JB-welded nuts appeared early. Cell gap from real vs. spec dimensions was confirmed at ~0.7mm per cell. Exposed terminal connections were flagged as a safety concern. All issues were documented for CR30 design review.
  - March 30, 2025 | All Five Modules Complete
    All five modules were completed with wiring harnesses and polycarbonate baskets installed. The full accumulator was assembled and the pack was ready for subsequent system-level testing.
---

## Context

CR29 was Cyclone Racing's first electric car. The accumulator, the main high-voltage battery pack, had to be built from scratch. Nobody on the team had done this before. This write-up covers the full manufacturing process: the aluminum housing and the five battery modules that go inside it.

## What an Accumulator Is

The FSAE rules called the main high-voltage battery pack the accumulator. That terminology shifted to "tractive battery" in the 2026 ruleset, but for CR29 it was the accumulator. It isn't one big battery. It's a housing containing smaller sub-units called modules, wired in series to reach the total pack voltage. Each module is a self-contained group of cells. For CR29, each module holds 28 pouch cells wired in series with one cell per parallel group (28s1p). Five modules make up the full pack.

## The Aluminum Housing

The housing is a welded aluminum enclosure that holds all five modules, the BMS, and the high-voltage wiring. The flat panels were water jet cut from aluminum sheet, which gave clean, accurate profiles without introducing heat distortion.

The original design called for the side walls to be bent to shape rather than cut as separate pieces and welded. Bending would have been faster and produced cleaner corners, but the bend tolerances weren't tight enough to be usable. The walls didn't sit where they needed to sit. Rather than redesign around the bending process, the bent sections were cut off and the walls were welded on as flat pieces. Both the exterior panels and the interior partitions.

That created a new problem. The exterior walls are 3.2mm thick and welded fine. The interior partitions are 2.3mm, the rules minimum. Welding a continuous seam into 2.3mm aluminum puts more heat into the part than it can absorb without moving. The walls warped. After welding, the interior cavity was tight enough in places that the modules wouldn't fit. The fix was a mallet, working the distorted spots outward until the modules fit. Functional, but out of spec.

A lot of time went into fitting each panel before tacking so the housing would match CAD. Even then, it wasn't perfect. For CR30, the plan is to add slots to the mating edges so panels self-locate when assembled. That cuts fitment time and removes the need for careful alignment before every tack.

![CR29 housing panels jigged for welding](images/CR29_Welding_Jigging.jpg "img:flex: 1; max-width: 38%;")
![CR29 housing near complete](images/CR29_Near_Complete_Container.jpg "img:flex: 1; max-width: 38%;")
> CR29 housing panels fixtured for welding (left), and the container near complete (right). Every panel needed external clamping to hold square before tacking.

## Module Assembly

The 28 cells in each module get sorted into four types, A through D, based on tab length and orientation. The type determines where in the stack the cell goes. Getting the order wrong means a tab that doesn't reach its clamping plate, or one that's bent at the wrong angle.

Before touching a cell, the tab clamping plates had to be prepared. These are 3D-printed plates that clamp the cell tabs and bolt them together electrically. The innermost bolt positions are inaccessible once cells are stacked, so the design used press-fit nuts embedded in the plastic. In FDM prints, press-fit doesn't hold reliably, so each nut got bonded in with JB Weld and left to cure. The intent was for them to behave like heat-set inserts, locking the nut so the bolt has something solid to thread into.

With the plates ready, assembly went like this: drop the first D cell into the stack, lay a tab block over the tabs, fold the tabs up onto it, drop in the first A cell, fold its tab, add another tab block with a BMS sense wire ring, bolt through. Then repeat, alternating A and B cells through the stack. The final cell is a C type. After the last cell, main terminals get attached and the whole stack goes into polycarbonate baskets for structural support and isolation.

Total module build time ran about 5 hours a day over three days, roughly 3 hours per module including cell stacking, tab folding, bolting, and BMS sense wire harnessing. That doesn't count 4 hours sanding burrs off the tab blocks before assembly, or the time crimping fuses onto the BMS wires.

![Tractive Battery Manufacture](images/tractivebatterymanufacture.jpg)
> Module assembly in progress: cells, tab blocks, and clamping plates layered into the stack.

![First completed CR29 module](images/CR29_First_Module.jpg "wrap:max-width: 700px; margin: 0 auto; overflow: hidden; aspect-ratio: 4 / 3;|img:width: 100%; height: 100%; object-fit: cover; object-position: center 75%;")
> The first completed CR29 module after cell stacking, tab folding, and BMS sense harnessing.

## What Didn't Work

The JB-welded nuts were the biggest problem. Because they weren't square in their pockets, some bolts cross-threaded on the way in. Once a bolt cross-threads into an epoxy-held nut, the nut breaks free. Now there's a loose nut inside a sealed module. Fixing it meant partially disassembling the stack mid-build. The bonded nuts also made disassembly difficult when modules needed to come apart for CR30.

Stack pressure was the second gap. Pouch cells need to be compressed during cycling to prevent swelling and dendrite growth. The module had compression plates, but the cell dimensions in CAD came from the datasheet, not actual measurements. Real cells ran about 0.7mm thinner than spec per cell. Across 28 cells, that's roughly 20mm of lost compression.

The terminal bolts were a safety concern. The pack terminals were accessible from below even with TPU plugs installed. Live conductors there are a problem for inspections and for anyone whose hand ends up near the bottom of a live pack.

## Notes for CR30

The full list from this build: add self-jigging slots to the housing panels, redesign the nut pockets with tighter interference fits so they lock mechanically without JB Weld, measure actual cells before finalizing compression plate dimensions, fully enclose the terminal connections, reduce bolt count, and clean up harness routing. The accumulator worked well enough for testing. Building it showed where the next generation needs to be different.

![Completed CR29 pack with messy penthouse wiring](images/CR29_Complete_Pack_And_Messy_Penthouse.jpg)
> CR29 pack complete, penthouse wiring visible. The harness routing mess in this photo is what CR30's cleanup targeted.
