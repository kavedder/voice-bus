<?php
$userid = $_POST["userId"];
$delopt = $_POST["delopt"];

$finame = 'user_profiles.json';

$intext = file_get_contents($finame);
$injson = json_decode($intext, true);

unset($injson[$userid][$delopt]);

// if the user has no more options, delete the user
if (count($injson[$userid]) == 0) {
    unset($injson[$userid]);
}

$outfile = fopen($finame, "w");
fwrite($outfile, json_encode($injson));
fclose($outfile);

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";

echo "<vxml version = \"2.1\" application=\"root.xml\">\n";
echo "  <meta name=\"maintainer\" content=\"kvedder@uw.edu\"/>\n";
echo "    <form>\n";
echo "    <block>\n";
echo "<prompt> Deleting option " . $delopt . ". </prompt>\n";

$delopt += 1;
echo "<assign name=\"application.delopt\" expr=\"" . $delopt . "\" />\n";

if (!array_key_exists($userid, $injson)) {
    echo "<prompt> You have no more pre recorded options. </prompt>\n";
    echo "<goto next=\"main.xml#MainMenu\" />\n";
        }
elseif ((int) $delopt > 9) {
    echo "<prompt> You have no more pre recorded options. </prompt>\n";
    echo "<submit next=\"gen_user_options.php\" namelist=\"userId \" method=\"post\" />\n";
}
else {
    echo "<submit next=\"edit_user_profile.php\" namelist=\"userId delopt\" method=\"post\" />\n";
}

?>
</block>
</form>
</vxml>
