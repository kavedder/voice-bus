function getStatus(doc) {
    response = doc.getElementsByTagName("text").item(0).firstChild.data;
    if ( response == "OK" ) {
        return "true";
    }
    return "false";
}
