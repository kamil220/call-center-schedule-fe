# Call Center Schedule Frontend

A Call Center scheduling management system built with Next.js 14, Tailwind CSS, and shadcn/ui.

## 🚀 Features

- Employee profile management
- Skills and competencies definition
- Availability planning (schedules, vacations, sick leaves)
- Shift preferences handling
- Schedule generation and editing
- Schedule publication for employees
- Reporting and analytics

## 🛠️ Technologies

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui v4
- **State Management:** Zustand
- **Language:** TypeScript
- **Development Environment:** Node.js >= 18

## 📦 Requirements

- Node.js 18.0.0 or newer
- npm or yarn or pnpm or bun

## 🏃‍♂️ Getting Started

1. Clone the repository:
```bash
git clone https://github.com/kamil220/call-center-schedule-fe.git
cd call-center-schedule-fe
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                  # Next.js App Router pages and layouts
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   └── diagrams/       # Diagrams and visualizations
├── hooks/              # Custom React hooks
├── services/           # API and business logic
├── store/             # State management (Zustand)
├── lib/               # Utility functions
├── types/             # TypeScript type definitions
└── public/            # Static assets
```

## 🔧 Configuration

The project uses the following tools and configurations:

- **TypeScript** for type safety
- **ESLint** for linting
- **Prettier** for code formatting
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components

## 🌐 API

The application communicates with a Symfony backend via REST API. API documentation will be available after running the backend.

## 🧪 Testing

To run tests:

```bash
npm test
# or
yarn test
# or
pnpm test
# or
bun test
```

## 📚 Documentation

Complete project documentation, including:
- Requirements analysis
- System architecture
- Flow diagrams
- Scheduling algorithms
is available in the application at [http://localhost:3000/docs](http://localhost:3000/docs)