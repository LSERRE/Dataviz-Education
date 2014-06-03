// Filename: views/standardView
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',

], function($, d3, _, Backbone){

  var View = Backbone.View.extend({});

  	$('.leftPanel').mouseover(function(){
  		$('#mainContainer').addClass('active');
  		$('#asideExplain').addClass('active');
  		$('#asideExplain').removeClass('desactive');
  	});
  	$('.leftPanel').mouseleave(function(){
  		$('#mainContainer').removeClass('active');
  		$('#asideExplain').addClass('desactive');
  		$('#asideExplain').removeClass('active');
  	});

  return View;
});