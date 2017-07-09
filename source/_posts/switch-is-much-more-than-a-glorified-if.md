title: switch is much more than a glorified if
tags:
  - assembly
  - c
  - ''
id: 107
updated: '2017-04-21 08:58:09'
permalink: switch-is-much-more-than-a-glorified-if
categories:
  - programming
date: 2017-04-19 16:06:00
---

this post is a bit low level. I've been writing a lot of C & C++ recently, and found a few concepts eye opening. This post is dedicated to all the people that think that `switch` is a glorified `if`.

I'm going to do my best to avoid writing a lot of assembly, and make this post as easy as possible. Don't worry if you don't know any assembly, I'll explain everything!

![](/images/2017/04/goto-xkcd.png)

<!-- more -->


## The if statement

First, we need to understand how `if` statements are transformed from `c` to `assembly`.  
We'll use [gcc's](https://gcc.gnu.org/) `-S` flag to generate the assembly of our functions: 

```bash
gcc -O2 -S -c foo.c
```

Here's a simple example of a `max` implementation:

```c
int max(int x, int y) {
  if (x > y) {
    return x;
  }
  return y;
}
```

<table border=0 style="width:100%">
  <tr>
    <th>disassembly</th>
    <th>assembly</th> 
  </tr>
  <tr>
    <td>
```c
int max(int x, int y) {
  int tmp = x; // move 8(R8),R3
  int return_val = y; // move 12(R8),R1
  int ok = (x <= y); // compare R1,R3
  if (ok) goto done; // jle L9
  return_val = x; // move R3,R1
done:
  return return_val;
}
```
    </td>
    <td>
```lanaguage-c
max:
    move 8(R8),R3
    move 12(R8),R1
    compare R1,R3
    jle L9
    move R3,R1 
L9:
    
    ...
```
    </td> 
  </tr>
</table>
What does all that really mean?
1. put `x` & `y` in registers `R3` and `R1`
2. compare `x` and `y`
3. if `x > y`, move `R3` to `R1`
4. return `R1`

#### move

```c
move 8(R8), R3
move 12(R8), R1
```

`x` and `y` are saved to registers `R3` and `R1` respectively.

##### Special Registers

###### R8

A register that holds the pointer to the beginning of the frame.  For example:

```
move 8(R8), R3
```

1. get the address of X at `R8 + sizeof(pointer) * 8`
  * all variables are stacked after the frame pointer 
2. move the value that is addressed by the above, and put it in `R3`. 

###### R1

A register dedicated for `return values`. `y` is already saved to R1, so if `x < y`, there's nothing to do. otherwise, we move the content of `R3` to `R1` and return.
#### compare

```c
compare R1,R3
```

compare `R1` and `R3`. `compare` sets a register flag that is used by `jle` to determine if it should jump to `L9` label or not.

#### jle

```c
jle L9
```

*jump lower* or *equal*. In other words: jump to label `L9` if `x < y`. otherwise, go to the next instruction.

**!** Remember that the value that's currently saved in `R1` is the one that's used as the return value.


## The switch statement

If `switch` was a glorified `if`, then the following would've compiled into a bunch of *move*-*compare*-*jle*-*move* statements.
 

```c
typedef enum {ADD, MULT, MINUS, DIV, MOD, BAD} op_type;

char unparse_symbol(op_type op) {
  switch (op) {
  case ADD :    return '+';
  case MULT:    return '*';
  case MINUS:   return '';
  case DIV:     return '/';
  case MOD:     return '%';
  case BAD:     return '?';
  }
}
```

but actually, it's compiled to this weird beast:
```c
unparse_symbol:	
   move 8(R8),R1
   compare $5,R1
   ja .L49
   jmp *.L57(,R1,4)
```

What's going on here?

#### Jump Table

Each block is labeled, and a table is created *at compile time* to bind an op to a label. These "bind table" is also called a "Jump Table":

```lanaguage-c
.section .rodata
   .align 4
.L57:
	.long .L51	# op = 0
	.long .L52	# op = 1
	.long .L53	# op = 2
	.long .L54	# op = 3
	.long .L55	# op = 4
	.long .L56	# op = 5

```

As you can see, there are five blocks. One for each case:

```c
.L51:
	move $43,R1	# ’+’
	jmp .L49
.L52:
	move $42,R1	# ’*’
	jmp .L49
.L53:
	move $45,R1	# ’-’
	jmp .L49
.L54:
	move $47,R1	# ’/’
	jmp .L49
.L55:
	move $37,R1	# ’%’
	jmp .L49
.L56:
	move $63,R1	# ’?’
.L49:
    ...
```

If the following was C code, It would probably look similar to this:

```c
// get the pointer to the block of code that belongs to 'op'
target = JumpTable[op];
// get the address that saved at JumpTable[op], and go there.
goto *target;
```

and back to the assembly...

```c
move 8(R8),R1 // move the switch operation to R1
compare $5,R1 // compare the number 5 to the switch op
ja .L49  // jump above -> if op > 5: go to end (no default case)
jmp *.L57(,R1,4) // access the jump table to find the op's label
```

Lets talk a bit about the last instruction, because it's the most complicated one:

```c
jmp *.L57(,R1,4)
```

* `.L57` is address of the jump table.
* `Lxx` is translated into an address by the assembler.
* The jump table is layout sequentially  in memory, so all the cells are squeezed next to each other.
* The `switch` operation is the index in the table. In 32 bit architectures, We're talking about 4 bytes.

All in all, the address of the op's cell will be at: `L57 + op * 4` in a 32bit machine.

In conclusion, we only need **one** instruction to:
1. access the jump table
2. find the right cell
3. take the label address that's saved in the cell
4. jump to that location (which holds the code block)

cool right?!

### Switch optimizations

```c
int div111(int x) {
   switch(x) {
      case 000: return 0;
      case 111: return 1;
      case 222: return 2;
      case 333: return 3;
      case 444: return 4;
      case 555: return 5;
      case 666: return 6;
      case 777: return 7;
      case 888: return 8;
      case 999: return 9;
      default: return -1;
  }
}
```

Now the cases aren't laid out sequentially in memory.  would that produce a 1000 cell jump table?

Theoretically, without any optimization, the jump table would've contained many empty cells. Instead, the compiler performs a neat optimization: It produces a binary search tree to find the right case on runtime:

```c
move 8(R8),R1	         
compare $444,R1	        
je L8
jg L16
compare $111,R1	        
je L5
jg L17
...

L16: compare $777,R1  
...
```

If you look closely, you'll see that the compiler actually removed the jump table and replaced it with `compare` & `jump equal` calls. In other words, it replaced the *switch* statement with a "regular" *if*.

That's kind of awesome no? I find it really cool that compilers can perform such neat tricks.

