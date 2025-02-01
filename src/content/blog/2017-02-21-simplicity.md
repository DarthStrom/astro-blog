---
title: "The Virtue of Simplicity"
description: ""
pubDate: "2017-02-21"
---

> Simplicity is a great virtue but it requires hard work to achieve it and education to appreciate it. And to make matters worse: complexity sells better.
> -Edsger Dijkstra

You are probably smarter than me. You can figure out how a complex system works in order to solve the task at hand and then move on. You run the risk of leaning on your ability to the point where you are blind to the complexity you are leaving behind for others (or your future self).

At some point you will reach your limit, and the longer that takes the harder the adjustment will be. What happens then depends on how well you managed complexity before you needed to.

## The Curse

There are two types of complexity that will be part of your system: Inherent and Incidental. Inherent is required - it is fundamental to the problem you are trying to solve. Incidental is optional and we can work to reduce it so we can concentrate on solving the real problem.

### Familiarity Hides Complexity

Inheritance, loops, language syntax, state. These are some of the things that add complexity but we don't recognize it because we are familiar with them. We often confuse familiarity with simplicity, or unfamiliarity with complexity.

Here we have a loop that iterates through a list of people, checks if they are a pilot, and if so calls a function to calculate their aptitude and appends it to a variable outside the loop that represents a report of aptitudes. Then once all that is done we can use the report variable to get the full report.

```swift
var loopReport = ""
for person in people {
    if person.isPilot {
        let apt = aptitude(person: person)
        loopReport += "\(Int(apt))apt "
    }
}

// loopReport = "9009apt 3990apt 420apt "
```

Pretty simple right? WRONG

We have to mentally keep track of this process and the state of `loopReport` as it progresses. We'll revisit this later, but for now let's ponder the wisdom of the sages.

> We need to define the problem instead of the procedures.
> -Grace Hopper

> Instead of imagining that our main task is to instruct a computer what to do, let us concentrate rather on explaining to human beings what we want a computer to do.
> -Donald Knuth

> Our intellectual powers are rather geared to master static relations and that our powers to visualize processes evolving in time are relatively poorly developed.
> -Edsger Dijkstra

### Understanding the System

How often can you be sure your program is correct? All the tests pass? Have you ever had to change a test? A bug in the field passed the type checker and all the tests.

Complexity inhibits understanding. Intertwined things must be considered together. We can only understand a few things at a time - have you ever been cmd-clicking through a program only to forget what you were initially trying to understand?

Changes require analysis and decisions. Understanding the program is critical for this - more than tests, type checkers, tools, or processes.

Complexity inhibits understanding; Simplicity enables change.

### Swimming Upstream

Real world pressures encourage complexity.

The terms "sprint" and "commitment" focus on the short term. I prefer to think in terms of "iterations" and "estimates" to make mental room for a sustainable pace.

It is hard to see the future benefits of spending mental energy on making things simple early, then we end up being stuck with decisions we made when we knew the least.

Now you're in the spaghetto.

Simplicity is a choice. It requires vigilance and hard work. Value is gained when the difficulty is up front avoiding complexity instead of long-term dealing with complexity.

> How do we convince people that in programming simplicity and clarity... are not a dispensable luxury, but a crucial matter that decides between success and failure?
> -Edsger Dijkstra

> Simplicity does not precede complexity, but follows it.
> -Alan Perlis

## Smells / Dangers

You might be in the spaghetto if...

- you find yourself frequently using the debugger instead of reading the code
- you start "trusting" your pair because she seems to know what the hell is going on and you don't want to interrupt her flow
- you take the code home with you because you feel bad about how much time it would take to understand during the day

### Premature Abstraction

Abstraction has a cost. Not only should our code be technically easy to change, it should be mentally easy to change.

For example, we could have a nicely factored system for printing out the 99 Bottles of Beer song as follows:

```swift
class BeerSong {

    var lyrics: String {
        return (0...99).reversed().reduce("") { $0 + verse(number: $1) }
    }

    func verse(number: Int) -> String {
        return Verse(number: number).description
    }
}

class Verse {
    let number: Int

    var container: Container {
        return Container(number: number)
    }

    var next: Container {
        let nextNumber = (number + 99) % 100
        return Container(number: nextNumber)
    }

    var description: String {
        return
            "\(container.number.capitalized) bottle\(container.plural) of beer on the wall, " +
            "\(container.number) bottle\(container.plural) of beer.\n" +
            container.refill +
            "\(next.number) bottle\(next.plural) of beer on the wall.\n"
    }

    init(number: Int) {
        self.number = number
    }
}

class Container {
    private let n: Int

    var number: String {
        return n == 0 ? "no more" : n.description
    }

    var plural: String {
        return n == 1 ? "" : "s"
    }

    var refill: String {
        if n == 0 {
            return "Go to the store and buy some more, "
        } else {
            return "Take \(one) down and pass it around, "
        }
    }

    private var one: String {
        return n == 1 ? "it" : "one"
    }

    init(number: Int) {
        self.n = number
    }
}
```

