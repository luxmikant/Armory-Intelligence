# Armory Intelligence - Design Document

> **Version:** 1.0  
> **Last Updated:** February 4, 2026  
> **Status:** Active Development

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                            │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Chat UI   │  │  Explorer   │  │  Ballistics │  │  Regulation │    │
│  │  Interface  │  │    View     │  │  Simulator  │  │  Navigator  │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                │                │            │
│         └────────────────┴────────────────┴────────────────┘            │
│                                   │                                      │
│                      ┌────────────┴────────────┐                        │
│                      │     TamboProvider       │                        │
│                      │  (Component Registry)   │                        │
│                      └────────────┬────────────┘                        │
└──────────────────────────────────┼──────────────────────────────────────┘
                                   │
                          HTTPS / WebSocket
                                   │
┌──────────────────────────────────┼──────────────────────────────────────┐
│                              SERVER                                      │
├──────────────────────────────────┼──────────────────────────────────────┤
│                      ┌───────────┴───────────┐                          │
│                      │    Next.js 14 API     │                          │
│                      │    (App Router)       │                          │
│                      └───────────┬───────────┘                          │
│         ┌────────────────────────┼────────────────────────┐             │
│         │                        │                        │             │
│  ┌──────┴──────┐         ┌──────┴──────┐         ┌──────┴──────┐       │
│  │   Tambo     │         │     MCP     │         │   Prisma    │       │
│  │   Cloud     │         │   Server    │         │     ORM     │       │
│  └─────────────┘         └──────┬──────┘         └──────┬──────┘       │
│                                 │                       │               │
│                      ┌──────────┴──────────┐           │               │
│                      │                     │           │               │
│               ┌──────┴──────┐       ┌──────┴──────┐   │               │
│               │  Ballistics │       │    Legal    │   │               │
│               │   Engine    │       │   Database  │   │               │
│               └─────────────┘       └─────────────┘   │               │
│                                                       │               │
│                                            ┌──────────┴──────────┐    │
│                                            │     PostgreSQL      │    │
│                                            │   (Neon/Supabase)   │    │
│                                            └─────────────────────┘    │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
armory-intelligence/
├── src/
│   ├── app/                          # Next.js 14 App Router
│   │   ├── layout.tsx                # Root layout with TamboProvider
│   │   ├── page.tsx                  # Landing page
│   │   ├── globals.css               # Global styles
│   │   ├── chat/
│   │   │   └── page.tsx              # Main AI chat interface
│   │   └── api/
│   │       ├── firearms/
│   │       │   ├── route.ts          # GET /api/firearms
│   │       │   └── [id]/route.ts     # GET /api/firearms/:id
│   │       ├── ballistics/
│   │       │   └── route.ts          # POST /api/ballistics/calculate
│   │       ├── regulations/
│   │       │   └── [state]/route.ts  # GET /api/regulations/:state
│   │       └── mcp/
│   │           └── route.ts          # MCP server endpoint
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   │
│   │   ├── tambo/                    # Tambo-registered components
│   │   │   ├── firearm-card.tsx
│   │   │   ├── comparison-table.tsx
│   │   │   ├── safety-warning.tsx
│   │   │   ├── interactive-checklist.tsx
│   │   │   ├── filter-panel.tsx
│   │   │   ├── ballistics-chart.tsx
│   │   │   ├── regulation-card.tsx
│   │   │   ├── step-guide.tsx
│   │   │   ├── quiz-component.tsx
│   │   │   └── index.ts              # Component registry export
│   │   │
│   │   ├── chat/                     # Chat interface components
│   │   │   ├── chat-container.tsx
│   │   │   ├── message-list.tsx
│   │   │   ├── message-item.tsx
│   │   │   └── chat-input.tsx
│   │   │
│   │   └── layout/                   # Layout components
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── footer.tsx
│   │
│   ├── lib/
│   │   ├── tambo/
│   │   │   ├── provider.tsx          # TamboProvider wrapper
│   │   │   ├── components.ts         # Component registration
│   │   │   ├── tools.ts              # Tool definitions
│   │   │   └── mcp-config.ts         # MCP server configuration
│   │   │
│   │   ├── db/
│   │   │   ├── index.ts              # Prisma client export
│   │   │   └── queries/              # Database query helpers
│   │   │       ├── firearms.ts
│   │   │       ├── regulations.ts
│   │   │       └── guides.ts
│   │   │
│   │   ├── ballistics/
│   │   │   ├── calculator.ts         # Ballistics calculations
│   │   │   ├── constants.ts          # Physical constants
│   │   │   └── types.ts              # Ballistics types
│   │   │
│   │   └── utils/
│   │       ├── cn.ts                 # Class name utility
│   │       └── format.ts             # Formatting helpers
│   │
│   ├── schemas/                      # Zod validation schemas
│   │   ├── firearm.ts
│   │   ├── regulation.ts
│   │   ├── ballistics.ts
│   │   └── guide.ts
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── firearm.ts
│   │   ├── regulation.ts
│   │   └── ballistics.ts
│   │
│   └── data/                         # Static/seed data
│       ├── firearms-seed.json
│       ├── regulations-seed.json
│       └── calibers.json
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── seed.ts                       # Database seeder
│   └── migrations/                   # Migration files
│
├── public/
│   ├── images/
│   │   └── firearms/                 # Firearm images
│   ├── models/                       # 3D models (future)
│   └── icons/
│
├── docs/                             # Documentation
│   ├── REQUIREMENTS.md
│   ├── DESIGN.md
│   └── TASKS.md
│
├── .env.local                        # Environment variables
├── .env.example                      # Environment template
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework with App Router |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| @tambo-ai/react | latest | AI SDK for generative UI |
| Tailwind CSS | 3.x | Utility-first styling |
| shadcn/ui | latest | Component library |
| Framer Motion | 10.x | Animations |
| Recharts | 2.x | Data visualization |
| Zod | 3.x | Schema validation |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 14.x | API endpoints |
| Prisma | 5.x | Database ORM |
| PostgreSQL | 15.x | Primary database |
| Neon/Supabase | - | Managed PostgreSQL |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Vercel | Deployment & hosting |
| Tambo Cloud | AI processing |
| GitHub | Source control |

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--color-navy-950: #0F172A;    /* Primary background */
--color-navy-900: #1E293B;    /* Card backgrounds */
--color-navy-800: #334155;    /* Elevated surfaces */
--color-navy-700: #475569;    /* Borders */

