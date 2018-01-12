# frint-props

[![npm](https://img.shields.io/npm/v/frint-props.svg)](https://www.npmjs.com/package/frint-props)

> Compose props reactively in FrintJS Apps

<!-- MarkdownTOC autolink=true bracket=round -->

- [Guide](#guide)
  - [Installation](#installation)
  - [Usage](#usage)
- [API](#api)
  - [compose](#compose)

<!-- /MarkdownTOC -->

---

# Guide

## Installation

With [npm](https://www.npmjs.com/):

```
$ npm install --save frint-props frint-react
```

Via [unpkg](https://unpkg.com) CDN:

```html
<script src="https://unpkg.com/frint-props@latest/dist/frint-props.min.js"></script>
<script>
  // available as `window.FrintProps`
</script>
```

## Usage

The package exposes a `compose` higher-order component, that is similar to the one found in `frint-props`.

You can use it as follows:

```js
import React from 'react';
import { withDefaults, withState } from 'frint-props';
import { compose } from 'frint-props-react';

function MyComponent(props) {
  // props.counter (`Integer`)
  // props.setCounter (`Function`)
}

export default compose(
  withDefaults({ counter: 0 }),
  withState('counter', 'setCounter', 0)
)(MyComponent);
```

# API

## compose

> compose(...functions)(Component)

Higher-order component in React.

### Arguments

Accepts multiple functions as available in `frint-props`. The returned function is an enhancer that can be called directly with your base React component.
