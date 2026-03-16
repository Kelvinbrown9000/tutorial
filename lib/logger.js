function log(level, event) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    ...event,
  };
  const line = JSON.stringify(entry);
  if (level === 'ERROR') {
    console.error(line);
  } else if (level === 'SECURITY') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logAudit = (event) => log('AUDIT', event);
export const logError = (event) => log('ERROR', event);
export const logSecurity = (event) => log('SECURITY', event);
