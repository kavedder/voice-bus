<?php
$userid = $_POST["userId"];

$finame = 'user_profiles.json';

$intext = file_get_contents($finame);
$injson = json_decode($intext, true);

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
echo "<vxml version = \"2.1\" application=\"root.xml\">\n";
echo "  <meta name=\"maintainer\" content=\"kvedder@uw.edu\"/>\n";
echo "  <form id=\"foo\">\n";
echo "    <block>\n";
foreach ($injson[$userid] as $dig => $opt) {
    $stopno = $opt[0];
    $busno = $opt[1];
    $bustype = $opt[2];
    $stoploc = $opt[3];
    if ($bustype == "all") {
        echo "<prompt bargein=\"true\"> Say. " . $dig . ". for all buses at " . htmlspecialchars($stoploc) . ". </prompt>";
    }
    else {
        echo "<prompt bargein=\"true\"> Say. " . $dig . ". for the " . $busno . " at " . htmlspecialchars($stoploc) . ". </prompt>";
    }
}
?>
  <prompt> <break strength="medium" /> </prompt>
  <submit next="gen_user_options.php" namelist="userId" method="post" />
  </block>
  </form>
</vxml>
