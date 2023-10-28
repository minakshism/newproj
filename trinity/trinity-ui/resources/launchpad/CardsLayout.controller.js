sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/m/MessageToast",
	"sap/ui/integration/library",
	"sap/ui/core/Fragment"
], function (Controller, JSONModel, DateFormat, MessageToast, integrationLibrary, Fragment) {
	"use strict";

	return Controller.extend("launchpad.CardsLayout", {

		onInit: function () {
			$.get({
				url: "/trinity/api/UserScopes",
				success: $.proxy(function (data) {
					var sselfId = data.value[0].empid;
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/empid", sselfId);
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/knownas", data.value[0].knownas);
					var ssAvatar = data.value[0].first_name.charAt(0) + data.value[0].last_name.charAt(0);
					this.getOwnerComponent().getModel("LocalDataModel").setProperty("/avatarText", ssAvatar);

				}, this),
				error: function (error) {
					console.log(error);
				}
			});

			var cardManifests = new JSONModel(),
				componentCardUrl = sap.ui.require.toUrl("launchpad/countrycard/manifest.json"),
				homeIconUrl = sap.ui.require.toUrl("launchpad/images/logo.png"),
				date = DateFormat.getDateInstance({
					style: "long"
				}).format(new Date());

			cardManifests.loadData(sap.ui.require.toUrl("launchpad/model/cardManifests.json"));

			this.getView().setModel(cardManifests, "manifests");
			this.getView().setModel(new JSONModel({
				componentCardUrl: componentCardUrl,
				homeIconUrl: homeIconUrl,
				date: date
			}));
		},

		onAction: function (oEvent) {
			if (oEvent.getParameter("type") === integrationLibrary.CardActionType.Navigation) {
				MessageToast.show("URL: " + oEvent.getParameter("parameters").url);
			}
		},

		// onPressAvatar : function(oEvent){
		// 	var oEventSource = oEvent.getParameter("eventSource"),
		// 		oView = this.getView(),
		// 		oBindingInfo;
		// 	if (!this._pIndividualPopover) {
		// 			this._pIndividualPopover = Fragment.load({
		// 				id: oView.getId(),
		// 				name: "launchpad.fragments.individualPopover",
		// 				controller: this
		// 			}).then(function(oIndividuaLPopover) {
		// 				oView.addDependent(oIndividuaLPopover);
		// 				return oIndividuaLPopover;
		// 			});
		// 		}

		// 		// this._pIndividualPopover.then(function(oIndividuaLPopover){
		// 		// 	this.oIndividualModel.setData(this._getAvatarModel(oBindingInfo, oEventSource));
		// 		// 	oIndividuaLPopover.openBy(oEventSource).addStyleClass("sapFAvatarGroupPopover");
		// 		// }.bind(this));
		// },

		onOpenPopover: function (oEvent) {
			var oButton = oEvent.getSource(),
				oView = this.getView();

			// create popover
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "launchpad.fragments.popover",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}

			this._pPopover.then(function (oPopover) {
				oPopover.openBy(oButton);
			});
		},

		// on logout from page
		onPressLogout: function () {
			window.location.replace("/my/logout");
		}

	});
});