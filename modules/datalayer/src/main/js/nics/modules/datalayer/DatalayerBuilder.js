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
 * s
 */
define(['iweb/CoreModule', 'ol', './TokenManager', './FeatureRequestManager',
		'../datalayerstyle/WfsStylerFactory', './ArcGISSessionManager', 'lib/ole'],
		function(Core, ol, TokenManager, FeatureRequestManager, WfsStylerFactory,
				ArcGISSessionManager, ole){
	
	// matches href tags with relative urls
	//var relativeHrefRegex = /<href>(?!http|#)(.*)<\/href>/gi;
	var relativeHrefRegex = /<href>(?!http|#)(.*?)<\/href>/gi;
	
	return Ext.define('modules.datalayer.builder', {
		
		constructor: function() {
			this.mediator = Core.Mediator.getInstance();
			FeatureRequestManager.init();
		},
				
		buildLayer: function(type, config){
			if(type == "wms"){
				return this.buildWMSLayer(config.url, config.layername, config);
			}else if(type == "wfs"){
				return this.buildWFSLayer(config.url, config.layername, config);
			}else if(type == "kml"){
				return this.buildKMLLayer(config.url, config.layername, config);
			}else if(type == "kmz"){
				return this.buildKMLLayer(config.url, config.layername, config);
			}else if(type == "bing"){
				return this.buildBingLayer(config.url, config.layername, config);
			}else if(type == "osm"){
				return this.buildOSMLayer(config.url, config.layername, config);
			}else if(type == "xyz"){
				return this.buildXYZLayer(config.url, config.layername, config);
			}else if(type == "arcgisrest"){
				return this.buildArcGisLayer(config.url, config.layername, config);
			}else if(type == "arcgisent"){
				return this.buildArcGisEnterpriseLayer(config.url, config.layername, config);
			}else if(type == "arcgisonline"){
				return this.buildArcGisOnlineLayer(config.url, config.layername, config);
			}else if(type == "geojson"){
				return this.buildGeoJsonLayer(config.url, config.layername, config);
			}else if(type == "gpx"){
				return this.buildGpxLayer(config.url, config.layername, config);
			}
		},
		
		buildArcGisOnlineLayer: function(url, layername, config) {
			// we need to determine what kind of arcgis layer we are trying to render
			if (layername.includes('MapServer') || url.includes('MapServer')) {
				return this.buildArcGisOnlineMapServerLayer(url, layername, config);
			} else if (layername.includes('FeatureServer') || url.includes('FeatureServer')) {
				return this.buildArcGisOnlineFeatureServerLayer(url, layername, config);
			}
		},

		buildArcGisOnlineMapServerLayer: function(url, layername, config) {
			var tileLayer = new ol.layer.Tile({
				opacity: config.opacity || 1,
				visible: false
			});
			
			var promise = !config.secure
				? Promise.resolve(null)
				: ArcGISSessionManager.getRequestSession(config.datasourceid);
			
			promise.then(function(session){
				var svcUrl = new URL(url);

				//layername can just be a number or it can be a relative path and number
				//we want to get the possible parts separated
				var parts = layername.match(/(.*MapServer\/)?(\d)/);
				var subpath = parts[1];
				var layerNum = parts[2];

				if (subpath) {
					svcUrl.pathname += '/' + subpath;
				}
				if (session && session.token) {
					svcUrl.searchParams.set('token', session.token);
				}

				tileLayer.setSource(new ol.source.TileArcGISRest({
					url: svcUrl.toString(),
					params: {'LAYERS': 'show:' + layerNum }
				}));
				tileLayer.setVisible(true);

				FeatureRequestManager.addLayer(tileLayer);
			});

			return tileLayer;
			
		},

		buildArcGisOnlineFeatureServerLayer: function(url, layername, config, style){
			var vectorlayer = new ol.layer.Vector({ source: new ol.source.Vector()});

			var promise = !config.secure
				? Promise.resolve(null)
				: ArcGISSessionManager.getRequestSession(config.datasourceid);

			if(config.stylepath) {
				// use custom renderer
				var renderer = Ext.create(config.stylepath);
				if (renderer) {
					vectorlayer.setStyle(renderer.getStyle);
				}
			} else {
				window.ol = ol;
				// attempt to use arcgis defined style
				promise = promise.then(function(session){					
					var queryUrl = new URL(url);
					queryUrl.pathname += '/' + layername;
					queryUrl.searchParams.set('f', 'json');
					if (session && session.token) {
						queryUrl.searchParams.set('token', session.token);
					}

					return $.ajax({url: queryUrl.toString(), dataType: 'json'})
						.then(function(jsonResponse) {
							ole.VectorLayerModifier.modifyLayer(jsonResponse, vectorlayer, Core.Ext.Map.getMap().getView().getProjection());
							return session;
						});
				});	
			}
			
			promise.then(function(session){
				var esrijsonFormat = new ol.format.EsriJSON();
				var vectorSource = new ol.source.Vector({
					loader: function(extent, resolution, projection) {
						var queryUrl = new URL(url);
						queryUrl.pathname += '/' + layername + '/query';
						if (session && session.token) {
							queryUrl.searchParams.set('token', session.token);
						}
						queryUrl.searchParams.set('f', 'json');
						queryUrl.searchParams.set('returnGeometry', true);
						queryUrl.searchParams.set('spatialRel', 'esriSpatialRelIntersects');
						queryUrl.searchParams.set('outFields', '*');
						queryUrl.searchParams.set('inSR', '102100');
						queryUrl.searchParams.set('outSR', '102100');
						queryUrl.searchParams.set('geometryType', 'esriGeometryEnvelope');
						queryUrl.searchParams.set('geometry', JSON.stringify({
							xmin: extent[0],
							ymin: extent[1],
							xmax: extent[2],
							ymax: extent[3],
							spatialReference: {
								wkid: 102100
							}
						}));

						$.ajax({url: queryUrl.toString(), dataType: 'jsonp', success: function(response) {
								if (response.error) {
									console.error(response.error.message + '\n' +
										response.error.details.join('\n'));
								} else {
									// dataProjection will be read from document
									var features = esrijsonFormat.readFeatures(response, {
										featureProjection: projection
									});
									if (features.length > 0) {
										vectorSource.addFeatures(features);
									}
								}
							}});
					},
					strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
						tileSize: 512
					}))
				});

				// tells the mapController we can handle a defered reload
				// meaning we will handle removing features when new ones come in
				vectorSource.set("deferReload", true);

				vectorlayer.setSource(vectorSource);
			});

			return vectorlayer;
		},

		buildArcGisEnterpriseLayer: function(url, layername, config) {
			// we need to determine what kind of arcgis layer we are trying to render
			if (layername.includes('MapServer') || url.includes('MapServer')) {
				return this.buildArcGisEnterpriseMapServerLayer(url, layername, config);
			} else if (layername.includes('FeatureServer') || url.includes('FeatureServer')) {
				return this.buildArcGisEnterpriseFeatureServerLayer(url, layername, config);
			}
		},

		buildArcGisEnterpriseMapServerLayer: function(url, layername, config) {
			
			var params = { };
			params.LAYERS = 'show:' + layername;
			// token management done by proxy
			if(config.secure){
				var response = TokenManager.getTokenSynchronously(config.datasourceid);
				try
				{
					var jsonResponse = JSON.parse(response);
					if(jsonResponse.token){
						params.token = jsonResponse.token;
					} else{
						return; //Don't attempt to get features w/o a token
					}
                } catch(e){
					return;
				} //JS Logging?
			}
			layer = new ol.layer.Tile({
				opacity: config.opacity || 1,
				visible : true,
				source: new ol.source.TileArcGISRest({
				  	url: Ext.String.format(
						  "{0}//{1}/nics/{2}.proxy?url={3}",
					  window.location.protocol,
					  window.location.host,
					  config.datalayerid,
					  url),
					params: params
				})
			});
			FeatureRequestManager.addLayer(layer);
			
			return layer;
			
		},
		
		buildArcGisEnterpriseFeatureServerLayer: function(url, layername, config){
			var serviceUrl = url
			if (!serviceUrl.endsWith('/')) serviceUrl += '/';
			
			var layer = layername;

			var esrijsonFormat = new ol.format.EsriJSON();

			var vectorSource = new ol.source.Vector({
				loader: function(extent, resolution, projection) {
					var endpointUrl = new URL(serviceUrl + layer + '/query/');
					endpointUrl.searchParams.append('f','json');
					endpointUrl.searchParams.append('returnGeometry','true');
					endpointUrl.searchParams.append('spatialRel','esriSpatialRelIntersects');
					endpointUrl.searchParams.append('geometryType','esriGeometryEnvelope');
					endpointUrl.searchParams.append('inSR','102100');
					endpointUrl.searchParams.append('outFields','*');
					endpointUrl.searchParams.append('outSR','102100');
					var geom = {};
					geom.xmin = extent[0];geom.ymin = extent[1];
					geom.xmax = extent[2];geom.ymax = extent[3];
					geom.spatialReference = { 'wkid' : 102100 };
					endpointUrl.searchParams.append('geometry', JSON.stringify(geom));
					
					var proxyurl = Ext.String.format(
						  "{0}//{1}/nics/{2}.proxy?{3}",
							  window.location.protocol,
							  window.location.host,
							  config.datalayerid,
							  endpointUrl.href);
					$.ajax({url: proxyurl, dataType: 'jsonp', success: function(response) {
							if (response.error) {
								console.log(response.error.message + '\n' +
									response.error.details.join('\n'));
							} else {
								// dataProjection will be read from document
								var features = esrijsonFormat.readFeatures(response, {
									featureProjection: projection
								});
								if (features.length > 0) {
									vectorSource.addFeatures(features);
								}
							}
						}});
				},
				strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
					tileSize: 512
				}))
			});

			// tells the mapController we can handle a defered reload
			// meaning we will handle removing features when new ones come in
			vectorSource.set("deferReload", true);


			var vectorlayer = new ol.layer.Vector({
				source: vectorSource
			});

			if(config.stylepath) {
				var renderer = Ext.create(config.stylepath);
				if (renderer) {
					vectorlayer.setStyle(renderer.getStyle);
				}
			} else {
				// fetch and apply arcgis styles
				window.ol = ol;
				$.ajax({url: serviceUrl + layer + '?f=json', dataType: 'json', success: function(jsonResponse) {
						ole.VectorLayerModifier.modifyLayer(jsonResponse, vectorlayer, Core.Ext.Map.getMap().getView().getProjection());
				}});
			}

			return vectorlayer;
		},

		buildWMSLayer: function (url, layername, config) {
			var attrs = (config.attributes) ? JSON.parse(config.attributes) : {};
			var wmsLayer = new ol.layer.Tile({
				opacity: config.opacity || 1,
				source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
					url: url,
					params: {
							'LAYERS': layername ,
							'TILED': true,
							'VERSION': attrs.version || '1.3.0'
					}
				}))
			});
			FeatureRequestManager.addLayer(wmsLayer);
			return wmsLayer;
		},
		
		buildWFSLayer: function (url, layername, config, style) {
			var _mediator = this.mediator;
			var _eventManager = Core.EventManager;
			
			// format used to parse WFS GetFeature responses
			var wfsFormat = new ol.format.WFS();

			var vectorSource = new ol.source.Vector({
                         loader: function(extent, resolution, projection) {
				 var requestUrl = Ext.String.format(
						  "{0}//{1}/nics/proxy?url={2}?version=1.1.0&service=WFS&request=GetFeature&typename={3}" +
						  "&srsname=EPSG:3857&bbox={4}{5}",
					  window.location.protocol,
					  window.location.host,
					  url, layername, extent.join(','), ',EPSG:3857');
				  
					if(config.secure){
						var response = TokenManager.getTokenSynchronously(config.datasourceid);
						try
						{
							var jsonResponse = JSON.parse(response);
							if(jsonResponse.token){
								requestUrl = requestUrl + "&token=" + jsonResponse.token;
							} else{
								return; //Don't attempt to get features w/o a token
							}
		                } catch(e){
							return;
						} //JS Logging?
					}				  
					var loadFeatures = function(data, status){
						//remove all previous features in this extent, to avoid flash on refresh
						this.getFeaturesInExtent(extent).forEach(function(feature){
							if(feature.getGeometry().intersectsExtent(extent)) {
								this.removeFeature(feature);
							}
						}, this);
						
						//add the new features
						this.addFeatures(wfsFormat.readFeatures(data));
					};
					
					var handler = loadFeatures.bind(this);
				  
					$.ajax({
				      url: requestUrl,
				      dataType: 'xml',
				      success: handler,
				      error: function(param1, status, error){}
				   });
				},
			  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
			    maxZoom: 19
			  })),
			  projection: 'EPSG:3857'
			});
			
			// tells the mapController we can handle a defered reload
			// meaning we will handle removing features when new ones come in
			vectorSource.set("deferReload", true);
			
			//create default style
			var style = this.buildWFSStyle(url, layername, config);
			
			return new ol.layer.Vector({
				opacity: config.opacity || 1,
				source: vectorSource,
				style: style
		    });	
		},
		
		buildKMLLayer: function(url, layername, config){
			var baseUrl = url;
			if(layername){
				url = url + layername;
				baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
			}
			
			var format = new ol.format.KML({
				extractStyles: true,
				showPointNames: false
			});
			
			var vectorSource = new ol.source.Vector({
		      url: "proxy?url=" + url,
			  format: format,
			  projection: 'EPSG:3857',
			  
			  loader: function(extent, resolution, projection) {
				  
				    var loadFeatures = function(source, status){
				    	//remove all features when we get results, to avoid flash on refresh
						this.getFeatures().forEach(this.removeFeature, this);
							
				    	if (source) {
				    		//ol kml format uses kml document baseURI for relative URLs. since we are
				    		//using the proxy and preprocesing the text, baseURI is not properly set.
				    		source = source.replace(relativeHrefRegex, '<href>'+ baseUrl +'$1</href>');
				    		
				    		var networkLinks = this.getFormat().readNetworkLinks(source);
				    		
				    		var _this = this;
				    		for(var i=0; i<networkLinks.length; i++){
				    			 $.ajax({
								      url: "proxy?url=" + networkLinks[i].href,
								      dataType: 'text',
								      success: function(source, status){
								    	  if(source){
								    		  
								    		  source = source.replace(relativeHrefRegex, '<href>'+ baseUrl +'$1</href>');

								    		  if(source.indexOf("<kml") == -1){
								    			   var header = "<kml xmlns=\"http://www.opengis.net/kml/2.2\" ";
													header += "xmlns:gx=\"http://www.google.com/kml/ext/2.2\" ";
													header += "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ";
													header += "xsi:schemaLocation=\"http://www.opengis.net/kml/2.2 http://schemas.opengis.net/kml/2.2.0/ogckml22.xsd http://www.google.com/kml/ext/2.2 http://code.google.com/apis/kml/schema/kml22gx.xsd\">";
													header += source;
													header += "</kml>";
													
													source = header;
								    		   }

								    		  	// Replace BalloonStyle tags
												var start = source.indexOf('<BalloonStyle>');
												
												while (start != -1){
													var end = source.indexOf('</BalloonStyle>') + 15;
													var insertIndex = source.indexOf('</Style>', end) + 8;
													
													if (insertIndex != -1)
													{
														var balloonStyle = source.substring(start, end);
													
														var description = balloonStyle.replace('<BalloonStyle><text>', '<description>')
														.replace('</text></BalloonStyle>', '</description>');
														
														source = source.slice(0, insertIndex) + description + source.slice(insertIndex);
														source = source.replace(balloonStyle, "");
													}
													var nextStart = source.indexOf("<BalloonStyle>");
													if (nextStart < start) {
														start = -1;
													} else {
														start = nextStart;
													}
												}
												  
												_this.addFeatures(_this.getFormat().readFeatures(
															 ol.xml.parse(source),
												        	 {featureProjection: 'EPSG:3857'}));
								    	  }
								      },
								      error: function(param1, status, error){},
								      scope: this
								   });
				    		}
			            	
				    		this.addFeatures(this.getFormat().readFeatures(
				    				 ol.xml.parse(source),
				                	 {featureProjection: 'EPSG:3857'}));
			            }
				    };
					
					var handler = loadFeatures.bind(this);
				  
					$.ajax({
				      url: this.getUrl(),
				      dataType: 'text',
				      success: handler,
				      error: function(param1, status, error){}
				   });
				}
	        });
			
			// tells the mapController we can handle a defered reload
			// meaning we will handle removing features when new ones come in
			vectorSource.set("deferReload", true);
			
			return new ol.layer.Vector({
			  opacity: config.opacity || 1,
			  source: vectorSource
			});
		},
		
		buildBingLayer: function(url, layername, config) {
			var attrs = (config.attributes) ? JSON.parse(config.attributes) : {};
			return new ol.layer.Tile({
				opacity: config.opacity || 1,
				source: new ol.source.BingMaps({
					key: Core.Config.getProperty("maps.bing.apikey"),
					imagerySet: attrs.type,
					maxZoom: 19
				})
			});
		},
		
		buildOSMLayer: function(url, layername, config) {
			return new ol.layer.Tile({
				opacity: config.opacity || 1,
				source: new ol.source.OSM()
			});
		},
		
		buildXYZLayer: function(url, layername, config) {
			var attrs = (config.attributes) ? JSON.parse(config.attributes) : {};
			return new ol.layer.Tile({
				opacity: config.opacity || 1,
				source: new ol.source.XYZ({
					url: url,
					maxZoom: attrs.maxZoom || 18
				})
			});
		},
		
		buildGeoJsonLayer: function(url, layername, config){
			if(layername){
				url = url + layername;
			}
			
			var vectorSource = new ol.source.Vector({
			  url: url,
			  format: new ol.format.GeoJSON()
	        });
			
			return new ol.layer.Vector({
			  opacity: config.opacity || 1,
			  source: vectorSource
			});
			
		},
		
		buildGpxLayer: function(url, layername, config){
			if(layername){
				url = url + layername;
			}
			
			var vectorSource = new ol.source.Vector({
			  url: "proxy?url=" + url,
			  format: new ol.format.GPX(),
			  projection: 'EPSG:3857'
	        });
			
			return new ol.layer.Vector({
			  opacity: config.opacity || 1,
			  source: vectorSource
			});
			
		},
		
		buildArcGisLayer: function(url, layername, config) {
			
			var params = { };
			params.LAYERS = 'show:' + layername;
			// token management done by proxy
			if(config.secure){
				var response = TokenManager.getTokenSynchronously(config.datasourceid);
				try
				{
					var jsonResponse = JSON.parse(response);
					if(jsonResponse.token){
						params.token = jsonResponse.token;
					} else{
						return; //Don't attempt to get features w/o a token
					}
                } catch(e){
					return;
				} //JS Logging?
			}
			layer = new ol.layer.Tile({
				opacity: config.opacity || 1,
				visible : true,
				source: new ol.source.TileArcGISRest({
				  	url: Ext.String.format(
						  "{0}//{1}/nics/{2}.proxy?url={3}",
					  window.location.protocol,
					  window.location.host,
					  config.datalayerid,
					  url),
					params: params
				})
			});
			FeatureRequestManager.addLayer(layer);
			
			return layer;			
		},

        buildWFSStyle: function(url, layername, config) {
            var styler = WfsStylerFactory.getStyler(config);

            return styler.getStyle;
        }
     });
});
