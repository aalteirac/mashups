var qlik;
var scp;
var qvobjects={};
var config = {
	host: "192.168.15.107",
	prefix: "/",
	port : window.location.port,
	isSecure : window.location.protocol === "https:"
};

require.config( {
	waitSeconds:0,
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port: "") + config.prefix + "resources"
} );

function pager($scope){
	scp=$scope;
	$scope.selections=false;
	
	$scope.hideSel=function(){
		fixSel();
		$scope.selections=!($scope.selections);
	};
	$scope.back=function(detail){
		animateHide($('#'+detail),$('#sum'));
	};
	$scope.showDetails=function(detail){
		animateHide($('#sum'),$('#'+detail));
	};
}
function excludeBS(){
	$("#template").find('*').each(function(){
		if(!$(this).hasClass('qvobject'))
			$(this).addClass('qv');
	});
}
function fixSel(){
	$('.list').height('0');
	$('.buttons-end').hide();
}

function animateShow(toShow) {
    var $elem = toShow;
	toShow.show();
	qlik.resize();
    $({deg: 90}).animate({deg: 0}, {
        duration: 500,
        step: function(now) {
            $elem.css({
                transform: 'rotateY(' + now + 'deg)'
            });
			if(now==0)qlik.resize();
        }
    });
}
function animateHide(toHide,toShow) {
    var $elem = toHide;
    $({deg: 0}).animate({deg: 90}, {
        duration: 500,
        step: function(now) {
            $elem.css({
                transform: 'rotateY(' + now + 'deg)'
            });
			if(now==90){
				toHide.hide();
				animateShow(toShow)
			}
        }
    });
}
function init(){
	require( ["jquery", "jqueryui"], function ( $) {
		excludeBS();
		$(window).scroll(function() {
			$("#CurrentSelections" ).addClass("hideSel");
			clearTimeout($.data(this, 'scrollTimer'));
			$.data(this, 'scrollTimer', setTimeout(function() {
				$("#CurrentSelections" ).removeClass("hideSel");
			}, 2000));
		});	
		$("#main").show();
		require( ["js/qlikview"], function ( qlikview ){
			qlik=qlikview;
			qlikview.getAppList(function(reply) {
				$.each(reply, function(key, value) {
					if (value.qDocName === "Executive Dashboard" || value.qDocName === "Executive Dashboard.qvf"){
						var app = qlikview.openApp(value.qDocName, config);
						$( ".qvobject" ).each( function () {
							var qvid = $( this ).data( "qvid" );
							app.getObject( this, qvid ).then( function ( object ) {
								qvobjects[qvid] = object;
							} );
						} );
						qlikview.setOnError( function ( error ) {
							alert( error.message );
						} );
					}	
				});
			},config);	
		});
	} );
}

window.onload = function(){
   init();
};



