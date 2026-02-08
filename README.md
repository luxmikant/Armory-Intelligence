<div align="center">

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     █████╗ ██████╗ ███████╗███████╗███╗   ██╗ █████╗ ██╗     ║
║    ██╔══██╗██╔══██╗██╔════╝██╔════╝████╗  ██║██╔══██╗██║     ║
║    ███████║██████╔╝███████╗█████╗  ██╔██╗ ██║███████║██║     ║
║    ██╔══██║██╔══██╗╚════██║██╔══╝  ██║╚██╗██║██╔══██║██║     ║
║    ██║  ██║██║  ██║███████║███████╗██║ ╚████║██║  ██║███████╗║
║    ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝║
║                                                               ║
║                    N E X U S                                  ║
║           Star Wars vs Real World Weapons Analysis           ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

<p align="center">
  <strong>⚔️ A cinematic dark sci-fi weapons database and AI analysis platform ⚔️</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.12-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tambo_AI-Latest-purple?style=for-the-badge" alt="Tambo AI">
  <img src="https://img.shields.io/badge/Supabase-Integrated-green?style=for-the-badge&logo=supabase" alt="Supabase">
</p>

</div>

---

## 🎯 MISSION BRIEF

**Arsenal Nexus** is an immersive weapons analysis platform that bridges two universes: the **Star Wars galaxy** 🌌 and **Real-World military arsenals** 🎖️. Powered by **Tambo AI**, it provides in-depth tactical comparisons, ballistics calculations, safety protocols, and maintenance guides for 19+ weapons across both universes.

### 🌟 Core Capabilities

- **🔫 Dual-Universe Weapons Database**: 9 Real + 10 Sci-Fi weapons with complete specifications
- **🤖 AI-Powered Analysis**: Tambo Generative UI for interactive weapon comparisons
- **📊 Advanced Ballistics**: Real-time trajectory calculations and performance metrics
- **⚖️ Regulations Database**: US state-by-state firearm laws and compliance info
- **🛠️ Maintenance Guides**: Step-by-step cleaning and maintenance procedures
- **🎨 Cinematic Dark Theme**: Deep space + military hangar aesthetic

---

## 🚀 FEATURES

### 🎯 Weapons Catalog
- **19 Fully Detailed Weapons**
  - Real: M4A1, M16A4, .44 Magnum, Glock 19, Barrett M82, M2 Browning, Mossberg 500, Javelin, KA-BAR
  - Star Wars: E-11, DC-15A, DL-44, SE-14C, EE-3, E-Web, Bowcaster, Proton Torpedo, Lightsaber, DC-15S
- **High-Resolution Weapon Images**
- **Detailed Specifications**: Damage, range, fire rate, weight, era, manufacturer
- **Universe Filtering**: Toggle between Real ⚙️ and Sci-Fi ⚡ weapons
- **Search & Filter**: Category-based filtering and full-text search

### 🤖 Tambo AI Integration
- **Generative UI Components**: 11 interactive components for weapon analysis
  - `HologramCard` - 3D weapon visualization
  - `WeaponShowdown` - Head-to-head comparisons
  - `TacticalBriefing` - Mission-ready intel
  - `BallisticsChart` - Trajectory & performance data
  - `ComparisonTable` - Side-by-side spec comparison
  - `InteractiveChecklist` - Safety & maintenance checklists
  - `SafetyWarning` - Critical safety alerts
  - `RegulationCard` - Legal compliance info
  - `StepGuide` - Maintenance procedures
  - `FilterPanel` - Dynamic filtering controls
  - `FirearmCard` - Individual weapon details

### 📊 Technical Analysis
- **Ballistics Calculator**
  - Trajectory plotting
  - Wind drift calculations
  - Energy retention analysis
  - Velocity degradation modeling
- **Comparison Engine**
  - Cross-universe weapon matchups
  - Tactical score comparisons (E-11 vs M4A1, DL-44 vs .44 Magnum, etc.)
  - Performance metrics side-by-side

