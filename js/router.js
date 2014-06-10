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
  
  

  var initialize = function(){
    // Listen the routes
    var router = new Router();
    var view = new StandardView();
    var contain = function(){
      $('.content').empty();
      $('.page_404').remove();
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
<<<<<<< HEAD
      view.render({step:''});
=======
>>>>>>> FETCH_HEAD
      contain();
      var home = new Home();
      home.render();
    });

    router.on('route:a', function(){
      document.title = 'Choix du jeu de données (A) | JobShaker';
      contain();
      router.navigate('#/A/test', {trigger: true});
    });

    router.on('route:a-donnee', function(donnee){
      document.title = 'Choix département (A) | JobShaker';
      contain();
      var map = new Map();
      map.render({donnee: donnee});
    });

    router.on('route:a-donnee-departement-item', function(donnee, urlDepartement, urlItemA){
      console.log('A - donnee - departement (bar)');
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
        $('.titleContainer h2').html('Données xxx : '+localStorage.getItem('nomDepartement'));
        var circleChart = new CircleChart();
        circleChart.render({donnee: donnee, departement: urlDepartement, itemA: urlItemA});
      }
      else{
        var nomItemA = findType('itemA', urlItemA, 'nom');
        if(nomItemA){
          localStorage.setItem('nomItemA', nomItemA[0]);
          $('.titleContainer h2').html('Données xxx : '+localStorage.getItem('nomDepartement'));
          var circleChart = new CircleChart();
          circleChart.render({donnee: donnee, departement: urlDepartement, itemA: urlItemA});
        }
        else{
          error();
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
      view.render({step:'B'});
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
      view.render({step:'B'});
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
        $('.titleContainer h2').html('Le secteur '+localStorage.getItem('nomSecteur')+' : '+localStorage.getItem('nomDepartement'));
        var bar = new Bar();
        bar.render({departement: urlDepartement, secteur: urlSecteur, itemB: urlItemB});
      }
      else{
        var nomItemB = findType('itemB', urlItemB, 'nom');
        if(nomItemB){
          localStorage.setItem('nomItemB', nomItemB[0]);
          $('.titleContainer h2').html('Le secteur '+localStorage.getItem('nomSecteur')+' : '+localStorage.getItem('nomDepartement'));
          var bar = new Bar();
          bar.render({departement: urlDepartement, secteur: urlSecteur, itemB: urlItemB});
        }
        else{
          error();
        }
      }
    });

    router.on('route:c', function(){
      view.render({step:'C'});
      console.log('C');
      contain();
      router.navigate('#/C/test', {trigger: true});
    });

    router.on('route:c-donnee', function(donnee){
      view.render({step:'C'});
      console.log('test');
      contain();
      var secteur = new Secteur();
      secteur.render({donnee: donnee});
    });

    router.on('route:c-donnee-secteur-item', function(donnee, urlSecteur, urlItemC){
      view.render({step:'C'});
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
          error();
        }
      }


      // second itemC
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
      error();
    });

    Backbone.history.start()
  };
  
  return { 
    initialize: initialize
  };
});