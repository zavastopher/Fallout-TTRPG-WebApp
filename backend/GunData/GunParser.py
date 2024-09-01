try:
    filename = input("Hello, please provide a filename")
    with f as open(filename):
        print(f.readline())
except:
    print("There was an error reading the file!")