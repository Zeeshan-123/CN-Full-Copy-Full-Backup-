({
    
    plotgraph : function(component, objectRecords,ComponentName){
        
        // check if "objectRecords" parameter is null, then return from function
        if (objectRecords == null) {
            return null;
        }
		var count=0;
        var label=[];
        var data=[];
        for(var key in objectRecords) {
            label.push(key);
            data.push(objectRecords[key]);
            count=objectRecords[key]+count;
        }
        if(ComponentName=='linechart')
            component.set("v.CaseCount", count);
        else
            component.set("v.ContactCount", count);  
        var stockData =  {
            labels: label,
            datasets: [
                {
                    label:'Count',
                    data: data,
                    backgroundColor	: 'rgba(30, 139, 195, 1)',
                    borderColor: 'rgba(30, 139, 195, 1)',
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