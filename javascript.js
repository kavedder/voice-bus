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


function convertNumber(num_str) {
    // convert eg. "two hundred" => 200
    substrings = num_str.split(" ");
    var converted="";
    var numConvert = {
        "zero": "0",
        "oh": "0",
        "one": "1",
        "two": "2",
        "three": "3",
        "four": "4",
        "five": "5",
        "six": "6",
        "seven": "7",
        "eight": "8",
        "nine": "9",
        "ten": "10",
        "eleven": "11",
        "twelve": "12",
        "thirteen": "13",
        "fourteen": "14",
        "fifteen": "15",
        "sixteen": "16",
        "seventeen": "17",
        "eighteen": "18",
        "nineteen": "19",
        "twenty": "2",
        "thirty": "3",
        "forty": "4",
        "fifty": "5",
        "sixty": "6",
        "seventy": "7",
        "eighty": "8",
        "ninety": "9",
        "hundred": "", // special!
        " ": ""
    }
    var last_substring;
    var has_hundred=false;
    for (var i=0; i<substrings.length; i++) {
        substring = substrings[i];
        converted_substring = numConvert[substring];
        converted += converted_substring;
        last_substring=substring;
        if (substring == "hundred") {
            has_hundred = true;
        }
    }
    if (last_substring.slice(-2) == "ty") {
        // ended in eg. forty; add a zero
        converted += "0";
    }
    if (last_substring == "hundred") {
        // eg. five hundred
        converted += "00";
    }
    else if (has_hundred && converted.length == 2) {
        // didn't end with hundred, but had it in the middle
        // and the string is too short
        converted = converted[0] + "0" + converted[1];
    }
    // just in case of spacey errors
    converted = converted.replace("undefined", "");
    return converted;
}


function getStopUrl(stopno) {
    // http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/<id>.xml?key=<key>
    var url_base = "http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_";
    var api_key = "ae9a6989-9371-433b-9914-d8c2f8575b5d";
    var url = url_base + stopno + ".xml?key=" + api_key;
    return url;
}


function getStopLoc(doc) {
    var wordConvert = {
        "Ln": "Lane",
        "St": "Street",
        "St.": "Street",
        "Blvd": "Boulevard"
    }
    // well, this is fragile...
    var stop = doc.getElementsByTagName("entry").item(0).getElementsByTagName("name").item(0).firstChild.data;
    var stop_words = stop.split(" ");
    var converted = "";
    for (var i=0; i<stop_words.length; i++) {
        word = stop_words[i]
        convertedWord = wordConvert[word] || word;
        converted += " " + convertedWord;
    }
    return converted
}
