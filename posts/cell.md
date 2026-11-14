---
title: CR30 Battery Pack: Thermal Optimization for Endurance
ledger-title: CR30 Battery Pack: Thermal Optimization
date: October 2025
read: 5
order: 3
tags:
  - Research
  - Design
  - Testing
  - Lead
hero: images/TB-001-CR30_Render_1.png
hero-alt: CR30 Battery Pack
hero-scale: 1.15
hero-caption: CR30 battery pack render.
thumb: images/DCIRMap10-11-25.png
lead: How DCIR testing on Cyclone Racing's CR30 cells replaced a liquid cooling system with ten fans, and why the spec sheet was useless.
timeline:
  - September 27, 2025 | Milestone 1: Test Rig Design
    Configured $100 DCIR testing equipment with load bank, carbon pile rheostat, pressure fixture, and current sensing equipment. Established testing protocols for stack pressure, temperature, C-rate, and state-of-charge analysis.
  - October 4, 2025 | Milestone 2: DCIR Characterization
    Conducted systematic DCIR tests isolating mechanical (face pressure), electrical (C-rate), and thermal (temperature, SoC) variables. Generated 3D DCIR surface maps showing temperature and SoC as dominant factors. Determined liquid cooling unnecessary for race loads.
  - October 18, 2025 | Milestone 3: Thermal Model & Redesign
    Fitted DCIR data to third-order polynomial for thermal simulation. Developed hybrid cooling architecture removing liquid systems in favor of 10 BMS-relayed brushless DC fans. Validated specific heat capacity at 0.954 J/g°C through custom calorimetry testing.
---

## The Problem with the Spec Sheet

The CR30 battery is a 5-module lithium-ion pack that needs to sustain current bursts up to 200A through FSAE endurance events. Heat rejection is critical, but when I went to calculate how much cooling the pack needed, I ran into a wall.

The cell spec sheet listed DCIR as either 1.5 mΩ or 5 mΩ. Two values with no graph, no conditions, no context. Depending on which you used, the thermal math either showed the pack overheating by end of endurance or barely needing cooling at all. Assuming worst case, I started designing a liquid cooling system: U-shaped shims contacting cell faces, a cooling plate, thermal padding, quick disconnects, and a pump loop mounted to the pack.

![U Shims](images/UShims.png)
![Cooling plate](images/CoolingPlate.png)
> The abandoned liquid cooling design: U-shaped shims contacting the cell faces (left) and the dedicated cooling plate (right).

The more I looked at it, the worse it felt. The design added weight and complexity, cooling effectiveness would be marginal, and reliability of a fluid loop on a racecar was a real concern. I was building a solution to a problem I hadn't confirmed existed. What I needed was to characterize the cells under real conditions instead of trusting a spec sheet not written for racing.

## Building the Test Rig

I identified four variables that affect DCIR: stack pressure, temperature, C-rate, and state-of-charge. The goal was to isolate each one and understand how much it mattered, all for under $100.

- **Load Bank:** Four 0.1 Ω heatsink resistors in a 2s2p configuration for uniform heating, validated at 0.131 Ω via 4-wire Kelvin sensing
- **C-Rate Tester:** Carbon pile rheostat for variable current draw
- **Pressure Fixture:** Machined steel plates with springs, adjustable from 0–8 psi
- **Current Sensing:** Borrowed SSA-250 and current clamp from the PRISM Solar Car team

Not glamorous, but it covered the parameters I needed to test.

## Testing Each Variable

### Face Pressure: Ruled Out

Stack pressure was first. Using the spring fixture, I ran pulse tests at 0, 2, 5, and 8 psi across cell faces. DCIR barely moved. The car sees a low cycle count over its lifetime, so pressure-driven SOH degradation isn't a design concern. I deprioritized it and moved on.

![Face pressure test](images/FacePressureJig.jpg "wrap:overflow: hidden; width: 80%; margin: 1em auto 0; max-height: 400px;|img:width: 100%; object-fit: cover; object-position: center 60%;")
> Spring-loaded fixture for adjustable cell face pressure across the 0–8 psi range.

