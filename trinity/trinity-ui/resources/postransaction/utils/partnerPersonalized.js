sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";
		// Very simple page-context personalization
		// persistence service, not for productive use!
		var partnerPersonalized = {

			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [
					{
						id: "transaction-masterList-idprnr",
						order: 0,
						text: "Partner ID",
						visible: true
					},
					{
						id: "transaction-masterList-idSesion",
						order: 1,
						text: "Session ID",
						visible: true
					},
					{
						id: "transaction-masterList-idFilename",
						order: 3,
						text: "File Name",
						visible: false
					},
					{
						id: "transaction-masterList-idFileCreationTime",
						order: 4,
						text: "File Creation Time",
						visible: false
					},
					
					{
						id: "transaction-masterList-idInvoiceno",
						order: 5,
						text: "Invoice No",
						visible: true
					},
					{
						id: "transaction-masterList-idInvoiceLineItm",
						order: 6,
						text: "Invoice Line Item",
						visible: true
					},
					{
						id: "transaction-masterList-idActiveFlg",
						order: 7,
						text: "Active Flag",
						visible: true
					}
				]
			},

			oResetData: {
				_persoSchemaVersion: "1.0",
				aColumns: [
					{
						id: "transaction-masterList-idprnr",
						order: 0,
						text: "Partner ID",
						visible: true
					},
					{
						id: "transaction-masterList-idSesion",
						order: 1,
						text: "Session ID",
						visible: true
					},
					{
						id: "transaction-masterList-idFilename",
						order: 3,
						text: "File Name",
						visible: false
					},
					{
						id: "transaction-masterList-idFileCreationTime",
						order: 4,
						text: "File Creation Time",
						visible: false
					},
					
					{
						id: "transaction-masterList-idInvoiceno",
						order: 5,
						text: "Invoice No",
						visible: true
					},
					{
						id: "transaction-masterList-idInvoiceLineItm",
						order: 6,
						text: "Invoice Line Item",
						visible: true
					},
					{
						id: "transaction-masterList-idActiveFlg",
						order: 7,
						text: "Active Flag",
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

		return partnerPersonalized;

	});