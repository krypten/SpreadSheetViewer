var SheetView = Backbone.View.extend({

  initialize: function(options) {
    this.listenTo(this.collection, "reset", this.filling_table);
    this.listenTo(this.collection, "reset", this.filling_spreadsheet);
    return this.options = options || {};
  },


  //For Filling Spreadsheet
  filling_spreadsheet: function() {
    var spread = $("#spreadContainer").wijspread("spread");
    var activeSheet = spread.getActiveSheet();

    for(var i = 0; i < this.collection.length; i++){
      var model = this.collection.at(i);
      for(j=1;j<=parseInt(model.get('0'));j++){
        activeSheet.getCell(model.get('id'),j-1).value(model.get(j.toString())).foreColor("black");
      }
    }
  },


  //For Filling Table
  filling_table: function() {
    var string = "";
    for(var i = 0; i < this.collection.length; i++){
      var model = this.collection.at(i);
      string += "<tr>";
      string += "<td>" + $("<div>").text(parseInt(model.get('id'))+1).html() + "</td>";
      for(j=1;j<=parseInt(model.get('0'));j++){
        if(model.get(j.toString())) {
          string += "<td>" + $("<div>").text(model.get(j.toString())).html() + "</td>";
        }
        else {
          string += "<td></td>";
        }
      }
      string += "</tr>";
    }
    this.$el.html(string);
    return this;
  },


  //For edit and update in spreadsheet
  change: function(row,col,value) {
    var model = this.collection.get(row);
    if(value==null) {
      if(model && model.get((parseInt(col)+1).toString())) {
        var options = {}
        if(parseInt(model.get('0'))<=parseInt(col)+1) {
          var i=parseInt(model.get('0'))-1;
          while(!model.get(i.toString()) && i>0)i--;
          options['0']=i;
        }
        else options['0']=parseInt(model.get('0'));
        if(options['0']<=0) this.collection.remove(model);
        else {
          model.unset((parseInt(col)+1).toString());
          model.set(options);
        }
        this.filling_table();
      }
    }
    else if(!model) {
      var options = {}
      options['id']=row;
      options[(parseInt(col)+1).toString()]=value;
      options['0']=(parseInt(col)+1).toString();
      var model = new SheetRow();
      model.set(options);
      this.collection.add(model);
      this.filling_table();
    }
    else {
      var options = {}
      options[(parseInt(col)+1).toString()]=value;
      if(parseInt(model.get('0'))<parseInt(col)+1)
        options['0']=parseInt(col)+1;
      model.set(options);
      this.filling_table();
    }
  },


  //For deleting records
  del: function(row) {
    var model = this.collection.get(row.toString());
    if(model) {
      this.collection.remove(model);
    }
    for(var i=0; i<this.collection.length; i++){
      var model = this.collection.at(i);
      if(parseInt(model.get('id'))>row) {
        var options = {};
        options['id']=parseInt(model.get('id'))-1;
        model.set(options);
      }
    }
    this.filling_table();
  }

});
