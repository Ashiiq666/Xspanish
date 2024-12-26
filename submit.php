<?php
header('Content-Type: application/json');

// Check if POST data is received
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $subscribe = $data['subscribe'] === 'Yes' ? 'Yes' : 'No';

    // Validate email
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Save or process data (e.g., send email or save to database)
        $to = 'your-email@example.com'; // Replace with your email
        $subject = 'New Newsletter Subscription';
        $message = "Email: $email\nSubscribe: $subscribe";

        if (mail($to, $subject, $message)) {
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Subscription successful']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to send email']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
