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
class ScopeGuard  {
 public:
  template<class Callable>
  ScopeGuard(Callable && undo_func) : f(std::forward<Callable>(undo_func)) {}

  ScopeGuard(ScopeGuard && other) : f(std::move(other.f)) {
    other.f = nullptr;
  }

  ~ScopeGuard() {
    if(f) f(); // must not throw
  }

  ScopeGuard(const ScopeGuard&) = delete;

  void operator = (const ScopeGuard&) = delete;

 private:
  std::function<void()> f;
};
```

which can be used as follows:
```cpp
step1();
scope_guard guard1 = [&]() { revert1(); };
step2();
```

The above execution flow would be: `step1() -> step2() -> revert1()`.  
Nice, right? but the above forces us to name each ScopeGuard, which is annoying.

Thank god we have macros! (never say that. same for `goto`) -
```cpp
#define CONCAT_(a,b) a ## b
#define CONCAT(a,b) CONCAT_(a,b)
// __COUNTER__ is non-standard, but is supported by most major compilers nowadays.
// you can replace it with __LINE__, which will work in most cases.
#define DEFER(fn) ScopeGuard CONCAT(__defer__, __COUNTER__) = fn
```

and now we have a defer like behaviour in C++:
```cpp
step1();
DEFER([&]() { revert1(); }; );
step2();
```

The neat part is that we can call *DEFER* multiple times without having to name variables:
```cpp
step1();
DEFER([&]() { revert1(); }; );
step2();
DEFER([&]() { revert2(); }; );
```

Each *DEFER* call creates a *ScopeGuard* with a random name in order to avoiding colissions.
