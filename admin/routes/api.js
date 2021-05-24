const express = require('express');
const moment = require('moment');
const router = express.Router();
const mailService = require('../service/MailService');
const request = require('request');

// change these to your value
art_base = 'http://182.92.214.141:8082';
api_base = 'http://182.92.214.141:8081/artifactory/api';
generic_repo = 'xray-project-generic-local';
generic_repo_path = 'whitelist_request';

non_blocking_remote_repo = 'maven-ali-remote';

whitelist_repo = 'xray-project-maven-whitelist-local';


// accept webhook event from art
router.post('/', async (req, res) => {
    const body = req.body;
    let title = body.data.path;
    let url = body.jpd_origin + '/ui/repos/tree/General/' + body.data.repo_key + '/' + body.data.path;

    // status is updated by admin portal
    // only handle event triggered from xray IDE plugin
    if(body.data.property_key != 'status'){
        
        let email = {
            to: process.env.XRAY_DEMO_ADMIN_EMAIL,
            subject: title , // Subject line
            html: 'Whitelist Request is recorded here - <a href="'+ url +'">' + url + '</a>' // html body
        };
        let sent = mailService.send(email);
    }
    
    res.json({status: 'success', message: 'ok'});
    return;

});

router.get('/all', async (req, res) => {
    
    const headers = {};
    headers['X-JFrog-Art-Api'] = process.env.ART_API_KEY;

    // headers['Content-Type'] = 'application/json; charset=utf-8';
    headers['Content-Type'] = 'text/plain';
    
    payload = 'items.find({ "repo": {"$eq" : "'+ generic_repo +'"},"path": {"$match" : "'+ generic_repo_path +'"}})'
    
    const options = {
        url: api_base + "/search/aql",
        json: false,
        headers: headers,
        body: payload
    };
    
    request.post(options, function (error, response, body) {
        if(error){
            console.log(error);
        }
        console.log('response--------');
        console.log(JSON.stringify(response));
        console.log('body--------');
        console.log(JSON.stringify(body));
        console.log('error--------');
        console.log(JSON.stringify(error));

        res.json({status: 'success', message: 'ok', art_body: JSON.parse(body)});
    });

});

router.get('/approved', async (req, res) => {
    
    const headers = {};
    headers['X-JFrog-Art-Api'] = process.env.ART_API_KEY;

    // headers['Content-Type'] = 'application/json; charset=utf-8';
    headers['Content-Type'] = 'text/plain';
    
    payload = 'items.find({ "repo": {"$eq" : "'+ generic_repo +'"},"path": {"$match" : "'+ generic_repo_path +'"},"@status": {"$eq" : "approved"}})'
    
    const options = {
        url: api_base + "/search/aql",
        json: false,
        headers: headers,
        body: payload
    };
    
    request.post(options, function (error, response, body) {
        if(error){
            console.log(error);
        }
        console.log('response--------');
        console.log(JSON.stringify(response));
        console.log('body--------');
        console.log(JSON.stringify(body));
        console.log('error--------');
        console.log(JSON.stringify(error));

        res.json({status: 'success', message: 'ok', art_body: JSON.parse(body)});
    });
    
});



router.get('/denied', async (req, res) => {
    
    const headers = {};
    headers['X-JFrog-Art-Api'] = process.env.ART_API_KEY;

    // headers['Content-Type'] = 'application/json; charset=utf-8';
    headers['Content-Type'] = 'text/plain';
    
    payload = 'items.find({ "repo": {"$eq" : "'+ generic_repo +'"},"path": {"$match" : "'+ generic_repo_path +'"},"@status": {"$eq" : "denied"}})'
    
    const options = {
        url: api_base + "/search/aql",
        json: false,
        headers: headers,
        body: payload
    };
    
    request.post(options, function (error, response, body) {
        if(error){
            console.log(error);
        }
        console.log('response--------');
        console.log(JSON.stringify(response));
        console.log('body--------');
        console.log(JSON.stringify(body));
        console.log('error--------');
        console.log(JSON.stringify(error));

        res.json({status: 'success', message: 'ok', art_body: JSON.parse(body)});
    });
    

});

router.get('/details', async (req, res) => {
    
    const headers = {};
    headers['X-JFrog-Art-Api'] = process.env.ART_API_KEY;

    headers['Content-Type'] = 'application/json; charset=utf-8';
    // headers['Content-Type'] = 'text/plain';

    console.log('name=' + req.query.name);
    
    
    const options = {
        url: api_base + "/storage/" + generic_repo + "/" + generic_repo_path + "/" + req.query.name + "?properties",
        json: false,
        headers: headers
    };
    
    request.get(options, function (error, response, body) {
        if(error){
            console.log(error);
        }
        console.log('response--------');
        console.log(JSON.stringify(response));
        console.log('body--------');
        console.log(JSON.stringify(body));
        console.log('error--------');
        console.log(JSON.stringify(error));

        res.json({status: 'success', message: 'ok', art_body: JSON.parse(body)});
    });

});

