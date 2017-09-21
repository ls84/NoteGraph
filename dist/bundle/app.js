/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LinkInteract = __webpack_require__(3); // eslint-disable-line no-unused-vars
var NodeInteract = __webpack_require__(5); // eslint-disable-line no-unused-vars
var Interaction = __webpack_require__(1); //eslint-disable-line no-unused-vars

var SVGCanvas = function (_React$Component) {
  _inherits(SVGCanvas, _React$Component);

  function SVGCanvas(props) {
    _classCallCheck(this, SVGCanvas);

    var _this = _possibleConstructorReturn(this, (SVGCanvas.__proto__ || Object.getPrototypeOf(SVGCanvas)).call(this, props));

    _this.conext = 'canvas';
    _this.target = null;
    _this.targetNode = null;

    _this.state = { cache: { nodes: {}, links: {} } };
    _this.nodes = [];

    _this.Node = __webpack_require__(4);
    _this.Link = __webpack_require__(2);
    _this.setGraphSize = _this.setGraphSize.bind(_this);
    return _this;
  }

  _createClass(SVGCanvas, [{
    key: 'setGraphSize',
    value: function setGraphSize() {
      var width = window.innerWidth - 16;
      var height = window.innerHeight - 36;

      document.documentElement.style.setProperty('--windowHeight', height + 'px');
      document.documentElement.style.setProperty('--windowWidth', width + 'px');

      var svg = document.querySelector('svg');
      svg.setAttribute('width', width + 'px');
      svg.setAttribute('height', height + 'px');
      svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

      return { width: width, height: height };
    }

    // TODO: use d3.mouse instead

  }, {
    key: 'cursorPoint',
    value: function cursorPoint(event) {
      var svg = document.querySelector('svg#Canvas');
      var pt = svg.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;

      var zoomTransform = document.querySelector('svg#Canvas #zoomTransform');
      pt = pt.matrixTransform(zoomTransform.getCTM().inverse());
      pt = pt.matrixTransform(svg.getScreenCTM().inverse());
      return [pt.x, pt.y];
    }
  }, {
    key: 'measureText',
    value: function measureText(text, style) {
      d3.select('svg#preRender').attr('class', style);
      var renderedText = d3.select('svg#preRender').append('text').text(text).node();

      var size = renderedText.getBBox();
      renderedText.remove();

      return size;
    }
  }, {
    key: 'getRandomValue',
    value: function getRandomValue() {
      var a = new Uint32Array(1);
      return window.crypto.getRandomValues(a);
    }
  }, {
    key: 'appendNode',
    value: function appendNode(gunPath, position, displayLevel) {
      var _this2 = this;

      var node = new this.Node('node-' + this.getRandomValue(), this);
      node.data.position = position;
      node.data.path = gunPath;
      node.gun = this.props.gunData;
      if (displayLevel) node.displayLevel(displayLevel);
      node.getValue(function (d, k) {
        if (d) {
          var normalizedPath = node.normalizedPath;
          var existNode = _this2.nodes.filter(function (v) {
            return v.normalizedPath === normalizedPath;
          })[0];
          if (!existNode) {
            node.appendSelf();
            _this2.nodes.push(node);

            if (k.length === 0) return node.toggleDisplayLevel(1, true);
            var key = k[0];
            node.updateAttachedValue(key, d[key]);
            node.toggleDisplayLevel(2, false);
          }
          if (existNode) {
            console.log('duplicate nodes', existNode);
          }
        }
        if (!d) {
          // after gun.put will trigger gun.val inside getValue()
          _this2.props.putNewNode(gunPath);
          // node.initNode(gunPath, () => {
          //   let normalizedPath = node.normalizedPath
          //   console.log(normalizedPath)
          // })
        }
      });

      return node;
    }
  }, {
    key: 'addInteractions',
    value: function addInteractions() {
      var _this3 = this;

      var canvas = document.querySelector('svg#Canvas');
      var zoom = d3.zoom();
      zoom.on('zoom', function () {
        d3.select(canvas).select('#zoomTransform').attr('transform', d3.event.transform);
      });

      d3.select(canvas).call(zoom).on("dblclick.zoom", null);

      var DropArea = document.querySelector('#DropArea');
      DropArea.addEventListener('dragover', function (event) {
        event.preventDefault();
      });
      DropArea.addEventListener('drop', function (event) {
        _this3.nodeInteract.hide();

        var nodePath = _this3.nodeInteract.state.gunPath;
        var position = _this3.cursorPoint(event);
        _this3.appendNode(nodePath, position, 1);
      });
      DropArea.addEventListener('click', function (event) {
        var NodeInteract = document.querySelector('div#NodeInteract');
        if (NodeInteract.classList.value === 'show') _this3.nodeInteract.hide();
      });
    }
  }, {
    key: 'setContext',
    value: function setContext(selection, context) {
      var _this4 = this;

      selection.on('mouseenter', function (d) {
        _this4.target = d;
        _this4.context = context;
        if (context === 'value' || context === 'attachedValue') {
          _this4.valueDOM = selection.node().parentNode;
          _this4.valuePath = _this4.valueDOM.querySelector('.valueLabel').innerHTML;
        }
      });

      selection.on('mouseleave', function () {
        _this4.target = null;
        _this4.context = 'canvas';
      });
    }
  }, {
    key: 'applyCanvasContext',
    value: function applyCanvasContext(selection) {
      var _this5 = this;

      var commands = function commands(event) {
        if (event.key === 'n') _this5.nodeInteract.show();
        // if (event.key === 's') this.saveCache()
        // if (event.key === 'l') this.loadCache()
      };

      window.onkeyup = commands;
    }
  }, {
    key: 'applyNodeContext',
    value: function applyNodeContext(selection) {
      var _this6 = this;

      var commands = function commands(event) {
        if (event.key === 'p') _this6.target.gun.val(function (data, key) {
          console.log(data, key);
        });
        if (event.key === 's') _this6.target.toggleDisplayLevel();
        if (event.key === 'n') _this6.interaction.nodeName(_this6.target);
        if (event.key === 'v') _this6.interaction.nodeValue(_this6.target);
        if (event.key === 'Backspace') _this6.props.removeNode(_this6.target, event.shiftKey);
      };

      window.onkeyup = commands;
    }
  }, {
    key: 'applyValueContext',
    value: function applyValueContext(selection) {
      var _this7 = this;

      var commands = function commands(event) {
        if (event.key === 'Backspace') {
          var valueID = _this7.valueDOM.id;
          var link = _this7.target.links.detachedValue.filter(function (l) {
            return l.toValue === valueID;
          })[0];
          _this7.valueDOM.remove();
          link.DOM.remove();
          if (event.shiftKey) _this7.target.gun.path(_this7.valuePath).put(null);
        }
      };

      window.onkeyup = commands;
    }
  }, {
    key: 'applyAttachedValueContext',
    value: function applyAttachedValueContext(selection) {
      var commands = function commands(event) {
        // if (event.key === 'ArrowRight')
        // if (event.key === 'ArrowLeft')
      };

      window.onkeyup = commands;
    }
  }, {
    key: 'applyLinkContext',
    value: function applyLinkContext(selection) {
      var _this8 = this;

      var commands = function commands(event) {
        if (event.key === 'c') _this8.target.edit();
        if (event.key === 'n') _this8.linkInteract.show(_this8.target);
        if (event.key === 'Backspace') _this8.props.removeLink(_this8.target, event.shiftKey);
      };

      window.onkeyup = commands;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setGraphSize();
      window.onresize = this.setGraphSize;

      this.addInteractions();
      this.context = 'canvas';
    }
  }, {
    key: 'saveCache',
    value: function saveCache() {
      console.log(JSON.stringify(this.state.cache));
    }
  }, {
    key: 'loadCache',
    value: function loadCache() {
      var _this9 = this;

      // let cache = {"nodes":{"node-4210259129":{"fromLink":["link-1976719957"],"toLink":["link-3501817744"],"position":[451,158],"path":"a"},"node-3650578120":{"fromLink":["link-2478644371"],"toLink":["link-1976719957"],"position":[256,425],"path":"b"},"node-4053994535":{"fromLink":["link-3501817744"],"toLink":["link-2478644371"],"position":[638,426],"path":"c"}},"links":{"link-1976719957":{"predicate":"","from":[451,158],"to":[256,425],"controlFrom":[418.5,202.5],"controlTo":[288.5,380.5],"fromNode":"node-4210259129","toNode":"node-3650578120"},"link-2478644371":{"predicate":"","from":[256,425],"to":[638,426],"controlFrom":[322,531],"controlTo":[563,521],"fromNode":"node-3650578120","toNode":"node-4053994535"},"link-3501817744":{"predicate":"","from":[638,426],"to":[451,158],"controlFrom":[606.8333333333334,381.3333333333333],"controlTo":[482.1666666666667,202.66666666666666],"fromNode":"node-4053994535","toNode":"node-4210259129"}}}
      // let cache = {"nodes":{"node-2222167242":{"fromLink":[],"toLink":[],"position":[414,118],"path":"test"}},"links":{}}
      // let cache = {"nodes":{"node-1929895751":{"fromLink":[],"toLink":[],"position":[253,214],"path":"test","normalizedKey":"LppE0z1iME59sHwnbncBRz1e"}},"links":{}}

      var NodeMapping = {};
      var LinkMapping = {};

      for (var id in cache.nodes) {
        var position = cache.nodes[id].position;
        var path = cache.nodes[id].path;

        this.props.getGunData(path);
        var node = this.appendNode(path, position, 1);

        NodeMapping[id] = node;
      }

      for (var _id in cache.links) {
        var data = cache.links[_id];
        var link = new this.Link(this.getRandomValue(), this);
        Object.assign(link.data, data);
        link.data.fromNode = NodeMapping[data.fromNode];
        link.data.toNode = NodeMapping[data.toNode];
        link.appendSelf().call(function (s) {
          _this9.interaction.setContext(s, 'link');
        });
        link.updateText();

        LinkMapping[_id] = link;
      }

      for (var _id2 in cache.nodes) {
        var fromLinks = cache.nodes[_id2].fromLink.map(function (v) {
          return LinkMapping[v];
        });
        NodeMapping[_id2].links.from = fromLinks;

        var toLinks = cache.nodes[_id2].toLink.map(function (v) {
          return LinkMapping[v];
        });
        NodeMapping[_id2].links.to = toLinks;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this10 = this;

      console.log('state:', this.state);
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { id: 'DropArea' },
          React.createElement(
            'svg',
            { id: 'Canvas' },
            React.createElement('g', { id: 'zoomTransform' })
          )
        ),
        React.createElement('div', { id: 'Status' }),
        React.createElement('svg', { id: 'preRender' }),
        React.createElement(NodeInteract, { ref: function ref(c) {
            _this10.nodeInteract = c;
          }, getGunData: this.props.getGunData }),
        React.createElement(LinkInteract, { ref: function ref(c) {
            _this10.linkInteract = c;
          } }),
        React.createElement(Interaction, { ref: function ref(c) {
            _this10.interaction = c;
          } })
      );
    }
  }, {
    key: 'context',
    set: function set(value) {
      console.log('set context: ', value);
      if (value === 'canvas') this.applyCanvasContext();
      if (value === 'link') this.applyLinkContext();
      if (value === 'node') this.applyNodeContext();
      if (value === 'value') this.applyValueContext();
      if (value === 'attachedValue') this.applyAttachedValueContext();
      return value;
    }
  }]);

  return SVGCanvas;
}(React.Component);

