define(["jquery", "ol", "./WindBarbSvg_Generator"], function($, ol, windbarbs){

    var barbstyles = new Array();

    function getRawsStyle(feature,resolution) {
        var redFill = new ol.style.Fill({color: 'red'});
        var whiteStroke = new ol.style.Stroke({color: 'white', width: 3});

        var wind_direction = feature.get('wind_direction');
        var wind_speed = feature.get('wind_speed');
        var air_temp = feature.get('air_temperature');
        var feature_id = feature.get('id');
        if (wind_direction > 0 && wind_speed > 0) {
            var style = barbstyles[feature_id];
            if (style) {
                return style;
            }
            else {
                var windbarbsvg = windbarbs.GetWindArrowSvg(parseInt(wind_speed),parseFloat(wind_direction),40);
                var featuretext;
                if (air_temp) {
                    featuretext = new ol.style.Text({
                        text: air_temp.replace(/.0$/, '') + '℉',
                        scale: 1.3,
                        offsetX: -11,
                        offsetY:-11,
                        fill: redFill,
                        stroke: whiteStroke
                    })
                }
                barbstyles[feature_id] = new ol.style.Style({
                    image: new ol.style.Icon({
                        opacity: 1,
                        src: 'data:image/svg+xml;utf8,' + encodeURIComponent(windbarbsvg),
                        scale: 1
                    }),
                    text: featuretext
                });
                return barbstyles[feature_id];
            }

        } else {
            return null;
        }
    }
    return {
        GetStyle:getRawsStyle
    }
});
