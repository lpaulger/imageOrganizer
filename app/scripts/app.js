define([
// Libraries.
"jquery", "lodash", "backbone", "views/appView"],

function($, _, Backbone, AppView) {

  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
    // The root path to run the application.
    root: "/",
    appView: null,
    staticHeader: function() {
      var $banner, $body, $header, offset;
      $body = $('body');
      $banner = $('header');
      $header = $('nav[role="navigation"]');
      offset = $(document).scrollTop() - ($banner.offset().top + $banner.height() - 1);
      if(offset > 0) {
        return $body.addClass('fixed');
      } else {
        return $body.removeClass('fixed');
      }
    },
    setBaseline: function() {
      return $('img.rhythm').each(function() {
        var $this;
        $this = $(this);
        $this.css('maxHeight', 'none');
        return $this.css('maxHeight', Math.floor($this.height() / LINE_HEIGHT) * LINE_HEIGHT);
      });
    },
    respond: function() {
      var self = this;
      $(window).on('resize', function() {
        $('html').css('width: 100%;');
        return self.setBaseline();
      });
      //keeps track of when to use sticky header
      return $(window).on('scroll', function() {
        return self.staticHeader();
      });
    },
    init: function() {
      this.appView = new AppView();
      this.respond();
      this.appView.render();
    }
  };

  return app;

});