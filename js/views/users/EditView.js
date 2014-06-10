// Filename: views/projects/list
define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/user/UserModel',
  'collections/users/UsersCollection',
  'text!../../../templates/users/edit-user-template.html'

], function($, d3, _, Backbone, UserModel, UsersCollection, editUserTemplate){

  console.log('res');
  //

  var EditUser = Backbone.View.extend({

    el: '.edit-user',
    template: Handlebars.compile(editUserTemplate),
    render: function(options){
      console.log('test');
      //$('.page').removeClass('fade');
      $('.edit-user').removeClass();
      $('.page').addClass('none');
      $('.edit-user').addClass('fade');
      var self = this;
      if(options.id){
        self.user = new UserModel({id: options.id});
        self.user.fetch({
          success: function(user){
            console.log(user.toJSON());
            self.$el.html(self.template(user.toJSON()));
          }
        });
      }
      else{
        self.$el.html(self.template(''));
      }
      
    },
    events : {
      'submit .edit-user-form': 'saveUser',
      'click .delete': 'deleteUser'
    },
    saveUser : function(e){
      var userDetails = $(e.currentTarget).serializeObject();
      var user = new UserModel();
      user.save(userDetails, {
        success: function(user){
          glob.router.navigate('', {trigger: true});
        }
      });
      return false;
    },
    deleteUser: function(evt){
      this.user.destroy({
        success: function(){
          router.navigate('', {trigger: true});
        }
      });
      return false;
    }
  });

  return EditUser;
});