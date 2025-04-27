# Calendar Booking Application (Refactored)

This is a refactored version of the booking calendar application, focusing on clean architecture, TypeScript, and maintainable code.

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Reusable UI components
│   ├── auth/         # Authentication components
│   ├── calendar/     # Calendar-specific components
│   ├── ui/           # Base UI components
│   └── layout/       # Layout components
├── composables/      # Reusable logic
├── constants/        # App constants and enums
├── models/           # TypeScript interfaces and types
├── services/         # API and external service integration
├── stores/           # Pinia stores
└── utils/            # Utility functions
```

## Technology Stack

- Vue 3 with Composition API
- TypeScript
- Pinia for state management
- Vue Router
- Vuetify for UI components
- FullCalendar for calendar functionality
- Firebase for backend/authentication

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Code Conventions

- Use TypeScript for all files
- Follow consistent naming: camelCase for variables/methods, PascalCase for components
- Use Composition API with `<script setup>` syntax
- Document public APIs with JSDoc comments
- Extract reusable logic into composables
- Use interfaces for data models 