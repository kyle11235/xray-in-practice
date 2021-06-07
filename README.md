# xray in practice

        please check the xray_in_practice.pptx to understand the roles/process/feature that will be shown.
        accordingly 5 steps below.

1. demo xray blocking download feature

        - clone demo project
       
                git clone https://github.com/kyle11235/maven-example
                open it by idea

        - create artifactory repo (already ready in the demo env)
       
                xray-project-release-virtual =
                        xray-project-whitelist-local
                        xray-org-mavencentral-remote

        - create xray policy/watch (already ready in the demo env)
        
                block download from xray-org-mavencentral-remote when score > 9

        - configure idea's maven setting
        
                artifactory -> set me up -> create a xray_settings.xml
                idea -> preferences -> maven -> xray_settings.xml
        
        - test

                check & update below scripts
                - clear content in xray-project-maven-whitelist-local
                ./01_clear_whitelist.sh

                - remove maven's local cache & try to mvn install
                ./02_install_by_xray_settings.sh

                you should see log like
                Access denied to: http://xxx:8081/artifactory/xray-project-maven-release-virtual/com/alibaba/fastjson/1.2.24/fastjson-1.2.24.jar

2. demo xray plugin whitelist request feature (custom feature)

        - create artifactory repo of generic local type (already ready in the demo env)

                xray-project-generic-local

        - install the customized xray plugin

                download the zip file here, it has a customized whitelist button to submit request to http://182.92.214.141:8082/artifactory/xray-project-generic-local/

                wget http://182.92.214.141:8082/artifactory/xray-project-generic-local/jfrog-idea-plugin/JFrog-1.8.x-SNAPSHOT.zip

                idea -> references -> plugin -> install from disk ->  the downloaded zip file

        - if you want to continue to develop the xray plugin

                git clone https://github.com/kyle11235/jfrog-idea-plugin (original repo = https://github.com/jfrog/jfrog-idea-plugin)

                open it by idea
                gradle -> idea -> tasks -> build
                idea -> references -> plugin -> install from disk -> /Users/kyle/workspace/jfrog-idea-plugin/build/JFrog-1.8.x-SNAPSHOT.zip
                idea -> jfrog -> global config -> your artifactory username/password

        - start ngrok (only required when you test it on your desktop)

                cd /opt/ngrok
                ./8000.sh

        - start webhook server (already ready in the demo env)

                cd ./admin

                vi ./setup.sh
                ./setup.sh
                vi ./routes/api.js

                npm install
                ./run.sh (will run on 8000)

        - set art's webhook outgoing to ngrok or where the admin server is deployed  (already ready in the demo env)

                artifactory webhook -> artifact deploy event -> xray-project-generic-local -> ngrok/admin's url

        - test

                idea -> jfrog -> Local
                click to select some of the components
                click request whitelist button
                you should see the text of the button changes to whitelist request(Success)
                
3. demo Record/Notify

        check http://182.92.214.141:8082/ui/repos/tree/General/xray-project-generic-local%2Fwhitelist_request
        whitelist requests are recorded here as files, issue components as meta data/properties 

        check the configured admin's email (if email is configured in the demo env)

4. demo approve whitelist by admin ui (artifactory API)

        - start admin ui (already ready in the demo env)

                cd ./admin_ui
                npm install
                ./run.sh

        - test

                visit http://182.92.214.141/#/dashboard

                click approve button (check admin/routes/api.js for details, it triggers download & copy component into the whitelist repo)

                check xray-project-whitelist-local

                now you can try to build your maven project again, it should work to resolve the component from the whitelisted repo

                ./02_install_by_xray_settings.sh

- demo wechat & cli integration 

        (this is for fun/show artifactory's integration capabilities, useful for admin/developer to check whitelist request status at any place, just open the wechat app, bot/backend side should verify the user)

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

                
                






