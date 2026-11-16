---
title: CR30 Powertrain: Troubleshooting Through Competition
date: May-June 2026
order: 1
tags:
  - Powertrain
  - Inverter
  - Lead
hero: images/Troubleshooting_To_Comp_Images/Got_Sticker_For_Battery_&_Mech.jpg
hero-alt: The car with its battery and mechanical tech inspection stickers
hero-caption: The car with its battery and mechanical tech stickers at our first EV competition.
thumb: images/thumbs/powertrain.jpg
share: images/share/powertrain.jpg
lead: What it took to get Cyclone Racing's CR30 driving reliably after the pack was built, from a blown inverter to our first EV competition.
specs-title: The Setup
specs:
  - Motor: EMRAX 208 HV
  - Inverter: DTI HV-550
  - Competition: passed battery + mechanical tech
popup-prefix: pt
timeline:
  - May 9 | Blown Inverter
    An IGBT in the inverter failed near the end of CR30's second driving day, most likely from running a motor that hadn't been tuned. I found it with a diode test and replaced the IGBT and gate driver for about $300 instead of waiting four weeks for a £1,400 inverter.
  - Late May | The Cutout
    The car cut power partway through hard accelerations with the high voltage still on and no fault logged. The limits, the BMS, and the low voltage supply all checked out, and there was no inverter data to show the cause.
  - May 31 | Inverter Telemetry
    I added a CAN data logger to the car in the middle of a test day. A wire for the inverter's second CAN bus had never been connected, so no inverter data reached the logger. Connecting the wire brought the data through. Twisting the CAN pair and grounding the cable shields then stopped the dropouts.
  - June 6 | Flux Linkage and Retune
    The flux linkage in the inverter was set to about twice the motor's measured value. I corrected it, grounded the shields to one point, and retuned the current loop. The car then pulled over 50 kW for the first time. I don't know which change mattered, if any.
  - June 8 | Power on the Dyno
    On the wheel dyno the car made 56 kW and about 135 Nm at the wheels.
  - June 16-20 | Competition
    Passed battery and mechanical tech. An illegal precharge board meant reworking precharge over CAN overnight, and the discharge resistor melted its enclosure during the charging check. We ran out of time before the dynamic events.
---

## Context

This post covers getting CR30's motor and inverter to make reliable power after the pack was built. The motor is an EMRAX 208. The inverter is a DTI HV-550, which turns the battery's DC into the three-phase AC that drives the motor. The pack build is in [[pack|CR30 Battery Pack: Design and Manufacture]] and the cooling design is in [[cell|CR30 Battery Pack: Thermal Optimization for Endurance]].

## The Blown Inverter {tall}

Near the end of CR30's second driving day the motor made a loud whine and the inverter stopped working. An inverter drives the motor through six power switches called IGBTs. They come in three modules of two, one module per motor phase. One switch had failed, so that module had to be replaced.

![IGBT removed from the inverter](images/Troubleshooting_To_Comp_Images/Removed_IGBT_From_Inverter.jpg)
![Burnt and cracked semiconductor inside the failed IGBT](images/Troubleshooting_To_Comp_Images/Inside_IGBT_Burnt&Cracked_Semiconductor.jpg)
> The IGBT removed from the inverter (left), and the burnt, cracked semiconductor inside it (right).

The motor had never been tuned. I had handed the motor setup to our motor engineer and didn't check it before we drove. I never confirmed what killed the IGBT, but running power through an untuned motor is the most likely cause.

A replacement inverter was quoted at £1,400 with a four week lead time. Competition started June 16, so waiting four weeks would have left almost no time to test. I opened the inverter and looked for the failure with a multimeter. In diode mode the meter reads the voltage drop across a switch, and I measured from the DC input to each phase terminal. Five switches read 0.32 V and the sixth read about 0.2 V. Testing the gate of that sixth IGBT showed that its gate driver, the part that switches it on and off, had failed too.

![Failed diode reading on the gate](images/Troubleshooting_To_Comp_Images/Bad_Gate_Reading.jpg)
![Good diode reading on the gate](images/Troubleshooting_To_Comp_Images/Good_Gate_Reading_1.jpg)
> Diode readings at the gate. The failed device (left) and a healthy one (right).

Digikey sells both the IGBT module and the gate driver. I bought one of each and moved the gate resistors from the old driver to the new one so the new module would switch the same way as the other two. The repair cost about $300, and the inverter ran again.

