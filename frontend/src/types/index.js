// Type definitions for the application

// User Types
export const UserType = {
  id: String,
  name: String,
  email: String,
  phone: String,
  role: String, // 'admin' or 'staff'
  created_at: String,
};

// Subscription Types
export const SubscriptionType = {
  id: String,
  client_name: String,
  business_name: String,
  client_email: String,
  client_phone: String,
  price: Number,
  paid_date: String, // YYYY-MM-DD
  renewal_date: String, // YYYY-MM-DD
  duration: String,
  type: String,
  category: String,
  notes: String,
  status: String,
  created_by: String,
  created_at: String,
  updated_at: String,
};

// Login Response Type
export const LoginResponseType = {
  access_token: String,
  token_type: String,
  user: UserType,
};

// Dashboard Stats Type
export const DashboardStatsType = {
  total_subscriptions: Number,
  upcoming_renewals: Number,
  renewals_due_today: Number,
  expired_subscriptions: Number,
};
