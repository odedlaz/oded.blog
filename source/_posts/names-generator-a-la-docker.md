title: names generator à la docker
tags:
  - docker
  - python
  - golang
id: 132
updated: '2017-06-20 09:03:20'
permalink: names-generator-a-la-docker
categories:
  - programming
date: 2017-06-20 08:03:00
---

I really like docker's names generator. It makes remembering id's easier, and as of version 0.7.x, it generates names from notable scientists and hackers, which gives it an extra bonus!

![](/images/2017/06/docker.png)

There are a number of ports out there ([shamrin/namesgenerator](https://github.com/shamrin/namesgenerator) for example), but all of them just copy-and-paste the names, which is not cool at all.

I decided to parse [names-generator.go](https://raw.githubusercontent.com/moby/moby/master/pkg/namesgenerator/names-generator.go) and extract the names from it, thus making sure it's always up to date.


I wrote two implementations, one in python and one in go.
- [python](/2017/06/20/names-generator-a-la-docker#regular-expressions): parses the code directly using regular expressions
- [go](/2017/06/20/names-generator-a-la-docker#abstract-syntax-tree): parses the code using go's AST package, and spit python code to stdout.

^ The hyperlinks lead to the relevant section in the blog post.

The amount of lines needed to do all that work is relatively short, which shows how powerful these languages are.


<!-- more -->

## Regular Expressions

The following code is straight forward. First I download the text, then I parse it using a regular expressions.

I did use a cool trick - I've update the [locals](https://docs.python.org/3/library/functions.html#locals) from the generated code.


```python
import random
import requests
import re


URL = ("https://raw.githubusercontent.com"
       "/moby/moby/master/pkg/namesgenerator/"
       "names-generator.go")

# get the variable name (left|right) and text in the curly braces:
# - the first part captures 'left|right'
# - the second part looks behind for the '{' character, then captures
#   anything between it and the '}' character
_var_and_curly = re.compile("(left|right).*((?<={)[^}]*)")

# extract the strings inside the curly braces text
_extract_in = re.compile("\"(.+)\"")

# update the locals of this package with '_left' and '_right' values
# that were parsed from the url
locals().update({"_" + var_name.strip(): _extract_in.findall(txt_in_brackets)
                 for var_name, txt_in_brackets
                 in _var_and_curly.findall(requests.get(URL).text)})

_sr = random.SystemRandom()


def get(retry=False):
    """
    generates a random name from the list of adjectives and surnames
    formatted as "adjective_surname". For example 'focused_turing'.
    If retry is True, a random integer between 0 and 10 will be
    added to the end of the name, e.g 'focused_turing3'
    """

    while True:
        name = _sr.choice(_left) + "_" + _sr.choice(_right)

        # Steve Wozniak is not boring
        if name != "boring_wozniak":
            break

    if retry:
        name += str(random.randint(0, 10))

    return name
```


### Abstract Syntax Tree

When go [ported its compiler to go](https://go-review.googlesource.com/c/5652/) a few years ago, it added a bunch of packages that the compiler needed to do its work. One of them is the excellent [go/ast](https://golang.org/pkg/go/ast/) package, which makes parsing go code a breeze.

The following snippet spits [PEP8](https://www.python.org/dev/peps/pep-0008/) conformant python code to stdout:

1. Downloads the *names-generator.go* file 
2. Parses the code
3. Walks over the AST and prints out the variables it finds  
4. Prints the python *get* function


```go
package main

import (
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"io"
	"io/ioutil"
	"net/http"
	"os"
)

//FuncVisitor ...
type FuncVisitor struct {
}

//getEmptyString generates an empty string of size n
func getEmptyString(n int) string {
	spaces := make([]rune, n+1)
	for i := range spaces {
		spaces[i] = ' '
	}
	return string(spaces)

}

//getValue gets the string value of a basic ast node
func getValue(elt interface{}) string {
	return elt.(*ast.BasicLit).Value
}

//Visit visits all nodes in the ast and prints variable content
func (v *FuncVisitor) Visit(node ast.Node) (w ast.Visitor) {
	switch t := node.(type) {
	case *ast.ValueSpec:
		// iterate all variables (should be "first", "last")
		for _, id := range t.Names {
			// print the variable, for example: _left = [
			txt := fmt.Sprintf("%s = [", id.Name)
			fmt.Printf("_%s", txt)

			// extract the number of leading spaces
			spaces := getEmptyString(len(txt))
			names := id.Obj.Decl.(*ast.ValueSpec).Values[0]
			elts := names.(*ast.CompositeLit).Elts

			// print the first value
			fmt.Printf("%s,\n", getValue(elts[0]))

			// iterate all inner values
			for _, x := range elts[1 : len(elts)-2] {
				value := getValue(x)

				fmt.Printf("%s%s,\n", string(spaces), value)
			}

			// print the last value
			fmt.Printf("%s%s]",
				spaces,
				getValue(elts[len(elts)-1]))
		}

		fmt.Printf("\n\n")
	}

	return v
}

var pyImports = `import random`

var pySystemRandom = `_sr = random.SystemRandom()`

var pyGetFunction = `def get(retry=False):
    """
    generates a random name from the list of adjectives and surnames
    formatted as "adjective_surname". For example 'focused_turing'.
    If retry is True, a random integer between 0 and 10 will be
    added to the end of the name, e.g 'focused_turing3'
    """

    while True:
        name = _sr.choice(_left) + "_" + _sr.choice(_right)

        # Steve Wozniak is not boring
        if name != "boring_wozniak":
            break

    if retry:
        name += str(random.randint(0, 10))

    return name
`

func downloadMobyProjectContainerNameGenerator() string {
	url := "https://raw.githubusercontent.com/moby/moby/master/" +
		"pkg/namesgenerator/names-generator.go"

	tmpfile, _ := ioutil.TempFile(os.TempDir(),
		"names-generator.go.")
	defer tmpfile.Close()

	response, _ := http.Get(url)
	defer response.Body.Close()

	io.Copy(tmpfile, response.Body)
	return tmpfile.Name()
}

func main() {
	// download names generator and parse it
	path := downloadMobyProjectContainerNameGenerator()
	file, _ := parser.ParseFile(token.NewFileSet(), path, nil, 0)

	// generate python code that does the same
	fmt.Printf("%s\n\n", pyImports)
	ast.Walk(new(FuncVisitor), file)
	fmt.Printf("%s\n\n\n", pySystemRandom)
	fmt.Printf(pyGetFunction)
}
```