router.get('/approve', async (req, res) => {
    
    const headers = {};
    headers['X-JFrog-Art-Api'] = process.env.ART_API_KEY;

    headers['Content-Type'] = 'application/json; charset=utf-8';
    // headers['Content-Type'] = 'text/plain';

    console.log('name=' + req.query.name);

    let requestFilePath = generic_repo + "/" + generic_repo_path + "/" + req.query.name;
    
    const options = {
        url: api_base + "/storage/" + requestFilePath + "?properties",
        json: false,
        headers: headers
    };
    
    // 1. get properties
    request.get(options, function (error, response, body) {
        if(error){
            console.log(error);
        } else {
            console.log('get properties good');
        }

        let art_body = JSON.parse(body);
        let properties = art_body.properties
        
        // handle each property
        for(let key in properties){
            let value = properties[key] + '';
            console.log(key + '=' + value);

            try{
                // com.alibaba:fastjson:1.2.24 -> [com.alibaba, fastjson, 1.2.24] -> com/alibaba/fastjson/1.2.24/fastjson-1.2.24.jar?content=none
                let arr = value.split(':');
                console.log('arr=' + arr);

                let groupArr = arr[0].split('.');

                let file = ''
                for(p in groupArr){
                    file = file + groupArr[p] + '/'
                }
                path = file = file + arr[1] + '/' + arr[2]; // com/alibaba/fastjson/1.2.24
                file = path + '/' + arr[1] + '-' + arr[2] + '.jar'; // com/alibaba/fastjson/1.2.24/fastjson-1.2.24.jar?content=none

                // 2. trigger download
                options.url = api_base + "/download/" + non_blocking_remote_repo + "/" + file + '?content=none';
                console.log('trigger url=' + options.url);

                request.get(options, function (error, response, body) {
                    if(error){
                        console.log(error);
                    } else{
                        console.log('trigger download good');

                        // 3. copy to whitelist
                        options.url = api_base + "/copy/" + non_blocking_remote_repo + "-cache/" + path + '?to=' + whitelist_repo + "/" + path;
                        console.log('copy url=' + options.url);

                        request.post(options, function (error, response, body) {
                            if(error){
                                console.log(error);
                            } else{
                                console.log('copy good');
                            }

                        });

                    }

                });
            } catch(e){
                console.log(e)
            }
            
        }

        // 4. approve (todo - check if all download are successful)
        options.url = api_base + "/storage/" + requestFilePath + "?properties=status=approved"
        console.log('approve url=' + options.url);

        request.put(options, function (error, response, body) {
            if(error){
                console.log(error);
            } else{
                console.log('approve good');

                // 5. get user's email, 2021_05_24_14_21_44_kyle -> kyle
                let username = req.query.name.substr(20);
                options.url = api_base + "/security/users/" + username;
                console.log('get user url=' + options.url);

                request.get(options, function (error, response, body) {
                    if(error){
                        console.log(error);
                    } else{
                        let art_body = JSON.parse(body)
                        console.log('get user good', art_body);
                        
                        // 6. send email
                        let title = 'Whitelist Request has been Approved';
                        let url = art_base + '/ui/repos/tree/General/' + generic_repo_path + '/' + req.query.name;
                        let email = {
                            to: art_body.email,
                            subject: title , // Subject line
                            html: 'Whitelist Request is recorded here - <a href="'+ url +'">' + url + '</a>' // html body
                        };
                        let sent = mailService.send(email).catch(e => {
                            console.log(e);
                        });

                    }

                });


            }

        });

        
        
        res.json({status: 'success', message: 'ok', art_body: JSON.parse(body)});
    });

});

router.get('/deny', async (req, res) => {
    
    const headers = {};
    headers['X-JFrog-Art-Api'] = process.env.ART_API_KEY;

    headers['Content-Type'] = 'application/json; charset=utf-8';
    // headers['Content-Type'] = 'text/plain';

    console.log('name=' + req.query.name);
    
    let requestFilePath = generic_repo + "/" + generic_repo_path + "/" + req.query.name;

    const options = {
        url: api_base + "/storage/" + requestFilePath + "?properties=status=denied",
        json: false,
        headers: headers
    };


    console.log('apprdenyove url=' + options.url);

    request.put(options, function (error, response, body) {
        if(error){
            console.log(error);
        } else {
            console.log('deny good');
        }
        
        res.json({status: 'success', message: 'ok'});
    });

});

module.exports = router;
