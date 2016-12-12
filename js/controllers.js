angular.module('coreApp').controller('navController',function($scope,$state){

    'use strict';

    var self = this;


    /**
      * Listen to broadcast
      */
    $scope.$on('state-changed', function(event, data) {

        self.navStatus = data.state;

    });

    
    $scope.$on('login-called', function(event, args) {

    var anyThing = args.any;
    // do what you want to do
    });
    
    self.changeNav = function(status){

        self.navStatus = status;

    };
    
    $scope.logoutFunct = function(){
        
        console.log("clicked");
        swal({   title: "Logout?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Logout",   closeOnConfirm: true }, function(){   $state.go('login'); });
      
    }

});