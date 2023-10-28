namespace product;
using { partner } from '../db/partner-model';
using { lov } from '../db/lov-model';

@assert.unique: {
  	sys_model_no: [ sys_model_no ]
}
entity Master_sys{
		key id          						:	UUID;
		sys_model_no							:	String(256) @mandatory  @title:'SYS Model Number';
		sys_model_description					:	String(256) @title:'SYS Model Description';
		sys_model_group							:	String(256) @title:'SYS Model Group';
		sys_platform							:	Association to lov.Platform;
		sys_competitor							:	String(10) @title:'SYS Competitor';
		sys_type								:	Association to lov.sys_type;
		sys_screen_size							:	Association to lov.sys_screen_size;
		sys_screen_refresh_rate					:	Association to lov.sys_screen_refresh_rate;
		sys_screen_resolution					:	Association to lov.sys_screen_resolution;
		sys_panel_type							:	Association to lov.sys_panel_type ;
		sys_manufacturer						:	Association to lov.Manufacturer;
		sys_memory_size							:	Association to lov.memory_size;  
		sys_memory_type							:	Association to lov.memory_type;
		sys_dimensions							:	Association to lov.sys_dimensions;
		sys_z_height							:	Association to lov.sys_z_height;
		sys_weight								:	Association to lov.sys_weight;
		sys_brand								:	Association to lov.sys_brand ;
		sys_brand_series						:	Association to lov.sys_brand_series;
		sys_brand_consumer_commercial			:	Association to lov.sys_brand_consumer_commercial;
		sys_brand_is_apple						:	String(10) @title :'SYS Brand Is Apple';
		sys_output_display_port					:	String(10) @title :'SYS Output Display Port';
		sys_output_hdmi							:	String(10) @title :'SYS Output HDMI';
		sys_output_thunderbolt					:	String(10) @title :'SYS Output Thunderbolt';
		sys_output_vga							:	String(10) @title :'SYS Output VGA';
		sys_output_gsync						:	String(10) @title :'SYS GSYNC/FreeSync';
		sys_os									:	Association to lov.sys_os ;
		sys_storage_type_one					:	Association to lov.sys_storage_type ;
		sys_storage_type_two					:	Association to lov.sys_storage_type ;
		sys_storage_capacity_one				:	Association to lov.sys_storage_capacity ;
		sys_storage_capacity_two				:	Association to lov.sys_storage_capacity ;
		sys_odd									:	Association to lov.sys_odd ;
		sys_form_factor							:	Association to lov.sys_form_factor ;
		sys_studio								:	String(10) @title :'SYS Studio';
		gpu_manufacturer						:	Association to lov.Manufacturer;
		gpu_base_clock							:	Integer ;
		gpu_boost_clock							:	Integer ;
		gpu_memory_size							:	Association to lov.memory_size;
		gpu_memory_type							:	Association to lov.memory_type;
		gpu_brand 								:	Association to lov.gpu_brand;
		gpu_level								:	Association to lov.gpu_level;
		gpu_discrete							:	String(10) @title :'GPU Discrete vs Integrated';
		gpu_edition								:	Association to lov.gpu_edition;
		gpu_cooling								:	Association to lov.gpu_cooling;
		gpu_itx									:	String(10) @title :'GPU ITX';
		gpu_low_profile							:	String(10) @title :'GPU Low Profile';
		gpu_single_slot							:	String(10) @title :'GPU Single Slot';
		gpu_max_q								:	String(10) @title :'GPU Max Q';
		gpu_ops_supported						:	String(10) @title :'GPU OPS Supported';
		gpu_perf								:	Association to lov.gpu_perf;
		gpu_shadow_play							:	String(10) @title :'GPU Shadow Play';
		gpu  									:	Association to Master_gpu;
		cpu										:	Association to Master_cpu;
		created_on								:	Timestamp;
		created_by								:	String(256);
		changed_on								:	Timestamp;
		changed_by								:	String(256);
		eol 									:	Boolean;
		attribute_key							:	Boolean;
		legacy									:	Boolean;
		complete								:	Boolean;
		dummy_rp                                :   String(10);
		cpu_gpu									:   String(256);
		assigned_to                             :   Association to partner.Salesrep;
		bus_type								:   Association to lov.bus_type;
		comments							    :	Association to many Comments on comments.sys_model = $self;
};

