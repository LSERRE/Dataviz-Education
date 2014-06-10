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
        var stepBar=true;
        console.log(options.number);
        if(options.number){
          $('.stepUI').removeClass('none');
          if(stepBar==false)
            $('.content').css('width', '100%').css('width', '-=10px');
          if(options.number==1){
            $('.step1').addClass('currentStep');
            $('.step2').removeClass('currentStep');
            $('.step3').removeClass('currentStep');
          }
          else if(options.number==2){
            $('.step1').addClass('currentStep');
            $('.step2').addClass('currentStep');
            $('.step3').removeClass('currentStep');
          }
          else if(options.number==3){
            $('.step1').addClass('currentStep');
            $('.step2').addClass('currentStep');
            $('.step3').addClass('currentStep');
          }
        }
        else{
          stepBar=false;
          $('.stepUI').addClass('none');
          $('.content').width($('.content').width()+10);
        }
      }
    });   

  return View;
});