<?php

# set up the URL
$stopno = $_POST["writtenStopNo"];
$url = "http://stopinfo.pugetsound.onebusaway.org/busstops/1_" . $stopno;

# curl the webpage
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$html = curl_exec($ch);
curl_close($ch);

# load the DOM
$dom = new DOMDocument();
# suppress warnings with @
@$dom->loadHTML($html);

# some empty arrays to hold what we grab
$keys = array();

# iterate over the <td> tags
# dear goodness :-(
$elements = $dom->getElementsByTagName('td');
$prev_is_key = False;
foreach ($elements as $elem) {
  $s = $elem->nodeValue;
  $s_trimmed = trim($s);
  if (substr($s_trimmed, -1) == ":") {
    $keys[] = $s_trimmed;
    $prev_is_key = True;
    }
  elseif ($prev_is_key) {
    $keys[] = $s_trimmed . ". ";
    $prev_is_key = False;
  }
  else {
    $prev_is_key = False;
  }
}

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
?>

<vxml version="2.1" application="root.xml">
  <form id="thing">
    <block>
      <prompt>
        <?php
        foreach ($keys as $key) {
                echo htmlspecialchars($key);
                }
        ?> .
      </prompt>
      <goto next="main.xml#BusNo" />
    </block>
  </form>
</vxml>
