<?php
require_once '../koneksi/connection.php';

$id = isset($_GET['id']) ? $_GET['id'] : '';

try {
    if (!empty($id)) {
        
        $stmt = $conn->prepare("SELECT id, name, username, email FROM user WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'data' => $user]);
        } else {
            echo json_encode(['success' => false, 'message' => 'User tidak ditemukan']);
        }
    } else {
       
        $stmt = $conn->prepare("SELECT id, name, username, email FROM user");
        $stmt->execute();
        
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $users]);
    }
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>