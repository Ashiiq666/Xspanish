<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Accept both JSON bodies and standard form-encoded posts.
$data = $_POST;
if (empty($data)) {
    $decoded = json_decode(file_get_contents('php://input'), true);
    if (is_array($decoded)) {
        $data = $decoded;
    }
}

$email  = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$source = preg_replace('/[^a-z0-9_-]/i', '', $data['source'] ?? 'newsletter');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

$to      = 'fashion@xspanish.in';
$subject = 'New newsletter subscription';
$message = "Email: $email\nSource: $source\nTime: " . date('c') . "\n";
$headers = 'From: no-reply@xspanish.in' . "\r\n" .
           'Reply-To: ' . $email . "\r\n" .
           'Content-Type: text/plain; charset=UTF-8';

if (mail($to, $subject, $message, $headers)) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Subscription successful']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email']);
}
