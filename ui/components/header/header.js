// JS modules
var $ = require('jquery');
var dispatcher = require('utils/dispatcher');
var EVENTS = require('utils/events');
// Styles
require('./header.scss');
require('./nav-list.scss');
require('./search-box.scss');

var breakpoints = {
  lg: 1200,
  md: 960,
  sm: 640,
  xsm: 320
};

var selectors = {
  root: '.header',
  navList: '#nav-main',
  navItem: '.nav-list__item',
  searchItem: '#nav-search-item',
  subBlock: '.header__sub',
  subItem: '.header__sub-item'
};


/**
 * @typedef {Object} headerConfig 
 * @property {Number} timeToShow
 * @property {Number} timeToHide
 * @property {Function} onInit
 * @property {Function} onBeforeShowSub
 * @property {Function} onAfterShowSub
 * @property {Function} onBeforeShowSearch
 * @property {Function} onAfterShowSearch
 *
 */

var defaults = {
  timeToShow: 50,
  timeToHide: 250,
  mobileBreakpoint: breakpoints.md,

  onInit: null,
  onBeforeShowSub: null,
  onAfterShowSub: null,
  onBeforeShowSearch: null,
  onAfterShowSearch: null
};


/**
 * The actual Header instance.
 * @constructor
 * @param {String} [selector]
 * @param {headerConfig} [config]
 */
function Header(selector, config) {
  if (!(this instanceof Header)) {
    return new Header(selector, config);
  }

  this.selectors = $.extend({}, selectors, {root: selector});
  this.config = $.extend({}, defaults, config);

  //this.init(selector);
}


/**
 * Internal function for watching a mouse events by timeout
 * */
var hoverWatch = {
  timer: 0,
  wait: function(callback, ms) {
    this.clearTimer();
    this.timer = setTimeout(callback, ms);
  },
  clearTimer: function() {
    clearTimeout(this.timer);
  }
};


/**
 * Internal variable to store value of an active nav-item/sub-item
 * */
var activeItem = null;

/**
 * Internal variable to store search state
 * */
var activeSearch = false;

/**
 * Internal variable to store hover-state of nav-items (is the mouse is under a nav-item)
 * */
var hoverNavItem = false;


/**
 * Initializing
 */
Header.prototype.init = function () {
  var $header = $(this.selectors.root),
      $navList = $(this.selectors.navList, $header),
      searchInput = document.getElementById('header-search');


  this.$navItems = $(this.selectors.navItem, $navList);
  this.$searchItem = $(this.selectors.searchItem, $header);
  this.$subBlock = $(this.selectors.subBlock, $header);
  this.$subItems = $(this.selectors.subItem, this.$subBlock);


  this.$navItems.each($.proxy(function(index, item) {
    var $navItem = $(item);

    var subitemId = item.getAttribute('data-sub'),
        subitemSelector = '#' + subitemId,
        $subItem = subitemId ? $(subitemSelector) : null;

    $navItem.on('mouseover mouseout click', $.proxy(function (event) {
      var href = event.currentTarget.href;

      if (event.type == 'mouseover') {
        if (subitemId) {
          this.showSub(subitemSelector, $navItem);
        } else {
          this.hideSub();
        }
      }
      else if (event.type == 'mouseout') {
        this.hideSub(subitemSelector, $navItem);
      }

      hoverNavItem = event.type == 'mouseover';

      return href && href != '#';

    }, this));


    if ($subItem) {
      $subItem.on('mouseover mouseout', $.proxy(function(event) {

        if (event.type == 'mouseover') {
          this.showSub(subitemSelector, $navItem);
        }
        else if (event.type == 'mouseout') {
          this.hideSub(subitemSelector, $navItem);
        }
      }, this));
    }

  }, this));


  this.$searchItem.on('click', $.proxy(function(event) {
    event.preventDefault();

    var $searchItem = $(event.currentTarget);
    var searchItemSelector = '#' + event.currentTarget.getAttribute('data-sub');

    if (activeSearch == false) {
      this.showSub(searchItemSelector, $searchItem);
    } else {
      this.hideSub(searchItemSelector, $searchItem);
    }

    setTimeout(function() {
      searchInput.focus();
    }, 100);

    activeSearch = !activeSearch;
  }, this));

  dispatcher.on(EVENTS.WINDOW.KEYPRESS, $.proxy(function (event) {
    if (event.keyCode == 27) {
      this.hideSub();
    }
  }, this));
};


/**
 * Showing Sub item
 * @param {String} subitemSelector
 * @param {Object} $navItem
 */
Header.prototype.showSub = function (subitemSelector, $navItem) {

  activeItem = subitemSelector;

  $navItem.addClass('_active');

  hoverWatch.wait($.proxy(function() {

    if (activeItem == subitemSelector) {
      hoverWatch.clearTimer();

      this.$navItems.removeClass('_active');
      this.$searchItem.removeClass('_active');

      if ($navItem && $navItem.length) {
        $navItem.addClass('_active');
      }

      if (activeItem) {
        var $subItem = this.$subItems.filter(activeItem);

        if ($subItem.length) {
          this.$subBlock.addClass('_active');

          this.$subItems.removeClass('_active');
          $subItem.addClass('_active');

        } else {
          this.hideSub();
        }

      } else {
        this.$subBlock.removeClass('_active');
      }
    }

  }, this), this.config.timeToShow);
};


/**
 * Hiding Sub item
 * @param {String} subitemSelector
 * @param {Object} $navItem
 */
Header.prototype.hideSub = function (subitemSelector, $navItem) {
  var waitingTime = hoverNavItem || activeSearch ? this.config.timeToShow : this.config.timeToHide;

  var hideSub = $.proxy(function hideSub () {
    hoverWatch.clearTimer();

    if (this.$searchItem && this.$subBlock) {
      this.$searchItem.removeClass('_active');
      this.$subBlock.removeClass('_active');
    }

    if (!hoverNavItem && this.$navItems) {
      this.$navItems.removeClass('_active');
    }

    activeItem = null;
    activeSearch = false;
  }, this);


  if (!subitemSelector && !$navItem) {

    hideSub ();

  } else {

    if (hoverNavItem && $navItem && $navItem.length) {
      $navItem.removeClass('_active');
    }

    hoverWatch.wait($.proxy(function() {
      if (activeItem == subitemSelector) {
        hideSub();
      }
    }, this), waitingTime);
  }

};


module.exports = new Header();
