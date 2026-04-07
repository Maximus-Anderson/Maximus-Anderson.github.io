// quiz.js — Powertrain Fundamentals adaptive quiz

// ── Question Bank ─────────────────────────────────────────────────────────────
const QUESTION_BANK = [
    // ── Battery — Beginner ────────────────────────────────────────────────────
    {
        id: 1, topic: 'Battery', elo: 850,
        question: 'What does a higher cell capacity (Ah) rating mean?',
        choices: [
            'The cell can deliver more charge before being depleted',
            'The cell has a higher terminal voltage under load',
            'The cell accepts charge faster during a standard charge cycle',
            'The cell has lower mass for the same energy output'
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
            'To increase the cell voltage by compressing the electrode stack',
            'To suppress swelling and reduce dendrite formation',
            'To improve thermal conductivity and reduce hotspots between cells',
            'To reduce the contact resistance of the BMS sense wiring connections'
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
            'It causes the cell voltage to drop to zero, disabling the pack permanently',
            'It releases hydrogen gas, which vents safely through pressure relief valves',
            'It is self-sustaining — exothermic reactions accelerate, releasing toxic HF gas and potential fire',
            'It only occurs in cylindrical cells; pouch cell chemistry is inherently more stable'
        ],
        answer: 2,
        explanation: 'Thermal runaway is a cascade: heat triggers exothermic decomposition, which generates more heat. It can eject flaming electrolyte, and LiPF₆ electrolyte decomposition can produce hydrogen fluoride (HF) gas — highly toxic and corrosive. Not that I\'d know anything about that.'
    },
    {
        id: 8, topic: 'Battery', elo: 1100,
        question: 'What does "energy density" of 180 Wh/kg mean in practical terms?',
        choices: [
            'The cell can deliver 180 watts continuously per kilogram of its own mass',
            'Every kilogram of cell mass stores 180 watt-hours of energy',
            'The cell accepts charge at a rate of 180 watts per kilogram during fast charging',
            'The pack delivers 180 kJ of total energy across a full discharge cycle'
        ],
        answer: 1,
        explanation: 'Gravimetric energy density (Wh/kg): 1 kg of cell stores 180 Wh. At 180 Wh/kg, a 1 kg cell can power a 180 W device for one hour. High energy density means more pack energy without weight penalty — critical for FSAE.'
    },
    {
        id: 9, topic: 'Battery', elo: 1150,
        question: 'In series-connected cells, what happens to the pack if one cell has significantly lower capacity than the rest?',
        choices: [
            'The other cells compensate by delivering more current, maintaining total pack voltage',
            'The weak cell limits the entire string and the pack stops when that cell reaches cutoff voltage',
            'Only the weak cell stops working; the rest continue delivering their full capacity',
            'The BMS detects and bypasses the weak cell, routing current around it'
        ],
        answer: 1,
        explanation: 'In a series string, all cells carry the same current. The weakest cell depletes first and pulls its voltage down to cutoff, stopping the whole string — even if other cells have remaining capacity. This is why cell matching matters for pack design.'
    },
    {
        id: 10, topic: 'Battery', elo: 1200,
        question: 'What is the primary risk when bending or folding a pouch cell\'s tab at its root?',
        choices: [
            'The tab overheats and fuses shut, blocking current flow in that cell',
            'The electrode-to-tab bond delaminates, raising resistance or causing an open circuit',
            'The polymer casing tears at the bend, exposing the cell interior to air',
            'The bent tab contacts the opposite-polarity surface, causing an immediate internal short'
        ],
        answer: 1,
        explanation: 'Pouch cell tabs are ultrasonically welded stacks of thin foils bonded to the electrode inside the cell. Bending at the root stresses this weld and can cause delamination — raising resistance, reducing capacity, causing hot spots.'
    },

    // ── Powertrain ────────────────────────────────────────────────────────────
    {
        id: 11, topic: 'Powertrain', elo: 850,
        question: 'What is the function of a motor controller (inverter) in an EV powertrain?',
        choices: [
            'It stores regenerative braking energy in supercapacitors for later reuse',
            'It converts DC from the battery into AC to drive the motor at variable speed',
            'It monitors cell temperatures and actively balances the pack during charging',
            'It steps up battery voltage using a boost converter to reduce wiring losses'
        ],
        answer: 1,
        explanation: 'The inverter converts battery DC into the waveform the motor needs. For a three-phase AC motor, it synthesises three sinusoidal AC phases at variable frequency and amplitude to control motor speed and torque.'
    },
    {
        id: 12, topic: 'Powertrain', elo: 950,
        question: 'What does peak torque at zero RPM mean for an electric motor compared to a combustion engine?',
        choices: [
            'Electric motors need a clutch at launch because torque builds gradually from stall, like an ICE',
            'Electric motors deliver maximum torque from a standstill, unlike combustion engines which need RPM',
            'Electric motors follow the same rising torque curve as a naturally-aspirated combustion engine',
            'Peak torque at zero RPM means the motor draws maximum current, causing rapid overheating'
        ],
        answer: 1,
        explanation: 'Electric motors generate torque proportional to current, independent of speed. At stall, full current can be applied, giving peak torque immediately. ICE vehicles need RPM to build combustion pressure and must use a clutch — EVs launch at full torque directly.'
    },
    {
        id: 13, topic: 'Powertrain', elo: 1000,
        question: 'In a permanent magnet synchronous motor (PMSM), what is "field weakening"?',
        choices: [
            'Reducing d-axis current to thermally derate the motor above its rated temperature',
            'Injecting negative d-axis current to reduce effective flux and extend speed beyond base speed',
            'Boosting supply voltage above the nominal bus voltage to raise achievable peak RPM',
            'Reversing the phase sequence to achieve regenerative braking while the motor is spinning'
        ],
        answer: 1,
        explanation: 'At base speed, back-EMF equals the available voltage and the motor can no longer accelerate. Field weakening applies negative d-axis current to reduce effective flux, lowering back-EMF and allowing higher RPM — at the cost of reduced torque.'
    },
    {
        id: 14, topic: 'Powertrain', elo: 1100,
        question: 'What is the difference between motor efficiency and drivetrain efficiency?',
        choices: [
            'They are identical since all drivetrain losses are already captured in the motor efficiency map',
            'Motor efficiency is electrical-to-mechanical at the shaft; drivetrain efficiency adds gearbox, differential, and bearing losses',
            'Drivetrain efficiency captures only gearbox thermal losses; motor efficiency captures all electrical losses',
            'Motor efficiency is only valid at peak power; drivetrain efficiency is a weighted average over all operating points'
        ],
        answer: 1,
        explanation: 'Motor efficiency = mechanical power out / electrical power in. Drivetrain efficiency includes all components between motor shaft and wheels: gearing, differentials, CV joints, bearings. Total drivetrain efficiency is the product of each component\'s efficiency.'
    },
    {
        id: 15, topic: 'Powertrain', elo: 1250,
        question: 'Why might a lower gear ratio (closer to 1:1) be chosen for an FSAE EV on a tight autocross course?',
        choices: [
            'Lower gear ratios always maximize wheel torque regardless of vehicle speed, motor speed, or the peak power delivered by the battery',
            'Autocross top speeds are high enough that a low ratio prevents motor overspeed',
            'Tight courses rarely exceed moderate speeds; a lower ratio keeps motor RPM in its efficient range',
            'A 1:1 ratio eliminates all gearbox friction losses by direct-driving the wheels'
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
            'It limits motor power if the driver exceeds a speed or g-force threshold',
            'It is a series loop that de-energizes the IRs when any safety condition is violated',
            'It regulates regenerative braking current to prevent overcharging the battery',
            'It monitors individual cell temperatures and triggers balancing in high-temp conditions'
        ],
        answer: 1,
        explanation: 'The SDC is a series loop of normally-open safety switches. Any single fault (IMD trip, BMS fault, BSPD activation, TSMS off, inertia switch) opens the loop, de-energizing the AIRs and disconnecting the tractive system. Failures default to a safe, de-energized state.'
    },
    {
        id: 22, topic: 'Safety', elo: 950,
        question: 'What does an IMD (Insulation Monitoring Device) detect and why does it matter?',
        choices: [
            'It measures phase current imbalance in the motor windings to detect winding faults or gaps in winding insulation',
            'It detects insulation breakdown between the HV tractive system and chassis ground, tripping the SDC',
            'It monitors insulation resistance between individual cells to prevent cascade thermal runaway, confirming the isolation of cells',
            'It measures the structural impedance of the accumulator housing to detect crash damage'
        ],
        answer: 1,
        explanation: 'The IMD monitors isolation resistance between the tractive system (high voltage) and chassis ground. A fault — e.g. chafed wiring contacting the chassis — reduces this below threshold. The IMD opens the SDC before anyone can be exposed to shock. FSAE rules require ≥500 Ω/V minimum.'
    },
    {
        id: 23, topic: 'Safety', elo: 1000,
        question: 'Why must an FSAE accumulator container be structurally rated to prevent HV exposure in a crash?',
        choices: [
            'To reduce container weight by using an air gap between inner and outer walls',
            'To keep HV terminals and cells protected after an impact, preventing accidental contact or short-circuit',
            'To improve thermal insulation and maintain cells within their optimal temperature range to prevent thermal runaway',
            'FSAE rules mandate double walls only for the GLV system, not the accumulator container'
        ],
        answer: 1,
        explanation: 'In a crash, the accumulator container may be impacted. FSAE rules require the HV terminals and cells to remain protected from accidental contact even after an impact — keeping first responders safe from live HV conductors and preventing secondary short-circuit fires.'
    },
    {
        id: 24, topic: 'Safety', elo: 1100,
        question: 'What is the function of a BSPD (Brake System Plausibility Device)?',
        choices: [
            'It monitors brake pad wear and triggers a pit-lane warning when replacement is needed',
            'It detects simultaneous hard braking and high motor current (implausible state), and opens the SDC',
            'It automatically adjusts brake bias between front and rear circuits for optimal deceleration (plausible breaking)',
            'It monitors caliper temperature and prevents brake fluid vaporization under hard braking'
        ],
        answer: 1,
        explanation: 'The BSPD monitors brake pressure and motor current. If both are above their thresholds simultaneously — braking hard while the motor draws significant current — this is considered implausible and dangerous. The BSPD opens the SDC to prevent simultaneous high-force acceleration and braking.'
    },
    {
        id: 25, topic: 'Safety', elo: 1200,
        question: 'What is the SES (Structural Equivalency Spreadsheet) used for in FSAE?',
        choices: [
            'It documents every weld joint in the chassis for technical inspection review',
            'It is a required equivalency analysis proving a non-standard chassis meets the steel tube baseline',
            'It specifies minimum wall thickness and material grade for the accumulator container beyond what is listed by the rules',
            'It is submitted after competition to document any structural failures or field repairs made'
        ],
        answer: 1,
        explanation: 'Any chassis deviation from the steel tube baseline (different tube sizes, material substitutions, carbon monocoques) requires an SES. Teams prove equivalent bending stiffness, tensile strength, etc. It is reviewed at technical inspection.'
    },

    // ── Battery — continued ───────────────────────────────────────────────────
    {
        id: 26, topic: 'Battery', elo: 850,
        question: 'What is the difference between a cell, a module, and a pack?',
        choices: [
            'They are all the same thing, with naming differences across regions and manufacturers',
            'A cell is the basic electrochemical unit; a module groups cells structurally; a pack is the full system with BMS and housing',
            'A module is a single cell in a protective metal can; a pack is a module with added control electronics',
            'A cell and module are electrically identical; a module only has added electronics; a pack adds integrated charging circuitry'
        ],
        answer: 1,
        explanation: 'Cell = individual electrochemical unit. Module = cells grouped together with busbars, cell holders, and sensing — a structural sub-assembly. Pack = complete system: modules + BMS + housing + contactors + thermal management.'
    },
    {
        id: 27, topic: 'Battery', elo: 850,
        question: 'What does "state of charge" (SoC) represent?',
        choices: [
            'The ratio of (minimum) current voltage to max (peak) voltage',
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
            'They are the same physical quantity, just expressed in different unit systems',
            'Energy is the total work the pack can deliver; power is how fast it delivers it',
            'Power sets the operating voltage; energy capacity determines the maximum current draw',
            'Energy applies to DC storage systems only; power is a property of AC delivery systems'
        ],
        answer: 1,
        explanation: 'Energy (Wh) = total stored work — how long the pack can run. Power (W) = rate of energy delivery — how hard it can push. A pack with high energy but low power runs long but can\'t sprint. FSAE demands both: enough energy for endurance and enough power for acceleration events.'
    },
    {
        id: 29, topic: 'Battery', elo: 900,
        question: 'What does "C-rate" mean? If a 13 Ah cell is discharged at 2C, what is the current?',
        choices: [
            'C-rate is the number of charge cycles; 2C means 2 full charges. Current = 2 A',
            'C-rate is the "charge rate"; so discharge is always 1C. Current = 13 A',
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
            'Pouch cells operate at a higher nominal voltage than equivalent cylindrical cells',
            'Pouch cells have a large flat electrode area, giving lower DCIR and a better power-to-weight ratio',
            'Pouch cells are mechanically more rugged than cylindrical cells and tolerate side impact better',
            'Pouch cells have integrated sensing, so they do not require an external BMS'
        ],
        answer: 1,
        explanation: 'The large flat electrode area of pouch cells gives lower DC internal resistance than cylindrical cells of similar chemistry — less voltage sag and less heat at high currents. They also tend to have better gravimetric energy density. The tradeoff is mechanical fragility: they need careful compression and housing.'
    },
    {
        id: 31, topic: 'Battery', elo: 950,
        question: 'What is coulomb counting and what is its main limitation for SoC estimation?',
        choices: [
            'Coulomb counting integrates current over time to estimate charge in/out, but small errors accumulate into drift',
            'Coulomb counting directly measures individual electron flow and is perfectly accurate over the pack lifetime',
            'Coulomb counting infers SoC from voltage measurements and is limited by cell temperature variation',
            'Coulomb counting is valid only during active charging, not during regenerative or discharge phases'
        ],
        answer: 0,
        explanation: 'Coulomb counting integrates current (∫I·dt) to track charge in/out. It\'s simple and fast, but any sensor error or noise integrates over time — errors grow unbounded. Without periodic recalibration (e.g. at full charge), the estimate drifts. Most BMS systems combine it with voltage-based correction.'
    },
    {
        id: 32, topic: 'Battery', elo: 950,
        question: 'What is the purpose of cell balancing in a BMS?',
        choices: [
            'To equalize current through all cells, ensuring uniform discharge rates across a series string or pack',
            'To equalize SoC across cells in a series string, preventing the weakest cell from limiting the pack',
            'To balance temperature distribution across modules by redistributing heat during discharge',
            'To equalize DCIR across all cells by conditioning weak cells with controlled charge pulses'
        ],
        answer: 1,
        explanation: 'Cells in a series string have slightly different capacities and self-discharge rates. Over cycles, SoC diverges. The weakest cell hits cutoff first, leaving stranded capacity in the others. Balancing — passive (bleed excess energy) or active (transfer charge) — keeps all cells at the same SoC so the full string capacity is usable.'
    },
    {
        id: 34, topic: 'Battery', elo: 1000,
        question: 'What is a Ragone plot and what tradeoff does it illustrate?',
        choices: [
            'A plot of cell voltage versus temperature showing the safe operating region',
            'A log-log plot of specific energy (Wh/kg) vs specific power (W/kg) comparing energy storage technologies',
            'A plot of capacity retention versus cycle count for different cell chemistries',
            'A plot of DCIR versus SoC used to model cell performance under load'
        ],
        answer: 1,
        explanation: 'The Ragone plot maps energy density (how much) vs power density (how fast) on log-log axes. Capacitors have very high power but low energy; lithium cells are in the middle; fuel cells have high energy but low power. For FSAE, you want to be as far upper-right as possible — high energy AND high power.'
    },
    {
        id: 35, topic: 'Battery', elo: 1000,
        question: 'In the context of lithium-ion cells, what is the SEI layer and why does it matter?',
        choices: [
            'The Solid Electrode Interface — a conductive layer applied in manufacturing to improve electrode bonding and decrease cell DCIR',
            'The Solid Electrolyte Interphase — a passivation layer that forms on the anode during initial charging, consuming lithium',
            'The Secondary Electrochemical Indicator — a BMS-calculated value used to predict imminent cell failure',
            'The Stable Energy Index — an industry rating system for comparing cell chemistries and thermal stability'
        ],
        answer: 1,
        explanation: 'The SEI forms on the graphite anode during initial charge cycles as electrolyte partially reduces. It consumes some lithium (irreversible capacity loss) but stabilizes and protects the anode. SEI growth over the cell\'s life contributes to capacity fade and resistance increase.'
    },
    {
        id: 36, topic: 'Battery', elo: 1000,
        question: 'What does "parallel group" mean in pack architecture, and what does adding cells in parallel do?',
        choices: [
            'Parallel groups increase pack voltage proportionally to the number of cells added',
            'Cells in a parallel group share terminals, increasing capacity without changing cell voltage',
            'Parallel connection reduces effective DCIR but also lowers the total available capacity',
            'Parallel groups are only used as a backup redundancy measure if a series string cell fails'
        ],
        answer: 1,
        explanation: 'Cells in parallel share the same terminals — voltages must match. Adding N cells in parallel multiplies capacity by N (more Ah) while voltage stays at one cell\'s voltage. It also divides effective DCIR by N. In a 28s4p pack: voltage = 28 × Vcell, capacity = 4 × Ah_cell.'
    },
    {
        id: 37, topic: 'Battery', elo: 1050,
        question: 'What is the open circuit voltage (OCV) of a cell and how does it relate to SoC?',
        choices: [
            'OCV is the terminal voltage measured under load — it equals nominal voltage at steady state',
            'OCV is the resting terminal voltage with no current flowing; it tracks SoC along a known curve',
            'OCV is the maximum achievable cell voltage, fixed by the electrode chemistry regardless of SoC',
            'OCV equals nominal voltage adjusted by the ohmic voltage sag from internal DC resistance'
        ],
        answer: 1,
        explanation: 'With no current flowing, the cell\'s terminal voltage relaxes to its open circuit voltage — a thermodynamic quantity that depends on SoC via the electrode chemistry. The BMS can use OCV (measured after a rest period) as a ground-truth reference to recalibrate coulomb counting.'
    },
    {
        id: 38, topic: 'Battery', elo: 1050,
        question: 'Why does DCIR increase at low temperatures?',
        choices: [
            'Cold paradoxically increases electrolyte conductivity, which slows the overall ionic diffusion rate',
            'Cold slows ionic mobility in the electrolyte and charge-transfer kinetics at electrode surfaces',
            'Cold causes SEI layer dissolution, leaving the bare lithium anode exposed to the electrolyte',
            'Cold only raises DCIR in NCA cells; NMC chemistry is thermally stable at low temperatures'
        ],
        answer: 1,
        explanation: 'Ionic conductivity in the electrolyte and charge transfer kinetics at the electrode-electrolyte interface are thermally activated (Arrhenius-type) processes. At low temperatures, both slow significantly — ions move through the electrolyte more slowly and intercalation is less favorable, directly increasing measured DCIR and reducing available power.'
    },
    {
        id: 39, topic: 'Battery', elo: 1050,
        question: 'What is lithium plating, when does it occur, and why is it dangerous?',
        choices: [
            'Lithium plating is the normal term for lithium intercalating into the graphite anode during charging',
            'Lithium plating occurs when Li⁺ can\'t intercalate fast enough, depositing as metallic lithium and potentially forming dendrites',
            'Lithium plating is a cathode-side phenomenon that occurs at high SoC where the lithium ios for a "plate" near the separator and reduces energy density',
            'Lithium plating is triggered by deep over-discharge and is fully reversible on the subsequent charge cycle'
        ],
        answer: 1,
        explanation: 'During charging, Li⁺ ions should intercalate into the graphite anode. If charging is too fast (high C-rate), too cold (slow kinetics), or the anode is full, lithium deposits as metallic Li on the anode surface instead. Metallic lithium can form needle-like dendrites that pierce the separator, potentially leading to thermal runaway.'
    },
    {
        id: 40, topic: 'Battery', elo: 1100,
        question: 'What is the difference between NMC, LFP, and NCA lithium-ion cathode chemistries in terms of energy density and safety?',
        choices: [
            'NMC, LFP, and NCA are identical chemistries — naming varies by region or manufacturer',
            'NCA has highest energy density with lowest thermal stability; LFP has lowest energy density with highest stability; NMC balances both',
            'LFP has the highest energy density of the three; NMC offers the best thermal safety profile, NCA is the cheapest and is widely used despite it\'s poor performance',
            'NMC is exclusively for consumer electronics; LFP and NCA are designed for motorsport applications'
        ],
        answer: 1,
        explanation: 'NCA: very high energy density (~200–260 Wh/kg), less thermally stable. NMC: high energy density (~150–220 Wh/kg), moderate stability — common FSAE choice. LFP: lower energy density (~90–160 Wh/kg) but very thermally stable (no oxygen release in runaway) and very long cycle life. The tradeoff is always energy density vs safety/longevity.'
    },
    {
        id: 41, topic: 'Battery', elo: 1100,
        question: 'What do the 1RC and 2RC pairs in an equivalent circuit model of a cell represent?',
        choices: [
            'The contact resistance at the first and second busbar joints in the series string',
            'RC networks modeling the cell\'s transient electrochemical response — 1RC for fast dynamics, 2RC for slower diffusion',
            '1RC represents the cell\'s DC ohmic resistance; 2RC represents the AC impedance measured at 1 kHz',
            '1RC and 2RC denote the first and second formation charge cycles used to initialize the SEI layer — used to differentiate a battery vs. a capacitor'
        ],
        answer: 1,
        explanation: 'A typical ECM has R0 (ohmic DCIR) plus one or two RC networks in series. The 1RC pair captures fast electrochemical double-layer / charge transfer transients (milliseconds to seconds). The 2RC captures slower solid-state diffusion dynamics (seconds to minutes). Together they replicate the cell\'s voltage response to a current pulse better than R0 alone.'
    },
    {
        id: 42, topic: 'Battery', elo: 1100,
        question: 'What is "calendar aging" in a lithium cell, and how does it differ from cycle aging?',
        choices: [
            'Calendar aging and cycle aging are the same process — both are caused by charge/discharge cycling over a period of time',
            'Calendar aging is degradation at rest, driven by SoC and temperature; cycle aging adds wear from active cycling',
            'Calendar aging only occurs above 60°C; standard operating temperatures produce only cycle aging',
            'Calendar aging is fully reversible through reconditioning cycles; only cycle aging is permanent'
        ],
        answer: 1,
        explanation: 'Even sitting unused, cells degrade: electrolyte decomposition, SEI growth, and lithium loss continue as thermally activated processes — worse at high SoC and high temperature. Cycle aging adds on top via lithium plating risk, mechanical stress from volume change, and further SEI growth. For FSAE, storage at cool temperature and ~50% SoC minimizes calendar aging.'
    },
    {
        id: 43, topic: 'Battery', elo: 1150,
        question: 'What is a "busbar" in a battery pack and what material properties matter for its design?',
        choices: [
            'A busbar is the structural compression bracket holding modules inside the housing — key properties are yield strength and elastic modulus',
            'A busbar is a low-resistance conductor linking cells or modules — key properties are conductivity and joint contact resistance',
            'A busbar is the communication bus for BMS voltage sense wires — the material must be electrically non-conductive',
            'A busbar is a thermal interface pad between cells and the cooling plate — key property is thermal conductivity'
        ],
        answer: 1,
        explanation: 'Busbars carry the full pack current between series-connected modules or parallel-connected cells. Key design factors: material conductivity (copper > aluminum, but aluminum is lighter), cross-sectional area (determines I²R heating), and joint resistance at bolted or welded connections. In FSAE packs, busbars must handle burst currents of 200+ A.'
    },
    {
        id: 44, topic: 'Battery', elo: 1150,
        question: 'Why does a cell\'s terminal voltage drop immediately when a large current pulse is applied, then continue to drop more slowly?',
        choices: [
            'The immediate drop is a BMS switching artefact; the slow drop reflects the actual cell discharge',
            'The immediate drop is the ohmic sag across DCIR; the slower drop is electrochemical polarization building inside the cell',
            'The immediate drop occurs as cell temperature spikes on current application; the slow drop is thermal expansion altering DCIR',
            'The immediate drop is a wiring inductance artefact; the slower drop is the true electrochemical cell response'
        ],
        answer: 1,
        explanation: 'When current starts: voltage drops instantly by I×R0 (pure ohmic). Then it continues to sag as charge transfer polarization at the electrode surface builds (fast, 1RC timescale) and concentration gradients develop in the electrolyte and electrodes (slower, 2RC timescale). This multi-timescale behavior is exactly what pulse discharge testing characterizes.'
    },
    {
        id: 45, topic: 'Battery', elo: 1200,
        question: 'What is "capacity fade" and what are the primary mechanisms causing it over a cell\'s life?',
        choices: [
            'Capacity fade is the gradual increase in DCIR over cycles, primarily caused by electrode particle cracking',
            'Capacity fade is permanent reduction in usable Ah, caused by lithium inventory loss and active material degradation',
            'Capacity fade only results from extreme discharge rates and overcharging abuse; under normal use, cell capacity is maintained indefinitely',
            'Capacity fade is reversible through a full deep-discharge and slow-recharge reconditioning cycle'
        ],
        answer: 1,
        explanation: 'Two root causes: (1) Lithium inventory loss — lithium consumed forming SEI or lost as irreversible lithium plating. (2) Active material loss — electrode particles crack from repeated volume change during cycling, losing electrical contact. Both are permanent. FSAE cells are typically cycled ~50–200 times per season, so calendar aging often dominates.'
    },
    {
        id: 46, topic: 'Battery', elo: 1200,
        question: 'What is the purpose of a precharge circuit in an HV battery system?',
        choices: [
            'Precharge equalizes individual cell voltages before the pack is first connected to any load',
            'Precharge charges the inverter\'s DC bus capacitors through a resistor before the main contactors close, limiting inrush current',
            'Precharge monitors isolation resistance before the IRs close, providing a secondary safety check',
            'Precharge is a method of preparing a battery to be charged to 100% and is only active during the charging sequence, not during normal driving operation'
        ],
        answer: 1,
        explanation: 'Motor controllers contain large DC bus capacitors. When AIRs close onto an uncharged capacitor bank, instantaneous inrush current can be enormous (hundreds to thousands of amps) — enough to weld contactor contacts. Precharge routes current through a series resistor to slowly charge the capacitors to near pack voltage before the main AIRs close.'
    },

    // ── Drive Unit ────────────────────────────────────────────────────────────
    {
        id: 47, topic: 'Drive Unit', elo: 1100,
        question: 'What is the effect of increasing the number of poles in an electric motor on its drive frequency requirements?',
        choices: [
            'More poles reduce drive frequency because shorter flux paths require slower switching',
            'More poles increase the required electrical drive frequency: f = (p/2) × (RPM/60)',
            'Pole count has no effect on drive frequency — only shaft RPM determines electrical frequency',
            'More poles reduce the required shaft RPM, which proportionally lowers the drive frequency'
        ],
        answer: 1,
        explanation: 'Electrical frequency = pole pairs × mechanical frequency: f = (p/2) × (n/60). A 10-pole motor (5 pole pairs) at 6000 RPM requires f = 5 × 100 = 500 Hz. More poles allow thinner back-iron (shorter flux path between adjacent poles) but demand higher switching frequency from the inverter.'
    },
    {
        id: 48, topic: 'Drive Unit', elo: 1050,
        question: 'What are the primary tradeoffs between axial flux and radial flux motor topologies?',
        choices: [
            'Axial flux motors are strictly superior as they almost always have a higher torque density with minimal packaging or thermal disadvantages',
            'Radial flux is the conventional cylindrical topology with mature manufacturing; axial flux is pancake-shaped with higher torque density but more complex to build',
            'Axial flux motors are limited to low-RPM applications that require only a high peak torque; due to differences in their moment\'s of inertia high-speed operation requires radial flux topology',
            'Radial flux motors achieve higher efficiency across the operating map; axial flux only outperforms at peak power'
        ],
        answer: 1,
        explanation: 'Radial flux: conventional cylindrical motor, flux crosses the air gap radially. Mature manufacturing, well-understood thermal paths. Axial flux: "pancake" motor, flux crosses axially. Higher torque density per unit volume/weight — favorable for FSAE packaging — but stator manufacturing is more complex and heat rejection can be harder.'
    },
    {
        id: 49, topic: 'Drive Unit', elo: 1150,
        question: 'What can be changed in an electric motor\'s design to lower its Kv (RPM/V)?',
        choices: [
            'Increase the air gap between rotor and stator to reduce back-EMF per revolution',
            'Increase turns per coil, pole count, or winding factor to increase flux linkage and lower Kv',
            'Use a lower-permeability core material to concentrate flux and increase flux density per pole',
            'Reduce the rotor diameter to decrease the peripheral velocity of the permanent magnets'
        ],
        answer: 1,
        explanation: 'Lower Kv = higher Kt (more torque per amp). To lower Kv: add more turns per coil (increases flux linkage), increase pole count, or optimize winding factor. Higher Kv motors spin faster per volt but produce less torque per amp — the tradeoff depends on the operating point and gear ratio.'
    },
    {
        id: 50, topic: 'Drive Unit', elo: 1000,
        question: 'How are Kv and Kt related in an electric motor?',
        choices: [
            'They are inversely related via a nonlinear function that varies with operating temperature',
            'Kv and Kt are inversely proportional: Kt ∝ 1/Kv, or in SI units Kt = 60/(2π × Kv)',
            'Kv and Kt are independent constants — one characterizes the voltage domain, the other the torque domain',
            'They are numerically equal only when the motor is operating at its nominal voltage rating'
        ],
        answer: 1,
        explanation: 'By conservation of energy, the motor\'s back-EMF constant and torque constant are reciprocals (in consistent SI units). A motor with Kv = 100 RPM/V has Kt = 60/(2π×100) ≈ 0.0955 Nm/A. Higher Kv → lower Kt: faster but less torque per amp.'
    },
    {
        id: 51, topic: 'Drive Unit', elo: 1250,
        question: 'Which slot-pole combination — 6p9s or 10p12s — has a higher fundamental winding factor?',
        choices: [
            '6p9s and 10p12s both achieve winding factors of exactly 1.0 as balanced three-phase windings',
            '10p12s has a higher fundamental winding factor than 6p9s, giving better flux linkage per coil',
            '6p9s has a higher winding factor because its larger slot pitch allows a longer, more effective coil',
            'Winding factor only applies to distributed windings; fractional-slot concentrated windings like these are exempt'
        ],
        answer: 1,
        explanation: 'Winding factor kw represents how effectively the winding links the fundamental air-gap flux. 6p9s has kw ≈ 0.866; 10p12s has kw ≈ 0.966 — closer to 1.0 means more effective flux linkage per unit of copper, giving higher torque density. This is why high pole-count fractional slot machines are popular for traction motors.'
    },
    {
        id: 52, topic: 'Drive Unit', elo: 1200,
        question: 'What constraints drive the electromagnetic sizing of an electric motor for FSAE?',
        choices: [
            'For FSAE only peak torque and max RPM matter due to speed and acceleration targets — all other factors are secondary design choices',
            'Peak torque, bus voltage, inverter current limits, winding thermal limits, efficiency targets, and packaging envelope',
            'Only the FSAE 80 kW power limit and the vehicle weight budget constrain motor sizing',
            'Motor sizing in FSAE is unconstrained by rules — teams select motors based purely on availability'
        ],
        answer: 1,
        explanation: 'EM motor sizing is driven by: required peak torque (sets air-gap shear stress → volume), required speed range (sets Kv / winding), DC bus voltage (sets turns and insulation), peak and continuous current limits (inverter rating, wire gauge, thermal), copper fill factor, target efficiency, and physical packaging. FSAE also imposes an 80 kW peak power limit.'
    },

    // ── Optimization ─────────────────────────────────────────────────────────
    {
        id: 53, topic: 'Optimization', elo: 900,
        question: 'What is the difference between a global minimum and a local minimum in an optimization problem?',
        choices: [
            'They are effectively the same — any minimum an optimizer converges to is, by definition, the global minimum',
            'The global minimum is the lowest point in the full design space; local minima are locally lowest but not globally — gradient optimizers can get trapped',
            'Local minima only occur in discrete design spaces; continuous differentiable objectives always have one global minimum',
            'The global minimum is always found on the first optimizer run; subsequent runs locate the local minima'
        ],
        answer: 1,
        explanation: 'A local minimum is a point where all nearby moves increase the objective — the optimizer is "stuck in a bowl." The global minimum is the lowest bowl in the entire landscape. Gradient-based optimizers (SLSQP, BFGS) follow the gradient downhill and stop at the first local minimum they reach. Escaping requires global methods (genetic algorithms, basin hopping, simulated annealing) or multi-start strategies.'
    },
    {
        id: 54, topic: 'Optimization', elo: 1000,
        question: 'Why should gradient descent optimizers like SLSQP be avoided when the design space is discrete?',
        choices: [
            'SLSQP can only handle up to 10 design variables and crashes on larger discrete search spaces',
            'Gradient methods require differentiable objectives — discrete variables have no gradient, so the optimizer fails or gives garbage',
            'SLSQP is computationally slow for discrete problems because it enumerates every possible combination',
            'Discrete design spaces always have a single unique global minimum, which SLSQP finds in one pass'
        ],
        answer: 1,
        explanation: 'Gradient descent computes ∂f/∂x to determine the search direction. For discrete variables (integer slot counts, pole numbers, etc.), the gradient is either undefined or zero everywhere except at discontinuities — the optimizer cannot navigate. Use derivative-free methods: COBYLA, genetic algorithms, or Nelder-Mead simplex.'
    },
    {
        id: 55, topic: 'Optimization', elo: 1150,
        question: 'What is a surrogate model in engineering optimization, and when is it beneficial?',
        choices: [
            'A surrogate model is a lower-fidelity version of the simulation, used only for interactive visualization',
            'A surrogate model is a cheap mathematical approximation (e.g. Gaussian process) trained on expensive simulation data to accelerate design space exploration',
            'A surrogate model is the authoritative simulation — "surrogate" refers to it replacing physical hardware tests',
            'Surrogate models are only valid for linear systems; nonlinear electromagnetic or thermal problems require full simulation'
        ],
        answer: 1,
        explanation: 'When a single simulation (FEA, CFD, lap-time sim) takes minutes to hours, running thousands of evaluations is impractical. A surrogate (Gaussian process, radial basis function, neural net) is trained on a designed experiment of 50–200 high-fidelity evaluations, then the optimizer queries the surrogate. You explore broadly, then validate promising designs with the real simulation.'
    },
    // ── HV Distribution ───────────────────────────────────────────────────────
    {
        id: 57, topic: 'HV Dist', elo: 900,
        question: 'What are the primary sources of resistance in a high-voltage tractive system?',
        choices: [
            'Only the motor windings contribute significant resistance; all other path components are negligible',
            'Resistance comes from bulk conductor resistance and joint connection resistance',
            'Resistance is actively managed by the BMS, which limits current draw to keep path resistance low',
            'Only the battery cells have significant resistance (DCIR); at EV voltage levels, wiring resistance is negligible'
        ],
        answer: 1,
        explanation: 'In an HV circuit carrying 200 A, even milliohm-level resistances matter: P = I²R, so 2 mΩ × (200 A)² = 80 W of waste heat at a single point. Sources: cell DCIR, busbar/wire bulk resistance (ρ × L/A), contact resistance at bolted joints, connector pin resistance, and current sensor shunts. Connections often dominate because they\'re distributed and hard to control.'
    },
    {
        id: 58, topic: 'HV Dist', elo: 1050,
        question: 'What is the skin effect and does it meaningfully affect FSAE EV powertrain wiring?',
        choices: [
            'Skin effect concentrates current at the surface at high frequency, significantly raising resistance throughout all EV wiring',
            'Skin effect raises effective resistance at high frequency — negligible in DC bus wiring, but relevant in motor phase windings at 300–600 Hz',
            'Skin effect only affects aluminum conductors; the copper wiring used in FSAE is immune to the effect',
            'Skin effect increases inductance rather than resistance, and only appears in RF circuits above 100 MHz'
        ],
        answer: 1,
        explanation: 'Skin depth δ = √(2ρ/ωμ). For FSAE DC bus cables, current is low-frequency switched — skin effect is negligible, conductor sizing is dominated by I²R at DC. Motor phase windings are driven at 300–600 Hz electrical frequency — skin effect starts to matter for conductor strand sizing, which is why high-frequency windings use Litz wire or thin strands.'
    },

    // ── Battery — Advanced ────────────────────────────────────────────────────
    {
        id: 59, topic: 'Battery', elo: 1300,
        question: 'What is the difference between "power fade" and "capacity fade" in an aging lithium-ion cell, and why might a cell show significant power fade with minimal capacity fade early in its life?',
        choices: [
            'Power fade and capacity fade are the same mechanism, just observable at different discharge rates — Power growth can be observed early in a cell life if it experiences high C-rates',
            'Capacity fade is reduction in usable Ah; power fade is DCIR growth limiting peak deliverable power — SEI growth drives power fade earliest in life',
            'Power fade only occurs in high-power cell formats; capacity fade is exclusive to high-energy cells — High-power cell formats typically have rare earth metals that are more likely to increase DCIR without major impacts to the Li-ion electrolyte capacity',
            'Power fade is driven solely by cathode particle cracking; capacity fade is an anode-only degradation mode — Depending on how the cell is handled the more brittle cathode can crack sooner than the anode leading to significant power fade'
        ],
        answer: 1,
        explanation: 'Capacity fade measures total Ah at low rate (lithium inventory reduction). Power fade measures peak power at a given SoC — P_peak = (OCV − V_min)² / (4 × R_total). Early in life, SEI ionic resistance grows quickly, raising DCIR and cutting peak power — while total capacity (total lithium inventory) is still mostly intact.'
    },
    {
        id: 60, topic: 'Battery', elo: 1350,
        question: 'What is the "knee point" in a battery capacity fade curve, and why is predicting its onset critical?',
        choices: [
            'The knee point is the voltage step near 50% SoC where the cell shifts between discharge plateaus — unrelated to aging',
            'The knee point is an inflection in the cycle-life curve where slow capacity fade transitions abruptly to rapid loss, as electrode windows go out of alignment',
            'The knee point is sudden separator rupture at high cycle counts — inherently unpredictable and unpreventable',
            'The knee point only occurs in LFP cells due to their characteristically flat voltage discharge curve'
        ],
        answer: 1,
        explanation: 'Early cycling: small lithium inventory loss shifts electrode operating windows slightly but the full cell still reaches cutoff with most capacity intact. Near the knee: the anode and cathode windows have shifted to the point where one electrode hits its capacity limit before the other — the electrodes go "out of alignment." A small additional Li loss then causes disproportionately large capacity loss. Predicting onset is critical for aerospace and aviation to avoid in-service failure.'
    },
    {
        id: 61, topic: 'Battery', elo: 1400,
        question: 'What is a contactor (IR) welding failure in a high-voltage battery system, under what conditions does it occur, and what prevents it?',
        choices: [
            'Contactor welding occurs from sustained high current heating the contacts — prevented by adding fuses or using higher rated contactors to account for potential influxes or voltage spikes',
            'IR welding occurs when a contactor opens or closes above its make/break rating — an arc welds the contacts together. Prevention: precharge, correct ratings, and auxiliary contact monitoring.',
            'IR welding is a BMS software fault where the contactor is incorrectly reported as open — prevented by redundant position sensors and ensuring compatible hardware has been used within the BMS',
            'Contactors cannot weld in FSAE applications because pack currents are too low to sustain an arc'
        ],
        answer: 1,
        explanation: 'When a contactor opens under load, an arc forms between separating contacts (arc temperature: 5,000–20,000 K). If arc energy exceeds the melting enthalpy of the contact material, the contacts fuse. Prevention: precharge limits inrush on close; contactors must be rated for the make/break current; auxiliary contacts detect welding; the SDC design avoids hot-switching wherever possible.'
    },
    {
        id: 62, topic: 'Battery', elo: 1450,
        question: 'In a battery pack composed of series-connected modules, where each module contains parallel cells, why is it beneficial to place fuses on each parallel cell group rather than relying on a single pack-level (master) fuse?',
        choices: [
            'Cell-level fuses are a BOM cost reduction — individual small fuses are cheaper than one large master fuse',
            'A master fuse only catches external shorts; an internal parallel cell fault never passes through it — only cell-level fuses can interrupt that current path',
            'Cell-level fuses are required by FSAE rules but offer no real engineering benefit over a well-rated master fuse',
            'The master fuse is rated to handle all fault scenarios; cell-level fuses only add drop-out resistance and reduce efficiency'
        ],
        answer: 1,
        explanation: 'In a 28s4p pack, if one cell develops an internal short, the three adjacent parallel cells dump current into the shorted cell: I_fault ≈ 3 × V_cell / R_cell — potentially thousands of amps within the parallel group. This current flows through the parallel interconnects and the shorted cell, NOT through the master fuse (which is in series with the entire string). Without cell-level fuses, this fault current goes unchecked. This is why you see fusible links in many industry packs'
    },
    {
        id: 63, topic: 'Battery', elo: 1450,
        question: 'What is "self-discharge" in a lithium-ion cell and what are the two dominant mechanisms?',
        choices: [
            'Self-discharge is a passive balancing feature — it equalizes SoC across cells and eliminates the need for active BMS balancing',
            'Self-discharge is spontaneous charge loss at rest, via electronic leakage through the separator and chemical reactions at electrode surfaces',
            'Self-discharge only occurs above 40°C; at room temperature, lithium-ion cells retain charge indefinitely',
            'Self-discharge is caused entirely by the BMS voltage sensing circuits drawing parasitic current from the cells'
        ],
        answer: 1,
        explanation: 'Self-discharge rates for Li-ion at room temperature: typically 1–5% per month for good cells, up to 15–30%/month for cells with defects. (1) Electronic leakage: parasitic electron current through separator/SEI — very slow in a good cell (GΩ electronic resistance). (2) Chemical self-discharge: direct chemical reactions between electrode and electrolyte at the particle surface. An abnormally high self-discharge rate in one cell of a series string causes SoC divergence, eventually requiring balancing to compensate.'
    },
    // ── Safety — HV Handling ──────────────────────────────────────────────────
    {
        id: 65, topic: 'Safety', elo: 800,
        question: 'What is the "live-dead-live" test procedure and when should you use it before working on a high-voltage system?',
        choices: [
            'Apply voltage to confirm a fuse is blown, disconnect, then reapply to confirm no current leaks',
            'Verify meter on a known live source → test the target circuit for zero voltage → re-verify the meter still works',
            'Test circuit live, cut power, then test live again to confirm the contactor opened correctly',
            'A three-step quality check procedure used when crimping HV connector pins'
        ],
        answer: 1,
        explanation: 'The core problem: a voltmeter can fail silently. If you measure a conductor and get 0V, either the conductor is dead or your meter is broken. Live-dead-live eliminates this ambiguity: step 1 proves the meter works. Step 2 checks the target conductor. Step 3 re-proves the meter is still working — ruling out a meter failure that occurred between steps 1 and 2. Always use this before touching any potentially energized HV conductor.'
    },
    {
        id: 66, topic: 'Safety', elo: 800,
        question: 'Why should you use only one hand when working on or near energized high-voltage circuits?',
        choices: [
            'One-hand technique is in FSAE rules for ergonomic consistency and has no underlying safety purpose',
            'Both hands touching different potentials creates a hand-to-hand path across the heart — 50–150 mA can cause fatal ventricular fibrillation',
            'One hand holds the meter body; the other holds the probe — using both is a coordination aid, not a safety rule',
            'Two hands double the body capacitance to chassis ground, increasing the likelihood of an arc flash'
        ],
        answer: 1,
        explanation: 'The lethality of electric shock is primarily determined by current magnitude and the path through the body. Hand-to-hand current path crosses the thoracic cavity, passing through or near the heart. The threshold for ventricular fibrillation is approximately 50–100 mA. At 100V pack voltage with 1 kΩ body resistance (wet hands), I = 100 mA — right at the threshold. Keeping one hand in your pocket removes the return path across the chest entirely.'
    },

    // ── HV Dist — Wiring ──────────────────────────────────────────────────────
    {
        id: 67, topic: 'HV Dist', elo: 850,
        question: 'Does low-voltage control wiring in an EV (e.g. BMS sense wires, CAN bus) need overcurrent protection?',
        choices: [
            'No — low-voltage wiring operates below 60 V and is inherently safe, requiring no overcurrent protection',
            'Yes — a short can still ignite LV wire insulation regardless of voltage; use an inline fuse rated just above maximum normal current',
            'LV wiring only needs overcurrent protection once the operating voltage exceeds 12 V',
            'Overcurrent protection only applies to the HV side; the BMS provides all needed protection for LV sense wiring'
        ],
        answer: 1,
        explanation: 'The hazard from overcurrent is not voltage but I²R heating in the conductor. A 24 AWG wire at 85 mΩ/m with 5 A flowing: P = 25 × 0.085 = 2.1 W/m — enough to heat wire above insulation temperature limits in seconds. In an enclosed pack, burning wire insulation is a fire risk regardless of voltage. Size fuses at 125–150% of max normal current.'
    },
    {
        id: 68, topic: 'HV Dist', elo: 850,
        question: 'What are the two primary considerations that drive wire sizing in an EV, and what happens if the wire is too small?',
        choices: [
            'Wire gauge is chosen purely for weight minimization — the thinnest wire that fits the connector is optimal',
            'Wire sizing is governed by (1) ampacity — insulation temperature limit at max current — and (2) voltage drop — I×R loss must not impair the circuit',
            'Wire gauge is selected purely to match the mechanical size of the termination connector pin',
            'Only HV cables require formal sizing; LV wiring can be any gauge that fits the connector'
        ],
        answer: 1,
        explanation: 'Two constraints must both be satisfied: (1) Ampacity — maximum continuous current that keeps conductor temperature below insulation class limit (typically 105°C for XLPE, 150°C for silicone). Exceeding ampacity melts insulation → short → fire. (2) Voltage drop — I²R losses in wiring reduce available voltage at the load and waste power as heat. Fuses must be sized to protect the wire, not just the load.'
    },
    {
        id: 69, topic: 'HV Dist', elo: 900,
        question: 'A higher AWG number means a thinner wire. Does a thinner wire have more or less resistance than a thicker wire of the same length and material?',
        choices: [
            'Higher AWG (thinner) wire has less resistance — less material means fewer electron collisions',
            'Higher AWG (thinner) wire has MORE resistance; R = ρL/A means smaller cross-sectional area A directly increases R',
            'Resistance depends only on conductor material — all copper wires of the same length have identical resistance',
            'Higher AWG wire has more resistance only at high frequency due to skin effect; at DC all gauges are equivalent per unit length'
        ],
        answer: 1,
        explanation: 'R = ρL/A. ρ = resistivity (material constant; copper: 1.72×10⁻⁸ Ω·m). L = length (proportional). A = cross-sectional area (inversely proportional). AWG scale is inverse: AWG 0 (thick, ~8.3mm diameter) has very low resistance; AWG 30 (thin, ~0.25mm) has very high resistance. Every 6 AWG increase approximately halves the cross-sectional area and doubles the resistance per unit length.'
    },

    // ── CSV Extension ─────────────────────────────────────────────────────────
    {
        id: 70, topic: 'Battery', elo: 800,
        question: 'A lithium cell is fully charged when its voltage reaches approximately 4.2 V. What voltage does it typically reach when fully discharged?',
        choices: [
            'Approximately 0 V — it is completely depleted like a standard alkaline cell',
            'Approximately 2.5–3.0 V — the cell still has a residual voltage at its discharge cutoff',
            'Approximately 1.5 V — the same cutoff as a standard alkaline AA cell',
            'Approximately 4.0 V — the cell barely changes voltage throughout discharge'
        ],
        answer: 1,
        explanation: 'Lithium-ion cells have a discharge cutoff voltage of approximately 2.5–3.0 V depending on chemistry — the cell is considered "empty" at this point, not at 0 V. Discharging below the cutoff damages the cell through copper dissolution and other irreversible reactions. The usable voltage window for NMC is roughly 3.0–4.2 V.'
    },
    {
        id: 71, topic: 'Powertrain', elo: 800,
        question: 'What does it mean for a motor to be "back-driven"?',
        choices: [
            'The motor is spinning in reverse to apply braking torque at the request of the driver',
            'An external mechanical force is spinning the motor shaft, causing it to act as a generator',
            'The motor controller is sending current in the reverse direction to slow the rotor',
            'The motor is operating in its field-weakening region above base speed'
        ],
        answer: 1,
        explanation: 'A motor is back-driven when a mechanical load (e.g. the wheels of a decelerating vehicle) spins its shaft from the outside. In this condition the motor acts as a generator, converting mechanical energy back into electrical energy. This is the physical basis of regenerative braking.'
    },
    {
        id: 72, topic: 'Safety', elo: 800,
        question: 'Why is it dangerous to touch a high-voltage conductor even after the main contactors (AIRs) have been opened?',
        choices: [
            'The contactors may not have fully opened, leaving the circuit partially energized',
            'Large capacitors in the inverter can retain lethal charge for seconds to minutes after disconnection',
            'The BMS continues supplying low current through the sense wires, maintaining a shock hazard',
            'Battery cells can briefly spike to twice their normal voltage when the circuit is broken'
        ],
        answer: 1,
        explanation: 'Motor controllers contain large DC bus capacitors that store significant energy. When the AIRs open, these capacitors do not discharge instantly — they retain voltage for seconds to minutes depending on the bleed resistor design. The stored charge is sufficient to cause cardiac arrest. Always wait for the capacitor discharge time specified in the system documentation before contacting HV conductors.'
    },
    {
        id: 73, topic: 'Battery', elo: 820,
        question: 'If you connect two identical cells in series, what happens to the pack voltage and capacity compared to a single cell?',
        choices: [
            'Voltage doubles; capacity doubles',
            'Voltage doubles; capacity stays the same',
            'Voltage stays the same; capacity doubles',
            'Voltage and capacity both stay the same — series connection only improves reliability'
        ],
        answer: 1,
        explanation: 'Series connection adds voltages but the capacity (Ah) is set by the weakest cell in the string — in an ideal matched pair, capacity equals one cell\'s capacity. If each cell is 3.7 V and 10 Ah, the series pack is 7.4 V and 10 Ah. This is why series connections increase pack voltage for motor drive requirements without increasing stored charge.'
    },
    {
        id: 74, topic: 'Powertrain', elo: 850,
        question: 'A motor produces 50 Nm of torque at 3000 RPM. What is its mechanical output power?',
        choices: [
            'Approximately 1.6 kW',
            'Approximately 15.7 kW',
            'Approximately 150 kW',
            'Approximately 50 kW'
        ],
        answer: 1,
        explanation: 'Power = torque × angular velocity = T × ω, where ω = (RPM × 2π) / 60. ω = 3000 × 2π / 60 = 314.2 rad/s. P = 50 × 314.2 = 15,708 W ≈ 15.7 kW. This is the fundamental relationship between torque, speed, and power — a motor producing high torque at low RPM can deliver the same power as a low-torque motor at high RPM.'
    },
    {
        id: 75, topic: 'HV Dist', elo: 850,
        question: 'Two wires have the same length and are made of the same material. Wire A has twice the cross-sectional area of Wire B. How do their resistances compare?',
        choices: [
            'Wire A has twice the resistance of Wire B because it has more material',
            'Wire A has half the resistance of Wire B because R = ρL/A and A doubles',
            'Wire A and Wire B have the same resistance because length and material are identical',
            'Wire A has four times the resistance of Wire B because resistance scales with area squared'
        ],
        answer: 1,
        explanation: 'From R = ρL/A: resistance is inversely proportional to cross-sectional area. Doubling the area halves the resistance. Physically, a thicker wire provides more parallel paths for electrons, reducing resistance. This is why high-current HV cables use large cross-section copper — to keep I²R losses and voltage drop manageable.'
    },
    {
        id: 76, topic: 'Battery', elo: 870,
        question: 'A cell is rated at 13 Ah. A second identical cell is connected in parallel with it. What is the capacity of the parallel pair?',
        choices: [
            '13 Ah — parallel connection does not change capacity',
            '6.5 Ah — the capacity is split between the two cells',
            '26 Ah — parallel connection adds the capacities of both cells',
            '169 Ah — capacity scales with the product of the two cell ratings'
        ],
        answer: 2,
        explanation: 'Parallel connection adds capacities. Two 13 Ah cells in parallel produce a 26 Ah pack at the same voltage as a single cell. Both cells share the load current, each supplying half — so the combined pack can run twice as long at the same current draw. This is the key benefit of parallel groups: more total energy at the same voltage.'
    },
    {
        id: 77, topic: 'Safety', elo: 880,
        question: 'What does "galvanic isolation" mean between the HV tractive system and the low-voltage (12V) system in an EV?',
        choices: [
            'The LV system uses galvanized steel enclosures to protect against corrosion near the HV wiring',
            'There is no direct electrical connection between HV and LV conductors — current cannot flow between them under normal conditions',
            'The HV system is isolated from external charging equipment using a mechanical disconnect',
            'The LV system is isolated from the chassis ground to prevent corrosion of the frame'
        ],
        answer: 1,
        explanation: 'Galvanic isolation means the HV and LV circuits share no direct conductive path. A fault in one system cannot directly drive current into the other. In EVs this is achieved by isolated DC-DC converters (not transformerless) and optocouplers for signals. It is required by FSAE rules and safety standards because it prevents a HV fault from electrocuting someone touching LV components like the steering wheel or data logger.'
    },
    {
        id: 78, topic: 'Powertrain', elo: 900,
        question: 'In regenerative braking, where does the recovered energy go?',
        choices: [
            'It is dissipated as heat in the motor windings to slow the vehicle',
            'It is returned to the battery pack as electrical energy via the motor acting as a generator',
            'It is stored in a flywheel connected to the motor shaft for later mechanical use',
            'It is dumped into a brake resistor because the battery cannot accept charge during braking'
        ],
        answer: 1,
        explanation: 'During regenerative braking, the wheels back-drive the motor, which acts as a generator producing AC. The inverter converts this back to DC and returns it to the battery. This recovers kinetic energy that would otherwise be lost as heat in friction brakes. The amount recoverable depends on battery SoC (a full battery cannot accept charge), braking intensity, and inverter/motor efficiency.'
    },
    {
        id: 79, topic: 'Battery', elo: 900,
        question: 'Why does a cell\'s voltage drop when current is drawn, even if the cell is not depleted?',
        choices: [
            'Current draw causes the electrolyte to temporarily freeze, reducing ionic conductivity',
            'The cell\'s internal resistance causes a voltage drop proportional to the current drawn',
            'The BMS reduces cell voltage under load to protect against overheating',
            'Increased current draw lowers the cell\'s state of charge instantaneously'
        ],
        answer: 1,
        explanation: 'V_terminal = OCV − (I × R_internal). Every cell has internal resistance (DCIR), and when current flows, Ohm\'s law produces a voltage drop across that resistance. The terminal voltage the load sees is lower than the open-circuit voltage. At higher currents this drop is larger — this is why a battery pack that reads 100 V at rest may only deliver 92 V under a 200 A load.'
    },
    {
        id: 80, topic: 'Calculations', elo: 920,
        question: 'A motor controller is 95% efficient. If the battery delivers 20 kW of electrical power to the controller, how much power reaches the motor shaft?',
        choices: [
            '19 kW — 5% is lost as heat in the controller',
            '21 kW — the controller boosts power through switching',
            '20 kW — efficiency losses appear in the motor, not the controller',
            '1 kW — only the excess power above 95% is delivered'
        ],
        answer: 0,
        explanation: 'Power out = Power in × efficiency = 20 kW × 0.95 = 19 kW. The remaining 1 kW is dissipated as heat in the controller\'s switching transistors, gate drivers, and other losses. Each component in the drivetrain chain has its own efficiency — total drivetrain efficiency is the product of all individual efficiencies, which is why small losses compound quickly.'
    },
    {
        id: 81, topic: 'HV Dist', elo: 950,
        question: 'A 100 V pack delivers 150 A through a cable with 5 mΩ total resistance. How much power is wasted as heat in that cable?',
        choices: [
            '0.75 W',
            '112.5 W',
            '750 W',
            '15 W'
        ],
        answer: 1,
        explanation: 'P_loss = I² × R = 150² × 0.005 = 22,500 × 0.005 = 112.5 W. This is entirely wasted as heat. Notice the loss scales with current squared — doubling the current quadruples the cable loss. This is why high-current HV cables must have low resistance (large cross-section, short runs, quality connections), and why reducing pack current by increasing pack voltage is a common design strategy.'
    },
    {
        id: 82, topic: 'Powertrain', elo: 950,
        question: 'What happens to the torque available at the wheels when you increase the gear ratio (e.g. from 4:1 to 6:1)?',
        choices: [
            'Wheel torque decreases because more gear reduction means more mechanical losses',
            'Wheel torque increases because the gear ratio multiplies motor torque at the cost of wheel speed',
            'Wheel torque stays the same because power is conserved through the gearbox',
            'Wheel torque doubles because there are now more gear teeth in contact with the shaft'
        ],
        answer: 1,
        explanation: 'A gear ratio multiplies torque: T_wheel = T_motor × gear_ratio × η_gear. Going from 4:1 to 6:1 increases wheel torque by 50% for the same motor torque output. The tradeoff is wheel speed — a 6:1 ratio means the wheel spins at 1/6 the motor speed instead of 1/4, so top speed is lower. This is the fundamental torque-speed tradeoff of any gearing system.'
    },
    {
        id: 83, topic: 'Battery', elo: 980,
        question: 'A 28s pack is at 50% SoC. Each cell has an OCV of 3.65 V at this SoC. What is the pack open-circuit voltage?',
        choices: [
            '3.65 V — the series pack voltage equals the individual cell voltage',
            '102.2 V — the pack voltage is 28 × 3.65 V',
            '1.83 V — the pack voltage is halved at 50% SoC',
            '51.1 V — series connection averages the cell voltages'
        ],
        answer: 1,
        explanation: 'Series connection adds voltages: V_pack = N_series × V_cell = 28 × 3.65 = 102.2 V. SoC affects the per-cell voltage (lower SoC = lower OCV per cell), but the pack voltage is always the sum of all series cells. At 100% SoC (~4.2 V/cell): V_pack = 117.6 V. At 0% SoC (~3.0 V/cell): V_pack = 84 V. The pack voltage window tracks the cell voltage window scaled by series count.'
    },
    {
        id: 84, topic: 'Powertrain', elo: 1000,
        question: 'An electric motor has a peak efficiency of 94%. At what operating condition is efficiency likely to be lowest?',
        choices: [
            'At peak torque and rated RPM — maximum power always coincides with maximum losses',
            'At very light load (low torque, low current) — fixed losses dominate a small useful output',
            'At maximum RPM in field weakening — the motor is most stressed at high speed',
            'At room temperature — motors are most efficient when thermally loaded'
        ],
        answer: 1,
        explanation: 'Motor efficiency = useful power out / total power in. Fixed losses (iron losses, bearing friction, windage) are roughly constant regardless of load. At very light loads, these fixed losses represent a large fraction of the small input power, so efficiency is low. This is why efficiency maps show low efficiency at light load and high efficiency in a "sweet spot" region. Peak efficiency is typically at moderate torque and moderate speed.'
    },
    {
        id: 85, topic: 'Battery', elo: 1000,
        question: 'Why does a cell feel warm during a high-rate discharge even if nothing appears to be wrong?',
        choices: [
            'Heat is a sign of irreversible damage — a warm cell during discharge indicates a failing cell',
            'The cell\'s BMS is actively heating the cell to maintain optimal operating temperature',
            'Current flowing through the cell\'s internal resistance generates heat according to P = I²R',
            'Chemical energy converts to heat first, then back to electrical energy in a two-step process'
        ],
        answer: 2,
        explanation: 'P_heat = I² × R_internal. Even a healthy cell with low DCIR generates heat under current. A 13 Ah pouch cell with 1.5 mΩ DCIR at 100 A produces P = 100² × 0.0015 = 15 W per cell — that\'s 420 W across a 28-cell pack. This heat must be managed by the thermal system. Higher DCIR cells run hotter for the same current, accelerating degradation.'
    },
    {
        id: 86, topic: 'HV Dist', elo: 1020,
        question: 'A wire is rated for 40 A continuous. A 50 A fuse is installed to protect it. Is this setup safe?',
        choices: [
            'Yes — fuses always have a safety margin, so a 50 A fuse adequately protects a 40 A wire',
            'No — the fuse must be rated at or below the wire\'s ampacity; a 50 A fuse allows currents that overheat the wire before the fuse blows',
            'Yes — the fuse rating only needs to match the load current, not the wire rating',
            'No — fuses should always be rated at 200% of wire ampacity to handle inrush currents'
        ],
        answer: 1,
        explanation: 'The fuse protects the wire, not the load. If the fuse rating exceeds the wire\'s ampacity, a fault can draw 50 A through a 40 A wire — the wire overheats and potentially starts a fire before the fuse opens. Fuses must always be rated at or below the wire ampacity. If a higher fuse is needed for the load, a larger gauge wire must be used.'
    },
    {
        id: 87, topic: 'Powertrain', elo: 1050,
        question: 'A vehicle accelerates at full power from rest. As it speeds up, the motor torque decreases even though the motor controller is still commanding maximum power. Why?',
        choices: [
            'The battery voltage drops at high current, reducing available motor torque',
            'At constant power, torque must decrease as speed increases because P = T × ω',
            'The motor controller reduces torque above a threshold speed to protect the winding insulation',
            'Gear friction increases at high RPM, absorbing more torque before it reaches the wheels'
        ],
        answer: 1,
        explanation: 'P = T × ω. If power is held constant and ω (speed) increases, T (torque) must decrease proportionally. This is the constant-power region on a torque-speed curve. EVs operate in this region above base speed — peak torque is available from 0 RPM up to base speed, then torque tapers inversely with speed to hold power constant. It\'s a fundamental consequence of the physics, not a protection strategy.'
    },
    {
        id: 88, topic: 'Battery', elo: 1050,
        question: 'Two packs each store 1.36 kWh. Pack A is 28s1p (104 V, 13 Ah). Pack B is 14s2p (52 V, 26 Ah). At the same load power, which pack delivers higher current?',
        choices: [
            'Pack A delivers higher current because it has fewer parallel cells',
            'Pack B delivers higher current because its lower voltage requires more current for the same power',
            'Both packs deliver the same current because they have equal energy',
            'Pack A delivers higher current because higher voltage packs always have higher current capacity'
        ],
        answer: 1,
        explanation: 'P = V × I, so I = P / V. At the same power, lower voltage requires proportionally more current. Pack B at 52 V needs twice the current of Pack A at 104 V to deliver the same power. This has significant implications for wiring gauge, connector ratings, and I²R losses — which is why higher voltage packs are preferred for high-power applications: the same power at higher voltage means lower current and less resistive loss.'
    },
    {
        id: 89, topic: 'Powertrain', elo: 1100,
        question: 'A PMSM motor is spinning at its base speed. The driver commands more speed. Without field weakening, why can the inverter not simply increase motor speed further?',
        choices: [
            'The motor windings overheat above base speed regardless of control strategy',
            'At base speed the back-EMF equals the available bus voltage — there is no voltage headroom to drive more current and accelerate',
            'The motor\'s rotor magnets demagnetize above base speed due to centrifugal force',
            'The inverter switching frequency cannot exceed the electrical frequency at base speed'
        ],
        answer: 1,
        explanation: 'A PMSM generates back-EMF proportional to speed: V_bemf = Kv × ω. At base speed, V_bemf = V_bus. The inverter can no longer push current into the motor because there is no voltage difference to drive it — the motor and inverter are at the same voltage. Field weakening (negative d-axis current) reduces effective flux, lowering back-EMF and restoring voltage headroom, allowing higher speed at the cost of reduced torque.'
    },
    {
        id: 90, topic: 'Battery', elo: 1100,
        question: 'A pack is stored at 100% SoC for three months. Why is this worse for long-term health than storing at 50% SoC?',
        choices: [
            'At full charge the BMS draws more current for balancing, accelerating electrode wear',
            'High SoC means high cell voltage, which accelerates electrolyte oxidation at the cathode and SEI growth — both thermally activated degradation mechanisms',
            'A full pack is heavier, so gravity compresses the cells and damages the electrode stack over time',
            'At 100% SoC the cell voltage exceeds the electrolyte stability window, causing continuous decomposition'
        ],
        answer: 1,
        explanation: 'Cell degradation reactions are thermally and electrochemically driven. At high SoC, cell voltage is high — the cathode is in a strongly oxidizing state that reacts more aggressively with the electrolyte. The SEI on the anode also grows faster at high SoC. Both are Arrhenius-type processes that accelerate exponentially with temperature and are amplified at high SoC. Storage at 40–50% SoC minimizes both, which is why EV manufacturers recommend not storing at full charge for extended periods.'
    },
    {
        id: 91, topic: 'Calculations', elo: 1150,
        question: 'A 104 V pack powers a motor drawing 180 A. The total HV wiring resistance is 8 mΩ. What voltage actually appears at the motor controller terminals?',
        choices: [
            '104 V — wiring resistance causes no voltage drop at DC',
            '102.56 V — the wiring drops I × R = 180 × 0.008 = 1.44 V',
            '100.16 V — the wiring drops I² × R = 180² × 0.008',
            '96 V — wiring resistance drops 8% of pack voltage at this current'
        ],
        answer: 1,
        explanation: 'V_load = V_pack − I × R_wiring = 104 − (180 × 0.008) = 104 − 1.44 = 102.56 V. The power wasted in the wiring is P = I² × R = 180² × 0.008 = 259 W — a continuous loss that heats the cables. Minimizing wiring resistance through larger conductor cross-section and quality connections is essential in high-current EV drivetrains.'
    },
    {
        id: 92, topic: 'Powertrain', elo: 1150,
        question: 'An EV motor produces 30 kW at the shaft. The gearbox is 97% efficient, and the differential is 98% efficient. How much power reaches the wheels?',
        choices: [
            '30 kW — efficiency losses in gearing are negligible at these values',
            '28.55 kW — total drivetrain efficiency is 0.97 × 0.98 = 95.1%',
            '27.9 kW — each component subtracts its loss independently from 30 kW',
            '29.1 kW — only the less efficient component applies its loss'
        ],
        answer: 1,
        explanation: 'Total drivetrain efficiency = η_gearbox × η_differential = 0.97 × 0.98 = 0.9506. Power at wheels = 30 kW × 0.9506 = 28.52 kW ≈ 28.55 kW. Component efficiencies multiply — they do not add or subtract independently. Each stage\'s losses reduce the power entering the next stage. A chain of several 95–98% efficient components can reduce total efficiency to 85–90%, which has significant impact on vehicle range and thermal management.'
    },
    {
        id: 93, topic: 'Battery', elo: 1200,
        question: 'During fast charging, a cell\'s temperature rises significantly even though the charger is operating within the rated current. What is the most direct cause?',
        choices: [
            'Fast charging activates a chemical reaction in the cathode that releases heat as a byproduct',
            'Higher charge current increases I²R heating in the cell\'s internal resistance, and the charge rate may also promote SEI growth generating exothermic side reactions',
            'The BMS intentionally heats the cell during fast charging to improve lithium intercalation kinetics',
            'AC ripple current from the charger causes dielectric heating in the separator'
        ],
        answer: 1,
        explanation: 'The dominant thermal source during fast charging is I²R heating: P = I² × R_internal. Doubling the charge current quadruples the heat generated inside the cell. At high C-rate, additional heat comes from overpotential losses at the electrode-electrolyte interface (charge transfer polarization) and, in some conditions, minor exothermic side reactions. The cell temperature must be managed to prevent accelerated degradation, lithium plating, or thermal runaway.'
    },
    {
        id: 94, topic: 'Powertrain', elo: 1250,
        question: 'Two motors have the same peak power rating but different Kv values: Motor A has Kv = 50 RPM/V and Motor B has Kv = 200 RPM/V. Both are driven from the same 100 V bus. Which statement correctly describes their behavior?',
        choices: [
            'Motor A has higher peak RPM because higher Kv means more speed per volt',
            'Motor B has higher no-load speed but lower torque per amp than Motor A at the same bus voltage',
            'Both motors produce the same torque per amp because they have the same power rating',
            'Motor A runs hotter than Motor B because lower Kv means higher winding resistance'
        ],
        answer: 1,
        explanation: 'Kv and Kt are inversely related: Kt = 60/(2π × Kv). Motor A (Kv=50): Kt ≈ 0.191 Nm/A — high torque per amp. Motor B (Kv=200): Kt ≈ 0.0477 Nm/A — low torque per amp. At the same bus voltage, Motor B reaches 4× the no-load RPM but needs 4× the current to produce the same torque. Same power rating doesn\'t mean same torque per amp — Kv sets the speed-torque character of the motor and must be matched to the application\'s gear ratio and speed requirements.'
    },
    {
        id: 95, topic: 'Battery', elo: 1250,
        question: 'A pack\'s capacity is measured as 12.8 Ah at a 1C discharge rate but only 11.5 Ah at a 3C discharge rate. What fundamental mechanism causes this apparent capacity reduction at higher rate?',
        choices: [
            'The BMS terminates discharge earlier at high rate to prevent overheating, not a true capacity reduction',
            'Increased I²R heating at 3C raises cell temperature, which paradoxically accelerates self-discharge during the test',
            'Higher current increases voltage sag, causing the pack to reach its minimum cutoff voltage before all lithium has been extracted from the electrodes',
            'At 3C, lithium ions cannot intercalate fast enough, so they precipitate as a solid on the separator instead of entering the electrode'
        ],
        answer: 2,
        explanation: 'At higher discharge rates, the voltage sag (V = OCV − I×R_internal) is larger. The pack hits the low-voltage cutoff earlier — not because the lithium is gone, but because the resistive drop pulls the terminal voltage to the cutoff limit while usable charge remains in the electrodes. If you let the pack rest after a 3C discharge, the terminal voltage recovers — confirming charge was stranded, not consumed. This rate-dependent apparent capacity is a key reason C-rate must be specified when quoting cell capacity.'
    },
    {
        id: 96, topic: 'HV Dist', elo: 1300,
        question: 'An engineer wants to reduce HV wiring losses by a factor of four without changing wire length or material. What change accomplishes this?',
        choices: [
            'Double the wire cross-sectional area — this halves resistance and halves I²R loss',
            'Quadruple the wire cross-sectional area — this quarters resistance and quarters I²R loss',
            'Double the pack voltage and halve the current — same power, I²R loss quarters because loss scales with I²',
            'Both B and C independently achieve a 4× loss reduction through different physical mechanisms'
        ],
        answer: 3,
        explanation: 'Two independent paths to 4× loss reduction: (1) R = ρL/A — quadrupling A quarters R, and since I is unchanged, I²R loss quarters. (2) For fixed power and resistance, doubling voltage halves current and quarters I²R loss (loss ∝ I²). Both are valid engineering strategies. Option B is a hardware change (bigger wire); Option C is a system-level design choice (higher voltage bus). In practice, EV powertrains use both: large cables AND the highest practical bus voltage.'
    },
    {
        id: 97, topic: 'Powertrain', elo: 1300,
        question: 'A vehicle is coasting downhill with the motor back-driving the inverter. The battery is at 98% SoC. What happens to the recovered braking energy?',
        choices: [
            'It charges the battery normally — the BMS simply accepts the regenerated charge',
            'The inverter must dissipate the energy as heat or redirect it to a brake resistor because a nearly-full battery cannot safely accept significant charge',
            'The energy is stored in the DC bus capacitors indefinitely until the battery has room',
            'Regenerative braking is disabled by the inverter at all times when the battery exceeds 90% SoC'
        ],
        answer: 1,
        explanation: 'A battery near full charge has very little remaining capacity to absorb energy. Forcing charge into an already-full cell can push cell voltage above its maximum (4.2 V for NMC), causing electrolyte oxidation and potential thermal runaway. The BMS signals the inverter to limit or disable regeneration at high SoC. The mechanical brakes must handle the remaining deceleration force. Some systems use a brake chopper resistor to dump regenerated energy as heat rather than let bus voltage rise uncontrolled.'
    },
    {
        id: 98, topic: 'HV Dist', elo: 1450,
        question: 'An HV cable run is 3 meters one-way (6 m round trip total). The motor draws 200 A continuously. Compare 4 AWG copper (0.328 mΩ/m) vs 2 AWG copper (0.205 mΩ/m). How much additional power is wasted with 4 AWG?',
        choices: [
            'ΔP = 29.5 W — 4 AWG wastes about 30 W more than 2 AWG at this current',
            'ΔP = 7.4 W — 4 AWG wastes only slightly more because the AWG difference is small',
            'ΔP = 118 W — 4 AWG wastes four times as much as 2 AWG because resistance is four times higher',
            'ΔP = 0 W — both gauges carry 200 A, so power loss is determined only by current, not gauge'
        ],
        answer: 0,
        explanation: 'R_4AWG = 0.328 mΩ/m × 6 m = 1.968 mΩ. R_2AWG = 0.205 × 6 = 1.230 mΩ. ΔR = 0.738 mΩ. ΔP = I² × ΔR = 200² × 0.000738 = 40,000 × 0.000738 = 29.5 W. This 30 W of extra heat must be rejected by the cable — over 2000 operating hours, that\'s 59 kWh of wasted energy. It also validates using the larger 2 AWG wire: the marginal resistance reduction is worth the added weight in a continuous high-current application.'
    },
    {
        id: 99, topic: 'Calculations', elo: 1350,
        question: 'An FSAE car completes an autocross event in 60 seconds using an average of 25 kW. The pack is 104 V nominal. What average current does the pack deliver, and how many Ah are consumed?',
        choices: [
            'Average current = 240 A; Ah consumed = 4.0 Ah',
            'Average current = 240 A; Ah consumed = 0.42 Ah',
            'Average current = 2600 A; Ah consumed = 43 Ah',
            'Average current = 24 A; Ah consumed = 0.4 Ah'
        ],
        answer: 0,
        explanation: 'I_avg = P / V = 25,000 / 104 = 240 A average. Energy used = 25 kW × (60/3600) h = 0.417 kWh. Charge consumed: Ah = I × t = 240 A × (60/3600) h = 240 × 0.0167 = 4.0 Ah. A 13 Ah pack has plenty of capacity for a single 60-second autocross run, but 22 km endurance at similar intensity would consume much more.'
    },
    {
        id: 100, topic: 'Powertrain', elo: 1400,
        question: 'An engineer argues that doubling the motor\'s Kt (torque constant) by rewinding with more turns is always better because it produces more torque per amp. What is the flaw in this reasoning?',
        choices: [
            'More turns increase winding resistance proportionally, so I²R losses increase for the same torque output',
            'Doubling Kt halves Kv, so the motor reaches half the speed at the same bus voltage, requiring a higher gear ratio to achieve the same wheel speed',
            'More turns in the winding increase the motor\'s inductance, which increases switching losses in the inverter',
            'All of the above are real tradeoffs — more turns increases torque per amp but reduces top speed, increases winding resistance, and increases inductance'
        ],
        answer: 3,
        explanation: 'Rewinding with more turns is not a free lunch. (A) Resistance: more turns of the same wire gauge means longer wire and higher R — winding copper losses (I²R) increase. (B) Speed: Kt ∝ 1/Kv — doubling Kt halves Kv and halves no-load speed for the same voltage. You need a higher gear ratio to compensate, adding mechanical losses. (C) Inductance scales with turns², so doubling turns quadruples inductance, increasing current ripple and switching losses. Good motor design balances all these tradeoffs simultaneously for the target operating point.'
    },
    {
        id: 101, topic: 'Battery', elo: 1400,
        question: 'A pack engineer notices that two cells in a 28s string consistently show lower voltage than the others at the same SoC throughout the entire discharge curve — not just at the end. What does this most likely indicate?',
        choices: [
            'Those cells have higher DCIR than the rest — their voltage sag is larger at any given current',
            'Those cells are at a lower SoC than the others, indicating a balancing failure or higher self-discharge rate',
            'Those cells have lower capacity than the rest and will reach cutoff voltage first',
            'The BMS voltage sense wires for those cells have higher resistance, causing a false low reading'
        ],
        answer: 0,
        explanation: 'The key detail is "throughout the entire discharge curve" — not just at the end. Lower capacity would show up as earlier cutoff, not a consistent voltage offset across all SoC. Different SoC would show an offset that changes shape. A consistent voltage offset at all SoC levels at the same current is the signature of higher DCIR: V = OCV − I×R, and if R is higher, V is lower at every point by the same amount (I×ΔR). This is diagnosable by checking under load vs open circuit — the gap closes at zero current.'
    },
    {
        id: 102, topic: 'Powertrain', elo: 1500,
        question: 'An electric motor is operating in field weakening. Compared to operating at base speed with the same shaft power output, what is true about the phase current and torque?',
        choices: [
            'Phase current is lower in field weakening because the motor is more efficient at high speed',
            'Phase current is higher in field weakening because d-axis current is added on top of the torque-producing q-axis current to achieve the same shaft power at higher speed',
            'Torque is higher in field weakening because the motor runs at a more favorable operating point',
            'Phase current and torque are both identical to the base speed condition at the same shaft power'
        ],
        answer: 1,
        explanation: 'In field weakening, the inverter injects negative d-axis current (Id) to oppose the rotor flux and allow higher RPM. The total phase current magnitude is √(Id² + Iq²). For the same output power at higher speed, torque is lower (P = T×ω), so Iq is lower — but the added Id means total phase current can be equal to or higher than at base speed. The motor must be rated for this combined current. This is why field weakening operation is thermally demanding despite lower torque — the copper losses depend on total current, not just the torque-producing component.'
    },
    {
        id: 103, topic: 'Battery', elo: 1500,
        question: 'A battery engineer tests two packs of the same chemistry and energy capacity. Pack A is 28s1p (104 V, 13 Ah). Pack B is 56s1p (208 V, 6.5 Ah). At identical delivered power, which pack has lower wiring I²R loss, and why?',
        choices: [
            'Pack A has lower wiring loss because higher current through more cells generates more conduction paths',
            'Pack B has lower wiring loss because delivering the same power at twice the voltage requires half the current, and I²R loss scales with current squared',
            'Both packs have identical wiring losses because they store and deliver the same total energy',
            'Pack A has lower wiring loss because its lower voltage means lower electric field stress on the insulation, reducing leakage current'
        ],
        answer: 1,
        explanation: 'P_loss = I²R. Pack B operates at 208 V; for the same delivered power P = V×I, Pack B needs I = P/208 while Pack A needs I = P/104 — exactly half the current. Since loss scales with I², Pack B has (1/2)² = 1/4 the wiring I²R loss for identical wiring. This is the fundamental argument for higher voltage EV architectures (400 V vs 800 V): same power, half the current, quarter the resistive losses, or alternatively the same losses with much thinner and lighter wiring.'
    },
    {
        id: 104, topic: 'Powertrain', elo: 1550,
        question: 'A motor spec sheet shows a peak torque of 100 Nm and continuous torque of 40 Nm. The engineer designs the drivetrain assuming 80 Nm continuous. What failure mode should they anticipate?',
        choices: [
            'The motor will produce too little torque because 80 Nm exceeds the 40 Nm continuous rating and will trigger a current limit',
            'The motor windings will overheat because the thermal system is only designed to reject the heat generated at 40 Nm continuous, and 80 Nm requires 4× the heat generation',
            'The rotor magnets will demagnetize because sustained torque above continuous rating causes the magnets to exceed their Curie temperature',
            'The gearbox will fail because it was sized for 40 Nm input torque and 80 Nm doubles gear tooth stress'
        ],
        answer: 1,
        explanation: 'Continuous torque ratings are set by thermal limits — the motor\'s cooling system (ambient air, housing, potting) can reject heat generated at exactly this torque level continuously. Torque ∝ current, so 80 Nm requires 2× the current of 40 Nm. Heat ∝ I²R, so 4× the heat generation. The cooling system cannot keep up. Over time, winding temperature rises above the insulation class limit, degrading the insulation, eventually causing inter-turn short circuits or winding failure. Peak torque is achievable only briefly before the thermal limit is reached.'
    },
    {
        id: 105, topic: 'Battery', elo: 1600,
        question: 'In a series string of cells, one cell has 20% higher internal resistance than the rest. During a high-current discharge pulse, this cell\'s temperature rises faster than its neighbors. Over many cycles, what is the most likely long-term failure mechanism?',
        choices: [
            'The hotter cell self-discharges faster, gradually falling behind in SoC until the BMS can no longer balance it',
            'The hotter cell experiences faster calendar aging and SEI growth due to elevated temperature, further increasing its resistance, creating a self-reinforcing degradation cycle',
            'The hotter cell charges faster than its neighbors because elevated temperature improves lithium intercalation kinetics, causing it to become overcharged during balancing',
            'The hotter cell will eventually reach the same resistance as its neighbors because high-temperature operation anneals the electrode structure'
        ],
        answer: 1,
        explanation: 'This is a self-reinforcing (positive feedback) degradation loop. Higher DCIR → more I²R heat at same current → higher temperature → faster SEI growth (Arrhenius kinetics, roughly doubling every 10°C) → higher DCIR. Each cycle, this cell ages faster than its neighbors. It becomes the weakest cell in the string — limiting pack capacity — while simultaneously getting hotter, which accelerates the divergence further. This is why tight DCIR matching at pack assembly is important: outliers become progressively worse over the pack\'s life.'
    },
    {
        id: 106, topic: 'Powertrain', elo: 1650,
        question: 'An engineer is choosing between a single motor driving both rear wheels through a differential versus two independent motors (one per rear wheel) with torque vectoring. The two-motor system is heavier. Under what condition does the weight penalty become worthwhile?',
        choices: [
            'The two-motor system is never worth the weight penalty because differential losses are negligible',
            'The two-motor system is worthwhile on tight technical tracks where independent wheel torque control can direct torque to the outside wheel in corners, generating a yaw moment that reduces understeer and improves lap time beyond what the weight penalty costs',
            'The two-motor system is only worthwhile for straight-line acceleration events where both motors can apply full torque simultaneously',
            'The two-motor system is worthwhile whenever the vehicle exceeds 80 kW total because a single motor cannot produce sufficient torque'
        ],
        answer: 1,
        explanation: 'The value proposition of torque vectoring is cornering performance. By applying more torque to the outside rear wheel and less (or negative, via regeneration) to the inside, the drivetrain creates a yaw moment that turns the car into the corner, reducing understeer and allowing higher corner entry speed. This effect is most valuable on slow, tight, technical tracks with many corners — exactly the FSAE autocross profile. On high-speed tracks with fewer corners, the weight penalty hurts more than the torque vectoring helps. The cost-benefit is track and vehicle specific.'
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

    // Shuffle choices, remapping the correct answer index to match
    const indices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    const shuffledCorrect = indices.indexOf(currentQuestion.answer);

    const labels = ['A', 'B', 'C', 'D'];
    indices.forEach((origIdx, displayIdx) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `
            <span class="choice-label">${labels[displayIdx]}</span>
            <span class="choice-text">${currentQuestion.choices[origIdx]}</span>
        `;
        btn.addEventListener('click', () => handleAnswer(displayIdx, shuffledCorrect));
        grid.appendChild(btn);
    });

    showScreen('question');
}

// ── Answer handling ───────────────────────────────────────────────────────────
function handleAnswer(choiceIndex, correctIndex) {
    const correct = choiceIndex === correctIndex;
    const buttons = document.querySelectorAll('.choice-btn');

    buttons.forEach(btn => (btn.disabled = true));
    buttons[correctIndex].classList.add('correct');
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
