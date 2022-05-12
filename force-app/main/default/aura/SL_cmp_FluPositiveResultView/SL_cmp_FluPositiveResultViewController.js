({
    doInit: function (cmp, event, helper) {
        console.log('===FLU Positive INIT personContactId===>', cmp.get('v.personContactId'));
        console.log('===FLU Positive INIT patientName===>', cmp.get('v.patientName'));

        // var navService = cmp.find("navService");
        // var pageReference = {
        //     type: 'standard__recordPage',
        //     attributes: {
        //         pageName: "profile",
        //         recordId: "userId",//set userId here
        //         actionName: "view"
        //     }
        // };

        // cmp.set("v.pageReference", pageReference);
        // // Set the URL on the link or use the default if there's an error
        // var defaultUrl = "#";
        // navService.generateUrl(pageReference)
        //     .then($A.getCallback(function (url) {
        //         // console.log('===INIT navService 111===>', defaultUrl);
        //         // console.log('===INIT navService 222===>', url);
        //         cmp.set("v.url", url ? url : defaultUrl);
        //     }), $A.getCallback(function (error) {
        //         // console.log('===INIT navService 333===>', defaultUrl);
        //         cmp.set("v.url", defaultUrl);
        //     }));
    },

    handleResultDownload: function (cmp, event, helper) {
        console.log('===handleResultDownload CALLED===>');

        // var urlString = window.location.href;
        // console.log('===handleResultDownload urlString===>', urlString);

        // var baseURL = urlString.substring(0, urlString.indexOf("/s/"));
        // console.log('===handleResultDownload baseURL===>', baseURL);

        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/download-test-result?recordId=" + cmp.get('v.personContactId')
        });
        urlEvent.fire();


        // event.preventDefault();
        // var navService = component.find("navService");
        // console.log('===handleResultDownload navService===>', navService);

        // var pageReference = {
        //     type: "standard__namedPage",
        //     attributes: {
        //         pageName: "download-test-result"
        //     }
        // };
        // console.log('===handleResultDownload pageReference===>', JSON.parse(JSON.stringify(pageReference)) );

        // //using state – to transfer data in json format from one page to another.
        // sessionStorage.setItem('localTransfer===>', JSON.stringify(pageReference.state));
        // navService.navigate(pageReference);

        // console.log('===handleResultDownload END===>');
        
        // var sendDataProc = cmp.get("v.sendData");
        // var dataToSend = {
        //     "label" : "This is test"
        // }; 
        // //this is data you want to send for PDF generation

        // //invoke vf page js method
        // sendDataProc(
        //     dataToSend, 
        //     function() {
        //         //handle callback
        //     }
        // );
        // console.log('===handleResultDownload sendDataProc===>', JSON.parse(JSON.stringify(sendDataProc)));

        // var urlEvent = $A.get("e.force:navigateToURL");
        // urlEvent.setParams({
        //     // "url":"/apex/vfpagename?parametername="+"parametervalue"
        //     "url" : "/apex/CNPH_IsolationNote?id=00379000006rH6yAAE"
        // });
        // urlEvent.fire();
    }
})