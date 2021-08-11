var http = require('https');
var host = 'api.github.com';

var ramdaReposities = []; //This is a list of repository request data for each repository owned by Ramda
var pullrequestNumbersPerRepository = [];
var pullrequestPaths = [];
var pullRequestObjects = []; //This is an array containing all pull request objects returned for each repository.

module.exports = {
    Init: function () {
        fetchRamdaPullRequests();

        setTimeout(function () {
            showResults(pullrequestNumbersPerRepository);
        }, 3000);

    },
     
};


//# Region private functions
function fetchRamdaPullRequests() {

    var options = {
        host: host,
        path: '/users/ramda/repos',
        method: "GET",
        headers: {
            'User-Agent': 'Ramda Pull Request PG',
            'Authorization': 'Bearer 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'
        }
    };

    http.request(options, repositoryCallback).end();

}


function pullRequestsCallback(response) {
    var str = '';
    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {

        var response = JSON.parse(str); //The response object contains full JSON context for each Repository from Ramda

        if (response.length > 0) {

            if ((response[0].number !== undefined) && (response[0].number > 0)) {

                var numPullRequestsPerRepository = response[0].number;
                pullrequestNumbersPerRepository.push(numPullRequestsPerRepository);
                pullRequestObjects.push(response);
            }
        }
    });

}

function showResults(pullrequestNumbersPerRepository) {
    var totalPullRequests = 0;

    for (var i = 0; i < pullrequestNumbersPerRepository.length; i++)
    {
        totalPullRequests = totalPullRequests + pullrequestNumbersPerRepository[i];
    }

    console.log("Found " + ramdaReposities.length + " repositories.");

    console.log("Total Number of pull requests: " + totalPullRequests);

}


function repositoryCallback(response) {
    var str = '';

    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        var response = JSON.parse(str);
        
        for (var i = 0; i < response.length; i++)
        {
            let pullRequestPath = response[i].pulls_url;
            ramdaReposities.push(response[i]);
            pullRequestPath = pullRequestPath.replace("{/number}", "");
            pullrequestPaths.push(pullRequestPath);
        }

        processPullRequestPaths(pullrequestPaths);

    });

}

function processPullRequestPaths(pullrequestPaths)
{
    
    if (pullrequestPaths.length > 0) {

        for (var i = 0; i < pullrequestPaths.length; i++) { //for each repository, send a request to get the number of pull requests.

            var pullRequestsOptions = {
                host: host,
                path: pullrequestPaths[i],
                method: "GET",
                headers:
                {
                    'User-Agent': 'Ramda Pull Request PG',
                    'Authorization': 'Bearer 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'
                }

            };

            http.request(pullRequestsOptions, pullRequestsCallback).end();

        }
     
    }
}


