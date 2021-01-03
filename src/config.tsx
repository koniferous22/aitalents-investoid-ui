export const appConfig = {
  apiUrl: process.env.NODE_ENV === 'production' ? 'https://aitalents-investoid-api.herokuapp.com' : 'http://localhost:5000',
  // apiUrl: 'http://localhost:5000',
  phase2: false,
  debounceTime: 1000
} as const
