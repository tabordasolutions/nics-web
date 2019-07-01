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
define(['ext','iweb/CoreModule', 'nics/modules/UserProfileModule'], function(Ext, Core, UserProfile) {
		return Ext.define('modules.report-roc.RocFormModel', {	 
		 extend: 'Ext.app.ViewModel',
	 	
		 alias: 'viewmodel.roc', // connects to viewModel
	 	
		 data: {
				incidentName: this.incidentName,
				incidentId: this.incidentId,
			 	incidentNumber: this.incidentNumber,
				formTypeId: this.formTypeId,
				email: UserProfile.getUsername(),
				simplifiedEmail: this.simplifiedEmail,
				activeIncidentsStore: this.activeIncidentsStore,
				incidentNameReadOnly: this.incidentNameReadOnly,
				incidentTypes: this.incidentTypes,
				latitude : this.incidentLatitude,
				longitude: this.incidentLongitude,
		},
		coordinateToDecimalDegrees: function(coordinate) {
			var coordinateMod = coordinate;
			var negateVal = 1;
			if (coordinateMod < 0) {
				coordinateMod *= -1;
				negateVal = -1;
			}
			var degrees = Math.floor(coordinateMod);
			var minutes = 60 * (coordinateMod - degrees);
			return {'degrees': negateVal*degrees, 'minutes': minutes};
		},
		decimalDegreesToCoordinate: function(degrees, minutes) {
			var coordinate = parseInt(degrees, 10);
			return (coordinate < 0) ? coordinate - (minutes/60) : coordinate + (minutes/60);
		},
		getReport: function(){
            var thisIncidentTypes = this.get('incidentTypes');
            /*
            console.log("--- getReport()'s thisIncidentTypes dump ---");
            console.log(thisIncidentTypes);
            */

            var incidentTypesArray = this.getIncidentTypeIdsFromIncidentTypeNames(thisIncidentTypes);
            /*
            console.log( "-------- ROCFormModel's getReport()'s incidentTypesArray dump --------" );
            console.log(incidentTypesArray);
            */


             return {
                    reportType: this.get('reportType'),
                    county: this.get('county'),
                    additionalAffectedCounties: this.get('additionalAffectedCounties'),
                    street: this.get('street'),
                    crossStreet: this.get('crossStreet'),
                    nearestCommunity: this.get('nearestCommunity'),
                    milesFromNearestCommunity: this.get('milesFromNearestCommunity'),
                    directionFromNearestCommunity: this.get('directionFromNearestCommunity'),
                    county: this.get('county'),
                    date: this.get('date'),
                    starttime: this.get('starttime'),
                    location: this.get('location'),
                    dpa: this.get('dpa'),
                    sra: this.get('sra'),
                    jurisdiction: this.get('jurisdiction'),
                    incidentTypes: incidentTypesArray,
                    scope: this.get('scope'),
                    spreadRate: this.get('spreadRate'),
                    fuelTypes: this.get('fuelTypeCheckBoxGroup').fuelType,
                    otherFuelTypes: this.get('otherFuelTypes'),
                    percentContained: this.get('percentContained'),
                    temperature: this.get('temperature'),
                    relHumidity: this.get('relHumidity'),
                    windSpeed: this.get('windSpeed'),
                    windDirection: this.get('windDirection'),
                    evacuations: this.get('evacuations'),
                    evacuationsInProgress: this.get('evacuationsInProgress'),
                    structuresThreat: this.get('structuresThreat'),
                    structuresThreatInProgress: this.get('structuresThreatInProgress'),
                    infrastructuresThreat: this.get('infrastructuresThreat'),
                    infrastructuresThreatInProgress: this.get('infrastructuresThreatInProgress'),
                    otherThreatsAndEvacuations: this.get('otherThreatsAndEvacuations'),
                    otherThreatsAndEvacuationsInProgress: this.get('otherThreatsAndEvacuationsInProgress'),
                    calfireIncident: this.get('calfireIncident'),
                    resourcesAssigned: this.get('resourcesAssigned'),
                    email: this.get('email'),
                    simplifiedEmail: this.get('simplifiedEmail'),
                    latitudeAtROCSubmission: this.get('latitude'),
                    longitudeAtROCSubmission: this.get('longitude'),
                    weatherDataAvailable: this.get('weatherDataAvailable')
            };
		},
		getIncidentTypeIdsFromIncidentTypeNames: function(incidentTypesNames) {
            var incidentTypesWithIncidentID = UserProfile.getIncidentTypes();

            /*
            console.log("----------------------------********************-----------------------------------");
            console.log("----- getIncidentTypeIdsFromIncidentTypeNames()'s incidentTypesWithIncidentID -----");
            console.log(incidentTypesWithIncidentID);
            console.log(incidentTypesNames);
            console.log("incidentTypesNames.length: " + incidentTypesNames.incidenttype.length);
            console.log("" + incidentTypesWithIncidentID.length);
            */

            var incidentTypesArray = [];
            for(var i=0; i<incidentTypesNames.incidenttype.length; i++) {
                // console.log("value of i = " + i);
                for(var j=0; j<incidentTypesWithIncidentID.length; j++) {
                    // console.log("value of j = " + j);
                    // console.log((incidentTypesNames.incidenttype[i] === incidentTypesWithIncidentID[j].incidentTypeName));
                    if(incidentTypesNames.incidenttype[i] === incidentTypesWithIncidentID[j].incidentTypeName) {
                        incidentTypesArray.push(incidentTypesWithIncidentID[j].incidentTypeId);
                        break;
                    }
                }
            }

            console.log( "-------- ROCFormModel's getIncidentTypeIdsFromIncidentTypeNames() returning incidentTypesArray --------" );
            console.log({ incidenttype: incidentTypesArray });
            console.log("----------------------------xxxxxxxxxxxxxxxxxxxx-----------------------------------");

            return { "incidenttype": incidentTypesArray };
        },
		formulas: {
				readOnlyIncidentDetails: function(get) {
					return get('incidentNameReadOnly') ? true : get('incidentId') != null && get('incidentId') != '';
				},
				disableEvacuationsInProgress: function(get) {
					var evacuations = get('evacuations') ;
					return (typeof evacuations == "string") ? evacuations === 'No' : true;
				},
				disableStructuresThreatInProgress: function(get) {
					var structuresThreat = get('structuresThreat') ;
					return (typeof structuresThreat == "string") ? structuresThreat === 'No' : true;
				},
				disableInfrastructuresThreatInProgress: function(get) {
					var infrastructuresThreat = get('infrastructuresThreat') ;
					return (typeof infrastructuresThreat == "string") ? infrastructuresThreat === 'No' : true;
				},
				updateReport: function(get) {
					return get('reportType') == 'UPDATE';
				},
				finalReport: function(get) {
					return get('reportType') == 'FINAL';
				},
				latitude: {
					get: function(get) {
						return this.decimalDegreesToCoordinate(get('latDegrees'), get('latMinutes'));
					},

					set: function(value) {
						var latDegreesMinutes = this.coordinateToDecimalDegrees(value);
						var latDegreesMinutesSplitArray = 0;

						this.set({
                            latDegrees: 0,
                            latDecimal: 0,
                            latMinutes: 0
                        });

                        if(!isNaN(latDegreesMinutes.minutes)) {
                            latDegreesMinutesSplitArray = latDegreesMinutes.minutes.toString().split(".");

                            this.set({
                                latDegrees: latDegreesMinutes.degrees,
                                latMinutes: latDegreesMinutes.minutes,

                                latDecimal: latDegreesMinutesSplitArray[0],
                                latMinutesDisplay: ((typeof latDegreesMinutesSplitArray[1] === 'undefined') ? 0 : latDegreesMinutesSplitArray[1].substring(0,4))
                            });
                        }
					}
				},
				longitude: {
					get: function(get) {
						return this.decimalDegreesToCoordinate(get('longDegrees'), get('longMinutes'));
					},

					set: function(value) {
						var longDegreesMinutes = this.coordinateToDecimalDegrees(value);
                        var longDegreesMinutesSplitArray = 0;

                        this.set({
                            longDegrees: 0,
                            longDecimal: 0,
                            longMinutes: 0
                        });

                        if(!isNaN(longDegreesMinutes.minutes)) {
                            longDegreesMinutesSplitArray = longDegreesMinutes.minutes.toString().split(".");

                            this.set({
                                longDegrees: longDegreesMinutes.degrees,
                                longMinutes: longDegreesMinutes.minutes,

                                longDecimal: longDegreesMinutesSplitArray[0],

                                longMinutesDisplay: ((typeof longDegreesMinutesSplitArray[1] === 'undefined') ? 0 : longDegreesMinutesSplitArray[1].substring(0,4))

                            });
                        }
					}
				},
				fuelTypes: {
					get: function(get) {
						get('fuelTypeCheckBoxGroup').fuelType;
					},

					set: function(value) {
						this.set({
							fuelTypeCheckBoxGroup: {'fuelType': value}
						});
					}
				}
		 }
	 });
});