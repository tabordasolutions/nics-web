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
require.config({
    urlArgs: "v=2018.1.5",
    //urlArgs: 'v=' +  (new Date()).getTime(),
    paths: {
        'ext': 'lib/extjs/build/ext-all',
        'ext-charts': 'lib/extjs/build/packages/sencha-charts/build/sencha-charts',
        'jquery': 'lib/jquery-1.11.1.min',
        'atmosphere': 'lib/atmosphere',
        'ol' : 'lib/ol/ol'
    },
    waitSeconds:60,
    bundles: {
        'nics/modules/accountinfo': ["nics/modules/AccountInfoModule", "nics/modules/accountinfo/AccountInfoController", "nics/modules/accountinfo/AccountInfoViewer", "nics/modules/accountinfo/AccountInfoModel", "nics/modules/accountinfo/ChangeOrgController", "nics/modules/accountinfo/ChangeOrgModel", "nics/modules/accountinfo/ChangeOrgViewer"],
        'nics/modules/activeusers': ["nics/modules/ActiveUsersModule", "nics/modules/activeusers/ActiveUsersController", "nics/modules/activeusers/ActiveUsersView", "nics/modules/activeusers/ActiveUsersModel", "nics/modules/activeusers/ChatPanelController", "nics/modules/activeusers/ChatPanel", "nics/modules/activeusers/ChatPanelBuilder", "nics/modules/activeusers/PrivateChatPanelController"],
        'nics/modules/administration': ["nics/modules/administration/OrganizationController", "nics/modules/administration/OrganizationModel", "nics/modules/administration/DDGridView",
                                        "nics/modules/administration/UserController", "nics/modules/administration/UserModel","nics/modules/administration/UserView", "nics/modules/administration/OrganizationViewModel",
                                        "nics/modules/administration/UserLookupController", "nics/modules/administration/UserLookupView",
                                        "nics/modules/administration/OrganizationFormController", "nics/modules/administration/OrganizationForm", "nics/modules/administration/OrganizationView",
                                        "nics/modules/administration/ArchiveController", "nics/modules/administration/ArchiveModel", "nics/modules/administration/ArchiveView",
                                        "nics/modules/administration/announcements/AnnouncementController", "nics/modules/administration/announcements/AnnouncementModel", "nics/modules/administration/announcements/AnnouncementViewModel", "nics/modules/administration/announcements/AnnouncementFormController", "nics/modules/administration/announcements/AnnouncementForm", "nics/modules/administration/announcements/AnnouncementView",
                                        "nics/modules/administration/AdminController", "nics/modules/administration/AdminView",
                                        "nics/modules/administration/RoomManagementController", "nics/modules/administration/RoomManagementView",
                                        "nics/modules/administration/ArchivedIncidentLookupController", "nics/modules/administration/ArchivedIncidentLookup", "nics/modules/AdministrationModule"],
          'nics/modules/collabroom': ["nics/modules/CollabRoomModule", "nics/modules/collabroom/CreateCollabroomWindow", "nics/modules/collabroom/CollabRoomController", "nics/modules/collabroom/CollabRoomViewer", "nics/modules/collabroom/CollabRoomTabController", "nics/modules/collabroom/CollabRoomTabView", "nics/modules/collabroom/SecureRoomController", "nics/modules/collabroom/SecureRoomView"],
          'nics/modules/datalayer': ["nics/modules/DatalayerModule", "nics/modules/datalayer/Button","nics/modules/datalayer/TokenManager", "nics/modules/datalayerstyle/DefaultWfsStyler","nics/modules/datalayerstyle/RawsFeatureStyler","nics/modules/datalayerstyle/WfsStylerFactory",
                                     "nics/modules/datalayer/DatalayerBuilder", "nics/modules/datalayer/RefreshLayerManager", "nics/modules/datalayer/WindowController", "nics/modules/datalayer/Window", "nics/modules/datalayer/ImportWindow", "nics/modules/datalayer/DatasourceImportController", "nics/modules/datalayer/DatasourceImportPanel",
                                     "nics/modules/datalayer/FileImportController", "nics/modules/datalayer/FileImportPanel", "nics/modules/datalayer/ShapeFileImportController", "nics/modules/datalayer/ShapeFileImportPanel", "nics/modules/datalayer/WFSCapabilities", "nics/modules/datalayer/WMSCapabilities", "nics/modules/datalayer/ArcGISCapabilities",
                                     "nics/modules/datalayer/DataWindowController", "nics/modules/datalayer/DataWindow", "nics/modules/datalayer/MapsController", "nics/modules/datalayer/ExportController", "nics/modules/datalayer/ExportView", "nics/modules/datalayer/DatalayerPanelController", "nics/modules/datalayer/DatalayerPanelView", "nics/modules/datalayer/TrackingLocatorWindowController", "nics/modules/datalayer/TrackingLocatorModel",
                                     "nics/modules/datalayer/TrackingLocatorSettingsModel", "nics/modules/datalayer/TrackingLocatorWindow", "nics/modules/datalayer/AVLTrackingRenderer", "nics/modules/datalayer/TrackingWindowController", "nics/modules/datalayer/TrackingWindow", "nics/modules/DatalayerModule"],
          'nics/modules/feature': ["nics/modules/feature/FeatureTopicListener", "nics/modules/feature/FeatureController", "nics/modules/feature/FeatureDetailRenderer", "nics/modules/feature/ShareWorkspaceWindow", "nics/modules/feature/ShareWorkspaceController", "nics/modules/feature/ShareWorkspaceButton", "nics/modules/FeaturePersistence"],
          'nics/modules/feedbackreport': ["nics/modules/FeedbackReportModule", "nics/modules/feedback/FeedbackReportController", "nics/modules/feedback/FeedbackReportView"],
          'nics/modules/incident': ["nics/modules/IncidentModule", "nics/modules/incident/IncidentModel", "nics/modules/incident/IncidentController", "nics/modules/incident/IncidentViewer"],
          'nics/modules/login': ["nics/modules/LoginModule", "nics/modules/login/LoginModel", "nics/modules/login/LoginController", "nics/modules/login/LoginViewer"],
          'nics/modules/mapsynclocationbundle': ["nics/modules/MapSyncLocation", "nics/modules/mapsynclocation/SyncWindowController", "nics/modules/mapsynclocation/SyncWindow"],
          'nics/modules/multiIncidentview': ["nics/modules/MultiIncidentViewModule", "nics/modules/multiincidentview/MIVDetailRenderer", "nics/modules/multiincidentview/MultiIncidentView", "nics/modules/multiincidentview/MultiIncidentViewController", "nics/modules/multiincidentview/MultiIncidentViewModel"],
          'nics/modules/photos': ["nics/modules/PhotosModule", "nics/modules/photos/AddPhotoWindow", "nics/modules/photos/PhotoDetailController", "nics/modules/photos/PhotoDetailView", "nics/modules/photos/PhotoDetailRenderer"],
          'nics/modules/report': ["nics/modules/ReportModule", "nics/modules/report/ReportController", "nics/modules/report/ReportViewer"],//, "nics/modules/report/common/ReportTableController", "nics/modules/report/common/ReportImageModel", "nics/modules/report/common/PieChart", "nics/modules/report/common/PieChart", "nics/modules/report/common/FormVTypes", "nics/modules/report/common/BarChart"],
          'nics/modules/reportdamage': ["nics/modules/report-damage/DamageReportController", "nics/modules/report-damage/DamageReportModel", "nics/modules/report-damage/DamageReportView", "nics/modules/DamageReportModule"],
          'nics/modules/reportexplosives': ["nics/modules/ExplosivesReportModule", "nics/modules/report-explosives/ExplosivesReportView", "nics/modules/report-explosives/ExplosivesReportModel", "nics/modules/report-explosives/ExplosivesReportController", "nics/modules/report-explosives/ExplosivesGraphView", "nics/modules/report-explosives/PieChart", "nics/modules/report-explosives/BarChart", "nics/modules/report-explosives/ExplosivesGraphController"],
          'nics/modules/reportfmag': ["nics/modules/FmagReportModule", "nics/modules/report-fmag/FmagFormModel", "nics/modules/report-fmag/FmagFormController", "nics/modules/report-fmag/FmagFormView", "nics/modules/report-fmag/FmagReportController", "nics/modules/report-fmag/FmagReportModel", "nics/modules/report-fmag/FmagReportView"],
          'nics/modules/reportgeneral': ["nics/modules/GeneralReportModule", "nics/modules/report-general/GeneralReportController", "nics/modules/report-general/GeneralReport/Model", "nics/modules/report-general/GeneralReportView"],
          'nics/modules/reporti215': ["nics/modules/I215ReportModule", "nics/modules/report-i215/I215FormViewModel", "nics/modules/report-i215/I215FormController", "nics/modules/report-i215/I215FormView", "nics/modules/report-i215/I215ReportController", "nics/modules/report-i215/I215ReportModel", "nics/modules/report-i215/I215ReportView"],
          'nics/modules/reportroc': ["nics/modules/RocReportModule", "nics/modules/report-roc/RocFormModel", "nics/modules/report-roc/RocFormController", "nics/modules/report-roc/RocFormView", "nics/modules/report-roc/RocReportController", "nics/modules/report-roc/RocReportModel", "nics/modules/report-roc/RocReportView"],
          //'nics/modules/userprofile': [],
          'nics/modules/whiteboard': ["nics/modules/WhiteboardModule", "nics/modules/whiteboard/ChatLog", "nics/modules/whiteboard/ChatModel", "nics/modules/whiteboard/ChatTopicListener", "nics/modules/whiteboard/ChatProxy", "nics/modules/whiteboard/ChatController", "nics/modules/whiteboard/PresenceModel", "nics/modules/whiteboard/PresenceListener", "nics/modules/whiteboard/PresenceController", "nics/modules/whiteboard/ChatView"],
    },
    shim: {
        "ext": { exports: "Ext"},
        "ext-charts": { exports: "Ext", deps: ["ext"]}
    }
});
require([
    "iweb/CoreModule", "iweb/modules/MapModule",
    "iweb/modules/core-view/View", "iweb/modules/DrawMenuModule", "iweb/modules/GeocodeModule",
    "nics/modules/CollabRoomModule", "nics/modules/IncidentModule",
    "nics/modules/LoginModule", "nics/modules/WhiteboardModule", "nics/modules/ReportModule",
	"nics/modules/DatalayerModule", "nics/modules/ActiveUsersModule",
	"nics/modules/FeaturePersistence", "nics/modules/AdministrationModule",
	"nics/modules/UserProfileModule", "nics/modules/PhotosModule", "nics/modules/PrintModule" ,
	"nics/modules/AccountInfoModule", "nics/modules/MultiIncidentViewModule",
    "nics/modules/FeedbackReportModule", "nics/modules/MapSyncLocation"
    ],

    function(Core, MapModule, View, DrawMenuModule, GeocodeModule,
        CollabRoomModule, IncidentModule,
        LoginModule, WhiteboardModule, ReportModule, DatalayerModule,
        ActiveUsersModule, FeaturePersistence, AdminModule, UserProfile,
        PhotosModule, PrintModule, AccountModule, MultiIncidentModule,
        FeedbackReportModule, MapSyncLocation) {

        "use strict";

        Ext.onReady(function(){

	        Ext.QuickTips.init();

	        //Instantiate the View
	        var view = new View();
	        view.init();
	        Core.init(view);
	        Core.View.showDisconnect(true);

	        //Add Title
	        //Core.View.addToTitleBar([{xtype: 'tbspacer', width: 5},{xtype: "label", html: "<b>Situation Awareness & Collaboration Tool</b>"}]);

	        //Show the Toolbar - Required for drawing menu
	        Core.View.showToolbar(true);

	        Core.EventManager.addListener("iweb.config.loaded", loadModules);

	        //Load each module
	        function loadModules() {

	        	//Add Title
				Core.View.addToTitleBar([{xtype: 'tbspacer', width: 5},{xtype: "label", html: "<b>" +
					((Core.Config.getProperty("main.site.label") || '') ? Core.Config.getProperty("main.site.label") :
					"Situation Awareness &amp; Collaboration Tool" ) + "</b>"}]);

	        	Core.Mediator.getInstance().setCookies(
	        			Core.Config.getProperty("endpoint.rest"), ["openam", "iplanet"]);

	            var MapController = MapModule.load();

	            //Load Modules
				WhiteboardModule.load();
	            IncidentModule.load();
				ReportModule.load();
	            CollabRoomModule.load(CollabRoomModule.getDefaultRoomPresets());
	            DrawMenuModule.load();
	            GeocodeModule.load();
	            AccountModule.load();
	            DatalayerModule.load();

	            //Add Tools Menu after Datalayer Module
	            var button = Core.UIBuilder.buildDropdownMenu("Tools");
	            //Add View to Core
				Core.View.addButtonPanel(button);

				//Set the Tools Menu on the Core for others to add to
				Core.Ext.ToolsMenu = button.menu;

				PrintModule.load();

				//Add Export to Tools Menu
				DatalayerModule.addExport();

	            FeaturePersistence.load();
	            AdminModule.load();

	            LoginModule.load();
	            ActiveUsersModule.load();
	            PhotosModule.load();
	            MultiIncidentModule.load();

                // Add email report to Tools Menu
                FeedbackReportModule.load();

                MapSyncLocation.load();
	        }

	        //Mediator
	        /** default topics
	         ** callback
	         */
	        Core.Mediator.initialize();
        });
    });
