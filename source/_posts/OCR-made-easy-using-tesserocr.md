title: OCR made easy using tesserocr
tags:
  - python
  - ocr
id: 69
updated: '2017-03-07 19:34:20'
permalink: ocr-made-easy-using-tesserocr
categories:
  - programming
date: 2017-01-08 10:09:00
---
There are numerous [OCR](https://en.wikipedia.org/wiki/Optical_character_recognition) libraries for python. [tesserocr](https://github.com/sirfz/tesserocr) is the only library I found that has a decent, humanly-approachable API.

In this blog post we'll use `tesserocr` to extract text from a nutrition facts image. 

<!-- more -->

## What is it exactly?

[tesserocr](https://github.com/sirfz/tesserocr) is a simple, Pillow-friendly, wrapper around [tesseract-ocr](https://github.com/tesseract-ocr/tesseract) API.  
[Pillow](http://python-pillow.github.io/) is a friendly PIL fork [(PIL](http://www.pythonware.com/products/pil/) is the Python Imaging Library).


## Demo

We'll extract text from this image:

![chocolate-nutrition-facts](/images/2017/02/chocolate-1.jpg)

First, install all the requirements:

```bash
$ sudo apt install tesseract-ocr \
                   libtesseract-dev \  
                   libleptonica-dev  
$ pip install Pillow cython tesserocr  
```

Now run the following gist:

```python
from tesserocr import PyTessBaseAPI
import sys
import os

# tesserocr -> https://pypi.python.org/pypi/tesserocr
# cython -> https://pypi.python.org/pypi/Cython
# Pillow -> https://pypi.python.org/pypi/Pillow

if len(sys.argv) != 2:
    print("you need to pass the path to the image as first argument")
    sys.exit(1)

path = sys.argv[1]
if not os.path.exists(path):
    print("image doesn't exist at: " + path)
    sys.exit(2)

with PyTessBaseAPI() as api:
    api.SetImageFile(os.path.abspath(path))
    lines = [l.strip() for l in api.GetUTF8Text().split("\")
             if l.strip() != ""]

for l in lines:
    print(l)
```

And viola!

```bash
$ python ocr.py /path/to/chocolate.jpg

Nutrition Facts  
 Serving Size 1 cup (249g)
 Servings Per Container 8
 Amount Per Sewing
 Calories 210 Calories from Fat 80
 % Daily Value
 Total Fat 8g 13%  
 Saturated Fat 5g 26%  
 Trans Fat 0g  
 Cholesterol 30mg 10%  
 Sodium 200mg 9%  
 Total Carbohydrate 27g 9%  
 Dietary Fiber 1g 5%  
 Sugars 25g  
 Protein 9g  
 Vitamin A 6% Vitamin C 0%  
 Calcium 30% Iron 6%  
 Vitamin D 30%  
 *Percent Daily Values are based on a 2,000 calorie  
 diet.  
```