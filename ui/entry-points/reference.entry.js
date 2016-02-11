require('components/grid');
require('../components/core/core.scss');
require('./reference.scss');

var NavTree = require('com/nav-tree');
var header = require('../components/header');

$(document).ready(function () {
  header.init();
  new NavTree(document.getElementById('reference-nav'));
});