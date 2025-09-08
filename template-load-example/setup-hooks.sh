#!/bin/bash

# Setup script for template-load-example git hooks
# This script installs project-specific git hooks in the parent repository

echo "Setting up template-load-example git hooks..."

# Get the parent git directory
PARENT_GIT_DIR="$(git rev-parse --show-toplevel)/.git"

# Check if we're in a git repository
if [ ! -d "$PARENT_GIT_DIR" ]; then
  echo "Error: Not in a git repository"
  exit 1
fi

# Create the hooks directory if it doesn't exist
mkdir -p "$PARENT_GIT_DIR/hooks"

# Install pre-commit hook
if [ -f ".husky/pre-commit" ]; then
  cp .husky/pre-commit "$PARENT_GIT_DIR/hooks/pre-commit"
  chmod +x "$PARENT_GIT_DIR/hooks/pre-commit"
  echo "✅ Pre-commit hook installed"
else
  echo "❌ Pre-commit hook not found"
fi

# Install pre-push hook
if [ -f ".husky/pre-push" ]; then
  cp .husky/pre-push "$PARENT_GIT_DIR/hooks/pre-push"
  chmod +x "$PARENT_GIT_DIR/hooks/pre-push"
  echo "✅ Pre-push hook installed"
else
  echo "❌ Pre-push hook not found"
fi

echo "🎉 Git hooks setup complete!"
echo ""
echo "The hooks will only run when you're in the template-load-example directory."
echo "To test:"
echo "  1. cd template-load-example"
echo "  2. git add ."
echo "  3. git commit -m 'test commit'"
