// Extend the express Request
// A middleware will add these properties to each request

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}
export {}
