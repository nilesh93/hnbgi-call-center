 angular.module('coreApp')
    .service('BroadCastServices',function($http, $rootScope){

    var self = this;

    self.stateChangeAction = function(state){

        $rootScope.$broadcast('state-changed', { state: state });

    };

})
    .service('PlacesService',function(ngGPlacesAPI){

    var self = this;

    self.getNearby = function(placeObj){



        return ngGPlacesAPI.nearbySearch(placeObj).then(
            function(data){
                return data;
            });
    };

    self.generateURL = function(obj){


        var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+obj.lat+","+obj.lng+"&radius="+obj.radius+"&type="+obj.type+"&key=AIzaSyAxCbXVxRICVSNWa_zbEr_XrmMW0cQQz9w";

        return url;

    }

})
    .service('BootsrapService',function($uibModal){


    var self = this;

    self.modal = function(modalObj){

        var modalInstance =  $uibModal.open({
            animation: true,
            templateUrl: modalObj.url,
            controller: modalObj.controller || '',
            size: modalObj.size || 'lg',
            scope:modalObj.scope || '',
            resolve: modalObj.resolve || {}
            /*{
                items: function (){
                    return $scope.items;
                } 
            } */
        });

        return  modalInstance;

    }



})
    .service('CommonService',function($http,RestfulAPI,$q,$rootScope,ngToast, $mdToast){

    this.saving=function(){

        var toast =  ngToast.create({
            className: 'info  zoomInRight',
            content: ' <strong>Saving... Please Wait. </strong>',
            timeout  :100000,
            animation: 'slide'
        });



        /* var pinTo = "bottom right";
        var toast = $mdToast.simple()
        .textContent('Saving...')

        .highlightAction(true)
        .theme("md-primary")
        .capsule(false)
      // Accent is used by default, this just demonstrates the usage.
        .position(pinTo);

        $mdToast.show(toast);
        */



        /*  $mdToast.show({
        template: '<md-toast> <span flex> Saving...Please Wait </span>  </md-toast>',
        hideDelay: 60000,
        position: 'bottom right'
        });
        */
        return toast;

    };

    this.saved=function(t,msg){
        ngToast.dismiss(t);
        var toast =  ngToast.create({
            className: 'success  zoomInRight',
            content: ' <strong>Saved Successfully! '+msg+' </strong>',
            timeout  :10000,
            dismissButton : true,
            animation: 'slide'
        });


        /* $mdToast.hide();

        $mdToast.show({
        template: '<md-toast> <span flex> Success! </span>  </md-toast>',
        hideDelay: 6000,
        position: 'bottom right'
        });

        /*var pinTo = "bottom right";
        var toast = $mdToast.simple()
        .textContent('Success!')
        .action('CLOSE')
        .highlightAction(true)
      // Accent is used by default, this just demonstrates the usage.
        .position(pinTo);

        $mdToast.show(toast).then(function(response) {

        });
        */
        return toast;

    };

    this.error=function(t){

        ngToast.dismiss(t);
        var toast =  ngToast.create({
            className: 'danger  zoomInRight',
            content: ' <strong>Oops! Something went wrong.</strong> Please Call Asela (IT) 0772984626',
            timeout  :100000,
            dismissButton : true,
            animation: 'slide'
        });

        /* var pinTo = "bottom right";
        var toast = $mdToast.simple()
        .textContent('Something went wrong. Please try again')
        .action('CLOSE')
        .highlightAction(true)
      // Accent is used by default, this just demonstrates the usage.
        .position(pinTo);

        $mdToast.show(toast).then(function(response) {
           $mdToast.hide();
        });
        */

        /* 
        $mdToast.hide();

        $mdToast.show({
        template: '<md-toast> <span flex> Error! Please try again. </span>  </md-toast>',
        hideDelay: 60000,
        position: 'bottom right'
        });
        */
        return toast;


    };

    this.resolveAss = function(assName){

        var assessorCode = assName.replace(/\d/g, "").trim();
        var assessorCode = assessorCode.replace(/-/g, "").trim();
        var assessorCode = assessorCode.replace(/;/g, "").trim();

        if(assessorCode == ""){
            assessorCode = "-";
        }

        return assessorCode;

    }


    ///Assessor Load
    this.loadAssessors = function(){
        return $http.get(RestfulAPI.list.AllAssessors+"?size=300",RestfulAPI.basicConfig).then(function(data){

            $rootScope.assessorList = []; 

            data.data.content.forEach(function(item,index){
                $rootScope.assessorList.push({
                    name : item.assessorName,
                    contact : item.contactNo,
                    display : item.assessorName +" - " + item.contactNo,
                    userCode : item.assessorCode
                });
            });

            return  data;

        });

    };

    this.motorIntimationActions = function(){
        return $http.get(RestfulAPI.list.MotorIntimationActions,RestfulAPI.basicConfig).success(function(data){
            $rootScope.intimationActions = data._embedded.motorintimationactions;

            return data._embedded.motorintimationactions;
        });
    };

    this.claimDesc = function(){
        return $http.get(RestfulAPI.list.ClaimDesc+"?size=200",RestfulAPI.basicConfig).success(function(data){
            $rootScope.claimDescList = data._embedded.claimdescription;
            return data._embedded.claimdescription;
        });

    };

    this.intimatioTypes = function(){

        return $http.get(RestfulAPI.list.IntimationTypes,RestfulAPI.basicConfig).success(function(data){
            $rootScope.intimationTypeList = data._embedded.motorintimationtypes;
            return data._embedded.motorintimationtypes;
        });

    };

    this.inspectionTypes = function(){

        return $http.get(RestfulAPI.list.InspectionTypes,RestfulAPI.basicConfig).success(function(data){


            $rootScope.inspectionTypeList = data.content;

            $rootScope.inspectionTypeList.forEach(function(item,index){

                $rootScope.inspectionTypeList[index].inspectionCode =  $rootScope.inspectionTypeList[index].inspectionCode.trim();

            });
            return data.content;
        });

    };

    this.engActionTypes = function(){

        return $http.get(RestfulAPI.list.EngActionTypes+"?size=100",RestfulAPI.basicConfig).success(function(data){

            $rootScope.engActionTypeList= data._embedded.motorengineeringactions;
            $rootScope.engActionTypeList.forEach(function(item,index){

                $rootScope.engActionTypeList[index].inspectionCode =  $rootScope.engActionTypeList[index].inspectionCode.trim();
                $rootScope.engActionTypeList[index].actionCode =  $rootScope.engActionTypeList[index].actionCode.trim();

            });

            return data._embedded.motorengineeringactions;
        });

    };

    this.motorEngInformTo = function(){

        return $http.get(RestfulAPI.list.MotorEngInformTo,RestfulAPI.basicConfig).success(function(data){
            $rootScope.motorEngInformTo = data._embedded.motorengineeringinformto;

            $rootScope.motorEngInformTo.forEach(function(item,index){

                $rootScope.motorEngInformTo[index].informCode =  $rootScope.motorEngInformTo[index].informCode.trim();
            });
            return data._embedded.motorengineeringinformto;
        });

    };

    this.motorEngInformWay = function(){

        return $http.get(RestfulAPI.list.MotorEngInformWay,RestfulAPI.basicConfig).success(function(data){
            $rootScope.motorEngInformWay = data._embedded.motorengineeringinformway;

            $rootScope.motorEngInformWay.forEach(function(item,index){

                $rootScope.motorEngInformWay[index].informCode =  $rootScope.motorEngInformWay[index].informCode.trim();
            });
            return data._embedded.motorengineeringinformto;
        });

    };


    this.branchList = function(){

        return $http.get(RestfulAPI.list.BranchList+"?size=100",RestfulAPI.basicConfig).success(function(data){
            $rootScope.branchList = data._embedded.branchdetails;

            return data._embedded.branchdetails;

        }).error(function(err){


            console.log(err);
        });

    };



    this.getAssessorDetails = function(assCode){
        
        
        return $http.get(RestfulAPI.list.getAssessorDetails+encodeURI("?assCode="+assCode),RestfulAPI.basicConfig).success(function(data){
            
            console.log("this worked", data);
            return data;
            
        });
        
    };
});
