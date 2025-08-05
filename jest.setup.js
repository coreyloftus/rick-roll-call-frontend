import '@testing-library/jest-dom'
import 'whatwg-fetch'

global.URL.createObjectURL = jest.fn(() => 'mock-object-url')
global.URL.revokeObjectURL = jest.fn()

Object.defineProperty(window, 'fetch', {
  writable: true,
  value: global.fetch,
})

process.env.DEV_BASE_ENDPOINT = 'http://test-backend.com'