### 🔒 Safety & Compliance
- **Regulations by State**: Real-time lookup of US firearm laws
- **Safety Protocols**: Interactive safety checklists
- **Maintenance Guides**: Step-by-step weapon care instructions

### 🎨 Design System
- **Cinematic Dark Theme**
  - Void Background: `#030305`
  - Real Weapons Accent: 🟠 Orange `#f97316`
  - Sci-Fi Weapons Accent: 🔵 Cyan `#22d3ee`
- **Custom Animations**
  - Starfield backgrounds
  - Grid patterns
  - Energy pulse effects
  - Gradient text effects
- **Responsive Layout**: Mobile-first design with Tailwind CSS

---

## 🛠️ TECH STACK

### Core Framework
- **[Next.js 15.5.12](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[React 19](https://react.dev/)** - UI library

### AI & Backend
- **[Tambo AI](https://tambo.co/)** - Generative UI & AI streaming
- **[Supabase](https://supabase.com/)** - PostgreSQL database & authentication
- **[Prisma](https://www.prisma.io/)** - Type-safe database ORM

### Styling & Animation
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animations
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon set

### Data Validation
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

---

## ⚙️ INSTALLATION & SETUP

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Tambo API Key ([Get free key](https://tambo.co/dashboard))
- Supabase Project (optional, for database features)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/luxmikant/Armory-Intelligence.git
cd Armory-Intelligence

# Install dependencies
npm install

# Configure environment variables
cp example.env.local .env.local
```

### Environment Configuration

Edit `.env.local`:

```bash
# Required - Tambo AI
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key_here

# Optional - Supabase (for database features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=postgresql://user:pass@host/database
```

### Database Setup (Optional)

```bash
# Run Prisma migrations
npx prisma migrate dev

# Seed the database with weapons
npx prisma db seed
```

### Development Server

```bash
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** to see Arsenal Nexus in action!

---

## 📁 PROJECT STRUCTURE

```
armory-intelligence/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Landing page (scroll showcase)
│   │   ├── catalog/             # Weapons catalog
│   │   ├── chat/                # AI chat interface
│   │   ├── ballistics/          # Ballistics calculator
│   │   ├── regulations/         # Firearm regulations
│   │   ├── safety/              # Safety protocols
│   │   ├── maintenance/         # Maintenance guides
│   │   └── api/                 # API routes
│   ├── components/
│   │   ├── armory/              # 11 Tambo AI components
│   │   ├── tambo/               # Tambo integration components
│   │   ├── showcase/            # Landing page sections
│   │   └── ui/                  # Reusable UI components
│   ├── lib/
│   │   ├── tambo.ts             # Tambo AI configuration
│   │   ├── weapons-data.ts      # 19 weapons database
│   │   ├── design-system.ts     # Cinematic theme system
│   │   ├── supabase.ts          # Database client
│   │   └── utils.ts             # Utility functions
│   └── services/                # Business logic
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── public/
│   └── images/
│       └── weapons/             # 20 weapon images
└── docs/                        # Project documentation
```

---

## 🎮 USAGE GUIDE

### Browsing the Catalog

1. Navigate to **`/catalog`**
2. Use filters to toggle between Real ⚙️ and Sci-Fi ⚡ weapons
3. Search by name, manufacturer, or description
4. Click **"Compare"** to see cross-universe matchups

### AI Chat Analysis

1. Navigate to **`/chat`**
2. Ask questions like:
   - *"Compare the E-11 Blaster to the M4A1 Carbine"*
   - *"What's the best tactical weapon for close quarters?"*
   - *"Show me all sniper rifles"*
3. Tambo AI generates interactive components with analysis

### Ballistics Calculator

1. Navigate to **`/ballistics`**
2. Select a weapon
3. Input firing parameters (distance, wind, angle)
4. View trajectory chart and performance data

### Regulations Lookup

1. Navigate to **`/regulations`**
2. Select your state
3. View firearm laws and compliance requirements

---

## 🎨 DESIGN PHILOSOPHY

### Color Palette

| Universe | Primary | Secondary | Use Case |
|----------|---------|-----------|----------|
| **Void** | `#030305` | `#08090d` | Backgrounds |
| **Real** | 🟠 `#f97316` | `#fb923c` | Real weapons UI |
| **Sci-Fi** | 🔵 `#22d3ee` | `#06b6d4` | Star Wars UI |
| **Neutral** | `#64748b` | `#94a3b8` | Text & borders |

### Typography
- **Headings**: Bold, uppercase, wide tracking
- **Body**: Clean, readable, slate gray
- **Accents**: Gradient text with universe colors

### Animation Principles
- **Subtle entrance**: Fade + scale for cards
- **Hover feedback**: Glow effects on interactive elements
- **Performance**: GPU-accelerated transforms only

---

## 🧩 TAMBO AI COMPONENTS

### Component Registration

All 11 components are registered in `src/lib/tambo.ts`:

```typescript
export const components: TamboComponent[] = [
  {
    name: "HologramCard",
    description: "3D weapon hologram with tactical specs",
    component: HologramCard,
    propsSchema: hologramCardSchema,
  },
  // ... 10 more components
];
```

### Schema Pattern (Null-Safe Streaming)

All components use `.catch()` for null-safe AI streaming:

```typescript
const weaponSchema = z.object({
  name: z.string().catch("Unknown Weapon"),
  damage: z.number().catch(0),
  universe: z.enum(["real", "star-wars"]).catch("real"),
});
```

This prevents `"expected string, received null"` errors during streaming.

---

## 🗄️ DATABASE SCHEMA

### Weapons Table

```sql
- id: UUID
- name: TEXT
- universe: ENUM('real', 'star-wars')
- category: TEXT
- manufacturer: TEXT
- era: TEXT
- description: TEXT
- weight_kg: NUMERIC
- effective_range_m: INTEGER
- damage_rating: INTEGER
- tactical_score: INTEGER
- coolness_factor: INTEGER
- imageUrl: TEXT
- comparison_notes: TEXT
- created_at: TIMESTAMP
```

### Seeding

19 weapons are auto-seeded via `prisma/seed.ts` from `weapons-data.ts`.

---

## 🚢 DEPLOYMENT

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel

# Add environment variables in Vercel dashboard
- NEXT_PUBLIC_TAMBO_API_KEY
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Alternative Platforms
- **Netlify**: Configure build command `npm run build`
- **Railway**: Auto-detects Next.js
- **Docker**: Use included `Dockerfile` (if added)

---

## 🤝 CONTRIBUTING

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style
- Use TypeScript strict mode
- Follow existing component patterns
- Add Zod schemas for all AI components
- Use Tailwind CSS for styling

---

## 📜 LICENSE

This project is **MIT Licensed** - see [LICENSE](LICENSE) file for details.

---

## 🙏 ACKNOWLEDGMENTS

- **[Tambo AI](https://tambo.co/)** - For the incredible Generative UI platform
- **Star Wars Universe** - For the iconic sci-fi weapons
- **Real-World Manufacturers** - For engineering excellence
- **Open Source Community** - For amazing tools and libraries

---

## 📞 SUPPORT & CONTACT

- **Issues**: [GitHub Issues](https://github.com/luxmikant/Armory-Intelligence/issues)
- **Discussions**: [GitHub Discussions](https://github.com/luxmikant/Armory-Intelligence/discussions)
- **Author**: [@luxmikant](https://github.com/luxmikant)

---

<div align="center">

```
╔════════════════════════════════════════════════════════╗
║  Built with ❤️ by the Arsenal Nexus Team              ║
║  Powered by Tambo AI • Next.js • Supabase             ║
╚════════════════════════════════════════════════════════╝
```

**⚔️ May the Force be with your aim. ⚔️**

</div>
