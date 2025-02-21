#!/usr/bin/env bash
set -e

echo ">>> Installing Node dependencies..."
npm install

echo ">>> Building the Next.js project..."
npm run build

echo ">>> Setup complete!"
echo "To start the development server, run: npm run dev"
