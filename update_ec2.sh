cd ~/flinxx-backend
echo "Pulling latest code..."
git stash
git pull origin main

echo "Installing deps..."
npm install

echo "Updating database to RDS in .env..."
# Safely replace DATABASE_URL
sed -i 's|^DATABASE_URL=.*|DATABASE_URL="postgresql://postgres:Nikhil6002@flinxx-db.chiwiam80lbl.eu-north-1.rds.amazonaws.com:5432/flinxx"|g' .env

echo "Regenerating Prisma..."
npx prisma generate

echo "Restarting server..."
pm2 restart all || echo "pm2 not found or not managing all"
