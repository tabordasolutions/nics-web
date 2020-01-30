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
requirejs.config({
	paths: {
		'd3': 'lib/d3.v3'
	}
});

define(
    [
        'iweb/CoreModule',
        './report/ReportViewer',
        './GeneralReportModule',
        './DamageReportModule',
        './RocReportModule',
        './FmagReportModule',
        './I215ReportModule',
        'iweb/modules/MapModule'
    ],

    function(Core, ReportViewer, GeneralReportModule, DamageReportModule,
            RocReportModule, FmagReportModule, I215ReportModule,  MapModule) {


        var ReportModule = function() {};
        var buttonStyle = 'nontb_style';

        ReportModule.prototype.load = function() {
            var reportViewer = Ext.create('modules.report.ReportViewer');

            RocReportModule.load();

            setTimeout(function(){
                GeneralReportModule.load();
            }, 2000);
            setTimeout(function(){
                DamageReportModule.load();
            }, 2000);
            setTimeout(function(){
                I215ReportModule.load();
            }, 2000);
            setTimeout(function(){
                FmagReportModule.load();
            }, 2000);

            // Enables ROC by default. All other report types are enabled when user joins an incident
            Core.View.addToSidePanel(reportViewer);
            var rocButton = Ext.create('Ext.Button', {
                text: 'ROC',
                baseCls: buttonStyle,
                handler: function() {
                    Core.View.showSidePanel();
                    if(reportViewer.getActiveTab().title != 'ROC') {
                        var rocElement = reportViewer.items.items.find(function(element) {
                            return element.title == 'ROC';
                        });
                        reportViewer.setActiveItem(rocElement);
                    }
                    Core.View.setActiveTabOnSidePanel(reportViewer);
                }
            });
            Core.View.addToTitleBar([rocButton, {xtype: 'tbspacer', width: 15}]);
        };

        return new ReportModule();
    }
);