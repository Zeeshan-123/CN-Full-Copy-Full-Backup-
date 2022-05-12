({
    doInit: function (cmp, event, helper) {
        let urlParams = decodeURIComponent(window.location.search.substring(1));
        let pId;
        let ehrId;

        if(!$A.util.isEmpty(urlParams)) {
            let lstParams = urlParams.split('&');
            if(urlParams.includes('pId'))       pId = (lstParams[0]).split('=')[1];
            if(urlParams.includes('ehrId'))     ehrId = (lstParams[1]).split('=')[1];
        }

        cmp.set('v.pId', pId);
        cmp.set('v.ehrId', ehrId);
        helper.getDataOnInit(cmp, event, helper);
    },

    // handleResultDownload: function (cmp, event, helper) {
    //     console.log('===handleResultDownload CALLED===>');
    //     var urlEvent = $A.get("e.force:navigateToURL");
    //     urlEvent.setParams({
    //         "url": "/download-test-result?recordId=" + cmp.get('v.ehrId')
    //     });
    //     urlEvent.fire();
    // }
})