![Replacement IGBT and gate driver](images/Troubleshooting_To_Comp_Images/New_Purchased_IGBT_&_Driver.jpg)
![Repaired power stage confirmed healthy](images/Troubleshooting_To_Comp_Images/COnfirmed_repair_of_IGBT.jpg)
> The replacement IGBT and gate driver (left), and the repaired inverter testing healthy before it went back in the car (right).

## The Power Cutout

With the inverter repaired, the car had a new problem. Partway through a hard acceleration it cut power, and it wouldn't pull again until it came to a full stop. The high voltage stayed on and the inverter logged no fault.

The BMS was also reporting weak cell and open cell faults at the time. Those came from the pogo pins on the battery management boards, or BMBs. A pogo pin is a spring-loaded contact, and each one reads the voltage of one cell. The pins were compressed further than the design accounted for, so they stuck and lost contact with the cells. I replaced the pins with jumper wires that run from the board to fork terminals under the bolts already on the cells.

![Pogo pin stuck from over-compression](images/Troubleshooting_To_Comp_Images/Stuck_Pogo_pin_Due_to_TOO_Much_Compression_Which_Wasnt_accounted_for_In_Design.jpg)
![Battery monitor board rebuilt with fork terminals](images/Troubleshooting_To_Comp_Images/BMB_With_Fork_Terminal_Assembled.jpg)
> A pogo pin stuck in the compressed position (left), and a BMB rebuilt with jumper wires and fork terminals (right).

I rebuilt one board first and ran it on a test day. That module had no faults, so I rebuilt the other four.

![First rebuilt board on a test day with no more faults](images/Troubleshooting_To_Comp_Images/First_Replaced_BMB_During_Test_Day_May_23_No_More_Faults_On_That_Module_Alone_Confirming_Fix.jpg)
> The first rebuilt board on a test day. Its module had no faults, so the other four boards got the same repair.

The BMS faults were gone but the cutout wasn't. I checked the current limits, the power limit, the switching frequency, the BMS, and low voltage supply sag one at a time, and none of them caused the cutout.

## Inverter Telemetry

The car had no way to record what the inverter was doing, so I added a data logger in the middle of a test day. The logger is an Arduino Uno with a SparkFun CAN shield and a microSD card. It reads messages from CAN, the two-wire network the car's electronics use to talk to each other, and writes them to the card. The car had no mount for a logger, so I taped it to the side. On the first runs every inverter value in the excel was a zero.

I had written the logger's firmware in a hurry, so I checked it first and found two problems. The firmware opened and closed the file on the SD card every loop, which dropped samples. It also read only one CAN message per loop, so messages backed up and were lost. I fixed both, and the inverter values were still zero.

Next I wrote a short Arduino program that printed the ID of every message on the CAN bus. The only IDs that printed came from the IMU, the car's motion sensor. The inverter should have been sending eight messages, and none of them showed up.

The inverter has two CAN buses, and it sends its detailed data on the second one. At the inverter's connector, the high wire for the second CAN bus had never been connected. Once that wire was connected, all eight messages appeared and the excel filled with inverter data. That included the phase and DC currents, the temperatures, the faults, and which limit was active.

![CAN shield and Uno taped to the side](images/Troubleshooting_To_Comp_Images/Sparkfun_CanBus-Shield_&_Uno_Taped_to_side_Saturday.jpg)
![CAN shield and Uno in a proper housing](images/Troubleshooting_To_Comp_Images/Canshield_Uno_Propper_Housing_Sunday.jpg)
> The CAN logger, taped to the side of the car on Saturday and in a housing by Sunday.

One problem was left. The CAN bus dropped out during hard acceleration, which is when the inverter switches the most current and makes the most electrical noise. The two CAN wires are twisted together so that noise reaches both wires equally and cancels out. Our pair had about one twist per inch. The shields on the high voltage cables had also been assembled incorrectly and weren't connected to ground. I retwisted the CAN pair to three twists per inch, grounded the shields, and added ferrite cores to the CAN wiring. After that the dropouts were rare, and the inverter data logged to a laptop in the car, which it had never done before.

## Flux Linkage and Tuning

With inverter data in the logs I could see what happened during a cutout. The inverter was hitting its input voltage limit, even though the battery voltage was far above that limit.

One setting in the inverter was wrong. A spinning motor generates its own voltage, called back-EMF, and flux linkage is the number that tells the inverter how much back-EMF to expect at a given speed. I measured it by spinning the motor with a Milwaukee drill and reading the back-EMF against RPM. The measured value was about half the value loaded in the inverter, so I corrected it.

