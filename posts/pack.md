---
title: CR30 Battery Pack: Design and Manufacture
date: April 2026
read: 7
order: 2
tags:
  - Design
  - Manufacture
  - Lead
hero: images/TB-001-CR30_Render_1.png
hero-alt: CR30 Battery Pack
hero-scale: 1.15
hero-caption: The CR30 pack. Second iteration, first one to drive.
lead: How Cyclone Racing's CR30 battery pack was built, what went wrong, and what changes for CR31.
specs:
  - Configuration: 28s per module, 5 modules in series
  - Cells: COSMX CA95B0D0HD (carried from CR29)
  - Pack voltage: 600 V fully charged
  - Mass: ~140 lbs
timeline:
  - September 2025 | Milestone 1: Design Phase
    We locked the pack-level design changes off CR29: PAHT-CF module basket, cantilever tab block retention, and self-jigging slots on the aluminum housing. Design phase closed November 1.
  - November 2025 | Milestone 2: Manufacturing Begins
    Began manufacturing. Took ownership of the full pack build: modules, the aluminum housing, HV integration, and chassis mount fit-up.
  - February 2026 | Milestone 3: Modules and Housing Complete
    Finished five-module assembly and the welded aluminum housing. Caught the missed corner slots after weld-up, triggering the HV distribution sleeve redesign to fit the reduced corner volume.
  - March 2026 | Milestone 4: Commissioning Begins
    Pack integration wrapped and commissioning underway. First drive was targeted for March 1, but electrical subsystem revisions and car-level debug pushed the date back.
  - April 2026 | Milestone 5: First Drive
    First drive on April 26. The pack drove at a 40 kW cap with no battery faults; the day ended on a low-SoC trip traced to one mismatched replacement cell.
---

## Context

CR30 is Cyclone Racing's first complete electric car and the first to drive under its own power. Prior to this, there was only the CR29 research car that was never finished, and its pack was only built as a proof of concept. This post covers how the CR30 pack was built. The pack is 140 cells in series, which is near 600 V fully charged. The cells are split into five modules of 28, and the modules sit in a welded aluminum housing that bolts into the chassis.

I was powertrain lead and built the pack. That included the modules, the housing, the high voltage wiring, the chassis mounts, and getting the battery management boards working. The design was shared. My design work was the tabs and slots on the housing, the way the tab blocks are held down, and the retention stack that holds the battery management boards flat.

The cells are the ones bought for CR29. CR29 never ran, and we had no budget for new cells. The cooling design has its own post, [[cell|CR30 Battery Pack: Thermal Optimization for Endurance]], and the CR29 pack build is in [[fsae|CR29 Accumulator: Manufacture]].

## Module Baskets

Each module sits in a basket, a 3D printed shell that holds the 28 cells, insulates them from the aluminum housing, and keeps them from moving. CR29's baskets were polycarbonate. CR30's are PAHT-CF, a carbon fiber filled nylon that was chosen after impact tests against other filaments. Granville designed the basket and filled out its SES, the structural spreadsheet FSAE requires, but struggled to complete it. I took over to finalize the SES and then manufacture the basket.

PAHT-CF warps when it is printed in a part this large, and since our team doesn't have direct access to 3D printers, it took a month to get a basket I could use. The basket was too big for the beds on my Bambu A1 and another powertrain member's X1 Carbon. After digging around, I used a suspension team member's Voron, which was large enough and had an enclosed chamber but didn't have a chamber heater. On the initial prints the corners lifted off the bed and the part came out short in Z. I printed baskets on the Voron with different print patterns, bed temperatures, and speeds, and every one warped too much to use.

I then borrowed a Bambu H2D, which has a heated chamber, and the baskets warped much less. The parts still shrank, so I scaled the model to make up for it. It took three test prints to tune the scaling, and the final model was 1.25% larger in Z.

Even so, the print quality wasn't perfect and every basket came off the printer with burrs. A burr pressed into a pouch cell can puncture it, so I had to sand all five baskets by hand before assembly.

![PAHT-CF basket surface burrs](images/PAHT-CF_Basket_Burrs.jpg)
![PAHT-CF basket surface burrs, second angle](images/PAHT-CF_Basket_Burrs_2.jpg)
> Burrs on a basket straight off the H2D. Every basket had them before sanding.

