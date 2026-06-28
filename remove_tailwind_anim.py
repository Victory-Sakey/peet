import os
import re

def remove_animations_from_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    content = content.replace(' animate-pulse', '')
    content = content.replace('animate-pulse ', '')
    content = content.replace('animate-pulse', '')

    content = content.replace(' animate-spin', '')
    content = content.replace('animate-spin ', '')
    content = content.replace('animate-spin', '')

    content = content.replace(' animate-bounce', '')
    content = content.replace('animate-bounce ', '')
    content = content.replace('animate-bounce', '')

    if original_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
                file_path = os.path.join(root, file)
                remove_animations_from_file(file_path)

process_directory(r'c:\Users\HomePC\Documents\peet\src')
