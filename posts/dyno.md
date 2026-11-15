---
title: Dyno Cart Testing
ledger-title: Dynamometer Cart + Motor Testing
date: April–June 2025
order: 5
tags:
  - Design
  - Manufacture
  - Validation
hero: images/dynocarttesting.png
hero-caption: The "Porsche Ferrari" dyno cart, reconfigured from its Yamaha R6 origins to carry the Emrax 208 and the tractive system.
thumb: images/thumbs/dyno.jpg
lead: Adapting Cyclone Racing's legacy IC dyno cart to validate an Emrax 208 motor and DTI HV550 inverter before the team committed to going electric.
timeline:
  - April 08, 2025 | Milestone 1: Design Completed
    I finished the design, including CAD of the cart structure, the water brake, the motor mount, and the powertrain components.
  - April 15, 2025 | Milestone 2: Manufacturing Completed
    I finished building the dyno cart.
  - June 17, 2025 | Milestone 3: Testing Validated
    The cart ran the team's first loaded test of the electric powertrain.
---

## Why This Existed

Cyclone Racing was finishing its last season with a combustion (IC) car and starting on its first electric one. We had the Emrax 208 motor, but no chassis to put it in and no way to run it under load. The team had done well with IC cars, so before leaving them we needed to show the electric powertrain worked. That meant running the motor with the battery, BMS, and inverter outside of a car, which meant building something to mount it on.

The team had a dyno cart so old that nobody knew when it was built. It has a Porsche sticker and a Ferrari sticker on the side, so we call it the Porsche Ferrari. The cart was set up for a Yamaha R6 engine and couldn't hold the Emrax as it was.

## Reconfiguration

The cart had R6 engine mounts, a gas tank, and IC wiring. It had no low voltage (GLV) power for the EV electronics and none of the interlocks that have to stay closed to keep the high voltage system on. If the GLV battery cut out, the high voltage would shut off with it, so the GLV supply had to be dependable.

I designed the changes so the cart could go back to IC. The IC mounts were removed and replaced with bolted ones, so the cart can switch between the IC and EV setups. The GLV wiring moved to a separate cart, so changing setups only means swapping the harness.

## Motor Mount

The Emrax 208 is a flat, pancake-shaped motor, and its bolt pattern matched nothing on the cart. The mount is two lengths of square steel tube that span the full width of the cart and are bolted at both ends. They take the motor's torque. A third piece at 90 degrees picks up three of the four mounting holes on the motor bracket. The mount is simple and stiff.

## The Water Brake

A water brake puts a load on the motor. The motor spins a rotor inside a housing full of water, like a pump, and the water's resistance pushes back with torque. The CR27 team had used this water brake for a full power test of the R6, so I assumed it would work for the electric motor.

I should have done hand calculations first. The data sheets had been lost, along with most of what the team knew about the brake, and I'm not confident it can take the load the Emrax produces. It was enough for these tests. Future tests will use the 300 kW dynamometer the university has since installed, which controls load and measures torque accurately.

## Testing

The no-load test was the first time the battery pack, the Orion BMS, and the DTI HV550 inverter ran together. The goal was to confirm they communicated and that the BMS behaved correctly before the motor was loaded.

![No-load test](images/dynocartnoloadtest.png)
> The no-load test. The battery pack, Orion BMS, and DTI HV550 inverter running together for the first time.

The loaded test ran more power through the system with the water brake resisting the motor. It showed one problem. The motor stopped at random after about 30 seconds, with no fault code from the inverter or the BMS. We worked through it.

I didn't document the results well, and I would do that differently. What the tests confirmed is that the tractive system worked and the team knew how to run and troubleshoot it. That was the goal before committing to an electric car.

## What's Next

Future powertrain testing moves to the university's dynamometer, because the water brake's load limit is unknown. Driving the car also gives more useful data than the cart can. The custom hub motors in development will run on the 300 kW dyno before they go on a car.
