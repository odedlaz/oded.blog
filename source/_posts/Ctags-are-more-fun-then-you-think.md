title: Ctags are more fun then you think
tags:
  - linux
  - vim
  - productivity
id: 112
updated: '2017-05-10 12:57:50'
permalink: ctags-are-fun
categories:
  - devops
  - ''
date: 2017-05-08 10:12:00
---

This post is dedicated to people who are already familiar with Ctags, and aims to show you how I use them. If you've never heard of Ctags before, and you use a code editor (not an IDE) I HIGHLY encourage you to [read about it](https://en.wikipedia.org/wiki/Ctags), then install [Universal Ctags](https://ctags.io/).

![](/images/2017/05/manuals.png)

Now that you know all about Ctags, [continue reading](/2017/05/08/ctags-are-fun/#vim)! you'll love it. I think.

<!-- more -->

## Vim

### autotag.vim

[autotag.vim](https://github.com/craigemery/vim-autotag) makes sure your tag files are always up to date.

> ... using *ctags -a* will only change existing entries in a tags file or add new ones. It doesn't delete entries that no longer exist. Should you delete an entity from your source file that's represented by an entry in a tags file, that entry will remain after calling *ctags -a*.

[autotag.vim](https://github.com/craigemery/vim-autotag) fixes this issue by deleting all entries in the tags file referencing the source file that's just been saved, and then executing *ctags -a* on that source file.

This is my current configuration:
```vim
" put the tags file in the git directory
let g:autotagTagsFile=".git/tags"
```

## Tagbar

> [Tagbar](https://github.com/majutsushi/tagbar) is a Vim plugin that provides an easy way to browse the tags of the current file and get an overview of its structure. It does this by creating a sidebar that displays the ctags-generated tags of the current file, ordered by their scope...

If you're a [taglist.vim](http://www.vim.org/scripts/script.php?script_id=273) user, you should really check it out.

![](https://camo.githubusercontent.com/fc85311154723793776aed28488befdfaab36c42/68747470733a2f2f692e696d6775722e636f6d2f5366394c7332722e706e67)


This is my current configuration:
```vim
let g:tagbar_autofocus = 1
" auto open tagbar when opening a tagged file
" does the same as taglist.vim's TlistOpen.
autocmd VimEnter * nested :call tagbar#autoopen(1)
```

## fzf.vim

fzf is a general-purpose command-line fuzzy finder.

![](https://camo.githubusercontent.com/0b07def9e05309281212369b118fcf9b9fc7948e/68747470733a2f2f7261772e6769746875622e636f6d2f6a756e6567756e6e2f692f6d61737465722f667a662e676966)

I've [already written about fzf before](/2017/03/26/fzf-fuzzy-finder-on-stereoids/), and said that it has complementing vim plugin, [fzf.vim](https://github.com/junegunn/fzf.vim).

**fzf.vim** has a neat `:Tags` command that allows fuzzy finding tags. cool right?

## Git

[Tim Pope](http://tpo.pe/) (aka: tpope) wrote [a great blog post a few years ago](http://tbaggery.com/2011/08/08/effortless-ctags-with-git.html) about automatic ctag generation using git hooks.

Instead of manual copy-pasting the steps from his blog post, I wrote a script that does that automatically (including updating all current git projects):

* Adds a `~/.git_template` directory for git templates
* Copy and configure all ctags hooks in that directory
* Configure `git ctags` alias to generate ctags in the current directory
* Recursively walk a given directory and update every folder that's managed by git, to automatically generate ctags.

After running this script, all current and future git managed projects will have the hooks installed.

```bash
#!/usr/bin/env sh

# the directory where you put your code 
TARGET_DIR="$1"
# the directory where git templates reside
TEMPLATE_DIR="$HOME/.git_template"

if test -z "$TARGET_DIR" || ! test -d "$TARGET_DIR"; then
   echo "Usage: $0 <target-dir>"
   exit 1
fi

mkdir -p "$TEMPLATE_DIR/hooks"

# configure the template directory
git config --global init.templatedir "$TEMPLATE_DIR"

# add a git alias: 'git ctags' that generates ctags
git config --global alias.ctags '!.git/hooks/ctags'

# create all the hooks
cat << 'EOF' > "$TEMPLATE_DIR/hooks/ctags"
#!/bin/sh
set -e
PATH="/usr/local/bin:$PATH"
dir="$(git rev-parse --git-dir)"
trap 'rm -f "$dir/$$.tags"' EXIT
git ls-files | \
  ctags --tag-relative=yes -L - -f"$dir/$$.tags"
mv "$dir/$$.tags" "$dir/tags"
EOF

for f in "post-checkout" "post-commit" "post-merge"; do
   cat << 'EOF' >> "$TEMPLATE_DIR/hooks/$f"
#!/bin/sh
.git/hooks/ctags >/dev/null 2>&1 &
EOF
done

cat << 'EOF' >> "$TEMPLATE_DIR/hooks/post-rewrite"
#!/bin/sh
case "$1" in
  rebase) exec .git/hooks/post-merge ;;
esac
EOF

# make all hooks executable
for f in "post-checkout" "post-commit" "post-merge" "post-rewrite" "ctags"; do
   chmod u+x "$TEMPLATE_DIR/hooks/$f"
done

# go recursively on all files in the directory
shopt -s globstar
# "re-init" will only copy the template, don't worry.
for dir in $TARGET_DIR/**/.git/; do
   (cd "$(dirname "$dir")" || false && git init)
done
```