/* Accent Colors */
--color-orange-500: #F97316;  /* Primary accent */
--color-orange-600: #EA580C;  /* Accent hover */
--color-orange-400: #FB923C;  /* Accent light */

/* Semantic Colors */
--color-success: #22C55E;     /* Success states */
--color-warning: #F59E0B;     /* Warning states */
--color-danger: #EF4444;      /* Error/danger states */
--color-info: #3B82F6;        /* Info states */

/* Neutral Colors */
--color-slate-50: #F8FAFC;    /* Light text */
--color-slate-100: #F1F5F9;   /* Secondary text */
--color-slate-400: #94A3B8;   /* Muted text */
--color-slate-600: #475569;   /* Dark muted */
```

### Typography

```css
/* Font Family */
--font-heading: 'Inter', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing Scale

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;  /* Pill shape */
```

---

## 🧩 Component Architecture

### Tambo Component Registry

```typescript
// Component Registration Pattern
const components: TamboComponent[] = [
  {
    name: "FirearmCard",
    description: "Displays detailed firearm specifications including name, caliber, capacity, weight, and pricing. Use when showing individual firearm details or search results.",
    component: FirearmCard,
    propsSchema: z.object({
      id: z.string().describe("Unique firearm identifier"),
      name: z.string().describe("Full firearm name with model"),
      manufacturer: z.string().describe("Manufacturer name"),
      type: z.enum(["handgun", "rifle", "shotgun"]).describe("Firearm category"),
      caliber: z.string().describe("Primary caliber"),
      capacity: z.number().describe("Magazine capacity"),
      weight: z.number().describe("Weight in pounds"),
      barrelLength: z.number().describe("Barrel length in inches"),
      price: z.number().optional().describe("MSRP in USD"),
      imageUrl: z.string().optional().describe("Product image URL"),
    }),
  },
  // ... additional components
];
```

### Component Specifications

#### 1. FirearmCard
**Purpose:** Display individual firearm specifications
**Props:**
- `id`: string - Unique identifier
- `name`: string - Full firearm name
- `manufacturer`: string - Manufacturer
- `type`: enum - handgun/rifle/shotgun
- `caliber`: string - Primary caliber
- `capacity`: number - Magazine capacity
- `weight`: number - Weight (lbs)
- `barrelLength`: number - Barrel length (in)
- `price`: number (optional) - MSRP
- `imageUrl`: string (optional) - Image

#### 2. ComparisonTable
**Purpose:** Side-by-side comparison of 2-4 firearms
**Props:**
- `firearms`: array - Array of firearm objects
- `highlightDifferences`: boolean - Highlight different values

#### 3. SafetyWarning
**Purpose:** Prominent safety alerts and warnings
**Props:**
- `level`: enum - info/warning/danger
- `title`: string - Warning title
- `message`: string - Warning details
- `actions`: array (optional) - Suggested actions

#### 4. InteractiveChecklist
**Purpose:** Trackable safety/maintenance checklists
**Props:**
- `title`: string - Checklist title
- `items`: array - Checklist items with labels
- `category`: enum - safety/maintenance/legal

#### 5. FilterPanel
**Purpose:** Dynamic search filters for firearm explorer
**Props:**
- `filters`: object - Available filter options
- `selected`: object - Currently selected filters
- `onFilterChange`: function - Filter change handler

#### 6. BallisticsChart
**Purpose:** Trajectory visualization with real-time updates
**Props:**
- `caliber`: string - Selected caliber
- `distance`: number - Target distance (yards)
- `windSpeed`: number - Wind speed (mph)
- `elevation`: number - Elevation change (ft)
- `comparisons`: array (optional) - Additional calibers to compare

#### 7. RegulationCard
**Purpose:** State-specific legal information display
**Props:**
- `state`: string - State code
- `category`: enum - carry/purchase/storage/transport
- `requirements`: array - List of requirements
- `restrictions`: array - List of restrictions
- `lastUpdated`: date - Last verification date

#### 8. StepGuide
**Purpose:** Step-by-step procedural instructions
**Props:**
- `title`: string - Guide title
- `steps`: array - Array of step objects
- `currentStep`: number - Active step index
- `tools`: array (optional) - Required tools

#### 9. QuizComponent
**Purpose:** Interactive knowledge assessment
**Props:**
- `title`: string - Quiz title
- `questions`: array - Array of question objects
- `showResults`: boolean - Display results on completion

---

## 🔧 Tool Definitions

### searchFirearms
```typescript
defineTool({
  name: "searchFirearms",
  description: "Search the firearms database by various criteria including name, caliber, type, manufacturer, or use case. Returns matching firearms with specifications.",
  inputSchema: z.object({
    query: z.string().optional().describe("Search query string"),
    type: z.enum(["handgun", "rifle", "shotgun"]).optional(),
    caliber: z.string().optional(),
    manufacturer: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    limit: z.number().default(10),
  }),
  outputSchema: z.object({
    firearms: z.array(FirearmSchema),
    total: z.number(),
  }),
});
```

### calculateBallistics
```typescript
defineTool({
  name: "calculateBallistics",
  description: "Calculate bullet trajectory including drop, drift, and energy at specified distances. Accounts for environmental factors.",
  inputSchema: z.object({
    caliber: z.string().describe("Caliber name"),
    distance: z.number().describe("Distance in yards"),
    windSpeed: z.number().default(0).describe("Wind speed in mph"),
    windAngle: z.number().default(90).describe("Wind angle in degrees"),
    elevation: z.number().default(0).describe("Elevation change in feet"),
    temperature: z.number().default(59).describe("Temperature in Fahrenheit"),
  }),
  outputSchema: z.object({
    drop: z.number().describe("Bullet drop in inches"),
    drift: z.number().describe("Wind drift in inches"),
    velocity: z.number().describe("Velocity at distance in fps"),
    energy: z.number().describe("Energy at distance in ft-lbs"),
    flightTime: z.number().describe("Time of flight in seconds"),
  }),
});
```

### getStateRegulations
```typescript
defineTool({
  name: "getStateRegulations",
  description: "Retrieve firearm regulations for a specific state including carry laws, purchase requirements, and restrictions.",
  inputSchema: z.object({
    state: z.string().describe("State code (e.g., TX, CA)"),
    category: z.enum(["carry", "purchase", "storage", "transport"]).optional(),
  }),
  outputSchema: z.object({
    state: z.string(),
    stateName: z.string(),
    regulations: z.array(RegulationSchema),
    reciprocity: z.array(z.string()),
    lastUpdated: z.string(),
  }),
});
```

---

## 🗄️ Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Firearm {
  id             String   @id @default(cuid())
  name           String
  manufacturer   String
  type           FirearmType
  action         String
  caliber        String
  capacity       Int
  weight         Float
  barrelLength   Float
  overallLength  Float?
  price          Float?
  imageUrl       String?
  model3dUrl     String?
  specifications Json
  history        String?
  pros           String[]
  cons           String[]
  useCases       String[]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  maintenanceGuides MaintenanceGuide[]

  @@index([type])
  @@index([caliber])
  @@index([manufacturer])
}

enum FirearmType {
  handgun
  rifle
  shotgun
}

model MaintenanceGuide {
  id          String   @id @default(cuid())
  firearmId   String
  firearm     Firearm  @relation(fields: [firearmId], references: [id])
  title       String
  type        GuideType
  difficulty  Difficulty
  timeMinutes Int
  steps       Json     // Array of { step: number, title: string, description: string, imageUrl?: string, warning?: string }
  tools       String[] // Required tools
  videoUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([firearmId])
  @@index([type])
}

enum GuideType {
  cleaning
  assembly
  disassembly
  troubleshooting
}

enum Difficulty {
  beginner
  intermediate
  advanced
}

model Regulation {
  id            String   @id @default(cuid())
  state         String   @unique
  stateName     String
  permitRequired Boolean
  permitType    String?
  minAge        Int
  trainingRequired Boolean
  trainingHours Int?
  fee           Float?
  processingDays Int?
  requirements  Json     // Array of requirement objects
  restrictions  Json     // Array of restriction objects
  reciprocity   String[] // Array of state codes
  openCarry     Boolean
  concealedCarry Boolean
  castleDoctrine Boolean
  standYourGround Boolean
  redFlagLaw    Boolean
  lastVerified  DateTime
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([state])
}

model Caliber {
  id               String  @id @default(cuid())
  name             String  @unique
  bulletDiameter   Float   // inches
  caseLength       Float   // inches
  muzzleVelocity   Int     // fps (average)
  muzzleEnergy     Int     // ft-lbs
  ballisticCoeff   Float   // G1 BC
  typicalUse       String[]
  commonFirearms   String[]
}

model UserProgress {
  id               String   @id @default(cuid())
  clerkUserId      String   @unique
  completedQuizzes Json     // Array of { quizId: string, score: number, completedAt: date }
  badges           String[]
  checklistProgress Json    // { checklistId: progress }
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model Quiz {
  id          String   @id @default(cuid())
  title       String
  category    String
  difficulty  Difficulty
  questions   Json     // Array of question objects
  passingScore Int     @default(70)
  createdAt   DateTime @default(now())
}
```

