+++
menu = "main"
date = "2015-12-10T00:00:00+10:00"
title = "Find and when to not use globbing"
Description = ""
Tags = [
  "Development",
  "Bash",
]
Categories = [
  "Development",
  "Bash",
]
+++
All the time I see people trying to handle large numbers of files in the shell, and any of you that have tried this before would know that it is not pretty. Try doing an `ls *` in a folder with a few hundred thousand files and you'll be lucky to have anything happen in a reasonable time frame.

There's a few gotcha's that apply to these sorts of situations. The first is that using '*' in the command will use shell globbing, so before executing the `ls` in a folder structure like this for example:
```
folder
|__file1
|__file2
|__file3
```
It will expand `ls folder/*` in to `ls folder/file1 folder/file2 folder/file3` which as you get in to the thousands of files will max out the maximum length of arguments you can have in a command pretty quickly. For reference, you can check with `getconf ARG_MAX`. My Arch and Debian systems default to 2097152.

The second gotcha is that `ls` does a `stat()` call. You can avoid this with `ls -f` which will disable sorting and other checks.

But the best solution to this, is to use `find`. Find won't do stat() calls by default, and allows you to manipulate what comes out as a stream instead of getting a big list of all files in to memory before doing anything. You can also selectively find files using `-name` or `-iname`, delete with `-delete` and execute things on each file with `-exec`.

On the other hand, if you're using a `for` loop; globbing works great. You're not limited by the command length and it won't be doing any other calls than to list the files. If you're using a modern shell as well you don't have to worry about whitespace issues. When you do something like `for i in /tmp/*` the globbing will correctly match files with whitespace. If you use the output of find instead, i.e. `for i in $(find /tmp)` then it will also seperate the output on the `$IFS` variable, which by default in Unix will be a variety of whitespace characters.
