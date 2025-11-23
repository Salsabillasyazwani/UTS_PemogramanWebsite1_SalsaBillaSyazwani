<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../koneksi/connection.php';

$action = $_POST['action'] ?? '';

if ($action == 'register') {
    $name     = $_POST['name'] ?? '';
    $username = $_POST['username'] ?? '';
    $email    = $_POST['email'] ?? '';
    $passInput= $_POST['password'] ?? '';

    if(empty($name) || empty($username) || empty($email) || empty($passInput)){
        echo json_encode(['success' => false, 'message' => 'Data tidak boleh kosong']);
        exit();
    }

    $password = password_hash($passInput, PASSWORD_DEFAULT);

    try {
       
        $check = $conn->prepare("SELECT * FROM user WHERE username = :username");
        $check->bindParam(':username', $username);
        $check->execute();

        if ($check->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Username sudah digunakan']);
            exit();
        }

        // Insert Data
        $stmt = $conn->prepare("INSERT INTO user (name, username, email, password) VALUES (:name, :username, :email, :password)");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Registrasi berhasil']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal menyimpan data']);
        }

    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
    }
}

else if ($action == 'login') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    try {
        $stmt = $conn->prepare("SELECT * FROM user WHERE username = :username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        
        // Cek apakah user ketemu
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Verifikasi Password 
            if (password_verify($password, $user['password'])) {
                // Hapus password dari data yang dikirim balik agar aman
                unset($user['password']); 
                
                echo json_encode([
                    'success' => true, 
                    'message' => 'Login Berhasil',
                    'data'    => $user
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Password salah']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Username tidak ditemukan']);
        }

    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
    }
}


else if ($action == 'update') {
    $id       = $_POST['id'] ?? '';
    $name     = $_POST['name'] ?? '';
    $username = $_POST['username'] ?? '';
    $email    = $_POST['email'] ?? '';

    if(empty($id)){
        echo json_encode(['success' => false, 'message' => 'ID User tidak ditemukan']);
        exit();
    }

    try {
        // Cek username 
        $check = $conn->prepare("SELECT * FROM user WHERE username = :username AND id != :id");
        $check->bindParam(':username', $username);
        $check->bindParam(':id', $id);
        $check->execute();

        if ($check->rowCount() > 0) {
            echo json_encode(['success' => false, 'message' => 'Username sudah digunakan orang lain']);
            exit();
        }

        // Update Data
        $stmt = $conn->prepare("UPDATE user SET name=:name, username=:username, email=:email WHERE id=:id");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            // Ambil data terbaru untuk update localStorage di JS
            $getData = $conn->prepare("SELECT id, name, username, email FROM user WHERE id = :id");
            $getData->bindParam(':id', $id);
            $getData->execute();
            $newData = $getData->fetch(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true, 
                'message' => 'Update profil berhasil',
                'data'    => $newData
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal update database']);
        }

    } catch(PDOException $e) {
        echo json_encode(['success'=>false,'message'=>'DB Error: ' . $e->getMessage()]);
    }
}

else {
    echo json_encode(['success' => false, 'message' => 'Action tidak valid atau kosong']);
}
?>