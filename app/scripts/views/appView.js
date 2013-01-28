define(["backbone", "collections/imagesCollection", "views/imagesView", "views/editImagesView"],

function(Backbone, ImagesCollection, ImagesView, EditImagesView) {
  var AppView = Backbone.View.extend({
    el: '.page',
    collection: new ImagesCollection(),
    brands: [],
    categories: [],
    events: {
      'click #editButton': 'editActiveImages',
      'touchstart #editButton': 'editActiveImages',
      'refresh': 'refresh'
    },
    editActiveImages: function(e) {
      var activeImages = _.filter(this.collection.models, function(item){
        return item.attributes.active === true;
      });

      var assignedImages = _.find(activeImages, function(image){
        return image.attributes.category_id !== null && image.attributes.brand_id !== null;
      });

      if(activeImages.length === 0){
        $('#errorContainer').html('<span>Please select some images</span>').slideDown().delay(2000).slideUp();
        e.preventDefault();
        window.location.hash = '';
      } else if(assignedImages !== undefined){
        $('#errorContainer').html('<span>Some selected items are already assigned</span>').slideDown().delay(2000).slideUp();
        e.preventDefault();
        window.location.hash = '';
      } else {
        this.editImagesView.render();
      }
    },
    render: function() {
      var self = this;

      //if changes locally exist, update them (PUT) then (GET) latest
      //else (GET) from server
      //on fail use localStorage
      self.compareLocalAndServer().always(function(data){

        //creates brands and categories that exist on items
        self.createProperties();

        self.imagesView = new ImagesView({
          collection: self.collection,
          brands: self.brands,
          categories: self.categories
        });
        self.editImagesView = new EditImagesView({
          collection: self.collection,
          appView: self
        });

        self.imagesView.render();
      });
    },
    refresh: function(){
      this.imagesView.render();
    },
    //used for reference when creating new items against brands and categories that already exist
    createProperties: function(){
      var self = this;
      _.filter(this.collection.models, function(item){
        var brand = item.attributes.brand;
        var brand_id = item.attributes.brand_id;
        var category = item.attributes.category;
        var category_id = item.attributes.category_id;
        //if item has brand
        if(brand !== undefined && brand_id !== null){
          //and brand doesnt already exist
          var exists = _.find(self.brands, function(inner_item){
            return inner_item.brand === item.attributes.brand;
          });
          if(exists === undefined){
            self.brands.push({
              brand: brand,
              brand_id: brand_id
            });
          }
        }

        if(category !== undefined && category_id !== null){
          var exists = _.find(self.categories, function(inner_item){
            return inner_item.category === item.attributes.category;
          });
          if(exists === undefined){
            self.categories.push({
              category: category,
              category_id: category_id
            });
          }
        }
      });
    },
    //see if update is required
    compareLocalAndServer: function(){
      var self = this;
      //check for localStore
      if(self.collection.localStorage.records.length > 0){
        //if there is at least one record, update the collection first to the server
        return self.collection.fetch().pipe(function(){
          //get the images that have both properties
          var imagesToUpdate = _.filter(self.collection.models, function(image){
            var brand_id = image.get('brand_id');
            var category_id = image.get('category_id');
            return (brand_id !== null && category_id !== null);
          });

          return Backbone.ajaxSync("update", new ImagesCollection(imagesToUpdate));
        }).done(function(){
          //once update complete, read latest from server
          return Backbone.ajaxSync("read", self.collection);
        }).fail(function(){
          //if the update fails
          return self.collection.fetch();
        });//Doest actually work.
        
      } else {
        //Nothing local, grab latest from server
        return Backbone.ajaxSync("read", self.collection).pipe(function(images){
          self.collection.add(images);
          _.each(self.collection.models, function(image){
            //and save them locally
            image.save();
          });
        });
      }
    }
  });

  return AppView;
});