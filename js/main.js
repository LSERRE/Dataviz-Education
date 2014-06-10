// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
	paths: {
		jquery: 'libs/jquery',
    d3: 'libs/d3',
		underscore: 'libs/underscore',
		backbone: 'libs/backbone',
		handlebars: 'libs/handlebars',
	},
  shim: {
    'd3': {
      'exports': 'd3'
    },
    'underscore': {
      'exports': '_'
    },
    'backbone': {
      'deps': ['jquery', 'underscore'],
      'exports': 'backbone'
    },
    'handlebars': {
      'exports': 'Handlebars'
    }
  }
});

require(['app'], function(App){
  App.initialize();
});