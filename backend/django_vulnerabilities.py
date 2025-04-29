from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
import json
import xml.etree.ElementTree as ET
import requests
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
import base64
import os

# CWE-798: Hardcoded credentials
DATABASE_URL = "postgres://admin:unsecure_password@localhost:5432/app_db"
THIRD_PARTY_API_KEY = "12345abcde67890fghij"

# CWE-89: SQL Injection
def user_search(request):
    query = request.GET.get('q', '')
    with connection.cursor() as cursor:
        # Vulnerable to SQL injection
        cursor.execute(f"SELECT * FROM auth_user WHERE username LIKE '%{query}%'")
        users = cursor.fetchall()
    return JsonResponse({"users": users})

# CWE-611: XML External Entity Reference
@csrf_exempt
def parse_xml(request):
    if request.method == 'POST':
        xml_data = request.body.decode('utf-8')
        # Vulnerable to XXE
        tree = ET.fromstring(xml_data)
        data = {elem.tag: elem.text for elem in tree}
        return JsonResponse(data)

# CWE-79: Cross-site Scripting
def user_profile(request, username):
    # User input directly rendered in template
    return render(request, 'profile.html', {'username': username})

# CWE-352: Cross-Site Request Forgery (missing CSRF protection)
@csrf_exempt
def update_email(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        email = request.POST.get('email')
        # Update email in database without CSRF protection
        return JsonResponse({"status": "updated"})

# CWE-601: URL Redirection to Untrusted Site
def redirect_to(request):
    url = request.GET.get('url', '')
    # Vulnerable to open redirect
    return redirect(url)

# CWE-327: Use of Broken or Risky Cryptographic Algorithm
def encrypt_user_data(data):
    # Insecure encryption
    key = b'0123456789abcdef'  # Hardcoded key
    iv = b'0123456789abcdef'   # Hardcoded IV
    
    cipher = Cipher(algorithms.AES(key), modes.ECB())  # ECB mode is insecure
    encryptor = cipher.encryptor()
    
    # Padding the data manually (insecure)
    data_bytes = data.encode()
    if len(data_bytes) % 16 != 0:
        padding = 16 - (len(data_bytes) % 16)
        data_bytes += b' ' * padding
    
    ct = encryptor.update(data_bytes) + encryptor.finalize()
    return base64.b64encode(ct).decode('utf-8')

# CWE-22: Path Traversal
def serve_file(request):
    filename = request.GET.get('file', '')
    # Vulnerable to path traversal
    file_path = os.path.join('files', filename)
    with open(file_path, 'rb') as f:
        return HttpResponse(f.read())

# CWE-918: Server-Side Request Forgery
def proxy_request(request):
    url = request.GET.get('url', '')
    # Vulnerable to SSRF
    response = requests.get(url)
    return HttpResponse(response.content)

# CWE-312: Cleartext Storage of Sensitive Information
def register_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')  # Storing plaintext password
        
        # Storing sensitive data in plaintext
        with open('users.txt', 'a') as f:
            f.write(f"{username}:{password}\n")
        
        return JsonResponse({"status": "registered"}) 