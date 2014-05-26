define([
  'jquery',
  'd3',
  'underscore',
  'backbone',
  'handlebars',
  'models/user/UserModel',
  'collections/users/UsersCollection',
  'text!../../../templates/users/user-list-template.html'
], function($, d3, _, Backbone, Handlebars, UserModel, UsersCollection, listUserTemplate){


  console.log('test');

  var circleData = [
    { "cx": 20, "cy": 20, "radius": 20, "color" : "green" },
    { "cx": 70, "cy": 70, "radius": 20, "color" : "purple" }];


  var rectangleData = [
    { "rx": 110, "ry": 110, "height": 30, "width": 30, "color" : "blue" },
    { "rx": 160, "ry": 160, "height": 30, "width": 30, "color" : "red" }];

  var svgContainer = d3.select("#dataviz").append("svg")
                                      .attr("width",200)
                                      .attr("height",200);

  //We add the SVG Group Element Transform Here
  var circleGroup = svgContainer.append("g")
                                 .attr("transform", "translate(80,0)");

  //Circles added to the circleGroup
  var circles = circleGroup.selectAll("circle")
                            .data(circleData)
                            .enter()
                            .append("circle");

  var circleAttributes = circles
                         .attr("cx", function (d) { return d.cx; })
                         .attr("cy", function (d) { return d.cy; })
                         .attr("r", function (d) { return d.radius; })
                         .style("fill", function (d) { return d.color; });

  //Rectangles added to the svgContainer
  var rectangles = svgContainer.selectAll("rect")
                               .data(rectangleData)
                               .enter()
                               .append("rect");

  var rectangleAttributes = rectangles
                            .attr("x", function (d) { return d.rx; })
                            .attr("y", function (d) { return d.ry; })
                            .attr("height", function (d) { return d.height; })
                            .attr("width", function (d) { return d.width; })
                            .style("fill", function(d) { return d.color; });
  
  var UserList = Backbone.View.extend({
    el: '.page',
    template: Handlebars.compile(listUserTemplate),
    render: function(){
      var self = this;
      var users = new UsersCollection();
      users.fetch({
        success: function(users){
          console.log(users.toJSON());

          self.$el.html(self.template(users.toJSON()));

          return self;
        },
        error: function(err){
          console.log(err);
        }
      });
    }
  }); 

  return UserList;
});