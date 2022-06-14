var your_bustadice_username = "username";

var config = {
    globalHeader: { label: "Premium Bustadice Script", type: "noop" },
    risk_factor: { label: "Skip Factor", type: "multiplier", value: 1.0 },
    baseBet: { label: "Base Bet", type: "balance", value: 100 },
    multiHeader: { label: "BustadiceScript.com", type: "noop" },
    targets_arr: { label: "~MinX-MaxX", type: "text", value: "~5-30" }, /* Usage: '=5:15, 10:20, 30, 40:100, 200', if starts with '~3-100' then it will make range of these tartgets */
    minProfit: { label: "Stop on L", type: "balance", value: -750000 },
    maxProfit: { label: "Stop on W", type: "balance", value: 1250000 },
}

var max_rollss = -1;
var risk_multiplierr = 0.0001;
var basebet_percent_amountt = -1;
var risk_basee = 1;
var targett = 20;
var stww = 40;

var rules = {
    risk_factor: config.risk_factor.value,          /* Global setting, change amount of leap for all targets, lowering amount will make shorter leap [Multiply] */
    risk_multiplier: risk_multiplierr,  /* Global setting, change multiplier size for all targets [Added to original multiplier] */
    risk_base: risk_basee,              /* Global setting, change bet size for all targets [Multiply] */
    interval: 1,                                    /* Interval in milliseconds between bets */
    skip_enabled: true,
    auto_betting: true,                             /* On catch target start betting on it or stop script */
    multiply_classic: true,                         /* Multiply will use formula: (1 / (target - 1)) + 1 */
    DEBUG: false,

    experiment: false,                               /* Fast Bets Combination feature */
    max_rolls: max_rollss,              /* Maximal rolls per target to be made [-1 = Disable]  */
    added_iterations: 5,                            /* Amount iterations will be set when triggered [rules.experiment must be enabled] */
    iterations_target_higher: 80,
    iterations_target_lower: 4,
    iterations_risk_factor_lower: 0.5,
    difficult_game: 14,
    game_area_to_play: 4,
    quadripile: 2,
    basebet_percent: true,                                                          /* Use percent based base bet calculation or no */
    basebet_percent_amount: basebet_percent_amountt,                    /* In percent base bet will be formed from balance amount */
};





async function makeResults(num){
    let results = [];
    for(let i = 0; i < num; i++){
        results.push(Math.max(1, Math.min(1e6, Math.round((0.99 / Math.random()) * 100) / 100)));
    }
    return results;
}

function getNonce(nonce){
    return predeterminated_numbers[nonce]
}
var current_nonce = 0;
var predeterminated_numbers = makeResults(3000)
//makeRun(3000)

var wins = 0;
var loses = 0;


async function makeRun(games){
    for (let i = 0; i < games; i++){
        current_nonce += 1;
        var multiplier = predeterminated_numbers[current_nonce]
        console.log(`Outcome: ${multiplier}x`)
        if (multiplier >= 2){
            wins++;
        } else {
            loses++;
        }
        console.log(`Wins: ${wins} | Loses: ${loses}`)
        await sleep(2)
    }
}


