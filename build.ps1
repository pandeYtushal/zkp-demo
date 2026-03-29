.\circom.exe age_check.circom --wasm --r1cs -o ./

Write-Host "Circuit compiled."
node age_check_js/generate_witness.js age_check_js/age_check.wasm input.json witness.wtns

Write-Host "Witness generated. Starting Trusted Setup Phase 1..."
npx snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
npx snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First" -v -e="random entropy string one"

Write-Host "Phase 2..."
npx snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
npx snarkjs groth16 setup age_check.r1cs pot12_final.ptau circuit_0000.zkey
npx snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey --name="Second" -v -e="random entropy string two"

Write-Host "Exporting Verification Key and Smart Contract..."
npx snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
npx snarkjs zkey export solidityverifier circuit_final.zkey Verifier.sol

Write-Host "Running custom Proof Generation Script..."
node generate_proof.js
