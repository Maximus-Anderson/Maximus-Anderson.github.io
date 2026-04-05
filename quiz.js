// quiz.js — Powertrain Fundamentals adaptive quiz

// ── Question Bank ─────────────────────────────────────────────────────────────
const QUESTION_BANK = [
    // ── Battery — Beginner ────────────────────────────────────────────────────
    {
        id: 1, topic: 'Battery', elo: 850,
        question: 'What does a higher cell capacity (Ah) rating mean?',
        choices: [
            'The cell can deliver more charge before being depleted',
            'The cell has a higher voltage',
            'The cell charges faster',
            'The cell weighs less'
        ],
        answer: 0,
        explanation: 'Amp-hours (Ah) is a measure of charge capacity — how many amps the cell can deliver for how many hours. A 13 Ah cell can theoretically supply 13 A for one hour, or 1 A for 13 hours before reaching its discharge cutoff voltage.'
    },
    {
        id: 2, topic: 'Battery', elo: 900,
        question: 'In a 28s1p configuration, how many cells are there in total?',
        choices: ['1', '28', '56', '14'],
        answer: 1,
        explanation: '28s1p means 28 cells in series, 1 cell per parallel group. Total cells = 28 × 1 = 28. If it were 28s2p, there would be 56 cells.'
    },
    {
        id: 3, topic: 'Battery', elo: 900,
        question: 'What is the primary purpose of applying stack pressure to a pouch cell module?',
        choices: [
            'To increase the cell voltage',
            'To suppress swelling and reduce dendrite formation',
            'To improve thermal conductivity between cells',
            'To reduce the internal resistance of the BMS wiring'
        ],
        answer: 1,
        explanation: 'Controlled stack pressure suppresses swelling and discourages lithium dendrite growth, which can cause internal short circuits. Too little pressure accelerates degradation; too much can damage the cell.'
    },
    {
        id: 4, topic: 'Battery', elo: 850,
        question: 'What does "nominal voltage" mean for a lithium cell, and what is a typical nominal voltage for a lithium NMC cell?',
        choices: [
            'The maximum voltage the cell can reach during charging; typically 4.2 V',
            'The minimum safe discharge voltage; typically 3.0 V',
            'The average operating voltage over a typical discharge curve; typically ~3.6–3.7 V for NMC cells',
            'The voltage at exactly 50% state of charge; typically 3.9 V'
        ],
        answer: 2,
        explanation: 'Nominal voltage is a representative average across the full discharge curve — not the fully-charged peak (~4.2 V for NMC) and not the minimum cutoff (~2.5–3.0 V). For NMC cells the nominal is typically 3.6–3.7 V (e.g. the COSMX CA95 used on CR29/CR30 is 3.73 V nominal). LFP cells are lower, around 3.2–3.3 V nominal.'
    },
    {
        id: 5, topic: 'Battery', elo: 950,
        question: 'What does DCIR stand for and why does a lower value matter?',
        choices: [
            'Direct Current Internal Resistance — lower means less voltage sag under load',
            'Dynamic Cell Impedance Rating — lower means faster charge acceptance',
            'Discharge Cycle Internal Ratio — lower means longer cycle life',
            'Direct Current Impedance Range — lower means better thermal performance'
        ],
        answer: 0,
        explanation: 'DCIR (DC Internal Resistance) is the cell\'s opposition to current under a DC pulse. Lower DCIR means less voltage sag when drawing high current — critical for motorsport. It also means less heat generated (P = I²R).'
    },
    {
        id: 6, topic: 'Battery', elo: 1000,
        question: 'A pouch cell\'s tabs are made of two different metals. Which combination is correct?',
        choices: [
            'Both tabs are copper',
            'Cathode tab is aluminum; anode tab is nickel-plated copper',
            'Cathode tab is nickel; anode tab is aluminum',
            'Cathode tab is copper; anode tab is aluminum'
        ],
        answer: 1,
        explanation: 'The cathode (positive) tab is aluminum — compatible with high-potential chemistry and resists oxidation. The anode (negative) tab is copper (nickel-plated for weldability) — better conductor, and aluminum would alloy with lithium at low potentials.'
    },
    {
        id: 7, topic: 'Battery', elo: 1050,
        question: 'Why is thermal runaway in a lithium cell particularly dangerous?',
        choices: [
            'It causes the cell voltage to drop to zero instantly',
            'It releases hydrogen gas which is mildly flammable',
            'It is self-sustaining — heat causes more reactions, producing more heat, and can release toxic HF gas',
            'It only occurs in cylindrical cells, not pouch cells'
        ],
        answer: 2,
        explanation: 'Thermal runaway is a cascade: heat triggers exothermic decomposition, which generates more heat. It can eject flaming electrolyte, and LiPF₆ electrolyte decomposition can produce hydrogen fluoride (HF) gas — highly toxic and corrosive. Not that I\'d know anything about that.'
    },
    {
        id: 8, topic: 'Battery', elo: 1100,
        question: 'What does "energy density" of 180 Wh/kg mean in practical terms?',
        choices: [
            'The cell can deliver 180 watts for one kilogram of load',
            'Every kilogram of cell mass stores 180 watt-hours of energy',
            'The cell charges at 180 watts per kilogram of mass',
            'The pack provides 180 kJ of energy per discharge cycle'
        ],
        answer: 1,
        explanation: 'Gravimetric energy density (Wh/kg): 1 kg of cell stores 180 Wh. At 180 Wh/kg, a 1 kg cell can power a 180 W device for one hour. High energy density means more pack energy without weight penalty — critical for FSAE.'
    },
    {
        id: 9, topic: 'Battery', elo: 1150,
        question: 'In series-connected cells, what happens to the pack if one cell has significantly lower capacity than the rest?',
        choices: [
            'The other cells compensate by delivering more current',
            'The weak cell limits the entire string — the pack hits its cutoff voltage when that cell is depleted',
            'Only the weak cell stops working; the rest continue normally',
            'The BMS bypasses the weak cell automatically'
        ],
        answer: 1,
        explanation: 'In a series string, all cells carry the same current. The weakest cell depletes first and pulls its voltage down to cutoff, stopping the whole string — even if other cells have remaining capacity. This is why cell matching matters for pack design.'
    },
    {
        id: 10, topic: 'Battery', elo: 1200,
        question: 'What is the primary risk when bending or folding a pouch cell\'s tab at its root?',
        choices: [
            'The tab heats up and welds itself shut',
            'The internal electrode layers delaminate from the tab, increasing resistance or causing an open circuit',
            'The polymer casing cracks, exposing lithium metal',
            'The cell immediately short-circuits due to aluminum-copper contact'
        ],
        answer: 1,
        explanation: 'Pouch cell tabs are ultrasonically welded stacks of thin foils bonded to the electrode inside the cell. Bending at the root stresses this weld and can cause delamination — raising resistance, reducing capacity, causing hot spots.'
    },

    // ── Powertrain ────────────────────────────────────────────────────────────
    {
        id: 11, topic: 'Powertrain', elo: 850,
        question: 'What is the function of a motor controller (inverter) in an EV powertrain?',
        choices: [
            'It stores energy from regenerative braking in a capacitor',
            'It converts DC from the battery into AC (or controlled DC) to drive the motor',
            'It monitors cell temperatures and balances the pack',
            'It steps up battery voltage to reduce current losses in the wiring'
        ],
        answer: 1,
        explanation: 'The inverter converts battery DC into the waveform the motor needs. For a three-phase AC motor, it synthesises three sinusoidal AC phases at variable frequency and amplitude to control motor speed and torque.'
    },
    {
        id: 12, topic: 'Powertrain', elo: 950,
        question: 'What does peak torque at zero RPM mean for an electric motor compared to a combustion engine?',
        choices: [
            'Electric motors need a clutch to launch because torque is zero at stall',
            'Electric motors produce maximum torque from a standstill, unlike combustion engines which need to build RPM',
            'Electric motors produce the same torque curve shape as combustion engines',
            'Peak torque at zero RPM means the motor overheats at launch'
        ],
        answer: 1,
        explanation: 'Electric motors generate torque proportional to current, independent of speed. At stall, full current can be applied, giving peak torque immediately. ICE vehicles need RPM to build combustion pressure and must use a clutch — EVs launch at full torque directly.'
    },
    {
        id: 13, topic: 'Powertrain', elo: 1000,
        question: 'In a permanent magnet synchronous motor (PMSM), what is "field weakening"?',
        choices: [
            'Reducing current to protect the motor at high temperature',
            'Injecting negative d-axis current to extend the motor\'s speed range beyond its base speed',
            'Increasing supply voltage to raise peak RPM',
            'Reversing the motor direction for regenerative braking'
        ],
        answer: 1,
        explanation: 'At base speed, back-EMF equals the available voltage and the motor can no longer accelerate. Field weakening applies negative d-axis current to reduce effective flux, lowering back-EMF and allowing higher RPM — at the cost of reduced torque.'
    },
    {
        id: 14, topic: 'Powertrain', elo: 1100,
        question: 'What is the difference between motor efficiency and drivetrain efficiency?',
        choices: [
            'They are identical — drivetrain efficiency is just motor efficiency reported differently',
            'Motor efficiency is electrical-to-mechanical conversion; drivetrain efficiency includes additional losses in gearbox, differential, shafts, and bearings',
            'Drivetrain efficiency only accounts for thermal losses; motor efficiency accounts for friction losses',
            'Motor efficiency is only measured at peak power; drivetrain efficiency is measured across all operating points'
        ],
        answer: 1,
        explanation: 'Motor efficiency = mechanical power out / electrical power in. Drivetrain efficiency includes all components between motor shaft and wheels: gearing, differentials, CV joints, bearings. Total drivetrain efficiency is the product of each component\'s efficiency.'
    },
    {
        id: 15, topic: 'Powertrain', elo: 1250,
        question: 'Why might a lower gear ratio (closer to 1:1) be chosen for an FSAE EV on a tight autocross course?',
        choices: [
            'Lower gear ratios always maximize acceleration at all speeds',
            'Autocross requires very high top speed so a low ratio reduces RPM at speed',
            'Tight courses are acceleration-limited and low-speed torque is already high in EVs; a lower ratio reduces peak motor RPM and can improve efficiency',
            'A 1:1 ratio eliminates all differential losses'
        ],
        answer: 2,
        explanation: 'FSAE autocross courses are slow and tight — top speed is limited, and the car accelerates frequently from low speed. EVs already have abundant low-speed torque, so a lower gear ratio keeps motor RPM in its efficient operating region and reduces gearbox losses.'
    },

    // ── Calculations ──────────────────────────────────────────────────────────
    {
        id: 16, topic: 'Calculations', elo: 900,
        question: 'A cell has 3.73V nominal and the pack is 28s. What is the pack nominal voltage?',
        choices: ['3.73 V', '13 V', '104.44 V', '52.22 V'],
        answer: 2,
        explanation: 'Series connection adds voltages. Pack voltage = 28 × 3.73 V = 104.44 V. Actual voltage is higher when fully charged (~4.2 V/cell = 117.6 V) and lower near empty (~3.0 V/cell = 84 V).'
    },
    {
        id: 17, topic: 'Calculations', elo: 950,
        question: 'If a cell is rated at 13 Ah and the pack is 28s1p at 104.44V nominal, what is the pack energy in kWh?',
        choices: ['0.169 kWh', '1.357 kWh', '13.58 kWh', '104.44 kWh'],
        answer: 1,
        explanation: 'Pack energy = pack voltage × capacity = 104.44 V × 13 Ah = 1357.7 Wh ≈ 1.36 kWh. In 28s1p, capacity equals one cell\'s capacity (13 Ah) because there is only one parallel group.'
    },
    {
        id: 18, topic: 'Calculations', elo: 1050,
        question: 'A motor draws 200 A from a 100 V battery. The motor outputs 15 kW of mechanical power. What is the motor efficiency?',
        choices: ['15%', '75%', '85%', '95%'],
        answer: 1,
        explanation: 'Input electrical power = V × I = 100 V × 200 A = 20 kW. Efficiency = output / input = 15 kW / 20 kW = 75%. The remaining 5 kW is dissipated as heat in the motor windings, iron core, and friction.'
    },
    {
        id: 19, topic: 'Calculations', elo: 1150,
        question: 'Cell DCIR is 1.5 mΩ. At 200 A discharge current, how much voltage does one cell sag?',
        choices: ['0.003 V', '0.30 V', '3.0 V', '30 V'],
        answer: 1,
        explanation: 'Voltage sag = I × R = 200 A × 0.0015 Ω = 0.30 V per cell. In a 28s pack, total pack voltage sag = 28 × 0.30 V = 8.4 V. Nominal 104.44 V drops to about 96 V under this load.'
    },
    {
        id: 20, topic: 'Calculations', elo: 1300,
        question: 'A 28s1p pack at 104V nominal is discharged at a constant 150 A. Ignoring voltage droop, how long to deplete a 13 Ah pack?',
        choices: ['5.2 minutes', '8.67 minutes', '52 minutes', '87 minutes'],
        answer: 0,
        explanation: 'Time = capacity / current = 13 Ah / 150 A = 0.0867 hours = 5.2 minutes. FSAE endurance events take ~20–25 minutes. Constant 150 A would deplete the pack in 5 minutes — real driving uses variable current and energy management strategy.'
    },

    // ── Safety & Rules ────────────────────────────────────────────────────────
    {
        id: 21, topic: 'Safety', elo: 850,
        question: 'What is the purpose of a shutdown circuit (SDC) in an FSAE electric vehicle?',
        choices: [
            'It shuts down the motor controller if the driver exceeds a speed limit',
            'It is a series circuit that cuts power to the AIRs (contactors) if any safety condition is violated',
            'It controls regenerative braking energy flow',
            'It monitors cell temperatures and balances the pack'
        ],
        answer: 1,
        explanation: 'The SDC is a series loop of normally-open safety switches. Any single fault (IMD trip, BMS fault, BSPD activation, TSMS off, inertia switch) opens the loop, de-energizing the AIRs and disconnecting the tractive system. Failures default to a safe, de-energized state.'
    },
    {
        id: 22, topic: 'Safety', elo: 950,
        question: 'What does an IMD (Insulation Monitoring Device) detect and why does it matter?',
        choices: [
            'It measures current imbalance between motor phases to detect winding faults',
            'It detects insulation breakdown between the HV tractive system and the LV/chassis ground, opening the SDC on fault',
            'It monitors inter-cell insulation resistance to prevent thermal runaway',
            'It measures the impedance of the accumulator housing for structural integrity'
        ],
        answer: 1,
        explanation: 'The IMD monitors isolation resistance between the tractive system (high voltage) and chassis ground. A fault — e.g. chafed wiring contacting the chassis — reduces this below threshold. The IMD opens the SDC before anyone can be exposed to shock. FSAE rules require ≥500 Ω/V minimum.'
    },
    {
        id: 23, topic: 'Safety', elo: 1000,
        question: 'Why must an FSAE accumulator container be structurally rated to prevent HV exposure in a crash?',
        choices: [
            'To reduce the weight of the container by using thinner walls with an air gap',
            'To ensure the HV terminals and cells remain protected if the outer wall is breached, preventing accidental contact or short-circuit',
            'Because double walls improve thermal insulation, keeping cells at operating temperature',
            'FSAE rules require double walls only for the GLV system, not the accumulator'
        ],
        answer: 1,
        explanation: 'In a crash, the accumulator container may be impacted. FSAE rules require the HV terminals and cells to remain protected from accidental contact even after an impact — keeping first responders safe from live HV conductors and preventing secondary short-circuit fires.'
    },
    {
        id: 24, topic: 'Safety', elo: 1100,
        question: 'What is the function of a BSPD (Brake System Plausibility Device)?',
        choices: [
            'It monitors brake pad wear and alerts the driver when pads need replacing',
            'It detects simultaneous hard braking and high motor current (implausible state), and opens the SDC',
            'It balances brake bias between front and rear circuits automatically',
            'It prevents brake fluid from overheating by monitoring caliper temperature'
        ],
        answer: 1,
        explanation: 'The BSPD monitors brake pressure and motor current. If both are above their thresholds simultaneously — braking hard while the motor draws significant current — this is considered implausible and dangerous. The BSPD opens the SDC to prevent simultaneous high-force acceleration and braking.'
    },
    {
        id: 25, topic: 'Safety', elo: 1200,
        question: 'What is the SES (Structural Equivalency Spreadsheet) used for in FSAE?',
        choices: [
            'It documents every weld joint in the chassis for inspection purposes',
            'It is a required analysis proving that a non-standard chassis meets the structural stiffness and strength of the specified steel tube baseline',
            'It specifies the minimum wall thickness for the accumulator container',
            'It is submitted after the event to report any structural failures during competition'
        ],
        answer: 1,
        explanation: 'Any chassis deviation from the steel tube baseline (different tube sizes, material substitutions, carbon monocoques) requires an SES. Teams prove equivalent bending stiffness, tensile strength, etc. It is reviewed at technical inspection.'
    },

    // ── Battery — continued ───────────────────────────────────────────────────
    {
        id: 26, topic: 'Battery', elo: 850,
        question: 'What is the difference between a cell, a module, and a pack?',
        choices: [
            'They are all the same thing — just different industry naming conventions',
            'A cell is the basic electrochemical unit; a module is a group of cells with structural support; a pack is the full assembly of modules with BMS and housing',
            'A module is a single cell in a metal can; a pack is a module with added electronics',
            'A cell and module are identical; a pack adds the charger'
        ],
        answer: 1,
        explanation: 'Cell = individual electrochemical unit. Module = cells grouped together with busbars, cell holders, and sensing — a structural sub-assembly. Pack = complete system: modules + BMS + housing + contactors + thermal management.'
    },
    {
        id: 27, topic: 'Battery', elo: 850,
        question: 'What does "state of charge" (SoC) represent?',
        choices: [
            'The ratio of current voltage to max voltage',
            'The percentage of remaining charge relative to full capacity',
            'The number of cycles the cell has completed',
            'The ratio of cell internal resistance to nominal resistance'
        ],
        answer: 1,
        explanation: 'SoC = (remaining charge / total capacity) × 100%. At 100% SoC the cell is fully charged; at 0% it has reached its discharge cutoff. SoC is not directly measurable — the BMS estimates it via voltage, coulomb counting, or model-based methods.'
    },
    {
        id: 28, topic: 'Battery', elo: 900,
        question: 'What is the difference between energy (Wh) and power (W) in the context of a battery pack?',
        choices: [
            'They are the same quantity expressed in different units',
            'Energy is how much total work the pack can deliver; power is how fast it can deliver it',
            'Power determines pack voltage; energy determines pack current',
            'Energy is a DC quantity; power is an AC quantity'
        ],
        answer: 1,
        explanation: 'Energy (Wh) = total stored work — how long the pack can run. Power (W) = rate of energy delivery — how hard it can push. A pack with high energy but low power runs long but can\'t sprint. FSAE demands both: enough energy for endurance and enough power for acceleration events.'
    },
    {
        id: 29, topic: 'Battery', elo: 900,
        question: 'What does "C-rate" mean? If a 13 Ah cell is discharged at 2C, what is the current?',
        choices: [
            'C-rate is the number of charge cycles; 2C means 2 full charges. Current = 2 A',
            'C-rate is the charge rate only; discharge is always 1C. Current = 13 A',
            'C-rate is a multiplier on capacity: 2C = 2 × 13 Ah = 26 A',
            'C-rate is the voltage multiplier; 2C = 2 × nominal voltage'
        ],
        answer: 2,
        explanation: '1C = the current that would fully discharge the cell in exactly 1 hour = capacity in Ah. 2C = twice that = 26 A for a 13 Ah cell, depleting it in 30 minutes. Higher C-rate means faster discharge and higher heat generation (P = I²R).'
    },
    {
        id: 30, topic: 'Battery', elo: 900,
        question: 'Why are pouch cells generally preferred over cylindrical cells for high-current FSAE applications?',
        choices: [
            'Pouch cells have higher voltage per cell than cylindrical cells',
            'Pouch cells have a larger flat electrode area giving lower DCIR, better power delivery, and higher gravimetric energy density',
            'Pouch cells are mechanically more robust than cylindrical cells in crash scenarios',
            'Pouch cells do not require a BMS, reducing system complexity'
        ],
        answer: 1,
        explanation: 'The large flat electrode area of pouch cells gives lower DC internal resistance than cylindrical cells of similar chemistry — less voltage sag and less heat at high currents. They also tend to have better gravimetric energy density. The tradeoff is mechanical fragility: they need careful compression and housing.'
    },
    {
        id: 31, topic: 'Battery', elo: 950,
        question: 'What is coulomb counting and what is its main limitation for SoC estimation?',
        choices: [
            'Coulomb counting integrates current over time to track charge in/out, but errors accumulate and it cannot self-correct without a reference point',
            'Coulomb counting measures individual electron flow and is perfectly accurate over the pack lifetime',
            'Coulomb counting uses voltage to estimate SoC and is limited by cell temperature effects',
            'Coulomb counting is only valid during charging, not during discharge'
        ],
        answer: 0,
        explanation: 'Coulomb counting integrates current (∫I·dt) to track charge in/out. It\'s simple and fast, but any sensor error or noise integrates over time — errors grow unbounded. Without periodic recalibration (e.g. at full charge), the estimate drifts. Most BMS systems combine it with voltage-based correction.'
    },
    {
        id: 32, topic: 'Battery', elo: 950,
        question: 'What is the purpose of cell balancing in a BMS?',
        choices: [
            'To equalize current flow through all cells during peak discharge',
            'To equalize state of charge across cells in a series string, preventing the weakest cell from limiting the pack',
            'To balance the temperature distribution across modules',
            'To equalize the DCIR of all cells to a common value'
        ],
        answer: 1,
        explanation: 'Cells in a series string have slightly different capacities and self-discharge rates. Over cycles, SoC diverges. The weakest cell hits cutoff first, leaving stranded capacity in the others. Balancing — passive (bleed excess energy) or active (transfer charge) — keeps all cells at the same SoC so the full string capacity is usable.'
    },
    {
        id: 33, topic: 'Battery', elo: 950,
        question: 'What is "state of health" (SoH) and how does it differ from SoC?',
        choices: [
            'SoH and SoC are the same metric reported at different timescales',
            'SoH measures the remaining usable capacity relative to the cell\'s original rated capacity; SoC measures remaining charge relative to current usable capacity',
            'SoH is a voltage metric; SoC is a current metric',
            'SoH only applies to the BMS hardware; SoC applies to the cells'
        ],
        answer: 1,
        explanation: 'SoC = how full the battery is right now (0–100% of current capacity). SoH = how degraded the battery is from new (100% = new; 80% SoH means only 80% of original capacity remains). A cell at 80% SoH and 50% SoC has 40% of its original energy available.'
    },
    {
        id: 34, topic: 'Battery', elo: 1000,
        question: 'What is a Ragone plot and what tradeoff does it illustrate?',
        choices: [
            'A plot of cell voltage vs temperature showing safe operating range',
            'A log-log plot of specific energy (Wh/kg) vs specific power (W/kg) showing the energy-power tradeoff for different storage technologies',
            'A plot of capacity fade vs cycle count for different cell chemistries',
            'A plot of DCIR vs SoC used to characterize cell performance'
        ],
        answer: 1,
        explanation: 'The Ragone plot maps energy density (how much) vs power density (how fast) on log-log axes. Capacitors have very high power but low energy; lithium cells are in the middle; fuel cells have high energy but low power. For FSAE, you want to be as far upper-right as possible — high energy AND high power.'
    },
    {
        id: 35, topic: 'Battery', elo: 1000,
        question: 'In the context of lithium-ion cells, what is the SEI layer and why does it matter?',
        choices: [
            'The Solid Electrode Interface — a conductive coating applied during manufacture to improve tab bonding',
            'The Solid Electrolyte Interphase — a passivation layer that forms on the anode during first charge, consuming some lithium and affecting long-term capacity',
            'The Secondary Electrochemical Indicator — a BMS-measured value for predicting cell failure',
            'The Stable Energy Index — a rating system for comparing cell chemistries'
        ],
        answer: 1,
        explanation: 'The SEI forms on the graphite anode during initial charge cycles as electrolyte partially reduces. It consumes some lithium (irreversible capacity loss) but stabilizes and protects the anode. SEI growth over the cell\'s life contributes to capacity fade and resistance increase.'
    },
    {
        id: 36, topic: 'Battery', elo: 1000,
        question: 'What does "parallel group" mean in pack architecture, and what does adding cells in parallel do?',
        choices: [
            'Parallel groups increase pack voltage proportionally',
            'A parallel group is cells connected positive-to-positive and negative-to-negative; it increases capacity (Ah) while keeping voltage the same as a single cell',
            'Parallel connection reduces DCIR but also reduces capacity',
            'Parallel groups are only used when series strings fail, as a redundancy measure'
        ],
        answer: 1,
        explanation: 'Cells in parallel share the same terminals — voltages must match. Adding N cells in parallel multiplies capacity by N (more Ah) while voltage stays at one cell\'s voltage. It also divides effective DCIR by N. In a 28s4p pack: voltage = 28 × Vcell, capacity = 4 × Ah_cell.'
    },
    {
        id: 37, topic: 'Battery', elo: 1050,
        question: 'What is the open circuit voltage (OCV) of a cell and how does it relate to SoC?',
        choices: [
            'OCV is the voltage measured while current is flowing — it equals nominal voltage at all times',
            'OCV is the cell terminal voltage measured after sufficient rest with no current flowing; it follows a predictable curve with SoC and can be used as a reference for SoC estimation',
            'OCV is the maximum voltage the cell can reach and is fixed by chemistry regardless of SoC',
            'OCV equals nominal voltage plus the voltage sag from DCIR'
        ],
        answer: 1,
        explanation: 'With no current flowing, the cell\'s terminal voltage relaxes to its open circuit voltage — a thermodynamic quantity that depends on SoC via the electrode chemistry. The BMS can use OCV (measured after a rest period) as a ground-truth reference to recalibrate coulomb counting.'
    },
    {
        id: 38, topic: 'Battery', elo: 1050,
        question: 'Why does DCIR increase at low temperatures?',
        choices: [
            'Cold temperatures increase electrolyte conductivity, paradoxically slowing ion flow',
            'Cold slows ionic mobility in the electrolyte and charge transfer kinetics at electrode surfaces, increasing resistance to current flow',
            'Cold temperatures cause the SEI layer to dissolve, exposing bare lithium',
            'Cold increases DCIR only in NCA chemistry; NMC cells are unaffected'
        ],
        answer: 1,
        explanation: 'Ionic conductivity in the electrolyte and charge transfer kinetics at the electrode-electrolyte interface are thermally activated (Arrhenius-type) processes. At low temperatures, both slow significantly — ions move through the electrolyte more slowly and intercalation is less favorable, directly increasing measured DCIR and reducing available power.'
    },
    {
        id: 39, topic: 'Battery', elo: 1050,
        question: 'What is lithium plating, when does it occur, and why is it dangerous?',
        choices: [
            'Lithium plating is the normal process of lithium intercalating into the graphite anode during charging',
            'Lithium plating occurs when lithium cannot intercalate fast enough and deposits as metallic lithium on the anode surface; it can form dendrites that penetrate the separator and cause internal shorts',
            'Lithium plating is a cathode phenomenon that occurs at high SoC and reduces energy density',
            'Lithium plating is triggered by over-discharge and is fully reversible on the next charge'
        ],
        answer: 1,
        explanation: 'During charging, Li⁺ ions should intercalate into the graphite anode. If charging is too fast (high C-rate), too cold (slow kinetics), or the anode is full, lithium deposits as metallic Li on the anode surface instead. Metallic lithium can form needle-like dendrites that pierce the separator, potentially leading to thermal runaway.'
    },
    {
        id: 40, topic: 'Battery', elo: 1100,
        question: 'What is the difference between NMC, LFP, and NCA lithium-ion cathode chemistries in terms of energy density and safety?',
        choices: [
            'NMC, LFP, and NCA are all identical chemistries — the naming difference is regional',
            'NCA has highest energy density but lowest thermal stability; LFP has lowest energy density but highest thermal stability; NMC is a middle-ground compromise',
            'LFP has the highest energy density; NMC has the best safety profile',
            'NMC is only used in consumer electronics; LFP and NCA are motorsport-specific'
        ],
        answer: 1,
        explanation: 'NCA: very high energy density (~200–260 Wh/kg), less thermally stable. NMC: high energy density (~150–220 Wh/kg), moderate stability — common FSAE choice. LFP: lower energy density (~90–160 Wh/kg) but very thermally stable (no oxygen release in runaway) and very long cycle life. The tradeoff is always energy density vs safety/longevity.'
    },
    {
        id: 41, topic: 'Battery', elo: 1100,
        question: 'What do the 1RC and 2RC pairs in an equivalent circuit model of a cell represent?',
        choices: [
            'The resistance of the first and second busbars in a series string',
            'RC pairs (resistor-capacitor) that model the transient electrochemical response of the cell — 1RC captures fast diffusion effects, 2RC captures slower solid-state diffusion',
            '1RC is the cell\'s DC resistance; 2RC is the AC impedance at 1 kHz',
            '1RC and 2RC refer to the first and second charge cycles used for cell formation'
        ],
        answer: 1,
        explanation: 'A typical ECM has R0 (ohmic DCIR) plus one or two RC networks in series. The 1RC pair captures fast electrochemical double-layer / charge transfer transients (milliseconds to seconds). The 2RC captures slower solid-state diffusion dynamics (seconds to minutes). Together they replicate the cell\'s voltage response to a current pulse better than R0 alone.'
    },
    {
        id: 42, topic: 'Battery', elo: 1100,
        question: 'What is "calendar aging" in a lithium cell, and how does it differ from cycle aging?',
        choices: [
            'Calendar aging and cycle aging are identical — both result from charge/discharge cycles',
            'Calendar aging is capacity loss over time even without cycling — driven by SoC, temperature, and time; cycle aging is additional degradation from charge/discharge cycling',
            'Calendar aging only occurs at very high temperatures (>60°C); at room temperature only cycle aging applies',
            'Calendar aging is recoverable by full charge/discharge cycles; cycle aging is permanent'
        ],
        answer: 1,
        explanation: 'Even sitting unused, cells degrade: electrolyte decomposition, SEI growth, and lithium loss continue as thermally activated processes — worse at high SoC and high temperature. Cycle aging adds on top via lithium plating risk, mechanical stress from volume change, and further SEI growth. For FSAE, storage at cool temperature and ~50% SoC minimizes calendar aging.'
    },
    {
        id: 43, topic: 'Battery', elo: 1150,
        question: 'What is a "busbar" in a battery pack and what material properties matter for its design?',
        choices: [
            'A busbar is the structural bracket that holds cell modules to the housing — material strength is the key property',
            'A busbar is a low-resistance electrical conductor connecting cells or modules in series or parallel — key properties are conductivity, current capacity, and contact resistance at joints',
            'A busbar is the communication line connecting BMS sense wires — material must be non-conductive',
            'A busbar is a thermal interface pad that conducts heat from cells to the cooling plate'
        ],
        answer: 1,
        explanation: 'Busbars carry the full pack current between series-connected modules or parallel-connected cells. Key design factors: material conductivity (copper > aluminum, but aluminum is lighter), cross-sectional area (determines I²R heating), and joint resistance at bolted or welded connections. In FSAE packs, busbars must handle burst currents of 200+ A.'
    },
    {
        id: 44, topic: 'Battery', elo: 1150,
        question: 'Why does a cell\'s terminal voltage drop immediately when a large current pulse is applied, then continue to drop more slowly?',
        choices: [
            'The immediate drop is from BMS switching delay; the slow drop is from actual cell discharge',
            'The immediate drop is the ohmic voltage drop across DCIR (V = I×R0); the continued slow drop reflects electrochemical polarization as diffusion gradients build up inside the cell',
            'The immediate drop occurs because temperature rises instantly; the slow drop is from thermal expansion changing DCIR',
            'The immediate drop is a measurement artifact from inductance in the wiring; the slow drop is the real cell response'
        ],
        answer: 1,
        explanation: 'When current starts: voltage drops instantly by I×R0 (pure ohmic). Then it continues to sag as charge transfer polarization at the electrode surface builds (fast, 1RC timescale) and concentration gradients develop in the electrolyte and electrodes (slower, 2RC timescale). This multi-timescale behavior is exactly what pulse discharge testing characterizes.'
    },
    {
        id: 45, topic: 'Battery', elo: 1200,
        question: 'What is "capacity fade" and what are the primary mechanisms causing it over a cell\'s life?',
        choices: [
            'Capacity fade is the increase in DCIR over cycles; it is caused by electrode cracking',
            'Capacity fade is the permanent reduction in usable Ah over the cell\'s life, caused by lithium inventory loss (SEI growth, lithium plating) and active material loss (particle cracking, electrode degradation)',
            'Capacity fade only occurs from overcharging; under normal use cells maintain full capacity indefinitely',
            'Capacity fade is fully reversible through deep discharge and full recharge conditioning cycles'
        ],
        answer: 1,
        explanation: 'Two root causes: (1) Lithium inventory loss — lithium consumed forming SEI or lost as irreversible lithium plating. (2) Active material loss — electrode particles crack from repeated volume change during cycling, losing electrical contact. Both are permanent. FSAE cells are typically cycled ~50–200 times per season, so calendar aging often dominates.'
    },
    {
        id: 46, topic: 'Battery', elo: 1200,
        question: 'What is the purpose of a precharge circuit in an HV battery system?',
        choices: [
            'Precharge balances cell voltages before the pack is connected to any load',
            'Precharge slowly charges the DC bus capacitors in the inverter through a resistor before closing the main contactors, limiting inrush current that would otherwise weld or damage the contactors',
            'Precharge monitors isolation resistance before the AIRs close, acting as a backup IMD',
            'Precharge is required only during charging, not during normal driving operation'
        ],
        answer: 1,
        explanation: 'Motor controllers contain large DC bus capacitors. When AIRs close onto an uncharged capacitor bank, instantaneous inrush current can be enormous (hundreds to thousands of amps) — enough to weld contactor contacts. Precharge routes current through a series resistor to slowly charge the capacitors to near pack voltage before the main AIRs close.'
    },

    // ── Drive Unit ────────────────────────────────────────────────────────────
    {
        id: 47, topic: 'Drive Unit', elo: 1100,
        question: 'What is the effect of increasing the number of poles in an electric motor on its drive frequency requirements?',
        choices: [
            'More poles reduce the required drive frequency because flux paths are shorter',
            'More poles increase the required electrical drive frequency: f = (p/2) × (RPM/60), so more pole pairs mean higher frequency at the same RPM',
            'Number of poles has no effect on drive frequency — only RPM determines frequency',
            'More poles reduce RPM requirements, which lowers drive frequency proportionally'
        ],
        answer: 1,
        explanation: 'Electrical frequency = pole pairs × mechanical frequency: f = (p/2) × (n/60). A 10-pole motor (5 pole pairs) at 6000 RPM requires f = 5 × 100 = 500 Hz. More poles allow thinner back-iron (shorter flux path between adjacent poles) but demand higher switching frequency from the inverter.'
    },
    {
        id: 48, topic: 'Drive Unit', elo: 1050,
        question: 'What are the primary tradeoffs between axial flux and radial flux motor topologies?',
        choices: [
            'Axial flux motors are always superior — higher torque density with no disadvantages',
            'Radial flux motors are the standard cylindrical topology — mature manufacturing and longer axial length; axial flux motors are pancake-shaped with higher torque density per volume but more complex manufacturing',
            'Axial flux motors only work at low RPM; radial flux is required for high-speed applications',
            'Radial flux motors have higher efficiency; axial flux has higher peak power only'
        ],
        answer: 1,
        explanation: 'Radial flux: conventional cylindrical motor, flux crosses the air gap radially. Mature manufacturing, well-understood thermal paths. Axial flux: "pancake" motor, flux crosses axially. Higher torque density per unit volume/weight — favorable for FSAE packaging — but stator manufacturing is more complex and heat rejection can be harder.'
    },
    {
        id: 49, topic: 'Drive Unit', elo: 1150,
        question: 'What can be changed in an electric motor\'s design to lower its Kv (RPM/V)?',
        choices: [
            'Increase the air gap between rotor and stator',
            'Increase the number of turns per coil, use a higher pole count, or use a higher winding factor — all of which increase flux linkage and therefore reduce Kv',
            'Use a lower permeability core material to increase flux density',
            'Reduce the rotor diameter to lower peripheral velocity'
        ],
        answer: 1,
        explanation: 'Lower Kv = higher Kt (more torque per amp). To lower Kv: add more turns per coil (increases flux linkage), increase pole count, or optimize winding factor. Higher Kv motors spin faster per volt but produce less torque per amp — the tradeoff depends on the operating point and gear ratio.'
    },
    {
        id: 50, topic: 'Drive Unit', elo: 1000,
        question: 'How are Kv and Kt related in an electric motor?',
        choices: [
            'They are inversely related through a nonlinear function that depends on temperature',
            'Kv (RPM/V) and Kt (Nm/A) are inversely proportional: Kt ∝ 1/Kv. In SI units, Kt = 60/(2π × Kv)',
            'Kv and Kt are independent — one describes voltage and the other torque',
            'They are equal numerically only at nominal voltage'
        ],
        answer: 1,
        explanation: 'By conservation of energy, the motor\'s back-EMF constant and torque constant are reciprocals (in consistent SI units). A motor with Kv = 100 RPM/V has Kt = 60/(2π×100) ≈ 0.0955 Nm/A. Higher Kv → lower Kt: faster but less torque per amp.'
    },
    {
        id: 51, topic: 'Drive Unit', elo: 1250,
        question: 'Which slot-pole combination — 6p9s or 10p12s — has a higher fundamental winding factor?',
        choices: [
            '6p9s and 10p12s have identical winding factors of 1.0 since both are balanced three-phase windings',
            '10p12s has a higher fundamental winding factor (~0.966) compared to 6p9s (~0.866) because the winding is more concentrated and the flux linkage per coil is higher',
            '6p9s has a higher winding factor because it has fewer poles, allowing longer coil pitch',
            'Winding factor only applies to distributed windings; both 6p9s and 10p12s are concentrated and the concept does not apply'
        ],
        answer: 1,
        explanation: 'Winding factor kw represents how effectively the winding links the fundamental air-gap flux. 6p9s has kw ≈ 0.866; 10p12s has kw ≈ 0.966 — closer to 1.0 means more effective flux linkage per unit of copper, giving higher torque density. This is why high pole-count fractional slot machines are popular for traction motors.'
    },
    {
        id: 52, topic: 'Drive Unit', elo: 1200,
        question: 'What constraints drive the electromagnetic sizing of an electric motor for FSAE?',
        choices: [
            'Only peak torque and max RPM matter — all other constraints are secondary',
            'Peak torque and power requirements, available DC bus voltage, max continuous and peak current (inverter and winding limits), thermal limits of winding insulation, target efficiency map, and packaging envelope',
            'The only constraints are the FSAE power limit rule and the motor weight limit',
            'Motor sizing is unconstrained in FSAE — teams choose freely based on availability'
        ],
        answer: 1,
        explanation: 'EM motor sizing is driven by: required peak torque (sets air-gap shear stress → volume), required speed range (sets Kv / winding), DC bus voltage (sets turns and insulation), peak and continuous current limits (inverter rating, wire gauge, thermal), copper fill factor, target efficiency, and physical packaging. FSAE also imposes an 80 kW peak power limit.'
    },

    // ── Optimization ─────────────────────────────────────────────────────────
    {
        id: 53, topic: 'Optimization', elo: 900,
        question: 'What is the difference between a global minimum and a local minimum in an optimization problem?',
        choices: [
            'They are the same — any minimum found by an optimizer is by definition global',
            'The global minimum is the lowest point in the entire design space; local minima are lower than their immediate neighbors but not the lowest overall — a gradient-based optimizer can get trapped in them',
            'Local minima only exist in discrete design spaces; continuous problems always have one global minimum',
            'The global minimum is found first; local minima are found in subsequent optimization runs'
        ],
        answer: 1,
        explanation: 'A local minimum is a point where all nearby moves increase the objective — the optimizer is "stuck in a bowl." The global minimum is the lowest bowl in the entire landscape. Gradient-based optimizers (SLSQP, BFGS) follow the gradient downhill and stop at the first local minimum they reach. Escaping requires global methods (genetic algorithms, basin hopping, simulated annealing) or multi-start strategies.'
    },
    {
        id: 54, topic: 'Optimization', elo: 1000,
        question: 'Why should gradient descent optimizers like SLSQP be avoided when the design space is discrete?',
        choices: [
            'SLSQP cannot handle more than 10 design variables and breaks on large discrete problems',
            'Gradient-based methods require continuous, differentiable objectives — discrete variables have undefined gradients, causing the optimizer to fail or produce meaningless results',
            'SLSQP is too slow for discrete problems because it evaluates every possible combination',
            'Discrete problems always have a single global minimum, so SLSQP finds it trivially'
        ],
        answer: 1,
        explanation: 'Gradient descent computes ∂f/∂x to determine the search direction. For discrete variables (integer slot counts, pole numbers, etc.), the gradient is either undefined or zero everywhere except at discontinuities — the optimizer cannot navigate. Use derivative-free methods: COBYLA, genetic algorithms, or Nelder-Mead simplex.'
    },
    {
        id: 55, topic: 'Optimization', elo: 1150,
        question: 'What is a surrogate model in engineering optimization, and when is it beneficial?',
        choices: [
            'A surrogate model is a simplified version of the real system with reduced fidelity used only for visualization',
            'A surrogate model is a computationally cheap mathematical approximation (e.g. Gaussian process, polynomial response surface) trained on high-fidelity simulation data, used to explore the design space when each simulation is expensive',
            'A surrogate model is the actual physics simulation — "surrogate" means it replaces physical testing',
            'Surrogate models are only valid for linear systems; nonlinear motor or thermal problems require direct simulation'
        ],
        answer: 1,
        explanation: 'When a single simulation (FEA, CFD, lap-time sim) takes minutes to hours, running thousands of evaluations is impractical. A surrogate (Gaussian process, radial basis function, neural net) is trained on a designed experiment of 50–200 high-fidelity evaluations, then the optimizer queries the surrogate. You explore broadly, then validate promising designs with the real simulation.'
    },
    {
        id: 56, topic: 'Optimization', elo: 1250,
        question: 'What optimization architecture is appropriate when simulation time is non-negligible, the design space is discrete, but follows a "noisy funnel" geometry?',
        choices: [
            'Pure gradient descent with finite-difference gradients — it handles noisy objectives through averaging',
            'Surrogate optimization using a global optimizer (e.g. basin hopping) paired with a local derivative-free method (e.g. COBYLA) to refine within each basin',
            'Exhaustive grid search — the only reliable method for noisy discrete spaces',
            'Single-start COBYLA — it handles discrete variables and noisy objectives simultaneously'
        ],
        answer: 1,
        explanation: 'A "noisy funnel" has a broad global trend toward a minimum with superimposed noise/local structure. Surrogate optimization trains a model on sampled evaluations, letting the global optimizer (basin hopping, differential evolution) find the funnel without getting trapped in noise, while the local optimizer refines the solution within the basin.'
    },

    // ── HV Distribution ───────────────────────────────────────────────────────
    {
        id: 57, topic: 'HV Dist', elo: 900,
        question: 'What are the primary sources of resistance in a high-voltage tractive system?',
        choices: [
            'Only the motor windings contribute meaningful resistance; all other components are negligible',
            'Resistance arises from bulk conductor resistance (wire and busbar) and connection resistance at joints (crimp, bolted busbar, connector interfaces) — both must be minimized to reduce I²R losses and voltage sag',
            'Resistance is primarily determined by the BMS, which actively controls current flow',
            'Only the battery cells have significant resistance; wiring resistance is negligible at EV voltages'
        ],
        answer: 1,
        explanation: 'In an HV circuit carrying 200 A, even milliohm-level resistances matter: P = I²R, so 2 mΩ × (200 A)² = 80 W of waste heat at a single point. Sources: cell DCIR, busbar/wire bulk resistance (ρ × L/A), contact resistance at bolted joints, connector pin resistance, and current sensor shunts. Connections often dominate because they\'re distributed and hard to control.'
    },
    {
        id: 58, topic: 'HV Dist', elo: 1050,
        question: 'What is the skin effect and does it meaningfully affect FSAE EV powertrain wiring?',
        choices: [
            'Skin effect causes current to concentrate at the conductor\'s surface at high frequency, significantly increasing effective resistance in all EV wiring',
            'Skin effect concentrates AC current near the conductor surface, increasing effective resistance at high frequency. In low-frequency DC bus wiring it is negligible, but in motor phase windings (driven at hundreds of Hz) it becomes relevant',
            'Skin effect only occurs in aluminum conductors; copper wiring in FSAE is immune',
            'Skin effect increases inductance, not resistance, and is only relevant in RF applications above 100 MHz'
        ],
        answer: 1,
        explanation: 'Skin depth δ = √(2ρ/ωμ). For FSAE DC bus cables, current is low-frequency switched — skin effect is negligible, conductor sizing is dominated by I²R at DC. Motor phase windings are driven at 300–600 Hz electrical frequency — skin effect starts to matter for conductor strand sizing, which is why high-frequency windings use Litz wire or thin strands.'
    },

    // ── Battery — Advanced ────────────────────────────────────────────────────
    {
        id: 59, topic: 'Battery', elo: 1300,
        question: 'What is the difference between "power fade" and "capacity fade" in an aging lithium-ion cell, and why might a cell show significant power fade with minimal capacity fade early in its life?',
        choices: [
            'Power fade and capacity fade are the same phenomenon described at different discharge rates',
            'Capacity fade = reduction in total usable Ah (lithium inventory loss + active material loss). Power fade = increase in internal resistance (DCIR growth — the cell delivers the same energy but at a higher voltage penalty, reducing peak power). Early in life, SEI growth drives power fade before significantly impacting capacity.',
            'Power fade only occurs in high-power cells; capacity fade only occurs in high-energy cells',
            'Power fade is caused by cathode degradation only; capacity fade is caused by anode degradation only'
        ],
        answer: 1,
        explanation: 'Capacity fade measures total Ah at low rate (lithium inventory reduction). Power fade measures peak power at a given SoC — P_peak = (OCV − V_min)² / (4 × R_total). Early in life, SEI ionic resistance grows quickly, raising DCIR and cutting peak power — while total capacity (total lithium inventory) is still mostly intact.'
    },
    {
        id: 60, topic: 'Battery', elo: 1350,
        question: 'What is the "knee point" in a battery capacity fade curve, and why is predicting its onset critical?',
        choices: [
            'The knee point is the voltage at which the cell transitions from the upper to the lower voltage plateau — it occurs at about 50% SoC and is not related to aging',
            'The knee point is an inflection in the cycle life curve where gradual near-linear capacity fade transitions abruptly to rapid capacity loss — caused by electrode operating windows shifting out of alignment as lithium inventory is depleted',
            'The knee point is caused by sudden separator failure at high cycle counts — it is unpredictable by definition',
            'The knee point only occurs in LFP cells due to their flat OCV curve'
        ],
        answer: 1,
        explanation: 'Early cycling: small lithium inventory loss shifts electrode operating windows slightly but the full cell still reaches cutoff with most capacity intact. Near the knee: the anode and cathode windows have shifted to the point where one electrode hits its capacity limit before the other — the electrodes go "out of alignment." A small additional Li loss then causes disproportionately large capacity loss. Predicting onset is critical for aerospace and aviation to avoid in-service failure.'
    },
    {
        id: 61, topic: 'Battery', elo: 1400,
        question: 'What is a contactor (AIR) welding failure in a high-voltage battery system, under what conditions does it occur, and what prevents it?',
        choices: [
            'Contactor welding occurs when the contacts get too hot from normal current flow and fuse together — prevented by using contacts rated for 2× normal current',
            'AIR welding occurs when the contactor opens or closes while carrying current above its make/break rating — an arc forms between the separating contacts, melting or welding the surfaces together. Prevented by precharge (limiting inrush), correct contactor ratings, and detecting welded contactors via auxiliary contacts.',
            'AIR welding is a software failure where the BMS incorrectly reports the contactor as open — prevented by redundant position sensors',
            'Contactors cannot weld in FSAE applications because the currents are too low'
        ],
        answer: 1,
        explanation: 'When a contactor opens under load, an arc forms between separating contacts (arc temperature: 5,000–20,000 K). If arc energy exceeds the melting enthalpy of the contact material, the contacts fuse. Prevention: precharge limits inrush on close; contactors must be rated for the make/break current; auxiliary contacts detect welding; the SDC design avoids hot-switching wherever possible.'
    },
    {
        id: 62, topic: 'Battery', elo: 1450,
        question: 'In a series-connected battery string, why is a fuse placed in series with each parallel cell group rather than just one master fuse for the whole pack?',
        choices: [
            'Cell-level fuses are a cost-saving measure — they are cheaper than a single large fuse',
            'A master fuse only protects against external shorts. An internal cell failure forces all other parallel cells to dump current into the failing cell — fault current flows within the parallel group, never through the master fuse. Cell-level fuses interrupt this internal fault current.',
            'Cell-level fuses are only required by FSAE rules and have no engineering justification',
            'The master fuse protects against all fault types; cell-level fuses are redundant and reduce efficiency'
        ],
        answer: 1,
        explanation: 'In a 28s4p pack, if one cell develops an internal short, the three adjacent parallel cells dump current into the shorted cell: I_fault ≈ 3 × V_cell / R_cell — potentially thousands of amps within the parallel group. This current flows through the parallel interconnects and the shorted cell, NOT through the master fuse (which is in series with the entire string). Without cell-level fuses, this fault current goes unchecked.'
    },
    {
        id: 63, topic: 'Battery', elo: 1450,
        question: 'What is "self-discharge" in a lithium-ion cell and what are the two dominant mechanisms?',
        choices: [
            'Self-discharge is a feature, not a bug — it equalizes all cells to the same SoC automatically, eliminating the need for BMS balancing',
            'Self-discharge is the spontaneous loss of stored charge at rest. Two dominant mechanisms: (1) electronic leakage through the separator/SEI — tiny electron current discharges the cell; (2) chemical self-discharge — direct chemical reactions between electrode and electrolyte consume lithium',
            'Self-discharge only occurs at elevated temperature (>40°C); at room temperature, lithium-ion cells have zero self-discharge',
            'Self-discharge is caused solely by the BMS parasitic current draw from the cells'
        ],
        answer: 1,
        explanation: 'Self-discharge rates for Li-ion at room temperature: typically 1–5% per month for good cells, up to 15–30%/month for cells with defects. (1) Electronic leakage: parasitic electron current through separator/SEI — very slow in a good cell (GΩ electronic resistance). (2) Chemical self-discharge: direct chemical reactions between electrode and electrolyte at the particle surface. An abnormally high self-discharge rate in one cell of a series string causes SoC divergence, eventually requiring balancing to compensate.'
    },
    {
        id: 64, topic: 'Battery', elo: 870,
        question: 'SoC and SoH — which should a battery engineer working on a new pack design care about MORE and why?',
        choices: [
            'SoC = degradation over time; SoH = current charge level. SoH matters more because it tells you how full the pack is right now',
            'SoC = remaining charge as a % of current capacity. SoH = remaining capacity as a % of original rated capacity. A pack designer should care more about SoH — it determines the actual usable capacity the pack will deliver at end of life, which sets the required pack size',
            'They are the same thing — "state of health" is just the industry term for state of charge used by some manufacturers',
            'SoC matters more because it directly sets the pack voltage, which determines everything else'
        ],
        answer: 1,
        explanation: 'SoC answers "how full is it right now?" — changes every minute during use. SoH answers "how worn out is it?" — degrades slowly over months and years, starting at 100% and typically ending pack life around 70–80%. For a pack designer, SoH is the critical concern: you size the pack for the SoH=80% condition, not the brand-new SoH=100% condition — otherwise the pack fails its mission requirements at end of life.'
    },

    // ── Safety — HV Handling ──────────────────────────────────────────────────
    {
        id: 65, topic: 'Safety', elo: 800,
        question: 'What is the "live-dead-live" test procedure and when should you use it before working on a high-voltage system?',
        choices: [
            'Live-dead-live is a test where you apply voltage to a circuit to confirm the fuse has blown, then disconnect, then reapply to confirm it stays blown',
            'Live-dead-live is a verification sequence: (1) LIVE — confirm your voltmeter works on a known live source. (2) DEAD — measure the circuit you intend to work on and confirm zero voltage. (3) LIVE — re-confirm the voltmeter still works. This verifies the circuit is truly dead, not just your meter.',
            'Live-dead-live means you test the circuit while live, then kill power, then test live again to confirm the contactor opened correctly',
            'It is a three-step crimping procedure for HV connectors'
        ],
        answer: 1,
        explanation: 'The core problem: a voltmeter can fail silently. If you measure a conductor and get 0V, either the conductor is dead or your meter is broken. Live-dead-live eliminates this ambiguity: step 1 proves the meter works. Step 2 checks the target conductor. Step 3 re-proves the meter is still working — ruling out a meter failure that occurred between steps 1 and 2. Always use this before touching any potentially energized HV conductor.'
    },
    {
        id: 66, topic: 'Safety', elo: 800,
        question: 'Why should you use only one hand when working on or near energized high-voltage circuits?',
        choices: [
            'One-hand technique is required by FSAE rules only for aesthetic reasons and has no safety basis',
            'If both hands contact conductors at different potentials simultaneously, current flows hand-to-hand — directly across the chest through the heart. Even 50–150 mA crossing the heart can cause ventricular fibrillation and death.',
            'One hand is used to hold the voltmeter; the other holds the probe — this is a coordination technique, not safety',
            'Two hands introduce more capacitance to ground, increasing the risk of an arc flash'
        ],
        answer: 1,
        explanation: 'The lethality of electric shock is primarily determined by current magnitude and the path through the body. Hand-to-hand current path crosses the thoracic cavity, passing through or near the heart. The threshold for ventricular fibrillation is approximately 50–100 mA. At 100V pack voltage with 1 kΩ body resistance (wet hands), I = 100 mA — right at the threshold. Keeping one hand in your pocket removes the return path across the chest entirely.'
    },

    // ── HV Dist — Wiring ──────────────────────────────────────────────────────
    {
        id: 67, topic: 'HV Dist', elo: 850,
        question: 'Does low-voltage control wiring in an EV (e.g. BMS sense wires, CAN bus) need overcurrent protection?',
        choices: [
            'No — low-voltage wiring operates below 60V so it is inherently safe and does not need overcurrent protection',
            'Yes — even low-voltage wiring needs overcurrent protection. Although the voltage is low, a short circuit can still drive enough current to ignite wire insulation. Practical method: an inline fuse or polyfuse sized just above the maximum normal current.',
            'Low-voltage wiring only needs protection above 12V',
            'Overcurrent protection is only needed on the HV side; the BMS monitors all LV sense voltages'
        ],
        answer: 1,
        explanation: 'The hazard from overcurrent is not voltage but I²R heating in the conductor. A 24 AWG wire at 85 mΩ/m with 5 A flowing: P = 25 × 0.085 = 2.1 W/m — enough to heat wire above insulation temperature limits in seconds. In an enclosed pack, burning wire insulation is a fire risk regardless of voltage. Size fuses at 125–150% of max normal current.'
    },
    {
        id: 68, topic: 'HV Dist', elo: 850,
        question: 'What are the two primary considerations that drive wire sizing in an EV, and what happens if the wire is too small?',
        choices: [
            'Wire gauge is chosen purely by weight — smaller gauge (thinner wire) always minimizes mass',
            'Wire sizing is driven by: (1) current capacity (ampacity) — the wire must carry max expected current without exceeding its insulation temperature rating; (2) voltage drop — resistance must be low enough that I×R loss doesn\'t impair the circuit. An undersized wire overheats and can start a fire.',
            'Wire gauge is chosen to match the connector pin size only',
            'Only HV wiring requires specific sizing; LV wiring can be any convenient gauge'
        ],
        answer: 1,
        explanation: 'Two constraints must both be satisfied: (1) Ampacity — maximum continuous current that keeps conductor temperature below insulation class limit (typically 105°C for XLPE, 150°C for silicone). Exceeding ampacity melts insulation → short → fire. (2) Voltage drop — I²R losses in wiring reduce available voltage at the load and waste power as heat. Fuses must be sized to protect the wire, not just the load.'
    },
    {
        id: 69, topic: 'HV Dist', elo: 900,
        question: 'A higher AWG number means a thinner wire. Does a thinner wire have more or less resistance than a thicker wire of the same length and material?',
        choices: [
            'Higher AWG (thinner) wire has less resistance because there is less material for current to flow through',
            'Higher AWG (thinner) wire has MORE resistance. The governing equation is R = ρL/A — a thinner wire has smaller cross-sectional area A, so R increases. Doubling length doubles resistance.',
            'Resistance depends only on material, not dimensions — all copper wires of the same length have the same resistance',
            'Higher AWG wire has more resistance only at high frequency due to skin effect; at DC all gauges are equivalent'
        ],
        answer: 1,
        explanation: 'R = ρL/A. ρ = resistivity (material constant; copper: 1.72×10⁻⁸ Ω·m). L = length (proportional). A = cross-sectional area (inversely proportional). AWG scale is inverse: AWG 0 (thick, ~8.3mm diameter) has very low resistance; AWG 30 (thin, ~0.25mm) has very high resistance. Every 6 AWG increase approximately halves the cross-sectional area and doubles the resistance per unit length.'
    },
];

