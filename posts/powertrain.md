---
title: CR30 Powertrain: Troubleshooting Through Competition
date: May-June 2026
read: 6
order: 1
tags:
  - Powertrain
  - Inverter
  - Lead
hero: images/Troubleshooting_To_Comp_Images/Got_Sticker_For_Battery_&_Mech.jpg
hero-alt: The car with its battery and mechanical tech inspection stickers
hero-caption: The car with its battery and mechanical tech stickers at our first EV competition.
thumb: images/CR30-Render-Banner.jpg
lead: Powertrain lead on Cyclone Racing's CR30. The pack was already built, so this is what it took to make the car actually drive, from a blown inverter to our first EV competition.
specs-title: The Setup
specs:
  - Motor: EMRAX 208 HV
  - Inverter: DTI HV-550
  - Competition: passed battery + mechanical tech
popup-prefix: pt
timeline:
  - May 9 | Blown Inverter
    Blew an IGBT near the end of CR30's second driving day, most likely from running an untuned motor. I traced it with a diode test and repaired the IGBT and gate driver myself for around $300 instead of waiting on a £1,400 replacement.
  - Late May | The Cutout
    The car kept cutting power partway through a hard acceleration, with the HV up and no fault logged. The usual causes all checked out fine, but there was no inverter data to see what was actually happening.
  - May 31 | Inverter Telemetry
    The wire for the inverter's data bus had never been connected, so landing that pin brought the telemetry online. Twisting the CAN pair and grounding the floating shields then stopped the noise dropouts.
  - June 6 | Root Cause Fixed
    The flux linkage was set to about twice the motor's real value, so the inverter thought it was running out of voltage and cut power. Fixing the value, grounding the shields to one point, and retuning cleared it, and the car pulled over 50 kW for the first time.
  - June 8 | Power on the Dyno
    The DC current was capped by an AC limit I'd set too low, since I'd read the datasheet's thermal peak as a hard ceiling. Raising it gave about 135 Nm at the wheels and into the high 50s of kW on the dyno.
  - June 16-20 | Competition
    Passed battery and mechanical tech. An illegal precharge board meant rebuilding precharge over CAN overnight, and a charger fault melted a discharge resistor, so we ran out of time before the dynamic events.
---

## Context

This is the powertrain side of CR30. The pack build is covered in [[pack|CR30 Battery Pack: Design and Manufacture]] and the cooling in [[cell|CR30 Battery Pack: Thermal Optimization for Endurance]]. This post is about getting the EMRAX 208 and its DTI inverter to make reliable power, and the troubleshooting that took.

## The Blown Inverter {tall}

Near the end of CR30's second driving day the motor put out a loud whine and the inverter blew an IGBT. I'd handed the motor setup to our motor engineer and hadn't checked it before we ran. The motor was never properly tuned, and putting real power through an untuned motor is almost certainly what killed the IGBT.

![IGBT removed from the inverter](images/Troubleshooting_To_Comp_Images/Removed_IGBT_From_Inverter.jpg)
![Burnt and cracked semiconductor inside the failed IGBT](images/Troubleshooting_To_Comp_Images/Inside_IGBT_Burnt&Cracked_Semiconductor.jpg)
> The inverter opened up to reach the power stage, and the failed IGBT with its burnt, cracked semiconductor.

A replacement was quoted at £1,400 with a four week lead time, and I didn't have four weeks before competition. So I opened the inverter and traced the failure myself. A diode test from the DC input to each phase terminal reads the voltage drop through each switch, and the failed one stood out immediately against the healthy ones. Checking its gate showed the gate driver had failed too.

![Failed diode reading on the gate](images/Troubleshooting_To_Comp_Images/Bad_Gate_Reading.jpg)
![Good diode reading on the gate](images/Troubleshooting_To_Comp_Images/Good_Gate_Reading_1.jpg)
> Diode testing the gate. The bad reading that flagged the failed device, next to a healthy one.

I found a matching IGBT and gate driver on Digikey, swapped both, and had the inverter running again for around $300 instead of £1,400. I never confirmed exactly what killed that IGBT, but running an untuned motor into it is the obvious cause.

![Replacement IGBT and gate driver](images/Troubleshooting_To_Comp_Images/New_Purchased_IGBT_&_Driver.jpg)
![Repaired power stage confirmed healthy](images/Troubleshooting_To_Comp_Images/COnfirmed_repair_of_IGBT.jpg)
> The replacement IGBT and gate driver, and the power stage confirmed healthy before it went back in.

## The Power Cutout

With the inverter rebuilt, the car kept cutting power partway through a hard acceleration and wouldn't pull again until I brought it to a full stop. The HV system stayed live and the inverter didn't log a fault, so there was nothing obvious to troubleshoot.

At the same time the BMS kept throwing weak cell and open cell faults. I traced those to the pogo pins on the battery monitor boards losing contact with the cells under vibration, so I rebuilt the boards with hardwired connections and the faults stopped.

![Pogo pin stuck from over-compression](images/Troubleshooting_To_Comp_Images/Stuck_Pogo_pin_Due_to_TOO_Much_Compression_Which_Wasnt_accounted_for_In_Design.jpg)
![Battery monitor board rebuilt with fork terminals](images/Troubleshooting_To_Comp_Images/BMB_With_Fork_Terminal_Assembled.jpg)
> A pogo pin stuck from too much compression the design hadn't accounted for, and a monitor board rebuilt with hardwired fork terminals.

