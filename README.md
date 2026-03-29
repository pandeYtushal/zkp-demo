# Zero-Knowledge Proof (ZKP) Age Verification dApp

This project demonstrates a real-world, privacy-preserving Smart Contract using Zero-Knowledge Proofs (zk-SNARKs). 

**Scenario:** A DeFi protocol requires users to prove they are at least 18 years old to access restricted features. Instead of revealing their actual birthdate on the public blockchain, users generate a mathematical proof locally. The Smart Contract verifies this cryptographic proof without ever learning the user's actual age.

---

## Project Architecture & Files

This project is composed of three massive cryptographic layers working together:

1. **`age_check.circom`** (The Circuit Rulebook)
   - This file determines the constraints. It mathematically dictates: `age >= ageLimit`.
   - We compile this file to generate WebAssembly (`.wasm`) code and a Rank-1 Constraint System (`.r1cs`).

2. **`circuit_final.zkey` & `verification_key.json`** (The Cryptographic Keys)
   - We ran a multiphase "Trusted Setup" (Powers of Tau) to generate these keys.
   - The `.zkey` (Prover Key) is used by exactly the user's local machine to encrypt their age into a proof.
   - The `.json` (Verification Key) is used by the Smart Contract to verify the proof.

3. **`generate_proof.js`** (The Off-Chain Prover Script)
   - This Node.js script acts as the "Frontend" or "User Wallet".
   - It asks the user for their secret age interactively.
   - It uses `snarkjs` to generate a proof and translates the payload into an array format `[a, b, c, input]` that the Solidity smart contract can directly understand.

4. **`Verifier.sol`** (The On-Chain Smart Contract)
   - This is an auto-generated Solidity contract that parses the massive cryptographic hashes emitted by the Prover script.
   - It executes elliptic curve pairing checks on the Ethereum blockchain to mathematically guarantee the proof is valid.

---

## Setup Instructions for a New User
If you send this folder to a teacher/friend (or move to a new laptop), they **DO NOT** need to go through the complex mathematical "Trusted Setup" phase again! Since the `circuit_final.zkey` and `age_check.wasm` are already generated, they only need to:

1. **Install Node.js** (Download from nodejs.org)
2. Open the terminal inside this folder and run:
   ```bash
   npm install
   ```
   *(This downloads the `snarkjs` cryptography library)*
3. You are done! You can immediately skip to **Step 1** below.

---

## How to Run the Project (For Viva Presentation)

Follow these exact steps to flawlessly demonstrate the Zero-Knowledge property of the algorith.

### Step 1: Run the Off-chain Proof Generation
Open your terminal (VS Code or PowerShell) in this directory and execute the interactive generation script:

```bash
node generate_proof.js
```

1. The script will pause and prompt you: **`Enter Age:`**
2. **Success Case**: Type an age $\ge$ 18 (like `25`). The script will successfully do the heavy cryptography, printing massive arrays for `_pA`, `_pB`, and `_pC`.
3. **Failure Case**: Type an age < 18 (like `15`). The constraints of the Circom circuit will physically reject the algorithm, throwing a clean "PROOF FAILED" error. This proves that fake proofs cannot be generated.

### Step 2: Deploy the Smart Contract Verifier
Now we shift to the blockchain to verify the arrays generated in Step 1.

1. Open your browser and go to [Remix IDE (remix.ethereum.org)](https://remix.ethereum.org).
2. Create a new file called `Verifier.sol` in Remix and copy-paste the entire code from our local `Verifier.sol` file into it.
3. Compile the contract in Remix (Ctrl+S).
4. Go to the **Deploy & Run Transactions** tab and click the blue **Deploy** button.

### Step 3: Verify the Cryptographic Proof On-Chain
1. In Remix, look at the bottom-left under **Deployed Contracts**.
2. Expand the `Groth16Verifier` contract by clicking the tiny right-arrow (`>`).
3. You will see an orange function called **`verifyProof`**. Click the downward-arrow to expand its 4 input fields (`_pA`, `_pB`, `_pC`, `_pubSignals`).
4. Look at the terminal output from `node generate_proof.js` in your VS Code.
5. Copy each generated array extremely carefully and paste them directly into the 4 corresponding boxes in Remix.
6. Click the **`transact`** (or `call`) button in Remix!

### Step 4: The Result
Look in the very bottom right terminal console of Remix. Expand the transaction output:
- It will say **`0: bool: true`**.

This means the blockchain successfully verified that the user is 18+ purely through cryptographic math, without the number 25 ever touching the blockchain!
