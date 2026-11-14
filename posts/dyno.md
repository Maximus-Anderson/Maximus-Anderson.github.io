---
title: Dyno Cart Testing
ledger-title: Dynamometer Cart + Motor Testing
date: April–June 2025
read: 4
order: 5
tags:
  - Design
  - Manufacture
  - Validation
hero: images/dynocarttesting.png
hero-caption: The "Porsche Ferrari" dyno cart, reconfigured from its Yamaha R6 origins to carry the Emrax 208 and the tractive system.
thumb: images/Dyno-Title.png
lead: Adapting Cyclone Racing's legacy IC dyno cart to validate an Emrax 208 motor and DTI HV550 inverter before the team committed to going electric.
timeline:
  - April 08, 2025 | Milestone 1: Design Completed
    Completed the design, including CAD models for the dyno cart structure, water brake, mounting solutions, and all powertrain components.
  - April 15, 2025 | Milestone 2: Manufacturing Completed
    Finished manufacturing the dyno cart.
  - June 17, 2025 | Milestone 3: Testing Validated
    Validated the dyno cart through the teams first loaded electric powertrain test.
---

## Why This Existed

Cyclone Racing was finishing its last season as an IC team while beginning the transition to electric. The Emrax 208 motor was on hand, but we had no chassis to put it in and no way to run it under load. Before abandoning a program we'd been dominant in, we needed to prove the electric powertrain worked. That meant spinning the motor with the full tractive system outside the car, which meant building somewhere to mount it.

The team had a dyno cart that had been around so long nobody knew when it was built. It had a Porsche sticker and a Ferrari sticker on the side, so we called it the Porsche Ferrari. It was configured for a Yamaha R6 engine, which made it useless as-is.

## Reconfiguration

The original cart was built around the R6: IC mounting features, a gas tank, and IC wiring with no provision for GLV power or the HV interlocks needed to keep the tractive system live. The GLV battery cutting out would kill HV power, so that had to be managed carefully.

I designed the reconfiguration to be swappable rather than permanent. IC mounting features were removed and replaced with bolted equivalents so the cart could switch between IC and EV configurations. The GLV wiring was pulled off entirely and moved to a separate cart, making the harness swap simple depending on what you were testing.

## Motor Mount

The Emrax 208 is a pancake-style motor with a bolt pattern that didn't match anything on the cart. I kept the mount simple: two lengths of square tube steel spanning the full width to handle motor torque, bolted at both ends, with a third piece at 90 degrees to capture three of the four bracket mounting holes. Nothing exotic, but rigid and functional.

## The Water Brake

A water brake is a hydraulic absorption unit. Water enclosed in a housing acts like a pump, using fluid resistance to apply counter-torque against whatever is spinning it. The CR27 team had used one for a full-power test with the R6, so I assumed it would hold up for the electric motor.

In hindsight I should have run hand calculations first. The data sheets had been lost along with most institutional knowledge of the thing, and I'm not confident it could handle the loads the Emrax produces. It was sufficient for what we needed at the time, but future testing will use the 300 kW dynamometer the university has since installed, which gives real load control and accurate torque curves. The Porsche Ferrari has probably earned its retirement.

## Testing

The no-load test was the first time the full tractive system ran: battery pack, Orion BMS, and DTI HV550 inverter all running together. The goal was to confirm everything communicated correctly and the BMS behaved as expected before putting real demand on it.

![No-load test](images/dynocartnoloadtest.png)
> First full tractive-system spin-up: battery pack, Orion BMS, and DTI HV550 inverter running together for the first time.

The loaded test pushed higher power through the system with the water brake applying resistance. It surfaced an issue: the motor would stop randomly after about 30 seconds with no fault codes from the inverter or BMS. We worked through it, but it was a reminder that systems that look clean on paper have a way of surprising you the first time you run them.

The results weren't well documented. Something I'd do differently. What we confirmed was that the tractive system was functional and the team understood how to operate and troubleshoot it. That was the whole point before committing to an EV program.

## What's Next

Future powertrain testing will move to the university's dynamometer. Beyond the water brake's load limits, driver testing gives more useful data than anything we can simulate on the cart. The custom hub motors in development will spend time on the dyno before they go near a car, but that's a job for the 300 kW unit, not the Porsche Ferrari.
