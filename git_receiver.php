<?php
system("git reset --hard");
system("./git.sh -i .git_utility/key.key git pull origin master");
system("npm install");
system("node_modules/.bin/gulp production");
?>
