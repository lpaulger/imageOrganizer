define(["backbone","lodash","models/imageModel", "localStorage"],function(Backbone, _, ImageModel){
  var ImagesCollection = Backbone.Collection.extend({
    model: ImageModel,
    url: function () {
      return '/items.json'
    },
    localStorage: new Backbone.LocalStorage("Images")
  });

  return ImagesCollection;
});