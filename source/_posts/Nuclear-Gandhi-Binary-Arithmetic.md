title: Nuclear Gandhi & Binary Arithmetic
tags:
  - c
  - math
id: 113
updated: '2017-05-08 06:45:43'
permalink: nuclear-gandhi
categories:
  - programming
date: 2017-05-07 17:04:00
---

Nuclear Gandhi is the nickname given to the Indian historical figure [Mahatma Gandhi](https://en.wikipedia.org/wiki/Mahatma_Gandhi) as portrayed in the turn-based strategy video game series Civilization. 

A bug in the game caused Gandhi, who is a known pacifist in real life, to turn into a nuclear-obsessed maniac that made India the most hostile civilization in the game.

![](/images/2017/05/nuclear-gandhi-3d.jpg)

The cause was a glitch in the artificial intelligence settings for Gandhi’s aggression level: Gandhi started with the lowest level of aggression to reflect his historical legacy of pacifism: *1*.

When a player adopted democracy in Civilization, their aggression would be automatically reduced by *2*, which means that Gandhi's aggression level should have gone to *-1*, but instead the aggression level went all the way up to *255*, making him as aggressive as a civilization could possibly be.

Interesting right? but how the heck does *-1* become *255*?

## A bit of math

Don't worry. I'm not going to dive in too deep. There's a plethora of blog posts and explanations on how integer arithmetic & representation work.

I'll explain just enough in order for you to understand what's going on.

### Integer representation
$$ {5_{10}} $$ in 8-bit binary is $$ {00000101_2} $$, pretty straight forward.
But what about $$ {-5_{10}} $$? How is it implemented? lets draft a possible solution.

First, we need to know the sign of the number. We'll reserve the most significant bit for the sign, and use the rest as the values. Second, We'll make sure we don't break compatibility and set the sign bit for positive numbers to zero, and negative numbers to one. In this scenario a 
signed 8-bit number would range from -127 to 127.


Now, in our hacky system, $$ {5_{10}} $$ won't change, and $$ {-5_{10}} $$ will be $$ {10000101_2} $$.

But here's the catch - regular arithmetic doesn't work:

$$
{5_{10}} + {-5_{10}} = {00000101_2} + {10000101_2} = {10001010_2} = {-10_{10}} \ne 0
$$

We can build custom assembly arithmetic, but that's an over-kill.

### Two's complement

> Two's complement is a mathematical operation on binary numbers, as well as a binary signed number representation based on this operation. Its wide use in computing makes it the most important example of a radix complement. -  [Wikipedia](https://en.wikipedia.org/wiki/Two%27s_complement)


TL;DR: a different system that makes arithmetic work as you'd expect. 

```c
// 00000101
int x = 5;
// ~x = 11111010 
// ~x + 1 = 11111011
int negativeX = ~x + 1;
```

For example, addition of $$ {5_{10}} $$ and $$ {-5_{10}} $$ works like we expect: $$ {5_{10}} + {-5_{10}} = {00000101_2} + {11111011_2} = {00000000_2} $$

More information is out of scope for this blog post. If you're interested, start from the answers for [What is “2's Complement”?](https://stackoverflow.com/questions/1049722/what-is-2s-complement) on StackOverflow.

## Ok, so what happened?

A Civilization's aggression level was saved as an `unsigned char`, which can't represent negative values.

Gandhi's aggression level started at $$ {1_{10}} $$, and when democracy arrived, it was reduced by two: $$ {1_{10}} - {2_{10}} = {00000001_2} - {00000010_2} = {00000001_2} {\color{red} +} {11111110_2} = {11111111_2} $$

if the aggression level variable was signed, then the binary would be interpreted as $$ {-1_{10}}$$, which is what we'd expect. Instead, it was unsigned, which means it got interpreted as $$ {255_{10}}$$.

... And Gandhi turned from a pacifist into a warmonger: *"Greating from M. Gandhi, ruler and king of the Indians... Our words are backed with NUCLEAR WEAPONS!"*
![](/images/2017/05/nuclear-gandhi.jpg)
