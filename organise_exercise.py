import json

def write_json(new_data, filename='ordered_exercises.json'):
    with open(filename,'r+') as writeFile:
          # First we load existing data into a dict.
        file_data = json.load(writeFile)
        # Join new_data with file_data inside emp_details
        file_data["exercises"].append(new_data)
        # Sets file's current position at offset.
        writeFile.seek(0)
        # convert back to json.
        json.dump(file_data, writeFile, indent = 4)

exercises = []

with open('exercises.json', 'r') as file:
    data = json.load(file)

count = 0

for i in data['exercises']:
    if not any(k == i for k in exercises):
         print(i["name"], ": true")
         count += 1
         i["id"] = count
         exercises.append(i)
         for j in data['exercises']:
                if i != j:
                    if i["name"] == j["name"]:
                        count += 1
                        j["id"] = count
                        exercises.append(j)
                    elif i["name"] + "(One Arm)" == j["name"]:
                        count += 1
                        j["id"] = count
                        exercises.append(j)
                      
                 
file.close()

write_json(exercises)