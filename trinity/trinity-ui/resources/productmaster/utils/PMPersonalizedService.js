sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";
		// Very simple page-context personalization
		// persistence service, not for productive use!
		var DemoPersoService = {

			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "productMaster-masterList-sysModelNum",
					order: 0,
					text: "SYS Model Number",
					visible: true
				}, {
					id: "productMaster-masterList-manufct",
					order: 1,
					text: "Manufacturer",
					visible: true
				}, {
					id: "productMaster-masterList-gpuModelNum",
					order: 2,
					text: "GPU Model Number",
					visible: true
				}, {
					id: "productMaster-masterList-cpuModelNum",
					order: 3,
					text: "CPU Model Number",
					visible: true
				}, {
					id: "productMaster-masterList-platform",
					order: 4,
					text: "Platform",
					visible: true
				}, {
					id: "productMaster-masterList-sysComptr",
					order: 5,
					text: "SYS Competitor",
					visible: true
				}, {
					id: "productMaster-masterList-sysType",
					order: 6,
					text: "SYS Type",
					visible: true
				}]
			},

			oResetData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "productMaster-masterList-sysModelNum",
					order: 0,
					text: "SYS Model Number",
					visible: true
				}, {
					id: "productMaster-masterList-manufct",
					order: 1,
					text: "Manufacturer",
					visible: true
				}, {
					id: "productMaster-masterList-gpuModelNum",
					order: 2,
					text: "GPU Model Number",
					visible: true
				}, {
					id: "productMaster-masterList-cpuModelNum",
					order: 3,
					text: "CPU Model Number",
					visible: true
				}, {
					id: "productMaster-masterList-platform",
					order: 4,
					text: "Platform",
					visible: true
				}, {
					id: "productMaster-masterList-sysComptr",
					order: 5,
					text: "SYS Competitor",
					visible: true
				}, {
					id: "productMaster-masterList-sysType",
					order: 6,
					text: "SYS Type",
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