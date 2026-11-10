import React from 'react';

const FINANCE = (
  <>
    <p>
      <strong>Worked example.</strong> $10,000 at 7% compounded annually for 10 years:
      10,000 × (1.07)<sup>10</sup> = <strong>$19,671.51</strong>. The 7% is the annual
      rate and 10 is the number of compounding periods — if compounding is monthly, use
      120 periods at 7%/12 each.
    </p>
    <p>
      <strong>Why it matters.</strong> Small changes in rate or period compound
      dramatically: bumping 7% to 9% over the same 10 years raises the result to
      $23,673.64, a 20% higher future value. Match the period to the compounding
      frequency before comparing quotes.
    </p>
  </>
);

const MATH = (
  <>
    <p>
      <strong>Worked example.</strong> To find 17 × 23: 17 × 20 + 17 × 3 = 340 + 51 =
      <strong>391</strong>. Splitting the multiplier into tens and units makes the
      arithmetic checkable in your head — if the result doesn't match the estimate of
      400, re-check the carry.
    </p>
    <p>
      <strong>Why it matters.</strong> The same decomposition underlies most
      mental-math shortcuts: 99 × 47 → 100 × 47 − 47 = 4,653. Building the habit of
      breaking one factor apart turns slow long multiplication into a two-step check
      you can do in a queue.
    </p>
  </>
);

const HEALTH = (
  <>
    <p>
      <strong>Worked example.</strong> A 70 kg adult at 1.6 g protein per kg:
      70 × 1.6 = <strong>112 g protein per day</strong>. Split across four meals
      that's 28 g each — roughly a palm-sized portion of chicken, three eggs, or 200 g
      Greek yoghurt per meal.
    </p>
    <p>
      <strong>Why it matters.</strong> Hitting a daily total matters more than meal
      timing, but spacing protein evenly helps adherence and muscle protein synthesis.
      If you're cutting calories, keep protein near the top of your range to preserve
      lean mass.
    </p>
  </>
);

const UNIT = (
  <>
    <p>
      <strong>Worked example.</strong> To convert 5 miles to kilometres, multiply by
      1.60934: 5 × 1.60934 = <strong>8.0467 km</strong>. The conversion factor goes
      the other way too — divide kilometres by 1.60934 to get miles. Round only the
      final answer; rounding intermediate values introduces drift.
    </p>
    <p>
      <strong>Why it matters.</strong> Most unit-conversion errors come from
      multiplying when you should divide (or vice versa). Sanity-check by direction:
      a mile is longer than a kilometre, so the km number should be larger than the
      mile number.
    </p>
  </>
);

const BLOCKS = {
  finance: FINANCE,
  math: MATH,
  health: HEALTH,
  'unit-conversion': UNIT,
};

export default function CalculatorExtras({ category, context }) {
  const block = BLOCKS[category];
  if (!block) return null;
  return (
    <section className="calculator-extras" aria-label="Worked examples">
      <h2>Worked examples</h2>
      {block}
      {context ? <p>{context}</p> : null}
    </section>
  );
}