({
    scriptsLoaded : function(component, event, helper) {
        console.log('Script loaded..'); 
    },
    handleClick : function(component,event,helper) {
        component.set("v.truthy2",false);
        component.set("v.truthy",false);
        var start = component.get("v.StartDate");
        var end = component.get("v.EndDate");
        var action = component.get('c.fetchPLA');
        action.setParams({"startdateNew" : start, "EnddateNew" : end,"ContactOrCase": 'Case'}); 
        console.log('start');
        action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('success');
                //set response value in lstPLA attribute on component.
                component.set('v.lstPLA', response.getReturnValue());
                component.set("v.truthy",false);
                window.setTimeout(
                    $A.getCallback(function() {
                        component.set("v.truthy",true);
                        // when response successfully return from server then apply jQuery dataTable after 500 milisecond
                        setTimeout(function(){ 
                            //$('#tableId').DataTable({"order": [[ 1,"asc" ]]});
                            // add lightning class to search filter field with some bottom margin..  
                            var groupColumn = 2;
                            var table = $('#tableId').DataTable({
                                "scrollX": true,
                                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                                "columnDefs": [
                                    { "visible": false, "targets": groupColumn }
                                ],
                                "order": [[ groupColumn, 'asc' ]],
                                "displayLength": 25,
                                "drawCallback": function ( settings ) {
                                    var api = this.api();
                                    var rows = api.rows( {page:'current'} ).nodes();
                                    var last=null;
                                    api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
                                        if ( last !== group ) {
                                            $(rows).eq( i ).before(
                                                '<tr class="group"><td colspan="10"><b>'+group+'</b></td></tr>'
                                            );
                                            last = group;
                                        }
                                    } );
                                },
                                "order": [[ 3,"asc" ]],
                                //"orderFixed": [2,"asc"]
                            } );
                            
                            var Datarecieved = component.get("v.lstPLA");
                            helper.plotgraph(component, Datarecieved,'linechart');  
                        }, 500);         
                    })
                    ,500);
            }
        });
        $A.enqueueAction(action);
        
        var start = component.get("v.StartDate");
        var end = component.get("v.EndDate");
        action = component.get('c.fetchPLA');
        action.setParams({"startdateNew" : start, "EnddateNew" : end,"ContactOrCase": 'Contact'}); 
        console.log('start');
        action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('success');
                //set response value in lstPLA attribute on component.
                component.set('v.lstPLAContacts', response.getReturnValue());
                component.set("v.truthy2",false);
                window.setTimeout(
                    $A.getCallback(function() {
                        component.set("v.truthy2",true);
                        // when response successfully return from server then apply jQuery dataTable after 500 milisecond
                        setTimeout(function(){ 
                            //$('#tableId').DataTable({"order": [[ 1,"asc" ]]});
                            // add lightning class to search filter field with some bottom margin..  
                            var groupColumn = 2;
                            var table = $('#tableId2').DataTable({
                                "scrollX": true,
                                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                                "columnDefs": [
                                    { "visible": false, "targets": groupColumn }
                                ],
                                "order": [[ groupColumn, 'asc' ]],
                                "displayLength": 25,
                                "drawCallback": function ( settings ) {
                                    var api = this.api();
                                    var rows = api.rows( {page:'current'} ).nodes();
                                    var last=null;
                                    api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
                                        if ( last !== group ) {
                                            $(rows).eq( i ).before(
                                                '<tr class="group"><td colspan="10"><b>'+group+'</b></td></tr>'
                                            );
                                            last = group;
                                        }
                                    } );
                                },
                                "order": [[ 3,"asc" ]],
                                //"orderFixed": [2,"asc"]
                            } );
                            
                            var Datarecieved = component.get("v.lstPLAContacts");
                            helper.plotgraph(component, Datarecieved,'linechart2');             
                        }, 500);         
                    })
                    ,500);
            }
        });
        $A.enqueueAction(action);
        
        
    },
    
    doInit : function(component,event,helper){
        //call apex class method
        var startdate = component.get('c.startdate');
        startdate.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.StartDate', response.getReturnValue());
            }});
        $A.enqueueAction(startdate); 
        //call apex class method
        var enddate = component.get('c.enddate');
        enddate.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set('v.EndDate', response.getReturnValue());
            }});
        $A.enqueueAction(enddate); 
        //call apex class method
        var action = component.get('c.fetchPLA');
        action.setParams({"ContactOrCase" : "Case"}); 
        action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                //set response value in lstPLA attribute on component.
                component.set('v.lstPLA', response.getReturnValue());
                
                // when response successfully return from server then apply jQuery dataTable after 500 milisecond
                setTimeout(function(){ 
                    //$('#tableId').DataTable({"order": [[ 1,"asc" ]]});
                    // add lightning class to search filter field with some bottom margin..  
                    
                    var groupColumn = 2;
                    var table = $('#tableId').DataTable({
                        "scrollX": true,
                        
                        //"ordering": false,
                        //"searching": false,
                        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                        "columnDefs": [
                            { "visible": false, "targets": groupColumn }
                        ],
                        "order": [[ groupColumn, 'asc' ]],
                        "displayLength": 25,
                        "drawCallback": function ( settings ) {
                            var api = this.api();
                            var rows = api.rows( {page:'current'} ).nodes();
                            var last=null;
                            api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
                                if ( last !== group ) {
                                    $(rows).eq( i ).before(
                                        '<tr class="group"><td colspan="10"><b>'+group+'</b></td></tr>'
                                    );
                                    last = group;
                                }
                            } );
                        },
                        
                        "order": [[ 3,"asc" ]]
                    } );
                    
                }, 1000); 
                
                var Datarecieved = component.get("v.lstPLA");
                helper.plotgraph(component, Datarecieved,'linechart');
                
            }
        });
        
        $A.enqueueAction(action); 
        action = component.get('c.fetchPLA');
        action.setParams({"ContactOrCase" : "Contact"}); 
        action.setCallback(this, function(response) {
            //store state of response
            var state = response.getState();
            if (state === "SUCCESS") {
                //set response value in lstPLA attribute on component.
                component.set('v.lstPLAContacts', response.getReturnValue());
                
                // when response successfully return from server then apply jQuery dataTable after 500 milisecond
                setTimeout(function(){ 
                    //$('#tableId').DataTable({"order": [[ 1,"asc" ]]});
                    // add lightning class to search filter field with some bottom margin..  
                    
                    var groupColumn = 2;
                    var table = $('#tableId2').DataTable({
                        "scrollX": true,
                        
                        //"ordering": false,
                        //"searching": false,
                        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                        "columnDefs": [
                            { "visible": false, "targets": groupColumn }
                        ],
                        "order": [[ groupColumn, 'asc' ]],
                        "displayLength": 25,
                        "drawCallback": function ( settings ) {
                            var api = this.api();
                            var rows = api.rows( {page:'current'} ).nodes();
                            var last=null;
                            api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
                                if ( last !== group ) {
                                    $(rows).eq( i ).before(
                                        '<tr class="group"><td colspan="10"><b>'+group+'</b></td></tr>'
                                    );
                                    last = group;
                                }
                            } );
                        },
                        
                        "order": [[ 3,"asc" ]]
                    } );
                    
                }, 1000); 
                
                var Datarecieved = component.get("v.lstPLAContacts");
                helper.plotgraph(component, Datarecieved,'linechart2');
                
            }
        });
        $A.enqueueAction(action); 
    },
    downloadCsv : function(component, event, helper){
        var stockData = component.get("v.lstPLA");
        //console.log('stockdata:'+stockdata);
        // call the helper function which "return" the CSV data as a String
        var csv = helper.convertArrayOfObjectsToCSV(component, stockData);
        if (csv == null){return;}
        
        // ####--code for create a temp. <a> html tag [link tag] for download the CSV file--####
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_self'; //
        hiddenElement.download = 'Case-Export.csv';  // CSV file Name* you can change it.[only name not .csv]
        document.body.appendChild(hiddenElement); // Required for FireFox browser
        hiddenElement.click(); // using click() js function to download csv file
        
        stockData = component.get("v.lstPLAContacts");
        //console.log('stockdata:'+stockdata);
        // call the helper function which "return" the CSV data as a String
        var csv = helper.convertArrayOfObjectsToCSV(component, stockData);
        if (csv == null){return;}
        
        // ####--code for create a temp. <a> html tag [link tag] for download the CSV file--####
        hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_self'; //
        hiddenElement.download = 'Contact-Export.csv';  // CSV file Name* you can change it.[only name not .csv]
        document.body.appendChild(hiddenElement); // Required for FireFox browser
        hiddenElement.click(); // using click() js function to download csv file
    }
})