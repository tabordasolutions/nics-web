define(["./DefaultWfsStyler","./RawsFeatureStyler"], function(defaultStyler,rawsStyler){

    function getStyler(config) {
        var layername = config.layername;
        if(layername != 'scout:raws_view') {
            return defaultStyler;
        } else {
            return rawsStyler;
        }
    }
    return {
        GetStyler:getStyler
    }
});
