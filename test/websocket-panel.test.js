import { fixture, assert, aTimeout, nextFrame } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import { DataGenerator } from '@advanced-rest-client/arc-data-generator/arc-data-generator.js';
import '../websocket-panel.js';

describe('<websocket-panel>', () => {
  before(async () => {
    await DataGenerator.destroyWebsocketsData();
  });

  async function basicFixture() {
    return await fixture(`<websocket-panel></websocket-panel>`);
  }

  describe('View rendering', () => {
    it('renders history view', async () => {
      const element = await basicFixture();
      const node = element.shadowRoot.querySelector('websocket-history');
      assert.ok(node);
    });

    it('messages list view is not rendered when not connected', async () => {
      const element = await basicFixture();
      const node = element.shadowRoot.querySelector('websocket-data-view');
      assert.notOk(node);
    });

    it('renders messages list view when connected', async () => {
      const element = await basicFixture();
      element._messages = [{}];
      await nextFrame();
      const node = element.shadowRoot.querySelector('websocket-data-view');
      assert.ok(node);
    });

    it('history view is not rendered when connected', async () => {
      const element = await basicFixture();
      element._connected = true;
      await nextFrame();
      const node = element.shadowRoot.querySelector('websocket-history');
      assert.notOk(node);
    });

    it('history view is not rendered when connecting', async () => {
      const element = await basicFixture();
      element._connecting = true;
      await nextFrame();
      const node = element.shadowRoot.querySelector('websocket-history');
      assert.notOk(node);
    });
  });

  describe('url setter/getter', () => {
    const url = 'wss://test';
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets _url property', () => {
      element.url = url;
      assert.equal(element._url, url);
    });

    it('setter has the value', () => {
      element.url = url;
      assert.equal(element.url, url);
    });

    it('dispatches url-changed event', () => {
      const spy = sinon.spy();
      element.addEventListener('url-changed', spy);
      element.url = url;
      assert.isTrue(spy.calledOnce);
      assert.equal(spy.args[0][0].detail.value, url);
    });

    it('ignores change when value aready set', () => {
      element.url = url;
      const spy = sinon.spy();
      element.addEventListener('url-changed', spy);
      element.url = url;
      assert.isFalse(spy.called);
    });
  });

  describe('_historyUrlSelected()', () => {
    const url = 'wss://echo.websocket.org';
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    function fire(element) {
      const target = element.shadowRoot.querySelector('websocket-history');
      target.dispatchEvent(
        new CustomEvent('socket-url-changed', {
          detail: {
            value: url
          }
        })
      );
    }

    it('Sets the url', () => {
      fire(element);
      assert.equal(element.url, url);
    });

    it('calls connect() on the request', async () => {
      // instead of checking function call with the spy it checks if the `connecting`
      // status changed
      fire(element);
      await aTimeout();
      assert.isTrue(element._connecting);
    });
  });

  describe('_clearMessages()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element._messages = DataGenerator.generateUrlsData({ size: 5 });
      await nextFrame();
    });

    function fire(element) {
      const target = element.shadowRoot.querySelector('websocket-data-view');
      target.dispatchEvent(new CustomEvent('cleared'));
    }

    it('clears the messages', async () => {
      fire(element);
      await nextFrame();
      // the await is to check whether the component throws any error when rendering
      // updated view
      assert.isUndefined(element._messages);
    });
  });

  describe('_messagesHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    function fire(element) {
      const target = element.shadowRoot.querySelector('websocket-request');
      target.messages = DataGenerator.generateUrlsData({ size: 5 });
    }

    it('sets new messages', () => {
      fire(element);
      assert.lengthOf(element._messages, 5);
    });
  });

  describe('_urlHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    function fire(element) {
      const obj = DataGenerator.generateUrlObject();
      const url = obj._id;
      const target = element.shadowRoot.querySelector('websocket-request');
      target.url = url;
      return url;
    }

    it('sets new messages', () => {
      const url = fire(element);
      assert.equal(element.url, url);
    });
  });

  describe('_connectingHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    function fire(element) {
      const target = element.shadowRoot.querySelector('websocket-request');
      target._connecting = true;
    }

    it('sets _connecting state', () => {
      fire(element);
      assert.isTrue(element._connecting);
    });
  });

  describe('_connectedHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    function fire(element) {
      const target = element.shadowRoot.querySelector('websocket-request');
      target._connected = true;
    }

    it('sets _connected state', () => {
      fire(element);
      assert.isTrue(element._connected);
    });
  });

  describe('a11y', () => {
    it('passes audit in normal state', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element, {
        ignoredRules: ['tabindex']
      });
    });
  });
});
