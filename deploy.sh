#!/bin/bash
set -e

r() { tput setaf 1; tput bold; }
g() { tput setaf 2; tput bold; }
y() { tput setaf 3; tput bold; }
b() { tput setaf 4; tput bold; }
c() { tput sgr0; }

echo -e "$(g)Deploying updates to GitHub...$(c)"

if [ $# -ne 1 ]; then
	echo "$(r)No commit message provided. Aborting$(c)"
fi

msg="$1"

# Commit to master
git commit -m "$msg"
git push
echo "$(g)Pushed to master...$(c)"

# Prepare for build
git fetch --all
rm -rf public
git worktree prune || :
git worktree add public gh-pages
(cd public; git branch --set-upstream-to=origin/gh-pages; git pull)
git submodule update --init
[[ -e themes/hugo-uno ]] && (cd themes/hugo-uno; bundle install)

# Build
git stash
hugo || (git stash pop && exit 1)
git stash pop
echo "$(g)Built successfully...$(c)"

# Push to gh-pages branch
cd public
git add -A
git commit -m "$msg"
git push
echo "$(g)Published successfully$(c)"
