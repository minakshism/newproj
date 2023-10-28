jQuery.sap.declare("nv.ecAliasing.utils.formatter");

nv.ecAliasing.utils.formatter = {
	fmEnabledCondition : function(val){
			var Assignedempid;
			// if(this.getParent().getCells()[12].getItems()){
			// 	Assignedempid =  this.getParent().getCells()[12].getItems()[0].mBindingInfos.value.binding.vValue;
			// } else{
			// 	Assignedempid = "";
			// }
			//var bvisibe = this.getProperty("editable");
			var logedInEmpId = this.getParent().getParent().oPropagatedProperties.oModels.LocalDataModel.getData().empid;
			var benabled = this.getParent().getParent().oPropagatedProperties.oModels.LocalDataModel.getData().benable;
			var bdisabled = this.getParent().getParent().oPropagatedProperties.oModels.LocalDataModel.getData().bdisable;
			//var isTrinityAdmin = this.getParent().getParent().oPropagatedProperties.oModels.LocalDataModel.getData().is_trinityadmin;
			
			if(val){
				this.getParent().getParent().getCells()[11].setEnabled(true);
				this.getParent().getParent().getCells()[12].setEnabled(true);
				this.getParent().getParent().getCells()[15].setEnabled(true);
			}else{
				this.getParent().getParent().getCells()[11].setEnabled(false);
				this.getParent().getParent().getCells()[12].setEnabled(false);
				this.getParent().getParent().getCells()[15].setEnabled(false);
			}
			
			return val;
	}
};

