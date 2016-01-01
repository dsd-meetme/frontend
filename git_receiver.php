<?php
system("./git.sh -i .git_utility/key.key git pull origin master");
system("npm install");
system("gulp production");
?>
