<?php
require_once '../koneksi/connection.php';

$id = isset($_POST['id']) ? $_POST['id'] : '';

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'ID tidak valid']);
    exit();
}

try {
    $stmt = $conn->prepare("DELETE FROM user WHERE id = :id");
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Akun berhasil dihapus']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal menghapus akun']);
    }
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>