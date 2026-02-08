<?php
// Set response header to JSON
header('Content-Type: application/json');

// prevent CORS issues if testing from different origin during dev, though on same server it's fine
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$response = [
    'success' => false,
    'message' => 'An unknown error occurred.'
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize input data
    $name = strip_tags(trim($_POST["name"] ?? ''));
    $email = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($_POST["phone"] ?? ''));
    $org = strip_tags(trim($_POST["organization"] ?? ''));
    $protocol = strip_tags(trim($_POST["protocol"] ?? ''));
    $message = strip_tags(trim($_POST["message"] ?? ''));

    // Basic Validation
    if (empty($name) || empty($email) || empty($message)) {
        $response['message'] = 'Please fill in all required fields (Identity, Comms, Data).';
        echo json_encode($response);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Invalid email address format.';
        echo json_encode($response);
        exit;
    }

    // Email Configuration
    // REPLACE THIS WITH YOUR ACTUAL EMAIL ADDRESS
    $recipient = "brianmmweri@gmail.com";

    $subject = "Encrypted Uplink: New Contact from $name";

    // Email Content
    $email_content = "Details of incoming transmission:\n\n";
    $email_content .= "Identity: $name\n";
    $email_content .= "Comms (Email): $email\n";
    $email_content .= "Voice (Phone): $phone\n";
    $email_content .= "Organization: $org\n";
    $email_content .= "Protocol: $protocol\n\n";
    $email_content .= "Transmission Data:\n$message\n";

    // Email Headers
    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send Email
    if (mail($recipient, $subject, $email_content, $headers)) {
        $response['success'] = true;
        $response['message'] = 'Transmission successful. Uplink established. We will respond shortly.';
    } else {
        $response['message'] = 'Transmission failed. Server error. Please try again later.';
    }

} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>