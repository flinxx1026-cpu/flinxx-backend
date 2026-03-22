#!/bin/bash
# Quick TURN Server Status Check
# Run this on your TURN server (15.206.146.133)

echo "=============== TURN SERVER DIAGNOSTICS ==============="
echo ""

# Check if coturn is installed
echo "1. Checking if coturn is installed..."
which turnserver
if [ $? -eq 0 ]; then
  echo "✅ coturn is installed"
else
  echo "❌ coturn NOT installed - need to install it"
  echo "   Install: sudo apt-get install coturn"
fi
echo ""

# Check if coturn service is running
echo "2. Checking if coturn service is running..."
systemctl is-active --quiet coturn
if [ $? -eq 0 ]; then
  echo "✅ coturn service is RUNNING"
else
  echo "❌ coturn service is STOPPED"
  echo "   Start it: sudo systemctl start coturn"
  echo "   Enable it: sudo systemctl enable coturn"
fi
echo ""

# Check if ports are open
echo "3. Checking if ports 3478 are listening..."
netstat -tuln | grep 3478
if [ $? -eq 0 ]; then
  echo "✅ Port 3478 is OPEN"
else
  echo "❌ Port 3478 is NOT listening"
  echo "   Check config: sudo cat /etc/coturn/turnserver.conf"
fi
echo ""

# Check firewall rules
echo "4. Checking firewall rules..."
ufw status | grep 3478
if [ $? -eq 0 ]; then
  echo "✅ Firewall allows port 3478"
else
  echo "⚠️  Port 3478 may be blocked by firewall"
  echo "   Allow it: sudo ufw allow 3478/tcp"
  echo "            sudo ufw allow 3478/udp"
fi
echo ""

# Test TURN server connectivity from outside
echo "5. Testing TURN server from outside (from any client)..."
echo "   Run this command from your client machine:"
echo "   $ stunclient 15.206.146.133 3478"
echo "   Should return: Socket test = PASS (or similar)"
echo ""

# Check coturn logs
echo "6. Recent coturn logs..."
tail -20 /var/log/coturn.log 2>/dev/null || echo "   No logs found (may not be configured)"
echo ""

echo "=============== END OF DIAGNOSTICS ==============="
echo ""
echo "If coturn is STOPPED, run:"
echo "  sudo systemctl start coturn"
echo "  sudo systemctl enable coturn"
echo ""
echo "If ports are blocked by firewall, run:"
echo "  sudo ufw allow 3478/tcp"
echo "  sudo ufw allow 3478/udp"
