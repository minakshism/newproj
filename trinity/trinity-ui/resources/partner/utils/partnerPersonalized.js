sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";
		// Very simple page-context personalization
		// persistence service, not for productive use!
		var partnerPerService = {

			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [
					{
						id: "partnerpers-masterList-idprnr",
						order: 0,
						text: "Partner ID",
						visible: true
					},
					{
						id: "partnerpers-masterList-idptname",
						order: 1,
						text: "Partner Name",
						visible: true
					},
					{
						id: "partnerpers-masterList-idcity",
						order: 3,
						text: "City",
						visible: false
					},
					{
						id: "partnerpers-masterList-idcountry",
						order: 4,
						text: "Country",
						visible: false
					},
					
					{
						id: "partnerpers-masterList-idregion",
						order: 5,
						text: "Region",
						visible: true
					},
					{
						id: "partnerpers-masterList-idsubreg",
						order: 6,
						text: "Sub Region",
						visible: true
					},
					{
						id: "partnerpers-masterList-idprodDate",
						order: 7,
						text: "Production Date",
						visible: true
					},
					{
						id: "partnerpers-masterList-idonbrdDate",
						order: 8,
						text: "RP Onboard Date",
						visible: true
					},
					{
						id: "partnerpers-masterList-idconsumer",
						order: 9,
						text: "Consumer",
						visible: false
					},
					{
						id: "partnerpers-masterList-identrprise",
						order: 10,
						text: "Enterprise",
						visible: false
					},
					{
						id: "partnerpers-masterList-idconsnvsales",
						order: 11,
						text: "Consumer NV Sales",
						visible: false
					},
					{
						id: "partnerpers-masterList-identnvsales",
						order: 12,
						text: "Enterprise NV Sales",
						visible: false
					},
					{
						id: "partnerpers-masterList-idstatus",
						order: 13,
						text: "Status",
						visible: true
					}
				]
			},

			oResetData: {
				_persoSchemaVersion: "1.0",
				aColumns: [
					{
						id: "partnerpers-masterList-idprnr",
						order: 0,
						text: "Partner ID",
						visible: true
					},
					{
						id: "partnerpers-masterList-idptname",
						order: 1,
						text: "Partner Name",
						visible: true
					},
					{
						id: "partnerpers-masterList-idcity",
						order: 3,
						text: "City",
						visible: false
					},
					{
						id: "partnerpers-masterList-idcountry",
						order: 4,
						text: "Country",
						visible: false
					},
					
					{
						id: "partnerpers-masterList-idregion",
						order: 5,
						text: "Region",
						visible: true
					},
					{
						id: "partnerpers-masterList-idsubreg",
						order: 6,
						text: "Sub Region",
						visible: true
					},
					{
						id: "partnerpers-masterList-idprodDate",
						order: 7,
						text: "Production Date",
						visible: true
					},
					{
						id: "partnerpers-masterList-idonbrdDate",
						order: 8,
						text: "RP Onboard Date",
						visible: true
					},
					{
						id: "partnerpers-masterList-idconsumer",
						order: 9,
						text: "Consumer",
						visible: false
					},
					{
						id: "partnerpers-masterList-identrprise",
						order: 10,
						text: "Enterprise",
						visible: false
					},
					{
						id: "partnerpers-masterList-idconsnvsales",
						order: 11,
						text: "Consumer NV Sales",
						visible: false
					},
					{
						id: "partnerpers-masterList-identnvsales",
						order: 12,
						text: "Enterprise NV Sales",
						visible: false
					},
					{
						id: "partnerpers-masterList-idstatus",
						order: 13,
						text: "Status",
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

		return partnerPerService;

	});