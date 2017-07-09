title: 'Test your terminal skills #1'
tags:
  - linux
  - bash
  - awk
id: 100
updated: '2017-04-11 13:01:16'
permalink: test-terminal-skills-1
categories:
  - devops
  - ''
date: 2017-03-29 17:16:00
---

![](/images/2017/03/alice.jpg)

Today we'll write a few scripts that parse the plain text version of the book [Alice in Wonderland](/static/2017/03/alice_in_wonderland.txt), and generate simple statistics.

#### Tasks

1. Splits each chapter in the book into a dedicated file under the 'chapters' directory. There should be 12 chapters when you're done.

2. Generates statistics for the whole book, and each chapter:
  * The most frequently used word
  * The least frequently used word
  * The longest word

3. Find the amount of words that their length is bigger than the average word length in the entire book.

4. Find the "closest" word to "Alice" - the most frequently used word that appeared right before or after the word "Alice".

[Read more](/2017/03/29/test-terminal-skills-1#solutions) if you want to see my solutions.

<!-- more -->

### Solutions

The following are the solutions I came up with. I tried to be as verbose as possible. If you have any suggestions, feel free to contact me.

I recommend using [ExplainShell](/2017/03/14/explainshell/) to understand commands / flags you've never seen before.

Also, my solutions use [awk](https://en.wikipedia.org/wiki/AWK), [sed](https://en.wikipedia.org/wiki/Sed) & [grep](https://en.wikipedia.org/wiki/Grep) extensively. If you don't understand an expression, try [regular expressions 101](https://regex101.com/), It'll make your life easier.

Furthermore, If you've never heard or understand regular expressions, learn them. They are extremely powerful. You can start by [reading my blog post about them](/2017/03/07/master-regular-expressions/).

#### Task #1

Splits each chapter in the book into a dedicated file under the 'chapters' directory. There should be 12 chapters when you're done.

```bash
#!/usr/bin/env bash
book_path=${1:-""}
chapters_dir=$(dirname "$(readlink -f "$0")")/chapters

# remove existing files
rm -rf "$chapters_dir" && mkdir -p "$chapters_dir" && cd "$chapters_dir" || exit 1

awk '{
   if ($1 == "CHAPTER") {
      # extract the chapter
      chapter = substr($0,9, index($0, ".")-9)
      l = sprintf("%s.txt", chapter)
   }
   if (length(chapter) > 0) {
      print $0 >> l
   }
}' "$book_path"


# iterate all files and remove blank lines - this is NOT mandatory
for f in *; do
   echo "$(<"$f")" > "$f"
done

echo "$chapters_dir"
```

#### Task #2

Generates statistics for the whole book, and each chapter:
  * The most frequently used word
  * The least frequently used word
  * The longest word

```bash
#!/usr/bin/env bash
book_path=${1:-""}

# print most frequent word, least frequent word & longest word
# 1. replace all punctuation and spaces with new line
# 2. remove all non alphanumeric characters
# 3. make everything lowercase
# 4. sort
grep -oE "\w+" "$book_path" | \
        awk '{
               for (i=1; i<=NF; i++){
                  hist[tolower($i)]++;
               }
            }
      END {
       min = 1
       for (word in hist) {
          if (length(word) > length(longest))
             longest = word

         times=hist[word]

         if (times >= max) {
            max = times
            maxword = word
         }
         if (times <= min) {
            min = times
            minword = word
         }
      }
      printf "Most frequent word is \"%s\" (appeared %d times)\n", maxword, max
      printf "Least frequent word is \"%s\" (appeared %d times)\n", minword, min
      printf "Longest word is \"%s\" (%d characters)\n",longest, length(longest)
    }'
```

#### Task #3

Find the amount of words that their length is bigger than the average word length in the entire book.

```bash
#!/usr/bin/env bash
book_path=${1:-""}

# 1. replace all punctuation and spaces with new line
# 2. remove all non alphanumeric characters
# 3. make everything lowercase
# 4. sort

grep -oE "\w+" "$book_path" | \
   awk '
   {
      words[tolower($0)]
      sum += length($0);
   } END {
      average_word_length = sum/NR
      words_longer_than_average = 0

      for (word in words)
         if (length(word) >= average_word_length)
            words_longer_than_average++

      printf "There are %d words that are longer \
than the average word length (%0.3f)\n", \
words_longer_than_average, average_word_length
   }'
```
#### Task #4

Find the "closest" word to "Alice" - the most frequently used word that appeared right before or after the word "Alice".

```bash
#!/usr/bin/env bash
book_path=${1:-""}

# 1. filter allwords next to Alice
# 2. remove 'Alice' from the grep expression
# 3. replace all spaces with a new line
# 4. remove all empty lines
# 5. sort
# 6. get all uniq lines, with the amount they appeared
# 7. sort according to the previous output
# 8. get only the one that has the highest value
grep -Po '(\w+\s+)?Alice(\s+\w+)?' "$book_path" | \
   sed 's/Alice//g' | \
   tr '[:space:]' '\n' | \
   tr '[:upper:]' '[:lower:]' | \
   sed '/^\s*$/d' | \
   sort | \
   uniq -c | \
   sort -rn | \
   head -n 1 | \
   awk '{ printf "The most frequent word near \"Alice\" is \"%s\" \
(appeared %s times)\n", $2, $1 }'
```

### Hooking it all together
```bash
#!/usr/bin/env bash
book_path=${1:-"./alice_in_wonderland.txt"}
scripts_dir=$(dirname "$(readlink -f "$0")")

if test -z "$book_path"; then
   echo "Usage: $0 <path-to-book>"
   exit 1
fi

if ! test -f "$book_path"; then
   echo "file doesn't exist at given path '$book_path'"
   exit 1
fi

function get_stats() {
   path=${1:-""}

   title="Statistics for '$(basename "$path")'"
   underline=$(head -c ${#title} < /dev/zero | tr '\0' '#')
   printf "\n%s\n%s\n" "$title" "$underline"

   "$scripts_dir"/more_than_average "$path"
   "$scripts_dir"/next_most_frequent "$path"
   "$scripts_dir"/most_common_word "$path"
}

# transform path to absolute
abs_path=$(readlink -f "$book_path")
chapters_dir=$("$scripts_dir"/generate_chapters "$abs_path")

for chapter in "$chapters_dir"/*.txt; do
   get_stats "$chapter"
done

get_stats "$abs_path"
```