![Flux linkage measurement setup](images/Troubleshooting_To_Comp_Images/Flux_Linkage_Measurement_Setup.jpg)
![Flux linkage measurement setup, second view](images/Troubleshooting_To_Comp_Images/Flux_Linkage_Measurement_Setup_2.jpg)
> The setup for measuring flux linkage. A drill spins the motor while the back-EMF is read.

The current loop tuning had also been done wrong. Our motor engineer had run the inverter's open loop tuning with the rotor free to spin, and the procedure requires the rotor to be locked. I reran it with the rotor locked, and it showed that the motor's two control axes needed different gains. I also grounded all the cable shields to a single point.

After those changes the car pulled over 50 kW for the first time. I don't know which change mattered, if any.

## On the Dyno

On the wheel dyno the car made 56 kW and about 135 Nm at the wheels. The run in the video had no cutout and reached the power limit I had set. Later driving logs peaked in the low 60s of kW. The rules allow 80 kW, and the car unfortunately never officially met that.

![CR30 on the wheel dyno during a full power run](images/Dyno_Test_Web.mp4)
> A full power run on the wheel dyno. Gavin is driving, and Ryan is holding my laptop to screen record the inverter data.

## Race Prep

The last week before competition went to reliability.

The car lost power every time it turned left. Each high voltage connector carries an interlock, a small circuit that shuts the car down if the connector comes apart. The interlock on the HV+ connector leaving the battery was loose, and cornering load opened it. I replaced that connector and its cable with a new Amphenol one, and the car stopped cutting out in left turns.

The DC-DC converter, which powers the low voltage system from the main battery, was still not working. The car's low voltage battery holds 6 Ah. I built a 13 Ah backup battery and wired it in parallel with the first, which gives 19 Ah and is enough for an endurance run.

![Backup low voltage battery version two layout](images/Troubleshooting_To_Comp_Images/Initial_GLV_Version2_Layout.jpg)
![Finished backup low voltage battery](images/Troubleshooting_To_Comp_Images/Final_GLV_Battery_Assembled.jpg)
> The backup low voltage battery. The version two layout (left) and the finished battery (right).

The rest of the week went to balancing the pack, which means bringing every cell to the same voltage.

## Competition

Competition was our first as an electric team, and nearly all of it went to tech inspection. A car needs six inspection stickers before it can run an event: mechanical, battery and electrical, EV active, tilt, rain, and brakes. The last three are easy to pass once a car is through EV active. We got two stickers and were stopped at EV active.

We passed mechanical tech without much trouble. Most of our time went to the battery and electrical station, on two rules we hadn't fully understood. The high voltage system, called the tractive system or TS, has to be kept separate from the low voltage system. High voltage parts also need two layers of insulation. We added insulation at the event to meet the second rule.

The precharge board failed the first rule. Precharge charges the inverter's capacitors slowly through a resistor before the main contactors close, so there is no surge of current. The board the electrical team built connected the battery side to the tractive system side through an isolated gate, and those two are supposed to be fully separate. On the insulation resistance test that path read about 5 MΩ where it should have read open. Our software engineer Aaron and I spent the night reworking the same board to run precharge over CAN with no analog signal. That was only possible overnight because the CAN work on the car was already done.

The isolation checks still took several tries to pass. My best guess is that the carbon filled baskets leaked a small current from module to module, but I never confirmed it, because it mysteriously went away after the competition and I couldn't replicate it.

The last thing between us and passing the battery portion of tech was charging, and technically we didn't complete it. While demonstrating charging, the discharge resistor overheated and melted its enclosure. The discharge circuit is intended to only bleed the inverter's capacitors when the shutdown circuit opens, which effectively means the pack is off. Its relay is supposed to open whenever shutdown is high and the pack is live. The relay wasn't opening, so the resistor was attempting to discharge the full pack rather than just the capacitors. That issue seemed to be in part due to an interlock inside the charger which had failed. The charger was an off-the-shelf unit we hadn't designed and couldn't reasonably repair at the competition, so the officials sealed it, which prevented us from using it during the competition, and then waived that section. Regardless, by then there wasn't enough time to complete EV active tech, so we left having passed battery and mechanical tech without running a dynamic event.

![Extra insulation added at competition](images/Troubleshooting_To_Comp_Images/All_Insulation_at_comp_added.jpg)
![Battery sealed at competition after passing tech](images/Troubleshooting_To_Comp_Images/Sealed_Battery_At_Comp_Passing_Bat_Tech.jpg)
> Insulation added at competition to meet the insulation rule (left), and the battery sealed after passing battery tech (right).
