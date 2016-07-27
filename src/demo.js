var sr = Microsoft.ProjectOxford.SpeechRecognition; // save typing

$("#start").click(function() { 

    $("#start").prop('disabled', true);
    $("#status").text("Listening...");

    var key = $("#key").val();
    var appKey = $("#appKey").val();
    var subKey = $("#subKey").val();
    var language = "en-us";

    var mode = sr.SpeechRecognitionMode.shortPhrase;
    // other option is Microsoft.ProjectOxford.SpeechRecognition.SpeechRecognitionMode.longDictation

    // var client = sr.SpeechRecognitionServiceFactory.createMicrophoneClient(
    //     mode, language, key, key); // not sure why key is duplicated

    var client = sr.SpeechRecognitionServiceFactory.createMicrophoneClientWithIntent(
        language, key, key, appKey, subKey);

    // bing speech api
    client.startMicAndRecognition();
    setTimeout(function() {
        client.endMicAndRecognition();
        $("#status").text("Analyzing...");
    }, 5000);

    client.onPartialResponseReceived = function(response) {
        console.log("got something: " + response);
    }

    client.onFinalResponseReceived = function(response) { 
        console.log(response);
        var text = response[0].display;

        $("#output").text(text);
        $("#start").prop('disabled', false);
        $("#status").text("");

        // luis
        //https://api.projectoxford.ai/luis/v1/application?id=0529fbc1-4b08-49eb-922f-8009205ec6ee&subscription-key=fa9ab822b01d4d9e85d1e77febbdabc1&q=hello%20world

        var queryBase = "https://api.projectoxford.ai/luis/v1/application?id=0529fbc1-4b08-49eb-922f-8009205ec6ee&subscription-key=fa9ab822b01d4d9e85d1e77febbdabc1&q=";
        var query = queryBase + encodeURIComponent(text);

        console.log(query);

        $.get(query, {}, function(data, status, jqXHR) {
            console.log(data);

            var intent = data.intents[0];

            if(intent.intent === "AnswerIntent") {
                $("#intent").val(intent.intent + " - answer: " + data.entities[0].entity);
            } else {
                $("#intent").val(intent.intent);
            }
        });
    }

});
