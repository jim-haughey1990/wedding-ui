<?php

$cdate = strtotime("05.05.2018 13.00.00");
$today = time();
$difference = $cdate - $today;

if ($difference < 0) { $difference = 0; }

echo '{"days":'. floor($difference/60/60/24) . '}'

?>
