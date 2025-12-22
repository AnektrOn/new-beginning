#!/bin/bash
# Merge all branches into main and push to GitHub
# Run this from your LOCAL machine (not on the server)

set -e

echo "🔄 Merging All Branches into Main..."
echo ""

# Make sure we're on main and up to date
echo "1️⃣  Updating main branch..."
git checkout main
git pull origin main

# List of branches to merge
BRANCHES=(
    "stellar-map"
    "Structure-design-UI-UX"
    "feature/courses-flow"
    "feature/deployment-readiness-optimizations"
    "feature/ux-ui-improvements"
)

# Merge each branch
for branch in "${BRANCHES[@]}"; do
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📦 Merging: $branch"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Fetch the branch
    git fetch origin "$branch"
    
    # Try to merge
    if git merge "origin/$branch" --no-edit; then
        echo "✅ Successfully merged $branch"
    else
        echo "⚠️  Merge conflict in $branch"
        echo "   Resolving conflicts..."
        
        # Check if there are conflicts
        if git diff --check; then
            echo "   ✅ Conflicts resolved automatically"
            git add .
            git commit -m "Merge $branch into main - resolved conflicts"
        else
            echo "   ❌ Manual conflict resolution needed"
            echo "   Please resolve conflicts and run:"
            echo "   git add ."
            echo "   git commit -m 'Merge $branch into main'"
            exit 1
        fi
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All branches merged into main!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Main branch updated on GitHub!"
echo ""
echo "📝 Next step: Redeploy on server"
echo "   Run the redeploy script on your Hostinger server"

