
$( document ).ready(function function_name(argument) {
console.log('script');
//chart for english
 Highcharts.getOptions().plotOptions.pie.colors=[ '#0f3173','#f67f21'];
 chart = new Highcharts.Chart({
            chart: {
                 
                renderTo: 'containerAr',
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
                    format: '\u202B'+'<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+' %'+ this.y;
                },
                  useHTML: true,
                style: {
                    direction: 'rtl',
                    fontFamily:'Janna LT',
                }
            },
            series: [{
                name: '',
                data: [["عمانيون",6],["وافدون",4]],
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

