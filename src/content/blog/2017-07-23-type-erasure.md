---
title: "Swift Type Erasure"
description: ""
pubDate: "2017-07-23"
---

Type Erasure is a term that I've run across a few times as I've been developing in Swift, but have never really understood (until recently) what it is or when it can be useful. Hopefully I can change that by writing about it here!

## The Motivation

Let's start with a hypothetical situation where we have a `ForceWielder` protocol and various implementers of that protocol.

```swift
protocol ForceWielder {
    associatedtype Ability

    func attack() -> Ability
}

struct ObiWan: ForceWielder {
    func attack() -> LightsaberCombat {
        let form = "Soresu"
        print("Attacking with \(form) form")
        return LightsaberCombat(form: form)
    }
}

struct Anakin: ForceWielder {
    func attack() -> LightsaberCombat {
        let form = "Djem So"
        print("Attacking with \(form) form")
        return LightsaberCombat(form: form)
    }
}

struct Emperor: ForceWielder {
    func attack() -> ForceLightning {
        let voltage = 50
        print("Zapping with \(voltage) volts")
        return ForceLightning( voltage: voltage )
    }
}

struct ForceLightning { let voltage: Int }
struct LightsaberCombat { let form: String }
```

Now we want to take a sequence of force wielders and perform their attacks, so attempt to create the sequence:

```swift
let forceWielders: [ForceWielder] = [Anakin(), ObiWan()]
// error: protocol 'ForceWielder' can only be used as a generic constraint
// because it has Self or associated type requirements
```

Uh oh, seems like the `ForceWielder` protocol is not usable in this situation because it has an associated type. Ok, but why? The compiler is confused because there is type ambiguity in two different ways: the protocol itself can be implemented by a number of concrete types, and the associated type can also be defined as different types.

We'll try using the Type Erasure pattern to make it so that we have a new type that is generic over the `Ability` associated type, but is a concrete implementer of the `ForceWielder` protocol. Something like this:

## The Pattern

```swift
final class AnyForceWielder<Ability>: ForceWielder {

    init<Concrete: ForceWielder>(_ concrete: Concrete)
        where Concrete.Ability == Ability {
            // do something here
    }

    func attack() -> Ability {
        // do something here
    }
}
```

So we have a class that we can initialize by sending in a concrete `ForceWielder`, but we need to figure out how to forward the `attack` function on to the concrete instance that comes in. For this, we'll create a container class that's generic over `ForceWielder` and inherits from a base class that's generic over `Ability`. The inheritance is what "erases" the `ForceWielder` type so that the super class only knows about `Ability`. Our wrapper will now look like this:

```swift
final class AnyForceWielder<Ability>: ForceWielder {
    private let box: _AnyForceWielderBase<Ability>

    init<Concrete: ForceWielder>(_ concrete: Concrete)
        where Concrete.Ability == Ability {
            self.box = _AnyForceWielderBox(concrete)
    }

    func attack() -> Ability {
        return box.attack()
    }
}
```

We are using the concrete class to instantiate an `_AnyForceWielderBox` (which knows about `ForceWielder`) but we are storing it as its superclass that only knows about `Ability`. Then we call attack on that stored `_AnyForceWielderBase<Ability>`. Let's look at the code for these new classes...

```swift
private class _AnyForceWielderBase<Ability>: ForceWielder {
    init() {
        guard type(of: self) != _AnyForceWielderBase.self else {
            fatalError("Must be instantiated from a subclass")
        }
    }
    func attack() -> Ability { fatalError("Method must be overriden") }
}

private final class _AnyForceWielderBox<Concrete: ForceWielder>: _AnyForceWielderBase<Concrete.Ability> {
    private var concrete: Concrete

    init(_ concrete: Concrete) { self.concrete = concrete }

    override func attack() -> Concrete.Ability {
        return concrete.attack()
    }
}
```

## Using the New Type

Now we can create that sequence we wanted before...

```swift
let duelists = [AnyForceWielder(Anakin()), AnyForceWielder(ObiWan())]
```

Note that the type of `duelists` is inferred to be `[AnyForceWielder<LightsaberCombat>]`.

```swift
duelists.map() { $0.attack() }
// Attacking with Djem So form
// Attacking with Soresu form
```

It also works with abilities some consider to be... unnatural.

```swift
let zappers = [AnyForceWielder(Emperor())]
zappers.map { $0.attack() }
// Zapping with 50 volts
```

Also note that we are still getting type safety. If we were to try to combine Jedi and Sith...

```swift
let both = [AnyForceWielder(Anakin()), AnyForceWielder(Emperor())]
// error: heterogeneous collection literal could only be inferred to '[Any]';
// add explicit type annotation if this is intentional
```

## There has Got to be a Simpler Way

Ok, you got me. The pattern above was hard to understand but is pretty robust. Apple even uses it in the standard library. But if you just have a method or two that you need exposed (as in our example), you can just save it off instead of worrying about the two extra classes.

```swift
struct AnyForceWielder<Ability>: ForceWielder {
    private let _attack: () -> Ability

    init<Concrete: ForceWielder>(_ concrete: Concrete)
        where Concrete.Ability == Ability {
            self._attack = concrete.attack
    }

    func attack() -> Ability {
        return _attack()
    }
}
```
