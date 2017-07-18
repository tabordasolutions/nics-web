/*
 * Copyright (c) 2008-2017, Taborda Solutions
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
define(["jquery", "ol"], function($, ol){

    var barbstyles = new Array();

    function getRawsStyle(feature,resolution) {
        var redFill = new ol.style.Fill({color: 'red'});
        var whiteStroke = new ol.style.Stroke({color: 'white', width: 3});

        var wind_direction = feature.get('wind_direction');
        var wind_speed = feature.get('wind_speed');
        var air_temp = feature.get('air_temperature');
        var feature_id = feature.get('id');
        if (wind_direction >= 0 && wind_speed > 0) {
            var barbSpeed = Math.round(wind_speed / 5) * 5;
            if (barbSpeed > 150) {
                barbSpeed = 150;
            } //Max windbarb representation;
            var style = barbstyles[feature_id];
            if (style) {
                return style;
            }
            else {
                var arrowWidth = 40;
                //var windbarbsvg = windbarbs.GetWindArrowSvg(parseInt(wind_speed),parseFloat(wind_direction),arrowWidth);
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
                        src: 'images/windbarb/arrow' + barbSpeed + '.png',
                        scale: 1,
                        rotation:wind_direction
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
