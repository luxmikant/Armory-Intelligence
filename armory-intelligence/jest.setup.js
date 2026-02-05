// jest.setup.js
import '@testing-library/jest-dom'

// Polyfill fetch for API tests (Node.js doesn't have fetch natively)
import fetch from 'node-fetch'
global.fetch = fetch

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const React = require('react')
  return {
    motion: {
      div: React.forwardRef((props, ref) => React.createElement('div', { ...props, ref })),
      button: React.forwardRef((props, ref) => React.createElement('button', { ...props, ref })),
      span: React.forwardRef((props, ref) => React.createElement('span', { ...props, ref })),
      p: React.forwardRef((props, ref) => React.createElement('p', { ...props, ref })),
    },
    AnimatePresence: ({ children }) => children,
  }
})

// Mock Tambo hooks for component tests
jest.mock('@tambo-ai/react', () => {
  const React = require('react')
  return {
    useTamboComponentState: (key, initialValue) => {
      const [state, setState] = React.useState(initialValue)
      return [state, setState]
    },
    withInteractable: (Component) => Component,
    useTamboThread: () => ({
      messages: [],
      isLoading: false,
    }),
    useTamboThreadInput: () => ({
      input: '',
      setInput: jest.fn(),
      handleSubmit: jest.fn(),
    }),
    useTamboContextHelpers: () => ({
      addContextHelper: jest.fn(),
      removeContextHelper: jest.fn(),
    }),
  }
})