// ── Config ────────────────────────────────────────────────────────────────────
const STORAGE_KEY   = 'ptf_state';
const USER_K        = 24;
const QUESTION_K    = 32;
const RECENT_BUFFER = 8;
const USER_ELO_MIN  = 600;
const USER_ELO_MAX  = 2200;
const CHALLENGE_OFFSET = 80;

// ── Level labels ─────────────────────────────────────────────────────────────
const LEVELS = [
    { min: 0,    label: 'Intern'            },
    { min: 900,  label: 'Junior Engineer'   },
    { min: 1100, label: 'Engineer'          },
    { min: 1300, label: 'Senior Engineer'   },
    { min: 1500, label: 'Principal Engineer'},
    { min: 1700, label: 'Chief Engineer'    },
];

function getLevel(elo) {
    let label = LEVELS[0].label;
    for (const l of LEVELS) {
        if (elo >= l.min) label = l.label;
    }
    return label;
}

// ── State ─────────────────────────────────────────────────────────────────────
function defaultState() {
    return {
        userElo:       1200,
        streak:        0,
        totalAnswered: 0,
        totalCorrect:  0,
        recentIds:     [],
        questionElos:  {},
    };
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultState();
        return Object.assign(defaultState(), JSON.parse(raw));
    } catch {
        return defaultState();
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* storage full / private mode */ }
}

