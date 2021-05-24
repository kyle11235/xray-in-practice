SHELL_DIR=$(dirname "$BASH_SOURCE")
APP_DIR=$(cd $SHELL_DIR; pwd)

cd $APP_DIR

npm run build:dev