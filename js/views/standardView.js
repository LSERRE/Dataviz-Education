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

    $('#asideContent').hover(function(){
      if(status){
        $('#mainContainer').addClass('active');
        $('.leftPanel').addClass('asideActive');
        $('#asideExplain').addClass('active');
        $('#asideExplain').removeClass('desactive');
      }
    });

    $('#leftPanel').mouseleave(function(){
        if(status){
          $('#mainContainer').removeClass('active');
          $('#asideExplain').addClass('desactive');
          $('#asideExplain').removeClass('active');
          $('.leftPanel').removeClass('asideActive');
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

    $('#about').on('click', function(e){
      e.preventDefault();
      $('#aboutSection').addClass('active');
      $('#mainContainer').removeClass('active');
      $('#asideExplain').addClass('desactive');
      $('#asideExplain').removeClass('active');
      $('.leftPanel').removeClass('asideActive');
      return false;
    });

    $('#closeAbout').on('click', function(e){
      e.preventDefault();
      $('#aboutSection').removeClass('active');
      return false;
    });

    
    

    var View = Backbone.View.extend({
      el: '.filterContainer',   
      template: Handlebars.compile(templateStandardView), 
      render: function(options){
        var self = this;
        $('.page_404').remove();
        self.$el.html(self.template(options)); 
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

    var departement = new Array();
    /*var filter = {
      defaults : {
        result : '',
        file : '',
        category : '',
        initialized : function(){}
      },
      init : function(options){
        this.params=$.extend(this.defaults,options);
        this.initialize();
      },
      compare: function(a, b){
        return a[2] < b[2];
      },
      initialize : function(){
        var self = this;
        $(filter.params.result).empty();
        var result = new Array();
        var data = JSON.parse(localStorage.getItem(self.params.category));
        $.each(data, function(index, value){
          data[index].minuscule = value['nom'].toLowerCase();
          //console.log(data['nom']);
        });
        self.params.initialized.call(this, data);
      },
      render:function(data, search, maxOccurrence){
        $(filter.params.result).empty();
        var result = new Array();
        if(search.length>1){
          $.each(data, function(index, value){
            var occurrence = value.minuscule.search(new RegExp(search.toLowerCase()));
            if(occurrence!=-1)
              result.push(new Array(value.nom, value.url, value.code, occurrence));
          });
          result.sort(function(a, b) { return a[3]>b[3] }); 

          var ul = $(filter.params.result);
          for(i=0; i<result.length; i++){
            if(i==maxOccurrence)
              return;
            $('<li><a href="">'+result[i][0]+'</a></li>').appendTo(ul);
          }
        }
        
      }
    };

    filter.init({
      result: '.resultDepartement',
      category : 'departements',
      initialized : function(data){
        $('#inputDepartements').on('keyup',function(e){
          filter.render(data, $(this).val(), 2);
        });
      }
    });*/

  return View;
});