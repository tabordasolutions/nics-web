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
define(['jquery', 'ol', 'ext', 'iweb/CoreModule','iweb/modules/MapModule'], function($, ol,Ext, Core, MapModule){
    return Ext.define('modules.datalayerstyle.RawsFeatureStyler', function() {
        var barbstyles = new Array();

        var QCStatusDisplayMap = {
            'OK': {text: 'OK', color: '#000000'},
            'WARNING': {text: 'Caution', color: '#FFA500'},
            'ERROR': {text: 'Suspect', color: '#FF0000' },
            'UNKNOWN': {text: 'Unknown', color: '#000000'}
        }
        var errorFill = new ol.style.Fill({color: QCStatusDisplayMap.ERROR.color});
        var warningFill = new ol.style.Fill({color: QCStatusDisplayMap.WARNING.color});
        var okfill = new ol.style.Fill({color: QCStatusDisplayMap.OK.color});
        var whiteStroke = new ol.style.Stroke({color: 'white', width: 3});

        var barbstyles = new Array();
        var dotOffset = [0.5, 0.5];
        var errorDotStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: errorFill,
                stroke: new ol.style.Stroke({color: '#000000', width: 1}),
                anchor: [0.5, 0.5],
                offset: dotOffset
            })
        });



        var warningDotStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: warningFill,
                stroke: new ol.style.Stroke({color: '#000000', width: 1}),
                anchor: [0.5, 0.5],
                offset: dotOffset
            })
        });

        var okDotStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: okfill,
                anchor: [0.5, 0.5],
                offset: dotOffset
            })
        });
        var selectedStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({
                    color: 'rgba(0, 255, 255, 0.4)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgb(0, 255, 255)'
                })
            })
        });
        function constructor() {
            MapModule.getClickListener().addRenderer(this);
            MapModule.getMapStyle().addStyleFunction(this.getStyle.bind(this));
        }

        function getRawsStyle(feature, resolution, selected) {

            var wind_direction = feature.get('wind_direction');
            var wind_speed = feature.get('wind_speed');
            var air_temp = feature.get('air_temperature');
            var feature_id = feature.get('id');
            var qc_status = feature.get('qc_status');
            var finalStyle = [];
            if (wind_direction >= 0 && wind_speed > 0) {
                var barbSpeed = Math.round(wind_speed / 5) * 5;
                if (barbSpeed > 150) {
                    barbSpeed = 150;
                } //Max windbarb representation;
                var style = barbstyles[feature_id];
                if (style) {
                    if (!selected)
                        return style;
                    else {
                        var selstyles = style.slice(); //Create a copy. Don't overwrite original array.
                        selstyles.push(selectedStyle);
                        return selstyles;
                    }

                }
                else {
                    var featuretext;
                    if (air_temp) {
                        featuretext = new ol.style.Text({
                            text: air_temp.replace(/.0$/, '') + '℉',
                            scale: 1.3,
                            offsetX: -11,
                            offsetY: -11,
                            fill: errorFill,
                            stroke: whiteStroke
                        })
                    }
                    var barbStyle = new ol.style.Style({
                        image: new ol.style.Icon({
                            opacity: 1,
                            src: 'images/windbarb/arrow' + barbSpeed + '.png',
                            scale: 1,
                            rotation: wind_direction * Math.PI / 180,
                            anchor: [0.5, 0.5],
                            offset: [0.5, 0.5]
                        }),
                        text: featuretext
                    });
                    finalStyle.push(barbStyle);
                    if (!qc_status || qc_status == 'OK') {
                        finalStyle.push(okDotStyle);
                    }
                    if (qc_status == 'WARNING') {
                        finalStyle.push(warningDotStyle);
                    }
                    else if (qc_status == 'ERROR') {
                        finalStyle.push(errorDotStyle);
                    }

                    barbstyles[feature_id] = finalStyle;
                    return barbstyles[feature_id];
                }

            } else {
                return null;
            }
        }

        function renderDescription(container, feature) {
            var qc_status = feature.get('qc_status');

            if (qc_status) {
                container.add(new Ext.form.field.Display({
                    fieldLabel: 'QC Status',
                    value: '<a href=\"http://mesowest.utah.edu/html/help/qc.html\" target=\"_blank\" style=\"color: ' + qcStatusColor(qc_status) + '\" >' + qcStatusString(qc_status) + '</a>'
                }));
                return true;
            } else {
                return false;
            }
        }

        function qcStatusColor(qcstatus) {
            var displayprops = QCStatusDisplayMap[qcstatus];
            if (displayprops)
                return displayprops.color;
            else {
                return QCStatusDisplayMap.UNKNOWN.color;
            }
        }
        function qcStatusString(qcstatus) {
            var displayprops = QCStatusDisplayMap[qcstatus];
            if (displayprops)
                return displayprops.text;
            else {
                return QCStatusDisplayMap.UNKNOWN.text;
            }

        }

        return {
            constructor: constructor,
            getStyle: getRawsStyle,
            render: renderDescription
        }
    });
});
