@echo off
setlocal
cd /d "%~dp0"
title Deploy - Gerador de Propostas e Contratos (LDT)
echo.
echo ============================================
echo   Enviar para o GitHub (Cloudflare publica)
echo ============================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo [ERRO] O Git nao esta instalado.
  echo Baixe em https://git-scm.com/download/win , instale e abra este arquivo de novo.
  echo.
  pause
  exit /b 1
)

if not exist ".git" (
  echo Primeira vez: preparando o repositorio...
  git init
  git branch -M main
)

git remote get-url origin >nul 2>nul
if errorlevel 1 git remote add origin https://github.com/Lucas12es/gerador-proposta-e-contratos.git

for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set D=%%a-%%b-%%c
set MSG=Atualizacao %D% %time:~0,5%
set /p MSG=Mensagem do commit (Enter para "%MSG%"): 

git add .
git commit -m "%MSG%"
echo.
echo Enviando...
git push -u origin main
if errorlevel 1 (
  echo.
  echo [ATENCAO] O envio foi recusado.
  echo Se o repositorio ja tem arquivos criados pelo site do GitHub, rode UMA vez:
  echo    git pull origin main --allow-unrelated-histories
  echo e abra este arquivo de novo. Se pedir login, entre com sua conta do GitHub.
  echo.
  pause
  exit /b 1
)

echo.
echo Pronto! Enviado ao GitHub. O Cloudflare Pages publica sozinho em 1 a 2 minutos.
echo.
pause
