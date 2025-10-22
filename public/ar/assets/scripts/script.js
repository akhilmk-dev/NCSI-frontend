
$( document ).ready(function function_name(argument) {
  

/*$('#publisher-slide').slick({
   // dots: false,
  infinite: true,
  speed: 500,
  //fade: true,
  //cssEase: 'linear',
  //arrows:true

   centerMode: true,
      centerPadding: '60px',
      //slidesToShow: 3,
      prevArrow: $('.prev'),
      nextArrow: $('.next')

  });*/
  //  var swiper = new Swiper('.swiper-container', {
  //     navigation: {
  //       nextEl: '.swiper-button-next',
  //       prevEl: '.swiper-button-prev',
  //     },
  //   });

  
  var omanisCount = 2638005;
  $('#omanies-count').html(omanisCount.toLocaleString());
  var expatriatesCount = 2034603;
  $('#expatriates-count').html(expatriatesCount.toLocaleString())
  //console.log(number.toLocaleString())

  /*$('#eventCollapse1').click(function(){
    $('#collapseShow1').css({display:'block'})
  })*/ 

       
})

$(function() { 

    /*events*/
    var shownGroup,collapsID;
    var isGroupShown = function(group){
      return shownGroup === group;
    }
    
     $(document).on('click','#eventCollapse', function (e) {
      collapsID = $(this).data("value");
     console.log("Your values are :"+ $(this).data("value"));

    //function openCollapse(id){
      
       if (isGroupShown(collapsID)) {
            shownGroup = null;
        } else {
            shownGroup = collapsID;
        }
        console.log(collapsID,isGroupShown(collapsID));
        if(isGroupShown(collapsID)){
          $('.collapse-show').css({display:'none'})
          setTimeout(function(){
            $('#collapseShow'+collapsID).css({display:'block'})
            //$('#collapseShow'+collapsID).css({transition:'all 1s'})
          })
          
        }
        else{
          $('#collapseShow'+collapsID).css({display:'none'})
        }
  })

 })
