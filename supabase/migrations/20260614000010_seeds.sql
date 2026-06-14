-- Seeds Migration

-- 1. Insert Core Categories
INSERT INTO public.categories (id, title, description, icon_url)
VALUES
  ('STUDY', 'Study Abroad', 'University admissions, scholarships, and student visas', '/icons/study.svg'),
  ('WORK', 'Work Abroad', 'Job placement, work permits, and professional migration', '/icons/work.svg')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- 2. Insert Initial Countries
INSERT INTO public.countries (iso_code, name, currency_code)
VALUES
  -- Europe
  ('DE', 'Germany', 'EUR'),
  ('GB', 'United Kingdom', 'GBP'),
  ('FR', 'France', 'EUR'),
  ('NL', 'Netherlands', 'EUR'),
  ('PL', 'Poland', 'PLN'),
  ('PT', 'Portugal', 'EUR'),
  ('ES', 'Spain', 'EUR'),
  ('IT', 'Italy', 'EUR'),
  ('IE', 'Ireland', 'EUR'),
  ('FI', 'Finland', 'EUR'),
  ('SE', 'Sweden', 'SEK'),
  ('DK', 'Denmark', 'DKK'),
  ('NO', 'Norway', 'NOK'),
  ('CZ', 'Czech Republic', 'CZK'),
  ('AT', 'Austria', 'EUR'),
  
  -- Americas
  ('CA', 'Canada', 'CAD'),
  ('US', 'United States', 'USD'),
  
  -- Oceania
  ('AU', 'Australia', 'AUD'),
  ('NZ', 'New Zealand', 'NZD'),
  
  -- Asia
  ('AE', 'United Arab Emirates', 'AED'),
  ('QA', 'Qatar', 'QAR'),
  ('JP', 'Japan', 'JPY'),
  ('KR', 'South Korea', 'KRW'),
  ('SG', 'Singapore', 'SGD'),
  
  -- Africa
  ('KE', 'Kenya', 'KES'),
  ('ZA', 'South Africa', 'ZAR'),
  ('RW', 'Rwanda', 'RWF'),
  ('EG', 'Egypt', 'EGP'),
  ('MU', 'Mauritius', 'MUR')
ON CONFLICT (iso_code) DO NOTHING;
