var glob = {};
var findType;
var heatMap=false;
var statusCircleChart=false;
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
  'views/Theme',
  'views/HeatMap',
  'views/Bar',
  'views/CircleChart',
  'views/Error'
], function($,  _, Backbone, Handlebars, StandardView, Home, Map, Secteur, Theme, HeatMap, Bar, CircleChart, Error) {

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

 
  $.getJSON('json/title.json', function(data){
      localStorage.setItem('departements', JSON.stringify(data.departements));
      localStorage.setItem('secteurs', JSON.stringify(data.secteurs));
      localStorage.setItem('themes', JSON.stringify(data.themes));
      localStorage.setItem('emploi', JSON.stringify(data.emploi));
      localStorage.setItem('societe', JSON.stringify(data.societe));
      localStorage.setItem('bienetre', JSON.stringify(data.bienetre));        
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
      else if(type=='themes')
        data = JSON.parse(localStorage.getItem('themes'));
      else if(type=='emploi')
        data = JSON.parse(localStorage.getItem('emploi'));
      else if(type=='societe')
        data = JSON.parse(localStorage.getItem('societe'));
      else if(type=='bienetre')
        data = JSON.parse(localStorage.getItem('bienetre'));
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
              id = value.id;
              color = value.color;
              unite = value.unite;
              return false;
            }
          }
          else{
            // want name
            if(value.url==param){
              returnValue = value.nom;
              img = value.img;
              code = value.code;
              id = value.id;
              color = value.color;
              unite = value.unite;
              return false;
            }
          }          
        });
      }
      if(returnValue || img || code || id || color || unite)
        return [returnValue, img, code, id, color, unite];
      return false;
    };

    glob.router = router;

    
    router.on('route:home', function(){
      router.navigate('#/A', {trigger: true});
    });

    router.on('route:a', function(){
      // document title and page h2 title
      document.title = 'Choix du jeu de données (A) | JobShaker';
      $('.titleContainer h2').html('Choisissez un jeu de données');
      // to right step bar and step name
      view.render({step:'A', number:'1'});
      // div content empty
      contain();
      statusCircleChart=false;
      var theme = new Theme();
      // To determine if we are on step A or step C
      theme.render({step:'A'});
    });

    router.on('route:a-donnee', function(donnee){
      document.title = 'Choix département (A) | JobShaker';
      $('.titleContainer h2').html('Choisissez un département');
      view.render({step:'A', number:'2'});
      contain();
      statusCircleChart=false;
      var map = new Map();
      map.render({donnee: donnee});
    });

    router.on('route:a-donnee-departement-item', function(donnee, urlDepartement, urlItemA){
      view.render({step:'A', number:'3'});
      if(statusCircleChart==false){
        contain();
      }
        
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
        document.title = localStorage.getItem('nomItemA')+ ' '+localStorage.getItem('nomDepartement')+' '+localStorage.getItem('nomTheme')+' | JobShaker';
        $('.titleContainer h2').html(localStorage.getItem('nomDepartement')+' > '+localStorage.getItem('nomItemA')+' > '+localStorage.getItem('nomTheme'));
        //aside
        view.render({step:'A', number:'3'});
        var circleChart = new CircleChart();
        circleChart.render({donnee: donnee, departement: urlDepartement, itemA: urlItemA});
      }
      else{
        var nomItemA = findType(donnee, urlItemA, 'nom');
        if(nomItemA){
          document.title = localStorage.getItem('nomItemA')+ ' '+localStorage.getItem('nomDepartement')+' '+localStorage.getItem('nomTheme')+' | JobShaker';
          $('.titleContainer h2').html(localStorage.getItem('nomDepartement')+' > '+localStorage.getItem('nomItemA')+' > '+localStorage.getItem('nomTheme'));
          localStorage.setItem('nomItemA', nomItemA[0]);
          localStorage.setItem('urlItemA', nomItemA[1]);
          localStorage.setItem('uniteItemA', nomItemA[5]);
          localStorage.setItem('colorItemA', nomItemA[4]);
          view.render({step:'A', number:'3'});       
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

    router.on('route:b-departement-secteur-item', function(urlDepartement, urlSecteur, urlTheme){
      view.render({step:'B', number:'3'});
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
      
      // third theme
      if(urlTheme==localStorage.getItem('themes')){
        document.title = localStorage.getItem('nomTheme')+ ' '+localStorage.getItem('nomSecteur')+' '+localStorage.getItem('nomDepartement')+' | JobShaker';
        $('.titleContainer h2').html(localStorage.getItem('nomDepartement')+' > '+localStorage.getItem('nomTheme')+' > '+localStorage.getItem('nomSecteur'));
        var bar = new Bar();
        bar.render({departement: urlDepartement, secteur: urlSecteur, theme:urlTheme});
      }
      else{
        var nomTheme = findType('themes', urlTheme, 'nom');
        if(nomTheme){
          localStorage.setItem('nomTheme', nomTheme[0]);
          document.title = nomTheme[0]+ ' '+localStorage.getItem('nomSecteur')+' '+localStorage.getItem('nomDepartement')+' | JobShaker';
          $('.titleContainer h2').html(localStorage.getItem('nomDepartement')+' > '+localStorage.getItem('nomTheme')+' > '+localStorage.getItem('nomSecteur'));
          var bar = new Bar();
          bar.render({departement: urlDepartement, secteur: urlSecteur, theme:urlTheme});
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
      var theme = new Theme();
      heatMap=false;
      // To determine if we are on step A or step C
      theme.render({step:'C'});
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
      view.render({step:'C', number:'3'});
      if(heatMap==false)
        contain();
      // first secteur
      if(urlSecteur!=localStorage.getItem('urlSecteur')){
        var nomSecteur = findType('secteurs', urlSecteur, 'nom');
        if(nomSecteur){
          localStorage.setItem('nomSecteur', nomSecteur[0]);
          localStorage.setItem('imgSecteur', nomSecteur[1]);
          localStorage.setItem('idSecteur', nomSecteur[3]);
        }
        else{
          error();
        }
      }

      // second itemC
      if(urlItemC==localStorage.getItem('urlItemC')){
        document.title = localStorage.getItem('nomItemC')+ ' '+localStorage.getItem('nomSecteur')+' '+localStorage.getItem('nomTheme')+' | JobShaker';
        $('.titleContainer h2').html(localStorage.getItem('nomTheme')+' > les données '+localStorage.getItem('nomItemC')+' > '+localStorage.getItem('nomSecteur'));
        //aside
        view.render({step:'C', number:'3'});
        var heatMap = new HeatMap();
        heatMap.render({donnee: donnee, secteur: urlSecteur, itemC: urlItemC});
      }
      else{
        var nomItemC = findType(donnee, urlItemC, 'nom');
        if(nomItemC){
          localStorage.setItem('nomItemC', nomItemC[0]);
          document.title = localStorage.getItem('nomItemC')+ ' '+localStorage.getItem('nomSecteur')+' '+localStorage.getItem('nomTheme')+' | JobShaker';
          $('.titleContainer h2').html(localStorage.getItem('nomTheme')+' > les données '+localStorage.getItem('nomItemC')+' > '+localStorage.getItem('nomSecteur'));
          //aside
          view.render({step:'C', number:'3'});
          localStorage.setItem('urlItemC', nomItemC[1]);
          localStorage.setItem('uniteItemC', nomItemC[5]);
          localStorage.setItem('colorItemC', nomItemC[4]);
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