// S3 Operations -------
/*
This method will use AWS S3 SDK to get a list of S3 bucket object.
Before using this method, AWS Credentials must be set in AWS config.
*/

/*
Starting point for AWS List S3 Objects flow with input validation
*/
function listPublicFiles(){
    handleElements(['loader-public-file'], true)
    logMessage('Listing Public Files', 'orange')
    listFiles('public-files/', 'public-files-table', false);    
}

async function listMyFiles(){
    handleElements(['loader-my-file'], true)    
    logMessage('Listing My Own Files', 'orange')
    listFiles(`users/${await getUserId()}/`, 'my-files-table', true);
}

function listFiles(folder, id, hasDelete){            
    var s3 = new AWS.S3();

    var params = {
        Bucket: S3FilesBucket,
        Prefix: folder
    };
    s3.listObjects(params, function(err, data) {
        if (err) logMessage(err.message, 'rgb(255 0 0 / 1)');
        else{
            logMessage(`${data.Contents.length} File(s) Found in folder ${folder}`, 'blue');
            showTableData(data, id, hasDelete)
        }
        hasDelete ? handleElements(['loader-my-file'], false) : handleElements(['loader-public-file'], false); 
    });
}

function downloadFile(file){
    logMessage(`Downloading file ${file}`, "blue");

    var s3 = new AWS.S3();
    var params = {Bucket: S3FilesBucket, Key: file};
    var url = s3.getSignedUrl('getObject', params);

    window.open(url);
}


function deleteFile(file){
    logMessage(`Deleting file ${file}`, 'rgb(255 0 0 / 1)');
    var s3 = new AWS.S3();
    var params = { Bucket: S3FilesBucket, Key: file };
    s3.deleteObject(params, function(err, data) {
        if(err){
            logMessage(`Failed to delete ${err.message}`, 'rgb(255 0 0 / 1)');
        }else{
            logMessage('File deleted', 'blue');
            file.split('/')[0] === 'users' ? listMyFiles() : listPublicFiles()
        }
    });
}


function shareFile(file){
    console.log('file', file)
    var s3 = new AWS.S3();
    var params = {Bucket: S3FilesBucket, Key: file};
    var url = s3.getSignedUrl('getObject', params);
    copyToClipBoard(url)
    logMessage("Linked copied in clipboard");
    updateToolTip(file, 'Link copied', 'Share')
}

function uploadPublicFile(){
    logMessage('Uploading New Public File', 'blue')
    if (!checkEmptyFileControls("public-file-upload")) {
        return alert("Please choose a file to upload first.");
    }
    var file = files[0];
    var fileName = file.name;    
    var fileKey = `public-files/${fileName}`;

    // Use S3 ManagedUpload class as it supports multipart uploads
    var upload = new AWS.S3.ManagedUpload({
        params: {
            Bucket: S3FilesBucket,
            Key: fileKey,
            Body: file        
        }
    });

    upload.promise()
    .then((data) => {
        logMessage(`Successfully uploaded file.`, "blue");            
    },(err) => {
        logMessage(`There was an error uploading your file: ${err.message}`, "rgb(255 0 0 / 1)");
    });
}

async function uploadFile(privateFile = true){
    logMessage('Uploading New File', 'blue')
    if(privateFile === false) {
        var files = fetchFileControlValues("public-file-upload");
        var file = files[0];
        var fileName = file.name;    
        var fileKey = `public-files/${fileName}`;    
    } else {
        var files = fetchFileControlValues("file-upload");
        var file = files[0];
        var fileName = file.name;    
        var fileKey = `users/${await getUserId()}/${fileName}`;
    }
    if (!files.length) {
        return alert("Please choose a file to upload first.");
    }
    // Use S3 ManagedUpload class as it supports multipart uploads
    var upload = new AWS.S3.ManagedUpload({
        params: {
            Bucket: S3FilesBucket,
            Key: fileKey,
            Body: file        
        }
    });

    upload.promise()
    .then((data) => {
        logMessage(`Successfully uploaded file.`, "blue");
        privateFile ? listMyFiles() : listPublicFiles();           
    },(err) => {
        logMessage(`There was an error uploading your file: ${err.message}`, "rgb(255 0 0 / 1)");
    });
}
