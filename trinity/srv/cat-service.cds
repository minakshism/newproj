using { geo } from '../db/country-model';
using { partner } from '../db/partner-model';
using { partnermerge } from '../db/partnermerge-model';
using { product } from '../db/product-model';
using { cutlass } from '../db/cutlass-model';
using { pos } from '../db/Transaction-model';
using { lov } from '../db/lov-model';
  @path:'/trinity/api'

@requires : 'authenticated-user'
service PosService  @(restrict: [ 
    { grant:'*', to: ['trinityadmin', 'trinityuser', 'trinityproductadmin', 'trinityproductuser'] } 
  ]) {

@readonly
  entity UserScopes {
		key username    		: String;
        	is_trinityadmin 	: Boolean;
        	is_trinityenduser	: Boolean;
        	is_trinityproductadmin : Boolean;
        	is_trinityproductuser: Boolean;
			empid				:String;
			employee_nt_id		:String;
			knownas				:String;
			first_name			:String;
			last_name			:String;
			department			:String;
			country				:String
  };

// Partner Services
entity CountryVat                   as projection on geo.country_vat;
entity Country  					as projection on geo.Country;
entity States  				    	as projection on geo.States;
entity Territory					as projection on geo.Territory;
entity Grouping 					as projection on geo.Grouping;
entity SubRegion					as projection on geo.Sub_Region;
entity Region						as projection on geo.Region;
entity MarketEconomy				as projection on geo.Market_Economy;
entity SfdcAccount 				    as projection on partner.Sfdc_Account;
entity PartnerMaster				as projection on partner.Master;
entity PartnerComments				as projection on partner.Comments;
entity PartnerClassification		as projection on partner.Classification;
entity PartnerChanneltype			as projection on partner.Channel_type;
entity PartnerChannelProgram		as projection on partner.Channel_program;
entity PartnerSalesrep  			as projection on partner.Salesrep;
entity PartnerMapping  				as projection on partner.ec_mapping;

// Product LOVS

entity SysType						as projection on lov.sys_type;
entity SysScreensize				as projection on lov.sys_screen_size;
entity SysScreenRefreshRate 		as projection on lov.sys_screen_refresh_rate;
entity SysScreenResolution			as projection on lov.sys_screen_resolution;
entity SysPanelType 				as projection on lov.sys_panel_type;
entity MemorySize					as projection on lov.memory_size;
entity MemoryType					as projection on lov.memory_type;
entity SysDimensions				as projection on lov.sys_dimensions;
entity SysZHeight					as projection on lov.sys_z_height;
entity SysWeight					as projection on lov.sys_weight;
entity SysBrand						as projection on lov.sys_brand;
entity SysBrandSeries				as projection on lov.sys_brand_series;
entity SysBrandConsumerCommercial	as projection on lov.sys_brand_consumer_commercial;
entity GpuBrand 					as projection on lov.gpu_brand;
entity SysOs						as projection on lov.sys_os;
entity SysStorageType				as projection on lov.sys_storage_type;
entity SysStorageCapacity			as projection on lov.sys_storage_capacity;
entity SysOdd						as projection on lov.sys_odd;
entity SysFormFactor				as projection on lov.sys_form_factor;
entity GpuClock 					as projection on lov.gpu_clock;
entity GpuLevel 					as projection on lov.gpu_level;
entity GpuEdition					as projection on lov.gpu_edition;
entity GpuSegment                   as projection on lov.gpu_segment;
entity GpuCooling					as projection on lov.gpu_cooling;
entity GpuPerf						as projection on lov.gpu_perf;
entity GpuArchitecture				as projection on lov.gpu_architecture;
entity CpuArchitecture				as projection on lov.cpu_architecture;
entity GpuDxType					as projection on lov.gpu_dx_type;
entity GpuGfSegment 				as projection on lov.gpu_gf_segment;
entity GpuGfSubSegment				as projection on lov.gpu_gf_sub_segment;
entity GpuClass 					as projection on lov.gpu_class;
entity CpuCoreFrequency 			as projection on lov.cpu_core_frequency;
entity CpuCore						as projection on lov.cpu_core;
entity CpuBrand 					as projection on lov.cpu_brand;
entity CpuBrandGeneration			as projection on lov.cpu_generation;
entity CpuClass 					as projection on lov.cpu_class;
entity ProductPlatform 				as projection on lov.Platform;
entity ProductManufacturer          as projection on lov.Manufacturer;
entity BusType						as projection on lov.bus_type;
entity ProductUIConfig				as projection on product.ui_config;

// Product Services
entity ProductSystems				as projection on product.Master_sys;
entity ProductGpu					as projection on product.Master_gpu;
entity ProductCpu					as projection on product.Master_cpu;
entity ProductMapping				as projection on product.Mapping;
entity ProductMappingHeader			as projection on product.Mapping_Header;
entity ProductMappingHeaderHistory 	as projection on product.Mapping_Header_History;
entity ProductMappingItems 			as projection on product.Mapping_Items;
entity ProductAttributes			as projection on lov.attributes;
entity ProductComments				as projection on product.Comments;

// Partner merge services
entity MergeRequestHdr				as projection on partnermerge.Merge_Request_Hdr;
entity MergeRequestItem				as projection on partnermerge.Merge_Request_Item;

// 
entity PosTransactions			    as projection on pos.Transaction;
entity PosInventory			    	as projection on pos.Inventory;
entity PosCurrency			        as projection on pos.Currency;

@readonly entity RPstat as  
select s.category: String(256), 
        sum(s.active_records) as active_records: Integer , 
        sum(s.inactive_records) as inactive_records: Integer ,
        (  sum(s.active_records) + sum(s.inactive_records) ) as total: Integer
from (
select  'Total RP' AS category: String(256), count(*) as active_records: Integer , 0 as inactive_records: Integer FROM PartnerMaster WHERE rp_flag = true  and active = true
union 
select  'Total RP' AS category: String(256), 0 as active_records: Integer , count(*) as inactive_records: Integer FROM PartnerMaster WHERE rp_flag = true  and ( active = false or active is null )
union 

select  'Prod RP' AS category: String(256), count(*) as active_records: Integer , 0 as inactive_records: Integer FROM PartnerMaster WHERE rp_flag = true and production_date is not null and active = true
union 
select  'Prod RP' AS category: String(256), 0 as active_records: Integer , count(*) as inactive_records: Integer FROM PartnerMaster WHERE rp_flag = true and production_date is not null and ( active = false or active is null )
union 
select  'UAT RP' AS category: String(256), count(*) as active_records: Integer , 0 as inactive_records: Integer FROM PartnerMaster WHERE rp_flag = true and production_date is null and  active = true
union 
select  'UAT RP' AS category: String(256), 0 as active_records: Integer , count(*) as inactive_records: Integer FROM PartnerMaster WHERE rp_flag = true and production_date is null   and ( active = false or active is null )

union
select  'Enterprise RP' AS category: String(256), count(*) as active_records: Integer , 0 as inactive_records: Integer FROM PartnerMaster WHERE rp_flag = true and active = true 
and  is_npn = true
union
select  'Enterprise RP' AS category: String(256),0 as active_records: Integer , count(*) as inactive_records: Integer FROM PartnerMaster WHERE rp_flag = true and ( active = false or active is null ) 
and is_npn = true
union
select  'Consumer RP' AS category: String(256), count(*) as active_records: Integer , 0 as inactive_records: Integer FROM PartnerMaster WHERE rp_flag = true and active = true 
and  is_consumer = true
union
select  'Consumer RP' AS category: String(256),0 as active_records: Integer , count(*) as inactive_records: Integer FROM PartnerMaster WHERE rp_flag = true and ( active = false or active is null ) 
and is_consumer = true
) as s group by s.category;

@readonly entity RPRegion as 
select country.region.id, 
       count(country.region.id) as count: Integer 
  from PartnerMaster  WHERE rp_flag = true and country.id != ''
  group by country.region.id
union
  select  'Total RP' AS category: String(256), count(*) as records: Integer FROM PartnerMaster WHERE rp_flag = true 
; 

 
 
 @readonly entity ProductMappingSummary as projection on product.Mapping_Summary;
 @readonly entity PartnerMappingSummary as projection on partner.Mapping_Summary;
 @readonly entity PartnerMappingAssign as projection on partner.Mapping_Assign;

 @readonly entity ProductPlatformCount	as select from ProductSystems {sys_platform.description as segment: String(256), count(sys_platform.description) as count: Integer} 
group by sys_platform.description; 
// entity ProductSysGpulink as projection on product.sys_gpu_map;
	
entity CutlassProductSearch(QUERY: String)		as select from cutlass.product_search(QUERY: :QUERY) {*};

entity ProductSearchOptimized(QUERY: String)	as select from product.Search_Optimised(QUERY: :QUERY) {*} order by match_score desc;

 
@cds.persistence.exists
entity PartnerSearch(QUERY : String , ACCURACY : Decimal(2,1)){
			match_score 		: hana.REAL; 
			partner_id			: String(10);
			rp_flag         	: Boolean;
			mapped_partner_name : String(256);
			name				: String(256);
			address_first		: String(256);
			address_second		: String(256);
			city				: String(256);
			zip_code			: String(50);
			state				: String(256);
			country_id			: String(3);
						

};	


@cds.persistence.exists
entity PartnerSearchAdvance(	REPORTING_PARTNER_ID	:	String(10),
                                PARTNER_NAME			:	String(256) , 
                                ADDRESS_FIRST			:	String(256),
                                ADDRESS_SECOND			:	String(256),
                                CITY					:	String(256),
                                ZIP_CODE				:	String(256),
                                STATE					:	String(256),
                                COUNTRY_ID 				:	String(256),
                                IS_PERSON               :   String(10),
                                ACCURACY				:	Decimal(2,1))
{
			match_score 		: hana.REAL; 
			partner_id			: String(10);
			rp_flag         	: Boolean;
			mapped_partner_name : String(256); 
			name				: String(256);
			address_first		: String(256);
			address_second		: String(256);
			city				: String(256);
			zip_code			: String(50);
			state				: String(256);
			country_id			: String(3);
						

};	




@cds.persistence.exists
entity ProductSearchAdvance(	REPORTING_PARTNER_ID			:	String(10),
                                REPORTED_PRODUCT_ID 			:	String(256),
								REPORTED_PRODUCT_DESCRIPTION	:	String(1000),
								REPORTED_MANUFACTURER           :	String(256),
                                SYS_PLATFORM_ID					:	String(256))
{
			match_score 					: hana.REAL; 
			rp   							: String(10);
	        region 							: String(20);
	        rp_type     					: String(256);
	        sys_model_no					: String(256);
	        product_code                    : String(256);
	        sys_platform_id					: String(256);
	        reported_product_id    			: String(256);
	        reported_product_description	: String(1000);
	        reported_manufacturer           : String(256);
	        sys_model_id   					: String(36);
						

};		

}

