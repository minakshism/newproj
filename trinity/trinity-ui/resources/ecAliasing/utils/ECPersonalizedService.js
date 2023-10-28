sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";
		// Very simple page-context personalization
		// persistence service, not for productive use!
		var DemoPersoService = {

			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "ecAliasing-list-rpPrIdCol",
					order: 0,
					text: "Reporter ID",
					visible: true
				}, {
					id: "ecAliasing-list-rpPrNmCol",
					order: 1,
					text: "RP Name",
					visible: true
				}, {
					id: "ecAliasing-list-rpRegCol",
					order: 2,
					text: "RP Region",
					visible: true
				}, {
					id: "ecAliasing-list-rpSubRegCol",
					order: 3,
					text: "RP Sub-region",
					visible: false
				}, {
					id: "ecAliasing-list-rpEcNmCol",
					order: 4,
					text: "RP EC name",
					visible: true
				}, {
					id: "ecAliasing-list-rpAdFstCol",
					order: 5,
					text: "RP EC Address 1",
					visible: false
				}, {
					id: "ecAliasing-list-rpAdSecCol",
					order: 6,
					text: "RP EC Address 2",
					visible: false
				}, {
					id: "ecAliasing-list-rpCityCol",
					order: 7,
					text: "City",
					visible: true
				}, {
					id: "ecAliasing-list-rpStateCol",
					order: 8,
					text: "State",
					visible: true
				}, {
					id: "ecAliasing-list-rpCountryCol",
					order: 9,
					text: "Country",
					visible: true
				}, {
					id: "ecAliasing-list-rpPsCodCol",
					order: 10,
					text: "Postal Code",
					visible: true
				}, {
					id: "ecAliasing-list-rpIsPerCol",
					order: 11,
					text: "Is Person",
					visible: true
				}, {
					id: "ecAliasing-list-rpEndCustCol",
					order: 12,
					text: "Mapped EC ID",
					visible: true
				}, 
				{
					id: "ecAliasing-list-mappedEcNameCol",
					order: 13,
					text: "Mapped EC Name",
					visible: true
					
				},{
					id: "ecAliasing-list-mappedEcCountryCol",
					order: 14,
					text: "Mapped EC Country",
					visible: true
					
				},{
					id: "ecAliasing-list-rpOnHoldCol",
					order: 15,
					text: "On Hold",
					visible: true
				}, {
					id: "ecAliasing-list-rpAssignedtoCol",
					order: 16,
					text: "Assigned To",
					visible: true
				}, 
				
				{
					id: "ecAliasing-list-createdOntCol",
					order: 17,
					text: "Created On",
					visible: false
				}, 
				
				{
					id: "ecAliasing-list-changedOntCol",
					order: 18,
					text: "Changed On",
					visible: false
				}, 
				
				{
					id: "ecAliasing-list-changedbytCol",
					order: 19,
					text: "Changed By",
					visible: false
				}, 
				{
					id: "ecAliasing-list-isEnterpriseCol",
					order: 20,
					text: "Is Enterprise",
					visible: false
				}]
			},

			oResetData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "ecAliasing-list-rpPrIdCol",
					order: 0,
					text: "Reporter ID",
					visible: true
				}, {
					id: "ecAliasing-list-rpPrNmCol",
					order: 1,
					text: "RP Name",
					visible: true
				}, {
					id: "ecAliasing-list-rpRegCol",
					order: 2,
					text: "RP Region",
					visible: true
				}, {
					id: "ecAliasing-list-rpSubRegCol",
					order: 3,
					text: "RP Sub-region",
					visible: false
				}, {
					id: "ecAliasing-list-rpEcNmCol",
					order: 4,
					text: "RP EC name",
					visible: true
				}, {
					id: "ecAliasing-list-rpAdFstCol",
					order: 5,
					text: "RP EC Address 1",
					visible: false
				}, {
					id: "ecAliasing-list-rpAdSecCol",
					order: 6,
					text: "RP EC Address 2",
					visible: false
				}, {
					id: "ecAliasing-list-rpCityCol",
					order: 7,
					text: "City",
					visible: true
				}, {
					id: "ecAliasing-list-rpStateCol",
					order: 8,
					text: "State",
					visible: true
				}, {
					id: "ecAliasing-list-rpCountryCol",
					order: 9,
					text: "Country",
					visible: true
				}, {
					id: "ecAliasing-list-rpPsCodCol",
					order: 10,
					text: "Postal Code",
					visible: true
				}, {
					id: "ecAliasing-list-rpIsPerCol",
					order: 11,
					text: "Is Person",
					visible: true
				}, {
					id: "ecAliasing-list-rpEndCustCol",
					order: 12,
					text: "Mapped EC ID",
					visible: true
				}, 
				{
					id: "ecAliasing-list-mappedEcNameCol",
					order: 13,
					text: "Mapped EC Name",
					visible: true
					
				},{
					id: "ecAliasing-list-mappedEcCountryCol",
					order: 14,
					text: "Mapped EC Country",
					visible: true
					
				},{
					id: "ecAliasing-list-rpOnHoldCol",
					order: 15,
					text: "On Hold",
					visible: true
				}, {
					id: "ecAliasing-list-rpAssignedtoCol",
					order: 16,
					text: "Assigned To",
					visible: true
				}, 
				
				{
					id: "ecAliasing-list-createdOntCol",
					order: 17,
					text: "Created On",
					visible: false
				}, 
				
				{
					id: "ecAliasing-list-changedOntCol",
					order: 18,
					text: "Changed On",
					visible: false
				}, 
				
				{
					id: "ecAliasing-list-changedbytCol",
					order: 19,
					text: "Changed By",
					visible: false
				}, 
				{
					id: "ecAliasing-list-isEnterpriseCol",
					order: 20,
					text: "Is Enterprise",
					visible: false
				}]
			},

			getPersData: function () {
				var oDeferred = new jQuery.Deferred();
				if (!this._oBundle) {
					this._oBundle = this.oData;
				}
				oDeferred.resolve(this._oBundle);
				return oDeferred.promise();
			},

			setPersData: function (oBundle) {
				var oDeferred = new jQuery.Deferred();
				this._oBundle = oBundle;
				oDeferred.resolve();
				return oDeferred.promise();
			},

			getResetPersData: function () {
				var oDeferred = new jQuery.Deferred();
				setTimeout(function () {
					oDeferred.resolve(this.oResetData);
				}.bind(this), 2000);
				return oDeferred.promise();
			},

			resetPersData: function () {
				var oDeferred = new jQuery.Deferred();
				this._oBundle = this.oResetData;
				oDeferred.resolve();
				return oDeferred.promise();
			}
		};

		return DemoPersoService;

	});