-- Widget System Tables
-- Create widget library and user widget configuration tables

-- Widget library (available widgets)
CREATE TABLE widget_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  widget_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'stats_xp', 'chart_habits_completion'
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'stats', 'charts', 'gamification', 'social', 'progress'
  min_width INTEGER DEFAULT 1,
  min_height INTEGER DEFAULT 1,
  max_width INTEGER DEFAULT 4,
  max_height INTEGER DEFAULT 4,
  default_width INTEGER DEFAULT 2,
  default_height INTEGER DEFAULT 2,
  available_on TEXT[], -- ['dashboard', 'analytics', 'profile']
  requires_data_source TEXT[], -- ['mastery', 'profile', 'courses']
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User widget configurations
CREATE TABLE user_widget_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  page_type VARCHAR(50) NOT NULL, -- 'dashboard', 'analytics', 'profile'
  widget_key VARCHAR(100) NOT NULL,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  is_locked BOOLEAN DEFAULT false, -- Admin can lock widgets on profiles
  config JSONB, -- Widget-specific settings
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, page_type, widget_key)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_widget_library_category ON widget_library(category);
CREATE INDEX IF NOT EXISTS idx_widget_library_is_active ON widget_library(is_active);
CREATE INDEX IF NOT EXISTS idx_user_widget_configs_user_id ON user_widget_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_widget_configs_page_type ON user_widget_configs(page_type);
CREATE INDEX IF NOT EXISTS idx_user_widget_configs_widget_key ON user_widget_configs(widget_key);

-- RLS policies
ALTER TABLE widget_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_widget_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Widget library viewable by authenticated users" ON widget_library FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can view their own widget configs" ON user_widget_configs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own widget configs" ON user_widget_configs FOR ALL USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE widget_library IS 'Available widgets that can be added to pages';
COMMENT ON TABLE user_widget_configs IS 'User-specific widget configurations and layouts';
COMMENT ON COLUMN widget_library.available_on IS 'Array of pages where widget can be used';
COMMENT ON COLUMN widget_library.requires_data_source IS 'Array of data sources widget needs';
COMMENT ON COLUMN user_widget_configs.config IS 'Widget-specific configuration settings';
COMMENT ON COLUMN user_widget_configs.is_locked IS 'Admin can lock widgets on profiles';
