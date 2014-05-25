// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
	paths: {
		jquery: 'libs/jquery',
		underscore: 'libs/underscore',
		backbone: 'libs/backbone',
		handlebars: 'libs/handlebars'
	},
  shim: {
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