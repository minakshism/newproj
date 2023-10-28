sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Sorter",
	"sap/m/library",
	"nv/ecAliasing/utils/ECPersonalizedService",
	"sap/ui/model/Filter",
	"nv/ecAliasing/utils/MappingPersonalizedService",
	"sap/m/TablePersoController",
	"sap/ui/export/library",
	"sap/ui/export/Spreadsheet"
], function (Controller, Sorter, mlibrary, DemoPersoService, Filter, MappingPersoService, TablePersoController, exportLibrary,
	Spreadsheet) {
	var ResetAllMode = mlibrary.ResetAllMode;
	var EdmType = exportLibrary.EdmType;
	var that;
	var ncount=0;
	var ecMappingObj = {
		"rpPrIdCol": "reporting_partner_id",
		"rpPrNmCol": "reporting_partner/name",
		"rpRegCol": "reporting_partner/country/region_id",
		"rpSubRegCol" : "reporting_partner/country/sub_region_id",
		"rpEcNmCol": "reported_name",
		"rpAdFstCol": "reported_address_first",
		"rpAdSecCol": "reported_address_second",
		"rpCityCol": "reported_city",
		"rpStateCol": "reported_state",
		"rpCountryCol": "reported_country_id",
		"rpPsCodCol": "reported_postal_code",
		"rpIsPerCol": "is_person",
		"rpEndCustCol": "end_customer_id",
		"mappedEcNameCol" : "end_customer/name",
		"mappedEcCountryCol" : "end_customer/country_id",
		"rpOnHoldCol": "on_hold",
		"rpAssignedtoCol": "assigned_to_empid",
		"createdOntCol": "created_on",
		"changedOntCol": "changed_on",
		"changedbytCol": "changed_by",
		"isEnterpriseCol" : "reporting_partner/is_npn"
		
	};
	return Controller.extend("nv.ecAliasing.controller.BaseController", {
		//////filter and sort
		onClick: function (oID) {
			var that = this;
			$('#' + oID).click(function (oEvent) { //Attach Table Header Element Event
				var oTarget = oEvent.currentTarget; //Get hold of Header Element
				var oIndex = oTarget.id.split('--')[1]; //Get the column Index
				that.getOwnerComponent().getModel("LocalDataModel").setProperty("/inputVal", "");
				that.getOwnerComponent().getModel("LocalDataModel").setProperty("/bindingValue", ecMappingObj[oIndex]);
				that._oResponsivePopover.openBy(oTarget);
			});
		},

		onChange: function (oEvent) {
			var oValue = oEvent.getParameter("value");
			var oTable = this.getView().byId("list");
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
			var oTable = this.getView().byId("list");
			var oItems = oTable.getBinding("items");
			var oBindingPath = this.getOwnerComponent().getModel("LocalDataModel").getProperty("/bindingValue");
			var oSorter = new Sorter(oBindingPath, false);
			oItems.sort(oSorter);
			this._oResponsivePopover.close();
		},
		//sort descending
		onDescending: function () {
			var oTable = this.getView().byId("list");
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
			if (oEvent.getSource().sId.split("--")[1] === "popupMapping") {
				this._oMappingPer.destroy();
			}
		},
		
		initPersonalizedEC : function(){
			that = this;
			this._oTPC = new sap.m.TablePersoController({
					table: this.byId("list"),
					//specify the first part of persistence
					componentName: "ecAliasing",
					resetAllMode: ResetAllMode.ServiceReset,
					persoService: DemoPersoService
				}).activate();
				
			
				
			
		},

		onPersoButtonPressed: function (oEvent) { // Personalized Table columns. Show hide columns and shuffle columns.
		// this._oMappingPer = null;
		// this._oTPC = null;
		if(this._oMappingPer){
			this._oMappingPer.destroy();
		}else if(this._oTPC){
			this._oTPC.destroy();
		}
			
	
			if (oEvent.getSource().sId.split("--")[1] === "popupMapping") {
				this._oMappingPer = new sap.m.TablePersoController({
					table: this.byId("idAccountsCreate"),
					//specify the first part of persistence
					componentName: "ecMapping",
					resetAllMode: ResetAllMode.ServiceReset,
					persoService: MappingPersoService
				}).activate();
				
				this._oMappingPer.openDialog();
			} 
			else {
				this._oTPC = new sap.m.TablePersoController({
					table: this.byId("list"),
					//specify the first part of persistence
					componentName: "ecAliasing",
					resetAllMode: ResetAllMode.ServiceReset,
					persoService: DemoPersoService
				}).activate();
				// init and activate controller for personalization of table
				this._oTPC.openDialog();
			}
		},
		onTablePersoRefresh: function (oEvent) {

			if (oEvent.getSource().sId.split("--")[1] === "popupMapping") {
				MappingPersoService.resetPersData().done(
					function () {
						this._oMappingPer.refresh();
					}.bind(this)
				);
			} else {
				DemoPersoService.resetPersData().done(
					function () {
						this._oTPC.refresh();
					}.bind(this)
				);
			}
		},
		onTableGrouping: function (oEvent) {
			if (oEvent.getSource().sId.split("--")[1] === "popupMapping") {
				this._oMappingPer.setHasGrouping(oEvent.getSource().getSelected());
			} else {
				this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
			}
		},
		// on logout from page
		onPressLogout: function () {
			window.location.replace("/my/logout");
		},
		/// Export to Excel
		onDownload: function (oEvent) {
			var aCols, oRowBinding, oSettings, oSheet, oTable, icount, sUri, sfilter = "",
				sorderby, sSelect, iskip;
			if (!this._oTable) {
				this._oTable = this.byId("list");
			}

			oTable = this._oTable;
			oRowBinding = oTable.getBinding("items");
			aCols = this.createColumnConfig();
			icount = oRowBinding.aContexts.length;
			iskip = (icount > 100) ? icount - 100 : 0;
			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: {
					dataUrl: oRowBinding.getDownloadUrl() + '&$top=' + 100 + '&$skip=' + iskip,
					count: icount
				},
				fileName: 'End_Customer_Aliasing.xlsx',
				worker: false

			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(function () {
				oSheet.destroy();
			});
		},
		createColumnConfig: function () {
			EdmType = exportLibrary.EdmType;
			var aCols = [];
			aCols.push({
				label: "Reporting Parner ID",
				type: EdmType.String,
				property: 'reporting_partner_id'
			});

			aCols.push({
				label: "Region",
				type: EdmType.String,
				property: 'reporting_partner/country/region_id'
			});

			aCols.push({
				label: "Reported EC Name",
				type: EdmType.String,
				property: 'reported_name'
			});
			aCols.push({
				label: "Reported EC Address 1",
				type: EdmType.String,
				property: 'reported_address_first'
			});
			aCols.push({
				label: "Reported EC Address 2",
				type: EdmType.String,
				property: 'reported_address_second'
			});

			aCols.push({
				label: "City",
				type: EdmType.String,
				property: 'reported_city'
			});

			aCols.push({
				label: "State",
				type: EdmType.String,
				property: 'reported_state'
			});

			aCols.push({
				label: "Country",
				type: EdmType.String,
				property: 'reported_country_id'
			});

			aCols.push({
				label: "Postal Code",
				type: EdmType.String,
				property: 'reported_postal_code'
			});

			aCols.push({
				label: "Is Person",
				type: EdmType.Boolean,
				property: 'is_person'
			});

			aCols.push({
				label: "Mapped Partner",
				type: EdmType.String,
				property: 'end_customer_id'
			});

			aCols.push({
				label: "On Hold",
				type: EdmType.Boolean,
				property: 'on_hold'
			});

			return aCols;

		}
	});
});