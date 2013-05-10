// Has useful functions 

// Returns random color between iMin and iMax.
function getRandomColor(iMin, iMax)
{
    // Creating a random number between iMin and iMax, converting to hex
    var hexR = (getRandomNumber(iMin, iMax)).toString(16);
    var hexG = (getRandomNumber(iMin, iMax)).toString(16);
    var hexB = (getRandomNumber(iMin, iMax)).toString(16);

    // Making sure single character values are prepended with a "0"
    if (hexR.length == 1)
        hexR = "0" + hexR;

    if (hexG.length == 1)
        hexG = "0" + hexG;

    if (hexB.length == 1)
        hexB = "0" + hexB;

    // Creating the hex value by concatenatening the string values
    return ("#" + hexR + hexG + hexB).toUpperCase();
}

// Returns random number between iMin and iMax, include iMin and iMax
function getRandomNumber(iMin, iMax)
{
    if (iMax < iMin)
    {
        var temp = iMax;
        iMax = iMin;
        iMin = temp;
    }

    return Math.floor((Math.random() * ((iMax + 1) - iMin)) + iMin);
}

// Checks if the browser can play MP3 files
function canPlayMp3()
{
    var a = document.createElement('audio');
    return (a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}
