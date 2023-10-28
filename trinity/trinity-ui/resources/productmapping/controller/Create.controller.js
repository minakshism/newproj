sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/EventBus",
	"partner/model/formatter",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/FilterOperator"
], function (Controller, MessageToast, MessageBox, EventBus, formatter, Fragment, Filter, JSONModel, FilterOperator) {
	"use strict";
	const batchGroupId = "myUpdateGroupId";
	return Controller.extend("partner.controller.Create", {
		formatter: formatter,
		onInit: function () {

		},
		onSave: function () {

		}

	});
});