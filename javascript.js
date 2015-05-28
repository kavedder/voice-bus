function divideHundreds(number) {
    // turn a number like '550' into '5 50'
    // so it sounds more natural
    if (number.length == 3) {
        var dividedNumber = number.charAt(0);
        dividedNumber += ' ';
        for(var i = 1; i < number.length; i++)
        {
            dividedNumber += number.charAt(i);
        }
        return dividedNumber;
    }
    return number;
}
