const { getPool, query } = require('../db');

const MAX_FAILED = parseInt(process.env.LOGIN_MAX_FAILED || '5', 10);
const WINDOW_MIN = parseInt(process.env.LOGIN_WINDOW_MIN || '15', 10);
const LOCK_MIN = parseInt(process.env.LOGIN_LOCK_MIN || '30', 10);

async function recordAttempt({ user_id = null, username = null, ip = null, success }) {
  await getPool().execute(
    'INSERT INTO login_attempts (user_id, username, ip, success) VALUES (?,?,?,?)',
    [user_id, username, ip, success ? 1 : 0]
  );
}

async function countRecentFailures({ user_id = null, username = null }) {
  const sinceSql = `created_at >= (NOW() - INTERVAL ${WINDOW_MIN} MINUTE)`;
  if (user_id) {
    const rows = await query(
      `SELECT COUNT(*) AS n FROM login_attempts WHERE user_id=? AND success=0 AND ${sinceSql}`,
      [user_id]
    );
    return rows[0].n || 0;
  } else if (username) {
    const rows = await query(
      `SELECT COUNT(*) AS n FROM login_attempts WHERE username=? AND success=0 AND ${sinceSql}`,
      [username]
    );
    return rows[0].n || 0;
  }
  return 0;
}

async function getActiveLock(user_id) {
  const rows = await query(
    'SELECT id, user_id, until, reason FROM user_locks WHERE user_id=? AND until > NOW() ORDER BY until DESC LIMIT 1',
    [user_id]
  );
  return rows[0] || null;
}

async function lockUser({ user_id, minutes = LOCK_MIN, reason = 'Too many failed logins' }) {
  const untilSql = `NOW() + INTERVAL ${minutes} MINUTE`;
  await getPool().execute(
    `INSERT INTO user_locks (user_id, until, reason) VALUES (?, ${untilSql}, ?)`,
    [user_id, reason]
  );
}

async function clearLocks(user_id) {
  await getPool().execute('DELETE FROM user_locks WHERE user_id=?', [user_id]);
}

module.exports = {
  MAX_FAILED,
  WINDOW_MIN,
  LOCK_MIN,
  recordAttempt,
  countRecentFailures,
  getActiveLock,
  lockUser,
  clearLocks
};