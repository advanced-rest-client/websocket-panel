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
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import '../../@advanced-rest-client/websocket-request/websocket-request.js';
import '../../@advanced-rest-client/websocket-data-view/websocket-data-view.js';
import '../../@advanced-rest-client/websocket-history/websocket-history.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
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
 * @polymer
 * @memberof ApiElements
 * @demo demo/index.html
 */
class WebsocketPanel extends PolymerElement {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --arc-font-body1;
      @apply --websocket-panel;
    }

    websocket-data-view,
    websocket-history {
      margin-top: 40px;
    }
    </style>
    <websocket-request
      id="request"
      messages="{{messages}}"
      url="{{url}}"
      connecting="{{connecting}}"
      connected="{{connected}}"></websocket-request>
    <template is="dom-if" if="[[messages]]">
      <websocket-data-view messages="[[messages]]" on-message-cleared="_clearMessages"></websocket-data-view>
    </template>
    <template is="dom-if" if="[[renderHistory]]">
      <websocket-history items="[[history]]" on-socket-url-changed="_historyUrlSelected"></websocket-history>
    </template>`;
  }

  static get properties() {
    return {
      /**
       * Remote URL to connect to
       */
      url: {
        type: String,
        notify: true
      },
      // List of history data from the datastore.
      history: Array,
      // Computed value, true if the element has history data.
      hasHistoryData: {
        type: Boolean,
        notify: true,
        computed: '_computeHasHistoryData(history)'
      },
      // If true then the element is loading the history data.
      loading: {
        type: Boolean,
        notify: true,
        readOnly: true
      },
      // True when connecting to a server
      connecting: Boolean,
      /**
       * True if the socket is connected.
       */
      connected: Boolean,
      // Computed value, is set then the connections history is rendered
      renderHistory: {
        type: Boolean,
        computed: '_computeRenderHistory(connecting, connected)'
      },
      // List of communication messages with the server.
      messages: Array,
      /**
       * When set it won't automatically query history data when connected to DOM.
       */
      noAuto: Boolean
    };
  }

  constructor() {
    super();
    this._storeItemChanged = this._storeItemChanged.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('websocket-url-history-changed', this._storeItemChanged);
    if (!this.loading && !this.history && !this.noAuto) {
      this.refreshHistory();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('websocket-url-history-changed', this._storeItemChanged);
  }
  /**
   * Sends `websocket-url-history-list` event to query the history.
   * @return {Promise}
   * @throws {Error} When event is not handled.
   */
  refreshHistory() {
    const e = this._dispatchHistoryList();
    if (!e.detail.result) {
      throw new Error('Query not handled');
    }
    this._setLoading(true);
    return e.detail.result
    .then((data) => {
      this._setLoading(false);
      this.set('history', data);
    })
    .catch(() => {
      this._setLoading(false);
    });
  }
  /**
   * Dispatches websocket-url-history-list event and returns it.
   * @return {CustomEvent}
   */
  _dispatchHistoryList() {
    const e = new CustomEvent('websocket-url-history-list', {
      cancelable: true,
      composed: true,
      bubbles: true,
      detail: {}
    });
    this.dispatchEvent(e);
    return e;
  }
  /**
   *  Handler for the `websocket-url-history-changed`. Updates the item in
   *  the `history` list if available.
   * @param {CustomEvent} e
   */
  _storeItemChanged(e) {
    if (e.cancelable) {
      return;
    }
    if (!this.history) {
      this.set('history', [e.detail.item]);
      return;
    }
    const id = e.detail.item._id;
    const index = this.history.findIndex((item) => item._id === id);
    if (index === -1) {
      this.push('history', e.detail.item);
    } else {
      this.set(['history', index], e.detail.item);
    }
  }

  /**
   * Computes `hasData` property based on the `history` state.
   * @param {Array<Object>|undefined} history
   * @return {Boolean}
   */
  _computeHasHistoryData(history) {
    if (!history || !history.length) {
      return false;
    }
    return true;
  }

  _historyUrlSelected(e) {
    this.set('url', e.detail.value);
    this.$.request.connect();
  }

  _computeRenderHistory(connecting, connected) {
    return !connected && !connecting;
  }

  _clearMessages() {
    this.set('messages', undefined);
  }
}
window.customElements.define('websocket-panel', WebsocketPanel);