One side of the basket is open. A plate bolts over that side and holds the cells against the opposite wall. The CAD had about 1 mm of clearance between the plate and the cells. The printed parts had none, and I never found out whether the baskets came out small or the way the cells interfaced with one another caused them to be thicker than modeled. Because of this issue, it takes two people to close a basket, and the plate presses firmly on the cells, sort of like an interference fit. I had already tested cell resistance against pressure for the [[cell|thermal post]] and pressure had almost no effect, so the tight fit shouldn't change how the cells perform and was acceptable.

## Tab Plates and Tab Blocks

The tab plate holds the cells in each module as well as their electrical connections. Each cell's tabs pass through slots in the plate and fold over between two aluminum tab blocks. Bolting the blocks together clamps the tabs. The plate is a PETG print, and it also holds the module's two terminals, which are Amphenol posts. The bulk of the design came from my mentor Gavin, who used a similar concept on the CR29 module design.

The tab blocks are aluminum because the clamp has to be light and stiff, and aluminum also carries heat away from the tabs.

On CR29 every tab block had a bolt at each end. For CR30 Granville and I wanted one bolt per block, which halves the fastener count. Granville first proposed one plastic cover that clamped down over all the blocks. The rules don't allow plastic in a clamped electrical joint, so that wasn't selected. His second idea was a small plastic key/finger over each block, but the keys had stress concentrations and I didn't trust them to last. I suggested adding a small overhang to the plate. One end of each block sits under the overhang and the other end takes a single bolt, cantilevering the block to provide force along the whole length. That removed half the bolts without much effect on cooling.

The bolts thread into aluminum nuts that sit in pockets in the plate. On CR29 the pockets were loose, so a nut could shift as its bolt tightened and get rounded off. For CR30 I made the pockets an interference fit. I printed test pockets at several sizes, and 0.05 mm of interference let a nut press in without damaging the PETG. The nuts we bought for CR30 had rounder corners than CR29's, and tightening the bolts with a tool still deformed the pockets. I got every joint tight but couldn't go tighter without damaging the pockets more. The resistance of those joints was never measured, but it seemed reasonably low in testing.

The initial plan for CR31 is to weld the cell tabs together, ultrasonically or with a laser. That removes the tab blocks, the nuts, and the bolts.

## BMBs

Each module has a battery management board, or BMB, that measures the voltage of every cell. The BMB touches each tab block through a pogo pin, which is a spring-loaded contact. Granville designed the board and the pogo pin layout. I ordered bare boards from JLC, assembled seven of them, and tested them on the modules.

![Seven assembled BMBs](images/7_BMBs_Assembled_No_Connector.jpg)
> Seven BMBs assembled from bare boards. Five went on the modules and two were spares.

The largest problem was that the boards bent. In Granville's design, a BMB is fastened at both ends and unsupported in the middle, and the pogo pin springs push the board away from the tab blocks. The middle of the board bowed, the center pins lost contact, and the BMS lost those cell readings.

The module already had a retention rod that holds the baskets in place, fed through a printed plastic insulator. I redesigned the insulator as a stiffener that presses down across the middle of the board so the center pins make contact.

![BMB retention stack and insulation assembly](images/CR30_BMB_retention+Insulation.jpg)
> The redesigned insulator.

This fix initially seemed to work, but later the pogo pins began sticking in the compressed position and had to be replaced with wires and fork terminals. That repair is in [[powertrain|CR30 Powertrain: Troubleshooting Through Competition]].

Four smaller problems also cost time:

- **Harness termination:** The harness gave cell 12, cell 13 negative, and cell 13 their own terminations. In a series string the positive of cell 12 and the negative of cell 13 are the same point, so those two wires have to share one termination. The BMS reported ten cells missing until I made version two of the BMBs and rewired the harness.
- **Missing trace:** The production boards were missing one trace, so every board had a jumper wire in its place. That was fixed when version two arrived.
- **Thermistor traces:** The thermistor traces share a plane, so a wire end touching a cell during installation can burn a trace. That happened twice. After that I covered the pins with Kapton tape while mounting a board and removed the tape once the board was secured. I moved the components from the damaged board onto a spare.
- **Connector:** The sense connector doesn't tolerate misalignment. Plugging it in slightly off arcs the pins and blows fuses. That can't be fixed on this board revision.

![Module with BMB installed, blown thermistor trace](images/CR30_Module_complete_with_BMB_But_blown_trace.jpg)
![Closeup of blown thermistor trace on removed BMB](images/Blown_trace_BMB_Removed_Pic_of_trace.jpg)
> A finished module with its BMB installed (left), and the burned thermistor trace on the board after it was removed (right).

