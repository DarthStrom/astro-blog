---
title: "Extrospective: To Pair or Not To Pair"
description: ""
pubDate: "2016-05-13"
---

## Intro(spective)

I know I called this an extrospective, but first allow me to introspect a bit.

I have been programming professionally for 8 years, but have only really started trying to improve my craftsmanship for the past 3 or so. As part of that journey, I switched from a government job to consulting. My current company has a culture that values many Extreme Programming engineering practices including pair programming.

I came into the job with an open mind and the realization that pair programming would take time and effort to become comfortable with. After 2 years of pair programming full time, I am still not comfortable. In fact, it's possible I will never be comfortable with it. As an introvert, 40 hours a week of social interaction can be draining [^1]. Another contributing factor to my discomfort is impostor syndrome. One of the things I used to be able to use to combat impostor syndrome was looking back at value I had produced - this becomes more difficult if you are always working with people. If you have impostor syndrome, your mind has a way of telling you that the work could have been done without you.

Obviously, there are many merits to pair programming that make it worth overcoming these hurdles. And I much prefer the environment of "always pair" to the environment of "never pair", but I would like to take the rest of this post to explore the idea of a middle way. There must be situations where it is better to pair and other situations where it is not.

## Some Benefits

- **Fast feedback**: Pair programming is like a real time code review. Every decision you make even before you even type it in is vetted by another team member. This can save you having to redo something that made it into code review.
- **Knowledge sharing**: Two people become intimately familiar with the code and the decisions behind it. Pairing on future work can be done strategically to expand knowledge of the codebase throughout the team.
- **Collective code ownership**: If more than one person wrote every line of code, it leads to a feeling that the whole team owns the codebase.
- **Team cohesion**: The members of the team are constantly working together. This provides motivation for everyone to get along and enjoy each other's company.
- **Increased quality**: This one makes perfect sense and I had assumed it to be true, but as we'll see later there are situations where it may not be.

## Some Drawbacks

- **Learning curve**: Pair programming is a skill on its own and takes time and effort to learn to become effective at it.
- **Cost**: Having two people work on each task costs twice as much, right? Well not exactly, but we'll explore that.
- **Scheduling**: Aligning schedules can be challenging in a flexible schedule environment.
- **Can exacerbate impostor syndrome**: I mentioned this in the intro as something I struggle with. Pairing can cause a feeling of a lack of personal accomplishment.
- **Remote work more difficult**: Many people are attracted to programming for the possibility of being able to work remotely. Pair programming makes this more difficult. The tooling is getting there with things like Screenhero and tmux, but nothing beats sitting down at the same machine as your pair.
- **Not as much typing**: Most programmers enjoy coding (I suppose that's pure speculation). For those that do, pairing reduces the amount they get to code by half. Granted, the important part about programming is probably the thinking that happens before the typing. That doesn't change the fact that typing it in is enjoyable.
- **Speed mismatch**: If a pair has mismatched speeds it can lead to frustration for the person that wants to go faster or disengagement for the person that can't go as fast.
- **Limits exploration**: This may not be true for everyone, but I find myself less willing to explore a creative idea while pairing.
- **Limits tooling**: If a pair consists of an Emacs user and a Vim user then one of the two will not get to use their tool of choice. Personally, I use the Colemak keyboard layout and had to buy a special keyboard instead of being able to change the layout through software.

## Effective Pairing

Here are some things I've learned over the past two years that have helped improve the pair programming experience.

- If offered a mint by your pair partner, take it. It might not be a hint, but better not take the chance.
- Listen to and understand suggestions. Seriously, if you aren't open to suggestions then you are **not** pair programming.
- Frequently take your hands off the keyboard. This allows your pair to take control without forcing them to.
- If you want control of the keyboard, ask. I still need to work on this one.
- Don't judge your pair. Nothing kills team cohesion like making people feel unqualified.
- Don't let your pair feel judged. Even if you aren't actually judging, small things like taking back the keyboard when the "real work" needs done can be damaging to morale.
- Verbally recognize when your pair provides value. Some people have trouble realizing when they've been helpful. Sensing a pattern here?
- Have fun, but stay on task and avoid distractions.
- Avoid sarcasm. Interpreting sarcasm takes mental energy, don't add to the effort that pairing takes.

## The effectiveness of pair programming: A meta-analysis

In 2009, a group of researchers compiled 18 studies on pair programming to produce a meta-analysis [^2]. These studies were across students and professionals in Europe and North America. The results of the meta-analysis can be summarized as effects of pair programming across three factors:

- **Quality** (number of tests passed or correct solutions): Had a small positive effect.
- **Duration** (time taken for a pair or individual): Had a medium positive effect overall, small positive effect for professionals.
- **Effort** (duration for solo, 2x duration for pairs - cost essentially): Had a medium negative effect overall, significant negative effect for professionals.

One study out of the 18 moderated for expertise and complexity. This gives us a better picture of how pair programming affects these different situations.

| Complexity | Quality | Effort |
| :--------- | ------: | -----: |
| Easy       |    -16% |    60% |
| Complex    |     48% |   112% |

| Expertise    | Quality | Effort |
| :----------- | ------: | -----: |
| Junior       |     73% |   111% |
| Intermediate |      4% |    43% |
| Senior       |     -8% |    83% |

| Combined             | Quality | Effort |
| :------------------- | ------: | -----: |
| Easy/Junior          |     32% |   109% |
| Easy/Intermediate    |    -29% |    22% |
| Easy/Senior          |    -13% |    55% |
| Complex/Junior       |    149% |   112% |
| Complex/Intermediate |     92% |    68% |
| Complex/Senior       |     -2% |   115% |

There are some interesting results here. They found that quality actually goes down with more senior pairs and on easier tasks. Also, effort is always increased by varying degrees but where the effort is increased by more than 100% the duration is also increased (meaning the pair would actually take longer than a solo).

There are other factors as well. The type of task (i.e. new development, well understood tasks, spikes, bug fixes, devops) or personality type of the people. There is also the matter of mixing junior developers with senior developers and the various benefits and drawbacks of that situation. My hope is that we can start to think critically about how pair programming can best be used in different situations instead of declaring it a universally good thing or universally bad thing.

## My Conclusions

- Pairing improves quality to a degree, at the cost of significantly increased effort. On the order of, for example, 7% increase in correctness and 84% increase in cost.
- Work can be done quicker by pairs than individuals if constrained by work that can be done in parallel rather than by number of developers.
- Quality increases with pairing for juniors, especially on complex tasks.
- Quality decreases with pairing for intermediates on easy tasks and increases on complex tasks.
- Quality decreases with pairing for seniors, especially on easy tasks.
- Effort is increased with pairing to varying degrees.
- Duration is reduced with pairing for intermediate developers on easy and complex tasks.
- Duration is reduced with pairing for senior developers on easy tasks.
- This is a complex set of variables - we should be thinking about the tradeoffs and how they align to the needs of the business.
- It's lazy to never pair
- It's lazy to always pair
- Pairing is a tool, not a commandment
- Less pressure makes pairing more enjoyable
- If someone asks to pair with you, say yes! You will learn from them and you will help to create a flexible environment where people feel empowered to work in whatever way is best for the project.

[^1]: See [Quiet: The Power of Introverts in a World That Can't Stop Talking](http://www.amazon.com/gp/product/0307352153/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0307352153&linkCode=as2&tag=darth07-20&linkId=LJ45SNCXPSVLSXKQ)
[^2]: [The effectiveness of pair programming: A meta-analysis](http://dl.acm.org/citation.cfm?id=1539606#.VzPW_fb2bc8.link)
