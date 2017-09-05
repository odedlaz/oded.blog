title: Language Server Protocol
tags:
  - productivity
  - language-server-protocol
  - lsp
id: 99
updated: '2017-03-28 08:37:21'
permalink: language-server-protocol
categories:
  - general
  - ''
date: 2017-03-28 07:06:00
---
The [Language Server Protocol](http://langserver.org/) (LSP) is an open protocol created & lead by Microsoft that defines a common language for programming language analyzers to speak. I'm extremely excited about it, and I believe that once your read more about it, you would too.

![](/images/2017/03/2016_06_27_any-developer-any-any-tool.png)

From the [official LSP specification](https://github.com/Microsoft/server-protocol):

>```
The Language Server protocol is used between a tool (the client) and a language smartness provider (the server) to integrate features like auto complete, go to definition, find all references and alike into the tool
```

### Why?

LSP creates the opportunity to reduce the m-times-n complexity problem of providing a high level of support for any programming language in any editor, IDE, or client endpoint to a simpler m-plus-n problem.


<table class="table table-bordered table-condensed">
    <tr>
        <th width="20%"></th>
        <th width="20%">Go</th>
        <th width="20%">Java</th>
        <th width="20%">python</th>
        <th width="20%">JavaScript</th>
        <th width="20%">...</th>
    </tr>
    <tr>
        <td>Vim</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Emacs</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Atom</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Sublime</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>VSCode</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>...</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
</table>

For example, when [Go](https://golang.org/) came out, plugins were created for each major editor & IDE: Vim, Emacs, Atom, Sublime, VSCode, Eclipse, etc'. Instead of a community effort to create the best code analyzer, the community was focused on creating analyzers for each available tool. 

Furthermore, when a new editor is created, it needs to support dozens of languages in order to gain traction - an impossible fit for small projects.

LSP allows language communities to concentrate their efforts on a single, high performing language server, while editor and client communities can concentrate on building a single, high performing, intuitive and idiomatic extension that can communicate with any language server to instantly provide deep language support.

### State of LSP

Several companies have come together to support its growth, including [Codenvy](https://codenvy.com/), [Red Hat](https://www.redhat.com/en), [Sourcegraph](https://sourcegraph.com/) and of course [Microsoft](https://www.microsoft.com).

The protocol is becoming supported by a rapidly growing list of editor and language communities. All popular languages have a language server implementation: [C#](https://github.com/OmniSharp/omnisharp-node-client/blob/master/languageserver), [Go](https://github.com/sourcegraph/go-langserver), [Java](https://github.com/gorkem/java-server), [JavaScript](https://github.com/sourcegraph/javascript-typescript-langserver), [python](https://github.com/palantir/python-server), [Swift](https://github.com/rlovelett/langserver-swift), [C \ C++](https://reviews.llvm.org/diffusion/L/browse/clang-tools-extra/trunk/clangd/) and more.

There are already LSP clients for many Editors \ IDE's: [Eclipse Che](https://github.com/eclipse/che/), [VSCode](https://github.com/Microsoft/VSCode), [neovim](https://github.com/autozimu/LanguageClient-neovim), [Sublime](https://github.com/sourcegraph/sublime-lsp), [Atom](https://github.com/atom/atom-languageclient), [Emacs](https://github.com/sourcegraph/emacs-lsp) and more.

The quality of the clients & servers is varying, specifically for language clients. VSCode is already using LSP as its backend for language analysis, [Neovim](https://neovim.io/) is [already talking about making LSP a first class citizen](https://github.com/neovim/neovim/issues/5522), and I believe more will follow.


### Further reading
* [Language Server Protocol Specification](https://github.com/Microsoft/server-protocol/blob/master/protocol.md)
* [Protocol History](https://github.com/Microsoft/server-protocol/wiki/Protocol-History)
* [A Common Protocol for Languages](https://code.visualstudio.com/blogs/2016/06/27/common-protocol)
* How Sourcegraph scales with the Language Server Protocol
   * [The problem of Code Intelligence and the need for an open standard](https://about.sourcegraph.com/blog/part-2-how-sourcegraph-scales-with-the-language-server-protocol/)
   * [Making Code Intelligence “just work”](https://about.sourcegraph.com/blog/part-2-how-sourcegraph-scales-with-the-language-server-protocol/)
