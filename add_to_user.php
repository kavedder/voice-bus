<?php
$stopno = $_POST["writtenStopNo"];
$busno = $_POST["writtenBusNo"];
$bustype = $_POST["busType"];
$userid = $_POST["userId"];

$currarr = array($stopno, $busno, $bustype);

$finame = 'user_files.json';

$intext = file_get_contents($finame);
$injson = json_decode($intext, true);


$already_exists = False;
if (array_key_exists($userid, $injson)) {
    foreach($injson[$userid] as $dig => $arr) {
        if ($arr === $currarr) {
            $already_exists = True;
        }
    }
    if (!$already_exists) {
        // we have this user,
        // just not this combo
        foreach (range(1,9) as $number) {
            if (!array_key_exists($number, $injson[$userid])) {
                $injson[$userid][$number] = $currarr;
                break;
            }
        }
    }
}
else {
    // entirely new user!
    $injson[$userid] = array( 1 => $currarr);
}


$outfile = fopen($finame, "w");
fwrite($outfile, json_encode($injson));
fclose($outfile);



echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
?>

<vxml version="2.1" application="root.xml">
    <form id="thing">
    <block>
    <goto next="main.xml#SayBus" />
    </block>
    </form>
    </vxml>
