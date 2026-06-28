import re
with open(r'c:\Users\HomePC\Documents\peet\src\components\public\Hero.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'</motion\.([a-zA-Z0-9]+)>', r'</\1>', content)
content = re.sub(r'<motion\.([a-zA-Z0-9]+)', r'<\1', content)
with open(r'c:\Users\HomePC\Documents\peet\src\components\public\Hero.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
