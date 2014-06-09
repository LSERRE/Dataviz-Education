// Filename: views/standardView
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',

], function($, d3, _, Backbone){

  var View = Backbone.View.extend({});

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
      localStorage.setItem('itemB', JSON.stringify(data.itemB));
      localStorage.setItem('itemC', JSON.stringify(data.itemC));
      
      findType = function (type, param, result){
        var returnValue, img, code, data;
        if(type=='departements')
          data = JSON.parse(localStorage.getItem('departements'));
        else if(type=="secteurs")
          data = JSON.parse(localStorage.getItem('secteurs'));
        else if(type=='donnees')
          data = JSON.parse(localStorage.getItem('donnees'));
        else if(type=='itemB')
          data = JSON.parse(localStorage.getItem('itemB'));
        else if(type=='itemC')
          data = JSON.parse(localStorage.getItem('itemC'));
        else
          return false;
        
        if(result=='url' || result=='nom'){
          $.each(data, function(key, value){
            if(result=='url'){
              // want url
              if(value.nom==param){
                console.log('njekzbgzjbgjkg');
                returnValue = value.url;
                img = value.img;
                code = value.code;
                return false;
              }
            }
            else{
              // want name
              if(value.url==param){
                console.log('jieajfioa');
                returnValue = value.nom;
                img = value.img;
                code = value.code;
                return false;
              }
            }          
          });
        }
        if(returnValue || img || code)
          return [returnValue, img, code];
        return false;
      };
    });
    

  return View;
});