({
    convertArrayOfObjectsToCSV : function(component, objectRecords){
        var csvStringResult, counter, keys, columnDivider, lineDivider;
        
        // check if "objectRecords" parameter is null, then return from function
        if (objectRecords == null || !objectRecords.length) {
            return null;
        }
        
        // store ,[comma] in columnDivider variable for separate CSV values and
        // for start next line use '\n' [new line] in lineDivider variable
        columnDivider = ',';
        lineDivider =  '\n';
        
        // in the keys valirable store fields API Names as a key
        // this labels use in CSV file header
        
        keys = ["Account Name","Contact or Case","Date by Month","Event Name","EventType","EventDate","ExpirationDate","Case Status","Contact ID","Case ID"];//Object.keys(objectRecords[0]); // FIXME: If the first record has empty fields, then they won't appear in header.
        console.log(keys);
        console.log(objectRecords);
        csvStringResult = '';
        csvStringResult += keys.join(columnDivider);
        csvStringResult += lineDivider;
        
        for(var i=0; i < objectRecords.length; i++){
            if(objectRecords[i]['Account_Name__c']!=undefined){
                csvStringResult += '"'+ objectRecords[i]['Account_Name__c']+'"';
            }else
                csvStringResult += '""';
            csvStringResult += columnDivider;
            if(objectRecords[i]['Contactor_Case__c']!=undefined){
                csvStringResult += '"'+ objectRecords[i]['Contactor_Case__c']+'"';
            }else
                csvStringResult += '""';
            csvStringResult += columnDivider;
            if(objectRecords[i]['Date2__c']!=undefined){ 
                var d=$A.localizationService.formatDate(objectRecords[i]['Date2__c'], "MMM dd, yyyy");
                csvStringResult += '"'+d+'"';
            }
            else
                csvStringResult += '""';
            csvStringResult += columnDivider;
            if(objectRecords[i]['Name']!=undefined){
                csvStringResult += '"'+ objectRecords[i]['Name']+'"';
            }else
                csvStringResult += '""';
            csvStringResult += columnDivider;
            if(objectRecords[i]['EventType']!=undefined){
                csvStringResult += '"'+ objectRecords[i]['EventType']+'"';
            }else
                csvStringResult += '""';
            csvStringResult += columnDivider;
            if(objectRecords[i]['EventDate']!=undefined){
                var d=$A.localizationService.formatDate(objectRecords[i]['EventDate'], "MMM dd, yyyy");
                //d=d.toLocaleString("en-US", {timeZone: "America/Chicago"});
                //d=d.format('MMM DD, YYYY'); 
                csvStringResult += '"'+d +'"';
            }
            else
                csvStringResult += '""';
            csvStringResult += columnDivider;
            if(objectRecords[i]['ExpirationDate']!=undefined){
                var d=$A.localizationService.formatDate(objectRecords[i]['ExpirationDate'], "MMM dd, yyyy");
                //d=d.toLocaleString("en-US", {timeZone: "America/Chicago"});
                //d=d.format('MMM DD, YYYY'); 
                csvStringResult += '"'+d +'"';
            }else
                csvStringResult += '""';
            csvStringResult += columnDivider;
            if(objectRecords[i]['Active_or_Inactive__c']!=undefined){
                csvStringResult += '"'+ objectRecords[i]['Active_or_Inactive__c']+'"';
            }else
                csvStringResult += '""';
            csvStringResult += columnDivider;
            if(objectRecords[i]['Contact_ID__c']!=undefined){
                csvStringResult += '"'+ objectRecords[i]['Contact_ID__c']+'"';
            }else
                csvStringResult += '""';
            csvStringResult += columnDivider;
            if(objectRecords[i]['Case_ID__c']!=undefined){
                csvStringResult += '"'+ objectRecords[i]['Case_ID__c']+'"';
            }else
                csvStringResult += '""';
            csvStringResult += lineDivider;
        }
        
        return csvStringResult;
    },
    plotgraph : function(component, objectRecords,ComponentName){
        
        // check if "objectRecords" parameter is null, then return from function
        if (objectRecords == null || !objectRecords.length) {
            return null;
        }
        
        // in the keys valirable store fields API Names as a key
        // this labels use in CSV file header  
        let Dmap = new Map()    
        //var Dlist=[];
        for(var i=0; i < objectRecords.length; i++){
            if(objectRecords[i]['Date__c']!=undefined){
                //console.log('data:'+objectRecords[i]['Date__c']);
                if(Dmap.get(objectRecords[i]['Date__c'])==undefined){
                    //console.log('data first entry:'+objectRecords[i]['Date__c']);
                    Dmap.set(objectRecords[i]['Date__c'],1);
                }
                else{
                    var count=Dmap.get(objectRecords[i]['Date__c']);
                    Dmap.delete(objectRecords[i]['Date__c']);
                    Dmap.set(objectRecords[i]['Date__c'],count+1);
                    //console.log('data entry:'+count+1+':'+objectRecords[i]['Date__c']);
                }
                
                //Dlist.push(objectRecords[i]['Date2__c']);
            }
        }
        var label=[];
        var data=[];
        for (let value of Dmap.keys()) {
            label.push(value);
            //console.log('data entry:'+value);
        }
        for (let value of Dmap.values()) {
            data.push(value);
            //console.log('data entry:'+value);
        }
        //console.log('data:');
        //console.log(labellist);
        var stockData =  {
            labels: label,
            datasets: [
                {
                    label:'Count',
                    data: data,
                    backgroundColor	: 'rgba(30, 139, 195, 1)',
                    borderColor: 'rgba(30, 139, 195, 1)',
                    //borderColor:'rgba(62, 159, 222, 1)',
                    //fill: false,
                    //pointBackgroundColor: "#FFFFFF",
                    //pointBorderWidth: 4,
                    //pointHoverRadius: 5,
                    //pointRadius: 3,
                   // bezierCurve: true,
                    //pointHitRadius: 10
                }
            ]
        };
        var ctx = component.find(ComponentName).getElement();
        var lineChart = new Chart(ctx ,{
            type: 'horizontalBar',
            data: stockData,
            options: {	
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                legend: {
                    position: 'top',
                    padding: 10,
                },
                responsive: true
            }
        });
    },
})