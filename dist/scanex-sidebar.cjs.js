'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var EventTarget = function () {
    function EventTarget() {
        classCallCheck(this, EventTarget);

        this.listeners = {};
    }

    createClass(EventTarget, [{
        key: 'addEventListener',
        value: function addEventListener(type, callback) {
            if (!(type in this.listeners)) {
                this.listeners[type] = [];
            }
            this.listeners[type].push(callback);
        }
    }, {
        key: 'on',
        value: function on(type, callback) {
            this.addEventListener(type, callback);
            return this;
        }
    }, {
        key: 'removeEventListener',
        value: function removeEventListener(type, callback) {
            if (!(type in this.listeners)) {
                return;
            }
            var stack = this.listeners[type];
            for (var i = 0, l = stack.length; i < l; i++) {
                if (stack[i] === callback) {
                    stack.splice(i, 1);
                    return this.removeEventListener(type, callback);
                }
            }
        }
    }, {
        key: 'off',
        value: function off(type, callback) {
            this.removeEventListener(type, callback);
            return this;
        }
    }, {
        key: 'dispatchEvent',
        value: function dispatchEvent(event) {
            if (!(event.type in this.listeners)) {
                return;
            }
            var stack = this.listeners[event.type];
            Object.defineProperty(event, 'target', {
                enumerable: false,
                configurable: false,
                writable: false,
                value: this
            });
            for (var i = 0, l = stack.length; i < l; i++) {
                stack[i].call(this, event);
            }
        }
    }]);
    return EventTarget;
}();

class Sidebar extends EventTarget {
    constructor(container, { position = 'left' } = {}) {
        super();
        this._container = container;
        this._container.classList.add('noselect');
        this._container.innerHTML = `<div class="scanex-sidebar">
            <div class="${position === 'left' ? 'tabs' : 'panes'}"></div>
            <div class="${position === 'left' ? 'panes' : 'tabs'}"></div>
        </div>`;

        this._tabContainer = this._container.querySelector('.tabs');
        this._paneContainer = this._container.querySelector('.panes');

        this._current = null;
        this._data = {};
    }
    enable(id) {
        if (this._data[id]) {
            this._data[id].enabled = true;
        }
    }
    enabled(id) {
        const { enabled } = id && this._data[id] ? this._data[id] : { enabled: false };
        return enabled;
    }
    disable(id) {
        if (this._data[id]) {
            if (id === this.current) {
                this.current = null;
            }
            this._data[id].enabled = false;
        }
    }
    get current() {
        return this._current;
    }
    set current(current) {
        const tabs = this._tabContainer.children;
        const panes = this._paneContainer.children;
        let success = false;

        for (let i = 0; i < tabs.length; ++i) {
            const id = tabs[i].getAttribute('data-tab-id');
            const { opened, closed, enabled } = this._data[id];
            let tab = tabs[i].querySelector('i');
            let pane = panes[i];
            if (id === current) {
                tab.classList.remove(closed);
                tab.classList.add(opened);

                pane.classList.remove('hidden');
                pane.classList.add('shown');

                success = true;
            } else {
                tab.classList.remove(opened);
                tab.classList.add(closed);

                pane.classList.remove('shown');
                pane.classList.add('hidden');
            }
        }
        this._current = success ? current : null;
        let event = document.createEvent('Event');
        event.detail = { current: this._current };
        event.initEvent('change', false, false);
        this.dispatchEvent(event);
    }
    addTab({ id, icon, opened, closed, tooltip, enabled = true }) {
        let tab = document.createElement('div');
        let ic = document.createElement('i');
        icon.split(/\s+/g).forEach(x => ic.classList.add(x));
        ic.classList.add(id === this._current ? opened : closed);
        tab.appendChild(ic);
        tab.setAttribute('data-tab-id', id);
        if (tooltip) {
            tab.setAttribute('title', tooltip);
        }
        tab.addEventListener('click', this._toggle.bind(this, id));
        this._tabContainer.appendChild(tab);

        let pane = document.createElement('div');
        pane.setAttribute('data-pane-id', id);
        pane.classList.add(this.visible && this.current === id ? 'shown' : 'hidden');
        this._paneContainer.appendChild(pane);

        this._data[id] = { icon, opened, closed, enabled };

        return pane;
    }
    removeTab(id) {
        const tab = this._tabContainer.querySelector(`[data-tab-id=${id}]`);
        tab.removeEventListener('click', this._toggle.bind(this, id));
        this._tabContainer.removeChild(tab);

        const pane = this._paneContainer.querySelector(`[data-pane-id=${id}]`);
        this._paneContainer.removeChild(pane);

        for (let i = 0; i < this._data.length; ++i) {
            if (this._data[i].id === id) {
                this._data.splice(i, 1);
                break;
            }
        }
    }
    _toggle(current) {
        if (this.enabled(current)) {
            this.current = this.current === current ? null : current;
        }
    }
    getPane(id) {
        return this._paneContainer.querySelector(`[data-pane-id=${id}]`);
    }
}

module.exports = Sidebar;
