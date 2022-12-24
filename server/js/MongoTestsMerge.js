const mergeBase = [
  {
    n: 't',
    a: 'v1',
    b: 'v1',
    c: 'v1',
    d: 'v1',
    e: 'v1',
    f: 'v1',
    g: 'v1',
    h: 'v1',
    i: 'v1'
  },
]

const mergeMutationA = [
  {
    n: 't',
    a: 'v1', // opA: keep
    b: 'v1', // opA: keep
    c: 'v1', // opA: keep
    d: 'v2', // opA: change
    e: 'v2', // opA: change
    f: 'v2', // opA: change
    // g     // opA: remove
    // h     // opA: remove
    // i     // opA: remove
    j: 'v1', // opA: add
  }
]

const mergeMutationB = [
  {
    n: 't',
    a: 'v1', // opB: keep
    b: 'v3', // opB: change
    // c     // opB: remove
    d: 'v1', // opB: keep
    e: 'v3', // opB: change
    // f     // opB: remove
    g: 'v1', // opB: keep
    h: 'v3', // opB: change
    // i     // opB: remove
    k: 'v1', // opB: add
  }
]

const mergeResult = [
  {
    n: 't',
    a: 'v1', // opA: keep       opB: keep     use B
    b: 'v3', // opA: keep       opB: change   use B
    // c     // opA: keep       opB: remove   rem
    d: 'v2', // opA: change     opB: keep     use A
    e: 'v2', // opA: change     opB: change   use A
    // f     // opA: change     opB: remove   rem
    // g     // opA: remove     opB: keep     rem
    // h     // opA: remove     opB: change   rem
    // i     // opA: remove     opB: remove   rem
    j: 'v1', // opA: add        opB: ''       use A
    k: 'v1', // opA: ''         opB: add      use B
  }
]

module.exports = {
  mergeBase,
  mergeMutationA,
  mergeMutationB,
  mergeResult,
}

// helperArray: [
//   {
//     nId: [
//       {
//         npId: {
//           opA
//           opB
//           valA
//           valB
//         }
//       }
//     ]
//   }
// ]
// pipeline stage 1: iterate on mutationA to fill this structure (opA, valA)
// pipeline stage 2: iterate on mutationB to fill this structure (opB, valB)
// pipeline stage 3: iterate through helperStructure to gain results
// pipeline stage 4: cleanup
