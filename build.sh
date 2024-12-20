node ./update-version.js
npm run build
cd dist
STR=$(sed -rn 's/.*const(.{23}).*/\1/p' ../src/environments/app-version.js)
echo "RESULT $STR"
cp ../src/environments/.gitlab-ci.yml .gitlab-ci.yml
git add . && git commit -m "build No $STR" && git push
