#!/bin/bash
# Push to GitHub Script
# Run this script to push your code to GitHub

cd /app

# Configure git (if needed)
git config --global user.email "ckravuri@users.noreply.github.com"
git config --global user.name "ckravuri"

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Check https://github.com/ckravuri/shortlistpro"
