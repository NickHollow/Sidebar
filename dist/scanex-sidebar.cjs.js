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

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

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

var Sidebar = function (_EventTarget) {
    inherits(Sidebar, _EventTarget);

    function Sidebar(container) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$position = _ref.position,
            position = _ref$position === undefined ? 'left' : _ref$position;

        classCallCheck(this, Sidebar);

        var _this = possibleConstructorReturn(this, (Sidebar.__proto__ || Object.getPrototypeOf(Sidebar)).call(this));

        _this._container = container;
        _this._container.innerHTML = '<div class="scanex-sidebar">\n            <div class="' + (position === 'left' ? 'tabs' : 'panes') + '"></div>\n            <div class="' + (position === 'left' ? 'panes' : 'tabs') + '"></div>\n        </div>';

        _this._tabContainer = _this._container.querySelector('.tabs');
        _this._paneContainer = _this._container.querySelector('.panes');

        _this._current = null;
        _this._data = {};
        return _this;
    }

    createClass(Sidebar, [{
        key: 'enable',
        value: function enable(id) {
            if (this._data[id]) {
                this._data[id].enabled = true;
            }
        }
    }, {
        key: 'enabled',
        value: function enabled(id) {
            var _ref2 = id && this._data[id] ? this._data[id] : { enabled: false },
                enabled = _ref2.enabled;

            return enabled;
        }
    }, {
        key: 'disable',
        value: function disable(id) {
            if (this._data[id]) {
                if (id === this.current) {
                    this.current = null;
                }
                this._data[id].enabled = false;
            }
        }
    }, {
        key: 'addTab',
        value: function addTab(_ref3) {
            var id = _ref3.id,
                icon = _ref3.icon,
                opened = _ref3.opened,
                closed = _ref3.closed,
                tooltip = _ref3.tooltip,
                _ref3$enabled = _ref3.enabled,
                enabled = _ref3$enabled === undefined ? true : _ref3$enabled;

            var tab = document.createElement('div');
            var ic = document.createElement('i');
            icon.split(/\s+/g).forEach(function (x) {
                return ic.classList.add(x);
            });
            ic.classList.add(id === this._current ? opened : closed);
            tab.appendChild(ic);
            tab.setAttribute('data-tab-id', id);
            if (tooltip) {
                tab.setAttribute('title', tooltip);
            }
            tab.addEventListener('click', this._toggle.bind(this, id));
            this._tabContainer.appendChild(tab);

            var pane = document.createElement('div');
            pane.setAttribute('data-pane-id', id);
            pane.classList.add(this.visible && this.current === id ? 'shown' : 'hidden');
            this._paneContainer.appendChild(pane);

            this._data[id] = { icon: icon, opened: opened, closed: closed, enabled: enabled };

            return pane;
        }
    }, {
        key: 'removeTab',
        value: function removeTab(id) {
            var tab = this._tabContainer.querySelector('[data-tab-id=' + id + ']');
            tab.removeEventListener('click', this._toggle.bind(this, id));
            this._tabContainer.removeChild(tab);

            var pane = this._paneContainer.querySelector('[data-pane-id=' + id + ']');
            this._paneContainer.removeChild(pane);

            for (var i = 0; i < this._data.length; ++i) {
                if (this._data[i].id === id) {
                    this._data.splice(i, 1);
                    break;
                }
            }
        }
    }, {
        key: '_toggle',
        value: function _toggle(current) {
            if (this.enabled(current)) {
                this.current = this.current === current ? null : current;
            }
        }
    }, {
        key: 'getPane',
        value: function getPane(id) {
            return this._paneContainer.querySelector('[data-pane-id=' + id + ']');
        }
    }, {
        key: 'current',
        get: function get$$1() {
            return this._current;
        },
        set: function set$$1(current) {
            var tabs = this._tabContainer.children;
            var panes = this._paneContainer.children;
            var success = false;

            for (var i = 0; i < tabs.length; ++i) {
                var id = tabs[i].getAttribute('data-tab-id');
                var _data$id = this._data[id],
                    opened = _data$id.opened,
                    closed = _data$id.closed,
                    enabled = _data$id.enabled;

                var tab = tabs[i].querySelector('i');
                var pane = panes[i];
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
            var event = document.createEvent('Event');
            event.detail = { current: this._current };
            event.initEvent('change', false, false);
            this.dispatchEvent(event);
        }
    }]);
    return Sidebar;
}(EventTarget);

module.exports = Sidebar;
