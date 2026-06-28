import re

with open(r'c:\Users\HomePC\Documents\peet\src\components\public\Hero.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove motion import
content = re.sub(r'import \{ motion, AnimatePresence, type Variants \} from \"framer-motion\";\n', '', content)
content = re.sub(r'const cardContainerVariants: Variants = \{.*?\};\n', '', content, flags=re.DOTALL)
content = re.sub(r'const cardVariants: Variants = \{.*?\};\n', '', content, flags=re.DOTALL)

# Replace motion.TAG with TAG
content = re.sub(r'<motion\.([a-zA-Z]+)', r'<\1', content)
content = re.sub(r'</motion\.([a-zA-Z]+)>', r'</\1>', content)

# Remove AnimatePresence
content = re.sub(r'<AnimatePresence.*?>\n?', '', content)
content = re.sub(r'</AnimatePresence>\n?', '', content)

# Remove framer motion props
def remove_prop(prop_name, text):
    pattern = r'\s*' + prop_name + r'=\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
    text = re.sub(pattern, '', text, flags=re.DOTALL)
    pattern2 = r'\s*' + prop_name + r'=\"[^\"]*\"'
    text = re.sub(pattern2, '', text, flags=re.DOTALL)
    pattern3 = r'\s*' + prop_name + r'(?=\s|>)'
    text = re.sub(pattern3, '', text)
    return text

props_to_remove = ['initial', 'animate', 'transition', 'whileHover', 'whileTap', 'whileInView', 'variants', 'viewport', 'layoutId', 'layout', 'exit']

for prop in props_to_remove:
    content = remove_prop(prop, content)

content = content.replace('animate-pulse', '')

with open(r'c:\Users\HomePC\Documents\peet\src\components\public\Hero.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
