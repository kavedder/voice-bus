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
