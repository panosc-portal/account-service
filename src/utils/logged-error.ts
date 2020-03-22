import { logger } from "./logger";

export class LoggedError extends Error {

  private response: any;

  constructor(message: string, response?: any) {
    super(message);
    this.response = response;
    logger.error(message);
  }
}