

# regular expressions
# . - any character except a newline
# \w - any letter, digit, or the underscore character
# * - zero or more occurrences of the previous character
# + - one or more occurrences of the previous character
# ? - zero or one occurrences of the previous character
# \s - any whitespace character
# \d - any digit
# /D - any non-digit
# r"string" - raw string
# ^ - start of the string
# \ - escape character
# $ - end of the string
# {m, n} - between m and n occurrences of the previous character
# [a-z] - any lowercase letter
# {m} - exactly m occurrences of the previous character
# [] - any character inside the square brackets
# [^] - any character not inside the square brackets
# A | B - A or B
# \b - word boundary

import re

def contains_spam(text):
    # 're.search' finds a match anywhere in the string.
    pattern = r"spam"
    return bool(re.search(pattern, text))

def is_valid_email(email):
    # This regex matches a broad range of valid email addresses.
    email_pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    email_pattern2 = r"^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
    email_patternO = r"^[a-zA-Z0-9_.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
    # Using re.fullmatch ensures the entire string matches the pattern.
    return bool(re.fullmatch(email_pattern, email))

def main():
    # Example for finding 'spam' in a string
    text = "eggspamsausagespam"
    if contains_spam(text):
        print(f"The word 'spam' was found in '{text}'")
    else:
        print(f"No occurrence of 'spam' found in '{text}'")

    # Validate email input from the user
    email = input("Enter your email address: ").strip()
    if is_valid_email(email):
        print("Valid email address")
    else:
        print("Invalid email address")

if __name__ == "__main__":
    main()
