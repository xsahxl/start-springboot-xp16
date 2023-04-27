const winston = require('winston');
const isEmpty = require('lodash.isempty');

const logFormatter = winston.format.printf((info) => {
  const filtered = Object.keys(info)
    .filter((key) => !['level', 'message', 'timestamp', 'label', 'stack'].includes(key))
    .reduce((obj, key) => {
      const obz = obj;
      obz[key] = info[key];
      return obz;
    }, {});

  let logs = `${info.timestamp} ${info.level.toUpperCase()} ${info.label} - ${info.message}`;
  if (info.level === 'error' && !isEmpty(info.stack)) {
    logs += `, ${info.stack}`;
  }
  if (!isEmpty(filtered)) {
    logs += `, ${JSON.stringify(filtered)}`;
  }
  return logs;
});

function getLogger(label = 'unknown', options = {}) {
  const { filename, stream } = options;
  const transports = [new winston.transports.Console()];
  if (filename) {
    transports.push(new winston.transports.File({ filename }));
  } else if (stream) {
    transports.push(new winston.transports.Stream({ stream }));
  }

  return winston.createLogger({
    level: 'info',
    exitOnError: false,
    format: winston.format.combine(
      winston.format.label({ label: `${label}` }),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      // winston.format.errors({ stack: true }),
      logFormatter,
    ),
    transports,
  });
}

module.exports = { getLogger };
