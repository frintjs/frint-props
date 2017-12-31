# frint-props

[![npm](https://img.shields.io/npm/v/frint-props.svg)](https://www.npmjs.com/package/frint-props)
[![Build Status](https://img.shields.io/travis/frintjs/frint-props/master.svg)](http://travis-ci.org/frintjs/frint-props)
[![codecov](https://codecov.io/gh/frintjs/frint-props/branch/master/graph/badge.svg)](https://codecov.io/gh/frintjs/frint-props)
[![NSP Status](https://nodesecurity.io/orgs/travix-international-bv/projects/a1b03b99-d210-41f8-88c5-44313d27ab6f/badge)](https://nodesecurity.io/orgs/travix-international-bv/projects/a1b03b99-d210-41f8-88c5-44313d27ab6f)
[![Join the chat at https://gitter.im/frintjs/frint](https://badges.gitter.im/frintjs/frint.svg)](https://gitter.im/frintjs/frint)
[![Greenkeeper](https://badges.greenkeeper.io/frintjs/frint-props.svg)](https://greenkeeper.io/)

> Library for composing props reactively in FrintJS Apps

Under heavy development. Do NOT use in production!

## Packages

* [`frint-props`](./packages/frint-props): Compose props as an RxJS Observable
* [`frint-props-react`](./packages/frint-props-react): React higher-order component for working with props

## Guide

### Installation

Install [`frint-props`](./packages/frint-props) with `npm`:

```
$ npm install --save frint-props rxjs
```

### Basic usage

A basic stream of props can be created as follows:

```js
const props$ = withState('counter', 'setCounter', 0)();
```

The `props$` observable will now emit an object with three keys:

* `counter` (`Integer`): The value of counter
* `setCounter` (`Function`): Calling `setCounter(n)` will update the counter

### Composition

You can compose multiple streams together using the `compose` function:

```js
import {
  withDefaults,
  withState,
  shouldUpdate,
  compose
} from 'frint-react';

const props$ = compose(
  withDefaults({ counter: 0 }),
  withState('counter', 'setCounter', 0),
  withState('name', 'setName', 'FrintJS'),
  shouldUpdate((prevProps, nextProps) => true)
)();
```

The `props$` observable will now emit an object with these keys as they are made available:

* `counter` (`Integer`)
* `setCounter` (`Function`)
* `name` (`String`)
* `setName` (`String`)

### Usage with React

You can use [`frint-props-react`](./packages/frint-props-react):

```js
import React from 'react';
import { withDefaults, withState } from 'frint-props';
import { hoc } from 'frint-props-react';

function MyComponent(props) {
  // `props.counter` (`Integer`)
  // `props.setCounter` (`Function`)
  return <p></p>;
}

export default hoc(
  withDefaults({ counter: 0 }),
  withState('counter', 'setCounter', 0)
)(MyComponent);
```

If you want to be more flexible by using the [`observe`](https://frint.js.org/guides/higher-order-components/) higher-order component from [`frint-react`](https://frint.js.org/docs/packages/frint-react/) directly, you can do this instead:

```js
import React from 'react';
import { observe } from 'frint-react';
import { compose, withDefaults, withState } from 'frint-props';

function MyComponent(props) {
  return <p></p>;
}

export default observe(function (app, parentProps$) {
  return compose(
    withDefaults({ counter: 0 }),
    withState('counter', 'setCounter', 0)
  )(app, parentProps$);
});
```

## Note

The `frint-props` package's API is highly inspired by the awesome [Recompose](https://github.com/acdlite/recompose), but done with RxJS from the ground up and to play nicely with [FrintJS](https://github.com/frintjs/frint) while being agnostic of any specific rendering library.

## License

MIT
