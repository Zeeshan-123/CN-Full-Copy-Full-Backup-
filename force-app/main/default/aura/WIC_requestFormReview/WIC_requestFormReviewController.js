({
    doInit : function(cmp, event, helper) {
        var scrollOptions = {
            left: 0,
            top: 0,
            behavior: 'smooth'
        }
        window.scrollTo(scrollOptions);
    },

    handleFormEditAgain : function(cmp, event, helper) {
        cmp.set('v.isShowSpinner', true);

        //Call Parent aura method
        var parentComponent = cmp.get("v.parentComponent");
		parentComponent.editFormAgain(true, false);
    },

    handleFormSubmit : function(cmp, event, helper) {
        cmp.set('v.isShowSpinner', true);

        let objSelectedVals = cmp.get('v.objSelectedVals');
        if(!objSelectedVals.iAccept) {
            cmp.set('v.isShowSpinner', false);
            helper.showToastMsg(cmp, event, helper, 'Error', 'Must check the I Accept checkbox.', '2000', 'error', 'dismissible');
        } else {
            //Call Parent aura method
            var parentComponent = cmp.get("v.parentComponent");
            parentComponent.editFormAgain(false, true);
        }
    }
})