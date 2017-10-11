title: Implementing Go's defer keyword in C++
tags:
  - c++
  - golang
permalink: go-defer-in-cpp
categories:
  - programming
date: 2017-10-5 11:24:00
---

Go has a neat keyword called defer that is used to ensure that a function call is performed later in a program’s execution, usually for purposes of cleanup.

Suppose we wanted to create a file, write to it, and then close when we’re done:
```go
package main

import "fmt"
import "os"

func createFile(p string) *os.File {
	fmt.Println("creating")
	f, err := os.Create(p)
	if err != nil {
		panic(err)
	}
	return f
}

func writeFile(f *os.File) {
	fmt.Println("writing")
	fmt.Fprintln(f, "data")
}

func closeFile(f *os.File) {
	fmt.Println("closing")
	f.Close()
}

func main() {
	f := createFile("/tmp/defer.txt")
	defer closeFile(f)
	writeFile(f)
}
```

Immediately after getting a file object with createFile, we defer the closing of that file with closeFile. This will be executed at the end of the enclosing function (main), after writeFile has finished.

Running the program confirms that the file is closed after being written:
```go
$ go run defer.go
creating
writing
closing
```

**[!]** The above was taken from [Go by Example](https://gobyexample.com/defer)

## Implementing defer in C++

C++ has a neat feature called *Resource acquisition is initialization*, a.k.a RAII. There are a lot of resources online that explain what is RAII and how it works, [Tom Dalling's](https://www.tomdalling.com/blog/software-design/resource-acquisition-is-initialisation-raii-explained/) for example.

One of the top uses for RAII are scope guards, which are usually used to perform cleanup. The concept is explained thoroughly in [Generic: Change the Way You Write Exception-Safe Code — Forever](http://www.drdobbs.com/cpp/generic-change-the-way-you-write-excepti/184403758).

I didn't like the implementation they suggested, and instead went searching for a better one. I found what I was looking for on [stackoverflow](https://stackoverflow.com/questions/10270328/the-simplest-and-neatest-c11-scopeguard/):
```cpp
class ScopeGuard {
 public:
  template<class Callable>
  ScopeGuard(Callable &&fn) : fn_(std::forward<Callable>(fn)) {}

  ScopeGuard(ScopeGuard &&other) : fn_(std::move(other.fn_)) {
    other.fn_ = nullptr;
  }

  ~ScopeGuard() {
    // must not throw
    if (fn_) fn_();
  }

  ScopeGuard(const ScopeGuard &) = delete;
  void operator=(const ScopeGuard &) = delete;

 private:
  std::function<void()> fn_;
};
```

which can be used as follows:
```cpp
std::cout << "creating" << std::endl;
std::ofstream f("/path/to/file");
ScopeGuard close_file = [&]() { std::cout << "closing" << std::endl;
                                f.close(); };
std::cout << "writing" << std::endl;
f << "hello defer" << std::endl;
```

The above execution flow would be: `creating -> writing -> closing`.  
Nice, right? but it also forces us to name each ScopeGuard, which is annoying.

Thank god we have macros! (never say that. same for `goto`) -
```cpp
#define CONCAT_(a, b) a ## b
#define CONCAT(a, b) CONCAT_(a,b)
#define DEFER(fn) ScopeGuard CONCAT(__defer__, __LINE__) = fn
```

and now we have a defer like behaviour in C++:
```cpp
std::cout << "creating" << std::endl;
std::ofstream f("/path/to/file");
DEFER ( [&]() { std::cout << "closing" << std::endl;
                f.close(); } );
std::cout << "writing" << std::endl;
f << "hello defer" << std::endl;
```

But why do we need the excess `[&]() { ... ; }` part? and what is it anyway?  
`[&]` tells the compiler to pass all locals by reference, and `()` is used to indicate function args.  
We *want* this behaviour for *all* `DEFER` calls, so let's put it in the macro: 

```cpp
#define DEFER(fn) ScopeGuard CONCAT(__defer__, __LINE__) = [&] ( ) { fn ; }
```

And now there's no need for boilerplate code: 
```cpp
std::ofstream f("/path/to/file");
DEFER ( f.close() );
f << "hello defer" << std::endl;
```

The neat part is that we can call *DEFER* multiple times without having to name variables,  
because each *DEFER* call creates a *ScopeGuard* with a random name in order to avoiding colissions;
```cpp
std::ofstream f1("/path/to/file1");
DEFER ( f1.close() );
f1 << "hello defer" << std::endl;
std::ofstream f2("/path/to/file2");
DEFER ( f2.close() );
f2 << "hello defer" << std::endl;
```

It also works with multiline functions, just like golang's `defer` keyword:
```cpp
std::ofstream f("/path/to/file1");
DEFER ( { std::cout << "closing file" << std::endl;
          f.close(); } );
f << "hello defer" << std::endl;

// curly-braces and trailing comma's are not mandatory.
// the previous statement could've been written like this too:
DEFER ( std::cout << "closing file" << std::endl;
        f.close() );
```