![First rebuilt board on a test day with no more faults](images/Troubleshooting_To_Comp_Images/First_Replaced_BMB_During_Test_Day_May_23_No_More_Faults_On_That_Module_Alone_Confirming_Fix.jpg)
> The first rebuilt board on a test day. No more faults on that module on its own, which confirmed the fix before I redid the rest.

I checked the likely causes of the cutout one at a time, going through the current and power limits, the switching frequency, the BMS, and supply sag, and none of them were causing it. The real problem was that I had no data coming off the inverter, so I couldn't see what it was doing in the moment it cut power.

## Inverter Telemetry

The car had a dash logger that was supposed to record the inverter, but every inverter value in the logs sat at its default. I went through the logger firmware first and fixed it dropping samples and only reading one CAN message per loop. Even then, sniffing the bus showed no inverter data at all.

It turned out the inverter sends its detailed data on a second CAN bus, and the high wire for that bus had never been connected at the connector. Landing that one pin brought through everything I'd been missing, including the phase and DC currents, temperatures, faults, and whichever limit was active.

![CAN shield and Uno taped to the side](images/Troubleshooting_To_Comp_Images/Sparkfun_CanBus-Shield_&_Uno_Taped_to_side_Saturday.jpg)
![CAN shield and Uno in a proper housing](images/Troubleshooting_To_Comp_Images/Canshield_Uno_Propper_Housing_Sunday.jpg)
> The CAN logger, taped to the side on Saturday and in a proper housing by Sunday.

After that the only problem left was the bus dropping out under hard pulls, which is the usual sign of switching noise getting into the wiring. The CAN pair was barely twisted and the HV cable shields had been left floating. I twisted the pair properly, grounded the shields, and added ferrite cores. From then on the inverter logged cleanly off a laptop riding in the car.

## Root Cause: Flux Linkage

With real data on the bus, I could finally see the cutout happen. The inverter was hitting its input voltage limit even though the DC bus sat far above any voltage that should have tripped it. The cause was the flux linkage value in the inverter, set to about twice what the motor actually produces. The inverter uses that value to estimate the motor's back-EMF, so it thought the back-EMF was nearly up at the bus voltage and cut power to protect itself when it really had plenty of headroom left. The open loop tuning I'd done earlier should have caught a value that far off, but it had been run incorrectly, and that hid the problem.

I set the flux linkage to its measured value, grounded all the shields to a single point, and retuned the current loop from scratch. That retune was the first time the full procedure had been run properly, and it made clear the two axes needed fairly different gains. After those three changes the cutout was gone and the car pulled over 50 kW for the first time. They went in together, so I can't say for certain which one fixed it, but it hasn't come back since.

![Flux linkage measurement setup](images/Troubleshooting_To_Comp_Images/Flux_Linkage_Measurement_Setup.jpg)
![Flux linkage measurement setup, second view](images/Troubleshooting_To_Comp_Images/Flux_Linkage_Measurement_Setup_2.jpg)
> Measuring the motor's flux linkage, which came out about half the value the inverter had loaded.

## Power

Even with the cutout gone the car was making less power than it should, and the DC current kept capping out well below the limit I'd set. That cap turned out to come from the AC current limit. I'd set it conservatively because I was treating the motor's datasheet peak current as a hard ceiling, and it isn't one. That number is a two minute thermal rating. An acceleration run lasts a few seconds, so there's a lot of room above it for short pulls. What sent me back to look was another team running the same motor at far more current than the datasheet peak.

Torque keeps climbing with current until the iron saturates, so raising the AC limit brought the DC cap and the power up together. On the wheel dyno the car made about 135 Nm at the wheels and into the high 50s of kW.

## Race Prep

The last week before competition went to reliability instead of power. A loose interlock had been opening the shutdown loop under cornering load, killing the car every time it turned one direction, so I reworked the HV connectors to hold it solid. The DC-DC converter was still down, so I built and mounted a backup low voltage battery big enough to get through an endurance run. The rest of the week went to balancing the pack.

![Backup low voltage battery version two layout](images/Troubleshooting_To_Comp_Images/Initial_GLV_Version2_Layout.jpg)
![Finished backup low voltage battery](images/Troubleshooting_To_Comp_Images/Final_GLV_Battery_Assembled.jpg)
> The backup low voltage battery, from the version two layout to the finished pack.

## Competition

Our first EV competition ended up being almost entirely about tech inspection. We got through mechanical tech without much trouble, but the battery and electrical inspections were a different story, mostly around isolation rules we hadn't fully understood going in.

The biggest surprise came partway through, when the precharge board the electrical team had built turned out to be illegal, since by design it could short the tractive system to the battery through a gate. Our software engineer Aaron and I spent the night reusing that board to run precharge entirely over CAN with no analog signal. The only reason that was possible overnight was that the CAN work was already done on the car. The isolation checks then took several tries to pass. My best guess is the carbon filled filament in the pack was leaking a high resistance path, though I never confirmed it.

The last thing standing between us and the track was charging, and we never got past it. A discharge resistor we'd added recently overheated and melted its enclosure. We traced it to a fault inside the charging cart that held the discharge path closed and drained the whole pack through that one resistor. The officials sealed the charger and waived that section, but by the time we got to EV active tech there wasn't enough time left. We finished the event having passed battery and mechanical tech without ever reaching the dynamic events.

![Extra insulation added at competition](images/Troubleshooting_To_Comp_Images/All_Insulation_at_comp_added.jpg)
![Battery sealed at competition after passing tech](images/Troubleshooting_To_Comp_Images/Sealed_Battery_At_Comp_Passing_Bat_Tech.jpg)
> Insulation added at comp to clear the isolation rules, and the battery sealed up after passing battery tech.
