sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Sorter",
	"sap/m/library",
	"productmapping/utils/PrdPersonalizedService",
	"sap/ui/model/Filter",
	"sap/m/TablePersoController"
], function (Controller, Sorter, mlibrary, DemoPersoService, Filter, TablePersoController) {
	var ResetAllMode = mlibrary.ResetAllMode;
	var prodMappingObj = {
		"partId": "partner_id",
		"partnerNameId": "partner/name",
		"RPid": "reported_product_id",
		"RPdes": "reported_product_description",
		"RPtype": "reported_product_type",
		"AstoEmp": "assigned_to_empid",
		"crtOn": "created_on",
		"crtBy": "created_by",
		"chnOn": "changed_on",
		"chnBy": "changed_by",
		"idcountry": "partner/country/country_name",
		"idregion": "partner/country/region_id",
		"idsubreg": "partner/country/sub_region_id",
		"onHldFlg": "on_hold"
	};
	return Controller.extend("productmapping.controller.BaseController", {
		//////filter and sort
		onClick: function (oID) {
			var that = this;
			$('#' + oID).click(function (oEvent) { //Attach Table Header Element Event
				var oTarget = oEvent.currentTarget; //Get hold of Header Element
				var oIndex = oTarget.id.split('--')[2]; //Get the column Index
				that.getOwnerComponent().getModel("LocalDataModel").setProperty("/inputVal", "");
				that.getOwnerComponent().getModel("LocalDataModel").setProperty("/bindingValue", prodMappingObj[oIndex]);
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

		onExit: function (oEvent) {
			this._oTPC.destroy();
		},

		onPersoButtonPressed: function (oEvent) { // Personalized Table columns. Show hide columns and shuffle columns.
			// this._oMappingPer = null;
			// this._oTPC = null;
			if (this._oTPC) {
				this._oTPC.destroy();
			}

			this._oTPC = new sap.m.TablePersoController({
				table: this.byId("masterList"),
				//specify the first part of persistence
				componentName: "productMapping",
				resetAllMode: ResetAllMode.ServiceReset,
				persoService: DemoPersoService
			}).activate();
			// init and activate controller for personalization of table
			this._oTPC.openDialog();

		},
		onTablePersoRefresh: function (oEvent) {

			DemoPersoService.resetPersData().done(
				function () {
					this._oTPC.refresh();
				}.bind(this)
			);

		},
		onTableGrouping: function (oEvent) {

			this._oTPC.setHasGrouping(oEvent.getSource().getSelected());

		},
		// on logout from page
		onPressLogout: function () {
			window.location.replace("/my/logout");
		}
	});
});