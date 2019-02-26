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
				formTypeId: this.formTypeId,
				email: UserProfile.getUsername(),
				simplifiedEmail: this.simplifiedEmail,
				activeIncidentsStore: this.activeIncidentsStore,
				incidentNameReadOnly: this.incidentNameReadOnly,
				incidentTypes: UserProfile.getIncidentTypes(),
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
						this.set({
							latDegrees: latDegreesMinutes.degrees,
							latMinutes: latDegreesMinutes.minutes
						});

					}
				},
				longitude: {
					get: function(get) {
						return this.decimalDegreesToCoordinate(get('longDegrees'), get('longMinutes'));
					},

					set: function(value) {
						var longDegreesMinutes = this.coordinateToDecimalDegrees(value);
						this.set({
							longDegrees: longDegreesMinutes.degrees,
							longMinutes: longDegreesMinutes.minutes
						});

					}
				},
		    	 report: function(get){
		    		 var report = {
		    				reportType: get('reportType'),
		    				initialCounty: get('initialCounty'),
		    				county: get('county'),
		    				date: get('date'),
		    				starttime: get('starttime'),
		    				location: get('location'),
		    				dpa: get('dpa'),
		    				sra: get('sra'),
		    				jurisdiction: get('jurisdiction'),
		    				incidentType: get('incidentType'),
		    				scope: get('scope'),
		    				spreadRate: get('spreadRate'),
		    				fuelType: get('fuelType').fueltype,
		    				otherFuelType: get('otherFuelType'),
		    				percentContained: get('percentContained'),
		    				temperature: get('temperature'),
		    				relHumidity: get('relHumidity'),
		    				windSpeed: get('windSpeed'),
		    				windDirection: get('windDirection'),
		    				evacuations: get('evacuations'),
		    				evacuationsInProgressFor: get('evacuationsInProgressFor'),
		    				structuresThreat: get('structuresThreat'),
		    				structuresThreatInProgress: get('structuresThreatInProgressFor'),
		    				infrastructuresThreat: get('infrastructuresThreat'),
		    				infrastructuresThreatInProgress: get('infrastructuresThreatInProgressFor'),
		    				otherThreatsAndEvacuations: get('otherThreatsAndEvacuations'),
		    				otherThreatsAndEvacuationsInProgress: get('otherThreatsAndEvacuationsInProgressFor'),
		    				calfireIncident: get('calfireIncident'),
		    				resourcesAssigned: get('resourcesAssigned'),
		    				email: get('email'),
		    				simplifiedEmail: get('simplifiedEmail')
		    		 
			    	
		    		};
		    		 
		    		return report;
		    	}
		 }
	 });
});