module.exports = SVGCanvas;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Interaction = function (_React$Component) {
  _inherits(Interaction, _React$Component);

  function Interaction(props) {
    _classCallCheck(this, Interaction);

    var _this = _possibleConstructorReturn(this, (Interaction.__proto__ || Object.getPrototypeOf(Interaction)).call(this, props));

    _this.state = {
      position: 'absolute'
    };

    _this.f = undefined;
    _this.target = undefined;
    return _this;
  }

  _createClass(Interaction, [{
    key: 'nodeName',
    value: function nodeName(node) {
      this.target = node;
      this.f = 'setDisplayName';

      var interaction = {
        display: 'block',
        top: node.data.position[1],
        left: node.data.position[0]
      };
      var pathInput = {
        display: 'block'
      };
      var valueInput = {
        display: 'none'
      };
      var state = {
        interaction: interaction,
        pathInput: pathInput,
        valueInput: valueInput
      };
      this.setState(state);
      this.pathInput.focus();
    }
  }, {
    key: 'nodeValue',
    value: function nodeValue(node) {
      this.target = node;
      this.f = 'addNodeValue';

      var interaction = {
        display: 'block',
        top: node.data.position[1],
        left: node.data.position[0]
      };
      var pathInput = {
        display: 'block'
      };
      var valueInput = {
        display: 'block'
      };
      var state = {
        interaction: interaction,
        pathInput: pathInput,
        valueInput: valueInput
      };
      this.setState(state);
      this.pathInput.focus();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.pathInput = document.querySelector('div#Interaction #pathInput');
      this.pathInput.addEventListener('keyup', function (event) {
        event.stopPropagation();
        if (event.key === 'Enter') {
          if (_this2.f === 'setDisplayName') {
            var name = _this2.pathInput.value;

            _this2.target.gun.path('name').put(name);
            _this2.target.data.displayName = name;
            _this2.target.toggleDisplayLevel(1);

            _this2.setState({ interaction: { display: 'none' } });
            _this2.pathInput.value = '';
          }

          if (_this2.f === 'addNodeValue') {
            _this2.valueInput.focus();
          }
        }
      });

      this.valueInput = document.querySelector('div#Interaction #valueInput');
      this.valueInput.addEventListener('keyup', function (event) {
        event.stopPropagation();
        if (event.key === 'Enter') {
          // TODO: event.preventDefault()
          var node = _this2.target;
          var path = _this2.pathInput.value;
          var value = _this2.valueInput.value;
          node.gun.path(path).put(value);

          node.updateAttachedValue(path, value);
          node.toggleDisplayLevel(2, false);

          _this2.setState({ interaction: { display: 'none' } });
          _this2.pathInput.value = '';
          _this2.valueInput.value = '';
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'Interaction', style: this.state.interaction },
        React.createElement('input', { type: 'text', id: 'pathInput', style: this.state.pathInput }),
        React.createElement('textArea', { id: 'valueInput', style: this.state.valueInput })
      );
    }
  }]);

  return Interaction;
}(React.Component);

module.exports = Interaction;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bindLinkToCanvasCache = __webpack_require__(7);

var Link = function () {
  function Link(id, canvas) {
    _classCallCheck(this, Link);

    this.canvas = canvas;
    this.data = new Proxy({}, bindLinkToCanvasCache(canvas));
    this.data.id = id;
    this.data.predicate = '';

    this.controlBezier = this.controlBezier.bind(this);
  }

  _createClass(Link, [{
    key: 'resetHandle',
    value: function resetHandle() {
      var from = this.data.from;
      var to = this.data.to;

      var tick = [(to[0] - from[0]) / 6, (to[1] - from[1]) / 6];
      this.data.controlFrom = [from[0] + tick[0], from[1] + tick[1]];
      this.data.controlTo = [to[0] - tick[0], to[1] - tick[1]];
    }
  }, {
    key: 'edit',
    value: function edit(d, i, g) {
      var handle = d3.select(this.DOM).select('g.bezierHandle');
      var display = handle.attr('display');
      if (display === 'none') handle.attr('display', 'block');
      if (display === 'block') handle.attr('display', 'none');
    }
  }, {
    key: 'updatePredicate',
    value: function updatePredicate(predicate) {
      if (!this.data.predicate && predicate !== '') this.canvas.props.connectNode(this.fromNode.data.path, predicate, this.toNode.data.path);
      this.data.predicate = predicate;
      this.updateText();
    }
  }, {
    key: 'controlBezier',
    value: function controlBezier(selection) {
      var _this = this;

      var dragBehaviour = d3.drag();

      dragBehaviour.on('drag', function (d, i, g) {
        var cursor = d3.mouse(document.querySelector('svg#Canvas #zoomTransform'));
        var handle = g[i].classList.value;
        _this.data[handle] = cursor;

        d3.select(g[i]).attr('cx', cursor[0]).attr('cy', cursor[1]);
        d3.select(_this.DOM).select('.path').attr('d', function () {
          return _this.pathDescription();
        });
      });

      selection.call(dragBehaviour);
    }
  }, {
    key: 'path',
    value: function path(simple) {
      var path = document.createElementNS(d3.namespaces.svg, 'path');
      d3.select(path).attr('class', 'path').attr('id', 'path.' + this.data.id).attr('d', this.pathDescription());

      if (simple) d3.select(path).attr('class', 'path simple');

      return path;
    }
  }, {
    key: 'handle',
    value: function handle(className, position) {
      var circle = document.createElementNS(d3.namespaces.svg, 'circle');
      d3.select(circle).attr('class', className).attr('cx', position[0]).attr('cy', position[1]).attr('r', 5).call(this.controlBezier);

      return circle;
    }
  }, {
    key: 'bezierHandle',
    value: function bezierHandle() {
      var _this2 = this;

      var controlFrom = this.data.controlFrom;
      var controlTo = this.data.controlTo;

      var group = document.createElementNS(d3.namespaces.svg, 'g');
      d3.select(group).attr('class', 'bezierHandle').attr('display', 'none');
      d3.select(group).append(function () {
        return _this2.handle('controlFrom', controlFrom);
      });
      d3.select(group).append(function () {
        return _this2.handle('controlTo', controlTo);
      });

      return group;
    }
  }, {
    key: 'text',
    value: function text() {
      var text = document.createElementNS(d3.namespaces.svg, 'text');
      d3.select(text).attr('text-anchor', 'middle').attr('dy', '4px');
      var textPath = d3.select(text).append('textPath').attr('xlink:href', '#path.' + this.data.id).attr('startOffset', '50%');
      textPath.append('tspan').attr('class', 'padding');
      textPath.append('tspan').attr('class', 'predicate').text(this.predicate);
      textPath.append('tspan').attr('class', 'padding');

      return text;
    }
  }, {
    key: 'SVGElement',
    value: function SVGElement(simple) {
      var _this3 = this;

      var id = this.data.id;
      var group = document.createElementNS(d3.namespaces.svg, 'g');
      d3.select(group).attr('class', 'links').attr('id', id).on('mousedown', function () {
        d3.event.stopPropagation();
      });

      d3.select(group).append(function () {
        return _this3.path(simple);
      });
      if (!simple) d3.select(group).append('rect').attr('class', 'textBackground');
      if (!simple) d3.select(group).append(function () {
        return _this3.text();
      });
      if (!simple) d3.select(group).append(function () {
        return _this3.bezierHandle();
      });

      return group;
    }
  }, {
    key: 'paddtext',
    value: function paddtext(textLength, pathLength, oneLetterLength) {
      var differences = pathLength - textLength;
      var oneUnitLength = oneLetterLength * 3;
      var count = (differences - differences % oneUnitLength) / oneUnitLength;
      var oneSide = count % 2 === 0 ? count / 2 : (count - 1) / 2;
      var padding = '';
      for (var i = 0; i < oneSide; i++) {
        padding = ' > ' + padding + ' > ';
      }
      d3.select(this.DOM).selectAll('textPath .padding').text(padding);
    }
  }, {
    key: 'updateText',
    value: function updateText() {
      // let link = document.querySelector(`svg #${this.id}`)
      // skip when element is has not been added to DOM Tree
      var predicate = this.data.predicate;

      var text = this.DOM.querySelector('.predicate');
      d3.select(text).text(predicate);

      var path = this.DOM.querySelector('.path');
      var pathLength = path.getTotalLength();
      // let text = document.querySelector(`svg #${this.id} text`)
      // d3.select(text).style('fill', 'black')
      // d3.select(text).select('tspan').text('a')
      // let oneLetterLength = text.getComputedTextLength()
      var oneLetterLength = 7.80126953125;
      var textLength = predicate.length * oneLetterLength;
      if (pathLength + oneLetterLength * 2 > textLength) this.paddtext(textLength, pathLength, oneLetterLength);
    }
  }, {
    key: 'pathDescription',
    value: function pathDescription(calculateHandle) {
      if (calculateHandle) this.resetHandle();

      var from = this.data.from;
      var to = this.data.to;
      var controlFrom = this.data.controlFrom;
      var controlTo = this.data.controlTo;

      var pathDescription = d3.path();
      pathDescription.moveTo(from[0], from[1]);
      pathDescription.bezierCurveTo(controlFrom[0], controlFrom[1], controlTo[0], controlTo[1], to[0], to[1]);

      return pathDescription.toString();
    }
  }, {
    key: 'appendSelf',
    value: function appendSelf(simple) {
      var _this4 = this;

      var DOM = d3.select('svg#Canvas #zoomTransform').selectAll('g.links').data([this], function (d) {
        return d ? d.data.id : undefined;
      }).enter().insert(function () {
        return _this4.SVGElement(simple);
      }, ':first-child').node();

      this.DOM = DOM;
      this.updateText();
      return d3.select(DOM);
    }
  }, {
    key: 'drawLinkTo',
    value: function drawLinkTo(position) {
      this.data.to = position;
      var link = d3.select(this.DOM);
      link.select('.path').attr('d', this.pathDescription(true));
      this.updateText();
      link.select('.controlFrom').attr('cx', this.data.controlFrom[0]).attr('cy', this.data.controlFrom[1]);
      link.select('.controlTo').attr('cx', this.data.controlTo[0]).attr('cy', this.data.controlTo[1]);
    }
  }]);

  return Link;
}();

module.exports = Link;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LinkInteract = function (_React$Component) {
  _inherits(LinkInteract, _React$Component);

  function LinkInteract(props) {
    _classCallCheck(this, LinkInteract);

    var _this = _possibleConstructorReturn(this, (LinkInteract.__proto__ || Object.getPrototypeOf(LinkInteract)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(LinkInteract, [{
    key: 'show',
    value: function show(targetLink) {
      this.setState({ targetLink: targetLink });
      var linkInteract = document.querySelector('div#LinkInteract');
      linkInteract.classList.add('show');
      linkInteract.querySelector('input').focus();
    }
  }, {
    key: 'updateTarget',
    value: function updateTarget() {
      this.hide();
      var input = document.querySelector('div#LinkInteract input');
      this.state.targetLink.updatePredicate(input.value);
      input.value = '';
    }
  }, {
    key: 'hide',
    value: function hide() {
      var linkInteract = document.querySelector('div#LinkInteract');
      linkInteract.classList.remove('show');
      var input = linkInteract.querySelector('input');
      input.blur();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var input = document.querySelector('div#LinkInteract input');
      input.addEventListener('keyup', function (event) {
        event.stopPropagation();
        if (event.key === 'Enter') _this2.updateTarget();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'LinkInteract' },
        React.createElement(
          'div',
          { className: 'center' },
          React.createElement('input', { type: 'text', id: 'predicateInput' })
        )
      );
    }
  }]);

  return LinkInteract;
}(React.Component);

module.exports = LinkInteract;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Primitives = __webpack_require__(6);
var bindNodeToCanvasCache = __webpack_require__(8);

var Node = function (_Primitives) {
  _inherits(Node, _Primitives);

  function Node(id, canvas) {
    _classCallCheck(this, Node);

    var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this));

    _this.canvas = canvas;
    _this.data = new Proxy({}, bindNodeToCanvasCache(canvas));
    _this.data.id = id;
    // this.data.boundingBoxWidth = 0
    // this.data.boundingBoxHeight = 0
    _this.data.fromLink = [];
    _this.data.toLink = [];
    _this.data.attachedValue = {};
    _this.data.detachedValue = {};
    _this.links = { from: [], to: [], detachedValue: [] };

    _this.displayLevel = function () {
      var counter = 0;
      var level = ['minimal', 'showPath', 'showValue'];
      var divider = 3;

      return function (overwrite, empty) {
        counter += 1;
        if (empty === true) divider = 2;
        if (empty === false) divider = 3;
        if (overwrite) counter = overwrite;
        return level[counter % divider];
      };
    }();
    _this.getRandomValue = canvas.getRandomValue;
    _this.measureText = canvas.measureText;
    _this.drawLinkBehaviour = _this.drawLinkBehaviour.bind(_this);
    _this.drawLinkedNodes = _this.drawLinkedNodes.bind(_this);
    _this.setNodeTarget = _this.setNodeTarget.bind(_this);
    return _this;
  }

  _createClass(Node, [{
    key: 'drawLinkBehaviour',
    value: function drawLinkBehaviour(selection) {
      var _this2 = this;

      var dragBehaviour = d3.drag();
      dragBehaviour.on('start', function (d, i, g) {
        d3.event.sourceEvent.stopPropagation();

        if (d3.event.sourceEvent.shiftKey) {
          var link = new _this2.canvas.Link('link-' + _this2.getRandomValue(), _this2.canvas);
          Object.assign(link.data, { from: _this2.data.position, to: _this2.data.position });
          link.resetHandle();
          link.appendSelf().call(function (s) {
            return _this2.canvas.setContext(s, 'link');
          });
          _this2.addFromLink(link);
        }
      });

      dragBehaviour.on('drag', function (d, i, g) {
        d3.event.sourceEvent.stopPropagation();
        var container = document.querySelector('svg#Canvas #zoomTransform');
        var position = d3.mouse(container);

        if (!d3.event.sourceEvent.shiftKey) {
          _this2.data.position = position;
          d3.select(_this2.DOM).attr('transform', 'translate(' + position[0] + ', ' + position[1] + ')');

          _this2.links.from.forEach(_this2.updateAttachedLink('from', position));
          _this2.links.to.forEach(_this2.updateAttachedLink('to', position));
          _this2.links.detachedValue.forEach(function (v) {
            v.data.from = position;
            d3.select(v.DOM).select('.path').attr('d', v.pathDescription(true));
          });
        }

        if (d3.event.sourceEvent.shiftKey) {
          var link = _this2.links.from[_this2.links.from.length - 1];
          if (_this2.canvas.targetNode) position = _this2.canvas.targetNode.data.position;
          link.drawLinkTo(position);
        }
      });

      dragBehaviour.on('end', function (d, i, g) {
        var target = _this2.canvas.targetNode;
        var link = _this2.links.from[_this2.links.from.length - 1];
        if (!target) {
          d3.select(link.DOM).remove();
          link.data.destory = link.data.id;
          _this2.popLastLink();
          _this2.canvas.target = null;
          _this2.canvas.context = 'canvas';
        }
        if (target && target.data.id !== _this2.data.id) {
          link.data.fromNode = _this2.data.id;
          link.data.toNode = target.data.id;
          link.fromNode = _this2;
          link.toNode = target;
          target.addToLink(link);
        }
      });

      selection.call(dragBehaviour);
    }
  }, {
    key: 'drawLinkedNodes',
    value: function drawLinkedNodes(selection) {
      var _this3 = this;

      // TODO: linked Nodes
      var gun = this.gun;
      selection.on('dblclick', function (d, i, g) {
        var orbit = d3.select(_this3.DOM).select('.nodeOrbit').node();
        var nodes = [];
        _this3.gun.val(function (d, k) {
          var nodeKey = [];
          for (var key in d) {
            if (_typeof(d[key]) === 'object' && key !== '_' && d[key] !== null) nodeKey.push(key);
          }
          if (nodeKey.length > 0) {
            var svg = document.querySelector('svg#Canvas');
            var nodeTranslate = _this3.DOM.getCTM();
            var pt = svg.createSVGPoint();
            var length = orbit.getTotalLength() / 2;
            var segment = length / nodeKey.length;
            var offset = length * 0.75;
            nodeKey.forEach(function (v, i) {
              var path = _this3.data.path + '.' + v;
              var position = orbit.getPointAtLength(offset + segment * i);
              pt.x = position.x;
              pt.y = position.y;
              pt = pt.matrixTransform(nodeTranslate);
              _this3.canvas.props.getGunData(path);
              var node = _this3.canvas.appendNode(path, [pt.x, pt.y], 1);
              nodes.push(node);
            });
          }
          nodes.forEach(function (v) {
            var link = new _this3.canvas.Link('link-' + _this3.getRandomValue(), _this3.canvas);
            link.data.from = _this3.data.position;
            link.data.to = v.data.position;
            link.fromNode = _this3;
            link.toNode = v;
            link.resetHandle();
            link.appendSelf().call(function (s) {
              _this3.canvas.setContext(s, 'link');
            });

            var predicate = v.data.path.split('.').pop();
            link.updatePredicate(predicate);
            _this3.links.from.push(link);
            v.links.to.push(link);
          });
        });
      });
    }
  }, {
    key: 'setNodeTarget',
    value: function setNodeTarget(selection) {
      var _this4 = this;

      selection.on('mouseenter.setTarget', function (d, i, g) {
        _this4.canvas.targetNode = _this4;
      });
      selection.on('mouseleave.setTarget', function (d, i, g) {
        _this4.canvas.targetNode = null;
      });
    }
    // TODO: can binding of links and nodes be aggregated into one function?

  }, {
    key: 'addToLink',
    value: function addToLink(link) {
      this.links.to.push(link);
      var cache = this.data.toLink;
      cache.push(link.data.id);
      this.data.toLink = cache;

      return true;
    }
  }, {
    key: 'addFromLink',
    value: function addFromLink(link) {
      this.links.from.push(link);
      var cache = this.data.fromLink;
      cache.push(link.data.id);
      this.data.fromLink = cache;

      return true;
    }
  }, {
    key: 'popLastLink',
    value: function popLastLink() {
      this.links.from.pop();
      var cache = this.data.fromLink;
      cache.pop();
      this.data.fromLink = cache;
    }
  }, {
    key: 'updateAttachedLink',
    value: function updateAttachedLink(key, position) {
      return function (v) {
        v.data[key] = position;
        //TODO: should update itself? it's acutally almost
        d3.select(v.DOM).select('.path').attr('d', v.pathDescription());
        v.updateText();
      };
    }
  }, {
    key: 'displayNodeName',
    value: function displayNodeName(name) {
      if (name) this.data.displayName = name;
      d3.select(this.DOM).select('.nodeAnchor .nodeLabel').text(this.data.displayName);
    }
  }, {
    key: 'updateAttachedValue',
    value: function updateAttachedValue(key, value) {
      var _this5 = this;

      var textLength = this.measureText(key);
      var size = { boundingBoxWidth: textLength.width, boundingBoxHeight: 0 };
      var DOM = this.DOM.querySelector('.nodeValue');
      var container = d3.select(DOM).append(function () {
        return _this5.nodeSizeHandle(size);
      }).node().parentNode;
      d3.select(DOM).select('text.valueLabel').text(key);
      this.wrapText(value, container.querySelector('.value'), size);

      var cache = this.data.attachedValue;
      cache.valueKey = key;
      cache.value = value;
      this.data.attachedValue = cache;
    }
  }, {
    key: 'updateDetachedValue',
    value: function updateDetachedValue(valueID, key, value) {
      var _this6 = this;

      var textLength = this.measureText(key);
      var size = { boundingBoxWidth: textLength.width, boundingBoxHeight: 0 };
      var DOM = document.querySelector('.Value#' + valueID);
      var container = d3.select(DOM).append(function () {
        return _this6.nodeSizeHandle(size);
      }).node().parentNode;
      d3.select(DOM).select('text.valueLabel').text(key);
      this.wrapText(value, container.querySelector('.value'), size);

      // let cache = this.data.detachedValue
      // cache[key] = {}
      // cache[key].value = value
      // // cache.valueKey = key
      // // cache.value = value
      // this.data.detachedValue = cache
    }
  }, {
    key: 'initNode',
    value: function initNode(k, cb) {
      // this.gun.val((d, k) => {
      //   this.normalizedPath = d['_']['#']
      //   this.displayNodeName()
      //   cb()
      // })
      this.canvas.props.putNewNode(k);
    }
  }, {
    key: 'getValue',
    value: function getValue(cb) {
      var _this7 = this;

      var name = this.gun._.field;
      this.displayNodeName(name);
      // in order for '.not' to be called, it has to preceds 'val'
      this.gun.not(function (k) {
        cb(null, k);
      });

      this.gun.val(function (d, k) {
        _this7.normalizedPath = d['_']['#'];
        // if (d !== null) {
        //   let name = d['name']
        //   if (name) this.displayNodeName(name)
        // }
        var valueKey = [];
        for (var key in d) {
          valueKey.push(key);
        }

        valueKey = valueKey.filter(function (v) {
          if (_typeof(d[v]) === 'object') return false;
          if (d[v] === null) return false;
          if (v === 'name') return false;
          if (_this7.data.detachedValue[v]) return false;
          return true;
        });
        cb(d, valueKey);
      });
    }
  }, {
    key: 'wrapText',
    value: function wrapText(text, container, overflow) {
      var overflowWidth = overflow.boundingBoxWidth - 15;
      var overflowHeight = overflow.boundingBoxHeight;
      var words = text.split(' ').reverse();
      var lines = [];
      var line = words.pop();
      var word = words.pop();
      while (word) {
        var linePreview = line;
        linePreview += ' ' + word;
        var _overflow = this.measureText(linePreview, 'value').width > overflowWidth;
        if (!_overflow) line += ' ' + word;
        if (_overflow) {
          lines.push(line);
          line = '' + word;
        }
        word = words.pop();
      }
      lines.push(line);
      d3.select(container).selectAll('tspan').remove();
      lines.forEach(function (v, i) {
        if ((i + 1) * 13 < overflowHeight) {
          d3.select(container).append('tspan').attr('x', 0).attr('y', '' + i * 13).text(v);
        }
      });
    }
  }, {
    key: 'nodeSizeHandle',
    value: function nodeSizeHandle(size, valueID) {
      var _this8 = this;

      var cache = valueID ? this.data.detachedValue[valueID] : this.data.attachedValue;

      if (size) {
        cache.boundingBoxWidth = size.boundingBoxWidth;
        cache.boundingBoxHeight = size.boundingBoxHeight;
      }

      var dragBehaviour = d3.drag();
      dragBehaviour.on('start', function (d, i, g) {
        d3.event.sourceEvent.stopPropagation();
      });

      dragBehaviour.on('drag', function (d, i, g) {
        // d3.event.sourceEvent.stopPropagation()
        cache.boundingBoxWidth += d3.event.dx;
        cache.boundingBoxHeight += d3.event.dy;

        var minimalWidth = _this8.measureText(cache.valueKey, 'valueLabel').width + 30;
        cache.boundingBoxWidth = cache.boundingBoxWidth < minimalWidth ? minimalWidth : cache.boundingBoxWidth;
        cache.boundingBoxHeight = cache.boundingBoxHeight < 0 ? 0 : cache.boundingBoxHeight;

        d3.select(g[i]).attr('transform', 'translate(' + cache.boundingBoxWidth + ', ' + cache.boundingBoxHeight + ')');

        if (cache.boundingBoxHeight > 0) _this8.wrapText(cache.value, g[i].parentNode.querySelector('.value'), cache);
        d3.select(g[i]).attr('transform', 'translate(' + cache.boundingBoxWidth + ', ' + cache.boundingBoxHeight + ')');

        if (valueID) _this8.data.detachedValue[valueID] = cache;
        if (!valueID) _this8.data.attachedValue = cache;
      });

      if (valueID) cache.boundingBoxWidth -= 30;
      var handle = document.createElementNS(d3.namespaces.svg, 'polygon');
      d3.select(handle).attr('class', 'boundingBoxHandle').attr('transform', 'translate(' + (cache.boundingBoxWidth += 30) + ', ' + cache.boundingBoxHeight + ')').attr('points', '5,0 5,5 0,5').call(dragBehaviour);

      return handle;
    }
  }, {
    key: 'nodeAnchor',
    value: function nodeAnchor() {
      var _this9 = this;

      var path = this.data.path;

      var group = this.group('nodeAnchor');
      var circle = this.circle('nodeAnchor');
      d3.select(circle).call(this.drawLinkBehaviour).call(this.drawLinkedNodes).call(this.setNodeTarget).call(function (s) {
        return _this9.canvas.setContext(s, 'node');
      });

      d3.select(group).append(function () {
        return circle;
      });

      d3.select(group).append('text').attr('class', 'nodeLabel').attr('transform', 'translate(-7,7)');

      return group;
    }
  }, {
    key: 'nodeAttachedValue',
    value: function nodeAttachedValue() {
      var _this10 = this;

      var group = this.group('nodeValue');
      var circle = this.circle('nodeValueAnchor');
      var dragBehaviour = d3.drag();
      var shadowValueID = void 0;

      dragBehaviour.on('start', function (d, i, g) {
        d3.event.sourceEvent.stopPropagation();

        var mouse = d3.mouse(_this10.DOM.parentNode);
        var id = 'value-' + _this10.getRandomValue();

        var value = _this10.nodeDetachedValue(id);
        d3.select(value).datum(_this10);
        d3.select(value).select('.nodeValueAnchor').call(function (s) {
          _this10.canvas.setContext(s, 'value');
        });
        d3.select(_this10.DOM.parentNode).append(function () {
          return value;
        }).attr('transform', 'translate(' + mouse[0] + ',' + mouse[1] + ')');

        var k = _this10.data.attachedValue.valueKey;
        var v = _this10.data.attachedValue.value;

        _this10.updateDetachedValue(id, k, v);
        d3.select(_this10.DOM).select('.nodeValue').remove();

        var cache = _this10.data.detachedValue;
        cache[k] = {
          position: mouse,
          value: v,
          boundingBoxWidth: _this10.data.attachedValue.boundingBoxWidth,
          boundingBoxHeight: _this10.data.attachedValue.boundingBoxHeight
        };
        _this10.data.detachedValue = cache;

        shadowValueID = id;

        var link = new _this10.canvas.Link('link-' + _this10.getRandomValue(), _this10.canvas);
        Object.assign(link.data, { from: _this10.data.position, to: _this10.data.position });
        link.resetHandle();
        link.appendSelf(true);

        link.toValue = id;
        _this10.links.detachedValue.push(link);
      });

      dragBehaviour.on('drag', function () {
        var container = _this10.DOM.parentNode;
        var mouse = d3.mouse(container);
        d3.select('.Value#' + shadowValueID).attr('transform', 'translate(' + mouse[0] + ', ' + mouse[1] + ')');

        var link = _this10.links.detachedValue[_this10.links.detachedValue.length - 1];
        link.drawLinkTo(mouse);
        // TODO: update detachedValue Cache
      });

      dragBehaviour.on('end', function () {
        //TODO: make sure it is dragged significantly 
        //TODO: should check if all value has been detached
        d3.select(_this10.DOM).append(function () {
          return _this10.nodeAttachedValue();
        });
        _this10.getValue(function (d, k) {
          if (d) {
            if (k.length === 0) return _this10.toggleDisplayLevel(1, true);
            var key = k[0];
            _this10.updateAttachedValue(key, d[key]);
            _this10.toggleDisplayLevel(2, false);
          }
          if (!d) {}
        });
      });

      d3.select(group).attr('transform', 'translate(0,40)').attr('display', 'none').append(function () {
        return _this10.circle('valueAnchorBackground');
      });

      d3.select(group).append(function () {
        return circle;
      }).call(dragBehaviour).call(function (s) {
        _this10.canvas.setContext(s, 'attachedValue');
      });

      d3.select(group).append('text').attr('class', 'valueLabel').attr('transform', 'translate(15,4)');
      d3.select(group).append('text').attr('class', 'value').attr('transform', 'translate(15, 25)');

      return group;
    }
  }, {
    key: 'nodeDetachedValue',
    value: function nodeDetachedValue(valueID) {
      var _this11 = this;

      var group = this.group('Value');
      var circle = this.circle('nodeValueAnchor');
      var dragBehaviour = d3.drag();

      dragBehaviour.on('start', function () {
        d3.event.sourceEvent.stopPropagation();
      });
      dragBehaviour.on('drag', function (d, i, g) {
        var id = g[i].parentNode.id;
        var container = _this11.DOM.parentNode;
        var mouse = d3.mouse(_this11.DOM.parentNode);
        d3.select(g[i].parentNode).attr('transform', 'translate(' + mouse[0] + ',' + mouse[1] + ')');

        var cache = _this11.data.detachedValue;
        var link = _this11.links.detachedValue.filter(function (v) {
          return v.toValue === id;
        })[0];
        link.drawLinkTo(mouse);
      });

      d3.select(group).attr('transform', 'translate(0,40)').attr('id', valueID).append(function () {
        return _this11.circle('valueAnchorBackground');
      });

      d3.select(group).append(function () {
        return circle;
      }).call(dragBehaviour).call(function (s) {
        _this11.canvas.setContext(s, 'value');
      });

      d3.select(group).append('text').attr('class', 'valueLabel').attr('transform', 'translate(15,4)');
      d3.select(group).append('text').attr('class', 'value').attr('transform', 'translate(15, 25)');

      return group;
    }
  }, {
    key: 'SVGElement',
    value: function SVGElement() {
      var _this12 = this;

      var id = this.data.id;
      var position = this.data.position;

      var group = this.group('nodes', id);

      d3.select(group).attr('transform', 'translate(' + position[0] + ', ' + position[1] + ')');
      d3.select(group).append(function () {
        return _this12.circle('nodeOrbit');
      });
      d3.select(group).append(function () {
        return _this12.nodeAnchor();
      });
      // d3.select(group).append(() => this.nodeValue())
      d3.select(group).append(function () {
        return _this12.nodeAttachedValue();
      });

      return group;
    }
  }, {
    key: 'appendSelf',
    value: function appendSelf() {
      var _this13 = this;

      var DOM = d3.select('#Canvas #zoomTransform').selectAll('.nodes').data([this], function (d) {
        return d ? d.data.path : undefined;
      }).attr('transform', 'translate(' + this.data.position[0] + ', ' + this.data.position[1] + ')').enter().append(function () {
        return _this13.SVGElement();
      }).node();

      this.DOM = DOM;

      d3.select(this.DOM).select('.nodeAnchor circle');
      d3.select(this.DOM).select('.nodeValue .nodeValueAnchor');

      return d3.select(DOM);
    }
  }, {
    key: 'toggleDisplayLevel',
    value: function toggleDisplayLevel(level, empty) {
      this.data.displayLevel = this.displayLevel(level, empty);
      var displayName = this.data.displayName ? this.data.displayName : '';
      switch (this.data.displayLevel) {
        case 'minimal':
          d3.select(this.DOM).select('.nodeLabel').text(displayName[0]);
          d3.select(this.DOM).select('.nodeValue').attr('display', 'none');
          break;
        case 'showPath':
          d3.select(this.DOM).select('.nodeLabel').text(displayName);
          break;
        case 'showValue':
          d3.select(this.DOM).select('.nodeValue').attr('display', 'true');
          break;
      }
    }
  }]);

  return Node;
}(Primitives);

module.exports = Node;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NodeInteract = function (_React$Component) {
  _inherits(NodeInteract, _React$Component);

  function NodeInteract(props) {
    _classCallCheck(this, NodeInteract);

    var _this = _possibleConstructorReturn(this, (NodeInteract.__proto__ || Object.getPrototypeOf(NodeInteract)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(NodeInteract, [{
    key: 'show',
    value: function show(targetLink) {
      var NodeInteract = document.querySelector('div#NodeInteract');
      NodeInteract.classList.add('show');
      NodeInteract.querySelector('#PathInput').focus();
      this.props.getGunData('');
      this.setState({ gunPath: '' });
    }
  }, {
    key: 'hide',
    value: function hide() {
      document.querySelector('div#NodeInteract').classList.remove('show');
      var input = document.querySelector('div#NodeInteract #PathInput');
      input.value = '';
      input.blur();
    }
  }, {
    key: 'addInputListener',
    value: function addInputListener() {
      var _this2 = this;

      var input = document.querySelector('div#NodeInteract #PathInput');
      input.addEventListener('keyup', function (event) {
        event.stopPropagation();
        _this2.props.getGunData(input.value);
        _this2.setState({ gunPath: input.value });
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.addInputListener();
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'NodeInteract' },
        React.createElement(
          'div',
          { className: 'center' },
          React.createElement(
            'div',
            { draggable: 'true', id: 'NodeSymbol' },
            React.createElement(
              'svg',
              { width: '20px', height: '20px', viewBox: '0 0 20 20' },
              React.createElement('circle', { r: '9', cx: '10', cy: '10', fill: this.state.nodeColor, stroke: 'grey', strokeWidth: '0.5' })
            )
          ),
          React.createElement('input', { type: 'text', id: 'PathInput', onChange: this.pathChange })
        )
      );
    }
  }]);

  return NodeInteract;
}(React.Component);

module.exports = NodeInteract;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Primitives = function () {
  function Primitives() {
    _classCallCheck(this, Primitives);
  }

  _createClass(Primitives, [{
    key: 'group',
    value: function group(className, idName) {
      var group = document.createElementNS(d3.namespaces.svg, 'g');
      if (className) d3.select(group).attr('class', className);
      if (idName) d3.select(group).attr('id', idName);

      return group;
    }
  }, {
    key: 'circle',
    value: function circle(styleSelector) {
      // TODO: need this, why not css
      var style = {
        'nodeValueAnchor': {
          'r': '5',
          'stroke': 'black',
          'stroke-width': '0.5',
          'fill': 'white'
        },
        'nodeAnchor': {
          'r': '25',
          'stroke': 'white',
          'fill': 'whiteSmoke',
          'stroke-width': '10px'
        },
        'valueAnchorBackground': {
          'stroke': 'white',
          'fill': 'white'
        },
        'nodeOrbit': {
          'stroke': 'rgba(255,255,255,0)',
          'fill': 'none',
          'r': '220'
        }
      };

      var circle = document.createElementNS(d3.namespaces.svg, 'circle');
      d3.select(circle).attr('class', styleSelector).attr('r', '10').attr('stroke', 'black').attr('stroke-width', 0.5);

      for (var attr in style[styleSelector]) {
        d3.select(circle).attr(attr, style[styleSelector][attr]);
      }

      return circle;
    }
  }]);

  return Primitives;
}();

module.exports = Primitives;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function bindLinkToCanvasCache(canvas) {
  var set = function set(t, p, v, r) {
    // TODO: use canvas.setState() ?
    var cache = canvas.state.cache.links;
    if (p === 'id') cache[v] = {};
    if (p === 'predicate') cache[t.id][p] = v;
    if (p === 'from') cache[t.id][p] = v;
    if (p === 'controlFrom') cache[t.id][p] = v;
    if (p === 'to') cache[t.id][p] = v;
    if (p === 'controlTo') cache[t.id][p] = v;
    if (p === 'destory') delete cache[v];
    if (p === 'fromNode') cache[t.id][p] = v;
    if (p === 'toNode') cache[t.id][p] = v;
    return Reflect.set(t, p, v, r);
  };

  return { set: set };
}

module.exports = bindLinkToCanvasCache;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function bindNodeToCanvasCache(canvas) {
  var set = function set(t, p, v, r) {
    // TODO: use canvas.setState() ?
    var cache = canvas.state.cache.nodes;
    if (p === 'id') cache[v] = {};
    if (p === 'normalizedKey') cache[t.id].normalizedKey = v;
    if (p === 'position') cache[t.id].position = v;
    if (p === 'path') cache[t.id].path = v;
    if (p === 'fromLink') cache[t.id].fromLink = v;
    if (p === 'toLink') cache[t.id].toLink = v;

    return Reflect.set(t, p, v, r);
  };

  return { set: set };
}

module.exports = bindNodeToCanvasCache;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SVGCanvas = __webpack_require__(0); // eslint-disable-line no-unused-vars

var Main = function (_React$Component) {
  _inherits(Main, _React$Component);

  function Main(props) {
    _classCallCheck(this, Main);

    var _this = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this, props));

    _this.state = {};
    var root = Gun();
    _this.gun = root.get('data').on(function (d, k) {
      console.log('change on data:', d);
    }, true);

    window.gun = _this.gun;

    _this.getGunData = _this.getGunData.bind(_this);
    _this.putNewNode = _this.putNewNode.bind(_this);
    _this.removeNode = _this.removeNode.bind(_this);
    _this.removeLink = _this.removeLink.bind(_this);
    _this.connectNode = _this.connectNode.bind(_this);
    return _this;
  }

  _createClass(Main, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // this.gun.val((data, key) => {
      //   let graphData = {}
      //   for (let key in data) {
      //     if (key !== '_' && data[key] !== null) graphData[key] = data[key]
      //   }
      //   this.setState({path: 'app', data: graphData, rootCache: graphData})
      // })

      // // keeping this data injection for now
      // const test = this.gun.get('test')
      // test.put({history: 'This is of course correct, but I\'d like to add the reason for having to do this: the JSON spec at ietf.org/rfc/rfc4627.txt contains this sentence in section 2.5: "All Unicode characters may be placed within the quotation marks except for the characters that must be escaped: quotation mark, reverse solidus, and the control characters (U+0000 through U+001F)." Since a newline is a control character, it must be escaped.\\nAccording to www.json.org JSON does accept the control sequence "\n" in strings - and if you try JSON.parse([\'"a\\na"\'])[1].charCodeAt(); that will show 10 - which was "Linefeed" the last time I checked. --- BTW: Stop screaming!'})
      // test.put({value: null})
      // test.put({name: 'test'})
      // test.put({'other value': 'this is another value'})
      // const node = this.gun.get('node')
      // test.path('node 01').put(node.path('node1').put({name: '1st node'}))
      // test.path('node 02').put(node.path('node2').put({name: '2nd node'}))
      // test.path('node 03').put(node.path('node3').put({name: '3rd node'}))
      // test.path('node 04').put(node.path('node4').put({name: '4th node'}))
      // test.path('node 05').put(node.path('node5').put({name: '5th node'}))

      // test.on((data, path) => {
      //   let graphData = {}
      //   for (let key in data) {
      //     if (key !== '_' && data[key] !== null) graphData[key] = data[key]
      //   }
      //   this.setState({data: graphData})
      // })

      // window.setTimeout(() => {
      //   this.setState({data:{}})
      // }, 1000)
      // this.gun.get('test').path('node 02').val((data, key) => {console.log(data,key);})
      // Gun().get('app').path('test').val((data, key) => {console.log(data,key);})
      // this.gun.path('node.node1').val((data, key) => {console.log(data,key);})
      // this.gun.path('node').val((data, key) => {console.log(data,key);})
    }
  }, {
    key: 'getGunData',
    value: function getGunData(path) {
      var data = this.gun.path(path);
      if (path === '') data = this.gun;

      this.setState({ data: data });
    }
  }, {
    key: 'putNewNode',
    value: function putNewNode(path) {
      this.gun.path(path).put({});
    }
  }, {
    key: 'removeNode',
    value: function removeNode(node, reset) {
      if (reset) node.gun.put(null);
      if (node.links.from) node.links.from.forEach(function (l) {
        return l.DOM.remove();
      });
      if (node.links.to) node.links.to.forEach(function (l) {
        return l.DOM.remove();
      });
      node.DOM.remove();
    }
  }, {
    key: 'removeLink',
    value: function removeLink(link, reset) {
      if (reset) link.fromNode.gun.path('' + link.data.predicate).put(null);
      link.DOM.remove();
    }
  }, {
    key: 'connectNode',
    value: function connectNode(fromPath, predicate, toPath) {
      var toNode = this.gun.path(toPath);
      this.gun.path(fromPath + '.' + predicate).put(toNode);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(SVGCanvas, { getGunData: this.getGunData, gunData: this.state.data, putNewNode: this.putNewNode, removeNode: this.removeNode, removeLink: this.removeLink, connectNode: this.connectNode });
    }
  }]);

  return Main;
}(React.Component);

