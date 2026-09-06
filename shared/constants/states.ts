/**
 * Indian States and Union Territories — used for GST place of supply
 * and intra/interstate tax determination.
 */

export interface IndianState {
 code: string;
 name: string;
 type: 'State' | 'UT';
 gstCode: string;
}

export const INDIAN_STATES: IndianState[] = [
 { code: 'AN', name: 'Andaman and Nicobar Islands', type: 'UT', gstCode: '35' },
 { code: 'AP', name: 'Andhra Pradesh', type: 'State', gstCode: '37' },
 { code: 'AR', name: 'Arunachal Pradesh', type: 'State', gstCode: '12' },
 { code: 'AS', name: 'Assam', type: 'State', gstCode: '18' },
 { code: 'BR', name: 'Bihar', type: 'State', gstCode: '10' },
 { code: 'CG', name: 'Chhattisgarh', type: 'State', gstCode: '22' },
 { code: 'CH', name: 'Chandigarh', type: 'UT', gstCode: '04' },
 { code: 'DD', name: 'Daman and Diu', type: 'UT', gstCode: '25' },
 { code: 'DL', name: 'Delhi', type: 'UT', gstCode: '07' },
 { code: 'GA', name: 'Goa', type: 'State', gstCode: '30' },
 { code: 'GJ', name: 'Gujarat', type: 'State', gstCode: '24' },
 { code: 'HP', name: 'Himachal Pradesh', type: 'State', gstCode: '02' },
 { code: 'HR', name: 'Haryana', type: 'State', gstCode: '06' },
 { code: 'JH', name: 'Jharkhand', type: 'State', gstCode: '20' },
 { code: 'JK', name: 'Jammu and Kashmir', type: 'UT', gstCode: '01' },
 { code: 'KA', name: 'Karnataka', type: 'State', gstCode: '29' },
 { code: 'KL', name: 'Kerala', type: 'State', gstCode: '32' },
 { code: 'LA', name: 'Ladakh', type: 'UT', gstCode: '38' },
 { code: 'LD', name: 'Lakshadweep', type: 'UT', gstCode: '31' },
 { code: 'MH', name: 'Maharashtra', type: 'State', gstCode: '27' },
 { code: 'ML', name: 'Meghalaya', type: 'State', gstCode: '17' },
 { code: 'MN', name: 'Manipur', type: 'State', gstCode: '14' },
 { code: 'MP', name: 'Madhya Pradesh', type: 'State', gstCode: '23' },
 { code: 'MZ', name: 'Mizoram', type: 'State', gstCode: '15' },
 { code: 'NL', name: 'Nagaland', type: 'State', gstCode: '13' },
 { code: 'OD', name: 'Odisha', type: 'State', gstCode: '21' },
 { code: 'PB', name: 'Punjab', type: 'State', gstCode: '03' },
 { code: 'PY', name: 'Puducherry', type: 'UT', gstCode: '34' },
 { code: 'RJ', name: 'Rajasthan', type: 'State', gstCode: '08' },
 { code: 'SK', name: 'Sikkim', type: 'State', gstCode: '11' },
 { code: 'TG', name: 'Telangana', type: 'State', gstCode: '36' },
 { code: 'TN', name: 'Tamil Nadu', type: 'State', gstCode: '33' },
 { code: 'TR', name: 'Tripura', type: 'State', gstCode: '16' },
 { code: 'TS', name: 'Telangana', type: 'State', gstCode: '36' },
 { code: 'UK', name: 'Uttarakhand', type: 'State', gstCode: '05' },
 { code: 'UP', name: 'Uttar Pradesh', type: 'State', gstCode: '09' },
 { code: 'WB', name: 'West Bengal', type: 'State', gstCode: '19' },
];

export const STATES_BY_CODE = new Map(
 INDIAN_STATES.map((s) => [s.code, s])
);

export const STATES_BY_GST_CODE = new Map(
 INDIAN_STATES.map((s) => [s.gstCode, s])
);

export function isInterstate(supplierState: string, recipientState: string): boolean {
 if (supplierState === recipientState) return false;
 if (!supplierState || !recipientState) return false;
 return true;
}
