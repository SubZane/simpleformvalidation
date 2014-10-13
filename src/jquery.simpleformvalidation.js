(function ($, window, document, undefined) {

  var pluginName = 'simpleformvalidation',
    // the name of using in .data()
    dataPlugin = 'plugin_' + pluginName,
    TravelModes = ['DRIVING', 'WALKING', 'BICYCLING'],
    // default options
    defaults = {
      debug: false
    };

  // The actual plugin constructor
  var Plugin = function (element) {
    /*
     * Plugin instantiation
     */
    this.options = $.extend({}, defaults);
    this.TravelModes = $.extend([], TravelModes);
  };

  Plugin.prototype = {
    init: function (options) {
      // extend options ( http://api.jquery.com/jQuery.extend/ )
      $.extend(this.options, options);

      // Need to parse the latlng position
      if (this.options.MapOptions.center) {
        this.options.MapOptions.center = parseLatLng(this.options.MapOptions.center);
      }

    },

    destroy: function () {
      // unset Plugin data instance
      this.element.data(dataPlugin, null);
    }
  };

  /*
   * Plugin wrapper, preventing against multiple instantiations and
   * allowing any public function to be called via the jQuery plugin,
   * e.g. $(element).pluginName('functionName', arg1, arg2, ...)
   */
  $.fn[pluginName] = function (arg) {
    var args, instance;

    // only allow the plugin to be instantiated once
    if (!(this.data(dataPlugin) instanceof Plugin)) {

      // if no instance, create one
      this.data(dataPlugin, new Plugin(this));
    }

    instance = this.data(dataPlugin);

    instance.element = this;

    // Is the first parameter an object (arg), or was omitted,
    // call Plugin.init( arg )
    if (typeof arg === 'undefined' || typeof arg === 'object') {

      if (typeof instance.init === 'function') {
        instance.init(arg);
      }

      // checks that the requested public method exists
    } else if (typeof arg === 'string' && typeof instance[arg] === 'function') {

      // copy arguments & remove function name
      args = Array.prototype.slice.call(arguments, 1);

      // call the method
      return instance[arg].apply(instance, args);

    } else {

      $.error('Method ' + arg + ' does not exist on jQuery.' + pluginName);

    }
  };

}(jQuery, window, document));
