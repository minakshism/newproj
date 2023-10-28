sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";
		// Very simple page-context personalization
		// persistence service, not for productive use!
		var CpuPersonalized = {

			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "cpuMaster-idCpuList-sysModelNum",
					order: 0,
					text: "CPU Model Number",
					visible: true
				},
				{
					id: "cpuMaster-idCpuList-idCpuBrand",
					order: 1,
					text: "CPU Brand",
					visible: true
				},
				{
					id: "cpuMaster-idCpuList-idCpuBrandGrp",
					order: 2,
					text: "CPU Brand Group",
					visible: true
				},
				{
					id: "cpuMaster-idCpuList-idCpuCoreFreq",
					order: 3,
					text: "CPU Core Frequency",
					visible: true
				},
				{
					id: "cpuMaster-idCpuList-idCpuCore",
					order: 4,
					text: "CPU Core",
					visible: true
				},{
					id: "cpuMaster-idCpuList-idCpuManfctr",
					order: 5,
					text: "CPU Manufacturer",
					visible: true
				},{
					id: "cpuMaster-idCpuList-idCpuArchGrp",
					order: 6,
					text: "CPU Architecture Group",
					visible: true
				},{
					id: "cpuMaster-idCpuList-idCpuClass",
					order: 7,
					text: "CPU Class",
					visible: true
				}]
			},

			oResetData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "cpuMaster-idCpuList-sysModelNum",
					order: 0,
					text: "CPU Model Number",
					visible: true
				},
				{
					id: "cpuMaster-idCpuList-idCpuBrand",
					order: 1,
					text: "CPU Brand",
					visible: true
				},
				{
					id: "cpuMaster-idCpuList-idCpuBrandGrp",
					order: 2,
					text: "CPU Brand Group",
					visible: true
				},
				{
					id: "cpuMaster-idCpuList-idCpuCoreFreq",
					order: 3,
					text: "CPU Core Frequency",
					visible: true
				},
				{
					id: "cpuMaster-idCpuList-idCpuCore",
					order: 4,
					text: "CPU Core",
					visible: true
				},{
					id: "cpuMaster-idCpuList-idCpuManfctr",
					order: 5,
					text: "CPU Manufacturer",
					visible: true
				},{
					id: "cpuMaster-idCpuList-idCpuArchGrp",
					order: 6,
					text: "CPU Architecture Group",
					visible: true
				},{
					id: "cpuMaster-idCpuList-idCpuClass",
					order: 7,
					text: "CPU Class",
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

		return CpuPersonalized;

	});