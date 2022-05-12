({
    handleSearch: function (component, event, helpler)
    {
        helpler.handleSearch(component, event, helpler);
    },
    validateAndReplace: function (component, event)
    {
        const input = event.getSource();
        const inputValue = input.get('v.value');
        const validValue = inputValue.replace(/^(\d\d)(\d)$/g,'$1/$2')
        .replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2')
        .replace(/[^\d\/]/g,'');
        input.set('v.value', validValue);
    },
    clearError : function(component, event)  
    {
		var fieldId = event.getSource().getLocalId();
        var fieldInput = component.find(fieldId);
        var fieldValue = fieldInput.get("v.value");
        
        if(fieldValue != '')
        {
          //  $A.util.removeClass(fieldId, 'slds-has-error');
            fieldInput.setCustomValidity('');
         	fieldInput.reportValidity();
        }
    },
    handleCancel: function (component, event, helpler) 
    {
        let urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": '/s/login'
        });
        urlEvent.fire();
    },
})