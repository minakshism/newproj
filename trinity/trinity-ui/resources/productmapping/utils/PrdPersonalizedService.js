sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";
		// Very simple page-context personalization
		// persistence service, not for productive use!
		var DemoPersoService = {

			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "productMapping-masterList-RPid",
					order: 0,
					text: "Reported Product ID",
					visible: true
				}, {
					id: "productMapping-masterList-partId",
					order: 1,
					text: "Partner ID",
					visible: true
				}, {
					id: "productMapping-masterList-RPtype",
					order: 2,
					text: "Reported Product Type",
					visible: true
				}, {
					id: "productMapping-masterList-RPdes",
					order: 3,
					text: "Reported Product Description",
					visible: true
				}, {
					id: "productMapping-masterList-AstoEmp",
					order: 4,
					text: "Assigned To Empid",
					visible: true
				}, {
					id: "productMapping-masterList-crtOn",
					order: 5,
					text: "Created On",
					visible: false
				}, {
					id: "productMapping-masterList-crtBy",
					order: 6,
					text: "Created By",
					visible: false
				}, {
					id: "productMapping-masterList-chnOn",
					order: 7,
					text: "Changed On",
					visible: false
				}, {
					id: "productMapping-masterList-chnBy",
					order: 8,
					text: "Changed By",
					visible: false
				}, {
					id: "partnerpers-masterList-idcountry",
					order: 9,
					text: "Country",
					visible: false
				}, {
					id: "partnerpers-masterList-idregion",
					order: 10,
					text: "Region",
					visible: true
				}, {
					id: "partnerpers-masterList-idsubreg",
					order: 11,
					text: "Sub Region",
					visible: true
				}, {
					id: "productMapping-masterList-onHldFlg",
					order: 12,
					text: "On Hold Flag",
					visible: true
				}]
			},

			oResetData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "productMapping-masterList-RPid",
					order: 0,
					text: "Reported Product ID",
					visible: true
				}, {
					id: "productMapping-masterList-partId",
					order: 1,
					text: "Partner ID",
					visible: true
				}, {
					id: "productMapping-masterList-RPtype",
					order: 2,
					text: "Reported Product Type",
					visible: true
				}, {
					id: "productMapping-masterList-RPdes",
					order: 3,
					text: "Reported Product Description",
					visible: true
				}, {
					id: "productMapping-masterList-AstoEmp",
					order: 4,
					text: "Assigned To Empid",
					visible: true
				}, {
					id: "productMapping-masterList-crtOn",
					order: 5,
					text: "Created On",
					visible: false 
				}, {
					id: "productMapping-masterList-crtBy",
					order: 6,
					text: "Created By",
					visible: false 
				}, {
					id: "productMapping-masterList-chnOn",
					order: 7,
					text: "Changed On",
					visible: false
				}, {
					id: "productMapping-masterList-chnBy",
					order: 8,
					text: "Changed By",
					visible: false 
				}, {
					id: "partnerpers-masterList-idcountry",
					order: 9,
					text: "Country",
					visible: false
				}, {
					id: "partnerpers-masterList-idregion",
					order: 10,
					text: "Region",
					visible: true
				}, {
					id: "partnerpers-masterList-idsubreg",
					order: 11,
					text: "Sub Region",
					visible: true
				}, {
					id: "productMapping-masterList-onHldFlg",
					order: 12,
					text: "On Hold Flag",
					visible: true
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