export const BID_STATUS = {
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
  };
  
  export const RICE_VARIETIES = {
    SAMBA: 'SAMBA',
    NADU: 'NADU',
    BASMATI: 'BASMATI',
  };
  
  export const BID_SORT_OPTIONS = [
    { label: 'Newest First', value: 'date_desc' },
    { label: 'Oldest First', value: 'date_asc' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Quantity: Low to High', value: 'quantity_asc' },
    { label: 'Quantity: High to Low', value: 'quantity_desc' },
  ];
  
  export const BID_FILTERS = {
    PRICE_RANGES: [
      { label: 'Any Price', value: '' },
      { label: 'Under Rs.100', value: '0-100' },
      { label: 'Rs.100 - Rs.200', value: '100-200' },
      { label: 'Rs.200 - Rs.300', value: '200-300' },
      { label: 'Over Rs.300', value: '300-' },
    ],
    TIME_RANGES: [
      { label: 'All Time', value: '' },
      { label: 'Last 24 Hours', value: '24h' },
      { label: 'Last 7 Days', value: '7d' },
      { label: 'Last 30 Days', value: '30d' },
    ],
  };
  