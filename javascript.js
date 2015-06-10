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
};

var wordConvert = {
    "Ln": "Lane",
    "St": "Street",
    "Blvd": "Boulevard",
    "Ave": "Avenue",
    "Wy": "Way",
    "Pkwy": "Parkway",
    "Rd": "Road",
    "NE": "northeast",
    "NW": "northwest",
    "SE": "southeast",
    "SW": "southwest",
    "N": "north",
    "W": "west",
    "S": "south",
    "E": "east",
    "Mt": "Mount",
    "Ln.": "Lane",
    "St.": "Street",
    "Blvd.": "Boulevard",
    "Ave.": "Avenue",
    "Wy.": "Way",
    "Pkwy.": "Parkway",
    "Rd.": "Road",
    "NE.": "northeast",
    "NW.": "northwest",
    "SE.": "southeast",
    "SW.": "southwest",
    "N.": "north",
    "W.": "west",
    "S.": "south",
    "E.": "east",
    "Mt.": "Mount"
};



var lineLetters = [
    "A", "B", "C", "D", "E", "F"
];

function convertNumFromStr(str, bus_type) {
    // "two hundred" => 200
    // "the rapid ride A" => A Line
    // "any bus" => null

    var substrings = str.split(" ");
    var substring;

    if (bus_type == "all") {
        return null;
    }
    else if (bus_type == "letter") {
        // we could have done this in the grammar
        // but we had to come here to convert numbers,
        // anyway, and this way we don't have to have
        // so many crazy return values
        var lineLetter;
        for (var i=0; i<substrings.length; i++) {
            substring = substrings[i];
            var isLineLetter = (lineLetters.indexOf(substring) > -1);
            if (isLineLetter) {
                lineLetter = substring;
            }
        }
        return lineLetter + " Line";
    }
    else {
        var converted=[];
        var last_substring;
        var has_hundred=false;
        for (var i=0; i<substrings.length; i++) {
            substring = substrings[i];
            var converted_substring = numConvert[substring];
            converted.push(converted_substring);
            last_substring=substring;
            if (substring == "hundred") {
                has_hundred = true;
            }
        }
        if (last_substring.slice(-2) == "ty") {
            // ended in eg. forty; add a zero
            converted.push("0");
        }
        if (last_substring == "hundred") {
            // eg. five hundred
            converted.push("00");
        }
        else if (has_hundred && converted.length == 2) {
            // didn't end with hundred, but had it in the middle
            // and the string is too short
            converted = [converted[0], "0", converted[1]];
        }
        // just in case of spacey errors
        converted = converted.join("");
        converted = converted.replace("undefined", "");
        return converted;
    }
}

function convertNumFromDTMF(num) {
    var substrings = num.split(" ");
    var substring;
    var converted = "";
    for (var i=0; i<substrings.length; i++) {
        substring = substrings[i];
        if (substring == "*") {
            return null;
        }
        if (substring != "#") {
            converted += substring;
        }
    }
    return converted;
}

function getStatus(doc) {
    var response = doc.getElementsByTagName("text").item(0).firstChild.data;
    if ( response == "OK" ) {
        return "true"; }
    return "false";
}


function getStopLoc(doc) {
    // well, this is fragile...
    var stop = doc.getElementsByTagName("entry").item(0);
    var stop_name = stop.getElementsByTagName("name").item(0).firstChild.data;
    var stop_words = stop_name.split(" ");
    var converted = "";
    for (var i=0; i<stop_words.length; i++) {
        word = stop_words[i];
        convertedWord = wordConvert[word] || word;
        converted += " " + convertedWord;
    }
    var direction = stop.getElementsByTagName("direction").item(0).firstChild.data;
    direction = wordConvert[direction.trim()];

    return converted + " " + direction + "bound ";
}

function getArrivalUrl(stopno) {
    var api_key = "ae9a6989-9371-433b-9914-d8c2f8575b5d";
    var url_base = "http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_";
    var url = url_base + stopno + ".xml?key=" + api_key;
    return url;
}

