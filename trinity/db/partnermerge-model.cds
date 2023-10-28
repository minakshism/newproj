namespace partnermerge;
using { partner } from '../db/partner-model';

entity Merge_Request_Hdr{
        key request_id      					: UUID;
            creation_date                       : Date  @readonly;
            creation_by                         : String(256)  @readonly;
            deactivation_date                   : Date;
			description							: String(256);
			undo_flag							: Boolean;
			undo_date							: Date @readonly;
			undo_by								: String(256)  @readonly;
};

entity Merge_Request_Item{
        key	item_id								: UUID;
        key request_id      					: UUID;
		ec_mapping_id							: Association to partner.ec_mapping @Mandatory;     
        from_ec_id			            		: Association to partner.Master @Mandatory;
        to_ec_id			            		: Association to partner.Master @Mandatory;
};
