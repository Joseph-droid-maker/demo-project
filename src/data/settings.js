// Mirrors the real `settings` table's key-value structure and seed values
// from the Phase 1 schema (rms_schema.sql) — same keys, same groups, same
// defaults — so this demo doesn't invent config that production won't have.
export const MOCK_SETTINGS = [
  { key: 'restaurant_name',     group: 'branding', label: 'Restaurant Name',       value: "One Hotel's Avenue" },
  { key: 'restaurant_subtitle', group: 'branding', label: 'Full Restaurant Title', value: "One Hotel's Avenue Restaurant Management System" },
  { key: 'restaurant_address',  group: 'contact',  label: 'Address',               value: '123 Food Avenue, Metro Manila, Philippines' },
  { key: 'restaurant_phone',    group: 'contact',  label: 'Phone',                 value: '(02) 8123 4567' },
  { key: 'restaurant_email',    group: 'contact',  label: 'Email',                 value: 'info@onehotelsavenue.ph' },
  { key: 'restaurant_website',  group: 'contact',  label: 'Website',               value: 'www.onehotelsavenue.ph' },
  { key: 'currency_symbol',     group: 'billing',  label: 'Currency Symbol',       value: '₱' },
  { key: 'tax_rate',            group: 'billing',  label: 'Tax Rate (%)',          value: '12.00' },
  { key: 'service_charge_rate', group: 'billing',  label: 'Service Charge Rate (%)', value: '10.00' },
  { key: 'total_tables',        group: 'operations', label: 'Total Tables',        value: '40' },
  { key: 'receipt_footer',      group: 'receipts', label: 'Receipt Footer Message', value: 'Thank you for dining with us!' },
];

export const SETTINGS_GROUPS = [
  { key: 'branding',   label: 'Branding' },
  { key: 'contact',    label: 'Contact Information' },
  { key: 'billing',    label: 'Billing & Tax' },
  { key: 'operations', label: 'Operations' },
  { key: 'receipts',   label: 'Receipts' },
];
