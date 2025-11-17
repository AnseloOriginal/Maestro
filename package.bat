echo on
echo Clearing old files
rmdir dist
echo Creating Creating Directories
mkdir dist
cd dist
mkdir executable
mkdir temp
cd ..
echo Copying node_modules
copy node_modules dist\temp
echo Done
pause