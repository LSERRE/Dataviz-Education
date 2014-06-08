var glob = {};
var findDep;
var findData;
var findSector;

define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'views/standardView',
  'views/Home',
  'views/Map',
  'views/Secteur',
  'views/heatMap',
  'views/Select',
  'views/Bar'
], function($,  _, Backbone, Handlebars, StandardView, Home, Map, Secteur, HeatMap, Select, Bar) {

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
      'C/:donnee/:secteur': 'c-donnee-secteur',
      'emploi': 'emploi',
      'about': 'about'
    }
  });
  
  

  var initialize = function(){
    // Listen the routes
    var router = new Router();
    var view = new StandardView();
    var contain = function(){
      $('.content').empty();
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
        var bar = new Bar();
        bar.render({donnee: donnee, departement: urlDepartement});
      }
      else{
        var nomDepartement = findType('departements', urlDepartement, 'nom');
        if(nomDepartement){
          localStorage.setItem('nomDepartement', nomDepartement[0]);
          localStorage.setItem('codeDepartement', nomDepartement[2]);   
          $('.titleContainer h2').html('Données pour '+localStorage.getItem('nomDepartement'));  
          var bar = new Bar();
          bar.render({donnee: donnee, departement: urlDepartement});
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
        var select = new Select();
        select.render({departement: urlDepartement, secteur: urlSecteur});
      }
      else{
        var nomSecteur = findType('secteurs', urlSecteur, 'nom');
        if(nomSecteur){
          localStorage.setItem('nomSecteur', nomSecteur[0]);
          localStorage.setItem('imgSecteur', nomSecteur[1]);
          $('.titleContainer h2').html('Le secteur '+localStorage.getItem('nomSecteur')+' : '+localStorage.getItem('nomDepartement'));
          var select = new Select();
          select.render({departement: urlDepartement, secteur: urlSecteur});
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
    router.on('route:c-donnee-secteur', function(donnee, urlSecteur){
      console.log('c-donnee-secteur');
      contain();

      // second sector
      if(urlSecteur==localStorage.getItem('urlSecteur')){
        $('.titleContainer h2').html('Données xxx pour le secteur '+localStorage.getItem('nomSecteur'));
        var heatMap = new HeatMap();
        heatMap.render({donnee: donnee, secteur: urlSecteur});
      }
      else{
        var nomSecteur = findType('secteurs', urlSecteur, 'nom');
        if(nomSecteur){
          localStorage.setItem('nomSecteur', nomSecteur[0]);
          localStorage.setItem('imgSecteur', nomSecteur[1]);
          $('.titleContainer h2').html('Données xxx pour le secteur '+localStorage.getItem('nomSecteur'));
          var heatMap = new HeatMap();
          heatMap.render({donnee: donnee, secteur: urlSecteur});
        }
        else{
          router.navigate('', {trigger: true});
        }
      }
    });
    router.on('route:emploi', function(){
      var emploi = new Emploi();
      contain();
      emploi.render();
    });

    Backbone.history.start();
  };
  
  return { 
    initialize: initialize
  };
});