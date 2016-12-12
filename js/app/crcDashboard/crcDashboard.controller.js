(function(){

    'use strict';

    angular.module('coreApp')
        .controller('crcDashMainController',crcDashMainController)
        .controller('crcDashActivityController',crcDashActivityController)
        .controller('crcDashController',crcDashController);


    function crcDashMainController($scope, $rootScope,$http,$state,$timeout,$document,DTOptionsBuilder,RestfulAPI,BroadCastServices,ngGPlacesAPI,PlacesService,$uibModal, $log,BootsrapService,$stateParams,$filter,CommonService,ngToast,$mdDialog,$mdMedia){

        if($rootScope.userPermission.indexOf("CRCDASH") == -1){
            console.log("not authorized");
            $state.go("workplace");
        }

        RestfulAPI.loginCheck();
        $scope.motorIntimations = 0;
        $scope.nonmotorIntimations = 0;
        $scope.waitingTickets = 0;
        $scope.callEST = 0;
        $scope.summaryTotal = 0;

        function init(){ 
            var date = moment().format("YYYY/MM/DD");


            $http.get(RestfulAPI.list.crcMotorIntimations+"?callDate="+date,RestfulAPI.basicConfig).success(function(data){

                console.log( "Motor intimations",data);
                $scope.motorIntimations = data.totalElements;
            }).error(function(err){


            });

            $http.get(RestfulAPI.list.crcMotorIntimations+"?callDate="+date+"&actionTake=2",RestfulAPI.basicConfig).success(function(data){

                console.log( "call Estimate",data);
                $scope.callEST = data.totalElements;
            }).error(function(err){


            });



            $http.get(RestfulAPI.list.crcNonMotorIntimations+"?docDate="+date,RestfulAPI.basicConfig).success(function(data){

                console.log( "Non Motor intimations",data);
                $scope.nonmotorIntimations = data.totalElements;
            }).error(function(err){


            });

            $http.get(RestfulAPI.list.crcJobSummary,RestfulAPI.basicConfig).success(function(data){

                console.log("summary",data);
                $scope.summary = data._embedded.assessorjobassignsummary;

                $scope.summary.map(function(obj,index){
                    $scope.summaryTotal += parseInt(obj.nop);

                });

            }).error(function(err){



            });
        }

        init();


        $rootScope.$broadcast('state-changed', { state:'CRC-DASHBOARD' });

        $timeout(function(){
            $rootScope.$broadcast('state-changed', { state:'CRC-DASHBOARD' });
        });

    }

    function crcDashController($scope, $rootScope,$http,$state,$timeout,$document,DTOptionsBuilder,RestfulAPI,BroadCastServices,ngGPlacesAPI,PlacesService,$uibModal, $log,BootsrapService,$stateParams,$filter,CommonService,ngToast,$mdDialog,$mdMedia){

        $scope.report = {};
        $scope.searching = false;
        
        $scope.report.to = moment().format("YYYY-MM-DD");
        $scope.report.from = moment().format("YYYY-MM-DD");
        
        $scope.search = function(){

            $scope.searching  = true;
            $http.get(RestfulAPI.list.DashboardJobSummaryInfo+"?status=AG&assignAfter="+$scope.report.from+"&assignBefore="+$scope.report.to,RestfulAPI.basicConfig).success(function(data){
                console.log(data);
                $scope.searching = false;
                $scope.intimations = data.content;
            }).error(function(err){
                $scope.searching = false;
            });
        };
        
        
        $scope.search();
        
        $scope.rejectIntimation = function(job,id){
            
            
            var data = {
                jobNumber : job,
                id:id
            };
            
               swal({   
                title: "Reject?",   
                text: "",   
                type: "warning",   
                showCancelButton: true,   
                confirmButtonColor: "#DD6B55",   
                confirmButtonText: "Yes, Reject!",   
                closeOnConfirm: false }, 
                 function(){ 
                canc();
            });




            function canc(){

                $http.post(RestfulAPI.list.DashboardJobReject,data,RestfulAPI.config).success(function(data){
                    swal("Rejected!", "", "success");
                    $scope.search();

                }).error(function(err){



                    console.log(err);
                });

            }
            
            
        };
        
    }

    function crcDashActivityController($scope, $rootScope,$http,$state,$timeout,$document,DTOptionsBuilder,RestfulAPI,BroadCastServices,ngGPlacesAPI,PlacesService,$uibModal, $log,BootsrapService,$stateParams,$filter,CommonService,ngToast,$mdDialog,$mdMedia){

        RestfulAPI.loginCheck();
        $http.get(RestfulAPI.list.crcAgentActivity,RestfulAPI.basicConfig).success(function(data){

            console.log("activity",data);

            $scope.activityList = data._embedded.callagentjobassignsummary;
        }).error(function(err){



        });


    }



})();