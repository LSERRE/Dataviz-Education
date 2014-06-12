// Filename: views/standardView

define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'text!../../templates/standardView-template.html',
  'text!../../templates/aside-template.html',
], function($, d3, _, Backbone, templateStandardView, templateAside){

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
      aside: '.backgroundAside',
      template: Handlebars.compile(templateStandardView), 
      templateAside: Handlebars.compile(templateAside), 
      render: function(options){
        var self = this;
        $('.page_404').remove();
        self.$el.html(self.template(options)); 
        $(self.aside).html(self.templateAside({step: options.step, number: options.number, departement: localStorage.getItem('nomDepartement'), codeDepartement: localStorage.getItem('codeDepartement'), secteur: localStorage.getItem('nomSecteur'), theme: localStorage.getItem('nomTheme') })); 
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

            if(options.step=='A'){
              var A = filter.init({
                result: '.resultDepartement',
                category : 'departements',
                step : options.step,
                initialized : function(data){
                  console.log(filter.result);
                  $('#inputDepartement').on('keyup',function(e){
                    filter.render(data, $(this).val(), 2);
                  });
                }
              });

              var B = filter.init({
                result: '.resultTheme',
                category : 'themes',
                step : options.step,
                initialized : function(data){
                  $('#inputTheme').on('keyup',function(e){
                    filter.render(data, $(this).val(), 2);
                  });
                }
              });
            }
            
            else if(options.step=='B'){
              filter.init({
                result: '.resultDepartement',
                category : 'departements',
                step : options.step,
                initialized : function(data){
                  $('#inputDepartement').on('keyup',function(e){
                    filter.render(data, $(this).val(), 2);
                  });
                }
              });

              filter.init({
                result: '.resultSecteur',
                category : 'secteurs',
                step : options.step,
                initialized : function(data){
                  $('#inputSecteur').on('keyup',function(e){
                    filter.render(data, $(this).val(), 2);
                  });
                }
              });
            }

            else{
              filter.init({
                result: '.resultTheme',
                category : 'themes',
                step : options.step,
                initialized : function(data){
                  $('#inputTheme').on('keyup',function(e){
                    filter.render(data, $(this).val(), 2);
                  });
                }
              });

              filter.init({
                result: '.resultSecteur',
                category : 'secteurs',
                step : options.step,
                initialized : function(data){
                  $('#inputSecteur').on('keyup',function(e){
                    filter.render(data, $(this).val(), 2);
                  });
                }
              });
            }
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

    var filter = {
      defaults : {
        result : '',
        file : '',
        category : '',
        step: '',
        initialized : function(){}
      },
      init : function(options){
        this.params=$.extend(this.defaults,options);
        this.initialize();
      },
      /*getJsonFile : function(){
        var self = this.params;
        $.getJSON(this.params.file, function(result){
          $.each(result, function(index, value){
              self.tab.push(value[self.category].toLowerCase());
            });
            self.gotJsonFile.call(this, null);
        });
      },*/
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
        var self = this;
        $(filter.params.result).empty();
        var result = new Array();
        if(search.length>1){
          $.each(data, function(index, value){
            var occurrence = value.minuscule.search(new RegExp(search.toLowerCase()));
            if(occurrence!=-1)
              result.push(new Array(value.nom, value.url, value.code, occurrence));
          });
          result.sort(function(a, b) { return a[3]>b[3] }); 
          var ul = $(self.params.result);
          for(i=0; i<result.length; i++){
            if(i==maxOccurrence)
              return;
            var lien;
            if(filter.params.step='B')
              lien='#/B/'+result[i][1]+'/'+localStorage.getItem('urlSecteur')+'/emploi';
            $('<li><a href="'+lien+'">'+result[i][0]+'</a></li>').appendTo(ul);
          }
        }
        
      }
    };


  return View;
});