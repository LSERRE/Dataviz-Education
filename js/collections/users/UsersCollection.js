define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'models/user/UserModel'
], function($, d3, _, Backbone, UserModel){

  var UsersCollection = Backbone.Collection.extend({
      url: '/users'
    });
 
  return UsersCollection;
});