---

## 🌐 API Endpoints

### Firearms API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/firearms` | List/search firearms |
| GET | `/api/firearms/:id` | Get firearm by ID |
| GET | `/api/firearms/compare` | Compare multiple firearms |

### Ballistics API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ballistics/calculate` | Calculate trajectory |
| GET | `/api/ballistics/calibers` | List available calibers |

### Regulations API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/regulations/:state` | Get state regulations |
| GET | `/api/regulations/reciprocity/:state` | Get reciprocity map |

### MCP Server

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/mcp` | MCP request handler |

---

## 🔐 Environment Variables

```env
# .env.example

# Tambo AI
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key

# Database
DATABASE_URL=postgresql://user:password@host:5432/armory_intelligence

# Optional: Authentication (future)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
# CLERK_SECRET_KEY=

# Optional: Analytics (future)
# NEXT_PUBLIC_POSTHOG_KEY=
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
/* Default: < 640px (mobile) */

/* sm: 640px and up (large phones) */
@media (min-width: 640px) { }

/* md: 768px and up (tablets) */
@media (min-width: 768px) { }

/* lg: 1024px and up (laptops) */
@media (min-width: 1024px) { }

/* xl: 1280px and up (desktops) */
@media (min-width: 1280px) { }

/* 2xl: 1536px and up (large screens) */
@media (min-width: 1536px) { }
```

---

## 📝 Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-02-04 | 1.0 | Initial design document | System |

---

*This document is the source of truth for all technical design decisions.*
