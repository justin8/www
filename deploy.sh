#!/bin/bash
set -e

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

git add -A

if [ $# -ne 1 ]; then
	echo "No commit message provided. Aborting"
fi

msg="$1"

# Commit to master
git commit -m "$msg"
git push

# Prepare for build
git fetch --all
rm -rf public
git worktree prune || :
git worktree add public gh-pages
(cd public; git branch --set-upstream-to=origin/gh-pages; git pull)
git submodule update --init
(cd themes/hugo-uno; bundle install)

# Build
hugo

# Push to gh-pages branch
cd public
git add -A
git commit -m "$msg"
git push
