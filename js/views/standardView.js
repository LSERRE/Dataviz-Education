// Filename: views/standardView
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',

], function($, d3, _, Backbone){

  var View = Backbone.View.extend({});

  var windowHeight = $(document).height();
  $("#leftPanel").height(windowHeight);
  $("#mainContainer").height(windowHeight);

  return View;
});