The boards were meant to make the sense wiring cleaner than CR29's, which was terminated by hand. They worked after these repairs. I later found the boards were illegal, because the low voltage and tractive system wiring terminate into one connector. That didn't stop us from passing that section at comp, but redesigning them is required for CR31.

## Module Lifting Tool

The baskets had no feature for lifting a module out of the housing, and I didn't notice until I had to remove one for service. I designed a lifting tool in about twenty minutes. It attaches through the same holes the vertical retention rods use.

![Module lifting tool](images/CR30_Module_Lift_Tool_Pic_1.jpg "container:display: flex; gap: 1em; justify-content: center; flex-wrap: wrap; align-items: flex-start;|img:flex: 1; max-width: 38%; aspect-ratio: 5/6; object-fit: cover; object-position: center;")
![Module lifting tool, second angle](images/CR30_Module_Lift_Tool_Pic_2.jpg "img:flex: 1; max-width: 38%; aspect-ratio: 5/6; object-fit: cover; object-position: center;")
> The lifting tool. It attaches through the same holes as the retention rod.

## The Aluminum Housing

The housing is a welded aluminum box that holds the five modules, the BMS, and the high voltage wiring. The panels are cut on a waterjet and welded together.

On CR29 the panel edges were flat. Every seam had to be clamped, and we had to pray the panels were square before welding. Even then the walls warped. For CR30 I added tabs along the edges of the outer walls and matching slots in the inner walls. Each tab drops into its slot, so the panels hold themselves in position and need no clamps. That worked on every seam that had tabs and slots. Fitting and welding the housing took over three weeks on CR29 and two days on CR30.

![Waterjet aluminum panels with slot and tab features](images/TB_Container_Layout_All_Waterjet_Parts_with_slots_and_tabs_CR30.jpg)
![Self-jigged housing assembly](images/Self_Jigged_TB_Container_CR30.jpg)
> The waterjet panels with their tabs and slots (left), and the same panels fitted together with no clamps (right).

![Self-jigged housing, isometric view](images/Self_Jigged_TB_COntainer_CR30_Isometric_Pic.jpg)
![Self-jigged housing ready for tack welds](images/Jigged_TB_Container_CR30_For_Easier_Tacks.jpg)
> The fitted housing from another angle (left), and the panels held square for tack welds (right).

I didn't add tabs and slots at the corners. After welding, one corner was bent inward. That corner is where the high voltage components go, and the bend took away enough space that the planned layout no longer fit.

## HV Distribution

CR29 brought high voltage out of the pack through one large Amphenol connector in a corner and used Coroflex cable to connect the modules to each other. CR30 started with the same layout. Partway through the design, a senior team member proposed a printed sleeve in that corner, called the Power Prism, to hold the contactors, the main fuse, and copper busbars. The sleeve packs those parts closer together and shortens the high voltage cable runs.

The sleeve only fit because the busbars could be made smaller. We had been sizing conductors from ampacity tables, and those sizes are larger than this pack needs because it only sees peak current for a few seconds at a time. Recalculating from the conductor's resistance and the heat it produces over an endurance run gave much smaller cross sections.

When the housing corner bent inward, the original sleeve no longer fit. I worked with newer team members to redesign it for the smaller space.

![Power Prism sleeve installed in the pack corner](images/CR30_PowerPrism_In_Container.jpg "wrap:max-width: 700px; margin: 0 auto;|img:width: 100%;")
> The Power Prism in the corner of the pack. It holds the contactors, the main fuse, and the busbars.

The main contactors currently connect to points near the center of the pack. The module terminals beside the corner are electrically the same points. Connecting there on CR31 would replace most of the cable with busbars, free up the center of the pack, make it harder to plug a connector into the wrong place, and save a little weight.

## Chassis Mounts

The pack bolts to the chassis at ten mounts, four at the rear and six at the front. Each mount bolts into an insert that was laid into the carbon fiber monocoque before it was cured.

![Pre-preg insert pucks in the CR30 monocoque](images/Chassis_Puck_Interts_CR30.jpg)
![Pre-preg pucks, low angle](images/Chassis_Puck_Inserts_Low_Angle.jpg)
> The inserts laid into the monocoque before cure, from two angles.

![Shims sizing pack-to-chassis mount tabs](images/Tab_Shims_Sizing_Temporary_Fit.jpg)
> Numbered shims under the pack's mount tabs, used to measure the gap at each mount.

