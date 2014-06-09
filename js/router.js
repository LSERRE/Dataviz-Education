var glob = {};
var findType;

define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'views/standardView',
  'views/Home',
  'views/Map',
  'views/Secteur',
  'views/HeatMap',
  'views/Select',
  'views/Bar',
  'views/CircleChart',
  'views/Error'
], function($,  _, Backbone, Handlebars, StandardView, Home, Map, Secteur, HeatMap, Select, Bar, CircleChart, Error) {

  // Our router
  var Router = Backbone.Router.extend({
    routes : {
      '': 'home',
      'A': 'a',
      'A/:donnee': 'a-donnee',
      'A/:donnee/:departement': 'a-donnee-departement',
      'B': 'b',
      'B/:departement': 'b-departement',
      'B/:depatement/:secteur': 'b-departement-secteur',
      'C': 'c',
      'C/:donnee': 'c-donnee',
      'C/:donnee/:secteur/:item': 'c-donnee-secteur-item',
      'emploi': 'emploi',
      'about': 'about',
      '*notFound': 'notFound'
    }
  });
  
  

  var initialize = function(){
    // Listen the routes
    var router = new Router();
    var view = new StandardView();
    var contain = function(){
      $('.content').empty();
      $('.page_404').remove();
    };
    var error = function(){
      var error = new Error();
      contain();
      error.render();
    };

    glob.router = router;

    
    router.on('route:home', function(){
      document.title = 'Home | JobShaker';
      contain();
      var home = new Home();
      home.render();
    });
    router.on('route:a', function(){
      document.title = 'Choix du jeu de données (A) | JobShaker';
      contain();
      var select = new Select();
      select.render();
    });
    router.on('route:a-donnee', function(donnee){
      document.title = 'Choix département (A) | JobShaker';
      contain();
      var map = new Map();
      map.render({donnee: donnee});
    });
    router.on('route:a-donnee-departement', function(donnee, urlDepartement){
      console.log('A - donnee - departement (bar)');
      contain();
      if(urlDepartement==localStorage.getItem('urlDepartement')){
        $('.titleContainer h2').html('Données xxx : '+localStorage.getItem('nomDepartement'));
        var circleChart = new CircleChart();
        circleChart.render({donnee: donnee, departement: urlDepartement});
      }
      else{
        var nomDepartement = findType('departements', urlDepartement, 'nom');
        if(nomDepartement){
          localStorage.setItem('nomDepartement', nomDepartement[0]);
          localStorage.setItem('codeDepartement', nomDepartement[2]);   
          $('.titleContainer h2').html('Données pour '+localStorage.getItem('nomDepartement'));  
          var circleChart = new CircleChart();
          circleChart.render({donnee: donnee, departement: urlDepartement});
        }
        else{
          router.navigate('', {trigger: true});
        }
      }
    });
    router.on('route:b', function(){
      console.log('B');
      contain();
      var map = new Map();
      map.render({});
    });
    router.on('route:b-departement', function(urlDepartement){
      contain();
      if(urlDepartement==localStorage.getItem('urlDepartement')){
        var secteur = new Secteur();
        secteur.render({departement: urlDepartement});
      }
      else{
        var nomDepartement = findType('departements', urlDepartement, 'nom');
        if(nomDepartement){
          localStorage.setItem('nomDepartement', nomDepartement[0]);
          localStorage.setItem('codeDepartement', nomDepartement[2]);        
          var secteur = new Secteur();
          secteur.render({departement: urlDepartement});
        }
        else{
          router.navigate('', {trigger: true});
        }
      }
    });
    router.on('route:b-departement-secteur', function(urlDepartement, urlSecteur){
      console.log('b-departement-secteur');
      contain();
      // first departement
      if(urlDepartement!=localStorage.getItem('urlDepartement')){
        var nomDepartement = findType('departements', urlDepartement, 'nom');
        if(nomDepartement){
          localStorage.setItem('nomDepartement', nomDepartement[0]);
          localStorage.setItem('codeDepartement', nomDepartement[2]);
        }
        else{
          router.navigate('', {trigger: true});
        }
      }
      // second sector
      if(urlSecteur==localStorage.getItem('urlSecteur')){
        $('.titleContainer h2').html('Le secteur '+localStorage.getItem('nomSecteur')+' : '+localStorage.getItem('nomDepartement'));
        var bar = new Bar();
        bar.render({departement: urlDepartement, secteur: urlSecteur});
      }
      else{
        var nomSecteur = findType('secteurs', urlSecteur, 'nom');
        if(nomSecteur){
          localStorage.setItem('nomSecteur', nomSecteur[0]);
          localStorage.setItem('imgSecteur', nomSecteur[1]);
          $('.titleContainer h2').html('Le secteur '+nomSecteur[0]+' : '+localStorage.getItem('nomDepartement'));
          var bar = new Bar();
          bar.render({departement: urlDepartement, secteur: urlSecteur});
        }
        else{
          router.navigate('', {trigger: true});
        }
      }
    });
    router.on('route:c', function(){
      console.log('C');
      contain();
      var select = new Select();
      select.render();
    });
    router.on('route:c-donnee', function(donnee){
      console.log('test');
      contain();
      var secteur = new Secteur();
      secteur.render({donnee: donnee});
    });
    router.on('route:c-donnee-secteur-item', function(donnee, urlSecteur, urlItemC){
      console.log('c-donnee-secteur-item');
      contain();

      // first secteur
      if(urlSecteur!=localStorage.getItem('urlSecteur')){
        var nomSecteur = findType('secteurs', urlSecteur, 'nom');
        if(nomSecteur){
          localStorage.setItem('nomSecteur', nomSecteur[0]);
          localStorage.setItem('imgSecteur', nomSecteur[1]);
        }
        else{
          router.navigate('#/notFound', {trigger: true});
        }
      }


      // second sector
      if(urlItemC==localStorage.getItem('urlItemC')){
        $('.titleContainer h2').html(localStorage.getItem('nomItemC')+' pour le secteur '+localStorage.getItem('nomSecteur'));
        var heatMap = new HeatMap();
        heatMap.render({donnee: donnee, secteur: urlSecteur, itemC: urlItemC});
      }
      else{
        console.log('url : '+urlItemC);
        var nomItemC = findType('itemC', urlItemC, 'nom');
        console.log(nomItemC);
        if(nomItemC){
          console.log('test');
          localStorage.setItem('nomItemC', nomItemC[0]);
          $('.titleContainer h2').html(nomItemC[0]+' pour le secteur '+localStorage.getItem('nomSecteur'));
          var heatMap = new HeatMap();
          heatMap.render({donnee: donnee, secteur: urlSecteur, itemC: urlItemC});
        }
        else{
          error();
        }
      }
    });
    router.on('route:notFound', function(){
      var error = new Error();
      contain();
      error.render();
    });

    if(!Backbone.history.start()) {
      console.log('error');
      var error = new Error();
      contain();
      error.render();
    }
      
  };
  
  return { 
    initialize: initialize
  };
});