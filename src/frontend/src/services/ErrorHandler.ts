export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: ((error: Error) => void)[] = [];

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public addListener(listener: (error: Error) => void): void {
    this.errorListeners.push(listener);
  }

  public removeListener(listener: (error: Error) => void): void {
    this.errorListeners = this.errorListeners.filter(l => l !== listener);
  }

  public handleError(error: any): void {
    let formattedError: Error;

    if (error instanceof Error) {
      formattedError = error;
    } else if (typeof error === 'string') {
      formattedError = new Error(error);
    } else {
      formattedError = new Error(JSON.stringify(error));
    }

    // Log error
    console.error('Error:', formattedError);

    // Notify listeners
    this.errorListeners.forEach(listener => {
      try {
        listener(formattedError);
      } catch (err) {
        console.error('Error in error listener:', err);
      }
    });
  }

  public async handleAsync<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public wrapFunction<T extends Function>(fn: T): T {
    return ((...args: any[]) => {
      try {
        const result = fn(...args);
        if (result instanceof Promise) {
          return this.handleAsync(result);
        }
        return result;
      } catch (error) {
        this.handleError(error);
        throw error;
      }
    }) as any as T;
  }

  public getErrorMessage(error: any): string {
    if (error.code === 4001) {
      return 'Transaction rejected by user';
    }

    if (error.code === -32603) {
      return 'Internal JSON-RPC error';
    }

    if (error.message) {
      return error.message;
    }

    return 'An unexpected error occurred';
  }

  public isUserRejection(error: any): boolean {
    return error.code === 4001;
  }

  public isNetworkError(error: any): boolean {
    return error.code === -32603;
  }

  public isContractError(error: any): boolean {
    return error.code === -32000;
  }

  public async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (this.isUserRejection(error)) {
          throw error;
        }

        if (attempt === maxAttempts) {
          break;
        }

        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    this.handleError(lastError);
    throw lastError;
  }
} 