# trening 24/02 TS

# := operator (walrus operator) - Description: The walrus operator (:=) is a new operator in Python 3.8 that allows you to assign values to variables as part of an expression. It is useful for reducing code duplication and improving readability.
# Example for := operator: 
# 
# import re 
#
# def contains_spam(text):
#     pattern = r"spam"
#     return bool(match := re.search(pattern, text))
#
# def main():
#     text = "eggspamsausagespam"
#     if contains_spam(text):
#         print(f"The word 'spam' was found in '{text}'")
#     else:
#         print(f"No occurrence of 'spam' found in '{text}'")
#
# if __name__ == "__main__":
#    main()


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


url = input("Enter a URL: ").strip()
if not re.match(r"https?://", url):
    print("Invalid URL")
    sys.exit(1)
print(f"URL: {url}")

