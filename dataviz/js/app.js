define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'handlebars',
  'router' // Request router.js
], function($, d3, _, Backbone, Handlebars, Router){
  var initialize = function(){
    Router.initialize();
  }

  return {
    initialize: initialize
  };
});