  /*var $ = jQuery.noConflict();
  $( document ).ready(function() {*/
    console.log('population.js');
    window.odometerOptions = {
  auto: false, // Don't automatically initialize everything with class 'odometer'
  selector: '#odometerCustom', // Change the selector used to automatically find things to be animated
  format: '(,ddd).dd', // Change how digit groups are formatted, and how many digits are shown after the decimal point
  duration: 3000, // Change how long the javascript expects the CSS animation to take
  theme: 'car', // Specify the theme (if you have more than one theme css file on the page)
  //animation: 'count' // Count is a simpler animation method which just increments the value,
   };                  // use it when you're looking for something more subtle.

var el = document.querySelector('#odometerCustom');
             var od = new Odometer({
   auto: false,
  el: el,
  value: 0000000,
  selector: '#odometerCustom',
  duration: 2000,

  // Any option (other than auto and selector) can be passed in here
  format: '(,ddd).dd',
  theme: 'car',
  //animation: 'count'
});
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
      function GetcurrentLang() {
          var LCID = _spPageContextInfo.currentLanguage;
          if (LCID == "1025") {
              return "Ar";
          }
          else {
              return "En";
          }
      }
      
      // GEt First And Last Items
      var Exp, Oma, CHcolor, Sum, pieData, PIE1 = 0, PIE2 = 0, lastDValue, firstDVlaue,counterShow = 0;
      
      function convertToServerTimeZone(date){
      //EST
      
      offset = 4.0
      clientDate = new Date(date);
      utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
      serverDate = new Date(utc + (3600000*offset));
      return serverDate;
      }
      
      $(document).ready(function () {
          try {
              function SetFirstItemData(data) {
     // console.log(data);
      //data= JSON.parse(data);
                  $.each(data.d.results, function (key, val) {
                      if (val.ID != undefined) {
                          lastDValue = new Date(val.ahPopulationDate);
                          lastDValue.format("yyyy/MM/dd");
                      }
                  });
      
      
              };
              function SetFirstItemDataError() {
                  console.log('SetFirstItemDataError');
              };
      
              $.ajax({
                  //url: _spPageContextInfo.siteAbsoluteUrl + "/_api/lists/getbytitle('PopulationClock')/items/?$top=1&$select=ID,ahPopulationDate,ahPopulationOmanis,ahPopulationExpatriates&$orderby=ahPopulationDate asc",
                  url:urlTop1Acs,
                  method: "GET",
                  headers: {
                      "accept": "application/json",
                      "X-RequestDigest": $("#__REQUESTDIGEST").val()
                  },
                  headers: { "Accept": "application/json; odata=verbose" },     // content type sent to server
                  success: SetFirstItemData,
                  error: SetFirstItemDataError  // When Service call fails
              });
      
      
              function SetLastItemData(data) {
       // data = JSON.parse(data);
                  $.each(data.d.results, function (key, val) {
                      if (val.ID != undefined) {
                          firstDVlaue = convertToServerTimeZone(val.ahPopulationDate);
                          firstDVlaue.format("yyyy/MM/dd");
                          Oma = numberWithCommas(val.ahPopulationOmanis);
                          Exp = numberWithCommas(val.ahPopulationExpatriates);
                      }
                  });
                  $('#PopulationBL').hover(function () { $('#s4-workspace').addClass('DisScroll') }, function () { $('#s4-workspace').removeClass('DisScroll') })
      
                  ActionClock(Oma, Exp);
                  DrawPeiChart();
                  GetAllData();
              };
              function SetLastItemDataError() {
                  console.log('SetLastItemDataError');
              };
              $.ajax({
                  //url: _spPageContextInfo.siteAbsoluteUrl + "/_api/lists/getbytitle('PopulationClock')/items/?$top=1&$select=ID,ahPopulationDate,ahPopulationOmanis,ahPopulationExpatriates&$orderby=ahPopulationDate desc",
                  url:urlTop1Desc,
                  method: "GET",
                  headers: {
                      "accept": "application/json",
                      "X-RequestDigest": $("#__REQUESTDIGEST").val()
                  },
                  headers: { "Accept": "application/json; odata=verbose" },     // content type sent to server
                  success: SetLastItemData,
                  error: SetLastItemDataError   // When Service call fails
              });
      
      
      
          } catch (e) {
              console.log(e.name + "#" + e.description + "#" + e.message)
          }
      
      });
      
      
      
      //  Load All Data
      
      
      
      
      function DrawPeiChart() {
          try {
      
              //  alert('Start');
              //var ctx = document.getElementById("chart_area").getContext("2d");
              //window.myPie = new Chart(ctx).Pie(pieData);
              //     alert(window.myPie)
              var Flag;
              var lcid = 1035//_spPageContextInfo.currentLanguage;
              if (lcid == 1033) {
                  Flag = {
                      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                  };
              }
              else {
                  Flag = {
                      days: ["الاحد", "الاثنين", "الثلاثاء", "الاربعاء", "الخميس", "الجمعة", "السبت"],
                      months: ['يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر']
                  };
              }
      
             
              var LD = new Date(lastDValue);
              var HDdate = new Date(LD);
              var HDEnddate = new Date(firstDVlaue);
              var STDValuecntr = new Date(firstDVlaue);
              //STDValuecntr.setDate(STDValuecntr.getDate() + 1);
              HDdate.setDate(HDdate.getDate());
              HDEnddate.setDate(HDEnddate.getDate() + 1); //2
              $.dateSelect.show({ Sdate: HDdate, Edate: HDEnddate, strings: Flag, date: new Date(STDValuecntr) });
          } catch (e) {
              console.log(e.name + "#" + e.description + "#" + e.message)
          }
      };
      function RunClock() {
          var selectedDateText = $('.date-select .popup').find('div.day').find('span.num').text() + '/' + $('.date-select .popup').find('div.month').find('span.num').text() + '/' + $('.date-select .popup').find('div.year').find('span.num').text();
          var PopulatonData = GetPopulatonData(new Date(selectedDateText));
          Oma = PopulatonData[0] == null ? Oma : PopulatonData[0];
          Exp = PopulatonData[1] == null ? Exp : PopulatonData[1];
          ActionClock(Oma, Exp);
          console.log(Math.round10(PIE2, -1).toFixed(2))
          
          //myPie.segments[0].value = PIE1;
          //myPie.segments[1].value = PIE2;
          //myPie.segments[1].fillColor = CHcolor;
          //myPie.update();
          if (PopulatonData[0] == null) {
              $(".deemed").css('display', 'block');
          } else {
              $(".deemed").css('display', 'none');
          }
      }
      function decimalAdjust(type, value, exp) {
          // If the exp is undefined or zero...
          if (typeof exp === 'undefined' || +exp === 0) {
              return Math[type](value);
          }
          value = +value;
          exp = +exp;
          // If the value is not a number or the exp is not an integer...
          if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
              return NaN;
          }
          // Shift
          value = value.toString().split('e');
          value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
          // Shift back
          value = value.toString().split('e');
          return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
      }
      function ActionClock(O, E) {
          try {
              if (!Math.round10) {
                  Math.round10 = function (value, exp) {
                      return decimalAdjust('round', value, exp);
                  };
              }
              //Effact
              
              O = O.replace(/[^\d\.\-]/g, "");
              E = E.replace(/[^\d\.\-]/g, "");
              Sum = parseFloat(O) + parseFloat(E);
              PIE1 = parseFloat(O) / Sum * 100;
              PIE2 = parseFloat(E) / Sum * 100;
              $('#rateOmanis').text(Math.round10(PIE1, -1).toFixed(2) + '%');
              $('#rateExpatriates').text(Math.round10(PIE2, -1).toFixed(2) + '%');
              console.log(Math.round10(PIE2, -1).toFixed(2))
              chart.series[0].setData([["EXPATRIATES",Number(Math.round10(PIE2, -1).toFixed(2))],["OMANIS",Number(Math.round10(PIE1, -1).toFixed(2))]]);
              if (PIE2 <= 33.33) {
                  $('#Expatriates').removeClass('CGreen , CRed');
                  $('#Expatriates').addClass('CGreen');
                  CHcolor = '#00ad9b';
              }
              else {
                  $('#Expatriates').removeClass('CGreen , CRed');
                  $('#Expatriates').addClass('CRed');
                  CHcolor = '#BF1E2E';
              }
              //pieData = [{ value: PIE1, color: "#133c8b", label: "Expatriates" }, { value: PIE2, color: CHcolor, label: "bf1e2e" }];
              Highcharts.getOptions().plotOptions.pie.colors=['#f67f21', '#0f3173'];
              
              if(Sum.toString().length < 9){
                if(Sum.toString().length == 8){
                  Sum = ""+0+Sum
                }
                if(Sum.toString().length == 7){
                  Sum = ""+0+0+Sum
                }
              }
            
              var sumArray = Sum.split("");
             // console.log(Sum,sumArray);
              var x;
              /*for(x = 0;x<sumArray.length;x++){
                //console.log('#count'+x,$('#count'+x));
                $('#count'+x).html(sumArray[x]);
                if(x == sumArray.length-1){
                    
                    console.log(counterShow)
                    if(counterShow == 0){
              $('.Count').each(function () {
                var $this = $(this);
                setTimeout(function(){
                jQuery({ Counter: 0 }).animate({ Counter: $this.text() }, {
                  duration: 3000,
                  easing: 'swing',
                  step: function () {
                    $this.text(Math.ceil(this.Counter));
                  }
                 });
                 });
              },2000)
              counterShow = 1;
            }
             
                }
              }*/
                 if(counterShow == 0){
              setTimeout(function(){
                od.update(Sum)
              },1000)
              counterShow = 1;
            }
            else{
               od.update(Sum)
            }
              console.log(E,O)
              $('#TotalPopulation').text(Sum).prettynumber({ delimiter: ',' });
              $('#ExpatriatesN').text(E).prettynumber({ delimiter: ',' });
              $('#OmanisN').text(O).prettynumber({ delimiter: ',' });
              //alert($('#LData').text());
          } catch (e) {
              console.log(e.name + "#" + e.description + "#" + e.message)
          }
      }
      
      ////-------> Ossama
      function numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      
      function GetPopulatonData(selectedDate) {
          try {
              var result = [2];
              var myTableArray = [];
              $("table#PopulationDataSet tr").each(function () {
                  var arrayOfThisRow = [];
                  var tableData = $(this).find('td');
                  //console.log(tableData)
                  if (tableData.length > 0) {
                      tableData.each(function () { arrayOfThisRow.push($(this).text()); });
                      myTableArray.push(arrayOfThisRow);
                  }
              });
                 // console.log(myTableArray)
              var prevRow = myTableArray[0];
              var minRow = myTableArray[0];
              var maxRow = myTableArray[myTableArray.length - 1];
              //console.log(myTableArray)
      
              for (counter = 0; counter < myTableArray.length; counter++) {
                 console.log(myTableArray[counter])
                  var itemDate = new Date(myTableArray[counter][0]);
                  //console.log(itemDate)
                  console.log(selectedDate)
                  console.log(selectedDate.getTime(),itemDate.getTime())
                  if (selectedDate.getTime() == itemDate.getTime()) {
                      console.log('same')
                      result[0] = numberWithCommas(myTableArray[counter][1]);
                      result[1] = numberWithCommas(myTableArray[counter][2]);
                      return result;
                  }
      
                  prevRow = myTableArray[counter];
              }
      
              result[0] = null;
              result[1] = null;
              return result;
          }
          catch (ex) {
              //console.log(ex)
              result[0] = null;
              result[1] = null;
              return result;
          }
      }
      function GetPopulatonDataFirstLoad(selectedDate) {
          try {
              var result = [2];
              var myTableArray = [];
              $("table#PopulationDataSet tr").each(function () {
                  var arrayOfThisRow = [];
                  var tableData = $(this).find('td');
                  if (tableData.length > 0) {
                      tableData.each(function () { arrayOfThisRow.push($(this).text()); });
                      myTableArray.push(arrayOfThisRow);
                  }
              });
      
              var prevRow = myTableArray[0];
              var minRow = myTableArray[0];
              var maxRow = myTableArray[myTableArray.length - 1];
      
              for (counter = 0; counter < myTableArray.length; counter++) {
      
      
                  var itemDate = new Date(myTableArray[counter][0]);
                  if (selectedDate.getTime() < itemDate.getTime()) {
                      result[0] = numberWithCommas(prevRow[1]);
                      result[1] = numberWithCommas(prevRow[2]);
                      return result;
                  }
                  else if (selectedDate.getTime() == itemDate.getTime()) {
                      result[0] = numberWithCommas(myTableArray[counter][1]);
                      result[1] = numberWithCommas(myTableArray[counter][2]);
                      return result;
                  }
      
                  prevRow = myTableArray[counter];
              }
      
              result[0] = numberWithCommas(maxRow[1]);
              result[1] = numberWithCommas(maxRow[2]);
              return result;
          }
          catch (ex) {
              result[0] = null;
              result[1] = null;
              return result;
          }
      }
      function GetAllData() {
        function onsucess(data) {
            var date;
           //data = JSON.parse(data)
            $.each(data.d.results, function (key, val) {

                var id = val.ID;
                if (val.ID != undefined) {
                    var ExactDT = convertToServerTimeZone(val.ahPopulationDate);
                    ExactDT.setDate(ExactDT.getDate());
                    date = ExactDT.format("yyyy/MM/dd");

                    $('#populationData table').append("<tr><td>" + date + "</td><td>" + val.ahPopulationOmanis + "</td><td>" + val.ahPopulationExpatriates + "</td></tr>");
                    //Oma = numberWithCommas(val.ahPopulationOmanis);
                    //Exp = numberWithCommas(val.ahPopulationExpatriates);
                }
            });
            //    $('#PopulationBL').hover(function () { $('#s4-workspace').addClass('DisScroll') }, function () { $('#s4-workspace').removeClass('DisScroll') })
            //var PopulatonData = GetPopulatonDataFirstLoad(date);
            //Oma = PopulatonData[0];
            //Exp = PopulatonData[1];
            //  ActionClock(Oma, Exp);

        };
        function onerror() {

            $('#populationData table').html("<tr><td>01/01/2014</td><td>2289276</td><td>1788636</td></tr>");
        };
        $.ajax({
            //url: _spPageContextInfo.siteAbsoluteUrl + "/_api/lists/getbytitle('PopulationClock')/items/?$top=2000&$select=ID,ahPopulationDate,ahPopulationOmanis,ahPopulationExpatriates&$orderby=ahPopulationDate asc",
            url:urlTop2000,
            method: "GET",
            headers: {
                "accept": "application/json",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            headers: { "Accept": "application/json; odata=verbose" },   // content type sent to server
            success: onsucess,
            error: onerror  // When Service call fails
        });


    };
/*});*/