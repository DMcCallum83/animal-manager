# Animal Manager

A virtual pet management game where you can adopt and care for different types
of animals. Each animal has unique characteristics and requires regular
attention to maintain their happiness, hunger, and sleep levels.

## Features

The app includes four different animal types (Dogs, Foxes, Deer, and Bears),
each with distinct personalities and care requirements. Animals automatically
lose happiness and gain hunger/sleepiness over time, requiring player
interaction through feeding, playing, and resting actions. The game features a
responsive design with real-time stat meters, persistent storage, and a modern
UI.

## Technology

Built with React 19, TypeScript, and Vite for optimal performance. Uses SCSS for
styling with CSS custom properties for theming, and includes comprehensive
testing with Vitest and Testing Library. The app leverages localStorage for data
persistence and implements custom hooks for state management and game logic.

## How It Works

The game runs on a continuous loop that updates animal stats every second. Each
animal type has unique decay rates and action effectiveness values that
determine how quickly their stats change and how much each action improves their
condition. Players can add new animals through a modal interface and interact
with them using action buttons that immediately affect their stats. All data is
automatically saved to localStorage and persists between sessions.

## Available Commands

- `bun run dev` - Start the development server
- `bun run build` - Build the project for production
- `bun run preview` - Preview the production build locally
- `bun run test` - Run tests in watch mode
- `bun run test:ui` - Run tests with UI and coverage
- `bun run test:coverage` - Run tests and generate coverage report
- `bun run prettier:check` - Check code formatting
- `bun run prettier:fix` - Fix code formatting
- `bun run lint` - Run ESLint and fix issues
