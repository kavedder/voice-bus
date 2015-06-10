<?php
$userid = $_POST["userId"];
$delopt = $_POST["delopt"];

$finame = 'user_profiles.json';

$intext = file_get_contents($finame);
$injson = json_decode($intext, true);

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
echo "<vxml version = \"2.1\" application=\"root.xml\">\n";
echo "  <meta name=\"maintainer\" content=\"kvedder@uw.edu\"/>\n";
echo "  <form id=\"foo\">\n";

if (array_key_exists($delopt, $injson[$userid])) {
    echo "    <field name=\"foo\">\n";
    echo "    <grammar src=\"yes_or_no.grxml\" type=\"application/grammar-xml\" maxage=\"0\" />\n";
    echo "    <grammar src=\"yes_or_no_dtmf.grxml\" type=\"application/grammar-xml\" maxage=\"0\" />\n";
    $stopno = $injson[$userid][$delopt][0];
    $busno = $injson[$userid][$delopt][1];
    $bustype = $injson[$userid][$delopt][2];
    $stoploc = $injson[$userid][$delopt][3];
    if ($bustype == "all") {
        echo "<prompt bargein=\"true\"> Option " . $delopt . " is for all buses at " . htmlspecialchars($stoploc) . ". </prompt>";
    }
    else {
        echo "<prompt bargein=\"true\"> Option " . $delopt . " is for the " . $busno . " at " . htmlspecialchars($stoploc) . ". </prompt>";
    }
    echo "<prompt> Would you like to delete this option? </prompt>\n";
    echo "<prompt> <break strength=\"strong\" /> </prompt>\n";
    echo "<prompt> <break strength=\"strong\" /> </prompt>\n";
    echo "<filled>\n";
    echo "<if cond=\"foo$.interpretation.response=='yes'\">\n";
    echo "<submit next=\"delete_option.php\" namelist=\"userId delopt\" method=\"post\" />\n";
    echo "<else />\n";
    echo "<prompt> Okay. </prompt>\n";
    echo "</if>\n";
    $delopt += 1;
    echo "<assign name=\"application.delopt\" expr=\"" . $delopt . "\" />\n";

    if ((int) $delopt > 9) {
        echo "<prompt> There are no available options to edit </prompt>\n";
        // echo "<submit next=\"gen_user_options.php\" namelist=\"userId \" method=\"post\" />\n";
        echo "<goto next=\"main.xml#Start\" />\n";
    }
    else {
        echo "<submit next=\"edit_user_profile.php\" namelist=\"userId delopt\" method=\"post\" />\n";
    }

    echo "</filled>\n";
    echo "  </field>\n";
}

else {
    echo "<block>\n";
    $delopt += 1;
    echo "<assign name=\"application.delopt\" expr=\"" . $delopt . "\" />\n";

    if ((int) $delopt > 9) {
        echo "<prompt> There are no available options to edit. <break strength=\"medium\" /> </prompt>\n";
        // echo "<submit next=\"gen_user_options.php\" namelist=\"userId \" method=\"post\" />\n";
        echo "<goto next=\"main.xml#Start\" />\n";

            }
    else {
        echo "<submit next=\"edit_user_profile.php\" namelist=\"userId delopt\" method=\"post\" />\n";
    }

    echo "</block>\n";
}


?>

</form>
</vxml>
