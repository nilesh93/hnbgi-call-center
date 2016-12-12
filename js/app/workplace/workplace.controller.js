(function(){

    'use strict';

    angular.module('coreApp')


        .controller('WorkPlaceController',WorkPlaceController);


    function WorkPlaceController($scope,$rootScope,$http,$state,RestfulAPI,DTOptionsBuilder,$timeout,CommonService){

        RestfulAPI.loginCheck();
        $rootScope.$broadcast('state-changed', { state:'WORKSPACE' });
        
         $timeout(function(){
            $rootScope.$broadcast('state-changed', { state:'WORKSPACE' });
        });
        $scope.positionsCenter = {
            latitude:7.8757327,
            longitude: 79.5789703,
            zoom: 7,
            fit:true
        };
        $scope.activeZone = 'OVERALL';

        $scope.accessorList = true;

        $scope.markers = [];

        $scope.viewAccessor = function(){

            $scope.accessorList = false;

        };

        $scope.viewList = function(){

            $scope.accessorList = true;

        };

        $scope.viewAss = function(obj){

            $scope.accessorList = false;

            var index =   $scope.markers.indexOf(obj);
            
            //$scope.markers[index].icon= 'img/map/accessor.png'


            var markerInfo = obj;

            $scope.assInfo = {
                title : markerInfo.title,
                id:markerInfo.id,
                icon:markerInfo.icon,
                vicinity : markerInfo.vicinity,
                assCode: markerInfo.item_data.userCode,
                contact:markerInfo.contact

            };

            var assCode = markerInfo.item_data.userCode;

            CommonService.getAssessorDetails(assCode).then(function(data){
                console.log("new Data",data.data._embedded);

                $scope.assessorJobList = data.data._embedded.assesorjob;
                console.log($scope.assessorJobList);

                $scope.assessorJobListLoad = false;
            });

        };


        $scope.assSelect = function(obj,event,markerInfo){

            $scope.accessorList = false;

            $scope.assessorJobList = [];
            console.log(obj);
            console.log(event);

            console.log("marker",markerInfo);
            $scope.assDefined = true;
            $scope.assessorJobListLoad = true;

            $scope.assInfo = {
                title : markerInfo.title,
                id:markerInfo.id,
                icon:markerInfo.icon,
                vicinity : markerInfo.vicinity,
                assCode: markerInfo.item_data.userCode,
                contact:markerInfo.contact

            };

            console.log( "ass",  $scope.assInfo);

            var assCode = markerInfo.item_data.userCode;

            CommonService.getAssessorDetails(assCode).then(function(data){
                console.log("new Data",data.data._embedded);

                $scope.assessorJobList = data.data._embedded.assesorjob;
                console.log($scope.assessorJobList);

                $scope.assessorJobListLoad = false;
            });

        };


        $http.get(RestfulAPI.list.AcessorList,RestfulAPI.basicConfig).then(function(data){

            console.log(data);
            var count = 0;
            $scope.acessorCount = data.data._embedded.giscordinate.length;
            data.data._embedded.giscordinate.forEach(function(item,index){


                $scope.markers.push({

                    latitude: item.latitude,
                    longitude: item.longtitude,
                    title: item.userName,
                    contact: item.contactNumber,
                    id : count,
                    icon: 'img/map/accessor.png',
                    item_data:item,
                    type : "accessor"
                });

                count++;
            });

        },function(err){
            console.log("error",err);
        });


        $scope.zone = function(type,lat,lang,zoom){

            $scope.activeZone = type;
            var z = parseFloat(zoom);

            console.log(z);

            var fit = false;
            if(type == 'OVERALL'){

                fit = true;
            }

            $scope.positionsCenter = {
                latitude:lat,
                longitude: lang,
                zoom: z,
                fit: fit
            };


        };

    }

})();