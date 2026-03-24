// Test the timezone and string keys without Prisma

function toDateKey(date) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const nowMs = Date.now();
const now = new Date(nowMs);
console.log("Current Local Time:", now.toString());

const istOffsetMs = 5.5 * 60 * 60 * 1000;
const istNow = new Date(nowMs + istOffsetMs);
console.log("istNow:", istNow.toISOString());

const todayUtc = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate()));
console.log("todayUtc:", todayUtc.toISOString());

const todayKey = toDateKey(todayUtc);
console.log("todayKey:", todayKey);

// Simulate DB date from yesterday
// Suppose the limit reset happened on March 22nd at 7:00 AM IST
// This corresponds to March 22nd UTC 01:30:00
const pastIstNow = new Date(new Date("2026-03-22T07:00:00+05:30").getTime() + istOffsetMs);
const pastTodayUtc = new Date(Date.UTC(pastIstNow.getUTCFullYear(), pastIstNow.getUTCMonth(), pastIstNow.getUTCDate()));
console.log("DB stored last_skip_reset_date (as from yesterday):", pastTodayUtc.toISOString());

const lastResetKey = toDateKey(pastTodayUtc);
console.log("lastResetKey from DB date:", lastResetKey);

const shouldReset = !lastResetKey || lastResetKey !== todayKey;
console.log("shouldReset evaluated to:", shouldReset);