let state = loadState();

// ── Elo math ──────────────────────────────────────────────────────────────────
function expectedScore(playerElo, opponentElo) {
    return 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
}

function newElo(current, actual, expected, k, min = -Infinity, max = Infinity) {
    return Math.max(min, Math.min(max, Math.round(current + k * (actual - expected))));
}

// ── Question selection ────────────────────────────────────────────────────────
function selectQuestion() {
    const target = state.userElo + CHALLENGE_OFFSET;

    const candidates = QUESTION_BANK.filter(q => !state.recentIds.includes(q.id));
    const pool = candidates.length > 0 ? candidates : QUESTION_BANK;

    const sigma = 250;
    const weights = pool.map(q => {
        const qElo = state.questionElos[q.id] ?? q.elo;
        const diff = qElo - target;
        return Math.exp(-(diff * diff) / (2 * sigma * sigma));
    });

    const total = weights.reduce((s, w) => s + w, 0);
    let r = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
        r -= weights[i];
        if (r <= 0) return pool[i];
    }
    return pool[pool.length - 1];
}

// ── Current question ──────────────────────────────────────────────────────────
let currentQuestion = null;

// ── Screen management ─────────────────────────────────────────────────────────
function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(name + '-screen');
    if (el) el.classList.add('active');
}

// ── Header ────────────────────────────────────────────────────────────────────
function updateHeader() {
    document.getElementById('elo-display').textContent   = state.userElo;
    document.getElementById('level-display').textContent = getLevel(state.userElo);
}

