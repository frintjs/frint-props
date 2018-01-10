# frint-props

[![npm](https://img.shields.io/npm/v/frint-props.svg)](https://www.npmjs.com/package/frint-props)

> Compose reactive props for FrintJS Apps

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Concepts](#concepts)
  - [Usage](#usage)
  - [Write your own functions](#write-your-own-functions)
- [API](#api)
  - [withDefaults](#withdefaults)
  - [withState](#withstate)
  - [withStore](#withstore)
  - [withObservable](#withobservable)
  - [withHandlers](#withhandlers)
  - [compose](#compose)
  - [map](#map)
  - [pipe](#pipe)
  - [shouldUpdate](#shouldupdate)

<!-- /MarkdownTOC -->

---

# Guide

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save rxjs frint-props
```

Via [unpkg](https://unpkg.com) CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/rxjs/5.5.0/Rx.min.js"></script>

<script src="https://unpkg.com/frint-props@latest/dist/frint-props.min.js"></script>

<script>
  // available as `window.FrintProps`
</script>
```

## Concepts

The package consists of multiple functions that enable you to compose your props as an RxJS Observable.

There are two kinds of functions:

1. That adds new props to the stream
1. That processes the props stream further (like RxJS operators)

And then there is `compose` function that accepts both kinds of functions as arguments, and returns a single function that you can use anywhere.

## Usage

We can start small, and prepare a stream that only emits the props once, and it doesn't change over time:

```js
import { withDefaults } from 'frint-props';

const defaultProps = {
  foo: 'foo value',
};
const props$ = withDefaults(defaultProps)();
```

Now that we have the Observable available as `props$`, we can subscribe to it as needed:

```js
props$.subscribe(props => console.log(props));
```

### Reactivity

But we have more real world use cases that require our props to change over time too. We can consider using `withState` for this example:

```js
import { withState } from 'frint-props';

const props$ = withState('counter', 'setCounter', 0)();
```

Now the `props$` Observable will emit an object with these keys:

* `counter` (`Integer`): The counter value
* `setCounter(n)` (`Function`): Call this function to update `counter` value

### Composition

You can compose multiple functions together to generate a combined stream of all props. For that, we can use the `compose` function:

```js
import { compose, withDefaults, withState } from 'frint-props';

const props$ = compose(
  withDefaults({ foo: 'bar' }),
  withState('counter', 'setCounter', 0),
  withState('nane', 'setName', 'FrintJS')
)();
```

The `props$` Observable will now emit with an object with these keys:

* `foo` (`String`)
* `counter` (`Integer`)
* `setCounter(counter)` (`Function`)
* `name` (`String`)
* `setName(name)` (`String`)

As you call functions like `setCounter` or `setName`, it will emit a new object with updated values for `counter` and `name`.

### Operators

Besides adding just props, you may also need to process the stream further.

For example, you may want to control how often the Observable emits new values. We can use `shouldUpdate` function for this:

```js
import { compose, withDefaults, withState, shouldUpdate } from 'frint-props';

const props$ = compose(
  withDefaults({ counter: 0 }),
  withState('counter', 'setCounter', 0),
  shouldUpdate((prevProps, nextProps) => {
    return prevProps.counter !== nextProps.counter;
  })
)();
```

The implementation of `shouldUpdate` above tells our `props$` Observable to emit new values only if the `counter` value has changed. Otherwise nothing new is emitted.

## Write your own functions

The API of creating your own functions is pretty simple.

### Basic function to add props

A basic function that is concerned about adding new props can be written like this:

```js
function withFoo() {
  return function () {
    return {
      foo: 'foo value here',
    };
  };
}
```

You can also return an Observable instead of a plain object:

```js
import { of } from 'rxjs/observable/of';

function withFoo() {
  return function () {
    return of({
      foo: 'foo value here',
    });
  };
}
```

### Accessing additional arguments

You would notice that instead of returning the Object/Observable directly from our function, we return another function which takes care of returning the final result.

This allows us to access additional arguments when composing props.

Imagine if we want to make the FrintJS `app` instance available to our functions:

```js
const app = new App();

const props$ = compose(
  withFoo()
)(app);
```

The argument `app` can now be accessed inside our function like this:

```js
withFoo() {
  return function (app) {
    return {
      foo: 'foo value here',
    };
  };
}
```

The way some of our functions are designed in this repository, the returned functions expect to receive the same arguments as our [`observe`](https://frint.js.org/guides/higher-order-components/) higher-order component receives in [`frint-react`](https://frint.js.org/docs/packages/frint-react/), which are: `app` and `parentProps$`.

### Operator functions

Besides just adding new props, functions can also take care of processing the stream further just like how RxJS operators work.

We can create a function that will check if there is any `foo` prop, and then capitalize it:

```js
import { map } from 'rxjs/operators/map';

function capitalizeFoo() {
  return function () {
    return map((props) => ({
      ...props,
      foo: props.foo
        ? props.foo.toUpperCase()
        : undefined,
    }));
  };
}
```

Can be composed together as follows:

```js
import { compose } from 'frint-props';

const props$ = compose(
  withFoo(),
  capitalizeFoo()
);
```

The `props$` Observable will now emit `{ foo: 'FOO VALUE HERE' }`.

---

# API

All the functions return a function, when called, returns an Observable of props.

<!-- -->

## withDefaults

> withDefaults(defaultProps)

### Arguments

1. `defaultProps`: Default props to start the stream with

### Example

```js
const props$ = withDefaults({ foo: 'foo value here' })();
```

<!-- -->

## withState

> withState(valueName, setterName, initialValue)

### Arguments

1. `valueName` (`String`): Prop name for the value
1. `setterName` (`String`): Prop name for the setter function
1. `initialValue` (`any`): Initial value for the state

### Example

```js
const props$ = withState('counter', 'setCounter', 0)();
```

<!-- -->

## withStore

> withStore(mapState, mapDispatch, options = {})

Works with `frint-store` or Redux store set in FrintJS App as a provider.

### Arguments

1. `mapState` (`Function`): Maps state to props
1. `mapDispatch` (`Object`): Action creators keyed by names
1. `options` (`Object`) [optional]: Object with additional configuration
1. `options.providerName` (`String`): Defaults to `store`
1. `options.appName` (`String`): Defaults to `null`, otherwise name of any Child App

### Example

```js
const app = new App(); // assuming it has a `store` provider

const props$ = withState('counter', 'setCounter', 0)(app);
```

<!-- -->

## withObservable

> withObservable(source$, ...mappers)

### Arguments

1. `source$` (`Observable` OR function returning `Observable`)
2. `mapper` (`Function`): Returning props OR Observable of props

### Example

```js
import { of } from 'rxjs/observable/of';

const props$ = withObservable(
  of({ foo: 'foo value here' }),
  props => ({ foo: props.foo.toUpperCase() }),
  props => ({ foo: `${props.foo}!` })
)();
```

Generated from a function:

```js
import { of } from 'rxjs/observable/of';

const props$ = withObservable(
  () => of({ foo: 'foo value here' })
)();
```

<!-- -->

## withHandlers

> withHandlers(handlers)

This function can be only used via `compose`.

### Arguments

* `handlers` (`Object`): Functions keyed by prop name

### Example

```
const props$ = compose(
  withHandlers({
    handleClick: props => () => console.log('Clicked!')
  })
)();
```

Other props are accessible too:

```js
const props$ = compose(
  withState('counter', 'setCounter', 0),
  withHandlers({
    increment: props => () => props.setCounter(props.counter + 1)
  })
)();
```

Additional arguments can be accessed as follows:

```js
const props$ = compose(
  withHandlers({
    handleClick: (props, arg1, arg2) => () => console.log('Clicked!')
  })
)(arg1, arg2);
```

<!-- -->

## compose

> compose(...functions)

Composes multiple functions into a combined single function, that can be called later.

### Example

```js
const props$ = compose(
  withDefaults({}),
  withState('counter', 'setCounter', 0),
  withState('name', 'setName', 'FrintJS'),
  shouldUpdate((prevProps, nextProps) => true)
)();
```

<!-- -->

## map

> map(mapperFn)

### Arguments

1. `mapperFn` (`Function`): Function that accepts processed props, and returns new mapped props object

### Example

```js
const props$ = compose(
  withDefaults({ foo: 'foo value' }),
  map(props => ({ foo: props.foo.toUpperCase() }))
)();
```

Will emit `{ foo: 'FOO VALUE' }`.

<!-- -->

## pipe

> pipe(operator)

Pipes with any RxJS operator.

### Arguments

1. `operator` (`Function`): RxJS operator

### Example

```js
import { map } from 'rxjs/operators/map';

const props$ = compose(
  withDefaults({ foo: 'foo value' }),
  pipe(map(props => ({ foo: props.foo.toUpperCase() })))
)();
```

<!-- -->

## shouldUpdate

> shouldUpdate((prevProps, nextProps) => true)

Controls when to emit props.

### Arguments

1. `Function`: receives previous and next props, and should return a Boolean deciding whether to update or not
