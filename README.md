[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/websocket-panel.svg)](https://www.npmjs.com/package/@advanced-rest-client/websocket-panel)

[![Build Status](https://travis-ci.org/advanced-rest-client/websocket-panel.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/websocket-panel)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@advanced-rest-client/websocket-panel)


# websocket-panel

A web socket panel with the request and history of calls

## Example:

```html
<websocket-panel></websocket-panel>
```

## API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @advanced-rest-client/websocket-panel
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@advanced-rest-client/websocket-panel/websocket-panel.js';
    </script>
  </head>
  <body>
    <websocket-panel></websocket-panel>
  </body>
</html>
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@advanced-rest-client/websocket-panel/websocket-panel.js';

class SampleElement extends PolymerElement {
  static get template() {
    return html`<websocket-panel></websocket-panel>`;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/websocket-panel
cd websocket-panel
npm i
```

### Running the demo locally

```sh
npm start
```

### Running the tests
```sh
npm test
```
