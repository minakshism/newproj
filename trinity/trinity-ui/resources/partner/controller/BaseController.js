sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/Sorter",
	"sap/m/library",
	"sap/ui/model/Filter",
	"sap/m/TablePersoController",
	"partner/utils/partnerPersonalized"
], function (Controller, MessageToast, Sorter, mlibrary, Filter, TablePersoController, partnerPerService) {
	"use strict";
	var ResetAllMode = mlibrary.ResetAllMode;
	var partnerObj = {
		"idprnr": "id",
		"idptname" : "name",
		"idcity": "city",
		"idcountry" :"country/country_name",
		"idregion" :"country/region/id",
		"idsubreg" :"country/sub_region/description",
		"idprodDate" : "production_date",
		"idonbrdDate" : "rp_onboarding_date",
		"idconsumer" : "is_consumer",
		"identrprise" : "is_npn",
		"idconsnvsales" : "",
		"identnvsales" : "",
		"idstatus" :"active"
	};
	return Controller.extend("partner.controller.BaseController", {
			_PartnerPer:null,
			showMessage: function (sMsg, sPos, sType) {
			if (sPos === "center") {
				MessageToast.show(sMsg, {
					duration: 5000,
					my: "center center",
					at: "center center"
				});
			} else if (sPos === "bottom") {
				MessageToast.show(sMsg, {
					duration: 5000
				});
			}
			if (sType === "S") {
				var sColor = "#007833";
			} else {
				sColor = "#cc1919";
			}

			var oMessageToastDOM = $("#content").parent().find(".sapMMessageToast");
			oMessageToastDOM.css("background", sColor);
			oMessageToastDOM.css("width", "17rem");
		},
			//////filter and sort
		onClick: function (oID) {
			var that = this;
			$('#' + oID).click(function (oEvent) { //Attach Table Header Element Event
				var oTarget = oEvent.currentTarget; //Get hold of Header Element
				var oIndex = oTarget.id.split('--')[2]; //Get the column Index
				that.getOwnerComponent().getModel("LocalDataModel").setProperty("/inputVal", "");
				that.getOwnerComponent().getModel("LocalDataModel").setProperty("/bindingValue", partnerObj[oIndex]);
				that._oResponsivePopover.openBy(oTarget);
			});
		},

		onChange: function (oEvent) {
			var oValue = oEvent.getParameter("value");
			var oTable = this.getView().byId("masterList");
			var oBindingPath = this.getOwnerComponent().getModel("LocalDataModel").getProperty("/bindingValue"); //Get Hold of Model Key value that was saved
			var aFilters = [];
			var oFilter = new Filter(oBindingPath, "EQ", oValue);
			aFilters.push(oFilter);

			var oItems = oTable.getBinding("items");
			oItems.filter(aFilters, "Application");
			this._oResponsivePopover.close();
		},
		// sort Ascending
		onAscending: function () {
			var oTable = this.getView().byId("masterList");
			var oItems = oTable.getBinding("items");
			var oBindingPath = this.getOwnerComponent().getModel("LocalDataModel").getProperty("/bindingValue");
			var oSorter = new Sorter(oBindingPath, false);
			oItems.sort(oSorter);
			this._oResponsivePopover.close();
		},
		//sort descending
		onDescending: function () {
			var oTable = this.getView().byId("masterList");
			var oItems = oTable.getBinding("items");
			var oBindingPath = this.getOwnerComponent().getModel("LocalDataModel").getProperty("/bindingValue");
			var oSorter = new Sorter(oBindingPath, true);
			oItems.sort(oSorter);
			this._oResponsivePopover.close();
		},

		onOpen: function (oEvent) {
			//On Popover open focus on Input control
			var oPopover = sap.ui.getCore().byId(oEvent.getParameter("id"));
			var oPopoverContent = oPopover.getContent()[0];
			var oCustomListItem = oPopoverContent.getItems()[2];
			var oCustomContent = oCustomListItem.getContent()[0];
			var oInput = oCustomContent.getItems()[1];
			oInput.focus();
			oInput.$().find('.sapMInputBaseInner')[0].select();
		},

		onExit: function () {
			this._PartnerPer.destroy();
		},

		onPersoButtonPressed: function () { // Personalized Table columns. Show hide columns and shuffle columns.
				
				this._PartnerPer.openDialog();
			
		},
		onTablePersoRefresh: function (oEvent) {
				partnerPerService.resetPersData().done(
					function () {
						this._PartnerPer.refresh();
					}.bind(this)
				);
		},
		onTableGrouping: function (oEvent) {
			this._PartnerPer.setHasGrouping(oEvent.getSource().getSelected());
			
		},
			// on logout from page
		onPressLogout: function () {
			window.location.replace("/my/logout");
		}
	
	});
});