### C-Rate: Secondary Effect

C-rate tests via the carbon pile rheostat showed DCIR trending downward with increasing current draw, likely from local temperature increases due to ohmic heating. The effect was real but small, so I didn't incorporate it into the thermal simulations.

![Current draw test](images/Carbon_Pile.jpg)
> Carbon pile rheostat rig for sweeping C-rate against DCIR.

### State-of-Charge: Repeatable and Strong

For SoC testing I ran 10-second discharge pulses to capture the ohmic voltage drop and 1RC transient, followed by 3-minute rests to track 2RC recovery. As SoC drops, Li⁺ concentration in the electrolyte decreases and charge transfer kinetics at the electrode surface become less favorable, both of which increase resistance. The results matched: a clear, repeatable DCIR increase at lower states of charge.

![State of charge test](images/SoC-Pulse.jpg)
> 10-second discharge pulse protocol capturing ohmic drop and 1RC/2RC recovery.

### Temperature: The One That Mattered

I didn't have access to the university temperature chamber, so I improvised with a foldable heat pad wrapped around isolated cells. Cell temperature was monitored with FLIR thermography and IR spot metering. I ran the same pulse protocol across 25–60°C, and this is where things got interesting.

![DCIR vs. SoC across temperatures](images/TemperatureTest.png)
> DCIR plotted against SoC across the temperature sweep, captured during the heat-pad test runs.

## DCIR Mapping: The Spec Sheet Was Way Off

Temperature and SoC together dominated DCIR variance. When I plotted the full dataset, DCIR dropped as low as 0.7 mΩ at operating temperature, less than half the spec sheet's 1.5 mΩ minimum. The cells were running more efficiently than the datasheet implied.

I built a 3D surface in MATLAB mapping DCIR against temperature and SoC, then fit it to a third-order polynomial for the team's thermal simulation.

![DCIR Map Raw Data](images/DCIRMap10-11-25.png)
![DCIR Map Fitted](images/DCIRMapfit.png)
> DCIR surface against temperature and SoC: raw dataset (left) and third-order polynomial fit (right).

Running the thermal model with real DCIR data and a 1.5x safety factor from RC recovery analysis, the pack's peak temperature stayed well below 60°C (the rules maximum) for the full endurance duration. The liquid cooling system wasn't just overkill. It was unnecessary.

## Redesign

With passive heat mass confirmed sufficient, I stripped the liquid system: base plate, U-shims, thermal pads, pump, and radiator. In their place I added 10 fans: 5 always-on for penthouse electronics cooling, 5 BMS-relayed above the modules as backup for cell cooling. Whether or not the cell fans are active, airflow intakes over the cell tabs and exhausts through the penthouse vents. Simple, lightweight, and the BMS relay gives it a failsafe for anomalies like connection degradation.

![Redesigned cooling architecture](images/PenthouseFans.png "img:width: 90%; display: block; margin: 0 auto;")
> Final cooling architecture: ten BMS-relayed fans draw airflow across the tabs and exhaust through the penthouse vents.

## Specific Heat: Freezer Calorimetry

No published specific heat data existed for these cells, so the team was using aluminum as a stand-in. I wanted to validate that before it fed into anything important. With styrofoam, thermocouples, and my freezer, I set up a calorimetry test: first on aluminum blocks to establish a calibration multiplier, then on the cell itself. Results were consistent across runs, averaging 0.954 J/g°C. Not aluminum, but close enough that the simulations weren't wildly off.

## Takeaways

The biggest lesson is that spec sheets for cells like these are useless for thermal design. They're written for general consumers, not race applications. Characterizing the cells under real conditions changed the design direction, saved weight, and gave the team a thermal model based on real data instead of guesses. I'd like to revisit this with proper temperature chamber access to fill in the edges of the DCIR map and run higher C-rate tests I couldn't reach with the load bank.
