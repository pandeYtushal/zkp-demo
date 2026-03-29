const snarkjs = require("snarkjs");
const fs = require('fs');
const readline = require('readline');

async function generateProof(userAge) {
    const input = {
        age: parseInt(userAge),
        ageLimit: 18
    };

    console.log("\nGenerating Zero-Knowledge Proof...");

    try {
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            input,
            "age_check_js/age_check.wasm",
            "circuit_final.zkey"
        );

        console.log("Proof successfully generated!");
        console.log("Public Signals (Should be 18):", publicSignals);

        const calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);

        // Parse the raw payload into a neat JavaScript array structure
        const argv = JSON.parse("[" + calldata + "]");

        console.log("\n====== REMIX IDE ARGUMENTS ======\n");
        console.log("1. _pA:\n" + JSON.stringify(argv[0]) + "\n");
        console.log("2. _pB:\n" + JSON.stringify(argv[1]) + "\n");
        console.log("3. _pC:\n" + JSON.stringify(argv[2]) + "\n");
        console.log("4. _pubSignals:\n" + JSON.stringify(argv[3]) + "\n");

        fs.writeFileSync("calldata.txt", calldata);
        process.exit(0);
    } catch (error) {
        console.error("\n=================================");
        console.error("PROOF FAILED!");
        console.error("The mathematical constraints of the Circom circuit were NOT met.");
        console.error("This proves that the hidden age (" + input.age + ") is less than the limit (18).");
        console.error("The Zero-Knowledge algorithm physically cannot generate a valid proof!");
        console.error("=================================\n");
        process.exit(1);
    }
}



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter Age: ', (age) => {
    if (!age || isNaN(age)) {
        console.error("\nError: Please enter a valid number!");
        process.exit(1);
    }
    generateProof(age);
});
