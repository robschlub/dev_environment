import os
import re
lesson_path = './src/Lessons/'
file_extensions = ['js', 'scss']
path_matches = ['js', 'css']


def replace_paths(fileName, depth):
    f = open(fileName, 'r')
    depth_string = '../' * depth
    lines = f.readlines()
    new_lines = []
    for line in lines:
        new_line = line
        for path_match in path_matches:
            m = re.search(f'^ *import.*from \'.*\.\.\/{path_match}', new_line)
            if m:
                path = re.search(r'\'.*\/js\/', new_line)
                if path:
                    # print(depth_string)
                    new_line = re.sub(r'\'.*\/js\/', f'\'{depth_string}{path_match}/', new_line)
                    # print(line)
                    # print(new_line)
        new_lines.append(new_line)
    f.close()
    f = open(fileName, 'w')
    f.writelines(new_lines)
    f.close()


for root, dirs, files in os.walk(lesson_path):
    for file in files:
        name, ext = os.path.splitext(file)
        ext = ext.strip('.')
        depth = len(root.split(os.path.sep)) - 2
        # print(f'{root.split(os.path.sep)} {depth} {file} {ext}')
        if ext in file_extensions:
            replace_paths(os.path.join(root, file), depth)
    # print(root, "consumes", end=" ")
    # print(sum(getsize(join(root, name)) for name in files), end=" ")
    # print("bytes in", len(files), "non-directory files")
