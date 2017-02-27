<?php
header("Access-Control-Allow-Origin: *");
if (!isset($_GET["url"])) { echo "[]"; die(); }
$u = $_GET["url"];

$permitted = [
    "https://www.kryogenix.org/days/",
    "https://kryogenix.org/days/",
    "http://www.kryogenix.org/days/",
    "http://kryogenix.org/days/"
];

$isok = FALSE;
foreach($permitted as $check) {
    $len = strlen($check);
    if (substr($u, 0, $len) === $check) {
        $isok = TRUE;
    }
}


if ($isok) {
    // no worries.
} else {
    echo "[]"; die();
}

echo file_get_contents("https://webmention.herokuapp.com/api/mentions?url=" . $u);
?>