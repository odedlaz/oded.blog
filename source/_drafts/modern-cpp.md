
C++ is a big language that has evolved tremendously since it's inception way back in the 1980's.

Throughout the years, many millions lines of code have been written in the language and a big portion of that code is using legacy features that aren't considered good practice anymore.


## Replacing C++?

There were *many* attempts to replace the lanaguage. All of them failed as far as I know.

Some attempts were made to subset the language to get rid of code & language dept, which hurt speed and portability.

The most recent hype is around [rust](https://www.rust-lang.org/), which is a blazing fast, memory safe systems programming language.

I see a promising future for `rust`, but like Bjarne said, it would take 10 years for a good language to make it to mainstream.

C++ is already here. We need to find a way for people to write good C++ now.

## Subset of Superset

Bjarne is correct. Simple sub-setting the language won't work.  
We need low-level / tricky / close-to-the-hardware / error-prone / expert-only features, in order to implement higher-level facilities efficiently.

Bjarne talked about the subject at CPPCon a few years back:
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/1OEu9C51K2A?rel=0&amp;start=1063" frameborder="0" allowfullscreen></iframe>


Bjarne said we first need to create a superset of the langauge, then subset it in order to get rid of the crud.

In order to do so, we need supporting facilities to make the transition.

From guidelines on how to write modern C++, to libraries that enpasulate the usage of messy & dangerous things so most programmers won't need to use them.

## Modern C++

What is modern C++? Put simply, Modern C++ stands for C++ that is based on C++1x and uses modern best practices.

To really grasp the essence of Modern C++, read the [Core Guidelines](https://github.com/isocpp/CppCoreGuidelines).

I also recommend watching the following talks: 
Bjarne Stroustrup “Writing Good C++14”
Herb Sutter: Writing Good C++ by Default
Gabriel Dos Reis: Modules
Gabriel Dos Reis: Contracts
Neil Macintosh: Static analysis
Neil Macintosh: array_view, string_view, etc 


## Writing Modern C++

The following is my checklist:

1. Use the [Guideline Support Library](https://github.com/Microsoft/GSL)
2. Introduce static-analysis tools that check these guidlines. I use [Clang-Tidy](https://clang.llvm.org/extra/clang-tidy/).
3. Don't reinvent the wheel. Format your code like big projects do. I use [Clang-Format](https://clang.llvm.org/docs/ClangFormat.html)
4. Turn on `warnings-as-errors` & `Wall`.
5. Use [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization) everywhere. If Your'e interfacing C code, create a scope guard. I use my home-baked [defer](https://oded.blog/2017/10/05/go-defer-in-cpp/) for that purpose.
6. Constify evertyghing