This version is very adaptable to change, but if we don't have to change yet then the following version is much easier to understand despite a bit of duplication.

```swift
class BeerSong {

    var lyrics: String {
        return (0...99).reversed().reduce("") { $0 + verse(number: $1) }
    }

    func verse(number: Int) -> String {
        switch number {
        case 0:
            return "No more bottles of beer on the wall, no more bottles of beer.\n" +
                   "Go to the store and buy some more, 99 bottles of beer on the wall.\n"
        case 1:
            return "1 bottle of beer on the wall, 1 bottle of beer.\n" +
                   "Take it down and pass it around, no more bottles of beer on the wall.\n"
        case 2:
            return "2 bottles of beer on the wall, 2 bottles of beer.\n" +
                   "Take one down and pass it around, 1 bottle of beer on the wall.\n"
        default:
            return "\(number) bottles of beer on the wall, \(number) bottles of beer.\n" +
                   "Take one down and pass it around, \(number - 1) bottles of beer on the wall.\n"
        }
    }
}
```

### Bad Abstraction

We also need to be careful of bad abstractions. Blindly removing duplication without considering whether the modules we are coupling will actually change together and in the same way can get us into trouble.

In this example we have two employee types that happen to have the same pay rate.

```swift
class Janitor {
    let title = "Janitor"

    let pay: Decimal {
        return 40 * 8.15
    }
}

class SoftwareApprentice {
    let title = "Software Apprentice"

    let pay: Decimal {
        return 40 * 8.15
    }
}
```

If we remove the duplication with an `Employee` class, we are left with this:

```swift
class Employee {
    let pay: Decimal {
        return 40 * 8.15
    }
}

class Janitor: Employee {
    let title = "Janitor"
}

class SoftwareApprentice {
    let title = "Software Apprentice"
}
```

Now suddenly we find that Software Apprentices have a pay rate of $9 per hour so we are tempted to change the Employee class to accommodate for this.

```swift
class Employee {
    let pay: Decimal {
        let hours = 40
        if self is SoftwareApprentice {
            return hours * 9
        } else {
            return hours * 8.15
        }
    }
}

class Janitor: Employee {
    let title = "Janitor"
}

class SoftwareApprentice {
    let title = "Software Apprentice"
}
```

Yikes! We would have been better off keeping the different employee classes separate.

```swift
class Janitor {
    let title = "Janitor"

    let pay: Decimal {
        return 40 * 8.15
    }
}

class SoftwareApprentice {
    let title = "Software Apprentice"

    let pay: Decimal {
        return 40 * 9
    }
}
```

If two similar classes are more likely to change independently than together, don’t be tempted to couple them!

### The Rigidness of Inheritance

Inheritance has become the go-to method of removing duplication despite the advice of the [Gang of Four](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612/). Inheritance causes rigidity as we can see in the following example.

```swift
class Bird {
    func fly() {}
}

class Pterodactyl: Bird {
    func screech() {}
}

class Duck: Bird {
    func quack() {}
}


class Machine {
    func refuel() {}
}

class Jet: Machine {
    func cruise() {}
}

class Helicopter: Machine {
    func hover() {}
}
```

Then we get a new requirement for a robot duck that can not fly, but can quack and refuel. Argh! We'll revisit this later...

> In fact, my main conclusion after spending ten years of my life working on the TeX project is that software is hard. It’s harder than anything else I’ve ever had to do.
> -Donald Knuth

## Remedies

- Settle on a coding style (enforce with tooling if possible)
  - there's no reason to deal with the mental overhead of differing code styles
- Budget time for tech debt payoff, or it will catch up to you
- When pairing or reviewing, don't be afraid to say "Is there any way we can simplify this?"
  - You don't have to have a solution, just prompt to get both of you thinking

### Value Types

Use simple value types when you can. Most real objects just sit there, have certain properties, can be moved around and don't change. They are basically values. Replacing one with another that has identical properties makes no difference.

We already do this on the large scale. Distributed systems like the internet can't rely on machine details like memory locations.

#### Struct: The AND Type

Combine values that go together with Struct types.

