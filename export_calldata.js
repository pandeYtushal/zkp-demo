const snarkjs = require("snarkjs");
const fs = require("fs");

async function run() {
    const proof = JSON.parse(fs.readFileSync("proof.json", "utf8"));
    const publicSignals = JSON.parse(fs.readFileSync("public.json", "utf8"));
    const calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
    fs.writeFileSync("clean_output.txt", calldata);
}

run();
