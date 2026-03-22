import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false } 
});

// Get two users who are friends to test with
const friendsResult = await pool.query(`
  SELECT fr.sender_id, fr.receiver_id, 
         u1.display_name as sender_name, 
         u2.display_name as receiver_name
  FROM friend_requests fr
  JOIN users u1 ON fr.sender_id = u1.id
  JOIN users u2 ON fr.receiver_id = u2.id
  WHERE fr.status = 'accepted'
  LIMIT 3
`);

console.log('Friends found:', friendsResult.rows.length);
friendsResult.rows.forEach((r, i) => {
  console.log(`  [${i}] ${r.sender_name} (${r.sender_id.substring(0,8)}...) <-> ${r.receiver_name} (${r.receiver_id.substring(0,8)}...)`);
});

if (friendsResult.rows.length > 0) {
  const { sender_id, receiver_id } = friendsResult.rows[0];
  
  // Insert a test missed call message
  await pool.query(
    `INSERT INTO messages (sender_id, receiver_id, message, message_type, is_read)
     VALUES ($1, $2, $3, $4, false)`,
    [sender_id, receiver_id, 'Missed call', 'missed_call']
  );
  console.log('\n✅ Test missed call message inserted!');
  console.log(`   From: ${friendsResult.rows[0].sender_name} -> To: ${friendsResult.rows[0].receiver_name}`);
  console.log('   Open the chat between these users to see the missed call bubble');
}

await pool.end();
