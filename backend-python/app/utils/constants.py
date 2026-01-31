"""Application Constants"""

# User roles
USER_ROLE_ADMIN = "admin"
USER_ROLE_STAFF = "staff"

# Subscription types
SUBSCRIPTION_TYPE_PERSONAL = "Personal"
SUBSCRIPTION_TYPE_CLIENT = "Client"
SUBSCRIPTION_TYPE_OFFICIAL = "Official"

# Subscription categories
SUBSCRIPTION_CATEGORIES = [
    "Domain",
    "Hosting Platform",
    "WhatsApp API",
    "SSL",
    "Cloud Service",
    "Others"
]

# Subscription durations
SUBSCRIPTION_DURATIONS = [
    "Monthly",
    "3 Months",
    "6 Months",
    "1 Year",
    "2 Years",
    "3 Years"
]

# Subscription statuses
SUBSCRIPTION_STATUS_UPCOMING = "Upcoming"
SUBSCRIPTION_STATUS_ACTIVE = "Active"
SUBSCRIPTION_STATUS_EXPIRING_SOON = "Expiring Soon"
SUBSCRIPTION_STATUS_EXPIRING_TODAY = "Expiring Today"
SUBSCRIPTION_STATUS_EXPIRED = "Expired"

# Status calculation days
STATUS_EXPIRING_TODAY_DAYS = 0
STATUS_EXPIRING_SOON_DAYS = 30
STATUS_ACTIVE_DAYS = 90
