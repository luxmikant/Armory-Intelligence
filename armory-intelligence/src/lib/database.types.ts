/**
 * @file database.types.ts
 * @description TypeScript types for Supabase database schema
 * Arsenal Nexus - Star Wars × Modern Military
 */

export type WeaponUniverse = "real" | "star-wars";
export type WeaponCategory = "blaster" | "rifle" | "handgun" | "shotgun" | "lightsaber" | "heavy" | "explosive" | "melee" | "sniper";

export interface Weapon {
  id: string;
  name: string;
  universe: WeaponUniverse;
  category: WeaponCategory;
  manufacturer: string;
  era: string;
  description: string;
  image_url?: string;

  // Shared stats
  weight_kg: number;
  effective_range_m: number;
  rate_of_fire?: number;
  damage_rating: number; // 1-100 normalized score

  // Real-world specific
  caliber?: string;
  muzzle_velocity_ms?: number;
  capacity?: number;
  price_usd?: number;
  action_type?: string;

  // Sci-fi specific
  energy_output_kj?: number;
  plasma_temperature_k?: number;
  kyber_crystal_type?: string;
  stun_setting?: boolean;
  ammo_type?: string;

  // Computed/community
  tactical_score: number;    // 1-100
  coolness_factor: number;   // 1-100
  community_rating: number;  // 0-5
  total_votes: number;

  // Comparison mapping
  real_world_equivalent_id?: string;
  comparison_notes?: string;

  created_at: string;
  updated_at: string;
}

export interface ComparisonSession {
  id: string;
  session_name: string;
  weapon_ids: string[];
  votes: Record<string, number>; // weapon_id -> vote count
  is_live: boolean;
  created_at: string;
}

export interface WeaponRating {
  id: string;
  weapon_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

// Supabase Database type interface
export interface Database {
  public: {
    Tables: {
      weapons: {
        Row: Weapon;
        Insert: Omit<Weapon, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Weapon, "id" | "created_at">>;
      };
      comparison_sessions: {
        Row: ComparisonSession;
        Insert: Omit<ComparisonSession, "id" | "created_at">;
        Update: Partial<Omit<ComparisonSession, "id" | "created_at">>;
      };
      weapon_ratings: {
        Row: WeaponRating;
        Insert: Omit<WeaponRating, "id" | "created_at">;
        Update: Partial<Omit<WeaponRating, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
