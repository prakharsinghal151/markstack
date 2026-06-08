# MarkStack

A unified creator workspace with visual canvases, blog publishing, and task planning.

## Project Overview

MarkStack is a comprehensive productivity platform designed for developers and content creators. It provides an integrated environment for writing, visual thinking, and structured planning, combining multiple creative tools into a single cohesive workspace.

## Features

- **Markdown Editor with AI Integration** - Monaco-based editor with Google Gemini AI-powered structure conversion
- **Visual Canvas** - Drawing and diagramming capabilities using Excalidraw
- **Blog Publishing System** - Transform markdown documents into SEO-optimized blog posts
- **Task Planning & Calendar** - Integrated todo management with calendar view
- **User Authentication** - Better Auth integration with Google OAuth support
- **Responsive Design** - Modern UI built with Tailwind CSS and shadcn/ui components
- **Dark/Light Theme** - Theme switching with smooth animations
- **Real-time Preview** - Live markdown preview with syntax highlighting
- **Drag & Drop** - Image upload support for markdown content

## Tech Stack

### Frontend

- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling framework
- **shadcn/ui** - Component library
- **Lucide React** - Icon library

### Backend & Database

- **PostgreSQL** - Primary database
- **Prisma 7.5.0** - ORM and database toolkit
- **Better Auth 1.5.5** - Authentication solution

### Editor & Canvas

- **Monaco Editor** - Code editing capabilities
- **Excalidraw** - Virtual whiteboard/drawing canvas
- **next-mdx-remote** - MDX rendering
- **highlight.js** - Syntax highlighting

### AI Integration

- **@ai-sdk/google** - Google AI integration
- **ai** - Vercel AI SDK

### Additional Libraries

- **date-fns** - Date manipulation
- **lodash.debounce** - Performance optimization
- **nanoid** - Unique ID generation
- **react-dropzone** - File upload handling
- **sonner** - Toast notifications

## Project Structure

```
markstack/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (authentication)/   # Auth routes
│   │   ├── (protected)/        # Protected routes
│   │   ├── (public)/           # Public routes
│   │   ├── api/                # API routes
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── auth/               # Authentication components
│   │   ├── canvas/             # Drawing canvas components
│   │   ├── editor/             # Markdown editor components
│   │   ├── layout/             # Layout components
│   │   ├── planner/            # Task planning components
│   │   └── sections/           # Landing page sections
│   ├── lib/                    # Utility libraries
│   │   ├── ai/                 # AI integration
│   │   ├── auth/               # Authentication configuration
│   │   ├── database/           # Database configuration
│   │   ├── markdown/           # Markdown processing
│   │   └── utils.ts            # General utilities
│   └── types/                  # TypeScript type definitions
├── prisma/                     # Database schema and migrations
├── public/                     # Static assets
├── .github/                    # GitHub configuration
└── Configuration files         # Next.js, TypeScript, ESLint, etc.
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd markstack
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and configure:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/markstack"
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_URL=http://localhost:3000

   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""

   # Google AI for markdown structuring
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_api_key
   GEMINI_MODEL=gemini-2.0-flash-exp

   # Authentication (Better Auth)
   BETTER_AUTH_SECRET=your_secret_key
   BETTER_AUTH_URL=http://localhost:3000
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Authentication

- Sign up using email/password or Google OAuth
- Protected routes require authentication

### Core Features

**Markdown Editor**

- Navigate to `/editor` to access the markdown editor
- Use the AI Structure button to organize messy notes
- Preview your content in real-time
- Publish directly to the blog system

**Visual Canvas**

- Create visual diagrams and flowcharts at `/canvas`
- Use Excalidraw for collaborative whiteboarding
- Save and organize multiple canvases

**Task Planning**

- Manage todos and deadlines at `/todos`
- Calendar view for date-based planning
- Track completed and pending tasks

**Blog Publishing**

- Publish markdown documents as blog posts
- SEO-optimized with automatic table of contents
- Tag system for content organization

## Configuration

### Database Configuration

The application uses PostgreSQL with Prisma ORM. Key models include:

- `User` - User accounts and authentication
- `Blog` - Blog posts with markdown content
- `Canvas` - Visual canvas data
- `Todo` - Task management
- `Tag` - Content categorization

### Authentication

Better Auth handles authentication with support for:

- Email/password authentication
- Google OAuth integration
- Session management
- Protected route middleware

### AI Integration

Google Gemini AI is used for:

- Converting messy notes to structured markdown
- Content organization and formatting
- Requires valid API key in environment variables

## Development & Contribution

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run postinstall` - Generate Prisma client

### Code Style

- TypeScript with strict mode enabled
- ESLint with Next.js configuration
- Tailwind CSS for styling
- Component-based architecture with shadcn/ui

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support & Maintenance

For support:

- Open an issue on GitHub
- Check existing documentation
- Review the codebase for implementation details

The project is maintained as an open-source creator workspace platform.
