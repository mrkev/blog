---
created: 2024-06-18
modified: 2024-06-18
---

# Tailing Commas

I recently migrated a codebase at work to use trailing commas (in this the year of our lord 2024, have mercy). I liked the summary I wrote on the PR, it’s a good collection to resources reminding us why trailing commas are a good idea, plus some history of their acceptance and adoption. Here it is, below:

—

It's generally accepted that trailing commas are good practice. MDN speaks of the advantages of using it, and ultimately why they are supported by JavaScript:

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Trailing_commas

It has been the default for `prettier` since `v2.0`— you can find the long discussion that led to making them the default for lists and objects (functions arg trailing commas were not in the EcmaScript spec yet, and not widely supported) here:

- https://github.com/prettier/prettier/issues/68

In this discussion, one will find the arguments for and against trailing commas. Most notably, the arguments in favour and the reason it was made the default are that:

- They allow for clearer, more glanceable diffs
- They keep code consistent, which is good for readability and some common operations like appending or re-ordering elements in a list

More about these benefits can be read in this 2016 article by Nik Graf, linked by [Max Stoiber](https://mxstbr.com/), of `styled-components` fame:

- https://github.com/prettier/prettier/issues/68#issuecomment-271797763
- https://medium.com/@nikgraf/why-you-should-enforce-dangling-commas-for-multiline-statements-d034c98e36f8

The support for trailing commas is overwhelming because it's a good idea with real-world benefits and little to no downsides. So much so that by the time it was possible to have trading commas in function argument lists by default too (due to its addition to the spec and widespread adoption), there was no opposition to it:

- https://github.com/prettier/prettier/issues/11465
