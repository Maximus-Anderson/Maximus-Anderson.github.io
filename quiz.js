// quiz.js — Powertrain Fundamentals adaptive quiz

// ── Question Bank ─────────────────────────────────────────────────────────────
// Each question has: id, topic, elo (difficulty), question, choices[], answer (0-indexed), explanation
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
        explanation: '28s1p means 28 cells in series, 1 cell per parallel group. Total cells = 28 × 1 = 28. If it were 28s2p, there would be 56 cells (each "position" in the series string has 2 cells in parallel).'
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
        explanation: 'Pouch cells swell slightly during charge/discharge cycling. Controlled stack pressure suppresses this swelling and discourages lithium dendrite growth, which can cause internal short circuits. Too little pressure accelerates degradation; too much can damage the cell.'
    },
    {
        id: 4, topic: 'Battery', elo: 850,
        question: 'What does "nominal voltage" mean for a lithium cell?',
        choices: [
            'The maximum voltage the cell can reach during charging',
            'The minimum safe discharge voltage',
            'The average operating voltage over a typical discharge curve',
            'The voltage at 50% state of charge only'
        ],
        answer: 2,
        explanation: 'Nominal voltage is a representative average across the cell\'s discharge curve — not the peak (which is higher, around 4.2V for NMC) and not the minimum cutoff (around 2.5–3.0V). It\'s used for energy calculations. A cell listed at 3.73V nominal will actually operate between roughly 3.0V and 4.2V.'
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
        explanation: 'DCIR (DC Internal Resistance) is the cell\'s opposition to current flow measured under a DC pulse. Lower DCIR means less voltage sag when drawing high current — critical for motorsport where peak power demands are large. It also means less heat generated inside the cell during discharge (P = I²R).'
    },
    {
        id: 6, topic: 'Battery', elo: 1000,
        question: 'A pouch cell\'s tabs are made of two different metals. Which combination is correct?',
        choices: [
            'Both tabs are copper — cathode and anode use the same material for symmetry',
            'Cathode tab is aluminum; anode tab is nickel-plated copper',
            'Cathode tab is nickel; anode tab is aluminum',
            'Cathode tab is copper; anode tab is aluminum'
        ],
        answer: 1,
        explanation: 'The cathode (positive) tab is aluminum because it\'s compatible with the high-potential cathode chemistry and resists oxidation at those voltages. The anode (negative) tab is copper (often nickel-plated for weldability) because copper is a better conductor and aluminum would alloy with lithium at low potentials.'
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
        explanation: 'Thermal runaway is a cascade: heat triggers exothermic decomposition reactions, which generate more heat. Once started it is very difficult to stop. It can eject flaming electrolyte, and if fluorine-containing electrolyte salts (like LiPF₆) decompose, they can produce hydrogen fluoride (HF) gas — highly toxic and corrosive. Not that I\'d know anything about that.'
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
        explanation: 'Gravimetric energy density (Wh/kg) tells you how much energy is stored per unit mass. At 180 Wh/kg, a 1 kg cell stores 180 Wh — enough to power a 180 W device for one hour. For FSAE, high energy density means more pack energy without weight penalty.'
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
        explanation: 'In a series string, all cells carry the same current. The weakest cell depletes first and pulls its voltage down to cutoff, stopping the whole string — even if other cells have remaining capacity. This is why cell matching (minimizing capacity spread) matters for pack design.'
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
        explanation: 'Pouch cell tabs are ultrasonically welded stacks of thin foils bonded to the electrode coating inside the cell. Bending at the root stresses this weld joint and can cause the internal foil layers to delaminate — separating the electrode from the current path. This raises resistance, reduces capacity, and can cause hot spots.'
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
        explanation: 'The motor controller (inverter for AC motors) converts the battery\'s DC voltage into the waveform the motor needs. For a three-phase AC motor, it synthesises three sinusoidal AC phases at variable frequency and amplitude to control motor speed and torque.'
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
        explanation: 'Electric motors generate torque proportional to current, independent of rotational speed. At zero RPM (stall), full current can be applied, giving peak torque immediately. ICE vehicles need RPM to build up combustion pressure and must use a clutch or torque converter — EVs can launch at full torque directly.'
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
        explanation: 'At base speed, back-EMF equals the available voltage and the motor can no longer accelerate. Field weakening applies negative d-axis current (opposing the permanent magnet flux) to reduce effective flux, lowering back-EMF and allowing higher RPM — at the cost of reduced torque. It extends the speed range beyond what the supply voltage alone would allow.'
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
        explanation: 'Motor efficiency is the ratio of mechanical shaft power out to electrical power in (losses: copper, iron, friction, windage). Drivetrain efficiency includes all components between the motor shaft and the driven wheels — gearing, differentials, CV joints, wheel bearings. Each adds frictional and windage losses. Total drivetrain efficiency is the product of each component\'s efficiency.'
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
        explanation: 'FSAE autocross courses are slow and tight — top speed is limited, and the car accelerates frequently from low speed. EVs already have abundant low-speed torque, so a lower gear ratio keeps motor RPM in its efficient operating region and reduces gearbox losses. A very high ratio would over-rev the motor and waste energy as heat.'
    },

    // ── Calculations ──────────────────────────────────────────────────────────
    {
        id: 16, topic: 'Calculations', elo: 900,
        question: 'A cell has 3.73V nominal and the pack is 28s. What is the pack nominal voltage?',
        choices: ['3.73 V', '13 V', '104.44 V', '52.22 V'],
        answer: 2,
        explanation: 'Series connection adds voltages. Pack voltage = cells in series × cell voltage = 28 × 3.73 V = 104.44 V. This is the nominal (average) pack voltage; actual voltage will be higher when fully charged (~4.2 V/cell = 117.6 V) and lower near empty (~3.0 V/cell = 84 V).'
    },
    {
        id: 17, topic: 'Calculations', elo: 950,
        question: 'If a cell is rated at 13 Ah and the pack is 28s1p at 104.44V nominal, what is the pack energy in kWh?',
        choices: ['0.169 kWh', '1.357 kWh', '13.58 kWh', '104.44 kWh'],
        answer: 1,
        explanation: 'Pack energy = pack voltage × capacity = 104.44 V × 13 Ah = 1357.7 Wh ≈ 1.36 kWh. In a 28s1p pack the capacity equals one cell\'s capacity (13 Ah) because there is only one parallel group. Adding more cells in parallel would increase capacity proportionally.'
    },
    {
        id: 18, topic: 'Calculations', elo: 1050,
        question: 'A motor draws 200 A from a 100 V battery. The motor outputs 15 kW of mechanical power. What is the motor efficiency?',
        choices: ['15%', '75%', '85%', '95%'],
        answer: 1,
        explanation: 'Input electrical power = V × I = 100 V × 200 A = 20,000 W = 20 kW. Efficiency = output / input = 15 kW / 20 kW = 0.75 = 75%. The remaining 5 kW is dissipated as heat in the motor windings, iron core, and mechanical friction.'
    },
    {
        id: 19, topic: 'Calculations', elo: 1150,
        question: 'Cell DCIR is 1.5 mΩ. At 200 A discharge current, how much voltage does one cell sag?',
        choices: ['0.003 V', '0.30 V', '3.0 V', '30 V'],
        answer: 1,
        explanation: 'Voltage sag = I × R = 200 A × 0.0015 Ω = 0.30 V per cell. In a 28s pack, total pack voltage sag = 28 × 0.30 V = 8.4 V. At nominal 104.44 V this drops the pack to about 96 V under load — important for calculating worst-case available power.'
    },
    {
        id: 20, topic: 'Calculations', elo: 1300,
        question: 'A 28s1p pack at 104 V nominal is discharged at a constant 150 A. Assuming a simple energy model (ignoring voltage droop), how long does it take to deplete a 13 Ah pack?',
        choices: ['5.2 minutes', '8.67 minutes', '52 minutes', '87 minutes'],
        answer: 0,
        explanation: 'Time = capacity / current = 13 Ah / 150 A = 0.0867 hours = 5.2 minutes. FSAE endurance events are roughly 22 km, taking around 20–25 minutes. Constant 150 A would deplete a 1.36 kWh pack in only 5 minutes — real driving uses variable current, and strategy manages how hard the pack is pushed throughout the event.'
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
        explanation: 'The Shutdown Circuit (SDC) is a series loop of normally-open safety switches. Any single fault (IMD trip, BMS fault, BSPD activation, TSMS off, inertia switch trigger, etc.) opens the loop and de-energizes the AIRs (Accumulator Isolation Relays), disconnecting the tractive system from all loads. It\'s designed so failures default to a safe, de-energized state.'
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
        explanation: 'The IMD continuously monitors isolation resistance between the tractive system (high voltage) and chassis ground. A fault — e.g. chafed wiring contacting the chassis — reduces this resistance below the threshold. The IMD opens the SDC, disconnecting high voltage before anyone can be exposed to a shock hazard. FSAE rules require a minimum isolation resistance threshold (typically ≥500 Ω/V).'
    },
    {
        id: 23, topic: 'Safety', elo: 1000,
        question: 'Why must an FSAE accumulator container be double-walled or rated to prevent HV exposure in a crash?',
        choices: [
            'To reduce the weight of the container by using thinner walls with an air gap',
            'To ensure the HV terminals and cells remain protected if the outer wall is breached, preventing accidental contact or short-circuit',
            'Because double walls improve thermal insulation, keeping cells at operating temperature',
            'FSAE rules require double walls only for the GLV (grounded low voltage) system, not the accumulator'
        ],
        answer: 1,
        explanation: 'In a crash, the accumulator container may be impacted. FSAE rules require the HV terminals and cells to remain protected from accidental contact even after an impact. The structural requirement ensures that first responders and marshals can approach a crashed car without risk of touching live HV conductors or causing a secondary short-circuit fire.'
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
        explanation: 'The BSPD monitors two signals: brake pressure (or switch) and motor current. If both are simultaneously above their thresholds — the driver is braking hard while the motor is drawing significant current — this is considered an implausible (potentially dangerous) state, and the BSPD opens the SDC. It prevents the car from simultaneously accelerating and braking at high force.'
    },
    {
        id: 25, topic: 'Safety', elo: 1200,
        question: 'What is the SES (Structural Equivalency Spreadsheet) used for in FSAE?',
        choices: [
            'It documents every weld joint in the chassis for inspection purposes',
            'It is a required analysis proving that a non-standard chassis (e.g. carbon monocoque or modified tube frame) meets the structural stiffness and strength of the specified steel tube baseline',
            'It specifies the minimum wall thickness for the accumulator container',
            'It is submitted after the event to report any structural failures during competition'
        ],
        answer: 1,
        explanation: 'FSAE rules specify a steel tube space frame as the baseline chassis. Any deviation — different tube sizes, material substitutions, carbon fiber monocoques — must be justified via the SES. Teams calculate equivalent bending stiffness, tensile strength, and other properties to prove their design is at least as safe as the mandated baseline. It\'s reviewed at technical inspection.'
    }
];

