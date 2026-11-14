---
title: CR29 Accumulator: Manufacture (DRAFT)
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
lead: Building Cyclone Racing's first battery pack from scratch: the aluminum housing, the five modules, and what went wrong.
specs:
  - Configuration: 28s1p per module
  - Cells: COSMX CA95B0D0HD
  - 5 modules total
timeline:
  - Early March 2025 | Housing Fabrication
    The aluminum panels were cut on a waterjet and welded into the housing. The plan to bend the side walls was dropped because the bends weren't accurate enough. The 2.3 mm inner walls warped during welding and had to be worked back with a mallet before the modules fit. Self-jigging slots went on the list for CR30.
  - March 20, 2025 | First Module Assembly
    The first module took a full day. Bolts cross-threaded in JB Welded nuts that weren't square in their pockets. The cells measured about 0.7 mm thinner than the datasheet. The exposed terminal connections were noted as a safety problem. All of it went on the list for CR30.
  - March 30, 2025 | All Five Modules Complete
    All five modules were finished with their wiring harnesses and polycarbonate baskets. The accumulator was assembled and ready for testing.
draft: true
---

## Context

CR29 was Cyclone Racing's first electric car. Its main high voltage battery pack, which the FSAE rules called the accumulator, had to be built from scratch, and nobody on the team had built one before. This post covers how the accumulator was made: the aluminum housing and the five battery modules that go inside it.

## What an Accumulator Is

The accumulator is the car's main high voltage battery. The rules renamed it the "tractive battery" in 2026, but for CR29 it was the accumulator. It isn't one large battery. It is a housing that holds smaller units called modules, wired in series to reach the pack voltage. Each CR29 module holds 28 pouch cells in series with no cells in parallel, written 28s1p. Five modules make up the pack.

## The Aluminum Housing

The housing is a welded aluminum box that holds the five modules, the BMS, and the high voltage wiring. The flat panels were cut from aluminum sheet on a waterjet, which cuts accurately and puts no heat into the part.

The design called for the side walls to be bent to shape instead of welded on as separate pieces. Bending would have been faster and made cleaner corners, but the bends weren't accurate enough and the walls didn't sit where they needed to. The bent sections were cut off and the walls were welded on as flat pieces, both the outer panels and the inner partitions.

Welding the partitions caused warping. The outer walls are 3.2 mm thick and welded fine. The inner partitions are 2.3 mm, the minimum the rules allow, and a continuous weld puts more heat into 2.3 mm aluminum than it can take without moving. After welding, the space for the modules was too tight in places and the modules wouldn't fit. The fix was to work the warped spots outward with a mallet until the modules fit. The housing worked, but it was out of spec.

Fitting each panel before tack welding took a lot of time, and the housing still didn't match CAD exactly. CR30's housing added tabs and slots on the panel edges so the panels locate themselves, which is covered in [[pack|CR30 Battery Pack: Design and Manufacture]].

![CR29 housing panels jigged for welding](images/CR29_Welding_Jigging.jpg "img:flex: 1; max-width: 38%;")
![CR29 housing near complete](images/CR29_Near_Complete_Container.jpg "img:flex: 1; max-width: 38%;")
> The CR29 housing panels clamped for welding (left), and the housing near complete (right). Every panel had to be clamped square before it was tacked.

## Module Assembly

The 28 cells in each module come in four types, A through D, which differ in tab length and orientation. The type sets where a cell goes in the stack. A cell in the wrong position has a tab that doesn't reach its clamping plate or bends at the wrong angle.

The tab clamping plates had to be prepared before any cells were stacked. They are 3D printed plates that clamp the cell tabs and bolt them together electrically. The innermost bolts can't be reached once the cells are stacked, so the design has nuts pressed into the plastic. A press fit doesn't hold reliably in an FDM print, so each nut was bonded in with JB Weld and left to cure. The bonded nuts were meant to act like heat-set inserts and give the bolts something solid to thread into.

Assembly then went in this order. The first D cell goes into the stack, a tab block is laid over its tabs, and the tabs are folded up onto the block. The first A cell goes in and its tab is folded. A second tab block goes on with a ring terminal for a BMS sense wire, and a bolt goes through. That repeats with alternating A and B cells, and the last cell is a C. After the last cell the main terminals are attached and the stack goes into polycarbonate baskets, which support and insulate it.

The modules took about 5 hours a day for three days, or about 3 hours per module including cell stacking, tab folding, bolting, and wiring the BMS sense harness. That doesn't count 4 hours of sanding burrs off the tab blocks before assembly, or the time spent crimping fuses onto the BMS wires.

![Tractive Battery Manufacture](images/tractivebatterymanufacture.jpg)
> Module assembly in progress, with cells, tab blocks, and clamping plates layered into the stack.

![First completed CR29 module](images/CR29_First_Module.jpg "wrap:max-width: 700px; margin: 0 auto; overflow: hidden; aspect-ratio: 4 / 3;|img:width: 100%; height: 100%; object-fit: cover; object-position: center 75%;")
> The first finished CR29 module, with its cells stacked, tabs folded, and BMS sense harness wired.

## What Didn't Work

The JB Welded nuts were the largest problem. Some nuts weren't square in their pockets, so their bolts cross-threaded on the way in. A cross-threaded bolt breaks the nut free of the epoxy, which leaves a loose nut inside a module that is already stacked. Fixing one meant taking part of the stack apart. The bonded nuts also made the modules hard to take apart when they were reused for CR30.

Stack pressure was the second problem. Pouch cells need to be compressed while they cycle to limit swelling and dendrite growth. The module has compression plates, but the cell thickness in CAD came from the datasheet and not from measured cells. The cells we had were about 0.7 mm thinner each. Across 28 cells that is about 20 mm of lost compression.

The terminal bolts were a safety problem. The pack terminals could be reached from below even with their TPU plugs installed. Those are live conductors, which is a problem at inspection and for anyone whose hand ends up under a live pack.

## Notes for CR30

The changes for CR30 that came out of this build:

- Add self-jigging slots to the housing panels.
- Redesign the nut pockets with a tighter interference fit so the nuts lock without JB Weld.
- Measure real cells before setting the compression plate dimensions.
- Fully enclose the terminal connections.
- Reduce the bolt count.
- Clean up the harness routing.

The accumulator worked well enough for testing.

![Completed CR29 pack with messy penthouse wiring](images/CR29_Complete_Pack_And_Messy_Penthouse.jpg)
> The finished CR29 pack with its penthouse wiring. CR30 cleaned up this harness routing.