function getRoutes(doc, bus_id, bus_type) {
    var routes = doc.getElementsByTagName("arrivalAndDeparture");
    var timeArray = [];
    var routeArray = [];
    var longName;
    var destination;
    var shortName;
    var arrTime;
    for (i=0; i<routes.length; i++) {
        var element = routes.item(i);
        shortName = element.getElementsByTagName("routeShortName").item(0).firstChild.data;
        if (shortName == bus_id || bus_type == "all") {
            // gather the name info
            try {
                longName = element.getElementsByTagName("routeLongName").item(0).firstChild.data;
            }
            catch(err) {
                // it's a number!
                longName = makeLong(shortName);
            }
            try {
                destination = " to " + cvtDest(element.getElementsByTagName("tripHeadsign").item(0).firstChild.data);
            }
            catch(err) {
                destination = " ";
            }
            //predictedArrivalTime
            try {
                arrTime = element.getElementsByTagName("predictedArrivalTime").item(0).firstChild.data;
            }
            catch(err) {
                return "I'm sorry. There was an unexpected error communicating with the one bus away servers.";
            }
            var time = getTimeDiff(arrTime);
            if (time) {
                timeArray.push(time);
                routeArray.push(longName);
            }
        }
    }
    // syntaxing
    var return_str = "";
    if (bus_type == "all") {
        // syntax for all buses
        if (timeArray.length === 0) {
            return "I'm sorry. I can't find any upcoming arrivals at this stop.";
        }
        return_str = "The next arrival at this stop is the " + routeArray[0] + " in about " + timeArray[0] + ", ";
        if (timeArray.length > 1) {
            return_str += "followed by ";
            for (var i=1; i<timeArray.length; i++) {
                return_str += " the " + routeArray[i] + " in about " + timeArray[i] + ", ";
            }
        }
    }
    else {
        // syntax for a single bus
        if (timeArray.length === 0) {
            return "I'm sorry. I can't find any upcoming arrivals for the " + makeLong(bus_id) + " at this stop.";
        }
        return_str = "The next arrival of the " + longName + destination + " is  in about " + timeArray[0] + ". ";
        if (timeArray.length > 1) {
            if (timeArray.length > 2) {
                return_str += "After that, the next arrivals are ";
                for (var i=1; i<timeArray.length-1; i++) {
                    return_str += " in about " + timeArray[i] + ", ";
                }
                return_str += " and in about " + timeArray[timeArray.length-1];
            }
            else {
                return_str += "After that, the next arrival is in about " + timeArray[timeArray.length-1];
            }
        }
    }
    return_str += ". ";
    return return_str;
}


function cvtDest(dest) {
    var words = dest.split(" ");
    var converted = "";
    for (var i=0; i<words.length; i++) {
        word = words[i];
        convertedWord = wordConvert[word] || word;
        converted += " " + convertedWord;
    }
    return converted;
}

function makeLong(busno) {
    try {
        var chars = busno.toString().trim().split('');
    }
    catch(e) {
        return busno;
    }
    var express = "";
    // figure out if it is an express
    if (chars[chars.length-1] == "E") {
        express = " express";
        chars.pop();
    }
    var longno;
    if (chars.length == 4) {
        longno = chars[0]+chars[1]+" "+chars[2]+chars[3];
    }
    else if (chars.length == 3) {
        longno = chars[0]+" "+chars[1]+chars[2];
    }
    else {
        longno=chars[0]+chars[1];
    }
    var minus_2 = longno.length - 2;
    var minus_1 = minus_2 + 1;
    if (longno.slice(minus_2,minus_1) == '0') {
        longno = longno.slice(0,minus_2) + "oh " + longno.slice(minus_1);
    }
    return longno + express;
}

function getTimeDiff(timestr) {
    var now = new Date().getTime();
    var diff = timestr-now;
    if (diff < 0) {
        // you've missed the bus!
        return null;
    }
    var diff_secs = diff / 1000;
    if (diff_secs < 60) {
        return parseInt(diff_secs) + " seconds";
    }
    var diff_mins = diff_secs/60;
    var diff_remain = diff_secs % 60;
    if (diff_remain <= 20) {
        // round down to minutes
        return parseInt(diff_mins) + " minutes";
    }
    else if (20 < diff_remain < 40) {
        return parseInt(diff_mins) + "and a half minutes";
    }
    return parseInt(diff_mins) + 1 + " minutes";
}

function getStopUrl(stopno) {
    var api_key = "ae9a6989-9371-433b-9914-d8c2f8575b5d";
    var url_base = "http://api.pugetsound.onebusaway.org/api/where/stop/1_";
    var url = url_base + stopno + ".xml?key=" + api_key;
    return url;
}

function getArrivalUrl(stopno) {
    var api_key = "ae9a6989-9371-433b-9914-d8c2f8575b5d";
    var url_base = "http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_";
    var url = url_base + stopno + ".xml?key=" + api_key;
    return url;
}
