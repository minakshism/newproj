namespace lov;
entity Manufacturer{
	key id								:	String (10);
	name								:	String(256);
	related_brand						:	String (256);
	type								:	String (256);
	eol									:	Boolean;
};
entity attributes{
	key id								:	String(255);
	key type							:	String(255);
	value								:	String(255);

};
entity sys_type {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Type';

};
entity sys_screen_size {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Screen Size (in)';
		screen_size_group					:	String(256) @title :'SYS Screen Size Group';

};
entity sys_screen_refresh_rate {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Screen Refresh Rate (Hz)';
};
entity sys_screen_resolution {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Screen Resolution';
		resolution_group								:	String(256) @title :'SYS Screen Resolution Group';

};
entity sys_panel_type {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Panel Type';
	
};
entity memory_size {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Memory Size';
		mem_size_group						:	String(256) @title :'SYS Memory Size Group';

};
entity memory_type {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Memory Type';
	
};
entity sys_dimensions {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Dimensions';
	
};
entity sys_z_height {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Z Height';
		height_group								:	String(256) @title :'SYS Z Height group';
	
};
entity sys_weight {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Weight (lbs)';
		weight_group								:	String(256) @title :'SYS Weight (lbs) group';
	
};

entity sys_brand {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Brand';
		brand_group							:	String(256) @title : 'SYS Brand Group 1';
		brand_group2						:	String(256) @title : 'SYS Brand Group 2';
};
entity sys_brand_series {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Brand Series';
};

entity sys_brand_consumer_commercial {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Brand Series';
};
	
entity gpu_brand {
  key	id									:	String(256);
		description							:	String(256) @title :'GPU Brand';
		brand_group							:	String(256) @title : 'GPU Brand Group';
	
	
};


entity sys_os {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS OS';
		os_group								:	String(256) @title :'SYS OS';
	
};
entity sys_storage_type {
  key	id									:	String(256);
		description							:	String(256) @title :'sys_storage_type';
	
};
entity sys_storage_capacity {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Storage Capacity';
		capacity_group				:	String(256) @title :'SYS Storage Capacity';
	
};
entity sys_odd {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS ODD';
		 odd_group							:	String(256) @title :'SYS ODD group';
	
};	
entity sys_form_factor {
  key	id									:	String(256);
		description							:	String(256) @title :'SYS Form Factor';
	 
	
};	
entity gpu_clock {
  key	id									:	String(256);
		description							:	String(256) @title :'GPU  Clock (MHz)';
	 
	
};
entity gpu_level {
  key	id									:	String(256);
		description							:	String(256) @title :'GPU Level';
	 
	
};
entity gpu_edition {
  key	id									:	String(256);
		description							:	String(256) @title :'GPU Edition';
	 
	
};
entity gpu_cooling {
  key	id									:	String(256);
		description							:	String(256) @title :'GPU Cooling';
	 
	
};
entity gpu_perf {
  key	id									:	String(256);
		description							:	String(256) @title :'GPU Perf';
};
entity gpu_architecture {
  key	id									:	String(256);
		description							:	String(256) @title :'GPU Architecture';
		architecture_group					:	String(256) @title :'GPU Architecture group';
	
};
entity cpu_architecture {
  key	id									:	String(256);
		description							:	String(256) @title :'CPU Architecture';
		architecture_group					:	String(256) @title :'CPU Architecture group';
	
};
entity gpu_dx_type {
  key	id									:	String(256);
		description							:	String(256) @title :'GPU DX Type';
};
entity gpu_gf_segment {
  key	id									:	String(256);
		description							:	String(256) @title :'GPU GF Segment';
};

entity gpu_segment {
  key	id									:	String(256);
		description							:	String(256) @title :'GPU  Segment';
};


entity gpu_gf_sub_segment {
  key	id									:	String(256);
		description							:	String(256) @title :'GPU GF Sub Segment';
};
entity gpu_class {
  key	id									:	String(256);
		description							:	String(256) @title :'GPU Class';
};
entity cpu_core_frequency {
  key	id									:	String(256);
		description							:	String(256) @title :'CPU Core Frequency';
};
entity cpu_core {
  key	id									:	String(256);
		description							:	String(256) @title :'CPU Cores';
};
entity cpu_brand {
  key	id									:	String(256);
		description							:	String(256) @title :'CPU Brand';
		brand_group							:	String(256) @title : 'CPU Brand Group 1';
	
	
};
entity cpu_generation {
  key	id									:	String(256);
		description							:	String(256) @title :'CPU  Generation';
		generation_group					:	String(256) @title :'CPU  Group-Generation';
	
};
entity cpu_class {
  key	id									:	String(256);
		description							:	String(256) @title :'CPU Class';
};
entity Platform {
  key	id									:	String(255);
		description							:	String(255);
		
};

entity bus_type {
  key	id									:	String(255);
		description							:	String(255);
		
};
entity comment_type {
  key	id									:	String(255);
		description							:	String(255);
		
};
