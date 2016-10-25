#!/bin/bash
set -e

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

rm -rf public

git add -A

if [ $# -ne 1 ]; then
	echo "No commit message provided. Aborting"
fi

msg="$1"

# Commit to master
git commit -m "$msg"
#git push

# Prepare for build
git fetch --all
git worktree prune || :
git worktree add public gh-pages
git submodule update --init
(cd themes/hugo-uno; bundle install)

# Build
hugo

# Push to gh-pages branch
cd public
git add -A
git commit -m "$msg"
git push
