pragma circom 2.0.0;

include "node_modules/circomlib/circuits/comparators.circom";

template AgeCheck() {
    // Private input: Your actual age
    signal input age;
    
    // Public input: The minimum age required (e.g., 18)
    signal input ageLimit;
    
    // The comparator component (checks if age >= ageLimit)
    // 252 is the number of bits our numbers can take
    component greaterEq = GreaterEqThan(252);
    greaterEq.in[0] <== age;
    greaterEq.in[1] <== ageLimit;
    
    // The output MUST be 1 (true). If it's 0 (false), the circuit constraints fail.
    greaterEq.out === 1;
}

// age is private, ageLimit is public
component main {public [ageLimit]} = AgeCheck();
