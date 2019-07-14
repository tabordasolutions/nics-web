/*
 * Copyright (c) 2008-2016, Massachusetts Institute of Technology (MIT)
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
define(['ol', 'iweb/CoreModule', 'iweb/modules/MapModule', "nics/modules/UserProfileModule", './RocReportView',  './RocFormView','./RocFormModel'],

	function(ol, Core, MapModule, UserProfile, RocReportView, RocFormView , RocFormModel ){

		Ext.define('modules.report-roc.RocFormController', {
			extend : 'Ext.app.ViewController',
			
			alias: 'controller.rocformcontroller',
			mixins: {geoApp: 'modules.geocode.AbstractController'},
			
			init : function(args) {
			
				this.mediator = Core.Mediator.getInstance();
				this.endpoint = Core.Config.getProperty(UserProfile.REST_ENDPOINT);
				this.emailROCBinding = this.emailROC.bind(this);
				Core.EventManager.addListener("EmailROCReport", this.emailROCBinding);
				this.mixins.geoApp.onLocateCallback = this.onLocateCallback.bind(this);
				this.loadLocationBasedDataByIncidentBinding = this.processLocationBasedDataForIncident.bind(this);
				this.processLocationBasedDataBinding = this.processLocationBasedData.bind(this);
				this.processWeatherDataBinding = this.processWeatherData.bind(this);
				this.processPostIncidentAndROCResponseBinding = this.processPostIncidentAndROCResponse.bind(this);
				Core.EventManager.addListener("LoadLocationBasedDataByIncident", this.loadLocationBasedDataByIncidentBinding);
				Core.EventManager.addListener("LoadLocationBasedData", this.processLocationBasedDataBinding);
				Core.EventManager.addListener("LoadWeatherData", this.processWeatherDataBinding);
				Core.EventManager.addListener("iweb.NICS.incident.newIncident.report.ROC.#", this.processPostIncidentAndROCResponseBinding);
				this.prevLatitude = null;
				this.prevLongitude = null;
				this.createIncidentTypeCheckboxes();
				if(this.view.editROC && this.view.reportType == 'NEW') {
					this.requestLocationBasedDataForIncident(this.view.incidentId);
				}
			},

			createIncidentTypeCheckboxes: function() {
				var incidentTypes = UserProfile.getIncidentTypes();
				var incidentTypeCheckboxes = [];
				var checkboxGroup = this.view.lookupReference('incidentTypesRef');
				if(typeof(incidentTypes) != "undefined") {
                    for(var i = 0; i<incidentTypes.length; i++) {
                        checkboxGroup.insert(i, { boxLabel: incidentTypes[i].incidentTypeName, name: 'incidenttype', inputValue: incidentTypes[i].incidentTypeName, cls: 'roc-no-style'});
                    }
				}
			},

			destroy: function() {
				this.callParent(arguments);
				Core.EventManager.removeListener("EmailROCReport", this.emailROCBinding);
				Core.EventManager.removeListener("LoadLocationBasedDataByIncident", this.loadLocationBasedDataByIncidentBinding);
				Core.EventManager.removeListener("LoadLocationBasedData", this.processLocationBasedDataBinding);
				Core.EventManager.removeListener("LoadWeatherData", this.processWeatherDataBinding);
				Core.EventManager.removeListener("iweb.NICS.incident.newIncident.report.ROC.#", this.processPostIncidentAndROCResponseBinding);
			},

			clearForm: function () {
			 var username  = UserProfile.getFirstName() + " " + UserProfile.getLastName();
			 this.view.getForm().getFields().each (function (field) {
					 field.setValue("");
		    	});
		    },

			setFormReadOnly: function () {
				this.view.getForm().getFields().each (function (field) {
					field.setReadOnly(true);
				});
				this.view.lookupReference('submitButton').hide();
				this.view.lookupReference('cancelButton').hide();
				this.view.lookupReference('resetButton').hide();
			},

			enableForm: function () {
				this.view.getForm().getFields().each (function (field) {
					field.setReadOnly(false);
				});
				this.view.lookupReference('submitButton').show();
				this.view.lookupReference('cancelButton').show();
				this.view.lookupReference('resetButton').show();
			},

			onIncidentSelect: function(cb, record, index) {
				this.getViewModel().set('incidentId', record.data.incidentId);
				this.setErrorMessage(null);
				this.requestLocationBasedDataForIncident(record.data.incidentId);
				this.getViewModel().notify();
			},

			requestLocationBasedData: function() {
				var requestPathWithParams = "/reports/1/locationBasedData?longitude=" + this.getViewModel().get('longitude') + "&latitude=" +
				this.getViewModel().get('latitude');
				this.mediator.sendRequestMessage(this.endpoint + requestPathWithParams, 'LoadLocationBasedData' );
			},

			requestLocationBasedDataForIncident: function(incidentId) {
				if(incidentId) {
					this.mediator.sendRequestMessage(this.endpoint + "/reports/1/" + incidentId + '/locationBasedData', 'LoadLocationBasedDataByIncident');
				}
			},

			requestLocationBasedDataOnEditRequest: function() {
				if(!this.view.editROC) {
					return;
				}
				var currLatitude = this.getViewModel().get('latitude');
				var currLongitude = this.getViewModel().get('longitude');
				var latitudeAtROCSubmission = this.getViewModel().get('latitudeAtROCSubmission');
				var longitudeAtROCSubmission = this.getViewModel().get('longitudeAtROCSubmission');
				if(currLatitude != latitudeAtROCSubmission || currLongitude != longitudeAtROCSubmission) {
					this.requestLocationBasedData();
				} else {
					this.requestWeatherData();
				}
			},

			requestWeatherData: function() {
				var uriWithParams = "/locationBasedData/weather?longitude=" + this.getViewModel().get('longitude') + "&latitude=" + this.getViewModel().get('latitude');
				this.mediator.sendRequestMessage(this.endpoint + uriWithParams, 'LoadWeatherData' );
			},

			processLocationBasedDataForIncident: function(e, response) {
				//handle validation errors
				if(response.status ==  200) {
					if(response.data.reportType == 'FINAL') {
						this.setErrorMessage('Selected incident has Finalized ROC, cannot submit another ROC');
					} else {
						//bind response data to form
						this.getViewModel().set('reportType', response.data.reportType);
						this.getViewModel().set('latitude', response.data.latitude);
						this.getViewModel().set('longitude', response.data.longitude);
						if(response.data.incidentTypes) {
							var incidentTypeIds = response.data.incidentTypes.map(function(curr, index, array) {return curr.incidentTypeId;});
		                    var incidentTypeNamesArray = this.getIncidentTypeNamesFromIncidentTypeIds(incidentTypeIds);
							this.view.lookupReference('incidentTypesRef').setValue({incidenttype: incidentTypeNamesArray});
						}

						this.getViewModel().set('incidentNumber', (response.data.incidentNumber == 'null') ? '' :  response.data.incidentNumber);
						this.getViewModel().set('additionalAffectedCounties', (response.data.message.additionalAffectedCounties == 'null') ? '' : response.data.message.additionalAffectedCounties );
						this.getViewModel().set('street', (response.data.message.street == 'null') ? '' : response.data.message.street);
						this.getViewModel().set('crossStreet', (response.data.message.crossStreet == 'null') ? '' : response.data.message.crossStreet);
						this.getViewModel().set('nearestCommunity', (response.data.message.nearestCommunity == 'null') ? '' : response.data.message.nearestCommunity);
						this.getViewModel().set('milesFromNearestCommunity', (response.data.message.milesFromNearestCommunity == 'null') ? '' : response.data.message.milesFromNearestCommunity );
						this.getViewModel().set('directionFromNearestCommunity', response.data.message.directionFromNearestCommunity);
						this.getViewModel().set('scope', (response.data.message.scope == 'null') ? '' : response.data.message.scope );
                        this.getViewModel().set('startTime', response.data.message.startTime);
						this.getViewModel().set('spreadRate', response.data.message.spreadRate);
						// this.getViewModel().set('structuresThreat', response.data.message.structuresThreat);
                        // this.view.lookupReference('structuresThreatInProgressRef').setValue({structuresThreat: response.data.message.structuresThreats});
						// this.getViewModel().set('evacuations', response.data.message.evacuations);
                        // this.view.lookupReference('evacuationsInProgressRef').setValue({evacuations: response.data.message.evacuationsList});
						this.getViewModel().set('fuelTypes', response.data.message.fuelTypes);
						this.getViewModel().set('otherFuelTypes', (response.data.message.otherFuelTypes == 'null') ? '' : response.data.message.otherFuelTypes );
                        this.getViewModel().set('percentContained', (response.data.message.percentageContained == 'null') ? '' : response.data.message.percentageContained );
                        this.getViewModel().set('relHumidity', response.data.message.relHumidity);
                        this.getViewModel().set('calfireIncident', response.data.message.calfireIncident);
                        this.view.lookupReference('resourcesAssignedRef').setValue({resourcesAssigned: response.data.message.resourcesAssigned});
                        this.view.lookupReference('otherResourcesAssignedCheckboxRef').setValue({resourcesAssigned: response.data.message.otherResourcesAssigned});

                        this.getViewModel().set('temperature', response.data.message.temperature);
                        this.view.lookupReference('otherSignificantInfoRef').setValue({otherSignificantInfo: response.data.message.otherSignificantInfo});
						this.bindLocationBasedData(response.data.message, response.data.reportType);
					}
				} else if(response.status == 400){
					this.setErrorMessage(response.validationErrors);
				} else if(response.status == 500) {
					this.setErrorMessage(response.message);
				}
				this.getViewModel().notify();
			},

			bindLocationBasedData : function (data){
					this.getViewModel().set('state', data.state);
					this.getViewModel().set('county', data.county);
					this.getViewModel().set('location', data.location);
					this.getViewModel().set('sra', data.sra);
					this.getViewModel().set('dpa', data.dpa);
					this.getViewModel().set('jurisdiction', data.jurisdiction);//contract county comes in jurisdiction
					this.getViewModel().set('temperature', data.temperature);
					this.getViewModel().set('relHumidity', data.relHumidity);
					this.getViewModel().set('windSpeed', data.windSpeed);
					this.getViewModel().set('windDirection', data.windDirection);
			},

			processWeatherData: function(e, response) {
				if(response.status ==  200) {
					if(response.message == 'OK') {
						this.getViewModel().set('temperature', response.weatherData.temperature);
						this.getViewModel().set('relHumidity', response.weatherData.relHumidity);
						this.getViewModel().set('windSpeed', response.weatherData.windSpeed);
						this.getViewModel().set('windDirection', response.weatherData.windDirection);
						this.getViewModel().set('weatherDataAvailable', true);
					} else {
						this.getViewModel().set('weatherDataAvailable', false);
					}
				} else if(response.status == 400){
					this.setErrorMessage(response.validationErrors);
				} else if(response.status == 500) {
					this.setErrorMessage(response.message);
					this.getViewModel().set('weatherDataAvailable', false);
				}
			},

			setErrorMessage: function(message) {
				this.getViewModel().set('errorMessage', message);
				this.view.lookupReference('errorLabel').setHidden(message == null);
			},

			onIncidentChange: function(cb, newValue, oldValue, eOpts) {
				if(this.getViewModel().get('incidentId') && !this.getViewModel().get('incidentNameReadOnly')) {
					this.getViewModel().set('incidentId', '');
					this.setErrorMessage(null);
					this.getViewModel().set('longitude', '');
					this.getViewModel().set('latitude', '');
					this.getViewModel().set('state', '');
					this.getViewModel().set('county', '');
					this.getViewModel().set('additionalAffectedCounties', '');
                    this.getViewModel().set('street', '');
                    this.getViewModel().set('crossStreet', '');
                    this.getViewModel().set('nearestCommunity', '');
                    this.getViewModel().set('milesFromNearestCommunity', '');
                    this.getViewModel().set('directionFromNearestCommunity', '');
					this.getViewModel().set('incidentType', '');
					this.getViewModel().set('otherSignificantInfo', '');
				}
			},

			onLocateToggle: function(locateButton, state) {
				this.setErrorMessage('');
				this.mixins.geoApp.onLocateToggle(locateButton, state);
			},

			onLocateCallback: function(feature) {
				this.lookupReference('locateButton').toggle(false);
				var view = MapModule.getMap().getView();
				var clone = feature.getGeometry().clone().transform(view.getProjection(), ol.proj.get('EPSG:4326'));
				var coord = clone.getCoordinates();
				this.getViewModel().set('latitude', coord[1]);
				this.getViewModel().set('longitude', coord[0]);
				this.mixins.geoApp.removeLayer();
				this.mixins.geoApp.resetInteractions();
			},

			onLocationChange: function() {
				//if no change in lat/long since fetching last location based data
				if(this.prevLatitude == this.getViewModel().get('latitude') && this.prevLongitude == this.getViewModel().get('longitude'))
					return;
				this.prevLatitude = this.getViewModel().get('latitude');
				this.prevLongitude = this.getViewModel().get('longitude');
				if(!this.getViewModel().get('incidentId') && this.getViewModel().get('latitude') && this.getViewModel().get('longitude')) {
					this.requestLocationBasedData();
				}
			},
            onIncidentTypeChange: function(checkbox, newValue, oldValue, eOpts) {
                var incidentTypeSelectedValuesLength = 0;
                var isFireWildlandCheckboxChecked = false;


                this.view.lookupReference('spreadRateComboRef').removeCls('roc-required');
                this.view.lookupReference('spreadRateComboRef').addCls('roc-no-style');
                this.view.lookupReference('spreadRateComboRef').allowBlank = true;
                this.view.lookupReference('spreadRateComboRef').validate();

                this.view.lookupReference('scopeRef').removeCls('roc-required');
                this.view.lookupReference('scopeRef').addCls('roc-no-style');
                this.view.lookupReference('scopeRef').allowBlank = true;
                this.view.lookupReference('scopeRef').validate();

                this.view.lookupReference('fuelTypeCheckboxRef').removeCls('roc-required');
                this.view.lookupReference('fuelTypeCheckboxRef').addCls('roc-no-style');
                this.view.lookupReference('fuelTypeCheckboxRef').allowBlank = true;
                this.view.lookupReference('fuelTypeCheckboxRef').validate();

                this.view.lookupReference('percentContainedRef').removeCls('roc-required');
                this.view.lookupReference('percentContainedRef').addCls('roc-no-style');
                this.view.lookupReference('percentContainedRef').allowBlank = true;
                this.view.lookupReference('percentContainedRef').validate();

                this.view.lookupReference('evacuationsComboboxRef').removeCls('roc-required');
                this.view.lookupReference('evacuationsComboboxRef').addCls('roc-no-style');
                this.view.lookupReference('evacuationsComboboxRef').allowBlank = true;
                this.view.lookupReference('evacuationsComboboxRef').validate();

                this.view.lookupReference('structuresThreatComboRef').removeCls('roc-required');
                this.view.lookupReference('structuresThreatComboRef').addCls('roc-no-style');
                this.view.lookupReference('structuresThreatComboRef').allowBlank = true;
                this.view.lookupReference('structuresThreatComboRef').validate();

                this.view.lookupReference('infrastructuresThreatComboRef').removeCls('roc-required');
                this.view.lookupReference('infrastructuresThreatComboRef').addCls('roc-no-style');
                this.view.lookupReference('infrastructuresThreatComboRef').allowBlank = true;
                this.view.lookupReference('infrastructuresThreatComboRef').validate();

                if (newValue != null && newValue.incidenttype != null) {
                    incidentTypeSelectedValuesLength = newValue.incidenttype.length;
                    if(Array.isArray(newValue.incidenttype)) {
                        for(var j=0; j<incidentTypeSelectedValuesLength; j++) {
                            if(newValue.incidenttype[j] == "Fire (Wildland)") {
                                isFireWildlandCheckboxChecked = true;
                                break;
                            }
                        }
                    } else {
                        if(newValue.incidenttype == "Fire (Wildland)") {
                            isFireWildlandCheckboxChecked = true;
                        }
                    }
                }

                if(isFireWildlandCheckboxChecked) {
                    this.view.lookupReference('spreadRateComboRef').removeCls('roc-no-style');
                    this.view.lookupReference('spreadRateComboRef').addCls('roc-required');
                    this.view.lookupReference('spreadRateComboRef').allowBlank = false;
                    this.view.lookupReference('spreadRateComboRef').validate();

                    this.view.lookupReference('scopeRef').removeCls('roc-no-style');
                    this.view.lookupReference('scopeRef').addCls('roc-required');
                    this.view.lookupReference('scopeRef').allowBlank = false;
                    this.view.lookupReference('scopeRef').validate();

                    this.view.lookupReference('fuelTypeCheckboxRef').removeCls('roc-no-style');
                    this.view.lookupReference('fuelTypeCheckboxRef').addCls('roc-required');
                    this.view.lookupReference('fuelTypeCheckboxRef').allowBlank = false;
                    this.view.lookupReference('fuelTypeCheckboxRef').validate();

                    this.view.lookupReference('percentContainedRef').removeCls('roc-no-style');
                    this.view.lookupReference('percentContainedRef').addCls('roc-required');
                    this.view.lookupReference('percentContainedRef').allowBlank = false;
                    this.view.lookupReference('percentContainedRef').validate();

                    this.view.lookupReference('evacuationsComboboxRef').removeCls('roc-no-style');
                    this.view.lookupReference('evacuationsComboboxRef').addCls('roc-required');
                    this.view.lookupReference('evacuationsComboboxRef').allowBlank = false;
                    this.view.lookupReference('evacuationsComboboxRef').validate();

                    this.view.lookupReference('structuresThreatComboRef').removeCls('roc-no-style');
                    this.view.lookupReference('structuresThreatComboRef').addCls('roc-required');
                    this.view.lookupReference('structuresThreatComboRef').allowBlank = false;
                    this.view.lookupReference('structuresThreatComboRef').validate();

                    this.view.lookupReference('infrastructuresThreatComboRef').removeCls('roc-no-style');
                    this.view.lookupReference('infrastructuresThreatComboRef').addCls('roc-required');
                    this.view.lookupReference('infrastructuresThreatComboRef').allowBlank = false;
                    this.view.lookupReference('infrastructuresThreatComboRef').validate();
                }
            },

            onOtherFuelTypeCheckBoxChecked: function(checkbox, newValue, oldValue, eOpts) {
                var fuelTypeSelectedValuesLength = 0;
                var isOtherFuelTypeCheckBoxChecked = false;

                this.view.lookupReference('otherFuelTypesRef').removeCls('roc-required');
                this.view.lookupReference('otherFuelTypesRef').addCls('roc-no-style');
                this.view.lookupReference('otherFuelTypesRef').disable();
                this.view.lookupReference('otherFuelTypesRef').allowBlank = true;
                this.view.lookupReference('otherFuelTypesRef').validate();

                if (newValue != null && newValue.fuelType != null) {
                    fuelTypeSelectedValuesLength = newValue.fuelType.length;
                    if(Array.isArray(newValue.fuelType)) {
                        for(var j=0; j<fuelTypeSelectedValuesLength; j++) {
                            if(newValue.fuelType[j] == "Other") {
                                isOtherFuelTypeCheckBoxChecked = true;
                                break;
                            }
                        }
                    } else {
                        if(newValue.fuelType == "Other") {
                            isOtherFuelTypeCheckBoxChecked = true;
                        }
                    }
                }

                if (isOtherFuelTypeCheckBoxChecked) {
                    this.view.lookupReference('otherFuelTypesRef').removeCls('roc-no-style');
                    this.view.lookupReference('otherFuelTypesRef').addCls('roc-required');
                    this.view.lookupReference('otherFuelTypesRef').enable();
                    this.view.lookupReference('otherFuelTypesRef').allowBlank = false;
                    this.view.lookupReference('otherFuelTypesRef').validate();
                }
            },

			processLocationBasedData: function(e, response) {
				if(response.status == 200) {
					this.bindLocationBasedData(response.data);
				} else if(response.status == 400) {
					//handle validation errors
					this.setErrorMessage(response.validationErrors);
				} else if(response.status == 500) {
					//handle internal server error
					this.setErrorMessage(response.errorMessage);
				}
			},

		    buildReport: function(data, simple, reportType){			    	
			
		    	var emailMessage=null;

				if (simple){
					
					emailMessage  = "<html><body >Intel - for internal use only. Numbers subject to change<br/><br/";
					emailMessage  +=  "Location: " + data.location + "</br>";
					emailMessage  += "Jurisdiction: " + data.jurisdiction + "<br/>";
					// emailMessage  += "Start Date/Time: " + this.formatDate(data.date) + " @ " + this.formatTime(data.starttime);
					emailMessage  += "Start Date/Time: " + this.formatDate(data.date) + " @ " + data.startTime;
					
					emailMessage  += "<ul>";
					emailMessage  += "<li>Scope " + data.scope + " acres, "  + data.percentContained + "% contained</li>";
					emailMessage  += "<li>" + data.spreadRate  + "Rate of Spread </li>";
					emailMessage  += "<li>" + data.temperature  + "&deg;, " + data.relHumidity + "% RH, " + data.windSpeed +  " mph, " +  data.windDirection  + "  </li>";
						emailMessage  += "<li>" + data.evacuations + " Evacuated </li>";
					emailMessage  += "<li>" + data.structuresThreat  + " Structure Threat</li>";
					emailMessage  += "<li>" + data.infrastructuresThreat  + "Critical Infrastructure </li>";
				    if(typeof(data.comments) != "undefined" && data.comments != ""){emailMessage  += "<li>" + data.comments  + "</li>"}
					emailMessage   += "</ul>"; 
				} else {
					
					try {
                        emailMessage = "<html><body><h2>Report on Conditions - " + data.incidentTypes ;
                        emailMessage += "<br/><br/>Incident Name/Number: " + data.incidentName + "/" + data.incidentId ;
                        // emailMessage += "<br/>Start Date/Time: " + this.formatDate(data.date) + " @ "  + this.formatTime(data.starttime);
                        emailMessage += "<br/>Start Date/Time: " + this.formatDate(data.date) + " @ "  + data.startTime;
                        emailMessage += "<br/> Location: " + data.location + "</h2>";
                        emailMessage += "<ul style='list-style-type: none;'>";
                        emailMessage += "<li><strong>Report Type:</strong> " + data.reportType + "</li>";
                        emailMessage += "<li><strong>ROC Display Name:</strong> " + data.rocDisplayName + "</li>";
                        emailMessage += "<li><strong>County:</strong> " + data.county + "</li>";
                        emailMessage += "<li><strong>Date:</strong> " + this.formatDate(data.date) + "</li>";
                        // emailMessage += "<li><strong>Time:</strong> " + this.formatTime(data.starttime) + "</li>";
                        emailMessage += "<li><strong>Time:</strong> " + data.startTime + "</li>";
                        emailMessage += "<li><strong>Jurisdiction:</strong> " + data.jurisdiction + "</li>";
                        emailMessage += "<li><strong>Type of Incident:</strong> " + data.incidentTypes + "</li>";
                        if(typeof(data.incidentCause) != "undefined" && data.incidentCause != "")emailMessage += "<li><strong>Cause:</strong> " + data.incidentCause + "</li>";
                        emailMessage += "<li><strong>Acres/Size/Area involved:</strong> " + data.scope + "</li>";
                        emailMessage += "<li><strong>Rate of Spread:</strong> " + data.spreadRate + "</li>";
                        if(typeof(data.fuelTypes) != "undefined" && data.fuelTypes != "")emailMessage += "<li><strong>Fuel Type</strong> " + data.fuelTypes + "</li>";
                        if(typeof(data.potential) != "undefined" && data.potential != "")emailMessage += "<li><strong>Potential:</strong> " + data.potential + "</li>";
                        emailMessage += "<li><strong> % contained:</strong> " + data.percentContained + "</li>";
                        if(typeof(data.estimatedContainment) != "undefined" && data.estimatedContainment != "")emailMessage += "<li><strong>Estimated Containment:</strong> " + data.estimatedContainment + "</li>";
                        if(typeof(data.estimatedControl) != "undefined" && data.estimatedControl != "")emailMessage += "<li><strong>Estimated Control:</strong> " + data.estimatedControl + "</li>";

                        emailMessage += "<li><strong>Weather</strong> <ul style='list-style-type: none;'> ";
                        emailMessage += "<li><strong>Temperature:</strong> " + data.temperature + "</li>";
                        emailMessage += "<li><strong>Relative Humidity:</strong> " + data.relHumidity + "</li>";
                        emailMessage += "<li><strong>Wind Speed mph:</strong> " + data.windSpeed + "</li>";
                        emailMessage += "<li><strong>Wind Direction:</strong> " + data.windDirection + "</li>";
                        emailMessage +="<li><strong>Predicted Weather:</strong> " + data.predictedWeather + "</li></ul></li>";
                        emailMessage += "<li><strong>Evacuations:</strong> " + data.evacuations  + "</li>";
                        emailMessage += "<li><strong>Structures Threatened:</strong> " + data.structuresThreat  + "</li>";
                        emailMessage += "<li><strong>Critical Infrastructure Threatened:</strong> " + data.infrastructuresThreat  + "</li>";
                        if(typeof(data.icpLocation) != "undefined" && data.icpLocation != "")emailMessage += "<li><strong>ICP Location:</strong> " + data.icpLocation  + "</li>";
                        emailMessage += "<li><strong>Resources Committed</strong> <ul style='list-style-type: none;'> ";
                        emailMessage += "<li><strong>Aircraft</strong> <ul style='list-style-type: none;'> ";
                        if(typeof(data.airAttack) != "undefined" && data.airAttack != "")emailMessage +="<li><strong>Air Attack:</strong> " + data.airAttack + "</li>";
                        if(typeof(data.airTankers) != "undefined" && data.airTankers != "")emailMessage +="<li><strong>Air Tankers:</strong> " + data.airTankers + "</li>";
                        if(typeof(data.helicopters) != "undefined" && data.helicopters != "")emailMessage +="<li><strong>Helicopters:</strong> " + data.helicopters + "</li>";
                        emailMessage +=	"</ul></li>";
                        if(typeof(data.overhead) != "undefined" && data.overhead != "")emailMessage +="<li><strong>Overhead:</strong> " + data.overhead + "</li>";
                        if(typeof(data.typeIEngine) != "undefined" && data.typeIEngine != "")emailMessage +="<li><strong>Type I Engine:</strong> " + data.typeIEngine + "</li>";
                        if(typeof(data.typeIIEngine) != "undefined" && data.typeIIEngine != "")emailMessage +="<li><strong>Type II Engine:</strong> " + data.typeIIEngine + "</li>";
                        if(typeof(data.typeIIIEngine) != "undefined" && data.typeIIIEngine != "")emailMessage +="<li><strong>Type III Engine:</strong> " + data.typeIIIEngine + "</li>";
                        if(typeof(data.waterTender) != "undefined" && data.waterTender != "")emailMessage +="<li><strong>Water Tender:</strong> " + data.waterTender + "</li>";
                        if(typeof(data.dozers) != "undefined" && data.dozers != "")emailMessage +="<li><strong>Dozers:</strong> " + data.dozers + "</li>";
                        if(typeof(data.handcrews) != "undefined" && data.handcrews != "")emailMessage +="<li><strong>Hand Crews:</strong> " + data.handcrews + "</li>";
                        if(typeof(data.comUnit) != "undefined" && data.comUnit != "")emailMessage +="<li><strong>Com Unit:</strong> " + data.comUnit + "</li>";
                        emailMessage +=	"</ul></li>";

                        emailMessage += "</ul>"
                        if(typeof(data.comments) != "undefined" && data.comments != "")emailMessage +="<strong>General Comments:</strong> " + data.comments;
                         emailMessage += "<br/><strong>Reported By " + data.reportBy + "</strong>";
					} catch(e) {
						alert(e);
					}
				}
				
			    if (reportType == 'print') {
			    	 emailMessage += "</html></body >"; 
			    	Core.EventManager.fireEvent("PrintROCReport",emailMessage);
			    } else if (reportType == 'email') {
				  	emailMessage += "<p style='font-size:.8em;'>This e-mail was sent automatically by the Situation Awareness &amp; Collaboration Tool (SCOUT).Do not reply.</p></html></body >";
				    var subject  = "Report on Conditions  - " + data.rocDisplayName + "," + data.incidentTypes + "," + data.county + "," + data.reportType;
				    var emailResponse = {emailList: data.email, subject: subject, emailBody: emailMessage};
			    	// Core.EventManager.fireEvent("EmailROCReport",emailResponse);
			    } 
			//	return emailMessage;
				
			},
	    	
	    	submitForm: function(){
	    		var form = {};
	    		var message = {};
	    		var report= {};

				var time = Core.Util.formatDateToString(new Date());
				// var format = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
				
				// message.dateCreated = this.ISODateString(new Date());
				message.datecreated = time;
	    		
	    		var formView = this.view.viewModel;

	    		if (typeof(formView.data.simplifiedEmail) == "undefined" )  {formView.data.simplifiedEmail = true;}
	    		if (formView.getReport() === null){
	    			//create the report from the data
	    		   for (item in formView.data){
	    			   //Don't capture the buttons, or the incident name and id in the report
	    			   var buttonRE = /button$/i;
	    			  // var isButton = buttonRE.test(item);
	    			   if (item != 'incidentId' && item != 'incidentName' && !(buttonRE.test(item)) && item != 'activeIncidentsStore'  && item != 'incidentNameReadOnly')
	    					report[item] = formView.data[item];
	    		  }
	    		   message.report = report;
	    		   
	    		}else {
	    			//report has already been created
	    			message.report = formView.getReport();
	    		}
	    		
				//Populate form properties
				form.incidentid = formView.data.incidentId;
				form.incidentname = formView.data.incidentName;
				form.incidentnumber = formView.data.incidentNumber;
				form.formtypeid = formView.data.formTypeId; //this is always a ROC
				form.usersessionid = UserProfile.getUserSessionId();
				form.distributed = false;
				form.message = JSON.stringify(message);

				if(form.incidentid) {  //submitting ROC on existing incident
					var url = Ext.String.format('{0}/reports/{1}/{2}',
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						formView.data.incidentId, 'ROC');

					var topic = Ext.String.format("iweb.NICS.incident.{0}.report.{1}.#", formView.data.incidentId, 'ROC');

					this.mediator.sendPostMessage(url, topic, form);
					this.newTopic = Ext.String.format(
						"iweb.NICS.incident.{0}.report.{1}.new", form.incidentid,
						'ROC');
					Core.EventManager.fireEvent(this.newTopic);
				} else { // submitting new incident & ROC
                    var incidentName = Ext.String.format('CA {0} {1}', UserProfile.getOrgPrefix(), formView.get('incidentName'));
                    var incidentNumber = formView.get('incidentNumber');
                    var incidentTypesFromUI = formView.get('incidentTypes').incidenttype;
                    var incidentTypesArray = this.getIncidentTypeIdsFromIncidentTypeNames(incidentTypesFromUI).map(function (el) {
                        return { "incidenttypeid": JSON.stringify(el) };
                    });

					form.incident = {'incidentid': formView.data.incidentId, 'incidentname': incidentName, 'incidentnumber': incidentNumber, 'usersessionid': UserProfile.getUserSessionId(),
						'lat': formView.get('latitude'), 'lon': formView.get('longitude'),
						'workspaceid': UserProfile.getWorkspaceId(), 'incidentIncidenttypes': incidentTypesArray};

					form.incidentname = incidentName;
					form.incidentnumber = incidentNumber;
					var url = Ext.String.format('{0}/reports/{1}/IncidentAndROC',
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						UserProfile.getOrgId());

					var topic = Ext.String.format("iweb.NICS.incident.newIncident.report.{1}.#", 'ROC');
					this.mediator.sendPostMessage(url, topic, form);
				}
				this.setFormReadOnly();
				//Build  email message
				//Add incident Name and Id to pass to email/print report
				message.report.incidentId = formView.data.incidentId;
				message.report.incidentName = formView.data.incidentName;
				form.email = this.buildReport(message.report, formView.data.simplifiedEmail, 'email');

			},
			getIncidentTypeIdsFromIncidentTypeNames: function(incidentTypesNames) {
                var incidentTypesWithIncidentID = UserProfile.getIncidentTypes();
                var incidentTypesArray = [];
                for(var i=0; i<incidentTypesNames.length; i++) {
                    for(var j=0; j<incidentTypesWithIncidentID.length; j++) {
                        if(incidentTypesNames[i] === incidentTypesWithIncidentID[j].incidentTypeName) {
                            incidentTypesArray.push(incidentTypesWithIncidentID[j].incidentTypeId);
                            break;
                        }
                    }
                }
                return incidentTypesArray;
			},
			getIncidentTypeNamesFromIncidentTypeIds: function(incidentTypesIds) {
                var incidentTypesWithIncidentNames = UserProfile.getIncidentTypes();
                var incidentTypesArray = [];
                for(var i=0; i<incidentTypesIds.length; i++) {
                    for(var j=0; j<incidentTypesWithIncidentNames.length; j++) {
                        if(incidentTypesIds[i] === incidentTypesWithIncidentNames[j].incidentTypeId) {
                            incidentTypesArray.push(incidentTypesWithIncidentNames[j].incidentTypeName);
                            break;
                        }
                    }
                }
                return incidentTypesArray;
            },
			ISODateString: function(d){
				function pad(n){return n<10 ? '0'+n : n}
				return d.getUTCFullYear()+'-'
					+ pad(d.getUTCMonth()+1)+'-'
					+ pad(d.getUTCDate())+'T'
					+ pad(d.getUTCHours())+':'
					+ pad(d.getUTCMinutes())+':'
					+ pad(d.getUTCSeconds())+'Z'
				
			},

			processPostIncidentAndROCResponse: function(e, response) {
				if(response.status == 200) {
					//display successful response message
					this.getViewModel().set('successMessage', "Incident & ROC submission has been successful.");
				} else if(response.status == 401) {
					// decide what to do
					//logout ??
				} else if(response.status == 400) {
					//display validation errors - which never happens easily as form is submitted only after validation
					this.setErrorMessage(response.validationErrors);
				} else if(response.status == 500) {
					//display error saying "Failed to persist ROC" or "Incident persisted  but failed to persist ROC"
					this.setErrorMessage(response.message);
				}
			},

	    	emailROC: function(e, response){
	    		//Now send the email 

	    		this.emailTopic = "iweb.nics.email.alert";
	    		var emailList = response.emailList;
	    		var subject  = response.subject;
	    		var msgBody= response.emailBody;
	    		
			var message = {
				      to: emailList,
				      from: UserProfile.getUsername(),
				      subject: subject,
				      body: msgBody
				}; 
			if (this.mediator && this.mediator.publishMessage)
			{
				this.mediator.publishMessage(this.emailTopic, message); 
			} 

		
    	},
	    	
        cancelForm: function(){
            this.setFormReadOnly();

        },

        formatTime: function(date)
        {
            var str =  date.getHours() + ":" + Core.Util.pad(date.getMinutes()) ;

            return str;
        },
        formatDate: function(date)
        {
            var str = (date.getMonth() + 1) + "/"
            + date.getDate() + "/"
            + date.getFullYear();

            return str;
        }

    });
});