// ── Config ────────────────────────────────────────────────────────────────────
const STORAGE_KEY   = 'ptf_state';
const USER_K        = 24;        // K-factor for user Elo updates
const QUESTION_K    = 32;        // K-factor for question Elo updates (questions adapt too)
const RECENT_BUFFER = 5;         // avoid repeating the last N questions
const USER_ELO_MIN  = 600;
const USER_ELO_MAX  = 2200;
const CHALLENGE_OFFSET = 80;     // target questions ~80 Elo above user

// ── Level labels ─────────────────────────────────────────────────────────────
const LEVELS = [
    { min: 0,    label: 'Intern'           },
    { min: 900,  label: 'Junior Engineer'  },
    { min: 1100, label: 'Engineer'         },
    { min: 1300, label: 'Senior Engineer'  },
    { min: 1500, label: 'Principal Engineer'},
    { min: 1700, label: 'Chief Engineer'   },
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
        questionElos:  {},   // id → current Elo for that question
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
// Gaussian-ish weight: questions nearest to (userElo + offset) get highest weight.
function selectQuestion() {
    const target = state.userElo + CHALLENGE_OFFSET;

    // Build candidate list, excluding recently seen
    const candidates = QUESTION_BANK.filter(q => !state.recentIds.includes(q.id));
    const pool = candidates.length > 0 ? candidates : QUESTION_BANK;

    // Compute weights
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
    document.getElementById('elo-display').textContent  = state.userElo;
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

    document.getElementById('topic-tag').textContent    = currentQuestion.topic;
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

    // Disable all buttons
    buttons.forEach(btn => (btn.disabled = true));

    // Mark correct and selected
    buttons[currentQuestion.answer].classList.add('correct');
    if (!correct) {
        buttons[choiceIndex].classList.add('incorrect');
    }

    // Update streak
    if (correct) {
        state.streak++;
        state.totalCorrect++;
    } else {
        state.streak = 0;
    }
    state.totalAnswered++;

    // Update recent buffer
    state.recentIds.push(currentQuestion.id);
    if (state.recentIds.length > RECENT_BUFFER) {
        state.recentIds.shift();
    }

    // Elo updates
    const qElo = state.questionElos[currentQuestion.id] ?? currentQuestion.elo;
    const exp   = expectedScore(state.userElo, qElo);
    const actual = correct ? 1 : 0;

    const newUserElo = newElo(state.userElo, actual, exp, USER_K, USER_ELO_MIN, USER_ELO_MAX);
    const newQElo    = newElo(qElo, 1 - actual, 1 - exp, QUESTION_K);

    const eloDelta = newUserElo - state.userElo;
    state.userElo = newUserElo;
    state.questionElos[currentQuestion.id] = newQElo;

    updateHeader();
    saveState();

    // Small delay so user sees the button highlight before transition
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
        card.className    = 'feedback-card correct';
        icon.textContent  = '✓';
        heading.textContent = 'Correct!';
    } else {
        card.className    = 'feedback-card incorrect';
        icon.textContent  = '✗';
        heading.textContent = 'Not quite.';
    }

    explain.textContent = currentQuestion.explanation;

    const sign = eloDelta >= 0 ? '+' : '';
    change.textContent  = `Rating: ${state.userElo}  (${sign}${eloDelta})`;
    change.className    = `elo-change ${eloDelta >= 0 ? 'gain' : 'loss'}`;

    showScreen('feedback');
}

// ── Event listeners ───────────────────────────────────────────────────────────
document.getElementById('start-btn').addEventListener('click', () => {
    loadQuestion();
});

document.getElementById('continue-btn').addEventListener('click', () => {
    loadQuestion();
});

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
