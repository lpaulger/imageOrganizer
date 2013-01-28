define(["backbone", "text!../../templates/imagesTemplate.html"],

function(Backbone, ImagesTemplate) {

  var ImagesView = Backbone.View.extend({
    el: '#images',
    events: {
      'click .item img': 'imageClickEvent'
    },
    imageClickEvent: function(e) {

      //get img src
      var picture_url = e.toElement.src;

      //make image selected (active)
      try {
        var image = this.collection.where({
          picture_url: picture_url
        })[0];
        if(image === undefined) {
          throw new Error("Image Not Found");
        }

        else if(image.get('brand') !== undefined && image.get('category') !== undefined){
            //if the image has both a brand and category, display it as not available for change
            $(e.target).parent().addClass('assigned');
        }

        if(image.get('active') === true) {
          image.set({
            active: false
          });
          $(e.target).parent().removeClass('active');
          $(e.target).parent().removeClass('assigned');
        } else {
          image.set({
            active: true
          });
          $(e.target).parent().addClass('active');
        }
      } catch(e) {
        alert(e);
      }

    },
    render: function() {
      var self = this;
      var images = this.collection;
      var template = _.template(ImagesTemplate);
      self.$el.html(template(images));
    }
  });
  return ImagesView;
});