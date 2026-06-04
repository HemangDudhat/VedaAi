const LOG_LEVELS = {
  info: "\x1b[36m", // Cyan
  success: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
  reset: "\x1b[0m",
};

const getTimestamp = (): string => {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
};

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(
      `${LOG_LEVELS.info}[${getTimestamp()}] ℹ ${message}${LOG_LEVELS.reset}`,
      ...args
    );
  },

  success: (message: string, ...args: unknown[]) => {
    console.log(
      `${LOG_LEVELS.success}[${getTimestamp()}] ✅ ${message}${LOG_LEVELS.reset}`,
      ...args
    );
  },

  warn: (message: string, ...args: unknown[]) => {
    console.warn(
      `${LOG_LEVELS.warn}[${getTimestamp()}] ⚠️ ${message}${LOG_LEVELS.reset}`,
      ...args
    );
  },

  error: (message: string, ...args: unknown[]) => {
    console.error(
      `${LOG_LEVELS.error}[${getTimestamp()}] ❌ ${message}${LOG_LEVELS.reset}`,
      ...args
    );
  },
};
