require('./index.scss');
require('components/grid');
require('components/header');
require('components/core/core.scss');
require('components/button');
require('fullpage.js');
require('fullpage.js/jquery.fullPage.css');

require('page/index');
require('com/cookie-banner');

var dispatcher = require('utils/dispatcher');
var $ = require('jquery');

$(document).ready(function () {
  var headerSelector = '.header';
  var header = $(headerSelector);

  $('#fullpage').fullpage({
    paddingTop: '70px',
    sectionsColor: ['#fff', '#3b3e43', '#fff', '#3b3e43'],
    fixedElements: '.header',
    afterLoad: function(anchorLink, index){
      if(index % 2 == 1){
        header.removeClass('_dark');
        $('.icon._kotlin-text').removeClass('_white');
      } else {
        header.addClass('_dark');
        $('.icon._kotlin-text').addClass('_white')
      }
    }
  });

  var $tabs = $('.tabs__tab');
  var $tabPanes = $('.tabs__pane');

  $tabs.on('click', function(){
    var tabId = this.getAttribute("data-id");

    $tabs.removeClass('is-active');
    $tabPanes.removeClass('is-active');

    $('.tabs__tab[data-id=' + tabId + ']').addClass("is-active");
    $('.tabs__pane[data-tab-id=' + tabId + ']').addClass("is-active");
  })
});

