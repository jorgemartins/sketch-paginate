var onRun = function(context) {

  function pad_number(n){
    if ( n < 10 ) {
      return "0" + n
    } else {
      return n.toString()
    }
  }

  var doc = context.document
  var pages = [[doc currentPage] artboards];
  var nome = "{pagination}";
  var total = [pages count];

  for(var i=0; i < total; i++){

    var current_artboard = [pages objectAtIndex:i];
    var current_artboardname = [current_artboard name];
    var regex = /^(\d\d)_/;
    var texto = "Page " + (i + 1) + "/" + total;

    //add page number to artboard
    if (regex.test(current_artboardname)) {
      var new_pagename = current_artboardname.replace(regex,pad_number((i + 1)) + "_")
      [current_artboard setName:new_pagename]
    } else {
      [current_artboard setName:(pad_number((i + 1)) + "_" + current_artboardname)]
    }

    var all_layers = [current_artboard children]

    for(var j=0; j < [all_layers count]; j++){
      var layer = [all_layers objectAtIndex:j]

      if([layer name] == nome) {
        [layer select:true byExpandingSelection:true]

        [layer setStringValue:texto]
        //[layer setName:"{pagination}"]

      }
    }

    [current_artboard deselectAllLayers]
    document.showMessage('Document was paginated ✌️');
  }
};