@assert.unique: {
  	gpu_model_no: [ gpu_model_no ]
}
entity Master_gpu{
		key id          					:	UUID;
		gpu_model_no						:	String(256) @mandatory @title:'GPU Model Number';
		gpu_model_description				:	String(256) @title:'GPU Model Description';
		gpu_model_no_current				:	String(256) @title:'GPU Model Number (Current)';
		gpu_model_no2						:	String(256) @title:'GPU Model Number 2';
		gpu_model_group						:	String(256) @title:'GPU Model Number group';
		gpu_architecture					:	Association to lov.gpu_architecture ;
	 	gpu_dx_type							:	Association to lov.gpu_dx_type ;
		gpu_gf_segment						:	Association to lov.gpu_gf_segment ;
		gpu_gf_sub_segment					:	Association to lov.gpu_gf_sub_segment ;
		gpu_segment							:	Association to lov.gpu_segment ;
		gpu_class							:	Association to lov.gpu_class ;
		system  							:	Association to many Master_sys on system.gpu = $self;
		created_on							:	Timestamp;
		created_by							:	String(256);
		changed_on							:	Timestamp;
		changed_by							:	String(256);
	    @Core.Computed: false
		virtual message						:	String(256);

	};
	
@assert.unique: {
  	cpu_model_no: [ cpu_model_no ]
}
entity Master_cpu{
		key id          					:	UUID;
		cpu_model_no						:	String(256) 	@mandatory @title:'CPU Model Number';
		cpu_brand							:	Association to lov.cpu_brand;
	 	cpu_generation						:	Association to lov.cpu_generation;
		cpu_core_frequency					:	Association to lov.cpu_core_frequency;
		cpu_core							:	Association to lov.cpu_core;
		cpu_manufacturer					:	Association to lov.Manufacturer;
		cpu_architecture					:	Association to  lov.cpu_architecture ;
		cpu_class							:	Association to  lov.cpu_class ;
		system								:	Association to many Master_sys on system.cpu = $self;
		created_on							:	Timestamp;
		created_by							:	String(256);
		changed_on							:	Timestamp;
		changed_by							:	String(256);
	};
	


@assert.unique: {
  	mapping_id: [ partner,reported_product_id,sys_model]
}
entity Mapping{
	key id          						:	UUID;
	partner     							:	Association to partner.Master	@mandatory;
	reported_product_id 					:	String(255) 					@mandatory;
	reported_product_type					:	String(10);
	reported_product_description			:	String(1000);
	sys_model								:	Association to Master_sys		@mandatory;
	sys_model_secondary						:	Association to Master_sys;
	on_hold                                 :   Boolean;
	quantity                                :	Integer;
	comment_type                            :   String(10);
	comment									:   String(255);
	assigned_to                             :   Association to partner.Salesrep;
	created_on								:	Timestamp						@readonly;
	created_by								:	String(256) 					@readonly;
	changed_on								:	Timestamp						@readonly;
	changed_by								:   String(256) 					@readonly;

};



@assert.unique: {
  	mapping_id: [ partner,reported_product_id]
}
entity Mapping_Header{
	key id          						:	UUID;
	partner     							:	Association to partner.Master	@mandatory;
	reported_product_id 					:	String(255) 					@mandatory;
	reported_product_type					:	String(10);
	reported_product_description			:	String(1000);
	on_hold                                 :   Boolean;
	comment_type                            :   String(10);
	comment									:   String(255);
	assigned_to                             :   Association to partner.Salesrep;
	created_on								:	Timestamp						@readonly;
	created_by								:	String(256) 					@readonly;
	changed_on								:	Timestamp						@readonly;
	changed_by								:   String(256) 					@readonly;
	valid_from                      	    :	Timestamp not null @readonly;
    valid_to                        		:	Timestamp not null @readonly;
	mapping_items     						:	Association to many Mapping_Items on mapping_items.header = $self;
	reported_manufacturer					:	String(256);

};

entity Mapping_Header_History{
	id          							:	UUID;
	partner     							:	Association to partner.Master	@mandatory;
	reported_product_id 					:	String(255) 					@mandatory;
	reported_product_type					:	String(10);
	reported_product_description			:	String(1000);
	on_hold                                 :   Boolean;
	comment_type                            :   String(10);
	comment									:   String(255);
	assigned_to                             :   Association to partner.Salesrep;
	created_on								:	Timestamp						@readonly;
	created_by								:	String(256) 					@readonly;
	changed_on								:	Timestamp						@readonly;
	changed_by								:   String(256) 					@readonly;
	valid_from                      	    :	Timestamp   @readonly;
    valid_to                        		:	Timestamp   @readonly;
	reported_manufacturer					:	String(256);

};

@assert.unique: {
  	mapping_id: [ header,entity_type,sys_model]
}
entity Mapping_Items{
	key id          						:	UUID;
    header                                  :   Association to Mapping_Header;
    entity_type							    :   String(10);
    sys_model								:	Association to Master_sys		@mandatory;
	quantity                                :	Integer @mandatory;

};

 @cds.persistence.exists
