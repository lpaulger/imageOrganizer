define(["backbone", "text!../../templates/editImagesTemplate.html"], function(Backbone, EditImagesTemplate) {
  var editImagesView = Backbone.View.extend({
    el: '#modalContent',
    events: {
      'click #edit a.btn': 'completeEditImages',
      'keypress input[type=text]': 'completeEditImages'
    },
    brand: [],
    category: [],
    errors: [],
    initialize: function() {
      this.brands = this.options.appView.brands;
      this.categories = this.options.appView.categories;
    },
    completeEditImages: function(event) {
      //when event is fired, make sure it was a submission click
      if((event.which !== ENTER_KEY && event.which !== 1)) {
        return;
      }
      var brand = this.$('input[name=brand]').val().trim();
      var category = this.$('input[name=category]').val().trim();
      if( brand === '') brand = undefined;
      if( category === '') category = undefined;
      //validate form
      try {
        var requestedChanges = this.validateForm(brand, category);
        _.each(this.active, function(image) {
          if(brand !== undefined) {
            image.set({
              brand_id: requestedChanges.brand_id,
              brand: requestedChanges.brand,
            });
          }

          if(category !== undefined) {
            image.set({
              category_id: requestedChanges.category_id,
              category: requestedChanges.category
            });
          }
          image.set({
            active: false
          });
          image.save();
        });

        event.preventDefault();
        window.location.hash = '';
        this.brand = this.category =  '';//reset
        this.options.appView.refresh();
      } catch(error) {
        this.brand = brand || '';
        this.category = category || '';
        this.errors.push(error);
        event.preventDefault();
        this.render(brand, category);
      }
    },
    validateForm: function(brand, category) {
      var self = this;
      this.errors = [];
      var requestedChanges = {};
      requestedChanges.brand = brand;
      requestedChanges.brand_id = undefined;
      requestedChanges.category = category;
      requestedChanges.category_id = undefined;

      if(requestedChanges.brand === undefined && requestedChanges.category === undefined) {
        throw new Error('must enter at least one field');
      } else if (requestedChanges.brand !== undefined && requestedChanges.category === undefined){
        updateBrand();
      } else if(requestedChanges.brand === undefined && requestedChanges.category !== undefined){
        updateCategory();
      } else {
        updateBrand();
        updateCategory();
      }

      return requestedChanges;

      function updateBrand(){
        var existingBrand = _.find(self.brands, function(item) {
          return item.brand === requestedChanges.brand;
        });

        //does brand exist
        if(existingBrand === undefined) {
          //doesnt exist
          var current_brand_id = self.brands.length;

          self.brands.push({
            brand: requestedChanges.brand,
            brand_id: current_brand_id
          });

          requestedChanges.brand_id = current_brand_id;
        } else {
          //does exist
          requestedChanges.brand_id = existingBrand.brand_id;
        }
      };

      function updateCategory(){
        var existingCategory = _.find(self.categories, function(item) {
          return item.category === requestedChanges.category;
        });

        //does category exist
        if(existingCategory === undefined) {
          //doesnt exist
          var current_category_id = self.categories.length;

          self.categories.push({
            category: requestedChanges.category,
            category_id: current_category_id
          });

          requestedChanges.category_id = current_category_id;
        } else {
          //does exist
          requestedChanges.category_id = existingCategory.category_id;
        }
      };
    },
    template: _.template(EditImagesTemplate),
    render: function() {
      this.active = _.filter(
      this.collection.models, function(image) {
        return image.get('active') === true;
      });
      this.$el.html(this.template(this));
    }
  });

  return editImagesView;
});