#!/usr/bin/env python3
import os
import sqlite3
import hashlib
import subprocess
import logging
import base64

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CWE-798: Use of Hard-coded Credentials
DATABASE_USERNAME = "admin"
DATABASE_PASSWORD = "secr3t_p@ssw0rd!"
API_KEY = "1a2b3c4d5e6f7g8h9i0j"

# Function with SQL Injection vulnerability (CWE-89)
def get_user_by_id(user_id):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    
    # Vulnerable to SQL injection
    query = f"SELECT * FROM users WHERE id = {user_id}"
    logger.info(f"Executing query: {query}")
    
    cursor.execute(query)
    result = cursor.fetchone()
    conn.close()
    return result

# Function with command injection vulnerability (CWE-78)
def ping_host(host):
    # Vulnerable to command injection
    cmd = f"ping -c 4 {host}"
    logger.info(f"Running command: {cmd}")
    
    result = subprocess.check_output(cmd, shell=True)
    return result.decode('utf-8')

# Function with weak hashing (CWE-327)
def hash_password(password):
    # Using insecure MD5 hashing
    hashed = hashlib.md5(password.encode()).hexdigest()
    logger.info(f"Password hashed: {password[:2]}***")
    return hashed

# Function with path traversal vulnerability (CWE-22)
def read_user_file(filename):
    # Vulnerable to path traversal
    file_path = f"user_files/{filename}"
    logger.info(f"Reading file: {file_path}")
    
    with open(file_path, 'r') as file:
        return file.read()

# Function with hardcoded secret and insecure cryptography
def encrypt_data(data):
    # Hardcoded encryption key (CWE-798)
    secret_key = "ThisIsAHardcodedEncryptionKey123!"
    
    # Weak encryption - just base64 (CWE-327)
    encrypted = base64.b64encode(f"{data}{secret_key}".encode()).decode()
    return encrypted

# CWE-532: Information Exposure Through Log Files
def process_payment(user_id, credit_card, amount):
    # Logging sensitive information
    logger.info(f"Processing payment of ${amount} for user {user_id} with card {credit_card}")
    
    # Process payment logic here
    return {"status": "success", "transaction_id": "tx_123456"}

# Example usage
if __name__ == "__main__":
    # These function calls contain various vulnerabilities
    user = get_user_by_id("1 OR 1=1")
    ping_result = ping_host("example.com; cat /etc/passwd")
    secure_password = hash_password("user_password")
    user_data = read_user_file("../../../etc/passwd")
    encrypted = encrypt_data("sensitive_data")
    payment = process_payment("user123", "4111-1111-1111-1111", 100.50) 