const Converter = require('./converter.js');
const assert = require('assert');

console.log('--- RUNNING COMPREHENSIVE CONVERTER TEST SUITE ---');

// Test 1: User's Exact Prompt Case
const userInput = `* **Protons ($p^+$)**: Positively charged particles located within the central atomic nucleus. Each proton carries an absolute charge of $+1.6022 \\times 10^{-19}\\text{ C}$ (relative atomic charge of $+1$).
* **Neutrons ($n^0$)**: Uncharged neutral particles located within the nucleus alongside protons. They possess no electric charge ($0\\text{ C}$).
* **Electrons ($e^-$)**: Negatively charged particles revolving around the central nucleus. Each electron carries an absolute charge of $-1.6022 \\times 10^{-19}\\text{ C}$ (relative atomic charge of $-1$).

The total mass of an atom is concentrated almost entirely within its dense, central nucleus, while revolving electrons occupy the peripheral regions surrounding the nucleus.

| Subatomic Particle | Symbol | Absolute Charge ($\\text{C}$)        | Relative Charge | Nucleus / Orbit Location |
| ------------------ | ------ | ------------------------------------ | --------------- | ------------------------ |
| **Proton**         | $p^+$  | $+1.6022 \\times 10^{-19}\\text{ C}$ | $+1$            | Inside Nucleus           |
| **Neutron**        | $n^0$  | $0\\text{ C}$                        | $0$             | Inside Nucleus           |
| **Electron**       | $e^-$  | $-1.6022 \\times 10^{-19}\\text{ C}$ | $-1$            | Outside Nucleus (Orbits) |`;

const asciiOutput = Converter.convert(userInput, { mode: 'ascii' });
console.log('[Test 1] ASCII Mode Output:');
console.log(asciiOutput);

assert(asciiOutput.includes('Protons (p^+): Positively charged particles located within the central atomic nucleus. Each proton carries an absolute charge of +1.6022*10^(-19) C (relative atomic charge of +1).'), 'Bullet 1 failed');
assert(asciiOutput.includes('Neutrons (n^0): Uncharged neutral particles located within the nucleus alongside protons. They possess no electric charge (0C).'), 'Bullet 2 failed');
assert(asciiOutput.includes('Electrons (e^-): Negatively charged particles revolving around the central nucleus. Each electron carries an absolute charge of -1.6022*10^(-19) C (relative atomic charge of -1).'), 'Bullet 3 failed');
assert(asciiOutput.includes('Subatomic Particle\tSymbol\tAbsolute Charge (C)\tRelative Charge\tNucleus / Orbit Location'), 'Table header failed');
assert(asciiOutput.includes('Proton\tp^+\t+1.6022*10^(-19) C\t+1\tInside Nucleus'), 'Table row 1 failed');
assert(asciiOutput.includes('Neutron\tn^0\t0C\t0\tInside Nucleus'), 'Table row 2 failed');
assert(asciiOutput.includes('Electron\te^-\t-1.6022*10^(-19) C\t-1\tOutside Nucleus (Orbits)'), 'Table row 3 failed');
console.log('✓ Test 1 Passed: Exactly matches user prompt output!');

// Test 2: Unicode Mode (Image 2 style)
const unicodeOutput = Converter.convert(userInput, { mode: 'unicode' });
console.log('\n[Test 2] Unicode Mode Output:');
console.log(unicodeOutput);
assert(unicodeOutput.includes('p⁺'), 'Unicode p⁺ failed');
assert(unicodeOutput.includes('n⁰'), 'Unicode n⁰ failed');
assert(unicodeOutput.includes('e⁻'), 'Unicode e⁻ failed');
assert(unicodeOutput.includes('10⁻¹⁹'), 'Unicode 10⁻¹⁹ failed');
console.log('✓ Test 2 Passed: Beautifully matches Image 2 unicode format!');

// Test 3: Math formulas, Greek letters, Fractions, Square Roots
const mathCases = [
  { input: '$\\frac{1}{2} + \\frac{x + 1}{y - 1}$', expected: '1/2 + (x + 1)/(y - 1)' },
  { input: '$\\alpha + \\beta = \\theta$', expected: 'α + β = θ' },
  { input: '$\\sqrt{x^2 + y^2}$', expected: 'sqrt(x^2 + y^2)' },
  { input: '$x \\le y$ and $a \\ge b$ and $c \\ne d$', expected: 'x ≤ y and a ≥ b and c ≠ d' },
  { input: '$$E = mc^2$$', expected: 'E = mc^2' }
];

mathCases.forEach((c, idx) => {
  const res = Converter.convert(c.input, { mode: 'ascii' }).trim();
  console.log(`[Test 3.${idx+1}] Input: ${c.input} => Output: ${res}`);
  assert.strictEqual(res, c.expected);
});
console.log('✓ Test 3 Passed: All math formulas converted cleanly!');

// Test 4: Text Analysis
const stats = Converter.analyzeText(userInput);
console.log('\n[Test 4] Document Analysis:', stats);
assert(stats.formulas >= 6, 'Formulas count check failed');
assert(stats.tables === 1, 'Table count check failed');
assert(stats.words > 50, 'Word count check failed');
console.log('✓ Test 4 Passed: Analysis stats accurate!');

// Test 5: Microsoft Word HTML Generation (No $ signs, real table & list markup)
const wordHtml = Converter.convertToWordHtml(userInput);
console.log('\n[Test 5] Word HTML Output:');
console.log(wordHtml);

assert(!wordHtml.includes('$'), 'CRITICAL: Word HTML must NOT contain any $ sign!');
assert(wordHtml.includes('<table'), 'Must contain <table> tag for Word');
assert(wordHtml.includes('>Subatomic Particle</th>'), 'Must contain table headers');
assert(wordHtml.includes('>p⁺</td>'), 'Must contain p⁺ symbol in table cell');
assert(wordHtml.includes('>+1.6022 * 10⁻¹⁹ C</td>'), 'Must contain scientific notation without $');
assert(wordHtml.includes('>0C</td>'), 'Must contain 0C without $');
assert(wordHtml.includes('<strong>Protons (p⁺)</strong>'), 'Must format bullet bold title with p⁺');
assert(wordHtml.includes('<ul style='), 'Must format native bullet lists for Word');
console.log('✓ Test 5 Passed: Zero $ signs, genuine Word tables & lists generated!');

console.log('\n🎉 ALL TESTS PASSED WITH 100% SUCCESS!');
