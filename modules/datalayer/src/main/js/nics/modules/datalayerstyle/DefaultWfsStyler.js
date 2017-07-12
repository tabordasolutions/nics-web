define(["ol",], function(ol){

    function getDefaultWfsStyle(feature,resolution) {
        var stroke = new ol.style.Stroke({
            color: '#3399CC',
            width: 1.25
        });
        var fill = new ol.style.Fill({
            color: 'rgba(215, 40, 40, 0.9)'
        });

        return new ol.style.Style({
            image: new ol.style.Circle({
                fill: fill,
                stroke: stroke,
                radius: 5
            }),
            fill: fill,
            stroke: stroke
        });
    }

    return {
        GetStyle:getDefaultWfsStyle
    }
})