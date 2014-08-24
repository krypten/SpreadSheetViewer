var SheetRows = Backbone.Collection.extend({

  // Sorting models in collection by their id's
  comparator: function(a, b) {
    if(parseInt(a.get('id')) > parseInt(b.get('id'))) {
      return 1;
    }
    else if (parseInt(b.get('id')) > parseInt(a.get('id'))) {
      return -1;
    }
  },

  model: SheetRow,
  url: '/file'

});