// ── Start screen ──────────────────────────────────────────────────────────────
function updateStartScreen() {
    const container = document.getElementById('start-stats');
    if (state.totalAnswered === 0) {
        container.innerHTML = '<p class="no-history">No sessions yet — start practicing!</p>';
        return;
    }
    const pct = Math.round((state.totalCorrect / state.totalAnswered) * 100);
    container.innerHTML = `
        <div class="stat-item">
            <span class="stat-val">${state.userElo}</span>
            <span class="stat-lbl">Rating</span>
        </div>
        <div class="stat-item">
            <span class="stat-val">${pct}%</span>
            <span class="stat-lbl">Accuracy</span>
        </div>
        <div class="stat-item">
            <span class="stat-val">${state.totalAnswered}</span>
            <span class="stat-lbl">Answered</span>
        </div>
        <div class="stat-item">
            <span class="stat-val">${state.streak}</span>
            <span class="stat-lbl">Streak</span>
        </div>
    `;
}

// ── Question screen ───────────────────────────────────────────────────────────
function loadQuestion() {
    currentQuestion = selectQuestion();

    document.getElementById('topic-tag').textContent     = currentQuestion.topic;
    document.getElementById('streak-display').textContent = state.streak > 0
        ? `🔥 ${state.streak}`
        : `Streak: 0`;
    document.getElementById('question-text').textContent = currentQuestion.question;

    const grid = document.getElementById('choices-grid');
    grid.innerHTML = '';

    const labels = ['A', 'B', 'C', 'D'];
    currentQuestion.choices.forEach((text, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `
            <span class="choice-label">${labels[i]}</span>
            <span class="choice-text">${text}</span>
        `;
        btn.addEventListener('click', () => handleAnswer(i));
        grid.appendChild(btn);
    });

    showScreen('question');
}

