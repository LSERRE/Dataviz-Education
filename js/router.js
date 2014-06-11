var glob = {};
var findType;
var heatMap=false;
var stepBar;

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
      'A/:donnee/:departement/:item': 'a-donnee-departement-item',
      'B': 'b',
      'B/:departement': 'b-departement',
      'B/:depatement/:secteur/:item': 'b-departement-secteur-item',
      'C': 'c',
      'C/:donnee': 'c-donnee',
      'C/:donnee/:secteur/:item': 'c-donnee-secteur-item',
      'emploi': 'emploi',
      'about': 'about',
      '*notFound': 'notFound'
    }
  });
  
  Handlebars.registerHelper('if_eq', function(a, b, opts) {
      if(a == b) // Or === depending on your needs
          return opts.fn(this);
      else
          return opts.inverse(this);
  });
  

  var initialize = function(){
    // Listen the routes
    var router = new Router();
    var view = new StandardView();
    var contain = function(){
      $('.content').empty();
      //$('.page_404').remove();
    };
    var error = function(){
      document.title = 'Page introuvable | JobShaker';
      var error = new Error();
      contain();
      error.render();
    };
    findType = function (type, param, result){
      var returnValue, img, code, data;
      if(type=='departements')
        data = JSON.parse(localStorage.getItem('departements'));
      else if(type=="secteurs")
        data = JSON.parse(localStorage.getItem('secteurs'));
      else if(type=='donnees')
        data = JSON.parse(localStorage.getItem('donnees'));
      else if(type=='itemA')
        data = JSON.parse(localStorage.getItem('itemA'));
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
              returnValue = value.url;
              img = value.img;
              code = value.code;
              return false;
            }
          }
          else{
            // want name
            if(value.url==param){
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

    glob.router = router;

    
    router.on('route:home', function(){
      document.title = 'Home | JobShaker';
      $('.titleContainer h2').html('Bienvenue sur JobShaker');
      view.render({step:''});
      contain();
      var home = new Home();
      home.render();
    });

    router.on('route:a', function(){
      document.title = 'Choix du jeu de données (A) | JobShaker';
      $('.titleContainer h2').html('Choisissez un jeu de données');
      view.render({step:'A', number:'1'});
      contain();
      router.navigate('#/A/test', {trigger: true});
    });

    router.on('route:a-donnee', function(donnee){
      document.title = 'Choix département (A) | JobShaker';
      $('.titleContainer h2').html('Choisissez un département');
      view.render({step:'A', number:'2'});
      contain();
      var map = new Map();
      map.render({donnee: donnee});
    });

    router.on('route:a-donnee-departement-item', function(donnee, urlDepartement, urlItemA){
      console.log('A - donnee - departement (bar)');
      view.render({step:'A', number:'3'});
      contain();
      // second departement
      if(urlDepartement!=localStorage.getItem('urlDepartement')){
        var nomDepartement = findType('departements', urlDepartement, 'nom');
        if(nomDepartement){
          localStorage.setItem('nomDepartement', nomDepartement[0]);
          localStorage.setItem('codeDepartement', nomDepartement[2]);
        }
        else{
          error();
        }
      }

      // third itemA
      if(urlItemA==localStorage.getItem('urlItemA')){
        document.title = localStorage.getItem('nomItemA')+ ' '+localStorage.getItem('nomDepartement')+' | JobShaker';
        $('.titleContainer h2').html(localStorage.getItem('nomDepartement')+' : les données '+localStorage.getItem('nomItemA')+' dans le secteur #jeudedonnée');
        var circleChart = new CircleChart();
        circleChart.render({donnee: donnee, departement: urlDepartement, itemA: urlItemA});
      }
      else{
        var nomItemA = findType('itemA', urlItemA, 'nom');
        if(nomItemA){
          document.title = localStorage.getItem('nomItemA')+ ' '+localStorage.getItem('nomDepartement')+' | JobShaker';
          $('.titleContainer h2').html(localStorage.getItem('nomDepartement')+' : les données '+localStorage.getItem('nomItemA')+' dans le secteur #jeudedonnée');
          localStorage.setItem('nomItemA', nomItemA[0]);
          var circleChart = new CircleChart();
          circleChart.render({donnee: donnee, departement: urlDepartement, itemA: urlItemA});
        }
        else{
          error();
        }
      }
    });

    router.on('route:b', function(){
      document.title = 'Choix du département (B) | JobShaker';
      $('.titleContainer h2').html('Choisissez un département');
      view.render({step:'B', number:'1'});
      contain();
      var map = new Map();
      map.render({});
    });

    router.on('route:b-departement', function(urlDepartement){
      document.title = 'Choix du secteur (B) | JobShaker';
      $('.titleContainer h2').html('Choisissez un secteur');
      view.render({step:'B', number:'2'});
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
          error();
        }
      }
    });

    router.on('route:b-departement-secteur-item', function(urlDepartement, urlSecteur, urlItemB){
      view.render({step:'B', number:'3'});
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
          error();
        }
      }

      // second secteur
      if(urlSecteur!=localStorage.getItem('urlSecteur')){
        var nomSecteur = findType('secteurs', urlSecteur, 'nom');
        if(nomSecteur){
          localStorage.setItem('nomSecteur', nomSecteur[0]);
          localStorage.setItem('imgSecteur', nomSecteur[1]);
        }
        else{
          error();
        }
      }
      
      // third itemB
      if(urlItemB==localStorage.getItem('urlItemB')){
        document.title = localStorage.getItem('nomItemB')+ ' '+localStorage.getItem('nomSecteur')+' '+localStorage.getItem('nomDepartement')+' | JobShaker';
        $('.titleContainer h2').html(localStorage.getItem('nomDepartement')+' : les données '+localStorage.getItem('nomItemB')+' dans le secteur '+localStorage.getItem('nomSecteur'));
        var bar = new Bar();
        bar.render({departement: urlDepartement, secteur: urlSecteur, itemB: urlItemB});
      }
      else{
        var nomItemB = findType('itemB', urlItemB, 'nom');
        if(nomItemB){
          localStorage.setItem('nomItemB', nomItemB[0]);
          document.title = localStorage.getItem('nomItemB')+ ' '+localStorage.getItem('nomSecteur')+' '+localStorage.getItem('nomDepartement')+' | JobShaker';
          $('.titleContainer h2').html(localStorage.getItem('nomDepartement')+' : les données '+localStorage.getItem('nomItemB')+' dans le secteur '+localStorage.getItem('nomSecteur'));
          var bar = new Bar();
          bar.render({departement: urlDepartement, secteur: urlSecteur, itemB: urlItemB});
        }
        else{
          error();
        }
      }
    });

    router.on('route:c', function(){
      document.title = 'Choix du jeu de données (C) | JobShaker';
      $('.titleContainer h2').html('Choisissez un jeu de données');
      view.render({step:'C', number:'1'});
      console.log('C');
      contain();
      router.navigate('#/C/test', {trigger: true});
    });

    router.on('route:c-donnee', function(donnee){
      document.title = 'Choix du secteur (C) | JobShaker';
      $('.titleContainer h2').html('Choisissez un secteur');
      view.render({step:'C', number:'2'});
      contain();
      heatMap=false;
      var secteur = new Secteur();
      secteur.render({donnee: donnee});
    });

    router.on('route:c-donnee-secteur-item', function(donnee, urlSecteur, urlItemC){
      console.log(heatMap);
      view.render({step:'C', number:'3'});
      console.log(heatMap);
      if(heatMap==false)
        contain();
      // first secteur
      if(urlSecteur!=localStorage.getItem('urlSecteur')){
        var nomSecteur = findType('secteurs', urlSecteur, 'nom');
        if(nomSecteur){
          localStorage.setItem('nomSecteur', nomSecteur[0]);
          localStorage.setItem('imgSecteur', nomSecteur[1]);
        }
        else{
          error();
        }
      }


      // second itemC
      if(urlItemC==localStorage.getItem('urlItemC')){
        document.title = localStorage.getItem('nomItemC')+ ' '+localStorage.getItem('nomSecteur')+' #jeudedonnées'+' | JobShaker';
        $('.titleContainer h2').html('#jeudedonnées : les données '+localStorage.getItem('nomItemC')+' dans le secteur '+localStorage.getItem('nomSecteur'));
        var heatMap = new HeatMap();
        heatMap.render({donnee: donnee, secteur: urlSecteur, itemC: urlItemC});
      }
      else{
        var nomItemC = findType('itemC', urlItemC, 'nom');
        if(nomItemC){
          localStorage.setItem('nomItemC', nomItemC[0]);
          document.title = localStorage.getItem('nomItemC')+ ' '+localStorage.getItem('nomSecteur')+' #jeudedonnées'+' | JobShaker';
          $('.titleContainer h2').html('#jeudedonnées : les données '+localStorage.getItem('nomItemC')+' dans le secteur '+localStorage.getItem('nomSecteur'));
          var heatMap = new HeatMap();
          heatMap.render({donnee: donnee, secteur: urlSecteur, itemC: urlItemC});
        }
        else{
          error();
        }
      }
    });

    router.on('route:notFound', function(){
      error();
    });

    Backbone.history.start()
  };
  
  return { 
    initialize: initialize
  };
});