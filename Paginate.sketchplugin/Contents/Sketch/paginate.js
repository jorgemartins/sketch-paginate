var onRun = function(context) {
  var doc = context.document
  function pad_number(n){
    if ( n < 10 ) {
      return "0" + n
    } else {
      return n.toString()
    }
  }

  var pages = [[doc currentPage] artboards];
  var nome = "{pagination}";
  var total = [pages count];

function jsArray(array) {
	var length = [array count];
      var jsArray = [];

      while (length--) {
          jsArray.push([array objectAtIndex: length]);
      }
      return jsArray;
}
function findLayersInLayer(name, exactMatch, type, rootLayer, subLayersOnly, layersToExclude) {

  //create predicate format
  var formatRules = ['(name != NULL)'];
  var arguments = [];

  //name
  if(name) {
    if(exactMatch) {
      formatRules.push('(name == %@)');
    }
    else {
      formatRules.push('(name like %@)');
    }
    arguments.push(name);
  }

  //type
  if(type) {
    formatRules.push('(className == %@)');
    arguments.push(type);
  }
  else {
    formatRules.push('(className == "MSLayerGroup" OR className == "MSShapeGroup" OR className == "MSArtboardGroup" OR className == "MSTextLayer")');
  }

  //layers to exclude
  if(layersToExclude) {
    formatRules.push('NOT (SELF IN %@)');
    arguments.push(layersToExclude);
  }

  //prepare format string
  var formatString = formatRules.join(' AND ');

  //create predicate
    predicate = [NSPredicate predicateWithFormat: formatString argumentArray: arguments];

    //get layers to filter
    var layers;
    if (subLayersOnly) {
        layers = [[rootLayer layers] array];
    } else {
        layers = [rootLayer children];
    }

    //perform query
    var queryResult = [layers filteredArrayUsingPredicate: predicate];

    //return result as js array
    return jsArray(queryResult);
}
function findLayerInLayer(name, exactMatch, type, rootLayer, subLayersOnly, layersToExclude) {
    var result = findLayersInLayer(name, exactMatch, type, rootLayer, subLayersOnly, layersToExclude);

    //return first layer in result
    if (result.length) return result[0];
}


  for(var i=0; i < total; i++){

    var current_artboard = [pages objectAtIndex:i];
    var current_artboardname = [current_artboard name];
    var regex = /^(\d\d)_/;
    var paginationText = "Page " + (i + 1) + "/" + total;

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
      // log(layer)
      if([layer name] == nome) {
        [layer select:true byExpandingSelection:true]
        [layer setStringValue:paginationText]
        //[layer setName:"{pagination}"]
      }

      // ----- Go search inside Symbols and find {pagination} and apply the  page number
      // ----- It works but has a bug, that resets the override value. as well as erasing every other overrides that has been assigned to the symbol.

      // if([layer className] == "MSSymbolInstance") {
      //   // log(layer)
      //   var symbolMaster = layer.symbolMaster();
      //   var paginationLayerAncestorID = symbolMaster.ancestorIDsForLayerNamed("{pagination}");
      //   var paginationLayer = findLayerInLayer('{pagination}', false, 'MSTextLayer', symbolMaster, false, false);
      //   // log(paginationLayerAncestorID)
      //   if (paginationLayer != nil) {
      //     // log(paginationLayer)
      //     var paginationLayerID = paginationLayer.objectID();
      //     // log(paginationLayerID)
      //     var existingOverrides = layer.overrides();
      //     log("existing " + existingOverrides)
      //
      //     if(existingOverrides) {
      //       existingOverrides = layer.overrides().objectForKey(NSNumber.numberWithInt(0));
      //       log("existe overrides")
      //     } else {
      //       existingOverrides = NSDictionary.alloc().init();
      //       log("não existe overrides")
      //     }
      //     var overrides = NSMutableDictionary.dictionaryWithDictionary(existingOverrides);
      //
      //     overrides.setValue_forKey(paginationText, paginationLayerID);
      //     layer.applyOverrides(overrides)
      //
      //     log("applied overrides " + overrides)
      //   }
      // }
    }

    [current_artboard deselectAllLayers]
    doc.showMessage('Document was paginated ✌️');
  }
};
