const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warn' : 'info');

const formatMsg = (level, msg) => {
  const ts = new Date().toISOString();
  return `[${ts}] [${level.toUpperCase()}] ${msg}`;
};

const logger = {
  error: (msg, ...args) => {
    if (LOG_LEVELS[currentLevel] >= LOG_LEVELS.error)
      console.error(formatMsg('error', msg), ...args);
  },
  warn: (msg, ...args) => {
    if (LOG_LEVELS[currentLevel] >= LOG_LEVELS.warn)
      console.warn(formatMsg('warn', msg), ...args);
  },
  info: (msg, ...args) => {
    if (LOG_LEVELS[currentLevel] >= LOG_LEVELS.info)
      console.log(formatMsg('info', msg), ...args);
  },
  debug: (msg, ...args) => {
    if (LOG_LEVELS[currentLevel] >= LOG_LEVELS.debug)
      console.log(formatMsg('debug', msg), ...args);
  },
};

module.exports = logger;
