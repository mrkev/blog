---
modified: 2024-08-10T02:52:38.212Z
---

I saw this tweet recently, and thought I'd write about where the limits of inference in typechecking lie. I answered the tweet but seeing as I haven't written a post recently, it seemed like a good excuse to put some hypothetical ink on some hypothetical paper.

I'm no typechecking expert, but through conversations I've had with members of the [flow](https://flow.org) team, and my own limited experience studying PL and writing a compiler in school, I have a notion of four big challenges that show up when "infering everything". Aptly, they can be classified into two categories, I broadly will call "performance" and "expectations".

## Performance

We can take this example by the same author as the tweet above to get a sense of what we'd want, and to see where things get tricky;

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I really wish TypeScript could infer parameter types based on how they&#39;re used within the function scope. <a href="https://t.co/E4yqH0Fl8i">pic.twitter.com/E4yqH0Fl8i</a></p>&mdash; Haz (@diegohaz) <a href="https://twitter.com/diegohaz/status/1412749007106064384?ref_src=twsrc%5Etfw">July 7, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Using this here example, the type of `plus10` depends on the type of `sum`. We can consider this one edge in a dependency graph that is directed but not acyclic.

### 1. Depth

I'll loosely describe the first performance challenge as stemming from **depth**. We can say graph formed by the dependence of `plus10` on `sum` has depth `1`. If sum had dependencies, fully typechecking `plus10` would requires to traverse the graph two levels down, depth `2`. If those dependencies had dependencies, that's a depth of `3`.

We quickly see this is a tree, and with each subsequent level of depth not only more complexity is a possibility (because each dependency _can_ have any number of dependencies) but we also increase the likeleyhood of depending on "slower edges". If a function lives in anohter file, we have to wait for I/O and parsing on that file to be able to use it, for example.

### 2. Breath

If depth looks "down" at dependencies, I'll loosely describe the second performance challenge as stemming from **breath**, looking "up"[1].

Imagine you edit a function that is depended upon by `n` other functions. Each of those could be depended upon by `n` others functions, and so forth. One change can have immense ramifications!

When looking "down" at _depth_ caching is an easy solution. All of the recursive dependencies of the expression you're editing are unlikely to change. When looking "up" at _breath_, chaching is rather ineffective. Your change could in theory lead to a type error on any dependant.

It is true that with the right heuristics one can cut down on checking everything "down" or "up", but heuristics alone can at most amortise these issues of time complexity, not definitieley solve them. A bad case wouldn't be to rare too. If one consideres both that this isn't an acyclic graph, and that pretty much all code in an app codebase is by defintion used by the app, it's easy to see how as the app grows so grow the probablity of changes that affect a lot of nodes, and the probability of clusters where editing one node necesitates checking a large number of other nodes, every time.

[1]: Let's be real, the names for **breath** and **depth** above could be interchanged without a hitch. At the end of the day, they're issues of stemming `VxN`

## Expectations

For the next group of issues, once again lets look at this example:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I really wish TypeScript could infer parameter types based on how they&#39;re used within the function scope. <a href="https://t.co/E4yqH0Fl8i">pic.twitter.com/E4yqH0Fl8i</a></p>&mdash; Haz (@diegohaz) <a href="https://twitter.com/diegohaz/status/1412749007106064384?ref_src=twsrc%5Etfw">July 7, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Looking at `sum` here, one might expect it to be of type `(a: number, b: number) => number`, but in reality `+` works with 2 `string`s too. Or with a `string` and a `number`. The type for `sum`, perhaps unexpectedly at first, would actually be:

```typescript
type SumFn = (a: number | string, b: number | string) => number | string;
```

### 3. Introspection

Imagine a complex app with 1 million functions; this is in no way out of the realm of possibility, and is in fact quite attainable. As you're working on this app, you call a function that should only return a `Coffee` object, but to your suprise it can also returns a `Drink`, `Promise`, a `number`, `null` and `undefined`. Why?

You notice the function has 5 different code paths based on some paramenters, each of which returns the result of a different function. The first one is adding the `Promise`, and after digging deeper you realize you didn't `await` where you should. You dig deep on another codepath, but are unsure exactly where `number` is being added. You suspect `undefined` is coming from a function where you forgot to return from a specific code path.

Quickly, what should've been a simple change becomes a hunt. Without explict types, the only way to understand where a type is coming from is digging, until you find the spot that challenges your expectations. This is not only an issue of development speed. If there's any spot in the application where constraints for a type aren't enforced by a function call that expects a tight set of kinds, these unexpectedly-wide types get shipped. At best, in a language with `any`, this is a bug. At worst, nothing breaks, but you lose the ability to enforce tight interface design. This brings me to the last point.

### 4. Expressiveness

Without a way to say "I want `sum` to only work with `number`s", you end up having to handle all cases, for all data types that could be handled by a function, all the time.

In this example above, you have to handle `sum` returning a `string`. Other cases are more complex. The ability to design interfaces purposefully is one of the biggest advantages of having types in the first place, but opting for full inference gets rid of this.

## Wrapping it up

[Flow](https://flow.org) is called so becuase it's design is based on the idea of having types "flow" from one expression to the other: it has a very powerful inference engine. For a long time this was very useful, in a codebase that was in its majority untyped javascript, only just starting to slowly be migrated to flow, and developers who weren't used to writing types with their code.

Eventually however, they had to enforce explicit types at certain boundaries, not because it the system couldn't infer them, but because computers and people couldn't handle the performance and cognitive costs of not having them.

Where and how much to infer can certainly be be further fine tuned and improved to what computers and people need and what language features allow. But full inference is both difficult and probably undesirable, especially in the medium to short term, and certainly as applications grow.

<!-- https://twitter.com/aykev/status/1656079874463879170  -->
