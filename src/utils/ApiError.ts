export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string = 'ERROR',
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}