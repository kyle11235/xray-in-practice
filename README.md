# xray in practice

        - if you just want to show the demo
        check the video - https://v.qq.com/x/page/t3251bywgea.html

        - if you want to understand the roles/process/feature of this demo
        check the xray_in_practice.pptx

        - if you want to restore the demo
        check the 6 steps below

1. develop & be blocked to resolve issue component in IDE

        - value/feature

                demo xray blocking download feature

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

                check & update below scripts
                - clear content in xray-project-maven-whitelist-local
                ./01_clear_whitelist.sh

                - remove maven's local cache & try to mvn install
                ./02_install_by_xray_settings.sh

                you should see log like
                Access denied to: http://xxx:8081/artifactory/xray-project-maven-release-virtual/com/alibaba/fastjson/1.2.24/fastjson-1.2.24.jar

2. submit whitelist request

        - value/feature

                demo xray idea plugin (open source project) & the customized feature to submit whitelist request
                for the situation urgent/legacy project cannot find an available fixed version for an issue component
                whitelist the issue component allow project to proceed to release while limit some time for finding a solution to fix the issue

        - create artifactory repo of generic local type 

                xray-project-generic-local

        - install the customized xray plugin

                download the zip file here
                https://github.com/kyle11235/jfrog-idea-plugin/releases/download/1.8.x/JFrog-1.8.x-SNAPSHOT.zip
                idea -> references -> plugin -> install from disk ->  the downloaded zip file

                it has a customized whitelist button to submit request to http://x.x.x.x:8082/artifactory/xray-project-generic-local/

        - if you want to continue to develop the xray plugin

                git clone https://github.com/kyle11235/jfrog-idea-plugin (original repo = https://github.com/jfrog/jfrog-idea-plugin)

                open it by idea
                gradle -> idea -> tasks -> build -> intellij -> buildPlugin
                idea -> references -> plugin -> install from disk -> /Users/kyle/workspace/jfrog-idea-plugin/build/distributions/JFrog-1.8.x-SNAPSHOT.zip
                idea -> jfrog -> global config -> your artifactory username/password

        - start ngrok (only required when you test it on your desktop)

                cd /opt/ngrok
                ./8000.sh

        - start admin server (listen to artifactory's webhook event & API request from admin portal)

                cd ./admin

                vi ./setup.sh
                ./setup.sh
                vi ./routes/api.js

                npm install
                ./run.sh (will run on 8000)

        - set art's webhook outgoing to ngrok or where the admin server is deployed  

                artifactory webhook -> artifact deploy event -> xray-project-generic-local -> ngrok/admin's url

        - test

                idea -> jfrog -> Local
                click to select some of the components
                click request whitelist button
                you should see the text of the button changes to whitelist request(Success)
                
3. record whitelist request / notify admin by email

        - value/feature

                demo artifactory's generic repo & meta data & webhook
        
        - test
        
                whitelist requests are recorded here as files, issue components as meta data/properties 
                check http://x.x.x.x:8082/ui/repos/tree/General/xray-project-generic-local%2Fwhitelist_request
                
                - if email is configured in the demo env
                check the configured admin's email

4. approve whitelist request by admin portal

        - value/feature
        
                demo artifactory API/AQL

        - start admin ui 

                cd ./admin_ui
                npm install
                ./run.sh

        - test

                visit the portal http://x.x.x.x/
                click approve button (check admin/routes/api.js for details, it triggers download & copy component into the whitelist repo)
                check xray-project-whitelist-local

5. whitelisted, continue to develop

        - value/feature

                demo artifactory's virtual repo, the approval action triggers API to download & copy issue component into the whitelist repo
                as whitelist repo is included in the virtual repo, it enables developer to resolve component

        - test

                get back into IDE
                ./02_install_by_xray_settings.sh
                build should be successful

6. demo wechat & cli integration (optional)

        - value/feature
        
                show artifactory's integration capabilities, 
                useful for admin/developer to check whitelist request status at any place, 
                just open the wechat app, bot/backend side should verify the user

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

                
                






