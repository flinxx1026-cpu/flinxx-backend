import { createClient } from 'redis';
const redis = createClient({ url: 'redis://15.206.146.133:6379' });
await redis.connect();
console.log('active_users:', await redis.sCard('active_users'), await redis.sMembers('active_users'));
console.log('online_males:', await redis.sCard('online_males'), await redis.sMembers('online_males'));
console.log('online_females:', await redis.sCard('online_females'), await redis.sMembers('online_females'));
const hbKeys = await redis.keys('heartbeat:*');
console.log('heartbeat keys:', hbKeys.length);
await redis.quit();
