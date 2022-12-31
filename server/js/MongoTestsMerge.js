const mergeBase = [
  {
    a: 'vo',
    n: 's',
  },
  {
    a: 'vo',
    b: 'vo',
    c: 'vo',
    d: 'vo',
    e: 'vo',
    f: 'vo',
    g: 'vo',
    h: 'vo',
    i: 'vo',
    n: 't',
  },
]

const mergeMutationA = [
  {
    a: 'vo',
    n: 's',
  },
  {
    a: 'vo', // opA: keep
    b: 'vo', // opA: keep
    c: 'vo', // opA: keep
    d: 'va', // opA: change
    e: 'va', // opA: change
    f: 'va', // opA: change
    // g     // opA: remove
    // h     // opA: remove
    // i     // opA: remove
    j: 'va', // opA: add
    n: 't',
  }
]

const mergeMutationB = [
  {
    a: 'vo',
    n: 's',
  },
  {
    a: 'vo', // opB: keep
    b: 'vb', // opB: change
    // c     // opB: remove
    d: 'vo', // opB: keep
    e: 'vb', // opB: change
    // f     // opB: remove
    g: 'vo', // opB: keep
    h: 'vb', // opB: change
    // i     // opB: remove
    k: 'vb', // opB: add
    n: 't',
  }
]

const mergeResult = [
  {
    a: 'vo',
    n: 's',
  },
  {
    a: 'vo', // opA: keep       opB: keep     use B
    b: 'vb', // opA: keep       opB: change   use B
    // c     // opA: keep       opB: remove   rem
    d: 'va', // opA: change     opB: keep     use A
    e: 'va', // opA: change     opB: change   use A
    // f     // opA: change     opB: remove   rem
    // g     // opA: remove     opB: keep     rem
    // h     // opA: remove     opB: change   rem
    // i     // opA: remove     opB: remove   rem
    j: 'va', // opA: add        opB: ''       use A
    k: 'vb', // opA: ''         opB: add      use B
    n: 't',
  }
]

module.exports = {
  mergeBase,
  mergeMutationA,
  mergeMutationB,
  mergeResult,
}
