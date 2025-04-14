#!/bin/bash

# Cleanup script for Next.js migration
# This script removes files that are no longer needed after migrating from Express+Vite to Next.js

echo "Starting cleanup process..."

# Remove Express server files
echo "Removing Express server files..."
rm -rf server/

# Remove Vite configuration
echo "Removing Vite configuration files..."
rm -f vite.config.ts
rm -f vite.config.js

# Remove old build and start scripts
echo "Removing old build and start scripts..."
rm -f start-nextjs-only.js
rm -f start-nextjs.js
rm -f run-nextjs.js
rm -f run-app.js
rm -f next-server.js
rm -f dev.js

# Remove old client files (if any)
echo "Removing old client files..."
rm -rf client/

# Update migration plan to mark completed steps
echo "Updating migration plan..."
sed -i 's/- \[ \] Move storage.ts from/- \[x\] Move storage.ts from/' MIGRATION-PLAN.md
sed -i 's/- \[ \] Create a proper database/- \[x\] Create a proper database/' MIGRATION-PLAN.md
sed -i 's/- \[ \] Move schema.ts to/- \[x\] Move schema.ts to/' MIGRATION-PLAN.md
sed -i 's/- \[ \] Refactor storage class/- \[x\] Refactor storage class/' MIGRATION-PLAN.md

echo "Cleanup complete!"