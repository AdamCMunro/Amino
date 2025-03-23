import json

exercise_collection = []

id = int(input("Indicate starting ID index: "))

def write_json(new_data, filename='exercises.json'):
    with open(filename,'r+') as file:
          # First we load existing data into a dict.
        file_data = json.load(file)
        # Join new_data with file_data inside emp_details
        file_data["exercises"].append(new_data)
        # Sets file's current position at offset.
        file.seek(0)
        # convert back to json.
        json.dump(file_data, file, indent = 4)

while True:

    exercise_name = input("Enter exercise name: ")
    exercise_muscle = input("Enter exercise target muscle: ")
    exercise_equipment = input("enter exercise equipment: ")

    id += 1

    exercise = {
        "id": id,
        "name": exercise_name,
        "muscle": exercise_muscle,
        "equipment": exercise_equipment
    }

    write_json(exercise)