// ── Answer handling ───────────────────────────────────────────────────────────
function handleAnswer(choiceIndex) {
    const correct = choiceIndex === currentQuestion.answer;
    const buttons = document.querySelectorAll('.choice-btn');

    buttons.forEach(btn => (btn.disabled = true));
    buttons[currentQuestion.answer].classList.add('correct');
    if (!correct) buttons[choiceIndex].classList.add('incorrect');

    if (correct) {
        state.streak++;
        state.totalCorrect++;
    } else {
        state.streak = 0;
    }
    state.totalAnswered++;

    state.recentIds.push(currentQuestion.id);
    if (state.recentIds.length > RECENT_BUFFER) state.recentIds.shift();

    const qElo   = state.questionElos[currentQuestion.id] ?? currentQuestion.elo;
    const exp    = expectedScore(state.userElo, qElo);
    const actual = correct ? 1 : 0;

    const newUserElo = newElo(state.userElo, actual, exp, USER_K, USER_ELO_MIN, USER_ELO_MAX);
    const newQElo    = newElo(qElo, 1 - actual, 1 - exp, QUESTION_K);

    const eloDelta = newUserElo - state.userElo;
    state.userElo  = newUserElo;
    state.questionElos[currentQuestion.id] = newQElo;

    updateHeader();
    saveState();

    setTimeout(() => showFeedback(correct, eloDelta), 320);
}

