+++
menu = "main"
date = "2016-02-18T00:00:00+10:00"
title = "Parallel"
Description = ""
Tags = [
    "Development",
    "Bash",
    "Parallel",
]
Categories = [
    "Development",
    "Bash",
    "Parallel",
]
+++
GNU Parallel is a fantastic utility, and I've been using more and more of it recently.

Often I end up with something that will be a one off task, write a quick 4-5 line bash script to do what I want and that's done. But sometimes there is a slow task that can be done in parallel, and that's where it really shines.

I recently wanted to make sure the 200 odd URLs in a html file were valid and returning 2xx responses, so I wrote a quick bash script to do so

```
grep -oE '"http.*?"' file.html | sed 's/"//g' | while read -r url; do
    if ! curl -Sso /dev/null "$url"; then
        echo "FAILED: $url"
    fi
done
```

Simple enough, and it worked. But running a curl against 200+ URls is *SLOW*. And I may want to run this again some time, meaning it's doubly slow.

The default usage of parallel is to either pipe in multi line input to act on each line one at a time, i.e:
```
echo -e 'foo
bar
baz' | parallel echo
```

Which would, in parallel, run `echo` against each of the three lines of input. You can also do it based off of IFS splitting with this:
```
parallel echo ::: foo bar baz
```

Which will have the same output. Depending on your script this could be more or less readable. But it only works for built-in commands and external applications by default. If you want to do something a bit more complex, such as different actions based off command results like the above URL checker you need to do things a little different.

```
check() {
    local url="$1"
    if ! curl -Sso /dev/null "$url"; then
        echo "FAILED: $url"
    fi
}

export -f check

grep -oP '"http.*?"' file.html | sed 's/"//g' | parallel check
```

If you use `export -f` to export a function, then parallel can run it as well. It uses the shell from `$SHELL` to execute the call you specify. Since bash can inherit functions from parent bash shells it lets you do this even though parallel itself would be oblivious to the function's existence.
