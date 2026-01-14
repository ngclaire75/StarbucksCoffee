<?php
// backend.php

// Example: receive POST data from JavaScript
$name = $_POST['name'] ?? null;

// Return a response
echo "Hello " . $name . ", your request reached PHP!";
?>