The four rear inserts came out flush with the surface and those mounts bolted on. The six front inserts stuck out above the surface, so the front mounts sat higher than the mounting points on the pack. The pack was already in position and couldn't move. I lowered each front mount until it sat flush with the pack, which left a gap between the mount and the chassis.

The gap was a problem for the SES. The SES requires at least ten mounts for our geometry, and a mount with a gap under it carries more load, so the front mounts failed the strength check. I made an aluminum spacer for each gap. The spacers were machined, welded to the bottom of each mount, and ground flush. The pack, sitting in the chassis, was then used as a jig to drill the bolt holes so they lined up. With the spacers entered in the SES, the mounts passed.

![CR30 pack installed in the chassis for the first time](images/CR30Pack_In_Chassis_First_Time.jpg)
> The pack in the chassis for the first time, after the spacers were fitted.

CR31 will bond the inserts in after the chassis is cured. Bonded inserts come out flush and flat, so the mounts sit where they were designed to.

## First Drive

The first drive was planned for March 1 and happened on April 26. Most of the delay came from the electrical boards outside the pack, which are the SSI, precharge, shutdown, and HVI boards. They went through about six revisions before they passed bench tests, and some revisions that passed on the bench failed on the car. One couldn't carry the full shutdown loop. Another used relays with too much coil resistance, which dropped the voltage below what the contactors need to close. The wiring harness couldn't be finished until the boards were final, so every revision pushed the schedule back.

The pack had one incident in that time. During work inside the pack an allen key touched exposed pins on a BMB connector. The pins arced and blew eight cell fuses on the board. I removed the board and replaced the fuses.

The night before the drive, with the car on a stand, the wheels spun backward. I worked on it until 1 a.m. thinking the polarity was wrong. At 7 a.m. another team member found a setting in the inverter that reverses motor direction. Unchecking that setting fixed it...

![](images/Wheels_Spinning_Backwards_Web.mp4)
> The wheels spinning backward the night before the first drive.

![](images/TW1_1st_Drive_Trimmed_Web.mp4)
> The first drive.

The first time the contactors closed, the Orion BMS reported an open charging relay. The car has no charging relay... I had apparently left a setting enabled that told the BMS to expect one, and turning the setting off cleared the fault.

Next the inverter cut power because the two accelerator pedal sensors disagreed by more than 20%. We tested each sensor alone to find out whether the difference was real or came from the two channels updating at different rates. We didn't find the cause, but we increased the disagreement threshold to 80%.

The inverter also kept faulting for reasons we couldn't trace. The main board from the electrical team wasn't ready, so we had no logged data to read the faults from. We shortened the fault reset time from 5 s to 1 s so the car would recover quickly and keep driving. That was a workaround and not a fix.

![Inverter fault debugging during first test day](images/TW1_Ryan_Clearing_Inverter_Faults.JPG)
> Working on the inverter faults during the first test day.

![](images/TW1_Full_Power_Accel_Web.mp4)
> The last acceleration of the day, just before the low voltage fault.

With the workaround the car ran laps for most of the day at a 40 kW limit, and the pack had no faults of its own. The day ended when one cell reached the low voltage limit. During module assembly we had dropped a cell and replaced it without checking the replacement's state of charge. That cell fell from 3.46 V to 3.296 V over the day while the rest stayed near 3.56 V.

It started to rain as we packed up. Not every grommet on the car was sealed yet, so we would have had to stop anyway.

## Notes for CR31

The changes planned for the next pack:

1. **Weld the cell tabs.** That removes the tab blocks, the nuts, and the bolts.
1. **Tabs and slots on every housing seam,** including the corners.
1. **Bond the chassis inserts after cure** so they sit flush and need no spacers.
1. **Redesign the BMB** with a sturdier sense connector, the correct harness termination, the missing trace, and isolated thermistor traces.
1. **Connect high voltage at the corner modules** with short busbars.
1. **Consider a composite housing.** Aluminum is heavy for this job, and a materials analysis is pending.
1. **Use Melasta pouch cells if the budget allows.** They are 11.5 Ah cells instead of 13 Ah, so the pack would be smaller and lighter.
1. **Match the state of charge of any replacement cell** before installing it. One mismatched cell ended CR30's first drive early.
1. **Prototype more.** About 70% of CR30's parts had small problems that one test print or foam mockup would have caught.

---

![Granville, Gavin, and Maximus holding the completed CR30 pack](images/Holding_the_CR30Pack_Minus_Penthouse.jpg)
> The finished CR30 pack and the people who designed it. Granville (left), Gavin (middle), me (right).
