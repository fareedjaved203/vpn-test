@echo off
echo Generating SSH key for GitHub Actions...

ssh-keygen -t rsa -b 4096 -C "github-actions" -f github-actions-key -N ""

echo.
echo SSH key generated!
echo.
echo 1. Copy the PUBLIC key to your VPS:
echo.
type github-actions-key.pub
echo.
echo 2. Copy the PRIVATE key for GitHub secret:
echo.
type github-actions-key
echo.
echo 3. Add public key to VPS authorized_keys:
echo ssh root@YOUR_VPS_IP "echo 'PASTE_PUBLIC_KEY_HERE' >> ~/.ssh/authorized_keys"
echo.
pause