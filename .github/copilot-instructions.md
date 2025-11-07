# AI Agent Instructions for useRecer Project

## Project Overview
This is a React + Vite project demonstrating the usage of `useReducer` hook for state management. The project uses modern React practices with SWC for fast refresh and development experience.

## Architecture & Key Components

### State Management
- Project uses React's `useReducer` hook for state management
- State mutations are handled through a reducer pattern with typed actions
- Example pattern from `src/App.jsx`:
```jsx
function reducer(state, action) {
  switch(action.type) {
    case 'plus':
      return {count: state.count + 1}
    case 'minus': 
      return {count: state.count - 1}
    default:
      return state
  }
}
```

### Project Structure
- `/src` - Main source code
  - `App.jsx` - Main application component
  - `main.jsx` - Application entry point
- Build tooling in project root (vite.config.js, eslint.config.js)

## Development Workflow

### Available Commands
- `npm run dev` - Start development server with HMR
- `npm run build` - Production build
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build locally

### Key Technologies & Versions
- React 19.1.1
- Vite 7.1.7
- SWC for Fast Refresh via @vitejs/plugin-react-swc

### Important Notes
- Project uses SWC for development but is not compatible with React Compiler (tracked in [vitejs/vite-plugin-react#428](https://github.com/vitejs/vite-plugin-react/issues/428))
- ESLint configuration can be expanded for production use with TypeScript and type-aware rules

## Conventions
- State updates should always be performed through reducer actions
- Action types should be descriptive and follow the pattern shown in `App.jsx`
- Component files use `.jsx` extension
- CSS modules for component styling (when needed)