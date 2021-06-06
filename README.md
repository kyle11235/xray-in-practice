# xray in practice

- demo xray blocking download feature

        - clone demo project
       
                git clone https://github.com/kyle11235/maven-example
                open it by idea

        - create artifactory repo
       
                xray-project-release-virtual =
                        xray-project-whitelist-local
                        xray-org-mavencentral-remote

        - create xray policy/watch
        
                block download from xray-org-mavencentral-remote when score > 9

        - configure idea's maven setting
        
                artifactory -> set me up -> create a xray_settings.xml
                idea -> preferences -> maven -> xray_settings.xml
        
        - test

                check & update install_by_xray_settings.sh
                ./01_clear_whitelist.sh
                ./02_install_by_xray_settings.sh

                you should see log like
                Access denied to: http://xxx:8081/artifactory/xray-project-maven-release-virtual/com/alibaba/fastjson/1.2.24/fastjson-1.2.24.jar

- demo xray plugin whitelist request feature (custom feature)

        - create artifactory repo of generic local type

                xray-project-generic-local

        - install custom xray plugin

                git clone https://github.com/kyle11235/jfrog-idea-plugin
                open it by idea
                gradle -> idea -> tasks -> build
                idea -> references -> plugin -> install from disk -> /Users/kyle/workspace/jfrog-idea-plugin/build/JFrog-1.8.x-SNAPSHOT.zip
                idea -> jfrog -> global config -> artifactory username/password

        - start ngrok

                cd /opt/ngrok
                ./8000.sh

        - start webhook server

                cd ./admin

                vi ./setup.sh
                ./setup.sh
                vi ./routes/api.js

                npm install
                ./run.sh (will run on 8000)

        - set art's webhook outgoing to ngrok

                artifactory webhook -> artifact deploy event -> xray-project-generic-local -> ngrok's url

        - test

                idea -> jfrog -> Local
                click to select some of the components
                click request whitelist button
                check files created in xray-project-generic-local/whitelist_request & their properties
                check the configured admin's email

- demo approve whitelist by admin ui (artifactory API)

        - start admin ui

                cd ./admin_ui
                npm install
                ./run.sh

        - test

                click approve button
                check xray-project-whitelist-local
                ./02_install_by_xray_settings.sh

- demo wechat & cli integration

        - install
                
                git clone https://github.com/kyle11235/simplebot
                ./setup.sh (get info from wechat platform)
                ./deploy.sh

        - test

                - ping
                jfrog rt ping

                - search
                jfrog rt s xray-project-generic-local/whitelist_request/

                - search those without property/value
                jfrog rt s xray-project-generic-local/whitelist_request/ --exclude-props status=approved

                - search by property
                jfrog rt s xray-project-generic-local/whitelist_request/ --props status=approved

                
                






