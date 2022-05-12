({
    showToastMsg : function(cmp, event, helper, strTitle, strMessages, strDuration, strType, strMode) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title       : strTitle,
            message     : strMessages,
            duration    : strDuration,
            type        : strType,
            mode        : strMode
        });
        toastEvent.fire();
    }
})