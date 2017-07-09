title: python string += strategies
tags:
  - python
id: 57
updated: '2017-03-07 20:04:55'
permalink: python-string-concat
categories:
  - programming
date: 2016-11-28 14:30:00
---


 

So many posts have been written about string concatenation in python.  
 I needed to look into this issue myself a few days ago and decided to check.

I wrote a deterministic timer, and ran the following tests:

- concatenate a string with +=
- concatenate bytearray string with extend
- concatenate a list of strings with str.join
- concatenate strings with cStringIO

Here are the results for 1000000 iterations:

```bash 
 $ ITERATIONS=1000000 python profile.py 1> /dev/null  
 Profiling 1000000 iterations [python 3.5.2]  
  
 block took 2.083 seconds to run [cstringio]  
 block took 2.031 seconds to run [str.join]  
 block took 1.705 seconds to run [+=]  
 block took 1.835 seconds to run [bytearray]

$ ITERATIONS=1000000 python profile.py 1> /dev/null  
 Profiling 1000000 iterations [python 2.7.12]  
   
 block took 1.715 seconds to run [cstringio]  
 block took 1.289 seconds to run [+=]  
 block took 1.623 seconds to run [str.join]  
 block took 1.332 seconds to run [bytearray]  
```

They are quite surprising. The bytearray += operation speed was expected  ([bytearray is mutable](https://docs.python.org/3.1/library/functions.html#bytearray)), but I was expecting *cstringio* and *str.join* to outperform an immutable string *+=* operation - specifically after reading [this benchmark](https://waymoot.org/home/python_string/).

What's going on here?

<!-- more -->

Last time I checked, python strings are **immutable**, which means that any string add operation creates a new string and concatenates the content of both strings. First I checked if *str* has a **iadd** function, but it didn't - so I had to look deeper - into the underlying [string implementation](https://github.com/python/cpython/blob/856b18acc123e8ea572a0f44b0e021f6ef08e09d/Objects/bytesobject.c).

Lets take a closer look at the [PyBytes_Concat](https://github.com/python/cpython/blob/856b18acc123e8ea572a0f44b0e021f6ef08e09d/Objects/bytesobject.c#L2865) method, which is in charge of string concatenation:

```c
void
PyBytes_Concat(PyObject **pv, PyObject *w)
{
    assert(pv != NULL);
    if (*pv == NULL)
        return;
    if (w == NULL) {
        Py_CLEAR(*pv);
        return;
    }

    if (Py_REFCNT(*pv) == 1 && PyBytes_CheckExact(*pv)) {
        /* Only one reference, so we can resize in place */
        Py_ssize_t oldsize;
        Py_buffer wb;

        wb.len = -1;
        if (PyObject_GetBuffer(w, &wb, PyBUF_SIMPLE) != 0) {
            PyErr_Format(PyExc_TypeError, "can't concat %.100s to %.100s",
                         Py_TYPE(w)->tp_name, Py_TYPE(*pv)->tp_name);
            Py_CLEAR(*pv);
            return;
        }

        oldsize = PyBytes_GET_SIZE(*pv);
        if (oldsize > PY_SSIZE_T_MAX - wb.len) {
            PyErr_NoMemory();
            goto error;
        }
        if (_PyBytes_Resize(pv, oldsize + wb.len) < 0)
            goto error;

        memcpy(PyBytes_AS_STRING(*pv) + oldsize, wb.buf, wb.len);
        PyBuffer_Release(&wb);
        return;

      error:
        PyBuffer_Release(&wb);
        Py_CLEAR(*pv);
        return;
    }

    else {
        /* Multiple references, need to create new object */
        PyObject *v;
        v = bytes_concat(*pv, w);
        Py_SETREF(*pv, v);
    }
}
```

What is this mysterious if statement on line 12? If you'll look closely, it checks if the ref count for that string is one. If that's <span style="text-decoration:underline;">not the case</span>, it goes on to perform a full, immutable copy.  otherwise, it calls [_PyBytes_Resize](https://github.com/python/cpython/blob/856b18acc123e8ea572a0f44b0e021f6ef08e09d/Objects/bytesobject.c#L2937):

```c
/* The following function breaks the notion that bytes are immutable:
   it changes the size of a bytes object.  We get away with this only if there
   is only one module referencing the object.  You can also think of it
   as creating a new bytes object and destroying the old one, only
   more efficiently.  In any case, don't use this if the bytes object may
   already be known to some other part of the code...
   Note that if there's not enough memory to resize the bytes object, the
   original bytes object at *pv is deallocated, *pv is set to NULL, an "out of
   memory" exception is set, and -1 is returned.  Else (on success) 0 is
   returned, and the value in *pv may or may not be the same as on input.
   As always, an extra byte is allocated for a trailing \0 byte (newsize
   does *not* include that), and a trailing \0 byte is stored.
*/

int
_PyBytes_Resize(PyObject **pv, Py_ssize_t newsize)
{
    PyObject *v;
    PyBytesObject *sv;
    v = *pv;
    if (!PyBytes_Check(v) || newsize < 0) {
        goto error;
    }
    if (Py_SIZE(v) == newsize) {
        /* return early if newsize equals to v->ob_size */
        return 0;
    }
    if (Py_REFCNT(v) != 1) {
        goto error;
    }
    /* XXX UNREF/NEWREF interface should be more symmetrical */
    _Py_DEC_REFTOTAL;
    _Py_ForgetReference(v);
    *pv = (PyObject *)
        PyObject_REALLOC(v, PyBytesObject_SIZE + newsize);
    if (*pv == NULL) {
        PyObject_Del(v);
        PyErr_NoMemory();
        return -1;
    }
    _Py_NewReference(*pv);
    sv = (PyBytesObject *) *pv;
    Py_SIZE(sv) = newsize;
    sv->ob_sval[newsize] = '\0';
    sv->ob_shash = -1;          /* invalidate cached hash value */
    return 0;
error:
    *pv = 0;
    Py_DECREF(v);
    PyErr_BadInternalCall();
    return -1;
}
```

In other words, as long as you have only one module referencing your string , instead of performing a full copy, cpython only extends the old string with the new!


## The code

Instead of using [timeit](https://docs.python.org/2/library/timeit.html) I wrote a different implementation:

```python
from __future__ import print_function
import gc
import sys
import time

class TimeIt(object):

    def __init__(self, scope_name="", fd=sys.stdout):
        self._start = None
        self._fd = fd
        self._fmt = 'block took {{secs:.5f}} seconds to run [{}]'.format(scope_name)

    def __enter__(self):
        # run the garbage collector
        # then disable it so it won't tamper with the measurments
        gc.collect()
        gc.disable()
        self._start = time.time()

    def __exit__(self, exc_type, exc_val, exc_tb):
        now = time.time() - self._start
        print(self._fmt.format(secs=now).strip(), file=self._fd)

        # enable garbage collection after we're done with measurments
        gc.enable()
```

The code for the test can be found [here](https://gist.github.com/odedlaz/84840b070f3704d1a335f4203d716747).


