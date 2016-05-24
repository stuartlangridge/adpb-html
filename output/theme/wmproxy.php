<?php
header("Access-Control-Allow-Origin: *");
if (!isset($_GET["url"])) { echo "[]"; die(); }
$u = $_GET["url"];
$needle1 = "http://www.kryogenix.org/days/";
$needle2 = "https://www.kryogenix.org/days/";
$length1 = strlen($needle1);
$length2 = strlen($needle2);

if (substr($u, 0, $length1) === $needle1) {
    // ok; requesting http URL
} else if (substr($u, 0, $length2) === $needle2) {
    // requesting https; change to http because that's what webmentions remembers
    $u = str_replace("https://www.kryogenix.org", "http://www.kryogenix.org", $u);
} else {
    echo "[]"; die();
}

echo file_get_contents("https://webmention.herokuapp.com/api/mentions?url=" . $u);
?>