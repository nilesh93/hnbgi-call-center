(function(){

    'use strict';

    angular.module('coreApp')
        .controller('CoverNoteNonMotorController',CoverNoteNonMotorController)  
        .controller('CoverNoteController',CoverNoteController);





    function CoverNoteController($scope, $rootScope,$http,$state,$timeout,$document,DTOptionsBuilder,RestfulAPI,BroadCastServices,ngGPlacesAPI,PlacesService,$uibModal, $log,BootsrapService,$stateParams,$filter,CommonService,ngToast ){

        /*
    * Initialize variables
    */
        RestfulAPI.loginCheck();
        
        
        if($rootScope.userPermission.indexOf("COVERNOTE") == -1){
            
            console.log("not authorized");
            $state.go("workplace");
        }

        $rootScope.$broadcast('state-changed', { state:'COVERNOTE' });
        
       $timeout(function(){
            $rootScope.$broadcast('state-changed', { state:'COVERNOTE' });
        });


        var curDate = moment().format('YYYY-MM-DD');
        var curTime = moment().format('hh:mm:ss A');

        $scope.job = {};
        $scope.job.toDate = moment().format('YYYY-MM-DD');
        $scope.job.fromDate = moment().format('YYYY-MM-DD');
        $scope.saving = false;
        $scope.savingSuccess = false;
        $scope.job.callDate = curDate;
        $scope.job.callTime = curTime;
        $scope.job.dateOfAccident = moment().format('DD/MM/YYYY hh:mm:ss A');
        $scope.job.allocDate = moment().format('YYYY-MM-DD hh:mm:ss A');
        $scope.job.radius = 3000;

        $scope.job.assessors ={};


        $scope.assessorsList = [];
        $scope.intiResults =[];
        $scope.policeDefined = false;
        $scope.assDefined = false;

        $scope.loading = {};
        $scope.loading.policyShow = true;
        $scope.loading.debits = true;
        $scope.loading.credits = true;
        $scope.loading.reciepts = true;
        $scope.loading.claims = true;
        $scope.loading.sms = true;
        $scope.loading.clauses = true;
        $scope.loading.warranties = true;
        $scope.loading.intimations = true;


        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption( "autoWidth",false);

        $scope.autocompleteOptions = {
            componentRestrictions: 
            { country: 'lk' },
            types: ['geocode']
        };

        $scope.positionsCenter = {
            latitude: 40.1451,
            longitude: -99.6680
        };  
        $scope.markers = [];
        $scope.bounds = {};
        $scope.mapcallback = function(map){
            self.map = map;
        };
        $scope.mapLoad = false;


        $scope.policeSelect = function(obj,event,markerInfo){

            console.log(obj);
            console.log(event);

            $scope.policeDefined = true;

            $scope.policeInfo = {
                title : markerInfo.title,
                id:markerInfo.id,
                vicinity : markerInfo.vicinity,
                selected : markerInfo.templateParameter.selected

            };
        };


        $scope.assSelect = function(obj,event,markerInfo){

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
                selected : markerInfo.templateParameter.selected,
                contact : markerInfo.templateParameter.contact

            };

            var assCode = markerInfo.templateParameter.userCode;

            CommonService.getAssessorDetails(assCode).then(function(data){
                console.log("new Data",data.data._embedded);

                $scope.assessorJobList = data.data._embedded.assesorjob;
                console.log($scope.assessorJobList);

                $scope.assessorJobListLoad = false;
            });

        };


        function cacheFunctions(){


            //cached assesorList function
            if(!angular.isDefined($rootScope.assessorList)){
                CommonService.loadAssessors().then(function(data){

                    $scope.assessorsList = [];
                    data.data.content.forEach(function(item,index){
                        $scope.assessorsList.push({
                            name : item.assessorName,
                            contact : item.contactNo,
                            display : item.assessorName +" : " + item.contactNo,
                            userCode : item.assessorCode
                        });
                    });

                    $scope.job.assessors = $scope.assessorsList[0];
                });
            }else{
                console.log("loaded from cache");
                $scope.assessorsList = $rootScope.assessorList;
                $scope.job.assessors = $scope.assessorsList[0];
            }

            //loadintimationActions
            if(!angular.isDefined($rootScope.intimationActions)){

                CommonService.motorIntimationActions().then(function(data){
                    //$scope.intimationActions = data._embedded.motorintimationactions;
                });
            }else{

                console.log("loaded from cache");
                $scope.intimationActions = $rootScope.intimationActions;

            }

            //loadClaimDescriptions
            if(!angular.isDefined($rootScope.claimDescList)){

                CommonService.claimDesc().then(function(data){
                    //$scope.claimDescList = data._embedded.claimdescription;
                });
            }else{

                console.log("loaded from cache");
                $scope.claimDescList = $rootScope.claimDescList;

            }

            //loadMotorIntimationTypes
            if(!angular.isDefined($rootScope.intimationTypeList)){

                CommonService.intimatioTypes().then(function(data){
                    //$scope.intimationTypeList = data._embedded.motorintimationtypes;
                });
            }else{

                console.log("loaded from cache");
                $scope.intimationTypeList = $rootScope.intimationTypeList;

            }


        }



        $scope.showPolice = function(job){

            $scope.mapLoad = false;

            if(job.policeStation == '0'){

                $scope.policeDefined = false;

            }else{

                $scope.policeDefined = true;
            }

            if(angular.isDefined(job.nearestTown.geometry)){

                self.policeModalInstance  =  BootsrapService.modal({
                    url:'pages/jobs/job.policeModal.html',
                    scope: $scope
                });


                $scope.mapLoad = 'POLICE';    

            }
            else{


                swal("Accident Place not Defined Properly", "Please fill out the Nearest Town", "error");

            }


        }

        $scope.loadPoliceStations = function(job){

            $scope.mapLoad = false;  
            $scope.loadPoliceMarkers();

        };

        $scope.loadPoliceMarkers = function(){

            var job = $scope.job;

            if(angular.isDefined(job.nearestTown)){
            if(angular.isDefined(job.nearestTown.geometry)){



                var lat = job.nearestTown.geometry.location.lat();
                var lang = job.nearestTown.geometry.location.lng();
                var radius =  $scope.job.radius || 3000;   


                $scope.positionsCenter = {latitude: lat, longitude: lang };



                $scope.markers = [];
                $scope.markers.push({

                    latitude: lat,
                    longitude:lang,
                    title: "Accident Place",
                    id : 0,
                    icon : 'img/map/car-crash.png',
                    vicinity : job.nearestTown.formatted_address,
                    templateUrl : 'pages/jobs/job.infoWindow.html',
                    templateParameter : {
                        id:   0,
                        title: "Accident Place",
                        selected : false  
                    }

                });


                ngGPlacesAPI.nearbySearch({latitude:lat, longitude:lang, radius:radius, types:['police']}).then(
                    function(data){



                        console.log(data);
                        var count = 0;

                        data.forEach(function(item,index){



                            if(item.name.search('Police Station') > -1){

                                count++;
                                $scope.markers.push({

                                    latitude: item.geometry.location.lat(),
                                    longitude: item.geometry.location.lng(),
                                    title: item.name,
                                    id : count,
                                    icon: item.icon,
                                    vicinity : item.vicinity,
                                    //icon : 'img/map/police.png',
                                    templateUrl : 'pages/jobs/job.infoWindow.html',
                                    templateParameter : {
                                        id:  count,
                                        title: item.name,
                                        selected : false  
                                    }

                                });
                            }
                            else{
                                console.log("dumped",item.name);

                            }

                        });

                    });

            }

            }
        };

        $scope.cancel = function () {

            self.policeModalInstance.dismiss('cancel');

            $scope.mapLoad = false;

            console.log(self.policeModalInstance);     

        };


        $scope.selectPolice = function(id){

            console.log(id);
            console.log($scope.markers);


            $scope.job.policeStation = $scope.markers[id].title+"-"+$scope.markers[id].vicinity;
            $scope.markers[id].templateParameter.selected = true;

            $scope.policeInfo.selected = true;

            $scope.markers.forEach(function(item,index){

                if(index != id){
                    item.templateParameter.selected = false;

                }else{

                    item.templateParameter.selected = true;
                }
            });

            $scope.cancel();
        };

        $scope.selectAss = function(id){

            console.log(id);
            console.log($scope.markersAsc);


            var ass = $filter('filter')($scope.assessorsList, function (d) {return d.userCode === $scope.markersAsc[id].templateParameter.userCode;})[0];
            $scope.job.assessors = ass;


            console.log("ass",$scope.markersAsc[id].templateParameter.userCode);
            $scope.markersAsc[id].templateParameter.selected = true;

            $scope.markersAsc.forEach(function(item,index){

                if(index != id){
                    item.templateParameter.selected = false;

                }else{

                    item.templateParameter.selected = true;
                }
            });

            $scope.assInfo.selected = true;
            $scope.cancel();



        };


        $scope.assesorMap = function(job){


            if(angular.isDefined(job.nearestTown.geometry)){



                $scope.loadAcessors(job);

                self.policeModalInstance  =  BootsrapService.modal({
                    url:'pages/jobs/job.acessorModal.html',
                    scope: $scope
                });

                $scope.mapLoad ="ASS";

            }else{

                swal( "Accident Place not Defined Properly", "Please fill out the Nearest Town", "error");

            }
        };


        $scope.loadAcessors = function(job){



            var lat = job.nearestTown.geometry.location.lat();
            var lang = job.nearestTown.geometry.location.lng();



            $scope.positionsCenter = {latitude: lat, longitude: lang };

            $scope.markersAsc = [];
            $scope.markersAsc.push({

                latitude: lat,
                longitude:lang,
                title: "Accident Place",
                id : 0,
                icon : 'img/map/car-crash.png',
                vicinity : job.nearestTown.formatted_address,

                templateParameter : {
                    id:   0,
                    title: "Accident Place",
                    selected : false  
                }

            });



            $http.get(RestfulAPI.list.AcessorList,RestfulAPI.basicConfig).then(function(data){

                var count = 1;

                console.log(data.data._embedded.giscordinate);

                $scope.acessorCount = data.data._embedded.giscordinate.length;
                data.data._embedded.giscordinate.forEach(function(item,index){


                    $scope.markersAsc.push({

                        latitude: item.latitude,
                        longitude: item.longtitude,
                        title: item.userName,
                        contact: item.contactNumber,
                        id : count,
                        icon: 'img/map/accessor.png',
                        item_data:item,
                        type : "accessor",
                        templateParameter : {
                            id:   count,
                            title: item.userName,
                            selected : false ,
                            contact  : item.contactNumber,
                            display : item.userName +" - "+item.contactNumber,
                            userCode : item.userCode
                        }
                    });

                    count++;
                });

            },function(err){
                console.log("error",err);
            });



        };

        $scope.intimation= function(formData){

            console.log("started");
            var job = $scope.job;


            // $scope.job.policyNum = $scope.activePolicyGeneral.policyNo;
            var placeOfAcc = job.accident_place;
            var nearestTown = job.nearestTown;

            if(angular.isDefined(job.accident_place.formatted_address)){
                placeOfAcc = job.accident_place.formatted_address;
                console.log("defined");

            }else{
                console.log(job.accident_place);
                console.log("undefined");
            }

            var lat;
            var lng;
            if(angular.isDefined(job.nearestTown.formatted_address)){
                nearestTown = job.nearestTown.formatted_address;
                console.log("defined");

                lat = job.nearestTown.geometry.location.lat();
                lng = job.nearestTown.geometry.location.lng();

            }else{
                console.log(nearestTown);
                console.log("undefined");
                lat = "-";
                lng = "-";
            }


            var arrenge;

            if(job.site == 'Yes'){

                arrenge = 'Arranged';
            }else{

                arrenge = 'NotArranged';

            }

            var thirdParty =job.thirdParty


            console.log(job);
            var ass = job.assessors;

            if(!angular.isDefined(ass.display)){

                console.log("undefined");

                ass = {
                    display:"NONE",
                    userCode  :"NONE"
                }
            }


            if(job.descriptionCode == "0"){

                var description = job.description;
            }else{
                var description = "";

            }

            var overview;

            if(job.site == "Yes"){
                overview = "No";
            }
            else{
                overview = "Yes";
            }


            if(job.vipFlag == null || job.vipFlag == "null"){

                job.vipFlag = "NO";

            }
            //issue offsite description cannot save NO DB structure
            var data =  {
                "callTime": job.callTime,
                "policyNo":job.policyNum||"COVERNOTE",
                "vehicleNo":job.vehicleNum,
                "toAddress":"",
                "ccAddress":"",
                "insuredName":job.insuredName,
                "fromDate":job.fromDate,
                "toDate":job.toDate,
                "contactNo":job.polHoldMobile,
                "actionTake":job.actionTaken,
                "assessorName":ass.display,
                "placeOfAccident":placeOfAcc,
                "description":description,
                "comment":job.comments,
                "vehicleMake":job.vehicleMake||"",
                "vehicleModel":job.vehicleModel||"",
                "userId":$rootScope.userId, 
                "sendDate":"",
                "dateOfAccident":job.dateOfAccident,
                "intimateDate":moment().format('YY-MM-DD'),
                "intimateTime":curTime,
                "completeDate":"",
                "completeTime":"",
                "lastModifiedDate":"",
                "lastModifiedUser":"",
                "callDate":job.callDate,
                "agentCode":job.agentCode||"",
                "onSite":job.site,
                "overView":overview,
                "insuranceCompany":job.thirdpartyInsurance||"",
                "callerName":job.callerName,
                "moiType":job.status,
                "detailOfDamage":job.damages,
                "detailOfDriver":"",
                "policeStation":job.policeStation,
                "thirdPartyDetails":thirdParty||"",
                "policeCode":"-",
                "policeName":job.policeStation,
                "mobileNo":job.polHoldMobile,
                "actualCostRepair":0,
                "placeCode":"-",
                "placeName":nearestTown,
                "amountOne":0,
                "amountTwo":0,
                "dateOne":null,
                "dateTwo":null,
                "vehicleCategory":job.vehicleCatagory||"",
                "relationTypeOfDriver":job.relation,
                "relationTypeOfDriverDeatils":job.relationDesc||"",
                "insuredNic":job.NIC||"",
                "engineNo":job.engineNo || "",
                "chassiNo":job.chassiNo || "",
                "insuredAddress":job.insuredAddress||"",
                "vipFlag":"NO",
                "causeCode":"-",  
                "causeDetails":"", 
                "lease":"NO", 
                "driverName":job.driverName,
                "licenseNumber":job.dlNo||"",
                "licenseCategory":"0",
                "descCode":job.descriptionCode,
                "assessorCode":ass.userCode,
                "allocateDate":job.allocDate,
                "assignDate":job.allocDate,
                "jobCompleteDate":"",
                "arrangeType":arrenge,
                "assessorComment":"-",
                "assessorConfirmDate":"-",
                "systemDate":moment().format('DD/MM/YYYY'),
                "assuranceCode":job.assuranceCode||"",
                "sumInsured":job.sumInsured||0,
                "policyExcessAmount":0,
                "vehicleUsage":job.vehicleUsage||"",
                "lattitude" : lat,
                "longitude" : lng,
                "promiseTime" : (job.promise + (parseInt(job.hours)*60))

            }; 


            var val =  RestfulAPI.validateObj(data);
            console.log(val);
            if(val=="true"){
                $scope.dataTemp = data;
                console.log("saveData",data);


                var toast = CommonService.saving();
                $scope.saving = true; 
                $scope.savingSuccess =false;
                console.log(RestfulAPI.config); $http.post(RestfulAPI.list.MotorIntimationSave,data,RestfulAPI.config).success(function(data){



                    console.log("success",data);

                    $scope.saving = false;
                    //$scope.savingSuccess = true;

                    $scope.moi = data.moiNo;

                    intimationSearch();
                    // $scope.job = RestfulAPI.resetObj($scope.job);

                    
                    formData.reset();

                    //PostPolicy(data.policyNo);
                    CommonService.saved(toast,"MOI No : "+data.moiNo);
                    //swal("success","","success");
                    //$scope.savedIntimation = data.moiNo;

                }).error(function(data){

                    //console.log(toastr);
                    //toastr.clear();
                    $scope.saving = false;
                    $scope.savingSuccess = true;
                    CommonService.error(toast);
                    console.log("error", data);
                });
            }
            else{
                swal(val + "not set","Please Fill all the required fields","error");
            }


        };

        $scope.intimationEdit = function(param,vno){

            $state.go("intimation.view",{intimationID:param,vehicleNo:vno});

        };

        $scope.lateIntimationSet = function(){

            var start = moment(new Date()); //todays date
            var end = moment($scope.job.dateOfAccident); // another date
            var duration = moment.duration(start.diff(end));

            var days = duration.asDays();


            if(days <= 0){

                $scope.job.status = 'NORMAL';


            }else{

                $scope.job.status = 'LATE-INTIMATIONS';
            }

        };



        cacheFunctions();


        function intimationSearch(){   
            var searchModal = {
                policyNo: 'COVERNOTE',
                size:'10000',
                moiType:'COVER NOTE'

            };

            $scope.loading.intimations = true;
            $scope.searchResult = [];
            var dataString = RestfulAPI.setUrl(searchModal);


            $scope.searching = true;
            $http.get(RestfulAPI.list.IntimationSearch+dataString,RestfulAPI.basicConfig).success(function(data){
                $scope.searchResult = data.content;
                console.log(data);
                $scope.searching = false;
                $scope.loading.intimations = false;
            });

        }

        intimationSearch();



    }

    function CoverNoteNonMotorController($scope, $rootScope,$http,$state,$timeout,$document,DTOptionsBuilder,RestfulAPI,BroadCastServices,ngGPlacesAPI,PlacesService,$uibModal, $log,BootsrapService,$stateParams,$filter,CommonService,ngToast ){

         RestfulAPI.loginCheck();
        $scope.autocompleteOptions = {
            componentRestrictions: 
            { country: 'lk' },
            types: ['geocode']
        };
        $scope.job = {};



        $scope.job.callDate = moment().format('YYYY-MM-DD hh:mm:ss A');
        $scope.job.lossDate = moment().format('YYYY-MM-DD hh:mm:ss A');
        $scope.job.allocDate = moment().format('YYYY-MM-DD hh:mm:ss A');
        $scope.job.assessors ={};

        $scope.mapcallback = function(map){
            self.map = map;
        };

        $scope.newFormStatus = false;

        $scope.mapLoad = false;

        $scope.loading = {};
        $scope.loading.policyShow = true;
        $scope.loading.debits = true;
        $scope.loading.credits = true;
        $scope.loading.reciepts = true;
        $scope.loading.claims = true;
        $scope.loading.sms = true;
        $scope.loading.clauses = true;
        $scope.loading.warranties = true;
        $scope.loading.intimations = true;

        $scope.saving = false;
        //init Functions





        $scope.assesorMap = function(job){

            if(angular.isDefined(job.nearestTown.geometry)){



                $scope.loadAcessors(job);

                self.policeModalInstance  =  BootsrapService.modal({
                    url:'pages/jobs/job.acessorModal.html',
                    scope: $scope
                });

                $scope.mapLoad ="ASS";

            }else{

                swal( "Nearest Town not Defined Properly", "Please fill out the Place of Loss", "error");

            }
        };

        $scope.loadAcessors = function(job){

            var lat = job.nearestTown.geometry.location.lat();
            var lang = job.nearestTown.geometry.location.lng();

            $scope.positionsCenter = {latitude: lat, longitude: lang };

            $scope.markersAsc = [];
            $scope.markersAsc.push({

                latitude: lat,
                longitude:lang,
                title: "Accident Place",
                id : 0,
                icon : 'img/map/car-crash.png',
                vicinity : job.nearestTown.formatted_address,

                templateParameter : {
                    id:   0,
                    title: "Accident Place",
                    selected : false  
                }

            });



            $http.get(RestfulAPI.list.AcessorList,RestfulAPI.basicConfig).then(function(data){




                var count = 1;
                $scope.acessorCount = data.data._embedded.giscordinate.length;
                data.data._embedded.giscordinate.forEach(function(item,index){


                    $scope.markersAsc.push({

                        latitude: item.latitude,
                        longitude: item.longtitude,
                        title: item.userName,
                        contact: item.contactNumber,
                        id : count,
                        icon: 'img/map/accessor.png',
                        item_data:item,
                        type : "accessor",
                        templateParameter : {
                            id:   count,
                            title: item.userName,
                            selected : false ,
                            contact  : item.contactNumber,
                            display : item.userName +" - "+item.contactNumber,
                            userCode : item.userCode
                        }
                    });

                    count++;
                });

            },function(err){
                console.log("error",err);
            });

        };

        $scope.selectAss = function(id){

            console.log(id);
            console.log($scope.markersAsc);



            var ass = $filter('filter')($scope.assessorsList, function (d) {return d.userCode === $scope.markersAsc[id].templateParameter.userCode;})[0];
            $scope.job.assessors = ass;

            $scope.markersAsc[id].templateParameter.selected = true;

            $scope.markersAsc.forEach(function(item,index){

                if(index != id){
                    item.templateParameter.selected = false;

                }else{

                    item.templateParameter.selected = true;
                }
            });

            $scope.assInfo.selected = true;

            $scope.cancel();



        };
        $scope.assSelect = function(obj,event,markerInfo){

            console.log(obj);
            console.log(event);

            $scope.assessorJobListLoad = true;

            var assCode = markerInfo.templateParameter.userCode;

            CommonService.getAssessorDetails(assCode).then(function(data){
                console.log("new Data",data.data._embedded);

                $scope.assessorJobList = data.data._embedded.assesorjob;
                console.log($scope.assessorJobList);

                $scope.assessorJobListLoad = false;

            });


            $scope.assDefined = true;

            $scope.assInfo = {
                title : markerInfo.title,
                id:markerInfo.id,
                icon:markerInfo.icon,
                vicinity : markerInfo.vicinity,
                selected : markerInfo.templateParameter.selected,
                contact : markerInfo.templateParameter.contact

            };
        };

        $scope.cancel = function () {

            self.policeModalInstance.dismiss('cancel');

            $scope.mapLoad = false;

            console.log(self.policeModalInstance);     

        };

        $scope.intimate = function(formData){

            var job = $scope.job;

            if(job.vipFlag == null || job.vipFlag == "null"){

                job.vipFlag = "NO";

            }

            //var ass = $filter('filter')($scope.assessorsList, function (d) {return d.userCode === job.assessors;})[0]; 

            var ass = job.assessors;

            if(!angular.isDefined(ass.display)){
                console.log("undefined");

                ass = {
                    display   :"NONE",
                    userCode  :"NONE"
                }
            }



            var lossPlace  = job.lossPlace.formatted_address || job.lossPlace;
            var data = {

                "docNo":"",
                "docDate":moment().format("YYYY-MM-DD"),
                "docTime":moment().toISOString(),
                "userName":$rootScope.userId,
                "emailAddress":"",
                "intimateDate":moment().toISOString(),
                "policyTypeCode":"",
                "policyTypeName":"",
                "policyNo":"COVERNOTE",
                "callerName":job.callerName,
                "callerTelNo":job.callerPhone,
                "insuredName":job.insuredName,
                "insuredTelNo":job.mobileNo || "",
                "lossDate":moment(job.lossDate).toISOString(),
                "lossType":job.lossType,
                "damage":job.damages,
                "lossPlace":lossPlace,
                "assessorName":ass.display,
                "allocateDate":moment().format("YYYY-MM-DD"),
                "completeDate":job.completeDate || "",//moment().format("YYYY-MM-DD")
                "commentOne":job.comment1||"",
                "commentTwo":job.comment2||"",
                "cancel":"NO",//issue
                "branchName":"",//issue
                "estimateLoss":job.lossValue||0,
                "funeralExpenses":job.funeral||0,
                "petName":"",//issue
                "petAge":0,//issue
                "petRegNo":"",//issue
                "petColor":"",//issue
                "petGender":"",//issue
                "saveFlag":"SAVE",//issue
                "assessorCode":ass.userCode,
                "systemDate":moment().format("YYYY/MM/DD"),
                "branchCode":"HDO"

            };
            $scope.newFormStatus = false;

            var val =  RestfulAPI.validateObj(data);
            console.log(val);
            if(val=="true"){


                var toast = CommonService.saving();
                $scope.dataTemp = data;
                console.log("saveData",data);

                $scope.saving = true;
                console.log(RestfulAPI.config); $http.post(RestfulAPI.list.NonMotorIntimationSave,data,RestfulAPI.config).success(function(data){

                    console.log("success",data);
                    CommonService.saved(toast,"DOC No : "+data.docNo); 
                    intimationSearch(); 
                    $scope.saving = false;
                    $scope.newFormStatus = true;
                    
                    formData.reset();
                  
                    return false;

                }).error(function(err){

                    CommonService.error(toast);

                    $scope.saving = false;

                });
            }
            else{

                $scope.saving = false;
                swal(val + "not set","Please Fill all the required fields","error");

            }
        };

        $scope.newForm = function(){

            console.log("confirmed");
           // $scope.job = RestfulAPI.resetObj($scope.job);
 
            $scope.job.callDate = moment().format('YYYY-MM-DD hh:mm:ss A');
            $scope.job.lossDate = moment().format('YYYY-MM-DD hh:mm:ss A');
            $scope.job.allocDate = moment().format('YYYY-MM-DD hh:mm:ss A');
            $scope.job.assessors ={};

            $scope.job.assessors = $scope.assessorsList[0];

        };
        $scope.intimationView= function(param){

            console.log("clicked",param);
            $state.go("intimation.nonMotorView",{intimationID:param.trim()});

        };



        function cacheFunctions(){


            //cached assesorList function
            if(!angular.isDefined($rootScope.assessorList)){
                CommonService.loadAssessors().then(function(data){

                    $scope.assessorsList = [];
                    data.data.content.forEach(function(item,index){
                        $scope.assessorsList.push({
                            name : item.assessorName,
                            contact : item.contactNo,
                            display : item.assessorName +" : " + item.contactNo,
                            userCode : item.assessorCode
                        });
                    });

                    $scope.job.assessors = $scope.assessorsList[0];
                });
            }else{
                console.log("loaded from cache");
                $scope.assessorsList = $rootScope.assessorList;
                $scope.job.assessors = $scope.assessorsList[0];
            }

            //loadintimationActions
            if(!angular.isDefined($rootScope.intimationActions)){

                CommonService.motorIntimationActions().then(function(data){
                    //$scope.intimationActions = data._embedded.motorintimationactions;
                });
            }else{

                console.log("loaded from cache");
                $scope.intimationActions = $rootScope.intimationActions;

            }

            //loadClaimDescriptions
            if(!angular.isDefined($rootScope.claimDescList)){

                CommonService.claimDesc().then(function(data){
                    //$scope.claimDescList = data._embedded.claimdescription;
                });
            }else{

                console.log("loaded from cache");
                $scope.claimDescList = $rootScope.claimDescList;

            }

            //loadMotorIntimationTypes
            if(!angular.isDefined($rootScope.intimationTypeList)){

                CommonService.intimatioTypes().then(function(data){
                    //$scope.intimationTypeList = data._embedded.motorintimationtypes;
                });
            }else{

                console.log("loaded from cache");
                $scope.intimationTypeList = $rootScope.intimationTypeList;

            }


        }

        cacheFunctions();
        $scope.resetTime = function(){

            $scope.job.completeDate = "";

        };


        function intimationSearch(){   
            var searchModal = {
                policyNo: 'COVERNOTE',
                size:'10000',


            };

            $scope.loading.intimations = true;

            $scope.searchResult = [];
            var dataString = RestfulAPI.setUrl(searchModal);


            $scope.searching = true;
            $http.get(RestfulAPI.list.IntimationNonSearch+dataString,RestfulAPI.basicConfig).success(function(data){
                $scope.searchResult = data.content;
                console.log("pending",data);
                $scope.searching = false;

                $scope.loading.intimations = false;
            });

        }

        intimationSearch();

    }




})();