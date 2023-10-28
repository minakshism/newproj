sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("launchpad.countrycard.ComponentCard", {

		onInit: function () {
			var mapImageUrl = sap.ui.require.toUrl("launchpad/countrycard/images/world.gif");
			this.getView().setModel(new JSONModel({
				mapImageUrl: mapImageUrl
			}));
		}

	});
});