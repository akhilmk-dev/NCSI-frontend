
$( document ).ready(function function_name(argument) {
console.log('script');
//chart for english
 Highcharts.getOptions().plotOptions.pie.colors=['#f67f21', '#0f3173'];
 var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'pie'
            },
            title: {
                text: ''
            },
            yAxis: {
                title: {
                    text: 'Total percent market share'
                }
            },
            plotOptions: {
                pie: {
                    shadow: false,
                     dataLabels: {
                    //enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+ this.y +' %';
                }
            },
            series: [{
                name: '',
                data: [["EXPATRIATES",4],["OMANIS",6]],
                size: '95%',
                innerSize: '50%',
                showInLegend:false,
                dataLabels: {
                    enabled: false
                }
            }],
             credits: {
    			enabled: false
  			}
        });
})
       /* Highcharts.setOptions({
 colors: ['#f67f21', '#23408e']
});	*/

