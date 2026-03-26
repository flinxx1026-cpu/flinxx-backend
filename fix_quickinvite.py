import re

filepath = r'c:\Users\nikhi\Downloads\joi\frontend\src\context\AuthContext.jsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find "if (data?.senderPublicId) {" followed eventually by "// Generate a temporary request ID"
# and insert the friendship check between them

friendship_check = """      if (data?.senderPublicId) {
        // ✅ CHECK: Skip popup if sender is already a friend
        try {
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const myPublicId = currentUser?.publicId || currentUser?.uuid;
          if (myPublicId && data.senderPublicId) {
            const BU = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL;
            const statusRes = await fetch(
              `${BU}/api/friends/status?senderPublicId=${encodeURIComponent(data.senderPublicId)}&receiverPublicId=${encodeURIComponent(myPublicId)}`,
              { headers: { 'Content-Type': 'application/json' } }
            );
            if (statusRes.ok) {
              const statusData = await statusRes.json();
              if (statusData.status === 'accepted') {
                console.log('🛡️ [QUICK INVITE] Already friends — skipping popup');
                return;
              }
            }
          }
        } catch (err) {
          console.warn('⚠️ [QUICK INVITE] Friendship check failed:', err.message);
        }

        // Generate a temporary request ID"""

# Use regex to find the pattern within handleQuickInvite
pattern = r"(      if \(data\?\.senderPublicId\) \{)\s*\n\s*\n\s*(// Generate a temporary request ID)"

match = re.search(pattern, content)
if match:
    old_text = match.group(0)
    content = content.replace(old_text, friendship_check, 1)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"SUCCESS: Replaced at position {match.start()}")
else:
    print("Pattern not found, showing context...")
    idx = content.find('senderPublicId) {')
    if idx >= 0:
        snippet = content[idx:idx+200]
        print(f"Found 'senderPublicId) {{' at {idx}")
        print(repr(snippet[:200]))
