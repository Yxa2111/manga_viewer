with open('dist/index.html', 'r') as f:
    s = f.read().replace('=/js', '=./js').replace('=/css', '=./css')

with open('dist/index.html', 'w') as f:
    f.write(s)
