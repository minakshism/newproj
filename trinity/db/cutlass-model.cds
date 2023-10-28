namespace cutlass;

@cds.persistence.exists
entity product_search(QUERY : String){
	match_score 	: hana.REAL;                                                                                                           
	id				: Integer;                                                                                                                 
	product_no		: String(50);                                                                                                      
	hwlonggpuname	: String(200);                                                                                                  
	vendor			: String(20);                                                                                                          
	memory_type 	: String(12);                                                                                                     
	memory_size 	: String(10);                                                                                                     
	interface		: String(20);                                                                                                       
	base_clock		: Integer;                                                                                                         
	boost_clock 	: Integer;                                                                                                        
	create_dt		: Date;                                                                                                             
	update_dt		: Date;                                                                                                             
	sys_brand		: String(100);                                                                                                      
	level			: String(10);                                                                                                           
	cooling 		: String(10);                                                                                                         
	edition 		: String(20);                                                                                                         
	etailer_id		: Integer;                                                                                                         
	description 	: String(1000);                                                                                                   
	detail_url		: String(400);                                                                                                     
	user_id 		: Integer;                                                                                                            
	brand_group 	: String(30);                                                                                                     
	itx 			: String(5);                                                                                                              
	low_profile 	: String(5);                                                                                                      
	single_slot 	: String(5);                                                                                                      
	gpu_map_id		: Integer;                                                                                                         
	productcode 	: String(50);                                                                                                     
	platform		: String(30);                                                                                                        
	gpu_brand		: String(10);  
};


entity product{
		key id :Integer;
		product_no :String(50);
	hwlonggpuname :String(200);
	vendor :String(20);
	memory_type :String(12);
	memory_size :String(10);
	interface :String(20) ;
	base_clock :Integer ;
	boost_clock :Integer ;
	create_dt :Date ;
	update_dt :Date  ;
	brand :String(100) ;
	level :String(10) ;
	cooling :String(10) ;
	edition :String(20) ;
	etailer_id :Integer ;
	description :String(1000) ;
	detail_url :String(400) ;
	user_id :Integer ;
	brand_group :String(30) ;
	itx :String(5) ;
	low_profile :String(5) ;
	single_slot :String(5) ;
	gpu_map_id :Integer ;
};
entity gpu_map{
	key id :Integer;
	productcode :String(50) ;
	currentproduct :String(20) ;
	platform :String(30) ;
	segment :String(20) ;
	gfsegment :String(20) ;
	gfsubsegment :String(20) ;
	dxtype :String(10) ;
	perf :String(10) ;
	productfamily :String(10) ;
	productfamilyname :String(10) ;
	productfamilygroup :String(10) ;
	opssupported :String(10) ;
	shadowplay :String(10) ;
	productgeneration :String(10) ;
	productclass :String(10) ;
	vrready :String(10) ;
	asp_segment :String(20) ;
	bu :String(10) ;
	brand :String(10) ;
	system_type :String(15) ;
	isintegrated :String(10) ;
	create_dt :Date ;
	update_dt :Date ;
	user_id :Integer ;
	isrtx :String(10) ;
};
entity nb_etailer_product{
	key id :Integer;
	description :String(1000) ;
	sku_asin :String(50) ;
	detail_url :String(400) ;
	hwlonggpuname :String(200) ;
	cpu :String(100) ;
	brand :String(45) ;
	gpu_memory_type :String(15) ;
	gpu_memory_size :String(10) ;
	product_no :String(70) ;
	dimensions :String(50) ;
	display_port :String(50) ;
	os :String(100) ;
	panel_type :String(40) ;
	resolution :String(50) ;
	screen :String(50) ;
	"storage" :String(100) ;
	subbrand :String(100) ;
	system_memory_type :String(15) ;
	system_memory_size :String(10) ;
	base_clock :Integer ;
	boost_clock :Integer ;
	weight :String(30) ;
	hdmi :String(10) ;
	vga :String(10) ;
	create_dt :Date ;
	update_dt :Date ;
	etailer_id :Integer ;
	user_id :Integer ;
	thunderbolt :String(10) ;
	height : Decimal(8,2) ;
	os_norm :String(100) ;
	panel_type_refresh_rate :String(40) ;
	screen_norm :String(50) ;
	weight_norm :Decimal(8,2) ;
	gpu_mapping_id :Integer ;
	storage1 :String(10) ;
	storage1_type :String(10) ;
	storage2 :String(10) ;
	storage2_type :String(10) ;
	gpu_map_id :Integer ;
	cpu_series_id :Integer ;
	nb_brand_id :Integer ;
	nb_os_id :Integer ;
	nb_resolution_id :Integer ;
	nb_screen_size_id :Integer ;
	nb_storage_id :Integer ;
	nb_sys_memory_size_id :Integer ;
	nb_sys_memory_type_id :Integer ;
	nb_weight_id :Integer ;
	nb_dimensions_id :Integer ;
};
entity cpu_series{
	key id :Integer;
	hwcpuseries :String(20) ;
	hwcpumanufacturer :String(10) ;
	hwbrandname :String(50) ;
	hwcpucores :Integer ;
	hwcpuchipname :String(25) ;
	hwcpuintegratedgpu :String(10) ;
	hwcpumicroarchitecture :String(15) ;
	hwcpucorefrequency :Integer ;
	hwcpul2cache :Integer ;
	hwcpul3cache :Integer ;
	hwcpuhyperthreading :String(10) ;
	"key" :Integer ;
	cpuperf :Integer ;
	cpuvrready :String(10) ;
	cpuplatform :String(10) ;
	scrapped_launch_date :String(10) ;
	scrapped_end_date :String(10) ;
	processed_launch_date :String(10) ;
	processed_end_date :String(10) ;
	create_dt :Date ;
	update_dt :Date ;
	user_id :Integer ;
};