// ── Feedback screen ───────────────────────────────────────────────────────────
function showFeedback(correct, eloDelta) {
    const card    = document.getElementById('feedback-card');
    const icon    = document.getElementById('feedback-icon');
    const heading = document.getElementById('feedback-heading');
    const explain = document.getElementById('feedback-explain');
    const change  = document.getElementById('elo-change');

    if (correct) {
        card.className      = 'feedback-card correct';
        icon.textContent    = '✓';
        heading.textContent = 'Correct!';
    } else {
        card.className      = 'feedback-card incorrect';
        icon.textContent    = '✗';
        heading.textContent = 'Not quite.';
    }

    explain.textContent = currentQuestion.explanation;

    const sign = eloDelta >= 0 ? '+' : '';
    change.textContent = `Rating: ${state.userElo}  (${sign}${eloDelta})`;
    change.className   = `elo-change ${eloDelta >= 0 ? 'gain' : 'loss'}`;

    showScreen('feedback');
}

// ── Event listeners ───────────────────────────────────────────────────────────
document.getElementById('start-btn').addEventListener('click', loadQuestion);

document.getElementById('continue-btn').addEventListener('click', loadQuestion);

document.getElementById('reset-btn').addEventListener('click', () => {
    if (!confirm('Reset all progress? Your rating and history will be cleared.')) return;
    state = defaultState();
    saveState();
    updateHeader();
    updateStartScreen();
    showScreen('start');
});

// ── Init ──────────────────────────────────────────────────────────────────────
updateHeader();
updateStartScreen();
showScreen('start');
