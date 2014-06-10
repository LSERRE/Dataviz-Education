// Filename: views/standardView
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'text!../../templates/standardView-template.html'
], function($, d3, _, Backbone, templateStandardView){

  	var status = true;

    $('#buttonSidebar').on('click', function(e){
      e.preventDefault();
      if(status){
        $('#mainContainer').addClass('active');
        $('.leftPanel').addClass('asideActive');
        $('#asideExplain').addClass('active');
        $('#asideExplain').removeClass('desactive');
        status = false;
      }
      else{
        $('#mainContainer').removeClass('active');
        $('#asideExplain').addClass('desactive');
        $('#asideExplain').removeClass('active');
        $('.leftPanel').removeClass('asideActive');
        status = true ;
      }
    });

    $('.content').on('click', function(e){
      e.preventDefault;
      if($('.leftPanel').hasClass('asideActive')){
        $('#mainContainer').removeClass('active');
        $('#asideExplain').addClass('desactive');
        $('#asideExplain').removeClass('active');
        $('.leftPanel').removeClass('asideActive');
        status = true ;
      }
    });

    $.getJSON('json/title.json', function(data){
      localStorage.setItem('departements', JSON.stringify(data.departements));
      localStorage.setItem('secteurs', JSON.stringify(data.secteurs));
      localStorage.setItem('donnees', JSON.stringify(data.donnees));
      localStorage.setItem('itemA', JSON.stringify(data.itemA));
      localStorage.setItem('itemB', JSON.stringify(data.itemB));
      localStorage.setItem('itemC', JSON.stringify(data.itemC));

        
    });
    

    var View = Backbone.View.extend({
      el: '.filterContainer',   
      template: Handlebars.compile(templateStandardView), 
      render: function(options){
        var self = this;
        $('.page_404').remove();
        self.$el.html(self.template(options)); 
      }
    });   

  return View;
});