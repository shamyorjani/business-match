<?php
/**
 * Emergency debug endpoint
 * This file provides direct database access for debugging purposes.
 * Remove this file in production environments!
 */

// Allow cross-origin requests for debugging
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Basic security check - should be improved in a real environment
$allowed_ips = ['127.0.0.1', '::1'];
if (!in_array($_SERVER['REMOTE_ADDR'], $allowed_ips)) {
    echo json_encode(['error' => 'Access denied', 'ip' => $_SERVER['REMOTE_ADDR']]);
    exit;
}

// Get database credentials from .env file
$env_file = __DIR__ . '/../.env';
$db_config = [];

if (file_exists($env_file)) {
    $lines = file($env_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $db_config[trim($key)] = trim($value);
        }
    }
}

// Get the action from query string
$action = $_GET['action'] ?? 'ping';

// Check if this is just a ping test
if ($action === 'ping') {
    echo json_encode([
        'success' => true,
        'message' => 'Debug endpoint is active',
        'time' => date('Y-m-d H:i:s'),
        'php_version' => PHP_VERSION
    ]);
    exit;
}

// For other actions, we need database access
try {
    $db = new PDO(
        "mysql:host={$db_config['DB_HOST']};dbname={$db_config['DB_DATABASE']};charset=utf8mb4",
        $db_config['DB_USERNAME'],
        $db_config['DB_PASSWORD'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Handle different actions
    switch ($action) {
        case 'check':
            $id = $_GET['id'] ?? 0;
            $stmt = $db->prepare("SELECT * FROM schedule_meetings WHERE id = ?");
            $stmt->execute([$id]);
            $meeting = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($meeting) {
                echo json_encode([
                    'success' => true,
                    'meeting' => $meeting
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Meeting not found',
                    'id' => $id
                ]);
            }
            break;

        case 'approve':
            $id = $_GET['id'] ?? 0;
            $stmt = $db->prepare("UPDATE schedule_meetings SET status = 4 WHERE id = ?");
            $result = $stmt->execute([$id]);
            $rowCount = $stmt->rowCount();

            echo json_encode([
                'success' => $result && $rowCount > 0,
                'message' => $result ? 'Meeting approved successfully' : 'No changes made',
                'rowsAffected' => $rowCount,
                'id' => $id
            ]);
            break;

        default:
            echo json_encode([
                'success' => false,
                'message' => 'Unknown action specified',
                'action' => $action
            ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
