// Firestore Security Rules for Chat Feature
// Add these rules to your Firestore Rules tab in Firebase Console

rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
// Chat messages - allow read/write for participants
match /chats/{orderId}/messages/{messageId} {
allow read, write: if request.auth != null;
}

    // Orders - allow read for authenticated users
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

}
}

// Note: These are basic rules. In production, you should add more specific
// rules to ensure users can only access chats for orders they're involved in.
