<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';

use Core\Authenticator;
use app\Http\Forms\LoginForm;
use Firebase\JWT\JWT;

// Set response header to JSON
header("Content-Type: application/json");

// Secret key for JWT signing
$secretKey = 'amalgam';

$inputData = file_get_contents("php://input");
$data = json_decode($inputData, true);

$form = LoginForm::validate($attributes = [
    'username' => $data['username'],
    'password' => $data['password']
]);

$authenticator = new Authenticator();
$signedIn = $authenticator->attempt($attributes['username'], $attributes['password']);

if (!$signedIn) {
    http_response_code(401);
    echo json_encode(['success' => false, 'errors' => 'Invalid username or password.']);
    exit;
}

// Check if the user is an admin (userType 0) before generating a JWT
$token = null;
if ($_SESSION['user']['userType'] === 0) {
    $payload = [
        'username' => $_SESSION['user']['username'],
        'userType' => $_SESSION['user']['userType'],
        'exp' => time() + 3600  // Token expires in 1 hour
    ];

    $token = JWT::encode($payload, $secretKey, 'HS256');
    $_SESSION['user']['token'] = $token;

    error_log("Admin Token Generated: " . $token);
}

// Send the user data (including token for admins) in the response
echo json_encode([
    'success' => true,
    'username' => $_SESSION['user']['username'],
    'userType' => $_SESSION['user']['userType'],
    'token' => $token  // This will be null for non-admin users
]);