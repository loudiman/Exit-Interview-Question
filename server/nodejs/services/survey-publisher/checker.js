const {parent} = require('worker_threads')

var unpublishedStack = []
var onGoingStack = []

function checkUnpublishedSurveys(){
    // fetch unpublished surveys add to unpub staack
    //
}

function checkPublishedSurveys(){
    // Change done surveys status to finished 
}

function setPublish(){
    // pop survey which has the earliest publish date
    // periodically wait for that time to arrive, and set that to publish
}

function newSurvey(){
    //Add new survey to the buffer stack to be sorted onto the unpublished stack
}

//invokes checkSurveys every 30 mins
setInterval(checkSurveys, 30 * (60 * 1000))