var AppRouter = Backbone.Router.extend({

  initialize: function  (item) {

    $(document).ready(function () {

      //Fetching all the Models in the Collection
      this.sheetRows = new SheetRows();
      this.sheetRows.fetch();

      this.sheetView = new SheetView ({ collection: this.sheetRows });
      this.sheetView.filling_spreadsheet();
      $('#app').html(this.sheetView.filling_table().el);

      var spread = $("#spreadContainer").wijspread("spread");
      var activeSheet = spread.getActiveSheet();
      var temp = this.sheetView;

      //Event listening for Add or Update in spreadsheet
      activeSheet.bind($.wijmo.wijspread.Events.EditEnded, function (sender, args) {
        temp.change(args.row.toString(),args.col.toString(),activeSheet.getCell(args.row,args.col).value());
      });

      //Function for handling Deletion of Records
      $("#button").click(function(){
        var row = document.getElementById("row").value;
        row = parseInt(row)-1;
        if(isNaN(row)) {
          document.getElementById("delete-error").innerHTML="<b style='color:red'>Type an Integer</b>";
        }
        else if(row<0)
          document.getElementById("delete-error").innerHTML="<b style='color:red'>Type an Integer Greater than 0</b>";
        else {
          document.getElementById("delete-error").innerHTML="";
          activeSheet.deleteRows(row, 1);
          temp.del(row);
        }
      });
    });
  }

});

var app = new AppRouter();

$(function() {
  Backbone.history.start();
});
