define(["backbone"], function(Backbone){
  var ImageModel = Backbone.Model.extend({
    defaults: {
      brand_id: '',
      category_id: '',
      picture_url: '',
      active: false
    }
  });

  return ImageModel;
});