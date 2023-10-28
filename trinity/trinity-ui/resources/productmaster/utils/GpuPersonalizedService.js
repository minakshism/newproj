sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";
		// Very simple page-context personalization
		// persistence service, not for productive use!
		var GpuPeronalized = {

			oData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "gpuMaster-idGpuList-idGpuModelNo",
					order: 0,
					text: "GPU Model Number",
					visible: true
				}, {
					id: "gpuMaster-idGpuList-idGpuModelDesc",
					order: 1,
					text: "GPU Model Description",
					visible: true
				}, {
					id: "gpuMaster-idGpuList-idGpuCurModNo",
					order: 2,
					text: "GPU Current Model No.",
					visible: true
				}, {
					id: "gpuMaster-idGpuList-idModelNo2",
					order: 3,
					text: "GPU Model No. 2",
					visible: true
				}, {
					id: "gpuMaster-idGpuList-idGpuGfSubSeg",
					order: 4,
					text: "GPU GF Sub Segment",
					visible: true
				}, {
					id: "gpuMaster-idGpuList-idGpuClass",
					order: 5,
					text: "GPU Class",
					visible: true
				}]
			},

			oResetData: {
				_persoSchemaVersion: "1.0",
				aColumns: [{
					id: "gpuMaster-idGpuList-idGpuModelNo",
					order: 0,
					text: "GPU Model Number",
					visible: true
				}, {
					id: "gpuMaster-idGpuList-idGpuModelDesc",
					order: 1,
					text: "GPU Model Description",
					visible: true
				}, {
					id: "gpuMaster-idGpuList-idGpuCurModNo",
					order: 2,
					text: "GPU Current Model No.",
					visible: true
				}, {
					id: "gpuMaster-idGpuList-idModelNo2",
					order: 3,
					text: "GPU Model No. 2",
					visible: true
				}, {
					id: "gpuMaster-idGpuList-idGpuGfSubSeg",
					order: 4,
					text: "GPU GF Sub Segment",
					visible: true
				}, {
					id: "gpuMaster-idGpuList-idGpuClass",
					order: 5,
					text: "GPU Class",
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

		return GpuPeronalized;

	});