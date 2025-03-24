const locationTest = document.getElementById('locationTest');
var testSearchBox = document.getElementById('testSearch');
const screenTitle = document.getElementsByClassName('screenTitle');
const gymSelector = document.getElementById('gymSelector');
const setType = ["n/a","Warmup", "Failure", "Drop", "Super", "Myo"];
var currentGym = -1;
const gymList = [];
const workoutList = [];
const prList = [];
const distance = 0.00019488405; //approximatetly 70 feet
var metric = 'KG';


if (localStorage.getItem('metric') != null)
{
    metric = localStorage.getItem('metric');
}

getLocalStorageList("gymList", gymList);
getLocalStorageList("workoutList", workoutList);
getLocalStorageList("prList", prList);

if (prList.length == 0)
{
    initialisePrList();
}


const workoutOptions = document.getElementById('workoutOptions');
var addExercise;
var endWorkout;

if (workoutOptions != null)
{
    addExercise = document.getElementById('workoutOptions').children[0];
    endWorkout = document.getElementById('workoutOptions').children[1];
}

let exitButton = document.getElementById('workoutExit');

if (gymSelector != null)
{
    addWorkoutEventListeners()
}
else
{
    displayWorkouts();
}

let settingsButton = document.getElementsByClassName('settings')[0];


if (settingsButton != null)
{
    settingsButton.addEventListener('click', settingsButtonClick);
}

let settingsExitButton = document.getElementById('settingsExit');

if (settingsExitButton != null)
{
    settingsExitButton.addEventListener('click', settingsExitButtonClick)
}

if (screenTitle.length != 0)
{
    screenTitle[0].addEventListener('click', moveToWorkoutScreen);
    screenTitle[1].addEventListener('click', moveToExercisesScreen);
    screenTitle[2].addEventListener('click', moveToStacksScreen);
}

let startWorkoutButton = document.getElementById("startWorkoutButton");

if (startWorkoutButton != null)
{
    startWorkoutButton.addEventListener('click', startWorkout);
}

function addWorkoutEventListeners()
{
    addExercise.addEventListener('click', addExerciseClick);
    getLocation();
    gymSelector.children[0].addEventListener('click', gymSelectorClick);
    endWorkout.addEventListener('click', endWorkoutClick);
    exitButton = exitButton.children[0];
    exitButton.addEventListener('click', showLeavePrompt);
}

function settingsButtonClick(evt)
{
    window.location.assign('settings.html');
}

function settingsExitButtonClick(evt)
{
    window.location.assign('index.html');
}

function getLocation() {
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(setCurrentGym);
    }
    else
    {
        console.log("Location not found");
        return -1;
    }
}


