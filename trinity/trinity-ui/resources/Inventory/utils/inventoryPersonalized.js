sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";
		// Very simple page-context personalization
		// persistence service, not for productive use!
		var inventoryPersonalized = {

			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [
					{
						id: "inventory-masterList-idinventory",
						order: 0,
						text: "inventory ID",
						visible: true
					},
					{
						id: "inventory-masterList-idsession",
						order: 1,
						text: "Session ID",
						visible: true
					},
					{
						id: "inventory-masterList-idcreationdt",
						order: 3,
						text: "Creation Date",
						visible: true
					},
					{
						id: "inventory-masterList-idProductno",
						order: 4,
						text: "Product No.",
						visible: true
					},
					
					{
						id: "inventory-masterList-idRpPrtnr",
						order: 5,
						text: "Reporting Partner ID",
						visible: true
					}
				]
			},

			oResetData: {
				_persoSchemaVersion: "1.0",
				aColumns: [
					{
						id: "inventory-masterList-idinventory",
						order: 0,
						text: "inventory ID",
						visible: true
					},
					{
						id: "inventory-masterList-idsession",
						order: 1,
						text: "Session ID",
						visible: true
					},
					{
						id: "inventory-masterList-idcreationdt",
						order: 3,
						text: "Creation Date",
						visible: true
					},
					{
						id: "inventory-masterList-idProductno",
						order: 4,
						text: "Product No.",
						visible: true
					},
					
					{
						id: "inventory-masterList-idRpPrtnr",
						order: 5,
						text: "Reporting Partner ID",
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

		return inventoryPersonalized;

	});