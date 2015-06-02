function getStatus(doc) {
    var response = doc.getElementsByTagName("text").item(0).firstChild.data;
    if ( response == "OK" ) {
        return "true"; }
    return "false";
}


function getStopLoc(doc) {
    var wordConvert = {
        "Ln": "Lane",
        "St": "Street",
        "St.": "Street",
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
        "Rd": "Road"
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