entity Mapping_Summary{
	category         						:	String(25);
    new                                     :   Integer;
    on_hold									:   Integer;								

};





@cds.persistence.exists
entity	Search_Optimised(QUERY : String){
		match_score 					:	hana.REAL; 
		rp                              :   String(10);
		region                          :   String(20);
		rp_type                         :	String(256);
		sys_model_no					:	String(256);
		product_code                    :   String(256);
		sys_platform_id                 :   String(255);
		reported_product_id 			:	String(256);
		reported_product_description	:	String(256);
		reported_manufacturer			:	String(256);
		sys_model_id					:	String(36);
						

};

entity fuzzy_config{
      key product_fuzzy_config_id		:	String(256);
 	  key fuzzy_field					:	String(256);
 	      fuzzy_accuracy				:	Decimal(2,1);
 	      fuzzy_config					:	String(500);
 	      fuzzy_weight					:	Decimal(2,1);
 	      
 	
 };
 
 
 entity mapping_vw as select from Mapping_Items {
	 	header.id 														as mapping_id,
	 	header.partner.id 												as reporting_partner_id,
		header.partner.name 											as reporting_partner_name,
		header.reported_product_id 	,
		header.reported_product_type,
		header.reported_product_description,
	    header.on_hold,
		header.comment_type,
		header.comment,
		header.assigned_to,
		case when ( sys_model.sys_model_no is null or sys_model.sys_model_no = '' ) then to_boolean(0)
		else to_boolean(1)                                              end as mapping_flag,
		sys_model.id													as sys_model_id,
		sys_model.sys_model_no											as sys_model_no,
		case when sys_model.gpu.id is null then sys_model.sys_model_no
		else sys_model.gpu.gpu_model_no end 							as product_code,
		quantity                                                        as bundle_quantity,
		sys_model.sys_model_description,
		sys_model.sys_model_group,
		sys_model.sys_platform.description          					as sys_model_platform,
		sys_model.sys_competitor,
		sys_model.sys_type.description	            					as sys_type,
		sys_model.sys_screen_size.description	    					as sys_screen_size,
		sys_model.sys_screen_size.screen_size_group	            		as sys_screen_group,
		sys_model.sys_screen_refresh_rate.description					as sys_screen_refresh_rate,
		sys_model.sys_screen_resolution.description						as sys_screen_resolution,
		sys_model.sys_screen_resolution.resolution_group				as sys_screen_resolution_group,
		sys_model.sys_panel_type.description							as sys_panel_type,
		sys_model.sys_manufacturer.name									as sys_manufacturer,
		sys_model.sys_memory_size.description							as sys_memory_size,
		sys_model.sys_memory_size.mem_size_group						as sys_memory_size_group,
		sys_model.sys_memory_type.description							as sys_memory_type,
		sys_model.sys_dimensions.description							as sys_dimensions,						
		sys_model.sys_z_height.description								as sys_z_height,
		sys_model.sys_z_height.height_group								as sys_z_height_group,
		sys_model.sys_weight.description								as sys_weight,
		sys_model.sys_weight.weight_group								as sys_weight_group,
		sys_model.sys_brand.description									as sys_brand ,
		sys_model.sys_brand.brand_group									as sys_brand_brand_group_one ,
		sys_model.sys_brand.brand_group2								as sys_brand_brand_group_two,
		sys_model.sys_brand_series.description							as sys_brand_series,
		sys_model.sys_brand_consumer_commercial.description				as sys_brand_consumer_commercial,
		sys_model.sys_brand_is_apple,
		sys_model.sys_output_display_port,
		sys_model.sys_output_hdmi,
		sys_model.sys_output_thunderbolt,
		sys_model.sys_output_vga,
		sys_model.sys_output_gsync,
		sys_model.sys_os.description									as sys_os,
		sys_model.sys_os.os_group										as sys_os_group,
		sys_model.sys_storage_type_one.description					    as sys_storage_type_one,
		sys_model.sys_storage_type_two.description					    as sys_storage_type_two
	                                           
		
	
};
entity ui_config{
      key sys_platform							:Association to lov.Platform;
 	  key field_name							: String(256);
 	      visibility							: Boolean;
 	      mandatory								: Boolean;
 	      
 	      
 	
 };

 entity Comments {
        key id          						: UUID;
            sys_model							:Association to Master_sys		@mandatory;
            comment     						: LargeString @mandatory;
            commentby   						: String(256) @readonly;
            user        						: String(256) @readonly;
            inserttime  						: Timestamp @readonly;
    };



