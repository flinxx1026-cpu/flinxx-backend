fetch('http://localhost:3001/api/report-user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reportedBy: "11111111-1111-1111-1111-111111111111",
    reportedUserId: "22222222-2222-2222-2222-222222222222",
    reason: "Test"
  })
})
.then(async res => {
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response Text:", text);
})
.catch(err => console.error("Fetch error:", err));
