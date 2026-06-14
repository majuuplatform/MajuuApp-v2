-- Create enums

-- Profile roles
CREATE TYPE profile_role AS ENUM ('user', 'agency_admin', 'super_admin');

-- Request status
CREATE TYPE request_status AS ENUM ('NEW', 'IN_PROGRESS', 'DONE');

-- Request result
CREATE TYPE request_result AS ENUM ('SUCCESS', 'FAILED');

-- Payment types
CREATE TYPE payment_type AS ENUM ('UNLOCK_FEE', 'SERVICE_PAYMENT');

-- Payment status
CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- Resource types
CREATE TYPE resource_type AS ENUM ('LINK', 'ARTICLE', 'AFFILIATE');

-- Document origin
CREATE TYPE document_origin AS ENUM ('FORM', 'CHAT', 'USER', 'AGENCY');

-- Document visibility
CREATE TYPE document_visibility AS ENUM ('PRIVATE', 'AGENCY', 'PUBLIC');

-- Form field types
CREATE TYPE form_field_type AS ENUM ('TEXT', 'NUMBER', 'DATE', 'SELECT', 'MULTI_SELECT', 'FILE', 'BOOLEAN');
