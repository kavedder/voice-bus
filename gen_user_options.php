<?php
$userid = $_POST["userId"];

$finame = 'user_profiles.json';

$intext = file_get_contents($finame);
$injson = json_decode($intext, true);

$new_user = false;
if (array_key_exists("new", $injson[$userid])) {
    $new_user = true;
    unset($injson[$userid]["new"]);
}


echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
echo "<vxml version = \"2.1\" application=\"root.xml\">\n";
echo "  <meta name=\"maintainer\" content=\"kvedder@uw.edu\"/>\n";
echo "  <form id=\"foo\">\n";
echo "    <field name=\"foo\">\n";

// Other options grammar
echo "<grammar src=\"other_options.grxml\" type=\"application/grammar-xml\" maxage=\"0\" />\n";


// DTMF grammar
echo "<grammar xml:lang=\"en-US\" root = \"TOPLEVEL\" mode=\"dtmf\" xmlns=\"http://www.w3.org/2001/06/grammar\">\n";
echo "  <rule id=\"TOPLEVEL\" scope = \"public\">\n";
echo "    <item>\n";
echo "      <one-of>\n";
foreach ($injson[$userid] as $dig => $opt) {
    $stopno = $opt[0];
    $busno = $opt[1];
    $bustype = $opt[2];
    echo "            <item> " . $dig . " <tag> out.stop_no=\"" . $stopno . "\"; out.bus_no=\"" . $busno . "\"; out.bus_type=\"" . $bustype . "\"; </tag> </item>\n";
}
echo "      </one-of>\n";
echo "    </item>\n";
echo "    <item repeat=\"0-1\"> # </item>";
echo "    <tag> out.action=\"continue\"; </tag>";
echo "  </rule>\n";
echo "</grammar>\n";

// voice grammar

// digits => spoken form
$cvt_dig = array("0" => "zero",
                 "1" => "one",
                 "2" => "two",
                 "3" => "three",
                 "4" => "four",
                 "5" => "five",
                 "6" => "six",
                 "7" => "seven",
                 "8" => "eight",
                 "9" => "nine" );

echo "<grammar xml:lang=\"en-US\" root = \"TOPLEVEL\" mode=\"voice\" xmlns=\"http://www.w3.org/2001/06/grammar\">\n";
echo "  <rule id=\"TOPLEVEL\" scope = \"public\">\n";
echo "    <item>\n";
echo "      <one-of>\n";
foreach ($injson[$userid] as $dig => $opt) {
    $stopno = $opt[0];
    $busno = $opt[1];
    $bustype = $opt[2];
    $say_dig = $cvt_dig[$dig];
    echo "            <item> " . $say_dig . " <tag> out.stop_no=\"" . $stopno . "\"; out.bus_no=\"" . $busno . "\"; out.bus_type=\"" . $bustype . "\"; </tag> </item>\n";
}
echo "      </one-of>\n";
echo "    </item>\n";
echo "    <tag> out.action=\"continue\"; </tag>";
echo "  </rule>\n";
echo "</grammar>\n";

?>
<prompt bargein="true">
    Say or key in the quick access number for the information you would like!
    </prompt>

    <noinput>
    Say "favorites" to hear your saved searches, or "edit" to edit your search history, or say "new search" to add a new number.
    <reprompt/>
    </noinput>

    <nomatch>
    I didn't quite catch that. Say "favorites" to hear your saved searches, or "edit" to edit your search history, or say "new search" to add a new number.

        <reprompt/>
      </nomatch>

      <filled namelist="foo$.interpretation">
        <assign name="action" expr="foo$.interpretation.action" />
        <assign name="application.delopt" expr="1" />

        <if cond="action=='menu'">
          <goto next="main.xml#MainMenu" />
        <elseif cond="action=='options'" />
         <submit next="read_user_options.php" namelist="userId" method="post" />
        <elseif cond="action=='profile'" />
         <submit next="edit_user_profile.php" namelist="userId delopt" method="post" />
        <else />
        <script src="javascript.js" fetchhint="prefetch" fetchtimeout="10s" maxage="0"/>
        <assign name="application.writtenBusNo" expr="foo$.interpretation.bus_no" />
        <assign name="application.writtenStopNo" expr="foo$.interpretation.stop_no" />
        <assign name="application.busType" expr="foo$.interpretation.bus_type" />
        <assign name="application.arrivalUrl" expr="getArrivalUrl(application.writtenStopNo)" />
        <goto next="main.xml#SayBus" />

        </if>
      </filled>
    </field>
  </form>
</vxml>
