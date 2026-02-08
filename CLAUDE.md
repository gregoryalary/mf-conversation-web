# CLAUDE.md - MF Conversation Web

## Project Overview

Web equivalent of the MF Conversation mobile app. Personal React web app for couples communication. Built for two specific users (no login system). Connects to the same Supabase backend as the mobile app.

**Context**: This is a private app for personal use - security considerations are relaxed, and no authentication system is needed.

## Tech Stack

### Core
- React 19 + React DOM
- TypeScript ~5.9
- Vite (rolldown-vite)
- Yarn

### Key Libraries
- **State Management**: TanStack Query (no Redux)
- **Backend**: Supabase (PostgreSQL + Realtime + Storage)
- **Validation**: Zod
- **Code Quality**: Biome 2.3 (linting + formatting)

### Services Integration
- **Supabase**: https://kzvkyjrcnwgvrgxtprty.supabase.co

## Architecture

### Structure
```
src/
├── app/              # Core setup, Supabase client, global utils
├── conversation/     # Main messaging feature
├── on-boarding/      # Profile selection
├── storage/          # localStorage wrapper
└── theme/            # Design system constants
```

### Data Flow
```
User Action → Component → Hook (TanStack Query) → API Util (Supabase) → Backend
                ↑                                                           ↓
                └──────────────── Query Cache Update ←─ Real-time Sub ─────┘
```

### State Management
- **Server State**: TanStack Query with Supabase Realtime subscriptions
- **Local State**: React useState/useRef
- **Persistent State**: localStorage (profile, drafts)

## Code Conventions

### File Organization
Files are organized by **feature**, then by **intention**:
```
featureA/
├── hooks/
├── components/
├── types/
└── utils/
```

### Naming Conventions
- **Hook**: `useFeatureAThing.hook.ts` → default export
- **Component**: `FeatureAThing.component.tsx` → default export
- **Type**: `feature-a-thing.type.ts` → named export
- **Util**: `feature-a-thing.util.ts` → named export

### Component Patterns
```typescript
// Always type components as FC
type Props = {
    userId: number;
    onClick?: () => void;
};

const FeatureAThing: FC<Props> = ({ userId, onClick }) => {
    // Use early returns instead of JSX composition
    if (!userId) {
        return null;
    }

    return (
        <div>
            <span>Hello</span>
        </div>
    );
};

export default FeatureAThing;
```

### Type Safety Rules
**CRITICAL**: Never use `as` for type assertions.

- If type is uncertain, mark as `unknown`
- Check types using vanilla JS or Zod for complex structures
- All API responses validated with Zod schemas

```typescript
// DON'T
const data = apiResponse as MyType;

// DO
const data: unknown = apiResponse;
const validated = await MySchema.parseAsync(data);

// DO (simple checks)
if (typeof data === 'string') {
    // data is string here
}
```

### Import Conventions
**ALWAYS use absolute imports** with the `@/` path alias - never use relative imports.

```typescript
// DON'T - relative imports
import { THEME } from "../../theme";
import AppText from "../components/AppText.component";

// DO - absolute imports with @/ alias
import { THEME } from "@/theme";
import SomeComponent from "@/app/components/SomeComponent.component";
```

### Styling
- **Colors**: Use `THEME` constants from `src/theme/`
- **CSS**: Use CSS modules or inline styles (no global CSS beyond reset/base)

### Formatting
After editing files, always format with Biome:
```bash
npx biome check <filePath> --write --unsafe
```

### Testing
**No tests required** - testing infrastructure exists but is not used.

## Key Patterns

### 1. Zod Schema Normalization
Transform snake_case API to camelCase app:
```typescript
const schema = z.object({
    sent_at: z.string().transform(v => new Date(v)),
    sent_by: z.number()
}).transform(data => ({
    sentAt: data.sent_at,
    sentBy: data.sent_by
}));
```

### 2. Timezone-Aware Formatting
All dates use Europe/Paris timezone:
```typescript
const formatter = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris"
});
```

### 3. Mutation State Tracking
Show pending messages optimistically:
```typescript
const pendingMessages = useMutationState({
    filters: { mutationKey, status: "pending" },
    select: (mutation) => mutation.state.variables
});
```

## Database Structure (Supabase)

Shared with the mobile app. See `mf-conversation-app/CLAUDE.md` for full schema details.

### Tables
- `profiles` - User profiles (name, picture)
- `couples` - Relationship records
- `couple_conversations` - Conversation metadata + settings
- `couple_conversation_messages` - Chat messages
- `couple_conversation_message_images` - Image attachments

### Real-time Subscriptions
- Message inserts/updates
- Conversation settings changes

### Storage
- `message` bucket for uploaded images

## Path Aliases

`@/` → `./src/`

**ALWAYS use absolute imports** with `@/` - never relative imports.

## Development Workflow

### Run
```bash
yarn dev          # Start Vite dev server
yarn build        # TypeScript check + production build
yarn preview      # Preview production build
```

### Code Quality
```bash
npx biome check --write --unsafe      # Format all files
npx biome check <file> --write        # Format specific file
```

## Notes
- No environment variables system (hardcoded credentials acceptable for personal use)
- No offline-first strategy (relies on TanStack Query caching)
- Couple profiles are pre-defined (no user registration)
- Daily message limits configurable per conversation
- Settings changes require partner approval (proposal system)
- Web app does NOT include: maps feature, push notifications, voice recording
