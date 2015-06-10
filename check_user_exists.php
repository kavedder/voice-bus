<?php
$userid = $_POST["userId"];
$finame = 'user_profiles.json';

if (file_exists($finame)) {
    $intext = file_get_contents($finame);
    $injson = json_decode($intext, true);
}
else {
    $injson = array();
}

$goto = 'MainMenu';
if (array_key_exists($userid, $injson)) {
    $goto = 'WelcomeBack';
}

$goto_string = "<goto next=\"main.xml#" . $goto . "\" />";

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
?>

<vxml version="2.1" application="root.xml">
    <form id="thing">
    <block>
    <?=$goto_string?>
    </block>
    </form>
    </vxml>
