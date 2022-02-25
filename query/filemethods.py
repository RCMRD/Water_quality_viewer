def handle_uploaded_file(f):
    newlist = []
    for lines in f.readlines():
        newlist.append(lines.split())
    return newlist
    # with open('', 'wb+') as destination:
    # for chunk in f.chunks():
    #     f.readline(chunk)