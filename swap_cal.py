import sys

with open("src/Equivesa.jsx", "r") as f:
    lines = f.readlines()

grid_start = -1
detail_start = -1
upcoming_start = -1

for i, line in enumerate(lines):
    if "{/* ---- Calendar Grid" in line:
        grid_start = i
    if "{/* ---- Day Detail Panel" in line:
        detail_start = i
    if "{/* ---- Upcoming strip at bottom" in line:
        upcoming_start = i

if grid_start != -1 and detail_start != -1 and upcoming_start != -1:
    grid_lines = lines[grid_start:detail_start]
    detail_lines = lines[detail_start:upcoming_start-1] # -1 to leave the closing </div> of ev-cal-body alone

    # Fix the borderLeft to borderRight in detail_lines
    for i in range(len(detail_lines)):
        if "borderLeft" in detail_lines[i]:
            detail_lines[i] = detail_lines[i].replace("borderLeft", "borderRight")
    
    new_lines = lines[:grid_start] + detail_lines + grid_lines + lines[upcoming_start-1:]
    
    with open("src/Equivesa.jsx", "w") as f:
        f.writelines(new_lines)
    print("Swapped Calendar Grid and Day Detail Panel!")
else:
    print(f"Error: {grid_start}, {detail_start}, {upcoming_start}")
