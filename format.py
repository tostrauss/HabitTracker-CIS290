# trening 24/02 TS

import os
import sys
import re

name = input("Enter your name: ").strip()
# if "," in name:
    # last, first = name.split(", ?")
    # name = f"{first.strip()} {last.strip()}"
if re.search(r"\d$", name):
    print("Your name must not contain a number")
    sys.exit(1)
if not name:
    print("You must enter a name")
    sys.exit(1)
print(f"Hello, {name}")

match  = re.search(r"^(.+), (.+)$", name)
if match:
    last = match.group(1)
    first = match.group(2)
    name = f"{first} {last}"
    print(f"Hello, {first} {last}")
else:
    print(f"Hello, {name}")

matches = re.findall(r"\b\w{4}\b", name)
if matches:
    print(f"Found words: {matches}")
else:
    print("No words found")
