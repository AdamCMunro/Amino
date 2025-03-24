let metricOptions = document.getElementsByClassName('metricOption');
var metric = localStorage.getItem('metric');
const theme1 = ['#ffecc3', '#cc5600', '#c2000d', '#f5cb32', '#418f43', '#ffffff8a'];
const theme2 = ['#000000', '#cfcfcf', '#ffffff', '#f5cb32', '#418f43', '#000000'];
const theme3 = ['#ffffff', '#323232', '#000000', '#f5cb32', '#418f43', '#ffffff8a'];
const colourTheme = [theme1, theme2, theme3];
var selectedTheme = 0;

if (localStorage.getItem('selectedTheme') != null)
{
    selectedTheme = localStorage.getItem('selectedTheme');
    changeColourTheme(colourTheme[selectedTheme]);
}

let themeElementArr = document.getElementsByClassName('theme');

if (themeElementArr.length != 0)
{
    setThemeColours();
    themeElementArr[selectedTheme].classList.add('selectedTheme');
}

if (metricOptions.length != 0)
{
    console.log('hey everyone')
    metricOptions = Array.from(metricOptions);
    let index = 0;
    metricOptions.forEach(element => {

        if (element.innerHTML == metric)
        {
            element.index = index;
            element.classList.add('selectedMetric');
        }
        else
        {
            element.index = index;
            element.addEventListener('click', metricOptionClick);
        }
        index++;
    });
}

function metricOptionClick(evt)
{
    console.log('click');
    evt.currentTarget.classList.add('selectedMetric');
    doAnimation(evt.currentTarget, 'ClickDown');
    if (evt.currentTarget.index == 0)
    {
        metricOptions[1].classList.remove('selectedMetric');
        metricOptions[1].addEventListener('click', metricOptionClick);
        doAnimation(metricOptions[1], 'ClickUp');
    }
    else
    {
        metricOptions[0].classList.remove('selectedMetric');
        metricOptions[0].addEventListener('click', metricOptionClick);
        doAnimation(metricOptions[0], 'ClickUp');
    }
    evt.currentTarget.removeEventListener('click', metricOptionClick);
    localStorage.setItem('metric', evt.currentTarget.innerHTML);
}

function doAnimation(element, animation)
{
    element.classList.add('animation' + animation);
    element.onanimationend = () => {
        element.classList.remove('animation' + animation);
    }

}

function setThemeColours()
{
    themeElementArr = Array.from(themeElementArr);
    console.log(themeElementArr);
    for (let i = 0; i < themeElementArr.length; i++)
    {
        let theme = colourTheme[i];
        let children = Array.from(themeElementArr[i].children);
        console.log(children);
        for (let j = 0; j < children.length; j++)
        {
            children[j].style.backgroundColor = theme[j];
        }
        themeElementArr[i].index = i;
        if (i != selectedTheme)
        {
            themeElementArr[i].addEventListener('click', themeElementClick);
        }
    }
}

function themeElementClick(evt)
{
    evt.currentTarget.classList.add('selectedTheme');
    themeElementArr[selectedTheme].classList.remove('selectedTheme');
    themeElementArr[selectedTheme].addEventListener('click', themeElementClick);

    selectedTheme = evt.currentTarget.index;

    changeColourTheme(colourTheme[selectedTheme]);
    localStorage.setItem('selectedTheme', selectedTheme);
}

function changeColourTheme(theme)
{
    var r = document.querySelector(':root');
    console.log('ah!');
    for (let i = 0; i < theme.length; i++)
    {
        r.style.setProperty('--colour' + (i+1), theme[i]);
    }
    let exitImage = document.getElementById('settingsExit').children[0];
    exitImage.src = 'exit_button' + selectedTheme + '.svg';
}