async function getJSON() {
        try {
            const res = await fetch("exercises.json");
            if (!res.ok) {
                throw new Error(res.status);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }

async function search(evt) {
    let text = evt.currentTarget.value;
    let results = await searchJSON(text);
    var listBox;
    if (document.getElementsByClassName('listDiv')[0] != null)
    {
        listBox = document.getElementsByClassName('listDiv')[0];
    }
    else
    {
        listBox = document.getElementById("listBox");
    }
    clearExercises();
    displayExercises(results, listBox);
    if (document.getElementsByClassName('listDiv')[0] != null)
    {
        let exerciseBox = document.getElementsByClassName('exerciseBox');
        Array.from(exerciseBox).forEach(element => {
        element.addEventListener('click', chooseExerciseType);
    })
    }
}

async function searchJSON(searchTerm) {
    const results = []
    data = await getJSON();
    let currentElement = "";
    console.log("currentElement: " + currentElement);
    data.exercises.forEach(element => {
        if (element.name.includes(searchTerm))
        {
            if (element.name != currentElement)
            {
                results.push(element);
                currentElement = element.name;
            }
        }
    });
    console.log("results: " + results);
    return results;
}

function moveToWorkoutScreen(evt) {
    if (evt.currentTarget.classList.contains('selected'))
    {
        return -1;
    }
    index = removeSelected();
    evt.currentTarget.classList.add('selected');
    if (index == 1)
    {
        doAnimation(evt.currentTarget, 'SlideLeft');
    }
    else
    {
        doAnimation(evt.currentTarget, 'SlideLeftLong');
    }
    createStartWorkoutButton();
    displayWorkouts();
}

async function moveToExercisesScreen(evt) {
    if (evt.currentTarget.classList.contains('selected'))
    {
        return -1;
    }
    index = removeSelected();
    evt.currentTarget.classList.add('selected');
    if (index == 0)
    {
        doAnimation(evt.currentTarget, 'SlideRight');
    }
    else
    {
        doAnimation(evt.currentTarget, 'SlideLeft');
    }
    let listBox = document.getElementById('listBox');
    displaySearchBar(listBox);
    let exercises = await searchJSON("");
    displayExercises(exercises, listBox);
}

function moveToStacksScreen(evt) {
    if (evt.currentTarget.classList.contains('selected'))
    {
        return -1;
    }
    index = removeSelected();
    evt.currentTarget.classList.add('selected');
    if (index == 0)
    {
        doAnimation(evt.currentTarget, 'SlideRightLong');
    }
    else
    {
        doAnimation(evt.currentTarget, 'SlideRight');
    }
}

function removeSelected()
{
    let titleArr = Array.from(screenTitle);
    let listBox = document.getElementById('listBox');
    let index = -1;

    for (let i = 0; i < titleArr.length; i++)
        if (titleArr[i].classList.contains('selected'))
        {
            titleArr[i].classList.remove('selected');
            index = i;
            break;
        }

    listBox.remove();

    let newListBox = document.createElement('div');
    newListBox.id = 'listBox';
    document.body.appendChild(newListBox);

    return index;

}

function createStartWorkoutButton() {
    let listBox = document.getElementById('listBox');

    let heroDiv = document.createElement('div');
    heroDiv.classList.add('heroDiv', 'colour1');
    heroDiv.id = "startWorkoutButton";
    heroDiv.addEventListener('click', startWorkout);

    let heroTitle = document.createElement('h1');
    heroTitle.classList.add('heroTitle', 'monoton-regular');
    heroTitle.innerHTML = "start new workout";

    heroDiv.appendChild(heroTitle);

    listBox.appendChild(heroDiv);

}

function displayWorkouts() {
    let listBox = document.getElementById('listBox');
    let index = 0;

    workoutList.forEach(element => {
        let workoutBox = document.createElement('div');
        workoutBox.classList.add('workoutBox');
        listBox.appendChild(workoutBox);

        workoutBox.addEventListener('click', showWorkoutDetails);

        workoutBox.id = index;
        index++;

        let name = document.createElement('h2');
        name.innerHTML = element.name;
        name.classList.add('name');
        workoutBox.appendChild(name);

        let date = document.createElement('h2');
        date.innerHTML = element.date;
        workoutBox.appendChild(date);
    })
}

function displaySearchBar(listBox) {
    let exerciseSearchBar = document.createElement('div');
    exerciseSearchBar.id = 'exerciseSearchBar';

    let exerciseSearchInput = document.createElement('input');
    exerciseSearchInput.type = "text";
    exerciseSearchInput.placeholder = "Search...";

    exerciseSearchBar.appendChild(exerciseSearchInput);

    listBox.appendChild(exerciseSearchBar);

    exerciseSearchInput.addEventListener('keyup', search)
}

function displayExercises(exerciseList, listBox) {
    exerciseList.forEach(element => {
        let exerciseBox = document.createElement('div');
        exerciseBox.classList.add('exerciseBox');
        exerciseBox.exerciseID = element.id;

        let h3 = document.createElement('h3');
        h3.innerHTML = element.name;

        let h4 = document.createElement('h4');
        h4.innerHTML = element.muscle;

        exerciseBox.appendChild(h3);
        exerciseBox.appendChild(h4);
        listBox.appendChild(exerciseBox);
    });
}

function clearExercises() {
    let exercises = document.getElementsByClassName('exerciseBox');
    let exerciseArr = Array.from(exercises);

    exerciseArr.forEach(element => {
        element.remove();
    })

}

function setTypeClick(evt) {
    for (let i = 0; i < setType.length; i++)
    { 
        if (evt.currentTarget.classList.contains(setType[i]) && i < (setType.length - 1))
        {
            evt.currentTarget.classList.remove(setType[i]);
            updateSetType(evt.currentTarget, setType[i+1], i+1);
            break;
        }
        else if (evt.currentTarget.classList.contains(setType[i]))
        {
            evt.currentTarget.classList.remove(setType[i]);
            updateSetType(evt.currentTarget, setType[0], 0);
            break;
        }
    }
}

function updateSetType(div, setType, index) {
    let text = div.children[0];
    div.classList.add(setType);
    switch(index) {
        case 0:
            div.style.backgroundColor = "#ffecc3";
            text.innerHTML = "";
            break;
        case 1:
            div.style.backgroundColor = "#f5cb32";
            text.innerHTML = setType.slice(0, 1);
            break;
        case 2:
            div.style.backgroundColor = "#c2000d";
            text.innerHTML = setType.slice(0, 1);
            break;
        case 3:
            div.style.backgroundColor = "#cc5600";
            text.innerHTML = setType.slice(0, 1);
            break;
        case 4:
            div.style.backgroundColor = "#418f43";
            text.innerHTML = setType.slice(0, 1);
            break;
        case 5:
            div.style.backgroundColor = "#418f43";
            text.innerHTML = setType.slice(0, 1);
            break;
    }

}

function setConfirmClick(evt) {
    let confirmButton = evt.currentTarget;
    console.log(confirmButton.style.backgroundColor);
    if (confirmButton.style.backgroundColor == "" || confirmButton.style.backgroundColor == 'rgb(255, 236, 195)')
    {
        confirmButton.style.backgroundColor = "#418f43";
        confirmButton.children[0].style.color = "white";
        confirmButton.children[0].style.opacity = "1";
    }
    else
    {
        confirmButton.style.backgroundColor = "#ffecc3";
        confirmButton.children[0].style.color = "#cc5600";
        confirmButton.children[0].style.opacity = "0.5";
    }
}

async function addExerciseClick(evt) {
    let listDiv = document.createElement("div");
    listDiv.classList.add('listDiv');
    document.body.appendChild(listDiv);
    displaySearchBar(listDiv);
    let exercises = await searchJSON("");
    displayExercises(exercises, listDiv);
    let exerciseBox = document.getElementsByClassName('exerciseBox');
    Array.from(exerciseBox).forEach(element => {
        element.addEventListener('click', chooseExerciseType);
    })
}

async function chooseExerciseType(evt)
{
    let name = evt.currentTarget.children[0].innerHTML;
    let id = evt.currentTarget.exerciseID;
    let equipmentList = await getEquipment(name);
    createEquipmentPopUp(equipmentList, name, id);
}

async function getEquipment(name)
{
    const equipmentList = [];
    let data = await getJSON();
    data.exercises.forEach(element => {
        if (element.name == name)
        {
            equipmentList.push(element.equipment);
            console.log("equipment: " + element.equipment);
        }
    })
    return equipmentList;
}

function createEquipmentPopUp(list, name, id) {
    let div = document.createElement('div');
    div.classList.add('equipmentPopUp');
    document.body.appendChild(div);
    let count = 0;
    list.forEach(l => {
        let lDiv = document.createElement('div');
        lDiv.classList.add('equipment');
        lDiv.classList.add("colour1");
        let lText = document.createElement('h2');
        lText.innerHTML = l;

        lDiv.appendChild(lText);
        div.appendChild(lDiv);

        lDiv.name = name;
        lDiv.equipment = l;
        lDiv.exerciseID = (id + count);
        count++

        lDiv.addEventListener("click", addExerciseToWorkout);

    })

}

function addExerciseToWorkout(evt) {
    
    let equipmentPopUp = document.getElementsByClassName('equipmentPopUp')[0];
    equipmentPopUp.remove();

    let listDiv = document.getElementsByClassName('listDiv')[0];
    listDiv.remove();

    let name = evt.currentTarget.name;
    let equipment = evt.currentTarget.equipment;
    let id = evt.currentTarget.exerciseID;

    createNewExercise(name, equipment, id);
}

function createNewExercise(name, equipment, id)
{
    let workoutExercises = document.getElementById('workoutExercises');

    let titleTable = document.createElement('div');
    titleTable.classList.add("titleTable");
    workoutExercises.appendChild(titleTable);

    let exerciseName = document.createElement('div');
    exerciseName.classList.add('exerciseName');
    titleTable.appendChild(exerciseName);

    let h3 = document.createElement("h3");
    h3.innerHTML = name;
    exerciseName.appendChild(h3);

    let h4 = document.createElement("h4");
    h4.innerHTML = equipment;
    exerciseName.appendChild(h4);

    let exerciseRemove = document.createElement('div');
    exerciseRemove.classList.add('exerciseRemove');
    titleTable.appendChild(exerciseRemove);

    exerciseRemove.addEventListener('click', exerciseRemoveClick);

    let img = document.createElement('img');
    img.setAttribute('src', 'exit_button.svg');
    exerciseRemove.appendChild(img);

    let exercise = document.createElement('div');
    exercise.classList.add("exercise");
    exercise.classList.add("colour1");
    exercise.exerciseID = id;
    workoutExercises.appendChild(exercise);

    let exerciseOptions = document.createElement('div');
    exerciseOptions.classList.add('exerciseOptions');
    workoutExercises.appendChild(exerciseOptions);

    let exerciseOptionsH3 = document.createElement('h3');
    exerciseOptionsH3.innerHTML = "Add Set";
    exerciseOptions.appendChild(exerciseOptionsH3);

    exerciseOptionsH3.addEventListener('click', addSetClick);
    
}

function exerciseRemoveClick(evt) {
    let titleTable = evt.currentTarget.parentElement;
    let titleTableList = document.getElementsByClassName('titleTable');
    let exerciseList = document.getElementsByClassName('exercise');
    let exerciseOptionsList = document.getElementsByClassName('exerciseOptions');
    for (let i = 0; i < titleTableList.length; i++)
    {
        if (titleTableList[i] == titleTable)
        {
            titleTableList[i].remove();
            exerciseList[i-1].remove();
            exerciseOptionsList[i-1].remove();
            break;
        }
    }
}

function addSetClick(evt) {
    let exerciseOptions = evt.currentTarget.parentElement;
    
    let exercise = getCurrentExercise(exerciseOptions);

    createNewSet(exercise);

    if (exercise.children.length < 2)
    {
        let exerciseOptionsH4 = document.createElement('h4');
        exerciseOptionsH4.innerHTML = "Remove Set";
        exerciseOptions.appendChild(exerciseOptionsH4);

        exerciseOptionsH4.addEventListener('click', removeSetClick);
    }
}

function createNewSet(parentElement)
{
    let set = document.createElement('div');
    set.classList.add('set');
    parentElement.appendChild(set);

    let setType = document.createElement('div');
    setType.classList.add('setType');
    setType.classList.add('colour1');
    setType.classList.add('n/a');
    set.appendChild(setType);

    setType.addEventListener('click', setTypeClick);

    let setTypeH2 = document.createElement('h2');
    setType.appendChild(setTypeH2);

    let setInputWeight = document.createElement('div');
    setInputWeight.classList.add('setInput');
    set.appendChild(setInputWeight);

    let labelWeight = document.createElement('label');
    labelWeight.innerHTML = "Weight:";
    setInputWeight.appendChild(labelWeight);

    let inputWeight = document.createElement('input');
    inputWeight.setAttribute('type', 'text');
    inputWeight.setAttribute('placeholder', metric);
    inputWeight.addEventListener('click', createKeypad);
    inputWeight.readOnly = true;
    setInputWeight.appendChild(inputWeight);

    let setInputReps = document.createElement('div');
    setInputReps.classList.add('setInput');
    set.appendChild(setInputReps);

    let labelReps = document.createElement('label');
    labelReps.innerHTML = "Reps:";
    setInputReps.appendChild(labelReps);

    let inputReps = document.createElement('input');
    inputReps.setAttribute('type', 'text');
    inputReps.setAttribute('placeholder', '00');
    inputReps.addEventListener('click', createKeypad);
    inputReps.readOnly = true;
    setInputReps.appendChild(inputReps);

    let setConfirm = document.createElement('div');
    setConfirm.classList.add('setConfirm');
    setConfirm.classList.add('colour1');
    set.appendChild(setConfirm);

    setConfirm.addEventListener('click', setConfirmClick);

    let setConfirmH2 = document.createElement('h2');
    setConfirmH2.innerHTML = "✔";
    setConfirm.appendChild(setConfirmH2);


}

function createKeypad(evt)
{
    let body = document.body;
    let currentInput = evt.currentTarget;

    hideKeypad();

    let keypad = document.createElement('div');
    keypad.id = 'keypad';
    keypad.classList.add('colour1');
    body.appendChild(keypad);

    let keypadTable = document.createElement('div');
    keypadTable.id = 'keypadTable';
    keypad.appendChild(keypadTable);

    let count = 1;

    for (let i = 0; i < 4; i++)
    {
        let keypadRow = document.createElement('div');
        keypadRow.classList.add('keypadRow');
        keypadTable.appendChild(keypadRow);
        for (let j = 0; j < 3; j++)
        {
            let keypadButton = document.createElement('div');
            keypadButton.classList.add('keypadButton');
            keypadButton.target = currentInput;
            keypadButton.addEventListener('click', keypadButtonClick);
            keypadRow.appendChild(keypadButton);

            let h2 = document.createElement('h2');

            if (j == 0 && count == 0)
            {
                h2.innerHTML = '.';
                keypadButton.classList.add('colour2');
            }
            else if (j == 2 && count == 0)
            {
                h2.innerHTML = '<';
                keypadButton.classList.add('colour2');
                keypadButton.removeEventListener('click', keypadButtonClick);
                keypadButton.addEventListener('click', keypadButtonBackSpace);
            }
            else
            {
                h2.innerHTML = count;
                keypadButton.classList.add('colour1');
            }

            keypadButton.appendChild(h2);
            
            switch (count)
            {
                case 9:
                    count = 0;
                    break;
                case 0:
                    break;
                default:
                    count++;
            }
        }
    }

    let keypadBigButton = document.createElement('div');
    keypadBigButton.classList.add('keypadBigButton');
    keypadBigButton.classList.add('colour2');
    keypadBigButton.addEventListener('click', hideKeypad);
    keypad.appendChild(keypadBigButton);

    let h2 = document.createElement('h2');
    h2.innerHTML = 'Done';
    keypadBigButton.appendChild(h2);
}

function keypadButtonClick(evt)
{
    let number = evt.currentTarget.children[0].innerHTML;
    let target = evt.currentTarget.target;
    console.log(target);
    console.log(number);
    target.value = target.value + number;

}

function keypadButtonBackSpace(evt)
{
    let target = evt.currentTarget.target;
    target.value = target.value.split(0, target.value.length - 1)
}

function hideKeypad()
{
    let keypad = document.getElementById('keypad');

    if (keypad != null)
        {
            keypad.remove();
        }
}

function removeSetClick(evt)
{
    let exerciseOptions = evt.currentTarget.parentElement;
    
    let exercise = getCurrentExercise(exerciseOptions);

    removeSet(exercise, evt.currentTarget);
}

function getCurrentExercise(exerciseOptions)
{
    let exerciseOptionsList = document.getElementsByClassName('exerciseOptions');
    let exerciseList = document.getElementsByClassName('exercise');
    var exercise;

    for (let i = 0; i < exerciseOptionsList.length; i++)
    {
        if (exerciseOptionsList[i] == exerciseOptions)
        {
            exercise = exerciseList[i];
        }
    }

    return exercise;
}

function removeSet(exercise, removeSetButton)
{
    let numberOfSets = exercise.children.length;
    let lastSet = exercise.children[numberOfSets - 1];

    lastSet.remove();
    numberOfSets--;

    if (numberOfSets == 0)
    {
        removeSetButton.remove();
    }
}

function showPrompt(message, option)
{
    let prompt = document.createElement('div');
    prompt.id = "prompt";
    prompt.classList.add('colour1');
    document.body.appendChild(prompt);

    let text = document.createElement('p');
    text.innerHTML = message;
    prompt.appendChild(text);

    let promptOptionTable = document.createElement('div');
    promptOptionTable.id = 'promptOptionTable';
    prompt.appendChild(promptOptionTable);

    for (i = 0; i < option.length; i++)
    {
        let promptOption = document.createElement('div');
        promptOption.classList.add('promptOption');
        promptOptionTable.appendChild(promptOption);

        let h2 = document.createElement('h2');
        h2.innerHTML = option[i];
        promptOption.appendChild(h2);
    }
}

function showLeavePrompt()
{
    showPrompt("If you exit the workout now, it won't be saved, are you sure?", ["Stay", "Exit"]);

    let option = document.getElementsByClassName('promptOption');

    option[0].addEventListener('click', hidePrompt);

    option[1].addEventListener('click', returnToHome);
    option[1].classList.add('colour3');
}

function hidePrompt()
{
    let prompt = document.getElementById('prompt');

    if (prompt != null)
    {
        prompt.remove();
    }
}

function returnToHome()
{
    window.location.assign('index.html');
}

async function startWorkout(evt)
{
    let button = evt.currentTarget;
    doAnimation(button, 'BigPushDown');
    await new Promise(r => setTimeout(r, 305));
    doAnimation(button, 'BigPushUp');
    await new Promise(r => setTimeout(r, 700));
    window.location.assign('workout.html');
    addWorkoutEventListeners();
}

function endWorkoutClick()
{
    showPrompt('Are you sure you want to end the workout?', ['No', 'yes']);

    let option = document.getElementsByClassName('promptOption');

    option[0].addEventListener('click', hidePrompt);
    option[0].classList.add('colour3');

    option[1].addEventListener('click', hidePrompt);
    option[1].addEventListener('click', saveWorkout);
    option[1].addEventListener('click', showEndWorkoutPopUp);
}

function saveWorkout()
{   
    let workoutName = document.getElementById('workoutName').children[0].value;
    let gymName = document.getElementById('gymSelector').children[0].innerHTML;
    let gym = getGymIndexFromName(gymName);
    let date = new Date().toISOString().slice(0, 10);
    let noOfPR = 0;

    let exerciseList = Array.from(document.getElementsByClassName("exercise"));
    const exercises = [];

    exerciseList.forEach(element => {
        let id = element.exerciseID;
        let sets = getSetData(Array.from(element.children), id);
        const exercise = {id:id, sets:sets};
        exercises.push(exercise);
        sets.forEach(set => {
            noOfPR = noOfPR + set.prs;
        })

    })

    const workout = {id:workoutList.length, name:workoutName, gym:gym, date:date, exercises:exercises, prs:noOfPR}
    console.log(workout);

    workoutList.push(workout);

    saveLocalStorageList('workoutList', workoutList);
}

function getGymIndexFromName(name)
{
    for (let i = 0; i < gymList.length; i++)
    {
        if (gymList[i].name == name)
        {
            return i;
        }
    }
}

function getSetData(setArr, id)
{
    const setList = []

    setArr.forEach(s => {
        let thisType = s.children[0];
        let thisWeight = s.children[1].children[1];
        let thisReps = s.children[2].children[1];
        let thisConfirm = s.children[3];

        if (thisConfirm.style.backgroundColor = "rgb(65, 143, 67)")
        {
            let type = 0;
            let weight = 0;
            let reps = 0;
            let noOfPR = 0;

            for (let i = 0; i < setType.length; i++)
            {
                if (thisType.classList.contains(setType[i]))
                {
                    type = i;
                    break;
                }
            }
            weight = thisWeight.value;
            reps = thisReps.value;

            noOfPR = updatePR(id-1, weight + "x" + reps);

            const set = {type:type, weight:weight, reps:reps, prs:noOfPR};

            setList.push(set);
        }
    })

    return setList;
}

function showEndWorkoutPopUp()
{

}

function setCurrentGym(location)
{
    let gym = checkGyms(location);

        if (gym != -1)
        {
            gymSelector.children[0].innerHTML = gym.name;
            currentGym = gym.id;
        }
}

function checkGyms(location)
{
    if (gymList.length == 0)
    {
        return -1;
    }

    console.log(gymList);
    for (let i =0; i < gymList.length; i++)
    {
        if(checkLocationBelongs(location, gymList[i].bounds))
        {
            return gymList[i];
        }
        else if (i == gymList.length - 1)
        {
            return -1;
        }
    }

}

function createNewGym(name, location, index)
{
    let upperLat = location.coords.latitude + distance;
    let lowerLat = location.coords.latitude - distance;
    
    let upperLong = location.coords.longitude + distance;
    let lowerLong = location.coords.longitude - distance;

    const bounds = [upperLat, lowerLat, upperLong, lowerLong];

    const newGym = {id:index, name:name, bounds:bounds};

    gymList.push(newGym);

    console.log(newGym);

    saveLocalStorageList('gymList', gymList);

}

function checkLocationBelongs(location, bounds)
{
    let currentLat = location.coords.latitude;
    let currentLong = location.coords.longitude;

    let upperLat = bounds[0];
    let lowerLat = bounds[1];
    let upperLong = bounds[2];
    let lowerLong = bounds[3];

    if ((currentLat <= upperLat && currentLat >= lowerLat) && (currentLong <= upperLong && currentLong >= lowerLong))
    {
        return true;
    }
    else
    {
        return false;
    }
}

function gymSelectorClick(evt)
{
    if (document.getElementById('gymMenu') == null)
    {
        let gymMenu = document.createElement('div');
        gymMenu.id = "gymMenu";
        document.body.appendChild(gymMenu);

        evt.currentTarget.classList.add("colour1")
        evt.currentTarget.style.boxShadow = "8px 8px var(--colour2), inset 4px 4px var(--colour6)"

        let offsets = evt.currentTarget.getBoundingClientRect();
        let top = offsets.top + 30;
        gymMenu.style.top = top + "px";
        gymMenu.style.left = offsets.left + "px";

        gymList.forEach(element => {
            let gymOption = document.createElement('div');
            gymOption.classList.add('gymOption');
            gymMenu.appendChild(gymOption);

            if (element.id == currentGym)
            {
                gymOption.classList.add('currentGym');
            }

            let h1 = document.createElement('h1');
            h1.innerHTML = element.name;
            gymOption.appendChild(h1);

            gymOption.addEventListener('click', gymOptionClick);
        })

        let gymOption = document.createElement('div');
        gymOption.classList.add('gymOption');
        gymMenu.appendChild(gymOption);
        let h1 = document.createElement('h1');
        h1.innerHTML = "+ Add New Gym";
        gymOption.appendChild(h1);

        gymOption.addEventListener('click', addNewGymClick)
    }
    else
    {
        removeGymMenu()
    }
}

function getLocalStorageList(item, list)
{
    localList = localStorage.getItem(item);

    if (localList != null)
    {
        localList = JSON.parse(localList);

        localList.forEach(element => {
            list.push(element);
        })
    }
}

function saveLocalStorageList(item, list)
{
    localStorage.setItem(item, JSON.stringify(list));
}

function gymOptionClick(evt)
{
    let gymOptions = Array.from(document.getElementsByClassName('gymOption'));

    removeGymMenu();

    for (i = 0; i < gymOptions.length; i++)
    {
        if (gymOptions[i] == evt.currentTarget)
        {
            console.log("i: " + i)
            currentGym = i;
            break;
        }
    }

    gymSelector.children[0].innerHTML = evt.currentTarget.children[0].innerHTML;

}

function addNewGymClick(evt)
{
    removeGymMenu();

    createAddNewGymPrompt();

}

function removeGymMenu()
{
    let gymMenu = document.getElementById('gymMenu');
    gymMenu.remove();

    gymSelector.children[0].classList.remove("colour1");
    gymSelector.children[0].style.boxShadow = "";
}

function createAddNewGymPrompt()
{
    let prompt = document.createElement('div');
    prompt.id = 'prompt';
    prompt.classList.add('colour1');
    document.body.appendChild(prompt);

    let gymNameInput = document.createElement('div');
    gymNameInput.id = "gymNameInput";
    prompt.appendChild(gymNameInput);

    let textArea = document.createElement('textarea');
    textArea.rows = "1";
    textArea.innerHTML = "Gym " + (gymList.length + 1);
    gymNameInput.appendChild(textArea);

    let promptOptionTable = document.createElement('div');
    promptOptionTable.id = 'promptOptionTable';
    prompt.appendChild(promptOptionTable);

    let option = [];

    for (i = 0; i < 2; i++)
    {
        option[i] = document.createElement('div');
        option[i].classList.add('promptOption');
        promptOptionTable.appendChild(option[i]);

        let h2 = document.createElement('h2');
        option[i].appendChild(h2);
    }

    option[0].children[0].innerHTML = "Cancel";
    option[0].classList.add('colour3');
    option[0].addEventListener('click', hidePrompt);

    option[1].children[0].innerHTML = "Save";
    option[1].addEventListener('click', saveNewGymClick)

}

function saveNewGymClick()
{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(saveNewGym);
    }
}

function saveNewGym(location)
{
    let name = document.getElementById('gymNameInput').children[0].value;

    createNewGym(name, location, gymList.length + 1)

    hidePrompt();
}

async function initialisePrList()
{
    console.log("heyo")
    let exerciseList = await getJSON();
    exerciseList = exerciseList.exercises;
    exerciseList.forEach(element => {
        let exercisePrList = [];
        let pr = {gym:"", weight:0, volume:"0x0"};
        exercisePrList.push(pr);
        let exercisePrObj = {id:element.id, prs:exercisePrList}
        prList.push(exercisePrObj);
    })


}

function updatePR(index, pr)
{
    let currentPrArr = prList[index].prs;

    var currentPr = -1;

    prArrIndex = 0;

    if (currentGym == -1)
    {
        currentPr = currentPrArr[0]
        prArrIndex = 0;
    }
    else
    {
        for (let i = 0; i < currentPrArr.length; i++)
        {
            if (currentPrArr[i].gym == currentGym)
            {
                prArrIndex = i;
            }
        }
    }

    if (currentPr = -1)
    {
        let newPr = {gym:currentGym, weight:0, volume:"0x0"}
        prList[index].prs.push(newPr);
        currentPr = newPr;
        prArrIndex = prList[index].prs.length - 1;
    }

    let currentWeightPr = currentPr.weight;
    let currentVolumePr = currentPr.volume;
    let currentVolumeWeight = currentVolumePr.split('x')[0];
    let currentVolumeReps = currentVolumePr.split('x')[1];
    let isPr = 0;

    let newWeight = pr.split('x')[0];
    let newReps = pr.split('x')[1];

    if (newWeight > currentWeightPr)
    {
        console.log(prArrIndex);
        console.log(prList[index].prs);
        console.log(prList[index].prs[prArrIndex]);
        (prList[index].prs[prArrIndex]).weight = newWeight;
        isPr++;
    }
    
    if (newWeight > currentVolumeWeight && newReps >= currentVolumeReps)
    {
        prList[index].prs[prArrIndex].volume = pr;
        isPr++;
    }
    else if (newWeight == currentVolumeWeight && newReps > currentVolumeReps)
    {
        prList[index].prs[prArrIndex].volume = pr;
        isPr++;
    }

    console.log(prList);
    saveLocalStorageList('prList', prList);

    return isPr;
}

async function showWorkoutDetails(evt)
{
    let workoutBox = evt.currentTarget;

    let index = workoutList.length - evt.currentTarget.id - 1;
    let data = await getJSON();
    const exerciseList = data.exercises;

    let workoutDetails = document.createElement('div');
    workoutDetails.classList.add('workoutDetails');
    workoutBox.appendChild(workoutDetails);

    let height = 60;
    
    workoutList[index].exercises.forEach(exercise => {
        height = height + 73;
        exercise.sets.forEach(set => {
            height = height + 27;
        });
    });

    workoutBox.style.maxHeight = height + 'px';
    workoutBox.style.height = height + 'px';
    console.log('height: ' + height);

    await new Promise(r => setTimeout(r, height * 1.1));

    workoutList[index].exercises.forEach(exercise => {
        let exerciseDetails = document.createElement('div');
        exerciseDetails.classList.add('exerciseDetails');
        workoutDetails.appendChild(exerciseDetails);
        let exerciseName = exerciseList[(exercise.id - 1)].name;
        let h2 = document.createElement('h2');
        h2.innerHTML = exerciseName;
        exerciseDetails.appendChild(h2);
        exercise.sets.forEach(set => {
            let h3 = document.createElement('h3');
            h3.innerHTML = setType[set.type] + ': ' + set.weight + metric + ' x ' + set.reps;
            exerciseDetails.appendChild(h3);
        });
    });

    workoutBox.removeEventListener('click', showWorkoutDetails);
    workoutBox.addEventListener('click', hideWorkoutDetails);
}

function hideWorkoutDetails(evt)
{
    let workoutBox = evt.currentTarget;
    let workoutDetails = workoutBox.children[2];
    workoutDetails.remove();

    workoutBox.style.maxHeight = '60px';
    workoutBox.style.height = '60px';

    workoutBox.removeEventListener('click', hideWorkoutDetails);
    workoutBox.addEventListener('click',showWorkoutDetails);
}

function doAnimation(element, animation)
{
    element.classList.add('animation' + animation);
    element.onanimationend = () => {
        element.classList.remove('animation' + animation);
    }

}