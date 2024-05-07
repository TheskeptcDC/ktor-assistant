<?php

// Enable CORS
header("Access-Control-Allow-Origin: *");

// Database configuration
$host = 'localhost';
$dbname = 'VirtualAssistant';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if both required POST data are present
    if (isset($_POST['textFileName'], $_POST['text'])) {
        $filename = $_POST['textFileName'];
        $content = $_POST['text'];

        // Insert text file information into the database
        $sql = "INSERT INTO notes (filename, content) VALUES (:filename, :content)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':filename' => $filename,
            ':content' => $content
        ]);

        echo "File uploaded and data saved successfully.";
    } else {
        echo "Error: Missing required data.";
    }
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}
?>
