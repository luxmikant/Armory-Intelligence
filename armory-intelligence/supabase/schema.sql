-- ============================================
-- Arsenal Nexus Database Schema
-- Star Wars × Modern Military Arsenal
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- WEAPONS TABLE (unified for real & sci-fi)
-- ============================================
CREATE TABLE IF NOT EXISTS weapons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  universe TEXT NOT NULL CHECK (universe IN ('real', 'star-wars')),
  category TEXT NOT NULL CHECK (category IN ('blaster', 'rifle', 'handgun', 'shotgun', 'lightsaber', 'heavy', 'explosive', 'melee', 'sniper')),
  manufacturer TEXT NOT NULL DEFAULT 'Unknown',
  era TEXT NOT NULL DEFAULT 'Modern',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,

  -- Shared stats
  weight_kg FLOAT NOT NULL DEFAULT 0,
  effective_range_m FLOAT NOT NULL DEFAULT 0,
  rate_of_fire INTEGER,
  damage_rating INTEGER NOT NULL DEFAULT 50 CHECK (damage_rating BETWEEN 1 AND 100),

  -- Real-world specific
  caliber TEXT,
  muzzle_velocity_ms FLOAT,
  capacity INTEGER,
  price_usd FLOAT,
  action_type TEXT,

  -- Sci-fi specific
  energy_output_kj FLOAT,
  plasma_temperature_k FLOAT,
  kyber_crystal_type TEXT,
  stun_setting BOOLEAN DEFAULT FALSE,
  ammo_type TEXT,

  -- Scores
  tactical_score INTEGER NOT NULL DEFAULT 50 CHECK (tactical_score BETWEEN 1 AND 100),
  coolness_factor INTEGER NOT NULL DEFAULT 50 CHECK (coolness_factor BETWEEN 1 AND 100),
  community_rating FLOAT NOT NULL DEFAULT 0,
  total_votes INTEGER NOT NULL DEFAULT 0,

  -- Cross-reference
  real_world_equivalent_id UUID REFERENCES weapons(id),
  comparison_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMPARISON SESSIONS (real-time collaborative)
-- ============================================
CREATE TABLE IF NOT EXISTS comparison_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_name TEXT NOT NULL,
  weapon_ids UUID[] NOT NULL DEFAULT '{}',
  votes JSONB NOT NULL DEFAULT '{}',
  is_live BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WEAPON RATINGS (community)
-- ============================================
CREATE TABLE IF NOT EXISTS weapon_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  weapon_id UUID NOT NULL REFERENCES weapons(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  rating FLOAT NOT NULL CHECK (rating BETWEEN 0 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_weapons_universe ON weapons(universe);
CREATE INDEX IF NOT EXISTS idx_weapons_category ON weapons(category);
CREATE INDEX IF NOT EXISTS idx_weapons_name ON weapons(name);
CREATE INDEX IF NOT EXISTS idx_weapon_ratings_weapon ON weapon_ratings(weapon_id);

-- ============================================
-- ENABLE REAL-TIME (run separately if needed)
-- ============================================
-- ALTER PUBLICATION supabase_realtime ADD TABLE weapons;
-- ALTER PUBLICATION supabase_realtime ADD TABLE comparison_sessions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE weapon_ratings;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE weapons ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weapon_ratings ENABLE ROW LEVEL SECURITY;

-- Public read for all
CREATE POLICY "Public read weapons" ON weapons FOR SELECT USING (true);
CREATE POLICY "Public read sessions" ON comparison_sessions FOR SELECT USING (true);
CREATE POLICY "Public read ratings" ON weapon_ratings FOR SELECT USING (true);

-- Public insert for ratings and sessions (hackathon - no auth required)
CREATE POLICY "Public insert ratings" ON weapon_ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert sessions" ON comparison_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update sessions" ON comparison_sessions FOR UPDATE USING (true);
