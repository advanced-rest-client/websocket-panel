/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { LitElement, html, css } from 'lit-element';
import '@advanced-rest-client/websocket-request/websocket-request.js';
import '@advanced-rest-client/websocket-data-view/websocket-data-view.js';
import '@advanced-rest-client/websocket-history/websocket-history.js';
/**
 * A web socket panel with the request and history of calls.
 *
 * Changes in version 2
 *
 * - Model is not included into the DOM, add `arc-models/websocket-url-history-model.html`
 * component to your application to handle database queries.
 *
 * To styles the component check `websocket-request`, `websocket-data-view`
 * and `websocket-history` components.
 *
 * @customElement
 * @memberof ApiElements
 * @demo demo/index.html
 */
class WebsocketPanel extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        font-size: var(--arc-font-body1-font-size, inherit);
        font-weight: var(--arc-font-body1-font-weight, inherit);
        line-height: var(--arc-font-body1-line-height, inherit);
      }

      websocket-data-view,
      websocket-history {
        margin-top: 40px;
      }
    `;
  }

  render() {
    const { url, _messages, _connected, _connecting, narrow } = this;
    const renderMessages = !!(_messages && _messages.length);
    const renderHistory = !_connected && !_connecting;
    return html`
      <websocket-request
        @messages-changed="${this._messagesHandler}"
        @url-changed="${this._urlHandler}"
        @connecting-changed="${this._connectingHandler}"
        @connected-changed="${this._connectedHandler}"
        .url="${url}"
        .messages="${_messages}"
        ?narrow="${narrow}"
      ></websocket-request>
      ${renderMessages
        ? html`
            <websocket-data-view
              .messages="${_messages}"
              ?narrow="${narrow}"
              @cleared="${this._clearMessages}"
            ></websocket-data-view>
          `
        : undefined}
      ${renderHistory
        ? html`
            <websocket-history
              ?narrow="${narrow}"
              @socket-url-changed="${this._historyUrlSelected}"
            ></websocket-history>
          `
        : undefined}
    `;
  }

  static get properties() {
    return {
      /**
       * Remote URL to connect to
       */
      url: { type: String },
      // True when connecting to a server
      _connecting: { type: Boolean },
      /**
       * True if the socket is connected.
       */
      _connected: { type: Boolean },
      /**
       * List of communication messages with the server.
       * @type {Array<Object>}
       */
      _messages: { type: Array },
      /**
       * When set it renders mobile friendly view
       */
      narrow: { type: Boolean }
    };
  }

  get url() {
    return this._url;
  }

  set url(value) {
    const old = this._url;
    if (old === value) {
      return;
    }
    this._url = value;
    this.requestUpdate('url', old);
    this.dispatchEvent(
      new CustomEvent('url-changed', {
        detail: {
          value
        }
      })
    );
  }
  /**
   * Handler for `socket-url-changed` event. Connects to selected URL.
   * @param {CustomEvent} e
   */
  _historyUrlSelected(e) {
    this.url = e.detail.value;
    setTimeout(() => {
      const node = this.shadowRoot.querySelector('websocket-request');
      node.connect();
    });
  }

  _clearMessages() {
    this._messages = undefined;
  }

  _messagesHandler(e) {
    this._messages = e.target.messages;
  }

  _urlHandler(e) {
    this.url = e.target.url;
  }

  _connectingHandler(e) {
    this._connecting = e.target.connecting;
  }

  _connectedHandler(e) {
    this._connected = e.target.connected;
  }
}
window.customElements.define('websocket-panel', WebsocketPanel);
