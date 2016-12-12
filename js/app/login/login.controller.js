(function(){

    'use strict';

    angular.module('coreApp')


        .controller('LoginController',LoginController);

    function LoginController($scope, $rootScope,$http,$state,$timeout,$document,DTOptionsBuilder,RestfulAPI,BroadCastServices,ngGPlacesAPI,PlacesService,$uibModal, $log,BootsrapService,$stateParams,$filter,CommonService,ngToast , $base64){



        var self  = this;

        $rootScope.$broadcast('login-called', { any: {} });


        self.login = {};


        $rootScope.userId = "";
        $rootScope.userpw = "";
        $rootScope.loginInd = 0;
        $rootScope.auth = "";


        $scope.login = function(){

            var un = self.login.un.toUpperCase();
            var pw = self.login.pw.toUpperCase();

            //$rootScope.userId = "ANURANGA";
            // $rootScope.auth = $base64.encode('ANURANGA:SRILANKAN');
            var auth =    $base64.encode(un+':'+pw);
            console.log("auth",auth);

            var config = {
                headers:  {
                    'Authorization':" Basic "+auth,
                    'ignoreAuthModule': true

                }
            };
            
            console.log("login");

            $http.get(RestfulAPI.list.UserRoles+"?userId="+un,config).success(function(data){

                console.log(data);
                $rootScope.userId = un;
                $rootScope.userpw = pw;
                $rootScope.loginInd = 1;
                $rootScope.auth = auth;
                $rootScope.userRole = data.userCatagory;

                $rootScope.userPermission = $rootScope.roles[data.userCatagory]() || $rootScope.roles['NM_USER']();
                console.log("userRole",data.userCatagory);
                console.log("userPermissions",$rootScope.userPermission);

                $timeout(function(){
                    $state.go($rootScope.requestState,$rootScope.requestParams);
                });

            }).error(function(err){

                swal("Sorry! Invalid Login","","error");

            });

        }

    }

})();