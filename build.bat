echo on 
call npm --prefix ./chat-app/ run build 
xcopy .\chat-app\dist\* .\chatappBackend /Y /s /e
cls
echo Webapp is running
ts-node ./chatappBackend/index