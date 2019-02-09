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
				Core.EventManager.addListener("EmailROCReport", this.emailROC.bind(this));
				this.mixins.geoApp.onLocateCallback = this.onLocateCallback.bind(this);
				Core.EventManager.addListener("LoadLocationBasedDataByIncident", this.processLocationBasedDataForIncident.bind(this));
				Core.EventManager.addListener("LoadLocationBasedData", this.processLocationBasedData.bind(this));
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
				this.getLocationBasedData();
				this.getViewModel().notify();
			},

			getLocationBasedData: function() {
				if(this.getViewModel().get('incidentId')) {
					this.mediator.sendRequestMessage(this.endpoint + "/reports/1/" + this.getViewModel().get('incidentId') + '/locationBasedData', 'LoadLocationBasedDataByIncident');
				} else {
					var requestPathWithParams = "/reports/1/locationBasedData?longitude=" + this.lookupReference('longitude').getValue() + "&latitude=" +
						this.lookupReference('latitude').getValue();
					this.mediator.sendRequestMessage(this.endpoint + requestPathWithParams, 'LoadLocationBasedData' );
				}
			},

			processLocationBasedDataForIncident: function(e, response) {
				//handle validation errors
				if(response.status ==  200) {
					if(response.data.reportType == 'FINAL') {
						this.setErrorMessage('Selected incident has Finalized ROC, cannot submit another ROC');
					} else {
						//bind response data to form
						this.view.lookupReference('latitude').setValue(response.data.latitude);
						this.view.lookupReference('longitude').setValue(response.data.longitude);
//						this.getViewModel().set('incidenttypes', response.data.incidentType);
						this.bindLocationBasedData(response.data.message, response.data.reportType);
					}
				}
				if(response.status == 400){
					this.setErrorMessage(response.validationErrors);
				} else if(response.status == 500) {
					this.setErrorMessage(response.message);
				}
				this.getViewModel().notify();
			},

			bindLocationBasedData : function (data, reportType='NEW'){
				this.getViewModel().set('state', data.state);
					this.view.lookupReference('initialCounty').setValue(data.county);
					this.getViewModel().set('location', data.location);
					this.view.lookupReference('sra').setValue(data.sra);
					this.view.lookupReference('dpa').setValue(data.dpa);
					this.getViewModel().set('jurisdiction', data.jurisdiction);//contract county comes in jurisdiction
					if(reportType == 'NEW') {
						this.getViewModel().set('temperature', data.temperature);
						this.getViewModel().set('relHumidity', data.relHumidity);
						this.getViewModel().set('windSpeed', data.windSpeed);
						this.getViewModel().set('windDirection', data.windDirection);
					}
			},

			setErrorMessage: function(message) {
				this.getViewModel().set('errorMessage', message);
				this.view.lookupReference('errorLabel').setHidden(message == null);
			},

			onIncidentChange: function(cb, newValue, oldValue, eOpts) {
				if(!this.getViewModel().getData().incidentNameReadOnly) {
					this.getViewModel().set('incidentId', '');
					this.setErrorMessage(null);
				}
			},

			onEditIncidentClick : function(button) {
				button.setMaxWidth(100);
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
				this.lookupReference('latitude').setValue(coord[1]);
				this.lookupReference('longitude').setValue(coord[0]);
				this.mixins.geoApp.removeLayer();
				this.mixins.geoApp.resetInteractions();
				this.getLocationBasedData();
			},

			onLocationChange: function() {
				if(!this.getViewModel().get('incidentId') && this.lookupReference('latitude').getValue() && this.lookupReference('longitude').getValue()) {
					this.getLocationBasedData();
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
					emailMessage  += "Start Date/Time: " + this.formatDate(data.date) + " @ " + this.formatTime(data.starttime);
					
					
					emailMessage  += "<ul>";
					emailMessage  += "<li>Scope " + data.scope + " acres, "  + data.percentContained + "% contained</li>";
					emailMessage  += "<li>" + data.spreadRate  + "Rate of Spread </li>";
					emailMessage  += "<li>" + data.temperature  + "&deg;, " + data.relHumidity + "% RH, " + data.windSpeed +  " mph, " +  data.windDirection  + "  </li>";
						emailMessage  += "<li>" + data.evacuations + " Evacuated </li>";
					emailMessage  += "<li>" + data.structuresThreat  + " Structure Threat</li>";
					emailMessage  += "<li>" + data.infrastructuresThreat  + "Critical Infrastructure </li>";
				    if(typeof(data.comments) != "undefined" && data.comments != ""){emailMessage  += "<li>" + data.comments  + "</li>"}
					emailMessage   += "</ul>"; 
				}
				else { 
					
					try {
					emailMessage = "<html><body><h2>Report on Conditions - " + data.incidentType ;
					emailMessage += "<br/><br/>Incident Name/Number: " + data.incidentName + "/" + data.incidentId ;
					emailMessage += "<br/>Start Date/Time: " + this.formatDate(data.date) + " @ "  + this.formatTime(data.starttime);
					emailMessage += "<br/> Location: " + data.location + "</h2>";
					emailMessage += "<ul style='list-style-type: none;'>";
					emailMessage += "<li><strong>Report Type:</strong> " + data.reportType + "</li>";
					emailMessage += "<li><strong>ROC Display Name:</strong> " + data.rocDisplayName + "</li>";
					emailMessage += "<li><strong>County:</strong> " + data.county + "</li>";
					emailMessage += "<li><strong>Date:</strong> " + this.formatDate(data.date) + "</li>";
					emailMessage += "<li><strong>Time:</strong> " + this.formatTime(data.starttime) + "</li>";
					emailMessage += "<li><strong>Jurisdiction:</strong> " + data.jurisdiction + "</li>";
					emailMessage += "<li><strong>Type of Incident:</strong> " + data.incidentType + "</li>";
					if(typeof(data.incidentCause) != "undefined" && data.incidentCause != "")emailMessage += "<li><strong>Cause:</strong> " + data.incidentCause + "</li>";
					emailMessage += "<li><strong>Acres/Size/Area involved:</strong> " + data.scope + "</li>";
					emailMessage += "<li><strong>Rate of Spread:</strong> " + data.spreadRate + "</li>";
					if(typeof(data.fuelType) != "undefined" && data.fuelType != "")emailMessage += "<li><strong>Fuel Type</strong> " + data.fuelType + "</li>";
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
					}
					catch(e) {
						alert(e);
					}
				}
				
			    if (reportType == 'print'){
			    	 emailMessage += "</html></body >"; 
			    	Core.EventManager.fireEvent("PrintROCReport",emailMessage);
			    }
			  else if (reportType == 'email'){
				  	emailMessage += "<p style='font-size:.8em;'>This e-mail was sent automatically by the Situation Awareness &amp; Collaboration Tool (SCOUT).Do not reply.</p></html></body >";
				    var subject  = "Report on Conditions  - " + data.rocDisplayName + "," + data.incidentType + "," + data.county + "," + data.reportType;
				    var emailResponse = {emailList: data.email, subject: subject, emailBody: emailMessage};
			    	Core.EventManager.fireEvent("EmailROCReport",emailResponse);

				 
			    } 
			//	return emailMessage;
				
			},
	    	
	    	submitForm: function(){
	    		var form = {};
	    		var message = {};
	    		var report= {};
	    		
	    		
	    		var time = Core.Util.formatDateToString(new Date());
	    		 
	    		message.datecreated = time;
	    		
	    		var formView = this.view.viewModel;
	    		 		
	    		if (typeof(formView.data.simplifiedEmail) == "undefined" )  {formView.data.simplifiedEmail = true;}
    	
	    		if (formView.get('report') === null){
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
	    			message.report = formView.get('report');
	    		
	    		}
	    		
	    	
	    		//Populate form properties
	    		form.incidentid = formView.data.incidentId;
	    		form.incidentname = formView.data.incidentName;
	    		form.formtypeid = formView.data.formTypeId; //this is always a ROC 
	    		form.usersessionid = UserProfile.getUserSessionId();
	    		form.distributed = false;
	    		form.message = JSON.stringify(message);
	    		
				var url = Ext.String.format('{0}/reports/{1}/{2}', 
						Core.Config.getProperty(UserProfile.REST_ENDPOINT),
						formView.data.incidentId, 'ROC');
	    		
				
				var topic = Ext.String.format("iweb.NICS.incident.{0}.report.{1}.#", formView.data.incidentId, 'ROC');
				
				this.mediator.sendPostMessage(url, topic, form);
				this.setFormReadOnly();
				this.newTopic = Ext.String.format(
						"iweb.NICS.incident.{0}.report.{1}.new", form.incidentid,
						'ROC');
				Core.EventManager.fireEvent(this.newTopic);
				//Build  email message
	    		//Add incident Name and Id to pass to email/print report
	    		message.report.incidentId = formView.data.incidentId;
	    		message.report.incidentName = formView.data.incidentName;
	    		this.buildReport(message.report, formView.data.simplifiedEmail, 'email');
			
				
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