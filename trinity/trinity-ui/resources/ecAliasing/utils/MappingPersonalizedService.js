sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";
		// Very simple page-context personalization
		// persistence service, not for productive use!
		var MappingPersonalizedSrv = {

			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [
					{
					id: "ecMapping-idAccountsCreate-idmatchScore",
					order: 0,
					text: "Match Score",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idmappedPartner",
					order: 1,
					text: "Mapped Partner ID",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idmappedParnerName",
					order: 2,
					text: "Mapped Partner Name",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idreportedName",
					order: 3,
					text: "Reported Name",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idreportedCity",
					order: 4,
					text: "Reported City",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idrepZipCode",
					order: 5,
					text: "Reported Zip Code",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idrepState",
					order: 6,
					text: "Reported State",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idrepCountry",
					order: 7,
					text: "Reported Country",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idIsRepPartner",
					order: 8,
					text: "Is Reporting Partner",
					visible: true
					}
				]
			},

			oResetData: {
				_persoSchemaVersion: "1.0",
				aColumns: [
					{
					id: "ecMapping-idAccountsCreate-idmatchScore",
					order: 0,
					text: "Match Score",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idmappedPartner",
					order: 1,
					text: "Mapped Partner ID",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idmappedParnerName",
					order: 2,
					text: "Mapped Partner Name",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idreportedName",
					order: 3,
					text: "Reported Name",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idreportedCity",
					order: 4,
					text: "Reported City",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idrepZipCode",
					order: 5,
					text: "Reported Zip Code",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idrepState",
					order: 6,
					text: "Reported State",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idrepCountry",
					order: 7,
					text: "Reported Country",
					visible: true
					},
					{
					id: "ecMapping-idAccountsCreate-idIsRepPartner",
					order: 8,
					text: "Is Reporting Partner",
					visible: true
					}
				]
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

		return MappingPersonalizedSrv;

	});