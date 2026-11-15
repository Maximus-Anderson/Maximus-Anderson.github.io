---
title: CR30 Battery Pack: Thermal Optimization for Endurance
ledger-title: CR30 Battery Pack: Thermal Optimization
date: October 2025
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
thumb: images/thumbs/cell.jpg
lead: How DCIR testing on Cyclone Racing's CR30 cells replaced a liquid cooling system with ten fans.
timeline:
  - September 27, 2025 | Milestone 1: Test Rig Design
    I built a DCIR test rig for under $100 with a load bank, a carbon pile rheostat, a pressure fixture, and borrowed current sensors. I also set the test procedure for face pressure, temperature, C-rate, and state of charge.
  - October 4, 2025 | Milestone 2: DCIR Characterization
    I tested face pressure, C-rate, temperature, and state of charge one at a time. The 3D DCIR map showed that temperature and state of charge matter most, and that the pack doesn't need liquid cooling at race loads.
  - October 18, 2025 | Milestone 3: Thermal Model & Redesign
    I fit the DCIR data to a third-order polynomial for the thermal simulation. The liquid system was replaced with ten fans, five always on and five switched by the BMS. A calorimetry test put the cells' specific heat at 0.954 J/g°C.
---

## The Problem with the Spec Sheet

The CR30 battery is five modules of lithium-ion pouch cells, and in an FSAE endurance event it sees current bursts up to 200 A. Current through a cell makes heat in proportion to the cell's internal resistance, called DCIR. To work out how much cooling the pack needed, I needed the DCIR of our cells.

The cell spec sheet listed DCIR as either 1.5 mΩ or 5 mΩ, with no graph and no test conditions. With one value the thermal math showed the pack overheating before the end of endurance. With the other it barely needed cooling. I assumed the worst case and started designing a liquid cooling system. It had U-shaped shims touching the cell faces, a cooling plate, thermal pads, quick disconnects, and a pump loop mounted to the pack.

![U Shims](images/UShims.png)
![Cooling plate](images/CoolingPlate.png)
> The liquid cooling design I dropped. U-shaped shims that touch the cell faces (left) and the cooling plate (right).

The liquid design had three problems. It added weight and parts, it wouldn't have cooled the cells much, and a fluid loop is one more thing that can fail on a racecar. I was also designing for a problem I hadn't confirmed. So I stopped and tested the cells myself.

## Building the Test Rig

Four things can change a cell's DCIR: the pressure on its faces, its temperature, how fast it is discharged (C-rate), and its state of charge (SoC). I built a rig that could test each one separately, for under $100.

- **Load Bank:** Four 0.1 Ω heatsink resistors in a 2s2p arrangement so they heat evenly. The bank measured 0.131 Ω by 4-wire Kelvin sensing.
- **C-Rate Tester:** A carbon pile rheostat, which gives an adjustable current draw.
- **Pressure Fixture:** Machined steel plates with springs, adjustable from 0 to 8 psi.
- **Current Sensing:** An SSA-250 and a current clamp borrowed from the PRISM Solar Car team.

## Testing Each Variable

### Face Pressure: Ruled Out

I tested face pressure first. With the spring fixture I ran pulse tests at 0, 2, 5, and 8 psi on the cell faces, and DCIR barely moved. Pressure also affects how fast cells age, but the car sees few charge cycles over its life, so aging from low pressure isn't a design concern. I dropped pressure as a variable.

![Face pressure test](images/FacePressureJig.jpg "wrap:overflow: hidden; width: 80%; margin: 1em auto 0; max-height: 400px;|img:width: 100%; object-fit: cover; object-position: center 60%;")
> The spring fixture, which sets cell face pressure from 0 to 8 psi.

### C-Rate: Secondary Effect

In the carbon pile tests DCIR went down as current went up, probably because higher current warms the cell. The effect was small, so I left it out of the thermal simulations.

![Current draw test](images/Carbon_Pile.jpg)
> The carbon pile rheostat used to sweep C-rate.

### State-of-Charge: Repeatable and Strong

For state of charge I ran 10 second discharge pulses with a 3 minute rest after each. The pulse shows the immediate voltage drop and the first slow response (the 1RC transient), and the rest shows the slower recovery (2RC). As SoC drops there are fewer lithium ions in the electrolyte and the reaction at the electrode surface slows down, and both raise resistance. The tests matched that. DCIR rose at lower SoC, and the result repeated.

![State of charge test](images/SoC-Pulse.jpg)
> A 10 second discharge pulse, showing the voltage drop and the recovery after it.

### Temperature: The One That Mattered

I didn't have access to the university's temperature chamber, so I wrapped a foldable heat pad around isolated cells. I checked cell temperature with a FLIR camera and an IR spot meter. I ran the same pulse test from 25 to 60°C, and temperature changed DCIR more than any other variable.

![DCIR vs. SoC across temperatures](images/TemperatureTest.png)
> DCIR against SoC at each temperature in the heat pad tests.

## DCIR Mapping: The Spec Sheet Was Way Off

Temperature and SoC together accounted for most of the change in DCIR. At operating temperature DCIR dropped as low as 0.7 mΩ, less than half of the spec sheet's lower value of 1.5 mΩ. So the cells make less heat than the spec sheet implies.

I built a 3D surface in MATLAB of DCIR against temperature and SoC, then fit a third-order polynomial to it for the team's thermal simulation.

![DCIR Map Raw Data](images/DCIRMap10-11-25.png)
![DCIR Map Fitted](images/DCIRMapfit.png)
> DCIR against temperature and SoC. The raw data (left) and the third-order polynomial fit (right).

I ran the thermal model with the measured DCIR and a 1.5x safety factor taken from the RC recovery analysis. The pack's peak temperature stayed well below 60°C, the rules maximum, for a full endurance run. The pack didn't need liquid cooling.

## Redesign

Since the cells' own thermal mass was enough, I removed the liquid system: the base plate, U-shims, thermal pads, pump, and radiator. I added ten fans in its place. Five run all the time to cool the electronics in the penthouse, the compartment on top of the pack. The other five sit above the modules and are switched on by the BMS as a backup for the cells. Air comes in over the cell tabs and leaves through the penthouse vents whether or not the cell fans are on. The BMS-switched fans cover problems like a connection that degrades and heats up.

![Redesigned cooling architecture](images/PenthouseFans.png "img:width: 90%; display: block; margin: 0 auto;")
> The final cooling layout. Ten fans pull air across the tabs and out through the penthouse vents.

## Specific Heat: Freezer Calorimetry

No specific heat data was published for these cells, so the team had been using aluminum's value. I checked that with a calorimetry test made from styrofoam, thermocouples, and my freezer. I ran the test on aluminum blocks first to get a calibration multiplier, then on a cell. The cell averaged 0.954 J/g°C across runs. That is close enough to aluminum that the earlier simulations weren't far off.

## Takeaways

The spec sheet wasn't usable for thermal design. It gave two DCIR values with no conditions, and the measured value at operating temperature was lower than both. Testing the cells removed the liquid cooling system, saved its weight, and gave the team a thermal model built on measured data. With a temperature chamber I would fill in the edges of the DCIR map and run higher C-rates than the load bank could reach.