var container = document.querySelector('div#main');
ReactDOM.render(React.createElement(Main, null), container);

module.exports = Main;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNGEyMjU3ZDEzYzFhNjg2NTIzZTkiLCJ3ZWJwYWNrOi8vLy4vc3JjL1NWR0NhbnZhcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvSW50ZXJhY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmsuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0xpbmtJbnRlcmFjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvTm9kZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvTm9kZUludGVyYWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9QcmltaXRpdmVzLmpzIiwid2VicGFjazovLy8uL3NyYy9iaW5kTGlua1RvQ2FudmFzQ2FjaGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2JpbmROb2RlVG9DYW52YXNDYWNoZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi5qcyJdLCJuYW1lcyI6WyJMaW5rSW50ZXJhY3QiLCJyZXF1aXJlIiwiTm9kZUludGVyYWN0IiwiSW50ZXJhY3Rpb24iLCJTVkdDYW52YXMiLCJwcm9wcyIsImNvbmV4dCIsInRhcmdldCIsInRhcmdldE5vZGUiLCJzdGF0ZSIsImNhY2hlIiwibm9kZXMiLCJsaW5rcyIsIk5vZGUiLCJMaW5rIiwic2V0R3JhcGhTaXplIiwiYmluZCIsIndpZHRoIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImhlaWdodCIsImlubmVySGVpZ2h0IiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJzdHlsZSIsInNldFByb3BlcnR5Iiwic3ZnIiwicXVlcnlTZWxlY3RvciIsInNldEF0dHJpYnV0ZSIsImV2ZW50IiwicHQiLCJjcmVhdGVTVkdQb2ludCIsIngiLCJjbGllbnRYIiwieSIsImNsaWVudFkiLCJ6b29tVHJhbnNmb3JtIiwibWF0cml4VHJhbnNmb3JtIiwiZ2V0Q1RNIiwiaW52ZXJzZSIsImdldFNjcmVlbkNUTSIsInRleHQiLCJkMyIsInNlbGVjdCIsImF0dHIiLCJyZW5kZXJlZFRleHQiLCJhcHBlbmQiLCJub2RlIiwic2l6ZSIsImdldEJCb3giLCJyZW1vdmUiLCJhIiwiVWludDMyQXJyYXkiLCJjcnlwdG8iLCJnZXRSYW5kb21WYWx1ZXMiLCJndW5QYXRoIiwicG9zaXRpb24iLCJkaXNwbGF5TGV2ZWwiLCJnZXRSYW5kb21WYWx1ZSIsImRhdGEiLCJwYXRoIiwiZ3VuIiwiZ3VuRGF0YSIsImdldFZhbHVlIiwiZCIsImsiLCJub3JtYWxpemVkUGF0aCIsImV4aXN0Tm9kZSIsImZpbHRlciIsInYiLCJhcHBlbmRTZWxmIiwicHVzaCIsImxlbmd0aCIsInRvZ2dsZURpc3BsYXlMZXZlbCIsImtleSIsInVwZGF0ZUF0dGFjaGVkVmFsdWUiLCJjb25zb2xlIiwibG9nIiwicHV0TmV3Tm9kZSIsImNhbnZhcyIsInpvb20iLCJvbiIsInRyYW5zZm9ybSIsImNhbGwiLCJEcm9wQXJlYSIsImFkZEV2ZW50TGlzdGVuZXIiLCJwcmV2ZW50RGVmYXVsdCIsIm5vZGVJbnRlcmFjdCIsImhpZGUiLCJub2RlUGF0aCIsImN1cnNvclBvaW50IiwiYXBwZW5kTm9kZSIsImNsYXNzTGlzdCIsInZhbHVlIiwic2VsZWN0aW9uIiwiY29udGV4dCIsInZhbHVlRE9NIiwicGFyZW50Tm9kZSIsInZhbHVlUGF0aCIsImlubmVySFRNTCIsImNvbW1hbmRzIiwic2hvdyIsIm9ua2V5dXAiLCJ2YWwiLCJpbnRlcmFjdGlvbiIsIm5vZGVOYW1lIiwibm9kZVZhbHVlIiwicmVtb3ZlTm9kZSIsInNoaWZ0S2V5IiwidmFsdWVJRCIsImlkIiwibGluayIsImRldGFjaGVkVmFsdWUiLCJsIiwidG9WYWx1ZSIsIkRPTSIsInB1dCIsImVkaXQiLCJsaW5rSW50ZXJhY3QiLCJyZW1vdmVMaW5rIiwib25yZXNpemUiLCJhZGRJbnRlcmFjdGlvbnMiLCJKU09OIiwic3RyaW5naWZ5IiwiTm9kZU1hcHBpbmciLCJMaW5rTWFwcGluZyIsImdldEd1bkRhdGEiLCJPYmplY3QiLCJhc3NpZ24iLCJmcm9tTm9kZSIsInRvTm9kZSIsInMiLCJzZXRDb250ZXh0IiwidXBkYXRlVGV4dCIsImZyb21MaW5rcyIsImZyb21MaW5rIiwibWFwIiwiZnJvbSIsInRvTGlua3MiLCJ0b0xpbmsiLCJ0byIsImMiLCJhcHBseUNhbnZhc0NvbnRleHQiLCJhcHBseUxpbmtDb250ZXh0IiwiYXBwbHlOb2RlQ29udGV4dCIsImFwcGx5VmFsdWVDb250ZXh0IiwiYXBwbHlBdHRhY2hlZFZhbHVlQ29udGV4dCIsIlJlYWN0IiwiQ29tcG9uZW50IiwibW9kdWxlIiwiZXhwb3J0cyIsImYiLCJ1bmRlZmluZWQiLCJkaXNwbGF5IiwidG9wIiwibGVmdCIsInBhdGhJbnB1dCIsInZhbHVlSW5wdXQiLCJzZXRTdGF0ZSIsImZvY3VzIiwic3RvcFByb3BhZ2F0aW9uIiwibmFtZSIsImRpc3BsYXlOYW1lIiwiYmluZExpbmtUb0NhbnZhc0NhY2hlIiwiUHJveHkiLCJwcmVkaWNhdGUiLCJjb250cm9sQmV6aWVyIiwidGljayIsImNvbnRyb2xGcm9tIiwiY29udHJvbFRvIiwiaSIsImciLCJoYW5kbGUiLCJjb25uZWN0Tm9kZSIsImRyYWdCZWhhdmlvdXIiLCJkcmFnIiwiY3Vyc29yIiwibW91c2UiLCJwYXRoRGVzY3JpcHRpb24iLCJzaW1wbGUiLCJjcmVhdGVFbGVtZW50TlMiLCJuYW1lc3BhY2VzIiwiY2xhc3NOYW1lIiwiY2lyY2xlIiwiZ3JvdXAiLCJ0ZXh0UGF0aCIsImJlemllckhhbmRsZSIsInRleHRMZW5ndGgiLCJwYXRoTGVuZ3RoIiwib25lTGV0dGVyTGVuZ3RoIiwiZGlmZmVyZW5jZXMiLCJvbmVVbml0TGVuZ3RoIiwiY291bnQiLCJvbmVTaWRlIiwicGFkZGluZyIsInNlbGVjdEFsbCIsImdldFRvdGFsTGVuZ3RoIiwicGFkZHRleHQiLCJjYWxjdWxhdGVIYW5kbGUiLCJyZXNldEhhbmRsZSIsIm1vdmVUbyIsImJlemllckN1cnZlVG8iLCJ0b1N0cmluZyIsImVudGVyIiwiaW5zZXJ0IiwiU1ZHRWxlbWVudCIsInRhcmdldExpbmsiLCJhZGQiLCJpbnB1dCIsInVwZGF0ZVByZWRpY2F0ZSIsImJsdXIiLCJ1cGRhdGVUYXJnZXQiLCJQcmltaXRpdmVzIiwiYmluZE5vZGVUb0NhbnZhc0NhY2hlIiwiYXR0YWNoZWRWYWx1ZSIsImNvdW50ZXIiLCJsZXZlbCIsImRpdmlkZXIiLCJvdmVyd3JpdGUiLCJlbXB0eSIsIm1lYXN1cmVUZXh0IiwiZHJhd0xpbmtCZWhhdmlvdXIiLCJkcmF3TGlua2VkTm9kZXMiLCJzZXROb2RlVGFyZ2V0Iiwic291cmNlRXZlbnQiLCJhZGRGcm9tTGluayIsImNvbnRhaW5lciIsImZvckVhY2giLCJ1cGRhdGVBdHRhY2hlZExpbmsiLCJkcmF3TGlua1RvIiwiZGVzdG9yeSIsInBvcExhc3RMaW5rIiwiYWRkVG9MaW5rIiwib3JiaXQiLCJub2RlS2V5Iiwibm9kZVRyYW5zbGF0ZSIsInNlZ21lbnQiLCJvZmZzZXQiLCJnZXRQb2ludEF0TGVuZ3RoIiwic3BsaXQiLCJwb3AiLCJib3VuZGluZ0JveFdpZHRoIiwiYm91bmRpbmdCb3hIZWlnaHQiLCJub2RlU2l6ZUhhbmRsZSIsIndyYXBUZXh0IiwidmFsdWVLZXkiLCJjYiIsIl8iLCJmaWVsZCIsImRpc3BsYXlOb2RlTmFtZSIsIm5vdCIsIm92ZXJmbG93Iiwib3ZlcmZsb3dXaWR0aCIsIm92ZXJmbG93SGVpZ2h0Iiwid29yZHMiLCJyZXZlcnNlIiwibGluZXMiLCJsaW5lIiwid29yZCIsImxpbmVQcmV2aWV3IiwiZHgiLCJkeSIsIm1pbmltYWxXaWR0aCIsInNoYWRvd1ZhbHVlSUQiLCJub2RlRGV0YWNoZWRWYWx1ZSIsImRhdHVtIiwidXBkYXRlRGV0YWNoZWRWYWx1ZSIsIm5vZGVBdHRhY2hlZFZhbHVlIiwibm9kZUFuY2hvciIsImFkZElucHV0TGlzdGVuZXIiLCJub2RlQ29sb3IiLCJwYXRoQ2hhbmdlIiwiaWROYW1lIiwic3R5bGVTZWxlY3RvciIsInNldCIsInQiLCJwIiwiciIsIlJlZmxlY3QiLCJub3JtYWxpemVkS2V5IiwiTWFpbiIsInJvb3QiLCJHdW4iLCJn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VUFBbkYsRUFBK0YsWUFBWSxLQUFLNkIsVUFBaEgsRUFBNEgsWUFBWSxLQUFLWSxVQUE3SSxFQUF5SixhQUFhLEtBQUtzRCxXQUEzSyxHQUFSO0FBQ0Q7Ozs7RUF2RmdCMUIsTUFBTUMsUzs7QUEwRnpCLElBQUk4RSxZQUFZNU0sU0FBU0ssYUFBVCxDQUF1QixVQUF2QixDQUFoQjtBQUNBb1EsU0FBU0MsTUFBVCxDQUFnQixvQkFBQyxJQUFELE9BQWhCLEVBQTBCOUQsU0FBMUI7O0FBRUE3RSxPQUFPQyxPQUFQLEdBQWlCa0ksSUFBakIiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA5KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0YTIyNTdkMTNjMWE2ODY1MjNlOSIsImxldCBMaW5rSW50ZXJhY3QgPSByZXF1aXJlKCcuL0xpbmtJbnRlcmFjdC5qcycpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbmxldCBOb2RlSW50ZXJhY3QgPSByZXF1aXJlKCcuL05vZGVJbnRlcmFjdC5qcycpIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbmxldCBJbnRlcmFjdGlvbiA9IHJlcXVpcmUoJy4vSW50ZXJhY3Rpb24uanMnKSAvL2VzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcblxuY2xhc3MgU1ZHQ2FudmFzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5jb25leHQgPSAnY2FudmFzJ1xuICAgIHRoaXMudGFyZ2V0ID0gbnVsbFxuICAgIHRoaXMudGFyZ2V0Tm9kZSA9IG51bGxcblxuICAgIHRoaXMuc3RhdGUgPSB7IGNhY2hlOiB7IG5vZGVzOiB7fSwgbGlua3M6IHt9IH0gfVxuICAgIHRoaXMubm9kZXMgPSBbXVxuXG4gICAgdGhpcy5Ob2RlID0gcmVxdWlyZSgnLi9Ob2RlLmpzJylcbiAgICB0aGlzLkxpbmsgPSByZXF1aXJlKCcuL0xpbmsuanMnKVxuICAgIHRoaXMuc2V0R3JhcGhTaXplID0gdGhpcy5zZXRHcmFwaFNpemUuYmluZCh0aGlzKVxuICB9XG5cbiAgc2V0R3JhcGhTaXplICgpIHtcbiAgICBsZXQgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDE2XG4gICAgbGV0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDM2XG5cbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoYC0td2luZG93SGVpZ2h0YCwgYCR7aGVpZ2h0fXB4YClcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoYC0td2luZG93V2lkdGhgLCBgJHt3aWR0aH1weGApXG5cbiAgICBsZXQgc3ZnID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIGAke3dpZHRofXB4YClcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBgJHtoZWlnaHR9cHhgKVxuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBgMCAwICR7d2lkdGh9ICR7aGVpZ2h0fWApXG5cbiAgICByZXR1cm4ge3dpZHRoLCBoZWlnaHR9XG4gIH1cblxuICAvLyBUT0RPOiB1c2UgZDMubW91c2UgaW5zdGVhZFxuICBjdXJzb3JQb2ludCAoZXZlbnQpIHtcbiAgICBsZXQgc3ZnID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnI0NhbnZhcycpXG4gICAgbGV0IHB0ID0gc3ZnLmNyZWF0ZVNWR1BvaW50KClcbiAgICBwdC54ID0gZXZlbnQuY2xpZW50WFxuICAgIHB0LnkgPSBldmVudC5jbGllbnRZXG5cbiAgICBsZXQgem9vbVRyYW5zZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZyNDYW52YXMgI3pvb21UcmFuc2Zvcm0nKVxuICAgIHB0ID0gcHQubWF0cml4VHJhbnNmb3JtKHpvb21UcmFuc2Zvcm0uZ2V0Q1RNKCkuaW52ZXJzZSgpKVxuICAgIHB0ID0gcHQubWF0cml4VHJhbnNmb3JtKHN2Zy5nZXRTY3JlZW5DVE0oKS5pbnZlcnNlKCkpXG4gICAgcmV0dXJuIFtwdC54LCBwdC55XVxuICB9XG5cbiAgbWVhc3VyZVRleHQgKHRleHQsIHN0eWxlKSB7XG4gICAgZDMuc2VsZWN0KCdzdmcjcHJlUmVuZGVyJykuYXR0cignY2xhc3MnLCBzdHlsZSlcbiAgICBsZXQgcmVuZGVyZWRUZXh0ID0gZDMuc2VsZWN0KCdzdmcjcHJlUmVuZGVyJykuYXBwZW5kKCd0ZXh0JykudGV4dCh0ZXh0KS5ub2RlKClcbiAgICBcbiAgICBsZXQgc2l6ZSA9IHJlbmRlcmVkVGV4dC5nZXRCQm94KClcbiAgICByZW5kZXJlZFRleHQucmVtb3ZlKClcblxuICAgIHJldHVybiBzaXplXG4gIH1cblxuICBnZXRSYW5kb21WYWx1ZSAoKSB7XG4gICAgbGV0IGEgPSBuZXcgVWludDMyQXJyYXkoMSlcbiAgICByZXR1cm4gd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYSlcbiAgfVxuXG4gIGFwcGVuZE5vZGUgKGd1blBhdGgsIHBvc2l0aW9uLCBkaXNwbGF5TGV2ZWwpIHtcbiAgICBsZXQgbm9kZSA9IG5ldyB0aGlzLk5vZGUoYG5vZGUtJHt0aGlzLmdldFJhbmRvbVZhbHVlKCl9YCwgdGhpcylcbiAgICBub2RlLmRhdGEucG9zaXRpb24gPSBwb3NpdGlvblxuICAgIG5vZGUuZGF0YS5wYXRoID0gZ3VuUGF0aFxuICAgIG5vZGUuZ3VuID0gdGhpcy5wcm9wcy5ndW5EYXRhXG4gICAgaWYgKGRpc3BsYXlMZXZlbCkgbm9kZS5kaXNwbGF5TGV2ZWwoZGlzcGxheUxldmVsKVxuICAgIG5vZGUuZ2V0VmFsdWUoKGQsIGspID0+IHtcbiAgICAgIGlmIChkKSB7XG4gICAgICAgIGxldCBub3JtYWxpemVkUGF0aCA9IG5vZGUubm9ybWFsaXplZFBhdGhcbiAgICAgICAgbGV0IGV4aXN0Tm9kZSA9IHRoaXMubm9kZXMuZmlsdGVyKCh2KSA9PiB2Lm5vcm1hbGl6ZWRQYXRoID09PSBub3JtYWxpemVkUGF0aClbMF1cbiAgICAgICAgaWYgKCFleGlzdE5vZGUpIHtcbiAgICAgICAgICBub2RlLmFwcGVuZFNlbGYoKVxuICAgICAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKVxuXG4gICAgICAgICAgaWYgKGsubGVuZ3RoID09PSAwKSByZXR1cm4gbm9kZS50b2dnbGVEaXNwbGF5TGV2ZWwoMSwgdHJ1ZSlcbiAgICAgICAgICBsZXQga2V5ID0ga1swXVxuICAgICAgICAgIG5vZGUudXBkYXRlQXR0YWNoZWRWYWx1ZShrZXksIGRba2V5XSlcbiAgICAgICAgICBub2RlLnRvZ2dsZURpc3BsYXlMZXZlbCgyLCBmYWxzZSlcbiAgICAgICAgfSBcbiAgICAgICAgaWYgKGV4aXN0Tm9kZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdkdXBsaWNhdGUgbm9kZXMnLCBleGlzdE5vZGUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghZCkge1xuICAgICAgICAvLyBhZnRlciBndW4ucHV0IHdpbGwgdHJpZ2dlciBndW4udmFsIGluc2lkZSBnZXRWYWx1ZSgpXG4gICAgICAgIHRoaXMucHJvcHMucHV0TmV3Tm9kZShndW5QYXRoKVxuICAgICAgICAvLyBub2RlLmluaXROb2RlKGd1blBhdGgsICgpID0+IHtcbiAgICAgICAgLy8gICBsZXQgbm9ybWFsaXplZFBhdGggPSBub2RlLm5vcm1hbGl6ZWRQYXRoXG4gICAgICAgIC8vICAgY29uc29sZS5sb2cobm9ybWFsaXplZFBhdGgpXG4gICAgICAgIC8vIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBub2RlXG4gIH1cblxuICBhZGRJbnRlcmFjdGlvbnMgKCkge1xuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcjQ2FudmFzJylcbiAgICBsZXQgem9vbSA9IGQzLnpvb20oKVxuICAgIHpvb20ub24oJ3pvb20nLCBmdW5jdGlvbiAoKSB7XG4gICAgICBkMy5zZWxlY3QoY2FudmFzKS5zZWxlY3QoJyN6b29tVHJhbnNmb3JtJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBkMy5ldmVudC50cmFuc2Zvcm0pXG4gICAgfSlcblxuICAgIGQzLnNlbGVjdChjYW52YXMpLmNhbGwoem9vbSlcbiAgICAub24oXCJkYmxjbGljay56b29tXCIsIG51bGwpXG5cbiAgICBsZXQgRHJvcEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjRHJvcEFyZWEnKVxuICAgIERyb3BBcmVhLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgfSlcbiAgICBEcm9wQXJlYS5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLm5vZGVJbnRlcmFjdC5oaWRlKClcblxuICAgICAgbGV0IG5vZGVQYXRoID0gdGhpcy5ub2RlSW50ZXJhY3Quc3RhdGUuZ3VuUGF0aFxuICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5jdXJzb3JQb2ludChldmVudClcbiAgICAgIHRoaXMuYXBwZW5kTm9kZShub2RlUGF0aCwgcG9zaXRpb24sIDEpXG4gICAgfSlcbiAgICBEcm9wQXJlYS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgbGV0IE5vZGVJbnRlcmFjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2RpdiNOb2RlSW50ZXJhY3QnKVxuICAgICAgaWYgKE5vZGVJbnRlcmFjdC5jbGFzc0xpc3QudmFsdWUgPT09ICdzaG93JykgdGhpcy5ub2RlSW50ZXJhY3QuaGlkZSgpXG4gICAgfSlcbiAgfVxuXG4gIHNldCBjb250ZXh0ICh2YWx1ZSkge1xuICAgIGNvbnNvbGUubG9nKCdzZXQgY29udGV4dDogJywgdmFsdWUpXG4gICAgaWYgKHZhbHVlID09PSAnY2FudmFzJykgdGhpcy5hcHBseUNhbnZhc0NvbnRleHQoKVxuICAgIGlmICh2YWx1ZSA9PT0gJ2xpbmsnKSB0aGlzLmFwcGx5TGlua0NvbnRleHQoKVxuICAgIGlmICh2YWx1ZSA9PT0gJ25vZGUnKSB0aGlzLmFwcGx5Tm9kZUNvbnRleHQoKVxuICAgIGlmICh2YWx1ZSA9PT0gJ3ZhbHVlJykgdGhpcy5hcHBseVZhbHVlQ29udGV4dCgpXG4gICAgaWYgKHZhbHVlID09PSAnYXR0YWNoZWRWYWx1ZScpIHRoaXMuYXBwbHlBdHRhY2hlZFZhbHVlQ29udGV4dCgpXG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICBzZXRDb250ZXh0IChzZWxlY3Rpb24sIGNvbnRleHQpIHtcbiAgICBzZWxlY3Rpb24ub24oJ21vdXNlZW50ZXInLCAoZCkgPT4ge1xuICAgICAgdGhpcy50YXJnZXQgPSBkXG4gICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XG4gICAgICBpZiAoY29udGV4dCA9PT0gJ3ZhbHVlJyB8fCBjb250ZXh0ID09PSAnYXR0YWNoZWRWYWx1ZScpIHtcbiAgICAgICAgdGhpcy52YWx1ZURPTSA9IHNlbGVjdGlvbi5ub2RlKCkucGFyZW50Tm9kZVxuICAgICAgICB0aGlzLnZhbHVlUGF0aCA9IHRoaXMudmFsdWVET00ucXVlcnlTZWxlY3RvcignLnZhbHVlTGFiZWwnKS5pbm5lckhUTUxcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgc2VsZWN0aW9uLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgdGhpcy50YXJnZXQgPSBudWxsXG4gICAgICB0aGlzLmNvbnRleHQgPSAnY2FudmFzJ1xuICAgIH0pXG4gIH1cblxuICBhcHBseUNhbnZhc0NvbnRleHQgKHNlbGVjdGlvbikge1xuICAgIGxldCBjb21tYW5kcyA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ24nKSB0aGlzLm5vZGVJbnRlcmFjdC5zaG93KClcbiAgICAgIC8vIGlmIChldmVudC5rZXkgPT09ICdzJykgdGhpcy5zYXZlQ2FjaGUoKVxuICAgICAgLy8gaWYgKGV2ZW50LmtleSA9PT0gJ2wnKSB0aGlzLmxvYWRDYWNoZSgpXG4gICAgfVxuXG4gICAgd2luZG93Lm9ua2V5dXAgPSBjb21tYW5kc1xuICB9XG5cbiAgYXBwbHlOb2RlQ29udGV4dCAoc2VsZWN0aW9uKSB7XG4gICAgbGV0IGNvbW1hbmRzID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAncCcpIHRoaXMudGFyZ2V0Lmd1bi52YWwoKGRhdGEsIGtleSkgPT4geyBjb25zb2xlLmxvZyhkYXRhLCBrZXkpIH0pXG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAncycpIHRoaXMudGFyZ2V0LnRvZ2dsZURpc3BsYXlMZXZlbCgpXG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAnbicpIHRoaXMuaW50ZXJhY3Rpb24ubm9kZU5hbWUodGhpcy50YXJnZXQpXG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAndicpIHRoaXMuaW50ZXJhY3Rpb24ubm9kZVZhbHVlKHRoaXMudGFyZ2V0KVxuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0JhY2tzcGFjZScpIHRoaXMucHJvcHMucmVtb3ZlTm9kZSh0aGlzLnRhcmdldCwgZXZlbnQuc2hpZnRLZXkpXG4gICAgfVxuXG4gICAgd2luZG93Lm9ua2V5dXAgPSBjb21tYW5kc1xuICB9XG5cbiAgYXBwbHlWYWx1ZUNvbnRleHQgKHNlbGVjdGlvbikge1xuICAgIGxldCBjb21tYW5kcyA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ0JhY2tzcGFjZScpIHtcbiAgICAgICAgbGV0IHZhbHVlSUQgPSB0aGlzLnZhbHVlRE9NLmlkXG4gICAgICAgIGxldCBsaW5rID0gdGhpcy50YXJnZXQubGlua3MuZGV0YWNoZWRWYWx1ZS5maWx0ZXIoKGwpID0+IGwudG9WYWx1ZSA9PT0gdmFsdWVJRClbMF1cbiAgICAgICAgdGhpcy52YWx1ZURPTS5yZW1vdmUoKVxuICAgICAgICBsaW5rLkRPTS5yZW1vdmUoKVxuICAgICAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHRoaXMudGFyZ2V0Lmd1bi5wYXRoKHRoaXMudmFsdWVQYXRoKS5wdXQobnVsbClcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cub25rZXl1cCA9IGNvbW1hbmRzXG4gIH1cblxuICBhcHBseUF0dGFjaGVkVmFsdWVDb250ZXh0IChzZWxlY3Rpb24pIHtcbiAgICBsZXQgY29tbWFuZHMgPSAoZXZlbnQpID0+IHtcbiAgICAgIC8vIGlmIChldmVudC5rZXkgPT09ICdBcnJvd1JpZ2h0JylcbiAgICAgIC8vIGlmIChldmVudC5rZXkgPT09ICdBcnJvd0xlZnQnKVxuICAgIH1cblxuICAgIHdpbmRvdy5vbmtleXVwID0gY29tbWFuZHNcbiAgfVxuXG4gIGFwcGx5TGlua0NvbnRleHQgKHNlbGVjdGlvbikge1xuICAgIGxldCBjb21tYW5kcyA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gJ2MnKSB0aGlzLnRhcmdldC5lZGl0KClcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICduJykgdGhpcy5saW5rSW50ZXJhY3Quc2hvdyh0aGlzLnRhcmdldClcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdCYWNrc3BhY2UnKSB0aGlzLnByb3BzLnJlbW92ZUxpbmsodGhpcy50YXJnZXQsIGV2ZW50LnNoaWZ0S2V5KVxuICAgIH1cblxuICAgIHdpbmRvdy5vbmtleXVwID0gY29tbWFuZHNcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLnNldEdyYXBoU2l6ZSgpXG4gICAgd2luZG93Lm9ucmVzaXplID0gdGhpcy5zZXRHcmFwaFNpemVcblxuICAgIHRoaXMuYWRkSW50ZXJhY3Rpb25zKClcbiAgICB0aGlzLmNvbnRleHQgPSAnY2FudmFzJ1xuICB9XG5cbiAgc2F2ZUNhY2hlICgpIHtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXRlLmNhY2hlKSlcbiAgfVxuXG4gIGxvYWRDYWNoZSAoKSB7XG4gICAgLy8gbGV0IGNhY2hlID0ge1wibm9kZXNcIjp7XCJub2RlLTQyMTAyNTkxMjlcIjp7XCJmcm9tTGlua1wiOltcImxpbmstMTk3NjcxOTk1N1wiXSxcInRvTGlua1wiOltcImxpbmstMzUwMTgxNzc0NFwiXSxcInBvc2l0aW9uXCI6WzQ1MSwxNThdLFwicGF0aFwiOlwiYVwifSxcIm5vZGUtMzY1MDU3ODEyMFwiOntcImZyb21MaW5rXCI6W1wibGluay0yNDc4NjQ0MzcxXCJdLFwidG9MaW5rXCI6W1wibGluay0xOTc2NzE5OTU3XCJdLFwicG9zaXRpb25cIjpbMjU2LDQyNV0sXCJwYXRoXCI6XCJiXCJ9LFwibm9kZS00MDUzOTk0NTM1XCI6e1wiZnJvbUxpbmtcIjpbXCJsaW5rLTM1MDE4MTc3NDRcIl0sXCJ0b0xpbmtcIjpbXCJsaW5rLTI0Nzg2NDQzNzFcIl0sXCJwb3NpdGlvblwiOls2MzgsNDI2XSxcInBhdGhcIjpcImNcIn19LFwibGlua3NcIjp7XCJsaW5rLTE5NzY3MTk5NTdcIjp7XCJwcmVkaWNhdGVcIjpcIlwiLFwiZnJvbVwiOls0NTEsMTU4XSxcInRvXCI6WzI1Niw0MjVdLFwiY29udHJvbEZyb21cIjpbNDE4LjUsMjAyLjVdLFwiY29udHJvbFRvXCI6WzI4OC41LDM4MC41XSxcImZyb21Ob2RlXCI6XCJub2RlLTQyMTAyNTkxMjlcIixcInRvTm9kZVwiOlwibm9kZS0zNjUwNTc4MTIwXCJ9LFwibGluay0yNDc4NjQ0MzcxXCI6e1wicHJlZGljYXRlXCI6XCJcIixcImZyb21cIjpbMjU2LDQyNV0sXCJ0b1wiOls2MzgsNDI2XSxcImNvbnRyb2xGcm9tXCI6WzMyMiw1MzFdLFwiY29udHJvbFRvXCI6WzU2Myw1MjFdLFwiZnJvbU5vZGVcIjpcIm5vZGUtMzY1MDU3ODEyMFwiLFwidG9Ob2RlXCI6XCJub2RlLTQwNTM5OTQ1MzVcIn0sXCJsaW5rLTM1MDE4MTc3NDRcIjp7XCJwcmVkaWNhdGVcIjpcIlwiLFwiZnJvbVwiOls2MzgsNDI2XSxcInRvXCI6WzQ1MSwxNThdLFwiY29udHJvbEZyb21cIjpbNjA2LjgzMzMzMzMzMzMzMzQsMzgxLjMzMzMzMzMzMzMzMzNdLFwiY29udHJvbFRvXCI6WzQ4Mi4xNjY2NjY2NjY2NjY3LDIwMi42NjY2NjY2NjY2NjY2Nl0sXCJmcm9tTm9kZVwiOlwibm9kZS00MDUzOTk0NTM1XCIsXCJ0b05vZGVcIjpcIm5vZGUtNDIxMDI1OTEyOVwifX19XG4gICAgLy8gbGV0IGNhY2hlID0ge1wibm9kZXNcIjp7XCJub2RlLTIyMjIxNjcyNDJcIjp7XCJmcm9tTGlua1wiOltdLFwidG9MaW5rXCI6W10sXCJwb3NpdGlvblwiOls0MTQsMTE4XSxcInBhdGhcIjpcInRlc3RcIn19LFwibGlua3NcIjp7fX1cbiAgICAvLyBsZXQgY2FjaGUgPSB7XCJub2Rlc1wiOntcIm5vZGUtMTkyOTg5NTc1MVwiOntcImZyb21MaW5rXCI6W10sXCJ0b0xpbmtcIjpbXSxcInBvc2l0aW9uXCI6WzI1MywyMTRdLFwicGF0aFwiOlwidGVzdFwiLFwibm9ybWFsaXplZEtleVwiOlwiTHBwRTB6MWlNRTU5c0h3bmJuY0JSejFlXCJ9fSxcImxpbmtzXCI6e319XG5cbiAgICBsZXQgTm9kZU1hcHBpbmcgPSB7fVxuICAgIGxldCBMaW5rTWFwcGluZyA9IHt9XG5cbiAgICBmb3IgKGxldCBpZCBpbiBjYWNoZS5ub2Rlcykge1xuICAgICAgbGV0IHBvc2l0aW9uID0gY2FjaGUubm9kZXNbaWRdLnBvc2l0aW9uXG4gICAgICBsZXQgcGF0aCA9IGNhY2hlLm5vZGVzW2lkXS5wYXRoXG5cbiAgICAgIHRoaXMucHJvcHMuZ2V0R3VuRGF0YShwYXRoKVxuICAgICAgbGV0IG5vZGUgPSB0aGlzLmFwcGVuZE5vZGUocGF0aCwgcG9zaXRpb24sIDEpXG5cbiAgICAgIE5vZGVNYXBwaW5nW2lkXSA9IG5vZGVcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpZCBpbiBjYWNoZS5saW5rcykge1xuICAgICAgbGV0IGRhdGEgPSBjYWNoZS5saW5rc1tpZF1cbiAgICAgIGxldCBsaW5rID0gbmV3IHRoaXMuTGluayh0aGlzLmdldFJhbmRvbVZhbHVlKCksIHRoaXMpXG4gICAgICBPYmplY3QuYXNzaWduKGxpbmsuZGF0YSwgZGF0YSlcbiAgICAgIGxpbmsuZGF0YS5mcm9tTm9kZSA9IE5vZGVNYXBwaW5nW2RhdGEuZnJvbU5vZGVdXG4gICAgICBsaW5rLmRhdGEudG9Ob2RlID0gTm9kZU1hcHBpbmdbZGF0YS50b05vZGVdXG4gICAgICBsaW5rLmFwcGVuZFNlbGYoKVxuICAgICAgLmNhbGwoKHMpID0+IHsgdGhpcy5pbnRlcmFjdGlvbi5zZXRDb250ZXh0KHMsICdsaW5rJykgfSlcbiAgICAgIGxpbmsudXBkYXRlVGV4dCgpXG5cbiAgICAgIExpbmtNYXBwaW5nW2lkXSA9IGxpbmtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpZCBpbiBjYWNoZS5ub2Rlcykge1xuICAgICAgbGV0IGZyb21MaW5rcyA9IGNhY2hlLm5vZGVzW2lkXS5mcm9tTGluay5tYXAoKHYpID0+IHtcbiAgICAgICAgcmV0dXJuIExpbmtNYXBwaW5nW3ZdXG4gICAgICB9KVxuICAgICAgTm9kZU1hcHBpbmdbaWRdLmxpbmtzLmZyb20gPSBmcm9tTGlua3NcblxuICAgICAgbGV0IHRvTGlua3MgPSBjYWNoZS5ub2Rlc1tpZF0udG9MaW5rLm1hcCgodikgPT4ge1xuICAgICAgICByZXR1cm4gTGlua01hcHBpbmdbdl1cbiAgICAgIH0pXG4gICAgICBOb2RlTWFwcGluZ1tpZF0ubGlua3MudG8gPSB0b0xpbmtzXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zb2xlLmxvZygnc3RhdGU6JywgdGhpcy5zdGF0ZSlcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBpZD1cIkRyb3BBcmVhXCI+XG4gICAgICAgICAgPHN2ZyBpZD0nQ2FudmFzJz48ZyBpZD1cInpvb21UcmFuc2Zvcm1cIj48L2c+PC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwiU3RhdHVzXCI+PC9kaXY+XG4gICAgICAgIDxzdmcgaWQ9J3ByZVJlbmRlcic+PC9zdmc+XG4gICAgICAgIDxOb2RlSW50ZXJhY3QgcmVmPXsoYykgPT4geyB0aGlzLm5vZGVJbnRlcmFjdCA9IGMgfX0gZ2V0R3VuRGF0YT17dGhpcy5wcm9wcy5nZXRHdW5EYXRhfSAvPlxuICAgICAgICA8TGlua0ludGVyYWN0IHJlZj17KGMpID0+IHsgdGhpcy5saW5rSW50ZXJhY3QgPSBjIH19IC8+XG4gICAgICAgIDxJbnRlcmFjdGlvbiByZWY9eyhjKSA9PiB7IHRoaXMuaW50ZXJhY3Rpb24gPSBjIH19IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTVkdDYW52YXNcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TVkdDYW52YXMuanMiLCJjbGFzcyBJbnRlcmFjdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgfVxuICAgIFxuICAgIHRoaXMuZiA9IHVuZGVmaW5lZFxuICAgIHRoaXMudGFyZ2V0ID0gdW5kZWZpbmVkXG4gIH1cblxuICBub2RlTmFtZSAobm9kZSkge1xuICAgIHRoaXMudGFyZ2V0ID0gbm9kZVxuICAgIHRoaXMuZiA9ICdzZXREaXNwbGF5TmFtZSdcblxuICAgIGxldCBpbnRlcmFjdGlvbiA9IHtcbiAgICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgICB0b3A6IG5vZGUuZGF0YS5wb3NpdGlvblsxXSxcbiAgICAgIGxlZnQ6IG5vZGUuZGF0YS5wb3NpdGlvblswXVxuICAgIH1cbiAgICBsZXQgcGF0aElucHV0ID0ge1xuICAgICAgZGlzcGxheTogJ2Jsb2NrJ1xuICAgIH1cbiAgICBsZXQgdmFsdWVJbnB1dCA9IHtcbiAgICAgIGRpc3BsYXk6ICdub25lJ1xuICAgIH1cbiAgICBsZXQgc3RhdGUgPSB7XG4gICAgICBpbnRlcmFjdGlvbixcbiAgICAgIHBhdGhJbnB1dCxcbiAgICAgIHZhbHVlSW5wdXRcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSlcbiAgICB0aGlzLnBhdGhJbnB1dC5mb2N1cygpXG4gIH1cblxuICBub2RlVmFsdWUgKG5vZGUpIHtcbiAgICB0aGlzLnRhcmdldCA9IG5vZGVcbiAgICB0aGlzLmYgPSAnYWRkTm9kZVZhbHVlJ1xuXG4gICAgbGV0IGludGVyYWN0aW9uID0ge1xuICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICAgIHRvcDogbm9kZS5kYXRhLnBvc2l0aW9uWzFdLFxuICAgICAgbGVmdDogbm9kZS5kYXRhLnBvc2l0aW9uWzBdXG4gICAgfVxuICAgIGxldCBwYXRoSW5wdXQgPSB7XG4gICAgICBkaXNwbGF5OiAnYmxvY2snXG4gICAgfVxuICAgIGxldCB2YWx1ZUlucHV0ID0ge1xuICAgICAgZGlzcGxheTogJ2Jsb2NrJ1xuICAgIH1cbiAgICBsZXQgc3RhdGUgPSB7XG4gICAgICBpbnRlcmFjdGlvbixcbiAgICAgIHBhdGhJbnB1dCxcbiAgICAgIHZhbHVlSW5wdXRcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSlcbiAgICB0aGlzLnBhdGhJbnB1dC5mb2N1cygpXG4gICAgXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5wYXRoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYjSW50ZXJhY3Rpb24gI3BhdGhJbnB1dCcpXG4gICAgdGhpcy5wYXRoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZlbnQpID0+IHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBpZiAoZXZlbnQua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgIGlmICh0aGlzLmYgPT09ICdzZXREaXNwbGF5TmFtZScpIHtcbiAgICAgICAgICBsZXQgbmFtZSA9IHRoaXMucGF0aElucHV0LnZhbHVlXG5cbiAgICAgICAgICB0aGlzLnRhcmdldC5ndW4ucGF0aCgnbmFtZScpLnB1dChuYW1lKVxuICAgICAgICAgIHRoaXMudGFyZ2V0LmRhdGEuZGlzcGxheU5hbWUgPSBuYW1lXG4gICAgICAgICAgdGhpcy50YXJnZXQudG9nZ2xlRGlzcGxheUxldmVsKDEpXG4gICAgICAgICAgXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aW50ZXJhY3Rpb246e2Rpc3BsYXk6ICdub25lJ319KVxuICAgICAgICAgIHRoaXMucGF0aElucHV0LnZhbHVlID0gJydcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmYgPT09ICdhZGROb2RlVmFsdWUnKSB7XG4gICAgICAgICAgdGhpcy52YWx1ZUlucHV0LmZvY3VzKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnZhbHVlSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYjSW50ZXJhY3Rpb24gI3ZhbHVlSW5wdXQnKVxuICAgIHRoaXMudmFsdWVJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgLy8gVE9ETzogZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICBsZXQgbm9kZSA9IHRoaXMudGFyZ2V0XG4gICAgICAgIGxldCBwYXRoID0gdGhpcy5wYXRoSW5wdXQudmFsdWVcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy52YWx1ZUlucHV0LnZhbHVlXG4gICAgICAgIG5vZGUuZ3VuLnBhdGgocGF0aCkucHV0KHZhbHVlKVxuXG4gICAgICAgIG5vZGUudXBkYXRlQXR0YWNoZWRWYWx1ZShwYXRoLCB2YWx1ZSlcbiAgICAgICAgbm9kZS50b2dnbGVEaXNwbGF5TGV2ZWwoMiwgZmFsc2UpXG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aW50ZXJhY3Rpb246e2Rpc3BsYXk6ICdub25lJ319KVxuICAgICAgICB0aGlzLnBhdGhJbnB1dC52YWx1ZSA9ICcnXG4gICAgICAgIHRoaXMudmFsdWVJbnB1dC52YWx1ZSA9ICcnXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9XCJJbnRlcmFjdGlvblwiIHN0eWxlPXt0aGlzLnN0YXRlLmludGVyYWN0aW9ufSA+XG4gICAgICAgIDxpbnB1dCB0eXBlPSd0ZXh0JyBpZD1cInBhdGhJbnB1dFwiIHN0eWxlPXt0aGlzLnN0YXRlLnBhdGhJbnB1dH0gLz5cbiAgICAgICAgPHRleHRBcmVhIGlkPVwidmFsdWVJbnB1dFwiIHN0eWxlPXt0aGlzLnN0YXRlLnZhbHVlSW5wdXR9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmFjdGlvblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0ludGVyYWN0aW9uLmpzIiwibGV0IGJpbmRMaW5rVG9DYW52YXNDYWNoZSA9IHJlcXVpcmUoJy4vYmluZExpbmtUb0NhbnZhc0NhY2hlLmpzJylcblxuY2xhc3MgTGluayB7XG4gIGNvbnN0cnVjdG9yIChpZCwgY2FudmFzKSB7XG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXNcbiAgICB0aGlzLmRhdGEgPSBuZXcgUHJveHkoe30sIGJpbmRMaW5rVG9DYW52YXNDYWNoZShjYW52YXMpKVxuICAgIHRoaXMuZGF0YS5pZCA9IGlkXG4gICAgdGhpcy5kYXRhLnByZWRpY2F0ZSA9ICcnXG5cbiAgICB0aGlzLmNvbnRyb2xCZXppZXIgPSB0aGlzLmNvbnRyb2xCZXppZXIuYmluZCh0aGlzKVxuICB9XG5cbiAgcmVzZXRIYW5kbGUgKCkge1xuICAgIGxldCBmcm9tID0gdGhpcy5kYXRhLmZyb21cbiAgICBsZXQgdG8gPSB0aGlzLmRhdGEudG9cblxuICAgIGxldCB0aWNrID0gWyh0b1swXSAtIGZyb21bMF0pIC8gNiwgKHRvWzFdIC0gZnJvbVsxXSkgLyA2XVxuICAgIHRoaXMuZGF0YS5jb250cm9sRnJvbSA9IFtmcm9tWzBdICsgdGlja1swXSwgZnJvbVsxXSArIHRpY2tbMV1dXG4gICAgdGhpcy5kYXRhLmNvbnRyb2xUbyA9IFt0b1swXSAtIHRpY2tbMF0sIHRvWzFdIC0gdGlja1sxXV1cbiAgfVxuXG4gIGVkaXQgKGQsIGksIGcpIHtcbiAgICBsZXQgaGFuZGxlID0gZDMuc2VsZWN0KHRoaXMuRE9NKS5zZWxlY3QoJ2cuYmV6aWVySGFuZGxlJylcbiAgICBsZXQgZGlzcGxheSA9IGhhbmRsZS5hdHRyKCdkaXNwbGF5JylcbiAgICBpZiAoZGlzcGxheSA9PT0gJ25vbmUnKSBoYW5kbGUuYXR0cignZGlzcGxheScsICdibG9jaycpXG4gICAgaWYgKGRpc3BsYXkgPT09ICdibG9jaycpIGhhbmRsZS5hdHRyKCdkaXNwbGF5JywgJ25vbmUnKVxuICB9XG5cbiAgdXBkYXRlUHJlZGljYXRlIChwcmVkaWNhdGUpIHtcbiAgICBpZiAoIXRoaXMuZGF0YS5wcmVkaWNhdGUgJiYgcHJlZGljYXRlICE9PSAnJykgdGhpcy5jYW52YXMucHJvcHMuY29ubmVjdE5vZGUodGhpcy5mcm9tTm9kZS5kYXRhLnBhdGgsIHByZWRpY2F0ZSwgdGhpcy50b05vZGUuZGF0YS5wYXRoKVxuICAgIHRoaXMuZGF0YS5wcmVkaWNhdGUgPSBwcmVkaWNhdGVcbiAgICB0aGlzLnVwZGF0ZVRleHQoKVxuICB9XG5cbiAgY29udHJvbEJlemllciAoc2VsZWN0aW9uKSB7XG4gICAgbGV0IGRyYWdCZWhhdmlvdXIgPSBkMy5kcmFnKClcblxuICAgIGRyYWdCZWhhdmlvdXIub24oJ2RyYWcnLCAoZCwgaSwgZykgPT4ge1xuICAgICAgbGV0IGN1cnNvciA9IGQzLm1vdXNlKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZyNDYW52YXMgI3pvb21UcmFuc2Zvcm0nKSlcbiAgICAgIGxldCBoYW5kbGUgPSBnW2ldLmNsYXNzTGlzdC52YWx1ZVxuICAgICAgdGhpcy5kYXRhW2hhbmRsZV0gPSBjdXJzb3JcblxuICAgICAgZDMuc2VsZWN0KGdbaV0pLmF0dHIoJ2N4JywgY3Vyc29yWzBdKS5hdHRyKCdjeScsIGN1cnNvclsxXSlcbiAgICAgIGQzLnNlbGVjdCh0aGlzLkRPTSkuc2VsZWN0KCcucGF0aCcpLmF0dHIoJ2QnLCAoKSA9PiB0aGlzLnBhdGhEZXNjcmlwdGlvbigpKVxuICAgIH0pXG5cbiAgICBzZWxlY3Rpb24uY2FsbChkcmFnQmVoYXZpb3VyKVxuICB9XG5cbiAgcGF0aCAoc2ltcGxlKSB7XG4gICAgbGV0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoZDMubmFtZXNwYWNlcy5zdmcsICdwYXRoJylcbiAgICBkMy5zZWxlY3QocGF0aClcbiAgICAuYXR0cignY2xhc3MnLCAncGF0aCcpLmF0dHIoJ2lkJywgYHBhdGguJHt0aGlzLmRhdGEuaWR9YClcbiAgICAuYXR0cignZCcsIHRoaXMucGF0aERlc2NyaXB0aW9uKCkpXG5cbiAgICBpZiAoc2ltcGxlKSBkMy5zZWxlY3QocGF0aCkuYXR0cignY2xhc3MnLCAncGF0aCBzaW1wbGUnKVxuXG4gICAgcmV0dXJuIHBhdGhcbiAgfVxuXG4gIGhhbmRsZSAoY2xhc3NOYW1lLCBwb3NpdGlvbikge1xuICAgIGxldCBjaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoZDMubmFtZXNwYWNlcy5zdmcsICdjaXJjbGUnKVxuICAgIGQzLnNlbGVjdChjaXJjbGUpLmF0dHIoJ2NsYXNzJywgY2xhc3NOYW1lKVxuICAgIC5hdHRyKCdjeCcsIHBvc2l0aW9uWzBdKS5hdHRyKCdjeScsIHBvc2l0aW9uWzFdKVxuICAgIC5hdHRyKCdyJywgNSlcbiAgICAuY2FsbCh0aGlzLmNvbnRyb2xCZXppZXIpXG5cbiAgICByZXR1cm4gY2lyY2xlXG4gIH1cblxuICBiZXppZXJIYW5kbGUgKCkge1xuICAgIGxldCBjb250cm9sRnJvbSA9IHRoaXMuZGF0YS5jb250cm9sRnJvbVxuICAgIGxldCBjb250cm9sVG8gPSB0aGlzLmRhdGEuY29udHJvbFRvXG5cbiAgICBsZXQgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoZDMubmFtZXNwYWNlcy5zdmcsICdnJylcbiAgICBkMy5zZWxlY3QoZ3JvdXApLmF0dHIoJ2NsYXNzJywgJ2JlemllckhhbmRsZScpLmF0dHIoJ2Rpc3BsYXknLCAnbm9uZScpXG4gICAgZDMuc2VsZWN0KGdyb3VwKS5hcHBlbmQoKCkgPT4gdGhpcy5oYW5kbGUoJ2NvbnRyb2xGcm9tJywgY29udHJvbEZyb20pKVxuICAgIGQzLnNlbGVjdChncm91cCkuYXBwZW5kKCgpID0+IHRoaXMuaGFuZGxlKCdjb250cm9sVG8nLCBjb250cm9sVG8pKVxuXG4gICAgcmV0dXJuIGdyb3VwXG4gIH1cblxuICB0ZXh0ICgpIHtcbiAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhkMy5uYW1lc3BhY2VzLnN2ZywgJ3RleHQnKVxuICAgIGQzLnNlbGVjdCh0ZXh0KS5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKS5hdHRyKCdkeScsICc0cHgnKVxuICAgIGxldCB0ZXh0UGF0aCA9IGQzLnNlbGVjdCh0ZXh0KS5hcHBlbmQoJ3RleHRQYXRoJykuYXR0cigneGxpbms6aHJlZicsIGAjcGF0aC4ke3RoaXMuZGF0YS5pZH1gKS5hdHRyKCdzdGFydE9mZnNldCcsICc1MCUnKVxuICAgIHRleHRQYXRoLmFwcGVuZCgndHNwYW4nKS5hdHRyKCdjbGFzcycsICdwYWRkaW5nJylcbiAgICB0ZXh0UGF0aC5hcHBlbmQoJ3RzcGFuJykuYXR0cignY2xhc3MnLCAncHJlZGljYXRlJykudGV4dCh0aGlzLnByZWRpY2F0ZSlcbiAgICB0ZXh0UGF0aC5hcHBlbmQoJ3RzcGFuJykuYXR0cignY2xhc3MnLCAncGFkZGluZycpXG5cbiAgICByZXR1cm4gdGV4dFxuICB9XG5cbiAgU1ZHRWxlbWVudCAoc2ltcGxlKSB7XG4gICAgbGV0IGlkID0gdGhpcy5kYXRhLmlkXG4gICAgbGV0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKGQzLm5hbWVzcGFjZXMuc3ZnLCAnZycpXG4gICAgZDMuc2VsZWN0KGdyb3VwKS5hdHRyKCdjbGFzcycsICdsaW5rcycpLmF0dHIoJ2lkJywgaWQpXG4gICAgLm9uKCdtb3VzZWRvd24nLCAoKSA9PiB7IGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpIH0pXG5cbiAgICBkMy5zZWxlY3QoZ3JvdXApLmFwcGVuZCgoKSA9PiB0aGlzLnBhdGgoc2ltcGxlKSlcbiAgICBpZiAoIXNpbXBsZSkgZDMuc2VsZWN0KGdyb3VwKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdjbGFzcycsICd0ZXh0QmFja2dyb3VuZCcpXG4gICAgaWYgKCFzaW1wbGUpIGQzLnNlbGVjdChncm91cCkuYXBwZW5kKCgpID0+IHRoaXMudGV4dCgpKVxuICAgIGlmICghc2ltcGxlKSBkMy5zZWxlY3QoZ3JvdXApLmFwcGVuZCgoKSA9PiB0aGlzLmJlemllckhhbmRsZSgpKVxuXG4gICAgcmV0dXJuIGdyb3VwXG4gIH1cblxuICBwYWRkdGV4dCAodGV4dExlbmd0aCwgcGF0aExlbmd0aCwgb25lTGV0dGVyTGVuZ3RoKSB7XG4gICAgbGV0IGRpZmZlcmVuY2VzID0gcGF0aExlbmd0aCAtIHRleHRMZW5ndGhcbiAgICBsZXQgb25lVW5pdExlbmd0aCA9IG9uZUxldHRlckxlbmd0aCAqIDNcbiAgICBsZXQgY291bnQgPSAoZGlmZmVyZW5jZXMgLSAoZGlmZmVyZW5jZXMgJSBvbmVVbml0TGVuZ3RoKSkgLyBvbmVVbml0TGVuZ3RoXG4gICAgbGV0IG9uZVNpZGUgPSAoKGNvdW50ICUgMikgPT09IDApID8gY291bnQgLyAyIDogKGNvdW50IC0gMSkgLyAyXG4gICAgbGV0IHBhZGRpbmcgPSAnJ1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb25lU2lkZTsgaSsrKSB7XG4gICAgICBwYWRkaW5nID0gJyA+ICcgKyBwYWRkaW5nICsgJyA+ICdcbiAgICB9XG4gICAgZDMuc2VsZWN0KHRoaXMuRE9NKS5zZWxlY3RBbGwoJ3RleHRQYXRoIC5wYWRkaW5nJykudGV4dChwYWRkaW5nKVxuICB9XG5cbiAgdXBkYXRlVGV4dCAoKSB7XG4gICAgLy8gbGV0IGxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzdmcgIyR7dGhpcy5pZH1gKVxuICAgIC8vIHNraXAgd2hlbiBlbGVtZW50IGlzIGhhcyBub3QgYmVlbiBhZGRlZCB0byBET00gVHJlZVxuICAgIGxldCBwcmVkaWNhdGUgPSB0aGlzLmRhdGEucHJlZGljYXRlXG5cbiAgICBsZXQgdGV4dCA9IHRoaXMuRE9NLnF1ZXJ5U2VsZWN0b3IoJy5wcmVkaWNhdGUnKVxuICAgIGQzLnNlbGVjdCh0ZXh0KS50ZXh0KHByZWRpY2F0ZSlcblxuICAgIGxldCBwYXRoID0gdGhpcy5ET00ucXVlcnlTZWxlY3RvcignLnBhdGgnKVxuICAgIGxldCBwYXRoTGVuZ3RoID0gcGF0aC5nZXRUb3RhbExlbmd0aCgpXG4gICAgLy8gbGV0IHRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzdmcgIyR7dGhpcy5pZH0gdGV4dGApXG4gICAgLy8gZDMuc2VsZWN0KHRleHQpLnN0eWxlKCdmaWxsJywgJ2JsYWNrJylcbiAgICAvLyBkMy5zZWxlY3QodGV4dCkuc2VsZWN0KCd0c3BhbicpLnRleHQoJ2EnKVxuICAgIC8vIGxldCBvbmVMZXR0ZXJMZW5ndGggPSB0ZXh0LmdldENvbXB1dGVkVGV4dExlbmd0aCgpXG4gICAgbGV0IG9uZUxldHRlckxlbmd0aCA9IDcuODAxMjY5NTMxMjVcbiAgICBsZXQgdGV4dExlbmd0aCA9IHByZWRpY2F0ZS5sZW5ndGggKiBvbmVMZXR0ZXJMZW5ndGhcbiAgICBpZiAocGF0aExlbmd0aCArIG9uZUxldHRlckxlbmd0aCAqIDIgPiB0ZXh0TGVuZ3RoKSB0aGlzLnBhZGR0ZXh0KHRleHRMZW5ndGgsIHBhdGhMZW5ndGgsIG9uZUxldHRlckxlbmd0aClcbiAgfVxuXG4gIHBhdGhEZXNjcmlwdGlvbiAoY2FsY3VsYXRlSGFuZGxlKSB7XG4gICAgaWYgKGNhbGN1bGF0ZUhhbmRsZSkgdGhpcy5yZXNldEhhbmRsZSgpXG5cbiAgICBsZXQgZnJvbSA9IHRoaXMuZGF0YS5mcm9tXG4gICAgbGV0IHRvID0gdGhpcy5kYXRhLnRvXG4gICAgbGV0IGNvbnRyb2xGcm9tID0gdGhpcy5kYXRhLmNvbnRyb2xGcm9tXG4gICAgbGV0IGNvbnRyb2xUbyA9IHRoaXMuZGF0YS5jb250cm9sVG9cblxuICAgIGxldCBwYXRoRGVzY3JpcHRpb24gPSBkMy5wYXRoKClcbiAgICBwYXRoRGVzY3JpcHRpb24ubW92ZVRvKGZyb21bMF0sIGZyb21bMV0pXG4gICAgcGF0aERlc2NyaXB0aW9uLmJlemllckN1cnZlVG8oY29udHJvbEZyb21bMF0sIGNvbnRyb2xGcm9tWzFdLCBjb250cm9sVG9bMF0sIGNvbnRyb2xUb1sxXSwgdG9bMF0sIHRvWzFdKVxuXG4gICAgcmV0dXJuIHBhdGhEZXNjcmlwdGlvbi50b1N0cmluZygpXG4gIH1cblxuICBhcHBlbmRTZWxmIChzaW1wbGUpIHtcbiAgICBsZXQgRE9NID0gZDMuc2VsZWN0KCdzdmcjQ2FudmFzICN6b29tVHJhbnNmb3JtJykuc2VsZWN0QWxsKCdnLmxpbmtzJylcbiAgICAuZGF0YShbdGhpc10sIChkKSA9PiBkID8gZC5kYXRhLmlkIDogdW5kZWZpbmVkKS5lbnRlcigpXG4gICAgLmluc2VydCgoKSA9PiB0aGlzLlNWR0VsZW1lbnQoc2ltcGxlKSwgJzpmaXJzdC1jaGlsZCcpXG4gICAgLm5vZGUoKVxuXG4gICAgdGhpcy5ET00gPSBET01cbiAgICB0aGlzLnVwZGF0ZVRleHQoKVxuICAgIHJldHVybiBkMy5zZWxlY3QoRE9NKVxuICB9XG5cbiAgZHJhd0xpbmtUbyAocG9zaXRpb24pIHtcbiAgICB0aGlzLmRhdGEudG8gPSBwb3NpdGlvblxuICAgIGxldCBsaW5rID0gZDMuc2VsZWN0KHRoaXMuRE9NKVxuICAgIGxpbmsuc2VsZWN0KCcucGF0aCcpLmF0dHIoJ2QnLCB0aGlzLnBhdGhEZXNjcmlwdGlvbih0cnVlKSlcbiAgICB0aGlzLnVwZGF0ZVRleHQoKVxuICAgIGxpbmsuc2VsZWN0KCcuY29udHJvbEZyb20nKS5hdHRyKCdjeCcsIHRoaXMuZGF0YS5jb250cm9sRnJvbVswXSkuYXR0cignY3knLCB0aGlzLmRhdGEuY29udHJvbEZyb21bMV0pXG4gICAgbGluay5zZWxlY3QoJy5jb250cm9sVG8nKS5hdHRyKCdjeCcsIHRoaXMuZGF0YS5jb250cm9sVG9bMF0pLmF0dHIoJ2N5JywgdGhpcy5kYXRhLmNvbnRyb2xUb1sxXSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9MaW5rLmpzIiwiY2xhc3MgTGlua0ludGVyYWN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnN0YXRlID0ge31cbiAgfVxuXG4gIHNob3cgKHRhcmdldExpbmspIHtcbiAgICB0aGlzLnNldFN0YXRlKHt0YXJnZXRMaW5rfSlcbiAgICBsZXQgbGlua0ludGVyYWN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2I0xpbmtJbnRlcmFjdCcpXG4gICAgbGlua0ludGVyYWN0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxuICAgIGxpbmtJbnRlcmFjdC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLmZvY3VzKClcbiAgfVxuXG4gIHVwZGF0ZVRhcmdldCAoKSB7XG4gICAgdGhpcy5oaWRlKClcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYjTGlua0ludGVyYWN0IGlucHV0JylcbiAgICB0aGlzLnN0YXRlLnRhcmdldExpbmsudXBkYXRlUHJlZGljYXRlKGlucHV0LnZhbHVlKVxuICAgIGlucHV0LnZhbHVlID0gJydcbiAgfVxuXG4gIGhpZGUgKCkge1xuICAgIGxldCBsaW5rSW50ZXJhY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYjTGlua0ludGVyYWN0JylcbiAgICBsaW5rSW50ZXJhY3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG4gICAgbGV0IGlucHV0ID0gbGlua0ludGVyYWN0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JylcbiAgICBpbnB1dC5ibHVyKClcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYjTGlua0ludGVyYWN0IGlucHV0JylcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicpIHRoaXMudXBkYXRlVGFyZ2V0KClcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD1cIkxpbmtJbnRlcmFjdFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNlbnRlclwiPlxuICAgICAgICAgPGlucHV0IHR5cGU9J3RleHQnIGlkPVwicHJlZGljYXRlSW5wdXRcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmtJbnRlcmFjdFxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0xpbmtJbnRlcmFjdC5qcyIsImxldCBQcmltaXRpdmVzID0gcmVxdWlyZSgnLi9QcmltaXRpdmVzLmpzJylcbmxldCBiaW5kTm9kZVRvQ2FudmFzQ2FjaGUgPSByZXF1aXJlKCcuL2JpbmROb2RlVG9DYW52YXNDYWNoZS5qcycpXG5cbmNsYXNzIE5vZGUgZXh0ZW5kcyBQcmltaXRpdmVzIHtcbiAgY29uc3RydWN0b3IgKGlkLCBjYW52YXMpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXNcbiAgICB0aGlzLmRhdGEgPSBuZXcgUHJveHkoe30sIGJpbmROb2RlVG9DYW52YXNDYWNoZShjYW52YXMpKVxuICAgIHRoaXMuZGF0YS5pZCA9IGlkXG4gICAgLy8gdGhpcy5kYXRhLmJvdW5kaW5nQm94V2lkdGggPSAwXG4gICAgLy8gdGhpcy5kYXRhLmJvdW5kaW5nQm94SGVpZ2h0ID0gMFxuICAgIHRoaXMuZGF0YS5mcm9tTGluayA9IFtdXG4gICAgdGhpcy5kYXRhLnRvTGluayA9IFtdXG4gICAgdGhpcy5kYXRhLmF0dGFjaGVkVmFsdWUgPSB7fVxuICAgIHRoaXMuZGF0YS5kZXRhY2hlZFZhbHVlID0ge31cbiAgICB0aGlzLmxpbmtzID0ge2Zyb206IFtdLCB0bzogW10sIGRldGFjaGVkVmFsdWU6IFtdfVxuXG4gICAgdGhpcy5kaXNwbGF5TGV2ZWwgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGNvdW50ZXIgPSAwXG4gICAgICBsZXQgbGV2ZWwgPSBbJ21pbmltYWwnLCAnc2hvd1BhdGgnLCAnc2hvd1ZhbHVlJ11cbiAgICAgIGxldCBkaXZpZGVyID0gM1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKG92ZXJ3cml0ZSwgZW1wdHkpIHtcbiAgICAgICAgY291bnRlciArPSAxXG4gICAgICAgIGlmIChlbXB0eSA9PT0gdHJ1ZSkgZGl2aWRlciA9IDJcbiAgICAgICAgaWYgKGVtcHR5ID09PSBmYWxzZSkgZGl2aWRlciA9IDNcbiAgICAgICAgaWYgKG92ZXJ3cml0ZSkgY291bnRlciA9IG92ZXJ3cml0ZVxuICAgICAgICByZXR1cm4gbGV2ZWxbY291bnRlciAlIGRpdmlkZXJdXG4gICAgICB9XG4gICAgfSkoKVxuICAgIHRoaXMuZ2V0UmFuZG9tVmFsdWUgPSBjYW52YXMuZ2V0UmFuZG9tVmFsdWVcbiAgICB0aGlzLm1lYXN1cmVUZXh0ID0gY2FudmFzLm1lYXN1cmVUZXh0XG4gICAgdGhpcy5kcmF3TGlua0JlaGF2aW91ciA9IHRoaXMuZHJhd0xpbmtCZWhhdmlvdXIuYmluZCh0aGlzKVxuICAgIHRoaXMuZHJhd0xpbmtlZE5vZGVzID0gdGhpcy5kcmF3TGlua2VkTm9kZXMuYmluZCh0aGlzKVxuICAgIHRoaXMuc2V0Tm9kZVRhcmdldCA9IHRoaXMuc2V0Tm9kZVRhcmdldC5iaW5kKHRoaXMpXG4gIH1cblxuICBkcmF3TGlua0JlaGF2aW91ciAoc2VsZWN0aW9uKSB7XG4gICAgbGV0IGRyYWdCZWhhdmlvdXIgPSBkMy5kcmFnKClcbiAgICBkcmFnQmVoYXZpb3VyLm9uKCdzdGFydCcsIChkLCBpLCBnKSA9PiB7XG4gICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgICBpZiAoZDMuZXZlbnQuc291cmNlRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgbGV0IGxpbmsgPSBuZXcgdGhpcy5jYW52YXMuTGluayhgbGluay0ke3RoaXMuZ2V0UmFuZG9tVmFsdWUoKX1gLCB0aGlzLmNhbnZhcylcbiAgICAgICAgT2JqZWN0LmFzc2lnbihsaW5rLmRhdGEsIHtmcm9tOiB0aGlzLmRhdGEucG9zaXRpb24sIHRvOiB0aGlzLmRhdGEucG9zaXRpb259KVxuICAgICAgICBsaW5rLnJlc2V0SGFuZGxlKClcbiAgICAgICAgbGluay5hcHBlbmRTZWxmKClcbiAgICAgICAgLmNhbGwoKHMpID0+IHRoaXMuY2FudmFzLnNldENvbnRleHQocywgJ2xpbmsnKSlcbiAgICAgICAgdGhpcy5hZGRGcm9tTGluayhsaW5rKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBkcmFnQmVoYXZpb3VyLm9uKCdkcmFnJywgKGQsIGksIGcpID0+IHtcbiAgICAgIGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBsZXQgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnI0NhbnZhcyAjem9vbVRyYW5zZm9ybScpXG4gICAgICBsZXQgcG9zaXRpb24gPSBkMy5tb3VzZShjb250YWluZXIpXG5cbiAgICAgIGlmICghZDMuZXZlbnQuc291cmNlRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgdGhpcy5kYXRhLnBvc2l0aW9uID0gcG9zaXRpb25cbiAgICAgICAgZDMuc2VsZWN0KHRoaXMuRE9NKS5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7cG9zaXRpb25bMF19LCAke3Bvc2l0aW9uWzFdfSlgKVxuXG4gICAgICAgIHRoaXMubGlua3MuZnJvbS5mb3JFYWNoKHRoaXMudXBkYXRlQXR0YWNoZWRMaW5rKCdmcm9tJywgcG9zaXRpb24pKVxuICAgICAgICB0aGlzLmxpbmtzLnRvLmZvckVhY2godGhpcy51cGRhdGVBdHRhY2hlZExpbmsoJ3RvJywgcG9zaXRpb24pKVxuICAgICAgICB0aGlzLmxpbmtzLmRldGFjaGVkVmFsdWUuZm9yRWFjaCgodikgPT4ge1xuICAgICAgICAgIHYuZGF0YS5mcm9tID0gcG9zaXRpb25cbiAgICAgICAgICBkMy5zZWxlY3Qodi5ET00pLnNlbGVjdCgnLnBhdGgnKS5hdHRyKCdkJywgdi5wYXRoRGVzY3JpcHRpb24odHJ1ZSkpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGlmIChkMy5ldmVudC5zb3VyY2VFdmVudC5zaGlmdEtleSkge1xuICAgICAgICBsZXQgbGluayA9IHRoaXMubGlua3MuZnJvbVt0aGlzLmxpbmtzLmZyb20ubGVuZ3RoIC0gMV1cbiAgICAgICAgaWYgKHRoaXMuY2FudmFzLnRhcmdldE5vZGUpIHBvc2l0aW9uID0gdGhpcy5jYW52YXMudGFyZ2V0Tm9kZS5kYXRhLnBvc2l0aW9uXG4gICAgICAgIGxpbmsuZHJhd0xpbmtUbyhwb3NpdGlvbilcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgZHJhZ0JlaGF2aW91ci5vbignZW5kJywgKGQsIGksIGcpID0+IHtcbiAgICAgIGxldCB0YXJnZXQgPSB0aGlzLmNhbnZhcy50YXJnZXROb2RlXG4gICAgICBsZXQgbGluayA9IHRoaXMubGlua3MuZnJvbVt0aGlzLmxpbmtzLmZyb20ubGVuZ3RoIC0gMV1cbiAgICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICAgIGQzLnNlbGVjdChsaW5rLkRPTSkucmVtb3ZlKClcbiAgICAgICAgbGluay5kYXRhLmRlc3RvcnkgPSBsaW5rLmRhdGEuaWRcbiAgICAgICAgdGhpcy5wb3BMYXN0TGluaygpXG4gICAgICAgIHRoaXMuY2FudmFzLnRhcmdldCA9IG51bGxcbiAgICAgICAgdGhpcy5jYW52YXMuY29udGV4dCA9ICdjYW52YXMnXG4gICAgICB9XG4gICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldC5kYXRhLmlkICE9PSB0aGlzLmRhdGEuaWQpIHtcbiAgICAgICAgbGluay5kYXRhLmZyb21Ob2RlID0gdGhpcy5kYXRhLmlkXG4gICAgICAgIGxpbmsuZGF0YS50b05vZGUgPSB0YXJnZXQuZGF0YS5pZFxuICAgICAgICBsaW5rLmZyb21Ob2RlID0gdGhpc1xuICAgICAgICBsaW5rLnRvTm9kZSA9IHRhcmdldFxuICAgICAgICB0YXJnZXQuYWRkVG9MaW5rKGxpbmspXG4gICAgICB9XG4gICAgfSlcblxuICAgIHNlbGVjdGlvbi5jYWxsKGRyYWdCZWhhdmlvdXIpXG4gIH1cblxuICBkcmF3TGlua2VkTm9kZXMgKHNlbGVjdGlvbikge1xuICAgIC8vIFRPRE86IGxpbmtlZCBOb2Rlc1xuICAgIHZhciBndW4gPSB0aGlzLmd1blxuICAgIHNlbGVjdGlvbi5vbignZGJsY2xpY2snLCAoZCwgaSwgZykgPT4ge1xuICAgICAgbGV0IG9yYml0ID0gZDMuc2VsZWN0KHRoaXMuRE9NKS5zZWxlY3QoJy5ub2RlT3JiaXQnKS5ub2RlKClcbiAgICAgIGxldCBub2RlcyA9IFtdXG4gICAgICB0aGlzLmd1bi52YWwoKGQsIGspID0+IHtcbiAgICAgICAgbGV0IG5vZGVLZXkgPSBbXVxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gZCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgZFtrZXldID09PSAnb2JqZWN0JyAmJiBrZXkgIT09ICdfJyAmJiBkW2tleV0gIT09IG51bGwpIG5vZGVLZXkucHVzaChrZXkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGVLZXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGxldCBzdmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcjQ2FudmFzJylcbiAgICAgICAgICBsZXQgbm9kZVRyYW5zbGF0ZSA9IHRoaXMuRE9NLmdldENUTSgpXG4gICAgICAgICAgbGV0IHB0ID0gc3ZnLmNyZWF0ZVNWR1BvaW50KClcbiAgICAgICAgICBsZXQgbGVuZ3RoID0gb3JiaXQuZ2V0VG90YWxMZW5ndGgoKSAvIDJcbiAgICAgICAgICBsZXQgc2VnbWVudCA9IGxlbmd0aCAvIG5vZGVLZXkubGVuZ3RoXG4gICAgICAgICAgbGV0IG9mZnNldCA9IGxlbmd0aCAqIDAuNzVcbiAgICAgICAgICBub2RlS2V5LmZvckVhY2goKHYsIGkpID0+IHtcbiAgICAgICAgICAgIGxldCBwYXRoID0gYCR7dGhpcy5kYXRhLnBhdGh9LiR7dn1gXG4gICAgICAgICAgICBsZXQgcG9zaXRpb24gPSBvcmJpdC5nZXRQb2ludEF0TGVuZ3RoKG9mZnNldCArIChzZWdtZW50ICogaSkpXG4gICAgICAgICAgICBwdC54ID0gcG9zaXRpb24ueFxuICAgICAgICAgICAgcHQueSA9IHBvc2l0aW9uLnlcbiAgICAgICAgICAgIHB0ID0gcHQubWF0cml4VHJhbnNmb3JtKG5vZGVUcmFuc2xhdGUpXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5wcm9wcy5nZXRHdW5EYXRhKHBhdGgpXG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMuY2FudmFzLmFwcGVuZE5vZGUocGF0aCwgW3B0LngsIHB0LnldLCAxKVxuICAgICAgICAgICAgbm9kZXMucHVzaChub2RlKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgbm9kZXMuZm9yRWFjaCgodikgPT4ge1xuICAgICAgICAgIGxldCBsaW5rID0gbmV3IHRoaXMuY2FudmFzLkxpbmsoYGxpbmstJHt0aGlzLmdldFJhbmRvbVZhbHVlKCl9YCwgdGhpcy5jYW52YXMpXG4gICAgICAgICAgbGluay5kYXRhLmZyb20gPSB0aGlzLmRhdGEucG9zaXRpb25cbiAgICAgICAgICBsaW5rLmRhdGEudG8gPSB2LmRhdGEucG9zaXRpb25cbiAgICAgICAgICBsaW5rLmZyb21Ob2RlID0gdGhpc1xuICAgICAgICAgIGxpbmsudG9Ob2RlID0gdlxuICAgICAgICAgIGxpbmsucmVzZXRIYW5kbGUoKVxuICAgICAgICAgIGxpbmsuYXBwZW5kU2VsZigpXG4gICAgICAgICAgLmNhbGwoKHMpID0+IHsgdGhpcy5jYW52YXMuc2V0Q29udGV4dChzLCAnbGluaycpfSlcblxuICAgICAgICAgIGxldCBwcmVkaWNhdGUgPSB2LmRhdGEucGF0aC5zcGxpdCgnLicpLnBvcCgpXG4gICAgICAgICAgbGluay51cGRhdGVQcmVkaWNhdGUocHJlZGljYXRlKVxuICAgICAgICAgIHRoaXMubGlua3MuZnJvbS5wdXNoKGxpbmspXG4gICAgICAgICAgdi5saW5rcy50by5wdXNoKGxpbmspXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBzZXROb2RlVGFyZ2V0IChzZWxlY3Rpb24pIHtcbiAgICBzZWxlY3Rpb24ub24oJ21vdXNlZW50ZXIuc2V0VGFyZ2V0JywgKGQsIGksIGcpID0+IHsgdGhpcy5jYW52YXMudGFyZ2V0Tm9kZSA9IHRoaXMgfSlcbiAgICBzZWxlY3Rpb24ub24oJ21vdXNlbGVhdmUuc2V0VGFyZ2V0JywgKGQsIGksIGcpID0+IHsgdGhpcy5jYW52YXMudGFyZ2V0Tm9kZSA9IG51bGwgfSlcbiAgfVxuICAvLyBUT0RPOiBjYW4gYmluZGluZyBvZiBsaW5rcyBhbmQgbm9kZXMgYmUgYWdncmVnYXRlZCBpbnRvIG9uZSBmdW5jdGlvbj9cbiAgYWRkVG9MaW5rIChsaW5rKSB7XG4gICAgdGhpcy5saW5rcy50by5wdXNoKGxpbmspXG4gICAgbGV0IGNhY2hlID0gdGhpcy5kYXRhLnRvTGlua1xuICAgIGNhY2hlLnB1c2gobGluay5kYXRhLmlkKVxuICAgIHRoaXMuZGF0YS50b0xpbmsgPSBjYWNoZVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGFkZEZyb21MaW5rIChsaW5rKSB7XG4gICAgdGhpcy5saW5rcy5mcm9tLnB1c2gobGluaylcbiAgICBsZXQgY2FjaGUgPSB0aGlzLmRhdGEuZnJvbUxpbmtcbiAgICBjYWNoZS5wdXNoKGxpbmsuZGF0YS5pZClcbiAgICB0aGlzLmRhdGEuZnJvbUxpbmsgPSBjYWNoZVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHBvcExhc3RMaW5rICgpIHtcbiAgICB0aGlzLmxpbmtzLmZyb20ucG9wKClcbiAgICBsZXQgY2FjaGUgPSB0aGlzLmRhdGEuZnJvbUxpbmtcbiAgICBjYWNoZS5wb3AoKVxuICAgIHRoaXMuZGF0YS5mcm9tTGluayA9IGNhY2hlXG4gIH1cblxuICB1cGRhdGVBdHRhY2hlZExpbmsgKGtleSwgcG9zaXRpb24pIHtcbiAgICByZXR1cm4gKHYpID0+IHtcbiAgICAgIHYuZGF0YVtrZXldID0gcG9zaXRpb25cbiAgICAgIC8vVE9ETzogc2hvdWxkIHVwZGF0ZSBpdHNlbGY/IGl0J3MgYWN1dGFsbHkgYWxtb3N0XG4gICAgICBkMy5zZWxlY3Qodi5ET00pLnNlbGVjdCgnLnBhdGgnKS5hdHRyKCdkJywgdi5wYXRoRGVzY3JpcHRpb24oKSlcbiAgICAgIHYudXBkYXRlVGV4dCgpXG4gICAgfVxuICB9XG5cbiAgZGlzcGxheU5vZGVOYW1lIChuYW1lKSB7XG4gICAgaWYgKG5hbWUpIHRoaXMuZGF0YS5kaXNwbGF5TmFtZSA9IG5hbWVcbiAgICBkMy5zZWxlY3QodGhpcy5ET00pLnNlbGVjdCgnLm5vZGVBbmNob3IgLm5vZGVMYWJlbCcpLnRleHQodGhpcy5kYXRhLmRpc3BsYXlOYW1lKVxuICB9XG5cbiAgdXBkYXRlQXR0YWNoZWRWYWx1ZSAoa2V5LCB2YWx1ZSkge1xuICAgIGxldCB0ZXh0TGVuZ3RoID0gdGhpcy5tZWFzdXJlVGV4dChrZXkpXG4gICAgbGV0IHNpemUgPSB7IGJvdW5kaW5nQm94V2lkdGg6IHRleHRMZW5ndGgud2lkdGgsIGJvdW5kaW5nQm94SGVpZ2h0OiAwIH1cbiAgICBsZXQgRE9NID0gdGhpcy5ET00ucXVlcnlTZWxlY3RvcignLm5vZGVWYWx1ZScpXG4gICAgbGV0IGNvbnRhaW5lciA9IGQzLnNlbGVjdChET00pLmFwcGVuZCgoKSA9PiB0aGlzLm5vZGVTaXplSGFuZGxlKHNpemUpKS5ub2RlKCkucGFyZW50Tm9kZVxuICAgIGQzLnNlbGVjdChET00pLnNlbGVjdCgndGV4dC52YWx1ZUxhYmVsJykudGV4dChrZXkpXG4gICAgdGhpcy53cmFwVGV4dCh2YWx1ZSwgY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy52YWx1ZScpLCBzaXplKVxuICAgIFxuICAgIGxldCBjYWNoZSA9IHRoaXMuZGF0YS5hdHRhY2hlZFZhbHVlXG4gICAgY2FjaGUudmFsdWVLZXkgPSBrZXlcbiAgICBjYWNoZS52YWx1ZSA9IHZhbHVlXG4gICAgdGhpcy5kYXRhLmF0dGFjaGVkVmFsdWUgPSBjYWNoZVxuICB9XG5cbiAgdXBkYXRlRGV0YWNoZWRWYWx1ZSAodmFsdWVJRCwga2V5LCB2YWx1ZSkge1xuICAgIGxldCB0ZXh0TGVuZ3RoID0gdGhpcy5tZWFzdXJlVGV4dChrZXkpXG4gICAgbGV0IHNpemUgPSB7IGJvdW5kaW5nQm94V2lkdGg6IHRleHRMZW5ndGgud2lkdGgsIGJvdW5kaW5nQm94SGVpZ2h0OiAwIH1cbiAgICBsZXQgRE9NID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLlZhbHVlIyR7dmFsdWVJRH1gKVxuICAgIGxldCBjb250YWluZXIgPSBkMy5zZWxlY3QoRE9NKS5hcHBlbmQoKCkgPT4gdGhpcy5ub2RlU2l6ZUhhbmRsZShzaXplKSkubm9kZSgpLnBhcmVudE5vZGVcbiAgICBkMy5zZWxlY3QoRE9NKS5zZWxlY3QoJ3RleHQudmFsdWVMYWJlbCcpLnRleHQoa2V5KVxuICAgIHRoaXMud3JhcFRleHQodmFsdWUsIGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudmFsdWUnKSwgc2l6ZSlcbiAgICBcbiAgICAvLyBsZXQgY2FjaGUgPSB0aGlzLmRhdGEuZGV0YWNoZWRWYWx1ZVxuICAgIC8vIGNhY2hlW2tleV0gPSB7fVxuICAgIC8vIGNhY2hlW2tleV0udmFsdWUgPSB2YWx1ZVxuICAgIC8vIC8vIGNhY2hlLnZhbHVlS2V5ID0ga2V5XG4gICAgLy8gLy8gY2FjaGUudmFsdWUgPSB2YWx1ZVxuICAgIC8vIHRoaXMuZGF0YS5kZXRhY2hlZFZhbHVlID0gY2FjaGVcbiAgfVxuXG4gIGluaXROb2RlIChrLCBjYikge1xuICAgIC8vIHRoaXMuZ3VuLnZhbCgoZCwgaykgPT4ge1xuICAgIC8vICAgdGhpcy5ub3JtYWxpemVkUGF0aCA9IGRbJ18nXVsnIyddXG4gICAgLy8gICB0aGlzLmRpc3BsYXlOb2RlTmFtZSgpXG4gICAgLy8gICBjYigpXG4gICAgLy8gfSlcbiAgICB0aGlzLmNhbnZhcy5wcm9wcy5wdXROZXdOb2RlKGspXG4gIH1cblxuICBnZXRWYWx1ZSAoY2IpIHtcbiAgICBsZXQgbmFtZSA9IHRoaXMuZ3VuLl8uZmllbGRcbiAgICB0aGlzLmRpc3BsYXlOb2RlTmFtZShuYW1lKVxuICAgIC8vIGluIG9yZGVyIGZvciAnLm5vdCcgdG8gYmUgY2FsbGVkLCBpdCBoYXMgdG8gcHJlY2VkcyAndmFsJ1xuICAgIHRoaXMuZ3VuLm5vdCgoaykgPT4ge1xuICAgICAgY2IobnVsbCwgaylcbiAgICB9KVxuXG4gICAgdGhpcy5ndW4udmFsKChkLCBrKSA9PiB7XG4gICAgICB0aGlzLm5vcm1hbGl6ZWRQYXRoID0gZFsnXyddWycjJ11cbiAgICAgIC8vIGlmIChkICE9PSBudWxsKSB7XG4gICAgICAvLyAgIGxldCBuYW1lID0gZFsnbmFtZSddXG4gICAgICAvLyAgIGlmIChuYW1lKSB0aGlzLmRpc3BsYXlOb2RlTmFtZShuYW1lKVxuICAgICAgLy8gfVxuICAgICAgbGV0IHZhbHVlS2V5ID0gW11cbiAgICAgIGZvciAobGV0IGtleSBpbiBkKSB7XG4gICAgICAgIHZhbHVlS2V5LnB1c2goa2V5KVxuICAgICAgfVxuXG4gICAgICB2YWx1ZUtleSA9IHZhbHVlS2V5LmZpbHRlcigodikgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGRbdl0gPT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2VcbiAgICAgICAgaWYgKGRbdl0gPT09IG51bGwpIHJldHVybiBmYWxzZVxuICAgICAgICBpZiAodiA9PT0gJ25hbWUnKSByZXR1cm4gZmFsc2VcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5kZXRhY2hlZFZhbHVlW3ZdKSByZXR1cm4gZmFsc2VcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0pXG4gICAgICBjYihkLCB2YWx1ZUtleSlcbiAgICB9KVxuICB9XG5cbiAgd3JhcFRleHQgKHRleHQsIGNvbnRhaW5lciwgb3ZlcmZsb3cpIHtcbiAgICBsZXQgb3ZlcmZsb3dXaWR0aCA9IG92ZXJmbG93LmJvdW5kaW5nQm94V2lkdGggLSAxNVxuICAgIGxldCBvdmVyZmxvd0hlaWdodCA9IG92ZXJmbG93LmJvdW5kaW5nQm94SGVpZ2h0XG4gICAgbGV0IHdvcmRzID0gdGV4dC5zcGxpdCgnICcpLnJldmVyc2UoKVxuICAgIGxldCBsaW5lcyA9IFtdXG4gICAgbGV0IGxpbmUgPSB3b3Jkcy5wb3AoKVxuICAgIGxldCB3b3JkID0gd29yZHMucG9wKClcbiAgICB3aGlsZSAod29yZCkge1xuICAgICAgbGV0IGxpbmVQcmV2aWV3ID0gbGluZVxuICAgICAgbGluZVByZXZpZXcgKz0gYCAke3dvcmR9YFxuICAgICAgbGV0IG92ZXJmbG93ID0gKHRoaXMubWVhc3VyZVRleHQobGluZVByZXZpZXcsICd2YWx1ZScpLndpZHRoID4gb3ZlcmZsb3dXaWR0aClcbiAgICAgIGlmICghb3ZlcmZsb3cpIGxpbmUgKz0gYCAke3dvcmR9YFxuICAgICAgaWYgKG92ZXJmbG93KSB7XG4gICAgICAgIGxpbmVzLnB1c2gobGluZSlcbiAgICAgICAgbGluZSA9IGAke3dvcmR9YFxuICAgICAgfVxuICAgICAgd29yZCA9IHdvcmRzLnBvcCgpXG4gICAgfVxuICAgIGxpbmVzLnB1c2gobGluZSlcbiAgICBkMy5zZWxlY3QoY29udGFpbmVyKS5zZWxlY3RBbGwoJ3RzcGFuJykucmVtb3ZlKClcbiAgICBsaW5lcy5mb3JFYWNoKCh2LCBpKSA9PiB7XG4gICAgICBpZiAoKChpICsgMSkgKiAxMykgPCAob3ZlcmZsb3dIZWlnaHQpKSB7XG4gICAgICAgIGQzLnNlbGVjdChjb250YWluZXIpXG4gICAgICAgIC5hcHBlbmQoJ3RzcGFuJykuYXR0cigneCcsIDApLmF0dHIoJ3knLCBgJHtpICogMTN9YClcbiAgICAgICAgLnRleHQodilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgbm9kZVNpemVIYW5kbGUgKHNpemUsIHZhbHVlSUQpIHtcbiAgICBsZXQgY2FjaGUgPSB2YWx1ZUlEID8gdGhpcy5kYXRhLmRldGFjaGVkVmFsdWVbdmFsdWVJRF0gOiB0aGlzLmRhdGEuYXR0YWNoZWRWYWx1ZVxuXG4gICAgaWYgKHNpemUpIHtcbiAgICAgIGNhY2hlLmJvdW5kaW5nQm94V2lkdGggPSBzaXplLmJvdW5kaW5nQm94V2lkdGhcbiAgICAgIGNhY2hlLmJvdW5kaW5nQm94SGVpZ2h0ID0gc2l6ZS5ib3VuZGluZ0JveEhlaWdodFxuICAgIH1cblxuICAgIGxldCBkcmFnQmVoYXZpb3VyID0gZDMuZHJhZygpXG4gICAgZHJhZ0JlaGF2aW91ci5vbignc3RhcnQnLCAoZCwgaSwgZykgPT4ge1xuICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB9KVxuXG4gICAgZHJhZ0JlaGF2aW91ci5vbignZHJhZycsIChkLCBpLCBnKSA9PiB7XG4gICAgICAvLyBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgY2FjaGUuYm91bmRpbmdCb3hXaWR0aCArPSBkMy5ldmVudC5keFxuICAgICAgY2FjaGUuYm91bmRpbmdCb3hIZWlnaHQgKz0gZDMuZXZlbnQuZHlcblxuICAgICAgbGV0IG1pbmltYWxXaWR0aCA9IHRoaXMubWVhc3VyZVRleHQoY2FjaGUudmFsdWVLZXksICd2YWx1ZUxhYmVsJykud2lkdGggKyAzMFxuICAgICAgY2FjaGUuYm91bmRpbmdCb3hXaWR0aCA9IChjYWNoZS5ib3VuZGluZ0JveFdpZHRoIDwgbWluaW1hbFdpZHRoKSA/IG1pbmltYWxXaWR0aCA6IGNhY2hlLmJvdW5kaW5nQm94V2lkdGhcbiAgICAgIGNhY2hlLmJvdW5kaW5nQm94SGVpZ2h0ID0gKGNhY2hlLmJvdW5kaW5nQm94SGVpZ2h0IDwgMCkgPyAwIDogY2FjaGUuYm91bmRpbmdCb3hIZWlnaHRcblxuICAgICAgZDMuc2VsZWN0KGdbaV0pLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtjYWNoZS5ib3VuZGluZ0JveFdpZHRofSwgJHtjYWNoZS5ib3VuZGluZ0JveEhlaWdodH0pYClcblxuICAgICAgaWYgKGNhY2hlLmJvdW5kaW5nQm94SGVpZ2h0ID4gMCkgdGhpcy53cmFwVGV4dChjYWNoZS52YWx1ZSwgZ1tpXS5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJy52YWx1ZScpLCBjYWNoZSlcbiAgICAgIGQzLnNlbGVjdChnW2ldKS5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7Y2FjaGUuYm91bmRpbmdCb3hXaWR0aH0sICR7Y2FjaGUuYm91bmRpbmdCb3hIZWlnaHR9KWApXG5cbiAgICAgIGlmICh2YWx1ZUlEKSB0aGlzLmRhdGEuZGV0YWNoZWRWYWx1ZVt2YWx1ZUlEXSA9IGNhY2hlXG4gICAgICBpZiAoIXZhbHVlSUQpIHRoaXMuZGF0YS5hdHRhY2hlZFZhbHVlID0gY2FjaGVcbiAgICB9KVxuXG4gICAgaWYgKHZhbHVlSUQpIGNhY2hlLmJvdW5kaW5nQm94V2lkdGggLT0gMzBcbiAgICBsZXQgaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKGQzLm5hbWVzcGFjZXMuc3ZnLCAncG9seWdvbicpXG4gICAgZDMuc2VsZWN0KGhhbmRsZSkuYXR0cignY2xhc3MnLCAnYm91bmRpbmdCb3hIYW5kbGUnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7Y2FjaGUuYm91bmRpbmdCb3hXaWR0aCArPSAzMH0sICR7Y2FjaGUuYm91bmRpbmdCb3hIZWlnaHR9KWApXG4gICAgLmF0dHIoJ3BvaW50cycsICc1LDAgNSw1IDAsNScpXG4gICAgLmNhbGwoZHJhZ0JlaGF2aW91cilcblxuICAgIHJldHVybiBoYW5kbGVcbiAgfVxuXG4gIG5vZGVBbmNob3IgKCkge1xuICAgIGxldCBwYXRoID0gdGhpcy5kYXRhLnBhdGhcblxuICAgIGxldCBncm91cCA9IHRoaXMuZ3JvdXAoJ25vZGVBbmNob3InKVxuICAgIGxldCBjaXJjbGUgPSB0aGlzLmNpcmNsZSgnbm9kZUFuY2hvcicpXG4gICAgZDMuc2VsZWN0KGNpcmNsZSlcbiAgICAuY2FsbCh0aGlzLmRyYXdMaW5rQmVoYXZpb3VyKVxuICAgIC5jYWxsKHRoaXMuZHJhd0xpbmtlZE5vZGVzKVxuICAgIC5jYWxsKHRoaXMuc2V0Tm9kZVRhcmdldClcbiAgICAuY2FsbCgocykgPT4gdGhpcy5jYW52YXMuc2V0Q29udGV4dChzLCAnbm9kZScpKVxuXG4gICAgZDMuc2VsZWN0KGdyb3VwKS5hcHBlbmQoKCkgPT4gY2lyY2xlKVxuXG4gICAgZDMuc2VsZWN0KGdyb3VwKS5hcHBlbmQoJ3RleHQnKS5hdHRyKCdjbGFzcycsICdub2RlTGFiZWwnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKC03LDcpJylcblxuICAgIHJldHVybiBncm91cFxuICB9XG5cbiAgbm9kZUF0dGFjaGVkVmFsdWUgKCkge1xuICAgIGxldCBncm91cCA9IHRoaXMuZ3JvdXAoJ25vZGVWYWx1ZScpXG4gICAgbGV0IGNpcmNsZSA9IHRoaXMuY2lyY2xlKCdub2RlVmFsdWVBbmNob3InKVxuICAgIGxldCBkcmFnQmVoYXZpb3VyID0gZDMuZHJhZygpXG4gICAgbGV0IHNoYWRvd1ZhbHVlSURcblxuICAgIGRyYWdCZWhhdmlvdXIub24oJ3N0YXJ0JywgKGQsIGksIGcpID0+IHtcbiAgICAgIGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cbiAgICAgIGxldCBtb3VzZSA9IGQzLm1vdXNlKHRoaXMuRE9NLnBhcmVudE5vZGUpXG4gICAgICBsZXQgaWQgPSBgdmFsdWUtJHt0aGlzLmdldFJhbmRvbVZhbHVlKCl9YFxuXG4gICAgICBsZXQgdmFsdWUgPSB0aGlzLm5vZGVEZXRhY2hlZFZhbHVlKGlkKVxuICAgICAgZDMuc2VsZWN0KHZhbHVlKS5kYXR1bSh0aGlzKVxuICAgICAgZDMuc2VsZWN0KHZhbHVlKS5zZWxlY3QoJy5ub2RlVmFsdWVBbmNob3InKVxuICAgICAgLmNhbGwoKHMpID0+IHt0aGlzLmNhbnZhcy5zZXRDb250ZXh0KHMsICd2YWx1ZScpfSlcbiAgICAgIGQzLnNlbGVjdCh0aGlzLkRPTS5wYXJlbnROb2RlKS5hcHBlbmQoKCkgPT4gdmFsdWUpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke21vdXNlWzBdfSwke21vdXNlWzFdfSlgKVxuXG4gICAgICBsZXQgayA9IHRoaXMuZGF0YS5hdHRhY2hlZFZhbHVlLnZhbHVlS2V5XG4gICAgICBsZXQgdiA9IHRoaXMuZGF0YS5hdHRhY2hlZFZhbHVlLnZhbHVlXG5cbiAgICAgIHRoaXMudXBkYXRlRGV0YWNoZWRWYWx1ZShpZCwgaywgdilcbiAgICAgIGQzLnNlbGVjdCh0aGlzLkRPTSkuc2VsZWN0KCcubm9kZVZhbHVlJykucmVtb3ZlKClcblxuICAgICAgbGV0IGNhY2hlID0gdGhpcy5kYXRhLmRldGFjaGVkVmFsdWVcbiAgICAgIGNhY2hlW2tdID0ge1xuICAgICAgICBwb3NpdGlvbjogbW91c2UsXG4gICAgICAgIHZhbHVlOiB2LFxuICAgICAgICBib3VuZGluZ0JveFdpZHRoOiB0aGlzLmRhdGEuYXR0YWNoZWRWYWx1ZS5ib3VuZGluZ0JveFdpZHRoLFxuICAgICAgICBib3VuZGluZ0JveEhlaWdodDogdGhpcy5kYXRhLmF0dGFjaGVkVmFsdWUuYm91bmRpbmdCb3hIZWlnaHRcbiAgICAgIH1cbiAgICAgIHRoaXMuZGF0YS5kZXRhY2hlZFZhbHVlID0gY2FjaGVcblxuICAgICAgc2hhZG93VmFsdWVJRCA9IGlkXG5cbiAgICAgIGxldCBsaW5rID0gbmV3IHRoaXMuY2FudmFzLkxpbmsoYGxpbmstJHt0aGlzLmdldFJhbmRvbVZhbHVlKCl9YCwgdGhpcy5jYW52YXMpXG4gICAgICBPYmplY3QuYXNzaWduKGxpbmsuZGF0YSwge2Zyb206IHRoaXMuZGF0YS5wb3NpdGlvbiwgdG86IHRoaXMuZGF0YS5wb3NpdGlvbn0pXG4gICAgICBsaW5rLnJlc2V0SGFuZGxlKClcbiAgICAgIGxpbmsuYXBwZW5kU2VsZih0cnVlKVxuXG4gICAgICBsaW5rLnRvVmFsdWUgPSBpZFxuICAgICAgdGhpcy5saW5rcy5kZXRhY2hlZFZhbHVlLnB1c2gobGluaylcbiAgICB9KVxuXG4gICAgZHJhZ0JlaGF2aW91ci5vbignZHJhZycsICgpID0+IHtcbiAgICAgIGxldCBjb250YWluZXIgPSB0aGlzLkRPTS5wYXJlbnROb2RlXG4gICAgICBsZXQgbW91c2UgPSBkMy5tb3VzZShjb250YWluZXIpXG4gICAgICBkMy5zZWxlY3QoYC5WYWx1ZSMke3NoYWRvd1ZhbHVlSUR9YClcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7bW91c2VbMF19LCAke21vdXNlWzFdfSlgKVxuICAgICAgXG4gICAgICBsZXQgbGluayA9IHRoaXMubGlua3MuZGV0YWNoZWRWYWx1ZVt0aGlzLmxpbmtzLmRldGFjaGVkVmFsdWUubGVuZ3RoIC0xXVxuICAgICAgbGluay5kcmF3TGlua1RvKG1vdXNlKVxuICAgICAgLy8gVE9ETzogdXBkYXRlIGRldGFjaGVkVmFsdWUgQ2FjaGVcbiAgICB9KVxuXG4gICAgZHJhZ0JlaGF2aW91ci5vbignZW5kJywgKCkgPT4ge1xuICAgICAgLy9UT0RPOiBtYWtlIHN1cmUgaXQgaXMgZHJhZ2dlZCBzaWduaWZpY2FudGx5IFxuICAgICAgLy9UT0RPOiBzaG91bGQgY2hlY2sgaWYgYWxsIHZhbHVlIGhhcyBiZWVuIGRldGFjaGVkXG4gICAgICBkMy5zZWxlY3QodGhpcy5ET00pLmFwcGVuZCgoKSA9PiB0aGlzLm5vZGVBdHRhY2hlZFZhbHVlKCkpXG4gICAgICB0aGlzLmdldFZhbHVlKChkLCBrKSA9PiB7XG4gICAgICAgIGlmIChkKSB7XG4gICAgICAgICAgaWYgKGsubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy50b2dnbGVEaXNwbGF5TGV2ZWwoMSwgdHJ1ZSlcbiAgICAgICAgICBsZXQga2V5ID0ga1swXVxuICAgICAgICAgIHRoaXMudXBkYXRlQXR0YWNoZWRWYWx1ZShrZXksIGRba2V5XSlcbiAgICAgICAgICB0aGlzLnRvZ2dsZURpc3BsYXlMZXZlbCgyLCBmYWxzZSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWQpIHtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZDMuc2VsZWN0KGdyb3VwKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsNDApJykuYXR0cignZGlzcGxheScsICdub25lJylcbiAgICAuYXBwZW5kKCgpID0+IHRoaXMuY2lyY2xlKCd2YWx1ZUFuY2hvckJhY2tncm91bmQnKSlcbiAgICBcbiAgICBkMy5zZWxlY3QoZ3JvdXApXG4gICAgLmFwcGVuZCgoKSA9PiBjaXJjbGUpXG4gICAgLmNhbGwoZHJhZ0JlaGF2aW91cilcbiAgICAuY2FsbCgocykgPT4ge3RoaXMuY2FudmFzLnNldENvbnRleHQocywgJ2F0dGFjaGVkVmFsdWUnKX0pXG5cbiAgICBkMy5zZWxlY3QoZ3JvdXApLmFwcGVuZCgndGV4dCcpLmF0dHIoJ2NsYXNzJywgJ3ZhbHVlTGFiZWwnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDE1LDQpJylcbiAgICBkMy5zZWxlY3QoZ3JvdXApLmFwcGVuZCgndGV4dCcpLmF0dHIoJ2NsYXNzJywgJ3ZhbHVlJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgxNSwgMjUpJylcblxuICAgIHJldHVybiBncm91cFxuICB9XG5cbiAgbm9kZURldGFjaGVkVmFsdWUgKHZhbHVlSUQpIHtcbiAgICBsZXQgZ3JvdXAgPSB0aGlzLmdyb3VwKCdWYWx1ZScpXG4gICAgbGV0IGNpcmNsZSA9IHRoaXMuY2lyY2xlKCdub2RlVmFsdWVBbmNob3InKVxuICAgIGxldCBkcmFnQmVoYXZpb3VyID0gZDMuZHJhZygpXG5cbiAgICBkcmFnQmVoYXZpb3VyLm9uKCdzdGFydCcsICgpID0+IHtcbiAgICAgIGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgfSlcbiAgICBkcmFnQmVoYXZpb3VyLm9uKCdkcmFnJywgKGQsIGksIGcpID0+IHtcbiAgICAgIGxldCBpZCA9IGdbaV0ucGFyZW50Tm9kZS5pZFxuICAgICAgbGV0IGNvbnRhaW5lciA9IHRoaXMuRE9NLnBhcmVudE5vZGVcbiAgICAgIGxldCBtb3VzZSA9IGQzLm1vdXNlKHRoaXMuRE9NLnBhcmVudE5vZGUpXG4gICAgICBkMy5zZWxlY3QoZ1tpXS5wYXJlbnROb2RlKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHttb3VzZVswXX0sJHttb3VzZVsxXX0pYClcblxuICAgICAgbGV0IGNhY2hlID0gdGhpcy5kYXRhLmRldGFjaGVkVmFsdWVcbiAgICAgIGxldCBsaW5rID0gdGhpcy5saW5rcy5kZXRhY2hlZFZhbHVlLmZpbHRlcigodikgPT4gdi50b1ZhbHVlID09PSBpZClbMF1cbiAgICAgIGxpbmsuZHJhd0xpbmtUbyhtb3VzZSlcblxuICAgIH0pXG5cbiAgICBkMy5zZWxlY3QoZ3JvdXApLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCw0MCknKS5hdHRyKCdpZCcsIHZhbHVlSUQpXG4gICAgLmFwcGVuZCgoKSA9PiB0aGlzLmNpcmNsZSgndmFsdWVBbmNob3JCYWNrZ3JvdW5kJykpXG4gICAgXG4gICAgZDMuc2VsZWN0KGdyb3VwKVxuICAgIC5hcHBlbmQoKCkgPT4gY2lyY2xlKVxuICAgIC5jYWxsKGRyYWdCZWhhdmlvdXIpXG4gICAgLmNhbGwoKHMpID0+IHt0aGlzLmNhbnZhcy5zZXRDb250ZXh0KHMsICd2YWx1ZScpfSlcblxuICAgIGQzLnNlbGVjdChncm91cCkuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnLCAndmFsdWVMYWJlbCcpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMTUsNCknKVxuICAgIGQzLnNlbGVjdChncm91cCkuYXBwZW5kKCd0ZXh0JykuYXR0cignY2xhc3MnLCAndmFsdWUnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDE1LCAyNSknKVxuXG4gICAgcmV0dXJuIGdyb3VwXG4gIH1cblxuICBTVkdFbGVtZW50ICgpIHtcbiAgICBsZXQgaWQgPSB0aGlzLmRhdGEuaWRcbiAgICBsZXQgcG9zaXRpb24gPSB0aGlzLmRhdGEucG9zaXRpb25cblxuICAgIGxldCBncm91cCA9IHRoaXMuZ3JvdXAoJ25vZGVzJywgaWQpXG5cbiAgICBkMy5zZWxlY3QoZ3JvdXApLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtwb3NpdGlvblswXX0sICR7cG9zaXRpb25bMV19KWApXG4gICAgZDMuc2VsZWN0KGdyb3VwKS5hcHBlbmQoKCkgPT4gdGhpcy5jaXJjbGUoJ25vZGVPcmJpdCcpKVxuICAgIGQzLnNlbGVjdChncm91cCkuYXBwZW5kKCgpID0+IHRoaXMubm9kZUFuY2hvcigpKVxuICAgIC8vIGQzLnNlbGVjdChncm91cCkuYXBwZW5kKCgpID0+IHRoaXMubm9kZVZhbHVlKCkpXG4gICAgZDMuc2VsZWN0KGdyb3VwKS5hcHBlbmQoKCkgPT4gdGhpcy5ub2RlQXR0YWNoZWRWYWx1ZSgpKVxuXG4gICAgcmV0dXJuIGdyb3VwXG4gIH1cblxuICBhcHBlbmRTZWxmICgpIHtcbiAgICBsZXQgRE9NID0gZDMuc2VsZWN0KCcjQ2FudmFzICN6b29tVHJhbnNmb3JtJykuc2VsZWN0QWxsKCcubm9kZXMnKVxuICAgIC5kYXRhKFt0aGlzXSwgKGQpID0+IGQgPyBkLmRhdGEucGF0aCA6IHVuZGVmaW5lZClcbiAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3RoaXMuZGF0YS5wb3NpdGlvblswXX0sICR7dGhpcy5kYXRhLnBvc2l0aW9uWzFdfSlgKVxuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZCgoKSA9PiB0aGlzLlNWR0VsZW1lbnQoKSlcbiAgICAubm9kZSgpXG5cbiAgICB0aGlzLkRPTSA9IERPTVxuXG4gICAgZDMuc2VsZWN0KHRoaXMuRE9NKS5zZWxlY3QoJy5ub2RlQW5jaG9yIGNpcmNsZScpXG4gICAgZDMuc2VsZWN0KHRoaXMuRE9NKS5zZWxlY3QoJy5ub2RlVmFsdWUgLm5vZGVWYWx1ZUFuY2hvcicpXG4gICAgXG4gICAgcmV0dXJuIGQzLnNlbGVjdChET00pXG4gIH1cblxuICB0b2dnbGVEaXNwbGF5TGV2ZWwgKGxldmVsLCBlbXB0eSkge1xuICAgIHRoaXMuZGF0YS5kaXNwbGF5TGV2ZWwgPSB0aGlzLmRpc3BsYXlMZXZlbChsZXZlbCwgZW1wdHkpXG4gICAgbGV0IGRpc3BsYXlOYW1lID0gdGhpcy5kYXRhLmRpc3BsYXlOYW1lID8gdGhpcy5kYXRhLmRpc3BsYXlOYW1lIDogJydcbiAgICBzd2l0Y2ggKHRoaXMuZGF0YS5kaXNwbGF5TGV2ZWwpIHtcbiAgICAgIGNhc2UgJ21pbmltYWwnOlxuICAgICAgICBkMy5zZWxlY3QodGhpcy5ET00pLnNlbGVjdCgnLm5vZGVMYWJlbCcpLnRleHQoZGlzcGxheU5hbWVbMF0pXG4gICAgICAgIGQzLnNlbGVjdCh0aGlzLkRPTSkuc2VsZWN0KCcubm9kZVZhbHVlJykuYXR0cignZGlzcGxheScsICdub25lJylcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3Nob3dQYXRoJzpcbiAgICAgICAgZDMuc2VsZWN0KHRoaXMuRE9NKS5zZWxlY3QoJy5ub2RlTGFiZWwnKS50ZXh0KGRpc3BsYXlOYW1lKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnc2hvd1ZhbHVlJzpcbiAgICAgICAgZDMuc2VsZWN0KHRoaXMuRE9NKS5zZWxlY3QoJy5ub2RlVmFsdWUnKS5hdHRyKCdkaXNwbGF5JywgJ3RydWUnKVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5vZGVcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Ob2RlLmpzIiwiY2xhc3MgTm9kZUludGVyYWN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnN0YXRlID0ge31cbiAgfVxuXG4gIHNob3cgKHRhcmdldExpbmspIHtcbiAgICBsZXQgTm9kZUludGVyYWN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2I05vZGVJbnRlcmFjdCcpXG4gICAgTm9kZUludGVyYWN0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKVxuICAgIE5vZGVJbnRlcmFjdC5xdWVyeVNlbGVjdG9yKCcjUGF0aElucHV0JykuZm9jdXMoKVxuICAgIHRoaXMucHJvcHMuZ2V0R3VuRGF0YSgnJylcbiAgICB0aGlzLnNldFN0YXRlKHtndW5QYXRoOiAnJ30pXG4gIH1cblxuICBoaWRlICgpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYjTm9kZUludGVyYWN0JykuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpXG4gICAgbGV0IGlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2I05vZGVJbnRlcmFjdCAjUGF0aElucHV0JylcbiAgICBpbnB1dC52YWx1ZSA9ICcnXG4gICAgaW5wdXQuYmx1cigpXG4gIH1cblxuICBhZGRJbnB1dExpc3RlbmVyICgpIHtcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXYjTm9kZUludGVyYWN0ICNQYXRoSW5wdXQnKVxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgdGhpcy5wcm9wcy5nZXRHdW5EYXRhKGlucHV0LnZhbHVlKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7Z3VuUGF0aDogaW5wdXQudmFsdWV9KVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5hZGRJbnB1dExpc3RlbmVyKClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9XCJOb2RlSW50ZXJhY3RcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjZW50ZXJcIj5cbiAgICAgICAgICA8ZGl2IGRyYWdnYWJsZT0ndHJ1ZScgaWQ9XCJOb2RlU3ltYm9sXCI+XG4gICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMjBweFwiIGhlaWdodD1cIjIwcHhcIiB2aWV3Qm94PVwiMCAwIDIwIDIwXCIgPlxuICAgICAgICAgICAgICA8Y2lyY2xlIHI9XCI5XCIgY3g9XCIxMFwiIGN5PVwiMTBcIiBmaWxsPXt0aGlzLnN0YXRlLm5vZGVDb2xvcn0gc3Ryb2tlPSdncmV5JyBzdHJva2VXaWR0aD1cIjAuNVwiIC8+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8aW5wdXQgdHlwZT0ndGV4dCcgaWQ9XCJQYXRoSW5wdXRcIiBvbkNoYW5nZT17dGhpcy5wYXRoQ2hhbmdlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5vZGVJbnRlcmFjdFxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL05vZGVJbnRlcmFjdC5qcyIsImNsYXNzIFByaW1pdGl2ZXMge1xuICBncm91cCAoY2xhc3NOYW1lLCBpZE5hbWUpIHtcbiAgICBsZXQgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoZDMubmFtZXNwYWNlcy5zdmcsICdnJylcbiAgICBpZiAoY2xhc3NOYW1lKSBkMy5zZWxlY3QoZ3JvdXApLmF0dHIoJ2NsYXNzJywgY2xhc3NOYW1lKVxuICAgIGlmIChpZE5hbWUpIGQzLnNlbGVjdChncm91cCkuYXR0cignaWQnLCBpZE5hbWUpXG5cbiAgICByZXR1cm4gZ3JvdXBcbiAgfVxuXG4gIGNpcmNsZSAoc3R5bGVTZWxlY3Rvcikge1xuICAgIC8vIFRPRE86IG5lZWQgdGhpcywgd2h5IG5vdCBjc3NcbiAgICBsZXQgc3R5bGUgPSB7XG4gICAgICAnbm9kZVZhbHVlQW5jaG9yJzoge1xuICAgICAgICAncic6ICc1JyxcbiAgICAgICAgJ3N0cm9rZSc6ICdibGFjaycsXG4gICAgICAgICdzdHJva2Utd2lkdGgnOiAnMC41JyxcbiAgICAgICAgJ2ZpbGwnOiAnd2hpdGUnXG4gICAgICB9LFxuICAgICAgJ25vZGVBbmNob3InOiB7XG4gICAgICAgICdyJzogJzI1JyxcbiAgICAgICAgJ3N0cm9rZSc6ICd3aGl0ZScsXG4gICAgICAgICdmaWxsJzogJ3doaXRlU21va2UnLFxuICAgICAgICAnc3Ryb2tlLXdpZHRoJzogJzEwcHgnXG4gICAgICB9LFxuICAgICAgJ3ZhbHVlQW5jaG9yQmFja2dyb3VuZCc6IHtcbiAgICAgICAgJ3N0cm9rZSc6ICd3aGl0ZScsXG4gICAgICAgICdmaWxsJzogJ3doaXRlJ1xuICAgICAgfSxcbiAgICAgICdub2RlT3JiaXQnOiB7XG4gICAgICAgICdzdHJva2UnOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG4gICAgICAgICdmaWxsJzogJ25vbmUnLFxuICAgICAgICAncic6ICcyMjAnXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhkMy5uYW1lc3BhY2VzLnN2ZywgJ2NpcmNsZScpXG4gICAgZDMuc2VsZWN0KGNpcmNsZSlcbiAgICAuYXR0cignY2xhc3MnLCBzdHlsZVNlbGVjdG9yKVxuICAgIC5hdHRyKCdyJywgJzEwJylcbiAgICAuYXR0cignc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgMC41KVxuXG4gICAgZm9yIChsZXQgYXR0ciBpbiBzdHlsZVtzdHlsZVNlbGVjdG9yXSkge1xuICAgICAgZDMuc2VsZWN0KGNpcmNsZSkuYXR0cihhdHRyLCBzdHlsZVtzdHlsZVNlbGVjdG9yXVthdHRyXSlcbiAgICB9XG5cbiAgICByZXR1cm4gY2lyY2xlXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcmltaXRpdmVzXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUHJpbWl0aXZlcy5qcyIsImZ1bmN0aW9uIGJpbmRMaW5rVG9DYW52YXNDYWNoZSAoY2FudmFzKSB7XG4gIGxldCBzZXQgPSAodCwgcCwgdiwgcikgPT4ge1xuICAgIC8vIFRPRE86IHVzZSBjYW52YXMuc2V0U3RhdGUoKSA/XG4gICAgbGV0IGNhY2hlID0gY2FudmFzLnN0YXRlLmNhY2hlLmxpbmtzXG4gICAgaWYgKHAgPT09ICdpZCcpIGNhY2hlW3ZdID0ge31cbiAgICBpZiAocCA9PT0gJ3ByZWRpY2F0ZScpIGNhY2hlW3QuaWRdW3BdID0gdlxuICAgIGlmIChwID09PSAnZnJvbScpIGNhY2hlW3QuaWRdW3BdID0gdlxuICAgIGlmIChwID09PSAnY29udHJvbEZyb20nKSBjYWNoZVt0LmlkXVtwXSA9IHZcbiAgICBpZiAocCA9PT0gJ3RvJykgY2FjaGVbdC5pZF1bcF0gPSB2XG4gICAgaWYgKHAgPT09ICdjb250cm9sVG8nKSBjYWNoZVt0LmlkXVtwXSA9IHZcbiAgICBpZiAocCA9PT0gJ2Rlc3RvcnknKSBkZWxldGUgY2FjaGVbdl1cbiAgICBpZiAocCA9PT0gJ2Zyb21Ob2RlJykgY2FjaGVbdC5pZF1bcF0gPSB2XG4gICAgaWYgKHAgPT09ICd0b05vZGUnKSBjYWNoZVt0LmlkXVtwXSA9IHZcbiAgICByZXR1cm4gUmVmbGVjdC5zZXQodCwgcCwgdiwgcilcbiAgfVxuXG4gIHJldHVybiB7IHNldCB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmluZExpbmtUb0NhbnZhc0NhY2hlXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYmluZExpbmtUb0NhbnZhc0NhY2hlLmpzIiwiZnVuY3Rpb24gYmluZE5vZGVUb0NhbnZhc0NhY2hlIChjYW52YXMpIHtcbiAgbGV0IHNldCA9ICh0LCBwLCB2LCByKSA9PiB7XG4gICAgLy8gVE9ETzogdXNlIGNhbnZhcy5zZXRTdGF0ZSgpID9cbiAgICBsZXQgY2FjaGUgPSBjYW52YXMuc3RhdGUuY2FjaGUubm9kZXNcbiAgICBpZiAocCA9PT0gJ2lkJykgY2FjaGVbdl0gPSB7fVxuICAgIGlmIChwID09PSAnbm9ybWFsaXplZEtleScpIGNhY2hlW3QuaWRdLm5vcm1hbGl6ZWRLZXkgPSB2XG4gICAgaWYgKHAgPT09ICdwb3NpdGlvbicpIGNhY2hlW3QuaWRdLnBvc2l0aW9uID0gdlxuICAgIGlmIChwID09PSAncGF0aCcpIGNhY2hlW3QuaWRdLnBhdGggPSB2XG4gICAgaWYgKHAgPT09ICdmcm9tTGluaycpIGNhY2hlW3QuaWRdLmZyb21MaW5rID0gdlxuICAgIGlmIChwID09PSAndG9MaW5rJykgY2FjaGVbdC5pZF0udG9MaW5rID0gdlxuXG4gICAgcmV0dXJuIFJlZmxlY3Quc2V0KHQsIHAsIHYsIHIpXG4gIH1cblxuICByZXR1cm4geyBzZXQgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJpbmROb2RlVG9DYW52YXNDYWNoZVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2JpbmROb2RlVG9DYW52YXNDYWNoZS5qcyIsImNvbnN0IFNWR0NhbnZhcyA9IHJlcXVpcmUoJy4vU1ZHQ2FudmFzLmpzJykgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuXG5jbGFzcyBNYWluIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5zdGF0ZSA9IHt9XG4gICAgbGV0IHJvb3QgPSBHdW4oKVxuICAgIHRoaXMuZ3VuID0gcm9vdC5nZXQoJ2RhdGEnKS5vbigoZCwgaykgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ2NoYW5nZSBvbiBkYXRhOicsIGQpXG4gICAgfSwgdHJ1ZSlcblxuICAgIHdpbmRvdy5ndW4gPSB0aGlzLmd1blxuXG4gICAgdGhpcy5nZXRHdW5EYXRhID0gdGhpcy5nZXRHdW5EYXRhLmJpbmQodGhpcylcbiAgICB0aGlzLnB1dE5ld05vZGUgPSB0aGlzLnB1dE5ld05vZGUuYmluZCh0aGlzKVxuICAgIHRoaXMucmVtb3ZlTm9kZSA9IHRoaXMucmVtb3ZlTm9kZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5yZW1vdmVMaW5rID0gdGhpcy5yZW1vdmVMaW5rLmJpbmQodGhpcylcbiAgICB0aGlzLmNvbm5lY3ROb2RlID0gdGhpcy5jb25uZWN0Tm9kZS5iaW5kKHRoaXMpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAvLyB0aGlzLmd1bi52YWwoKGRhdGEsIGtleSkgPT4ge1xuICAgLy8gICBsZXQgZ3JhcGhEYXRhID0ge31cbiAgIC8vICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcbiAgIC8vICAgICBpZiAoa2V5ICE9PSAnXycgJiYgZGF0YVtrZXldICE9PSBudWxsKSBncmFwaERhdGFba2V5XSA9IGRhdGFba2V5XVxuICAgLy8gICB9XG4gICAvLyAgIHRoaXMuc2V0U3RhdGUoe3BhdGg6ICdhcHAnLCBkYXRhOiBncmFwaERhdGEsIHJvb3RDYWNoZTogZ3JhcGhEYXRhfSlcbiAgIC8vIH0pXG5cbiAgIC8vIC8vIGtlZXBpbmcgdGhpcyBkYXRhIGluamVjdGlvbiBmb3Igbm93XG4gICAvLyBjb25zdCB0ZXN0ID0gdGhpcy5ndW4uZ2V0KCd0ZXN0JylcbiAgIC8vIHRlc3QucHV0KHtoaXN0b3J5OiAnVGhpcyBpcyBvZiBjb3Vyc2UgY29ycmVjdCwgYnV0IElcXCdkIGxpa2UgdG8gYWRkIHRoZSByZWFzb24gZm9yIGhhdmluZyB0byBkbyB0aGlzOiB0aGUgSlNPTiBzcGVjIGF0IGlldGYub3JnL3JmYy9yZmM0NjI3LnR4dCBjb250YWlucyB0aGlzIHNlbnRlbmNlIGluIHNlY3Rpb24gMi41OiBcIkFsbCBVbmljb2RlIGNoYXJhY3RlcnMgbWF5IGJlIHBsYWNlZCB3aXRoaW4gdGhlIHF1b3RhdGlvbiBtYXJrcyBleGNlcHQgZm9yIHRoZSBjaGFyYWN0ZXJzIHRoYXQgbXVzdCBiZSBlc2NhcGVkOiBxdW90YXRpb24gbWFyaywgcmV2ZXJzZSBzb2xpZHVzLCBhbmQgdGhlIGNvbnRyb2wgY2hhcmFjdGVycyAoVSswMDAwIHRocm91Z2ggVSswMDFGKS5cIiBTaW5jZSBhIG5ld2xpbmUgaXMgYSBjb250cm9sIGNoYXJhY3RlciwgaXQgbXVzdCBiZSBlc2NhcGVkLlxcXFxuQWNjb3JkaW5nIHRvIHd3dy5qc29uLm9yZyBKU09OIGRvZXMgYWNjZXB0IHRoZSBjb250cm9sIHNlcXVlbmNlIFwiXFxuXCIgaW4gc3RyaW5ncyAtIGFuZCBpZiB5b3UgdHJ5IEpTT04ucGFyc2UoW1xcJ1wiYVxcXFxuYVwiXFwnXSlbMV0uY2hhckNvZGVBdCgpOyB0aGF0IHdpbGwgc2hvdyAxMCAtIHdoaWNoIHdhcyBcIkxpbmVmZWVkXCIgdGhlIGxhc3QgdGltZSBJIGNoZWNrZWQuIC0tLSBCVFc6IFN0b3Agc2NyZWFtaW5nISd9KVxuICAgLy8gdGVzdC5wdXQoe3ZhbHVlOiBudWxsfSlcbiAgIC8vIHRlc3QucHV0KHtuYW1lOiAndGVzdCd9KVxuICAgLy8gdGVzdC5wdXQoeydvdGhlciB2YWx1ZSc6ICd0aGlzIGlzIGFub3RoZXIgdmFsdWUnfSlcbiAgIC8vIGNvbnN0IG5vZGUgPSB0aGlzLmd1bi5nZXQoJ25vZGUnKVxuICAgLy8gdGVzdC5wYXRoKCdub2RlIDAxJykucHV0KG5vZGUucGF0aCgnbm9kZTEnKS5wdXQoe25hbWU6ICcxc3Qgbm9kZSd9KSlcbiAgIC8vIHRlc3QucGF0aCgnbm9kZSAwMicpLnB1dChub2RlLnBhdGgoJ25vZGUyJykucHV0KHtuYW1lOiAnMm5kIG5vZGUnfSkpXG4gICAvLyB0ZXN0LnBhdGgoJ25vZGUgMDMnKS5wdXQobm9kZS5wYXRoKCdub2RlMycpLnB1dCh7bmFtZTogJzNyZCBub2RlJ30pKVxuICAgLy8gdGVzdC5wYXRoKCdub2RlIDA0JykucHV0KG5vZGUucGF0aCgnbm9kZTQnKS5wdXQoe25hbWU6ICc0dGggbm9kZSd9KSlcbiAgIC8vIHRlc3QucGF0aCgnbm9kZSAwNScpLnB1dChub2RlLnBhdGgoJ25vZGU1JykucHV0KHtuYW1lOiAnNXRoIG5vZGUnfSkpXG5cbiAgIC8vIHRlc3Qub24oKGRhdGEsIHBhdGgpID0+IHtcbiAgIC8vICAgbGV0IGdyYXBoRGF0YSA9IHt9XG4gICAvLyAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gICAvLyAgICAgaWYgKGtleSAhPT0gJ18nICYmIGRhdGFba2V5XSAhPT0gbnVsbCkgZ3JhcGhEYXRhW2tleV0gPSBkYXRhW2tleV1cbiAgIC8vICAgfVxuICAgLy8gICB0aGlzLnNldFN0YXRlKHtkYXRhOiBncmFwaERhdGF9KVxuICAgLy8gfSlcblxuICAgLy8gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgLy8gICB0aGlzLnNldFN0YXRlKHtkYXRhOnt9fSlcbiAgIC8vIH0sIDEwMDApXG4gICAvLyB0aGlzLmd1bi5nZXQoJ3Rlc3QnKS5wYXRoKCdub2RlIDAyJykudmFsKChkYXRhLCBrZXkpID0+IHtjb25zb2xlLmxvZyhkYXRhLGtleSk7fSlcbiAgIC8vIEd1bigpLmdldCgnYXBwJykucGF0aCgndGVzdCcpLnZhbCgoZGF0YSwga2V5KSA9PiB7Y29uc29sZS5sb2coZGF0YSxrZXkpO30pXG4gICAvLyB0aGlzLmd1bi5wYXRoKCdub2RlLm5vZGUxJykudmFsKChkYXRhLCBrZXkpID0+IHtjb25zb2xlLmxvZyhkYXRhLGtleSk7fSlcbiAgIC8vIHRoaXMuZ3VuLnBhdGgoJ25vZGUnKS52YWwoKGRhdGEsIGtleSkgPT4ge2NvbnNvbGUubG9nKGRhdGEsa2V5KTt9KVxuICB9XG5cbiAgZ2V0R3VuRGF0YSAocGF0aCkge1xuICAgIGxldCBkYXRhID0gdGhpcy5ndW4ucGF0aChwYXRoKVxuICAgIGlmIChwYXRoID09PSAnJykgZGF0YSA9IHRoaXMuZ3VuXG5cbiAgICB0aGlzLnNldFN0YXRlKHtkYXRhOiBkYXRhfSlcbiAgfVxuXG4gIHB1dE5ld05vZGUgKHBhdGgpIHtcbiAgICB0aGlzLmd1bi5wYXRoKHBhdGgpLnB1dCh7fSlcbiAgfVxuXG4gIHJlbW92ZU5vZGUgKG5vZGUsIHJlc2V0KSB7XG4gICAgaWYgKHJlc2V0KSBub2RlLmd1bi5wdXQobnVsbClcbiAgICBpZiAobm9kZS5saW5rcy5mcm9tKSBub2RlLmxpbmtzLmZyb20uZm9yRWFjaCgobCkgPT4gbC5ET00ucmVtb3ZlKCkpXG4gICAgaWYgKG5vZGUubGlua3MudG8pIG5vZGUubGlua3MudG8uZm9yRWFjaCgobCkgPT4gbC5ET00ucmVtb3ZlKCkpXG4gICAgbm9kZS5ET00ucmVtb3ZlKClcbiAgfVxuXG4gIHJlbW92ZUxpbmsgKGxpbmssIHJlc2V0KSB7XG4gICAgaWYgKHJlc2V0KSBsaW5rLmZyb21Ob2RlLmd1bi5wYXRoKGAke2xpbmsuZGF0YS5wcmVkaWNhdGV9YCkucHV0KG51bGwpXG4gICAgbGluay5ET00ucmVtb3ZlKClcbiAgfVxuXG4gIGNvbm5lY3ROb2RlIChmcm9tUGF0aCwgcHJlZGljYXRlLCB0b1BhdGgpIHtcbiAgICBsZXQgdG9Ob2RlID0gdGhpcy5ndW4ucGF0aCh0b1BhdGgpXG4gICAgdGhpcy5ndW4ucGF0aChgJHtmcm9tUGF0aH0uJHtwcmVkaWNhdGV9YCkucHV0KHRvTm9kZSlcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuICg8U1ZHQ2FudmFzIGdldEd1bkRhdGE9e3RoaXMuZ2V0R3VuRGF0YX0gZ3VuRGF0YT17dGhpcy5zdGF0ZS5kYXRhfSBwdXROZXdOb2RlPXt0aGlzLnB1dE5ld05vZGV9IHJlbW92ZU5vZGU9e3RoaXMucmVtb3ZlTm9kZX0gcmVtb3ZlTGluaz17dGhpcy5yZW1vdmVMaW5rfSBjb25uZWN0Tm9kZT17dGhpcy5jb25uZWN0Tm9kZX0gLz4pXG4gIH1cbn1cblxubGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2RpdiNtYWluJylcblJlYWN0RE9NLnJlbmRlcig8TWFpbiAvPiwgY29udGFpbmVyKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1haW5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9tYWluLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==