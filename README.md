# TS_Elearning_Web

A comprehensive, production-ready e-learning platform built with modern web technologies for managing online education, courses, quizzes, and student progress tracking.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Architecture](#project-architecture)
- [Usage](#usage)
- [Development](#development)
- [Production Build](#production-build)
- [Docker Deployment](#docker-deployment)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## Features

-  **Course Management** - Create and manage online courses with structured content
-  **Quiz System** - Build and administer quizzes with automatic grading and progress tracking
-  **Class Management** - Organize students into classes with role-based access control
-  **Progress Tracking** - Monitor student learning paths, achievements, and performance metrics
-  **Authentication** - Secure user authentication with JWT tokens and role-based authorization
-  **Multi-language Support** - Full internationalization (English & Vietnamese)
-  **Responsive UI** - Material-UI based responsive design for all devices
-  **Lesson Management** - Structured lesson organization with categories and content
-  **Analytics & Reports** - Detailed reports on student performance and course completion
-  **Notifications System** - Real-time notifications for events and updates
-  **File Management** - Upload and manage course materials (multipart/form-data support)

## Tech Stack

### Frontend
- **Framework**: [Next.js 14+](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [Material-UI (MUI) 5.15+](https://mui.com/)
- **Styling**: [Emotion](https://emotion.sh/) + CSS-in-JS
- **Icons**: Phosphor Icons, MUI Icons
- **State Management**: React Context API
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Date Handling**: [DayJS](https://day.js.org/)
- **i18n**: [i18next](https://www.i18next.com/) with React integration
- **Data Visualization**: ApexCharts
- **Maps**: Leaflet, React Leaflet
- **Code Formatting**: Prettier with import sorting

### Development
- **Package Manager**: pnpm or npm
- **Runtime**: Node.js 18+ (LTS recommended)
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git

## Requirements

- **Node.js**: 18+ (LTS recommended)
- **Package Manager**: pnpm (recommended) or npm
- **Docker** (optional): For containerized deployment
- **Git**: For version control
- **Environment Variables**: API base URLs configured

## Installation

### Step 1: Clone the Repository

```bash
git clone https://git.trungsoncare.com/trungsoncare/ts_elearning_web.git
cd ts_elearning_web
git branch -M main
```

### Step 2: Install Dependencies

Using pnpm (recommended):
```bash
pnpm install
```

Or using npm:
```bash
npm install
```

### Step 3: Configure Environment

Create `.env.local` file with the following variables:

```env
NEXT_PUBLIC_PRODUCTION_BASE_URL=https://api.example.com
NEXT_PUBLIC_DEV_BASE_URL=https://dev-api.example.com
NEXT_PUBLIC_LOCAL_DEV_BASE_URL=http://localhost:5000
NEXT_PUBLIC_LOCAL_PRODUCTION_BASE_URL=http://localhost:5000
```

## Quick Start

### Development Server

Start the dev server with hot reload:

```bash
# with pnpm
pnpm dev

# or with npm
npm run dev
```

The application will be available at `http://localhost:3000`

### Type Checking

```bash
npm run typecheck
```

### Code Formatting

```bash
# Format all files
npm run format:write

# Check formatting
npm run format:check
```

## Project Architecture

### Clean Architecture Pattern

The project follows **Clean Architecture** (also known as Onion Architecture) with clear separation of concerns:

```
src/
├── app/                          # Next.js App Router & Pages
│   ├── api/                     # API routes
│   ├── auth/                    # Authentication pages
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── reset-password/
│   ├── dashboard/               # Main dashboard
│   │   ├── class/              # Class management
│   │   ├── exam/               # Exam management
│   │   ├── quiz/               # Quiz system
│   │   ├── progress/           # Progress tracking
│   │   ├── questions/          # Question bank
│   │   ├── report/             # Reports & analytics
│   │   ├── linear/             # Linear learning paths
│   │   ├── modular/            # Modular courses
│   │   └── ...
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
│
├── presentation/               # Presentation Layer (UI)
│   ├── components/             # Reusable React components
│   │   ├── auth/
│   │   ├── core/               # Core components (snackbar, etc.)
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── shared/             # Shared components
│   │   └── user/
│   ├── contexts/               # React contexts
│   │   └── user-context.tsx
│   └── hooks/                  # Custom React hooks
│       ├── use-dependency-container.tsx
│       ├── use-user.ts
│       ├── use-selection.ts
│       └── ...
│
├── domain/                     # Domain Layer (Business Logic)
│   ├── models/                 # Domain entities & types
│   │   ├── answer/
│   │   ├── auth/
│   │   ├── category/
│   │   ├── class/
│   │   ├── courses/
│   │   ├── user/
│   │   └── ...
│   ├── repositories/           # Repository interfaces
│   │   ├── NotificationRepository.ts
│   │   ├── answer/
│   │   ├── auth/
│   │   └── ...
│   └── usecases/               # Business use cases
│       ├── SendNotificationUseCase.ts
│       ├── answer/
│       ├── auth/
│       └── ...
│
├── data/                       # Data Layer (Repositories & API)
│   ├── api/
│   │   ├── base-endpoints.ts   # Axios instance & interceptors
│   │   ├── api-endpoints.ts    # Endpoint definitions
│   │   ├── api-client.ts       # API client wrapper
│   │   └── geocoding/
│   └── repositories/           # Repository implementations
│       ├── NotificationRepoImpl.ts
│       ├── answer/
│       ├── auth/
│       └── ...
│
├── lib/                        # Utility Libraries
│   ├── auth/                   # Auth utilities
│   ├── logger.ts               # Logging
│   ├── default-logger.ts
│   └── ...
│
├── types/                      # TypeScript type definitions
│   ├── nav.d.ts
│   └── user.ts
│
├── utils/                      # Utility Functions
│   ├── app-actions.ts
│   ├── app-strings.ts          # Constants & storage keys
│   ├── store-manager.ts        # Local storage management
│   ├── date-time-utils.ts
│   ├── string-utils.ts
│   ├── enum/
│   └── string/
│
├── styles/                     # Global Styles
│   ├── global.css
│   └── theme/                  # MUI theme configuration
│
├── locale/                     # i18n Translations
│   ├── en.json
│   └── vi.json
│
├── config.ts                   # App configuration
├── dependency-container.ts     # IoC container setup
└── i18n.ts                     # i18n initialization
```

### Dependency Rule

**Inner layers (Domain) never depend on outer layers (Presentation/Data)**

- Domain models are pure TypeScript with no framework dependencies
- Data layer implements domain repository interfaces
- Presentation layer consumes domain models and repositories
- This ensures testability and framework independence

### API Integration Flow

1. **UI Component** calls repository method
2. **Repository** (implements domain interface) calls API client
3. **API Client** (`base-endpoints.ts`) handles auth, serialization, base URL
4. **Interceptor** injects auth token, handles responses globally
5. **Response Handler** shows snackbars, handles 401 redirects
6. **Domain Model** returned to presentation layer

## Usage

### Development Server

```bash
pnpm dev
```

### Running Type Checks

```bash
npm run typecheck
```

### Building for Production

```bash
# Clean previous build
rm -r .next

# Install dependencies
npm install

# Build
npm run build

# Start production server
npm start
```

### Docker Deployment

#### Build and Run

```bash
docker-compose up --build -d
```

#### Stop Containers

```bash
docker-compose down
```

#### View Logs

```bash
docker-compose logs -f
```

### Troubleshooting

If you encounter build or runtime errors:

```bash
# PowerShell
Remove-Item -Recurse -Force .next, node_modules
npm cache clean --force
npm install
npm run build

# Unix/Linux/macOS
rm -rf .next node_modules
npm cache clean --force
npm install
npm run build
```

## API Integration

### HTTP Headers

#### File Upload (multipart/form-data)

```http
Content-Type: multipart/form-data
```

#### Suppress Success Notifications

To prevent automatic success snackbars on write operations:

```http
x-suppress-success: true
```

These headers are processed in `src/data/api/base-endpoints.ts`.

### Adding New API Endpoints

#### 1. Define Endpoint Path

Add to `src/data/api/api-endpoints.ts`:

```typescript
export const apiEndpoints = {
  myResource: {
    getAll: 'MyResource/GetAll',
    getById: (id: string) => `MyResource/GetById/${id}`,
    create: 'MyResource/Create',
    update: (id: string) => `MyResource/Update/${id}`,
    delete: (id: string) => `MyResource/Delete/${id}`,
  },
  // ... other endpoints
};
```

#### 2. Create Domain Model

Create `src/domain/models/myResource/MyResource.ts`:

```typescript
export interface MyResource {
  id: string;
  name: string;
  description: string;
}
```

#### 3. Create Repository Interface

Create `src/domain/repositories/myResource/MyResourceRepository.ts`:

```typescript
export interface MyResourceRepository {
  getAll(): Promise<MyResource[]>;
  getById(id: string): Promise<MyResource>;
  create(data: CreateMyResourceDto): Promise<MyResource>;
  update(id: string, data: UpdateMyResourceDto): Promise<MyResource>;
  delete(id: string): Promise<void>;
}
```

#### 4. Implement Repository

Create `src/data/repositories/myResource/MyResourceRepoImpl.ts`:

```typescript
import { customApiClient } from '@/data/api/base-endpoints';
import { apiEndpoints } from '@/data/api/api-endpoints';
import { MyResourceRepository } from '@/domain/repositories/myResource/MyResourceRepository';

export class MyResourceRepoImpl implements MyResourceRepository {
  async getAll(): Promise<MyResource[]> {
    const response = await customApiClient.get(apiEndpoints.myResource.getAll);
    return response.data;
  }

  async getById(id: string): Promise<MyResource> {
    const response = await customApiClient.get(apiEndpoints.myResource.getById(id));
    return response.data;
  }

  // ... implement other methods
}
```

#### 5. Use in Components/Hooks

```typescript
import { useCallback } from 'react';
import { MyResourceRepoImpl } from '@/data/repositories/myResource/MyResourceRepoImpl';

export function useMyResource() {
  const repository = new MyResourceRepoImpl();
  
  const fetch = useCallback(async () => {
    return await repository.getAll();
  }, [repository]);

  return { fetch };
}
```

### Request/Response Flow

1. Components call repository methods
2. Repositories map to API endpoints
3. API client adds auth headers and base URL
4. Response interceptor handles global error handling
5. Success/error snackbars displayed automatically
6. 401 responses trigger redirect to sign-in

### Token Management

Tokens are stored in localStorage via `StoreLocalManager`:
- Location: `src/utils/store-manager.ts`
- Auth token key: defined in `src/utils/app-strings.ts`
- Auto-injected via request interceptor
- Auto-cleared on 401 response

## Contributing

### Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Follow code standards (see below)
6. Test locally: `npm run dev`
7. Commit: `git commit -m "feat: add amazing feature"`
8. Push: `git push origin feature/amazing-feature`
9. Create a merge request

### Code Standards

- ✅ Use TypeScript (no `any` types without reason)
- ✅ Follow existing project structure
- ✅ Use meaningful variable/function names
- ✅ Write clean, readable code
- ✅ Format with Prettier: `npm run format:write`
- ✅ Pass type checks: `npm run typecheck`
- ✅ Follow Clean Architecture principles
- ✅ Implement proper error handling
- ✅ Add comments for complex logic

### Commit Messages

Use conventional commits:
```
feat: add new feature
fix: fix a bug
refactor: refactor code
docs: update documentation
test: add tests
chore: update dependencies
```

### Push to Dev Branch

```bash
git add .
git commit -m "your meaningful message"
git push origin dev
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/data/api/base-endpoints.ts` | Axios instance, interceptors, auth header injection |
| `src/data/api/api-endpoints.ts` | All API endpoint definitions |
| `src/utils/store-manager.ts` | Local storage & token management |
| `src/utils/app-strings.ts` | App constants, storage keys |
| `src/presentation/contexts/user-context.tsx` | Global user state |
| `src/lib/auth/client.ts` | Client-side auth utilities |
| `src/config.ts` | App-wide configuration |
| `dependency-container.ts` | Dependency injection setup |

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## Project Status

 **Active Development** - Actively maintained and developed. Contributions and feedback welcome!

**Repository**: https://git.trungsoncare.com/trungsoncare/ts_elearning_web

**Last Updated**: January 19, 2026
