import base64

with open('packing_edit.png', 'rb') as f:
    encoded = base64.b64encode(f.read()).decode('utf-8')
    print(encoded[:100])
