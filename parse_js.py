import re
with open('index.html', 'r') as f:
    content = f.read()

js = content.split('<script>')[1].split('</script>')[0]

functions = re.findall(r'function (\w+)\(', js)
consts = re.findall(r'const (\w+)\s*=', js)
lets = re.findall(r'let (\w+)\s*=', js)

print("Functions:", len(functions))
print("Consts:", len(consts))
print("Lets:", len(lets))

with open('js_lines.js', 'w') as f:
    f.write(js)
