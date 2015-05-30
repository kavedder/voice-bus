function getStatus(doc) {
    var response = doc.getElementsByTagName("text").item(0).firstChild.data;
    return response;
}