```swift
func describeLocation(x: Int, y: Int) -> String {
    return "(\(x), \(y))"
}

func describeCircle(x: Int, y: Int, radius: Int) -> String {
    return "Circle at \(describeLocation(x: x, y: y)), radius: \(radius)"
}
```

Here we have an `x` and `y` that seem to belong together. Let's make a struct to house them.

```swift
struct Point {
    let x: Int
    let y: Int
}

func describeLocation(point: Point) -> String {
    return "(\(point.x), \(point.y))"
}

func describeCircle(center: Point, radius: Int) -> String {
    return "Circle at \(describeLocation(point: center)), radius: \(radius)"
}
```

#### Enum: The OR Type

Combine either/or values with Enum types.

```swift
func divide(dividend: Int, divisor: Int) -> (quotient: Int?, errorMessage: String?) {
    if divisor != 0 {
        return (dividend / divisor, nil)
    } else {
        return (nil, "Divide by zero")
    }
}
```

We are checking for an error condition and returning an error message instead of an answer in that case. Let's make an Enum to represent a value OR an error...

```swift
enum Quotient {
    case result(Int)
    case error(String)
}

func divide(dividend: Int, divisor: Int) -> Quotient {
    guard divisor != 0 else { return .error("Divide by zero") }

    return .result(dividend / divisor)
}
```

### Functional Programming

It's easier than you think. Pure functions are worry free - they have no side-effects, no notion of time, and they are easy to understand, change, and test.

At the very least, you should learn `map`, `filter`, and `reduce`.

Remember our loopReport for pilot aptitudes? With `map`, `filter`, and `reduce` it becomes:

```swift
let pilotTalentReport = people
    .filter { $0.isPilot }
    .map(aptitude)
    .reduce("") { "\($0)\(Int($1))apt " }
```

Instead of iterating through the collection of people, we are describing what we want out of it.

We want the people that are pilots (people.filter {isPilot}), their aptitudes (map(aptitude)), reduced together into a string.

If this feels less intuitive than the loop still, I promise it is because of familiarity, not simplicity. If you become familiar with `map`, `filter`, and `reduce` then you will more easily be able to tell what problem we are solving at a glance.

### Iterative Design

When practicing Test Driven Development, do some design up front to shape your tests. Make the tests act like documentation.

Then don't forget to refactor. If you feel like you are forgetting, practice regularly with katas and focus on the refactor step.

What is good design? Good design is separating into things that can be composed. Good design is also iterative, so be willing to change your design as your understanding of the problem improves.

### When to Generalize

If you are writing a new module and you are wondering whether to generalize, consider whether the module will be used a lot. If so, plan ahead and be general.

Otherwise, be specific. Travel light. Ask yourself, "What is the simplest thing that can work here?"

### Composition over Inheritance

Remember our robot duck example? We want a robot duck that can refuel and quack, but not fly. Let's refactor to use composition instead of inheritance.

```swift
protocol Bird {
    func fly()
}

extension Bird {
    func fly() {}
}

protocol Quacker {
    func quack()
}

extension Quacker {
    func quack() {}
}

struct Duck: Quacker, Bird {}

protocol Machine {
    func refuel()
}

extension Machine {
    func refuel() {}
}

struct RobotDuck: Machine, Quacker {}
```

Much easier.

## Further Learning

- [Stanford CS190 Lecture Notes](https://web.stanford.edu/~ouster/cgi-bin/cs190-spring15/lecture.php?topic=complexity)
- [Are We There Yet?](https://www.infoq.com/presentations/Are-We-There-Yet-Rich-Hickey)
- [The Value of Values](https://www.infoq.com/presentations/Value-Values)
- [Design, Composition and Performance](https://www.infoq.com/presentations/Design-Composition-Performance)
- [“How do I learn to write simpler, more efficient code with fewer lines?”](https://medium.com/humans-create-software/how-do-i-learn-to-write-simpler-more-efficient-code-with-fewer-lines-da0fe693146e#.rsigq7ban)
- [The growth stages of a programmer](https://youtu.be/2qYll837a_0?list=PL0zVEGEvSaeGPBRt-y2QZ3wh64XAe40jx)
- [Composition over Inheritance](https://youtu.be/wfMtDGfHWpA?list=PL0zVEGEvSaeGPBRt-y2QZ3wh64XAe40jx)
- [Swift and the Legacy of Functional Programming](https://realm.io/news/tryswift-rob-napier-swift-legacy-functional-programming/)
- [Simple Made Easy](https://www.infoq.com/presentations/Simple-Made-Easy)
- [Simplicity Matters](https://youtu.be/rI8tNMsozo0)
- [99 Bottles of OOP](https://www.sandimetz.com/99bottles/)
