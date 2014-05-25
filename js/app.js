define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'router' // Request router.js
], function($, _, Backbone, Handlebars, Router){
  var initialize = function(){
    Router.initialize();
  }

  return {
    initialize: initialize
  };
});