const main = async () => {
    var skipStep = 1, rolls = 0, Strategies = [], engine = this, attempt = 0, PROFIT = 0, minProfit = config.minProfit.value, maxProfit = config.maxProfit.value,
        start_play = false, currentPayout = 1.01, currentBet = config.baseBet.value, STATES = { WAITING: -1 }, active = STATES.WAITING, runs = 0, context = this, iterations = 5;

    class Permissions {
        /* Include this line of code in main script loop before while new Permissions(this).getPermissions(this); */
        constructor () {
            this.licensing = true;              /* Enable/Disable licensing in script */
            this.expire_date = [ 36, 13, 9999 ]; /* Day-Month-Year */
            this.expire_hour = 24;              /* Expire hour 0-23 format*/
            this.usable_period_minutes = 600;

            this.script_name = `Ultimate Bustadice Script [LongTerm]`;  /* Script name, what will be showed on beginning */
            this.script_ver = 2.0;        /* Script version */
            this.script_author = `BustadiceScript.com`;  /* Author Name */
            this.contact_info = `https://discord.gg/8b2FRFTmnA`;    /* Discord Link */
            this.script_description = `Safest script made for Bustadice. If you have this script, you about to get rich.
            Helping you make profit with safest possible ratio.`;
            this.users = [``]; /* Accessed users to use script */
            this.server_time;
            this.runningMinutes = new Date().setMinutes(0);
            this.DEBUG = false;
            this.ACCESSED = false;

            try {
                this.user = userInfo.uname;
                if (this.DEBUG) console.log(`Using www.Bustabit.com`);

            } catch (e) {
                this.user = context.username;
                if (this.DEBUG) console.log(`Using www.Bustadice.com`);
            }
        }

        checkTimeLicense() {
            let license_time = `License time expired. Please contact us via Discord, ${this.contact_info}.`
            let license_date = `License expired. Please contact us via Discord, ${this.contact_info}.`

            let expired_year = false;
            let expired_month = false;
            let expired_day = false;

            let have_access = false;

            if (this.DEBUG) { console.log("Comparing date(current/expired): ", this.currentDateDay(), this.expire_date[ 0 ], " | ", this.currentDateMonth(), this.expire_date[ 1 ], " | ", this.currentDateYear(), this.expire_date[ 2 ]); }

            if (this.currentDateDay() > this.expire_date[ 0 ]) { expired_day = true; }
            if (this.currentDateMonth() > this.expire_date[ 1 ]) { expired_month = true; }
            if (this.currentDateYear() > this.expire_date[ 2 ]) { expired_year = true; }

            if (!expired_year) {
                if (!expired_year && !expired_month) {
                    if (!expired_day) {
                        have_access = true;
                    }
                }
            }
            if (have_access == false) {
                context.log(license_date);
                console.log(license_date);
                context.stop();
            }

            if (this.currentTime() > this.expire_hour) {
                context.log(license_time);
                console.log(license_time);
                context.stop();
            }
        }

        addUser(username) { this.users.push(username); }

        currentDateDay() {
            if (this.server_time == undefined) return

            var res = this.server_time.substring(this.server_time.length - 2, this.server_time.length + 1);
            var final = res
            for (let i = 0; i < 2; i++) {
                if (res[ 0 ] == "0") {
                    final = res.substring(2, 1)
                }
            }

            return Number(final)
        }

        currentDateMonth() {
            if (this.server_time == undefined) return

            let res = this.server_time.substring(5, 7);
            let final = res
            for (let i = 0; i < 2; i++) {
                if (res[ 0 ] == "0") {
                    final = res.substring(2, 1);
                }
            }
            return Number(final)
        }

        currentDateYear() {
            if (this.server_time == undefined) { return }

            return Number(this.server_time.substring(0, 4))
        }

        currentDate(eu_format = false) {
            let build_date = "";

            if (eu_format == false) {
                build_date = `${this.currentDateYear()}-${this.currentDateMonth()}-${this.currentDateDay()}`;
                if (this.DEBUG) { console.log("West date format: ", build_date); }
            } else {
                build_date = `${this.currentDateDay()}-${this.currentDateMonth()}-${this.currentDateYear()}`;
                if (this.DEBUG) { console.log("Europe date format: ", build_date); }
            }

            return build_date
        }

        async getServerTime() {
            const { timestamp } = await context.skip();
            let time_stamp = "";

            for (let i = 0; i < 10; i++) {
                time_stamp += timestamp[ i ];
            }
            this.server_time = time_stamp;
        }

        currentTime() {
            this.hours = new Date().getHours();
            this.minutes = new Date().getMinutes();

            return Number(this.hours)
        }

        updatePermissions() {
            let pass_intro = `Welcome ${this.user}! You are using ${this.script_name} v${this.script_ver}, made by ${this.script_author}. If you have any questions join our Discord, ${this.contact_info}`
            let no_access = `You don't have enough permissions to run this script. Contact us via Discord, ${this.contact_info}`
            let access = false;

            //this.checkTimeLicense();

            if (this.licensing == false) { access = true };

            for (let i = 0; i < this.users.length; i++) {
                if (this.user.toLowerCase() == this.users[ i ].toLowerCase()) {
                    access = true;
                    context.log(pass_intro);
                    console.log(pass_intro);

                    context.log(this.script_description);
                    console.log(this.script_description);
                    break;
                }
            }

            if (!access) {
                context.log(no_access);
                console.log(no_access);
                context.stop();
            }
            return access
        }
    }

    class Target {
        constructor (target, basebet, streak) {
            this.target = target;
            if (target === undefined) {
                console.clear();
                return 0
            }
            this.basebet = basebet * rules.risk_base;

            this.game_ls = 0;
            this.game_stw = this.streak;
            if (this.game_stw == 0) { this.game_stw = 1; }

            this.streak = streak;
            this.roll = 0;
            this.max_rolls = -1;

            if (basebet === undefined) {
                if (rules.basebet_percent){
                    this.basebet = getPercent(rules.basebet_percent_amount) * rules.risk_base;
                } else {
                    this.basebet = config.baseBet.value * rules.risk_base;
                }

                if (rules.DEBUG) { console.log(`this.basebet = ${this.basebet}`); }
            }
            if (streak === undefined) {
                this.streak = Math.floor(calculate_stw(target));
                if (rules.DEBUG) { console.log(`this.streak = ${this.streak}`); }
            }
            this._addPayout(this.target, streak);

            console.log(`${target}x created, with streak ${this.streak}`);
        };

        _addPayout(payout, streak) {
            if (streak === undefined) {
                this.game_stw = calculate_stw(payout);
            } else {
                this.game_stw = streak;
            }
            Strategies.push(this)

        }
        ChangeStreakToWait(value) {
            this.game_stw = value;
            this.game_ls = 0;
        }

    }

    async function fastBet(bet = 200, target = 60) {
        var rules_fastbets = {
            betAmount: bet,
            Target: target,
            queueSize: Math.ceil(target / rules.quadripile),
        }

        var betCount = 0, totalOut = 0, totalIn = 0, queue = new Array(rules_fastbets.queueSize), running = true;

        const doResult = async function (result) {
            totalIn++;
            await updateStreaks(result.multiplier, false);
            console.log(`Bet: ${rules_fastbets.betAmount / 100}, Target: ${rules_fastbets.Target}, Outcome: ${result.multiplier}x`)
            if (result.multiplier >= rules_fastbets.Target){
                PROFIT += roundBit(rules_fastbets.betAmount * (rules_fastbets.Target - 1));
                console.log(`${totalIn} | ${PROFIT / 100}: PROFIT++ ${roundBit(rules_fastbets.betAmount * (rules_fastbets.Target - 1)) / 100}`)
            } else {
                PROFIT -= roundBit(rules_fastbets.betAmount);
                console.log(`${totalIn} | ${PROFIT / 100}: PROFIT-- ${roundBit(rules_fastbets.betAmount) / 100}`)
            }

        }

        const fastbets = async function () {
            while (running) {
                for (let i = 0; i < rules_fastbets.queueSize; i++) {
                    await checkConditions();
                    queue[ i ] = engine.bet(rules_fastbets.betAmount, rules_fastbets.Target), betCount++ , totalOut++;

                    await sleep(1);
                }
                if (running) {
                    await Promise.all(queue.map(p => p.catch(e => e))).then(async (results) => {
                        await results.forEach(result => doResult(result))
                    });
                    running = !running;
                }
            }
        }
        await fastbets();
    }

    function readInputCommand() {
        //Strategies.push(new Target(undefined, undefined, undefined));
        //Strategies.shift();
        var targets_arr = config.targets_arr.value;

        if (targets_arr != "") {
            if (targets_arr.startsWith("~")) {
                readRange(targets_arr.replace("~", ""), "-");
                return
            }
            if (targets_arr == Number(0)) {
                for (let i = 3; i < 100; i = i + 3) { new Target(i); }
                for (let i = 150; i < 1000; i = i + 25) { new Target(i); }
                return
            }
            if (targets_arr.startsWith("=")) {
                readTwoArgs(targets_arr.replace("=", ""));
                return
            }
            if (targets_arr.startsWith("rules")) {
                console.log("In next update");
                return
            }

        } else {
            new Target(targett, config.baseBet.value, stww);
        }
    }

    function readTwoArgs(input, seperator_args = ":", separator_elements = ",") {
        let splits = input;
        let st_second = splits.split(seperator_args && separator_elements);
        for (let i = 0; i < st_second.length; i++) {
            let st_t = st_second[ i ];
            if (st_t.search(seperator_args) != -1) {
                let args_build = "";
                let args2_build = "";
                for (let j = st_t.search(seperator_args) + 1; j < st_second[ i ].length; j++) {
                    args_build += st_second[ i ][ j ];
                }
                for (let jy = 0; jy < st_t.search(seperator_args); jy++) {
                    args2_build += st_second[ i ][ jy ];
                }
                new Target(Number(args2_build), undefined, args_build);
            }
            if (st_second[ i ].search(seperator_args) == -1) {
                new Target(Number(st_second[ i ].trim()));
            }
        }
    }

    function readRange(input, seperator_args = "-", separator_elements = ",") {
        let splits = input;
        let st_second = splits.split(seperator_args && separator_elements);
        for (let i = 0; i < st_second.length; i++) {
            let st_t = st_second[ i ];
            if (st_t.search(seperator_args) != -1) {
                let args_build = "";
                let args2_build = "";
                for (let j = st_t.search(seperator_args) + 1; j < st_second[ i ].length; j++) {
                    args_build += st_second[ i ][ j ];
                }
                for (let jy = 0; jy < st_t.search(seperator_args); jy++) {
                    args2_build += st_second[ i ][ jy ];
                }

                let num1 = Number(args2_build);
                let num2 = Number(args_build);

                if (typeof num1 === "number" && typeof num2 === "number") {
                    for (let i = num1; i <= num2; i += num1) {
                        new Target(i, config.baseBet.value);
                    }
                } else {
                    console.log(`Error creating target [${args2_build}-${args_build}]`)
                }
            }
        }
    }

    async function updateStreaks(multiplier, logs = true) {
        let output = ``;

        for (let i = 0; i < Strategies.length; i++) {
            if (multiplier < Strategies[ i ].target) {
                Strategies[ i ].game_ls++;

            } else if (multiplier > Strategies[ i ].target) {
                Strategies[ i ].game_ls = 0;
            }
        }

        if (Strategies.length > 500) {
            output = `Too much targets(${Strategies.length}) to show logging for each`;
        } else {
            for (let i = 0; i < Strategies.length; i++) {
                output += ` | ${Strategies[ i ].target}x: ${Strategies[ i ].game_ls}/${Math.floor(Strategies[ i ].game_stw)}`;
            }
        }
        if (logs){
            await engine.clearLog();
            await engine.log(`Rolls: ${rolls} |` + output + ` || Profit ${Math.round(PROFIT / 100)} bits`);
        }
    }

    function calculate_stw(target) {
        let stw = Math.floor((target * rules.difficult_game) / rules.game_area_to_play * config.risk_factor.value);
        if (stw == 0) {
            return 1
        } else {
            return stw
        }
    }

    async function analyzeBet(context) {
        let result = rules.skip_enabled ? skipStep ? await context.bet(100, 1.01) : await context.skip() : await context.bet(100, 1.01);
        skipStep = !skipStep;
        return result
    }

    function getPercent(percent){ return roundBit(engine.balance / 100 * percent); }

    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

    function roundBit(bet) { return Math.max(100, Math.round((bet) / 100) * 100) }

    function getMul(target) { return (1 / (target - 1) + 1) + rules.risk_multiplier }

    function ChangeStreakToWaits(value) {
        for (let i = 0; i < Strategies.length; i++) {
            Strategies[ i ].ChangeStreakToWait(value);
        }
    }


    async function checkConditions(){
        let output = `Stopping due triggered min/max profit || Profit ${Math.round(PROFIT / 100)} bits`;
        if (PROFIT > maxProfit || PROFIT - currentBet < minProfit) {
            await engine.log(output);
            await engine.stop();
        }
    }

    /* --- Some initializations --- */
    if (rules.basebet_percent_amount == -1){ rules.basebet_percent = false; }

    const origBet = this.bet;
    const origSkip = this.skip;

    this.bet = async function () {

        return origBet.apply(this, arguments);
    }
    this.skip = async function () {


        return origSkip.apply(this, arguments);
    }

    var perms = new Permissions();
    perms.addUser(your_bustadice_username);
    await perms.getServerTime();
    perms.checkTimeLicense();
    perms.updatePermissions();

    readInputCommand();

    const count = 5;
    var counter = 0;
    /* ---------------------------- */

    while (true) {
        //console.log(`${counter}/${count}`)
        if (active == STATES.WAITING) { await engine.log(`Game right now in PASSIVE MODE. Total runs ${runs} Iterations ${iterations}`); }
        if (iterations > 0) {
            await fastBet(roundBit(currentBet / 2), Math.floor(currentPayout / 2));
            iterations--;
        }
        rolls++;
        if (start_play) {
            await engine.log(`Playing ${Strategies[ active ].target}x, Bet ${roundBit(currentBet) / 100}, Multiplier ${getMul(currentPayout).toFixed(2)}, Streak ${Strategies[ active ].roll}`);
            await checkConditions();
            var { multiplier } = await this.bet(roundBit(currentBet), currentPayout);

            await updateStreaks(multiplier);

            Strategies[ active ].roll += 1;

            let temp = active;
            if (rules.max_rolls != -1 && Strategies[ active ].roll >= rules.max_rolls) { /* Max rolls rules set */
                Strategies[ active ].roll = 0;
                start_play = false;
                if (iterations <= 0){
                    iterations = Math.floor(currentPayout / 2);
                }

                if (rules.basebet_percent){
                    currentBet = getPercent(rules.basebet_percent_amount) * rules.risk_base;
                } else {
                    currentBet = Strategies[ active ].basebet * rules.risk_base;
                }
                temp = active;
                active = STATES.WAITING;
            }
            if (rules.iterations_target_lower == -1 || rules.iterations_target_higher == -1) { rules.experiment = false; }

            if (multiplier < currentPayout) {
                PROFIT -= roundBit(currentBet);
                if (rules.multiply_classic == true) {
                    currentBet *= getMul(currentPayout);
                } else {
                    attempt++;
                    if (attempt == Math.round(currentPayout)) {
                        attempt = 0;
                        currentBet *= 2;
                    }
                }
            } else {
                PROFIT += roundBit(currentBet * (currentPayout - 1));
                if (rules.basebet_percent){
                    currentBet = getPercent(rules.basebet_percent_amount) * rules.risk_base;
                } else {
                    currentBet = Strategies[ temp ].basebet * rules.risk_base;
                }
                start_play = false;
                runs++;
                await engine.log(`${Strategies[ temp ].target}x Won at streak ${Strategies[ temp ].roll} roll.`);
                Strategies[ temp ].roll = 0;

                temp = STATES.WAITING;
                active = STATES.WAITING;
            }
        } else {
            if (active == STATES.WAITING)  {
                const { multiplier } = await analyzeBet(this);
                updateStreaks(multiplier)
            }
        }

        for (let i = 0; i < Strategies.length; i++) {

            if (Strategies[ i ].game_ls >= Strategies[ i ].game_stw && active == STATES.WAITING) {
                if (rules.auto_betting) {
                    start_play = true;
                    currentPayout = Strategies[ i ].target;
                    if (rules.basebet_percent){
                        currentBet = getPercent(rules.basebet_percent_amount) * rules.risk_base;
                    } else {
                        currentBet = Strategies[ i ].basebet * rules.risk_base;
                    }

                    attempt = 0;
                    Strategies[ i ].roll = 0;
                    Strategies[ i ].game_ls = 0;
                    active = i;
                } else {
                    engine.log(`${Strategies[ i ].target}x catched! Rolls ${rolls}, Streak rows ${Strategies[ i ].game_ls}/${Math.floor(Strategies[ i ].game_stw)}`);
                    engine.stop();
                }
            }
        }
        await sleep(rules.interval);
    }
}

/* Prevent script from lost connection to server */
while (true) {
    try {
        await main();
    }
    catch (error) {
        if (error.message === "connection closed") {
            engine.log("Connection closed. Restarting script");
            continue;
        } else if (error.message === "insufficient balance") {
            engine.log("Not enough balance to bet");
            engine.stop();
        } else {
            throw error;
        }
    }
}
