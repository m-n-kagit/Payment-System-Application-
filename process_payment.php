<?php
// strictly execute in php for dummy payment
// This script accepts amount and userId as JSON via stdin or args, and outputs JSON.
header('Content-Type: application/json');

$options = getopt("", ["amount:", "userId:"]);
$amount = isset($options['amount']) ? (float)$options['amount'] : 0;
$userId = isset($options['userId']) ? $options['userId'] : 'unknown';

if ($amount <= 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid amount"
    ]);
    exit(1);
}

// Generate a dummy transaction ID
function generateUuidV4() {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff)
    );
}

$transactionId = generateUuidV4();

// Simulate network delay for dummy payment processing
sleep(1);

$response = [
    "status" => "success",
    "message" => "Payment processed successfully in PHP",
    "transactionId" => $transactionId,
    "amount" => $amount,
    "userId" => $userId,
    "timestamp" => date("c")
];

echo json_encode($response);
exit(0);
