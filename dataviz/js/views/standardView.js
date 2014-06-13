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

    $('.pluginCountNum').css({'max-width':'8px'})

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
        $(self.aside).html(self.templateAside({step: options.step, number: options.number, departement: localStorage.getItem('nomDepartement'), codeDepartement: localStorage.getItem('codeDepartement'), secteur: localStorage.getItem('nomSecteur'), urlImageSecteur: 'svg/' + localStorage.getItem('imgSecteur'),  theme: localStorage.getItem('nomTheme') })); 
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
              var A = filterDepartement.init({
                result: '.resultDepartement',
                category : 'departements',
                step : options.step,
                initialized : function(data){
                  $('#inputDepartement').on('keyup',function(e){
                    e.preventDefault();
                    filterDepartement.render(data, $(this).val(), 2);
                  });
                }
              });

              var B = filterTheme.init({
                result: '.resultTheme',
                category : 'themes',
                step : options.step,
                initialized : function(data){
                  $('#inputTheme').on('keyup',function(e){
                    e.preventDefault();
                    filterTheme.render(data, $(this).val(), 2);
                  });
                }
              });
            }
            
            else if(options.step=='B'){
              filterDepartement.init({
                result: '.resultDepartement',
                category : 'departements',
                step : options.step,
                initialized : function(data){
                  $('#inputDepartement').on('keyup',function(e){
                    filterDepartement.render(data, $(this).val(), 2);
                  });
                }
              });

              filterSecteur.init({
                result: '.resultSecteur',
                category : 'secteurs',
                step : options.step,
                initialized : function(data){
                  $('#inputSecteur').on('keyup',function(e){
                    filterSecteur.render(data, $(this).val(), 2);
                  });
                }
              });
            }

            else{
              filterTheme.init({
                result: '.resultTheme',
                category : 'themes',
                step : options.step,
                initialized : function(data){
                  $('#inputTheme').on('keyup',function(e){
                    filterTheme.render(data, $(this).val(), 2);
                  });
                }
              });

              filterSecteur.init({
                result: '.resultSecteur',
                category : 'secteurs',
                step : options.step,
                initialized : function(data){
                  $('#inputSecteur').on('keyup',function(e){
                    filterSecteur.render(data, $(this).val(), 2);
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

 var filterTheme = {
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
        $(filterTheme.params.result).empty();
        self.params.initialized.call(this);
      },
      render:function(data, search, maxOccurrence){
        var self = this;
        $(filterTheme.params.result).empty();
        if(search.length>1){
          urlTheme=localStorage.getItem('urlTheme');
          var ul = $(self.params.result);
          if(filterTheme.params.step='A'){
            if(urlTheme=='bienetre'){
              $('<li><a href="#/A/emploi/'+localStorage.getItem('urlDepartement')+'/employes">Emploi</a></li>').appendTo(ul);
              $('<li><a href="#/A/societe/'+localStorage.getItem('urlDepartement')+'/population-active">Société</a></li>').appendTo(ul);
            }
            else if(urlTheme=='emploi'){
              $('<li><a href="#/A/bienetre/'+localStorage.getItem('urlDepartement')+'/temps-libre">Bien-être</a></li>').appendTo(ul);
              $('<li><a href="#/A/societe/'+localStorage.getItem('urlDepartement')+'/population-active">Société</a></li>').appendTo(ul);
            }           
            else{
              $('<li><a href="#/A/bienetre/'+localStorage.getItem('urlDepartement')+'/temps-libre">Bien-être</a></li>').appendTo(ul);
              $('<li><a href="#/A/emploi/'+localStorage.getItem('urlDepartement')+'/employes">Emploi</a></li>').appendTo(ul);
            }
          }
          else{
            if(urlTheme=='bienetre'){
              $('<li><a href="#/C/emploi/'+localStorage.getItem('urlSecteur')+'/employes">Emploi</a></li>').appendTo(ul);
              $('<li><a href="#/C/societe/'+localStorage.getItem('urlSecteur')+'/population-active">Société</a></li>').appendTo(ul);
            }
            else if(urlTheme=='emploi'){
              $('<li><a href="#/C/bienetre/'+localStorage.getItem('urlSecteur')+'/temps-libre">Bien-être</a></li>').appendTo(ul);
              $('<li><a href="#/C/societe/'+localStorage.getItem('urlSecteur')+'/population-active">Société</a></li>').appendTo(ul);
            }           
            else{
              $('<li><a href="#/C/bienetre/'+localStorage.getItem('urlSecteur')+'/temps-libre">Bien-être</a></li>').appendTo(ul);
              $('<li><a href="#/C/emploi/'+localStorage.getItem('urlSecteur')+'/employes">Emploi</a></li>').appendTo(ul);
            }
          }   
        }
        
      }
    };

     var filterDepartement = {
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
        $(filterDepartement.params.result).empty();
        var result = new Array();
        var data = JSON.parse(localStorage.getItem(self.params.category));
        $.each(data, function(index, value){
          data[index].minuscule = value['nom'].toLowerCase();
        });
        self.params.initialized.call(this, data);
      },
      render:function(data, search, maxOccurrence){
        var self = this;
        $(filterDepartement.params.result).empty();
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
            if(filterDepartement.params.step=='B'){
              lien='#/B/'+result[i][1]+'/'+localStorage.getItem('urlSecteur')+'/emploi';
            }              
            else{
              urlTheme=localStorage.getItem('urlTheme');
              if(urlTheme=='bienetre')
                var itemDefault = 'temps-libre';
              else if(urlTheme=='emploi')
                var itemDefault = 'employes';              
              else
                var itemDefault = 'population-active';
              lien='#/A/'+urlTheme+'/'+result[i][1]+'/'+itemDefault;

            }
            $('<li><a href="'+lien+'">'+result[i][0]+'</a></li>').appendTo(ul);
          }
        }
        
      }
    };

     var filterSecteur = {
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
      compare: function(a, b){
        return a[2] < b[2];
      },
      initialize : function(){
        var self = this;
        $(filterSecteur.params.result).empty();
        var result = new Array();
        var data = JSON.parse(localStorage.getItem(self.params.category));
        $.each(data, function(index, value){
          data[index].minuscule = value['nom'].toLowerCase();
        });
        self.params.initialized.call(this, data);
      },
      render:function(data, search, maxOccurrence){
        var self = this;
        $(filterSecteur.params.result).empty();
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
            if(filterSecteur.params.step=='B'){
              lien='#/B/'+localStorage.getItem('urlDepartement')+'/'+result[i][1]+'/emploi';
            }              
            else{
              urlTheme=localStorage.getItem('urlTheme');
              if(urlTheme=='bienetre')
                var itemDefault = 'temps-libre';
              else if(urlTheme=='emploi')
                var itemDefault = 'employes';
              else
                var itemDefault = 'population-active';
              lien='#/C/'+urlTheme+'/'+result[i][1]+'/'+itemDefault;

            }
             
            $('<li><a href="'+lien+'">'+result[i][0]+'</a></li>').appendTo(ul);
          }
        }
        
      }
    };



  return View;
});