var glob = {};

define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'views/standardView',
  'views/Home',
  'views/Map',
  'views/Secteur',
  'views/Select',
  'views/Emploi'
], function($,  _, Backbone, Handlebars, StandardView, Home, Map, Secteur, Select, Emploi) {

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

    glob.router = router;
    router.on('route:home', function(){
      console.log('home');
      var home = new Home();
      home.render();
    });
    router.on('route:a', function(){
      console.log('A');
      var select = new Select();
      select.render();
    });
    router.on('route:a-donnee', function(donnee){
      console.log('A - donnee');
      var select = new Select();
      select.render({donnee: donnee});
    });
    router.on('route:a-donnee-departement', function(donnee, departement){
      console.log('A - donnee - departement');
      var select = new Select();
      select.render({donnee: donnee, departement: departement});
    });
    router.on('route:b', function(){
      var map = new Map();
      map.render();
    });
    router.on('route:b-departement', function(departement){
      var secteur = new Secteur();
      secteur.render({departement: departement});
    });
    router.on('route:b-departement-secteur', function(departement, secteur){
      console.log('b-departement-secteur');
      var select = new Select();
      select.render({departement: departement, secteur: secteur});
    });
    router.on('route:c', function(){
      console.log('C');
      var select = new Select();
      select.render();
    });
    router.on('route:c-donnee', function(donnee){
      console.log('c-donnee');
      var select = new Select();
      select.render({donnee: donnee});
    });
    router.on('route:c-donnee-secteur', function(donnee, secteur){
      console.log('c-donnee-secteur');
      var select = new Select();
      select.render({donnee: donnee, secteur: secteur});
    });
    router.on('route:emploi', function(){
      var emploi = new Emploi();
      emploi.render();
    });



    Backbone.history.start();
  };
  
  return { 
    initialize: initialize
  };
});