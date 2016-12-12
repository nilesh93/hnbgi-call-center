(function () {

    'use strict';

    angular.module('coreApp')


        .controller('IntimationController', IntimationController)
        .controller('IntimationViewController', IntimationViewController)
        .controller('IntimationNonMotorViewController', IntimationNonMotorViewController);


    function IntimationController($scope, $rootScope, $http, $state, RestfulAPI, DTOptionsBuilder, $timeout) {

        /*
         * Broadcast
         */

        if ($rootScope.userPermission.indexOf("INSPECTIONS") == -1) {
            console.log("not authorized");
            $state.go("workplace");
        }

        RestfulAPI.loginCheck();
        $scope.autocompleteOptions = {
            componentRestrictions:
            { country: 'lk' },
            types: ['geocode']
        };
        var self = this;

        self.intiForm = {};
        $rootScope.$broadcast('state-changed', { state: 'INTIMATIONS' });


        $timeout(function () {
            $rootScope.$broadcast('state-changed', { state: 'INTIMATIONS' });
        });

        $scope.searching = false;

        /*
         * Initialize variables
         */
        $scope.searchType = 'MOTOR';
        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption("autoWidth", false);
        //$scope.dtOptions = DTOptionsBuilder.newOptions().withOption( "",false);
        //$scope.dtOptions = DTOptionsBuilder.newOptions().withOption( "init",initDropzone);



        /*
         * Functions
         */

        $scope.changeType = function (type) {
            $scope.searchType = type;

        };


        function intimationSearch() {


            var polnum = self.intiForm.policy_num || "";
            var name = self.intiForm.cus_name || "";
            var intinum = self.intiForm.intimation_num || "";
            var vnum = self.intiForm.v_num || "";
            var contact_num = self.intiForm.contact_num || "";


            var searchModal = {
                policyNo: polnum,
                moiNo: intinum,
                vehicleNo: vnum,
                insuredName: name,
                contactNo: contact_num
            };

            var nonMotorModel = {
                policyNo: polnum,
                docNo: intinum,
                insuredName: name,
                insuredTelNo: contact_num
            }

            $scope.searchResult = [];
            $scope.searchResultNon = [];

            var dataString = RestfulAPI.setUrl(searchModal);
            var dataStringNon = RestfulAPI.setUrl(nonMotorModel);

            $scope.searching = true;
            $http.get(RestfulAPI.list.IntimationSearch + dataString, RestfulAPI.basicConfig).success(function (data) {
                $scope.searchResult = data.content;
                console.log(data);


                $scope.searching = false;
            });

            if (vnum == "") {
                $http.get(RestfulAPI.list.IntimationNonSearch + dataStringNon, RestfulAPI.basicConfig).success(function (data) {
                    $scope.searchResultNon = data.content;
                });
            }
        }


        $scope.search = function () {
            $state.go("intimation.search");
            $scope.searchType = 'MOTOR';
            intimationSearch();
        }



        $scope.intimationEdit = function (id, vno) {

            $state.go("intimation.view", { intimationID: id, vehicleNo: vno });

        };

        $scope.intimationNonMotorEdit = function (param) {


            console.log("clicked", param);
            $state.go("intimation.nonMotorView", { intimationID: param.trim() });


        };


    }


    function IntimationViewController($scope, $rootScope, $http, $state, RestfulAPI, DTOptionsBuilder, $stateParams, $log, BootsrapService, CommonService, $filter) {

        //$stateParams.intimationID;
        RestfulAPI.loginCheck();
        $scope.Math = Math;

        $scope.autocompleteOptions = {
            componentRestrictions:
            { country: 'lk' },
            types: ['geocode']
        };
        $scope.pending = true;
        $scope.pending2 = true;
        $scope.images = [];
        $scope.images = [];
        $scope.mapcallback = function (map) {
            self.map = map;
        };

        $scope.loading = {};
        $scope.loading.general = true;
        $scope.loading.steps = true;
        $scope.loading.images = true;
        $scope.loading.doc = true;
        $scope.covernote = {};

        $scope.saving = false;

        $scope.remapStatus = false;

        $scope.mapType = "INT";

        $scope.mapLoad = false;
        var self = this;

        self.docList = [];

        $scope.converNoteStatus = false;

        self.autocompleteOptions = {
            componentRestrictions:
            { country: 'lk' },
            types: ['geocode']
        };

        self.dzAddedFile = function (file) {
            $log.log(file);
        };

        self.dzError = function (file, errorMessage) {
            $log.log(errorMessage);
        };

        console.log(RestfulAPI.config);
        self.dropzoneConfig = {
            parallelUploads: 3,
            maxFileSize: 30,
            autoProcessQueue: false,
            init: initDropzone,
            headers: {
                'Authorization': $rootScope.auth
            }
        };

        self.myDropZone;
        function initDropzone() {

            var submitButton = document.querySelector("#submit-all")
            self.myDropzone = this; // closure

            // You might want to show the submit button only when 
            // files are dropped here:
            this.on("addedfile", function () {
                // Show submit button here and/or inform user to click it.
            });

        };


        self.upload = function () {

            console.log(self.myDropzone);
            self.myDropzone.on('sending', function (file, xhr, formData) {
                formData.append('moiNo', self.intimationMain.moiNo);
                formData.append('policyNo', self.intimationMain.policyNo);
                formData.append('sysUser', $rootScope.userId);
                formData.append('inspectionCode', self.doc.inspectionCode);
            });

            self.myDropzone.processQueue(); // Tell Dropzone to process all queued files.


        };


        self.uploadURL = RestfulAPI.list.MotorDocUpload;

        self.job = {};
        self.eng = {};

        /*
         * 
         * Get Intimation Details
         * 
         *
         */



        self.getIntimationDetails = function () {

            $http.get(RestfulAPI.list.IntimationSearch + "?moiNo=" + $stateParams.intimationID, RestfulAPI.basicConfig).success(function (data) {
                self.intimationMain = data.content[0];
                self.job = data.content[0];
                self.job.hours = Math.floor(self.intimationMain.promiseTime / 60);
                self.job.promise = (self.intimationMain.promiseTime % 60);
                console.log(self.intimationMain);
                self.postIntimationDetails(self.intimationMain.policyNo);
                self.eng.moiNo = self.intimationMain.moiNo;
                self.eng.vehicleNo = self.intimationMain.vehicleNo;
                self.eng.policyNo = self.intimationMain.policyNo;
                //console.log(data.content[$stateParams.intimationID]);
                //self.postImageList(self.intimationMain.policyNo);




                getPolicyDetails(self.intimationMain.policyNo);
                //self.eng.assessorCode = $scope.assessorsList[0];
                $scope.loading.general = false;
                console.log("init", data);
                $scope.pending2 = false;






                // 

                getAssCode();

            });
            $scope.imgCount = 0;

            //RestfulAPI.list.GetImages+$stateParams.intimationID+"&"+$stateParams.vehicleNo
            $http.get(RestfulAPI.list.GetImages + $stateParams.intimationID + "&" + $stateParams.vehicleNo, RestfulAPI.basicConfig).success(function (data) {

                console.log("success", data);

            }).error(function () {

                console.log("no onnline images found");
            });

            $http.get(RestfulAPI.list.GetImagesFromVehilcle + "?vehicleNo=" + $stateParams.vehicleNo, RestfulAPI.basicConfig).success(function (data) {

                $scope.imgCount = 0;
                $scope.showItem = "NONE23";
                $scope.imageList = data._embedded.accidents;

                $scope.images = [];

                $scope.imageList.forEach(function (item, key) {
                    var moi = item.moiNo;

                    $http.get(item._links.accidentImages.href, RestfulAPI.basicConfig).success(function (data) {

                        var img = [];

                        data._embedded.accidentImageses.forEach(function (item, key) {
                            $scope.imgCount++;
                            img.push({
                                title: item.accidentId,
                                src: item.imageThumbnailUrl,
                                href: item.imageFullPath,
                                class: 'box'
                            });

                        });

                        $scope.images.push({
                            moi: moi,
                            images: img
                        });
                        console.log("img123", $scope.images);

                    }).error(function () {

                        console.log("No accident Images");

                    });

                });


                /* 
                 * 
                 *  
                 *       count++;
                       $scope.images.push({
   
                           src:item.thumbnail,
                           href:item.image,
                           title:"Image : "+count,
                           class: 'box'
   
                       }); 
                 *  $scope.images = [];
                   var count = 0;
          
   
           */

                $scope.loading.images = false;
                console.log("images", data);
            }).error(function (data) {


                console.log("No images available");

                $scope.loading.images = false;
            });


            self.getMotorSteps();

            cacheFunctions();
            getDocuments();
        };


        function getPolicyDetails(polid) {

            console.log(RestfulAPI.list.searchPolicy + "?policyNo=" + polid);

            $http.get(RestfulAPI.list.searchPolicy + "?policyNo=" + polid, RestfulAPI.basicConfig).success(function (data) {

                console.log("policy details ", data);
                $scope.activePolicyGeneral = data.content[0];
                self.intimationMain.assuranceCode = (data.content.length == 0) ? "" : data.content[0].assuranceCode;
                self.intimationMain.policyExcessAmount = (data.content.length == 0) ? "" : data.content[0].compulsaryExcess;



                $http.get(RestfulAPI.list.AssessorInfo + "?docNo=" + self.intimationMain.moiNo, RestfulAPI.basicConfig).success(function (data) {

                    console.log("additional Info", data);

                    self.intimationMain.allocateDate = (data._embedded.assessorassigmjobtemp.length == 0) ? "" : data._embedded.assessorassigmjobtemp[0].allocateDate.trim();
                    self.intimationMain.arrangeType = (data._embedded.assessorassigmjobtemp.length == 0) ? "" : data._embedded.assessorassigmjobtemp[0].arrangeType.trim();
                    self.intimationMain.assessorComment = (data._embedded.assessorassigmjobtemp.length == 0) ? "" : data._embedded.assessorassigmjobtemp[0].assessorComment.trim();
                    self.intimationMain.assignDate = (data._embedded.assessorassigmjobtemp.length == 0) ? "" : data._embedded.assessorassigmjobtemp[0].assignDate.trim();
                    self.intimationMain.completedDate = (data._embedded.assessorassigmjobtemp.length == 0) ? "" : data._embedded.assessorassigmjobtemp[0].completedDate.trim();

                    self.intimationMain.sumInsured = (self.intimationMain.sumInsured == null) ? 0 : self.intimationMain.sumInsured;

                    self.intimationMain.assessorConfirmDate = (self.intimationMain.assessorConfirmDate == null) ? "" : self.intimationMain.assessorConfirmDate;
                    self.intimationMain.ccAddress = (self.intimationMain.ccAddress == null) ? "" : self.intimationMain.ccAddress;
                    self.intimationMain.jobCompleteDate = (self.intimationMain.jobCompleteDate == null) ? "" : self.intimationMain.jobCompleteDate;
                    self.intimationMain.lattitude = (self.intimationMain.lattitude == null) ? "" : self.intimationMain.lattitude;
                    self.intimationMain.longitude = (self.intimationMain.longitude == null) ? "" : self.intimationMain.longitude;
                    self.intimationMain.policyExcessAmount = (self.intimationMain.policyExcessAmount == null) ? "" : self.intimationMain.policyExcessAmount;
                    self.intimationMain.sendDate = (self.intimationMain.sendDate == null) ? "" : self.intimationMain.sendDate;
                    self.intimationMain.toAddress = (self.intimationMain.toAddress == null) ? "" : self.intimationMain.toAddress;
                    self.intimationMain.vehicleUsage = (self.intimationMain.vehicleUsage == null) ? "" : self.intimationMain.vehicleUsage;

                    self.intimationMain.systemDate = (self.intimationMain.systemDate == null) ? moment().format("DD/MM/YYYY") : self.intimationMain.systemDate;

                    // self.intimationMain.vehicleUsage =        

                    self.job = self.intimationMain;

                    var checkArr = self.intimationMain.policyNo.split(" ");
                    var stat = self.intimationMain.moiType;

                    if (checkArr[0] == "COVERNOTE" && stat == 'COVER NOTE') {

                        $scope.converNoteStatus = true;
                        $scope.remapStatus = false;

                    } else if (stat == 'COVER NOTE') {

                        $scope.remapStatus = true;
                    } else {

                        $scope.converNoteStatus = false;

                    }


                    console.log("covernote", checkArr, stat);

                });

            });
        }

        $scope.policyVerified = true;
        $scope.checkPolicy = function () {

            var polid = $scope.covernote.policy || "";

            $http.get(RestfulAPI.list.searchPolicy + "?policyNo=" + polid, RestfulAPI.basicConfig).success(function (data) {

                console.log(data);
                if (data.content.length == 1) {

                    swal("Policy Verified!", "", "success");
                    $scope.policyVerified = false;
                    return true;

                } else {

                    swal("Could not find Policy", "", "error");
                    $scope.policyVerified = true;
                    return false;
                }

            });
        };


        $scope.convert = function () {

            var polid = $scope.covernote.policy || "";

            $http.get(RestfulAPI.list.searchPolicy + "?policyNo=" + polid, RestfulAPI.basicConfig).success(function (data) {

                //console.log("data123",data);
                //console.log("data1233",self.job);
                var toast = CommonService.saving();


                if (data.content.length == 1) {
                    var polData = data.content[0];



                    $scope.policyVerified = false;
                    self.job.policyNo = $scope.covernote.policy;

                    var obj = {
                        moiNo: self.job.moiNo,
                        policyNo: polData.policyNo,
                        assessorName: self.job.assessorName,
                        assessorCode: self.job.assessorCode,
                        userId: $rootScope.userId,
                        promiseTime: self.job.promiseTime,
                        actionTake: self.job.actionTake
                    };
                    console.log("obj", obj);
                    $http.post(RestfulAPI.list.UpdatecovernoteData, obj, RestfulAPI.config).success(function (data) {

                        CommonService.saved(toast, "");

                        $scope.converNoteStatus = false;
                        $scope.remapStatus = true;

                        self.getIntimationDetails();
                    }).error(function (data) {
                        CommonService.error(toast, "");

                    });
                    return true;

                } else {

                    swal("Could not find Policy", "", "error");
                    $scope.policyVerified = true;
                    return false;
                }

            });






        };




        self.getMotorSteps = function () {

            $http.get(RestfulAPI.list.MotorEngSteps + "?size=50&moiNo=" + $stateParams.intimationID, RestfulAPI.basicConfig).success(function (data) {

                $scope.loading.steps = false;
                self.motorStepsList = data.content;
                console.log("steps", self.motorStepsList);

            });

        };

        self.getIntimationDetails();

        function cacheFunctions() {


            //cached assesorList function
            if (!angular.isDefined($rootScope.assessorList)) {
                CommonService.loadAssessors().then(function (data) {

                    var count = 0;
                    $scope.assessorsList = [];
                    data.data.content.forEach(function (item, index) {
                        $scope.assessorsList.push({
                            name: item.assessorName,
                            contact: item.contactNo,
                            display: item.assessorName + " : " + item.contactNo,
                            userCode: item.assessorCode

                        });

                        count++;
                        if (data.data.content.length == count) {
                            $scope.pending = false;
                            getAssCode();
                        }
                    });

                });


            } else {
                console.log("loaded from cache");
                $scope.assessorsList = $rootScope.assessorList;
                self.eng.assessorCode = $scope.assessorsList[0];
                getAssCode();
                $scope.pending = false;
            }

            //loadintimationActions
            if (!angular.isDefined($rootScope.intimationActions)) {

                CommonService.motorIntimationActions().then(function (data) {
                    //$scope.intimationActions = data._embedded.motorintimationactions;
                });
            } else {

                console.log("loaded from cache");
                $scope.intimationActions = $rootScope.intimationActions;

            }

            //loadClaimDescriptions
            if (!angular.isDefined($rootScope.claimDescList)) {

                CommonService.claimDesc().then(function (data) {
                    //$scope.claimDescList = data._embedded.claimdescription;
                });
            } else {

                console.log("loaded from cache");
                $scope.claimDescList = $rootScope.claimDescList;

            }

            //loadMotorIntimationTypes
            if (!angular.isDefined($rootScope.intimationTypeList)) {

                CommonService.intimatioTypes().then(function (data) {
                    //$scope.intimationTypeList = data._embedded.motorintimationtypes;
                });
            } else {

                console.log("loaded from cache");
                $scope.intimationTypeList = $rootScope.intimationTypeList;

            }

            //loadEnginsepectiontypes 
            if (!angular.isDefined($rootScope.inspectionTypeList)) {

                CommonService.inspectionTypes().then(function (data) {
                    //$scope.inspectionTypeList = data.content;
                });
            } else {

                console.log("loaded from cache");
                $scope.inspectionTypeList = $rootScope.inspectionTypeList;

            }

            if (!angular.isDefined($rootScope.engActionTypeList)) {

                CommonService.engActionTypes().then(function (data) {
                    //$scope.engActionTypeList = data.content;
                });
            } else {

                console.log("loaded from cache");
                $scope.engActionTypeList = $rootScope.engActionTypeList;

            }

            if (!angular.isDefined($rootScope.motorEngInformTo)) {

                CommonService.motorEngInformTo().then(function (data) {
                    //$scope.motorEngInformTo = data.content;
                });
            } else {

                console.log("loaded from cache");
                $scope.motorEngInformTo = $rootScope.motorEngInformTo;

            }

            if (!angular.isDefined($rootScope.motorEngInformWay)) {

                CommonService.motorEngInformWay().then(function (data) {
                    //$scope.motorEngInformWay = data.content;
                });
            } else {

                console.log("loaded from cache");
                $scope.motorEngInformWay = $rootScope.motorEngInformWay;

            }


        }

        function getAssCode() {


            if ($scope.pending == false && $scope.pending2 == false) {

                if (self.job.assessorCode == null) {
                    var assessorCode = CommonService.resolveAss(self.intimationMain.assessorName);

                    console.log("obj", $filter('filter')($scope.assessorsList, function (d) { return d.name === assessorCode; })[0]);

                    self.job.assessors = $filter('filter')($scope.assessorsList, function (d) { return d.name === assessorCode; })[0];

                    self.job.assessors = self.job.assessors || $scope.assessorsList[0];

                } else {

                    self.job.assessors = $filter('filter')($scope.assessorsList, function (d) { return d.userCode === self.job.assessorCode; })[0];

                    self.job.assessors = self.job.assessors || $scope.assessorsList[0];

                }

            }

        }


        function getDocuments() {

            $http.get(RestfulAPI.list.IntimationDocs + "?moiNo=" + $stateParams.intimationID, RestfulAPI.basicConfig).success(function (data) {

                console.log("doc", data);

                $scope.loading.doc = false;
                self.docList = data.content;

            }).error(function () {

                $scope.loading.doc = false;
                console.log("doc error");
            });
        }


        self.postIntimationDetails = function (param) {


            /*   $http.get(RestfulAPI.list.MotorEngDocs+"?policyNo="+param,RestfulAPI.basicConfig).success(function(data){

                self.docs = data._embedded.motorEngineeringDocumentses;
                console.log("docs",data);
            });
            */

        };
        self.postImageList = function (param) {


        };



        $scope.assesorMap = function (job, type) {
            $scope.mapType = type;
            $scope.loadAcessors(job);

            console.log($scope.mapType);


            if ($scope.mapType == 'ENG') {

                console.log(job);
                if (angular.isDefined(job.nearestTown.geometry)) {

                    self.policeModalInstance = BootsrapService.modal({
                        url: 'pages/jobs/job.acessorModal.html',
                        scope: $scope
                    });
                } else {

                    swal("Nearest Town Not Set", "", "error");
                    return false;
                }



            } else {

                self.policeModalInstance = BootsrapService.modal({
                    url: 'pages/jobs/job.acessorModal.html',
                    scope: $scope
                });
            }



            $scope.mapLoad = "ASS";


        };

        $scope.cancel = function () {

            self.policeModalInstance.dismiss('cancel');

            $scope.mapLoad = false;

            console.log(self.policeModalInstance);

        };


        $scope.assSelect = function (obj, event, markerInfo) {

            console.log(obj);
            console.log(event);

            $scope.assDefined = true;

            $scope.assInfo = {
                title: markerInfo.title,
                id: markerInfo.id,
                icon: markerInfo.icon,
                vicinity: markerInfo.vicinity,
                selected: markerInfo.templateParameter.selected,
                contact: markerInfo.templateParameter.contact
            };
        };

        $scope.loadAcessors = function (job) {



            var lat = job.lattitude;
            var lang = job.longitude;

            console.log($scope.mapType);
            if ($scope.mapType == 'ENG') {

                console.log(job);
                if (angular.isDefined(job.nearestTown.geometry)) {



                    lat = job.nearestTown.geometry.location.lat();
                    lang = job.nearestTown.geometry.location.lng();
                } else {

                    swal("Nearest Town Not Set", "", "error");
                    return false;
                }



            }




            $scope.markersAsc = [];
            if (lat != null && lang != null) {
                $scope.positionsCenter = { latitude: lat, longitude: lang };

                $scope.markersAsc.push({

                    latitude: lat,
                    longitude: lang,
                    title: "Accident Place",
                    id: 0,
                    icon: 'img/map/car-crash.png',
                    vicinity: job.placeOfAccident,
                    templateParameter: {
                        id: 0,
                        title: "Accident Place",
                        selected: false
                    }

                });

            } else {


                $scope.positionsCenter = { latitude: 8.144990990097247, longitude: 80.40740810517579 };


            }




            $http.get(RestfulAPI.list.AcessorList, RestfulAPI.basicConfig).then(function (data) {

                $scope.assessorsList = [];

                if (lat != null && lang != null) {
                    var count = 1;

                } else {
                    var count = 0;

                }
                $scope.acessorCount = data.data._embedded.giscordinate.length;
                data.data._embedded.giscordinate.forEach(function (item, index) {



                    $scope.assessorsList.push({
                        name: item.userName,
                        contact: item.contactNumber,
                        display: item.userName + " - " + item.contactNumber,
                        userCode: item.userCode
                    });

                    $scope.markersAsc.push({
                        latitude: item.latitude,
                        longitude: item.longtitude,
                        title: item.userName,
                        contact: item.contactNumber,
                        id: count,
                        icon: 'img/map/accessor.png',
                        item_data: item,
                        type: "accessor",
                        templateParameter: {
                            id: count,
                            title: item.userName,
                            selected: false,
                            contact: item.contactNumber,
                            display: item.userName + " - " + item.contactNumber,
                            userCode: item.userCode
                        }
                    });

                    count++;
                });

            }, function (err) {
                console.log("error", err);
            });

        };

        $scope.selectAss = function (id) {

            //iv.eng.assessorCode

            if ($scope.mapType == 'INT') {
                console.log(id);
                console.log($scope.markersAsc);

                self.job.assessors = $filter('filter')($scope.assessorsList, function (d) { return d.userCode === $scope.markersAsc[id].templateParameter.userCode; })[0];

                self.job.assessorCode = $scope.markersAsc[id].templateParameter.userCode;


                console.log("ass", $scope.markersAsc[id].templateParameter.userCode);
                $scope.markersAsc[id].templateParameter.selected = true;

                $scope.markersAsc.forEach(function (item, index) {

                    if (index != id) {
                        item.templateParameter.selected = false;

                    } else {

                        item.templateParameter.selected = true;
                    }
                });

                $scope.assInfo.selected = true;

                $scope.cancel();
            } else {

                console.log(id);
                console.log($scope.markersAsc);

                self.eng.assessorCode = $filter('filter')($scope.assessorsList, function (d) { return d.userCode === $scope.markersAsc[id].templateParameter.userCode; })[0];

                //self.job.assessorCode =  $scope.markersAsc[id].templateParameter.userCode;


                console.log("ass", $scope.markersAsc[id].templateParameter.userCode);
                $scope.markersAsc[id].templateParameter.selected = true;

                $scope.markersAsc.forEach(function (item, index) {

                    if (index != id) {
                        item.templateParameter.selected = false;

                    } else {

                        item.templateParameter.selected = true;
                    }
                });

                $scope.assInfo.selected = true;

                $scope.cancel();


            }


        };

        self.updateIntimation = function () {

            $scope.saving = true;
            $scope.showItem = 'NONE';

            self.job.mobileNo = self.job.mobileNo || self.job.contactNo;
            self.job.placeName = self.job.placeName || "";


            var data = self.job;




            var toast = CommonService.saving();


            console.log(self.job.assessors.userCode);

            data.assessorCode = self.job.assessors.userCode || "NONE";
            data.assessorName = self.job.assessors.display || "NONE";
            data.causeDetails = data.causeDetails || "";
            data.driverName = data.driverName || "";
            data.licenseNumber = data.licenseNumber || "";



            data.promiseTime = ((self.job.hours * 60) + self.job.promise);
            data.saveFlag = "UPDATE";
            $http.post(RestfulAPI.list.UpdateIntimation, data, RestfulAPI.config).success(function (data) {
                $scope.saving = false;

                //swal("success","","success");$sc
                $scope.showItem = "NONE";

                CommonService.saved(toast, "");

            }).error(function (err) {

                $scope.saving = false;
                CommonService.error(toast);

            });


        };


        /**
         * Engineering
         */

        self.engSave = function () {

            console.log("started");
            var eng = self.eng;

            var ass = eng.assessorCode;

            if (!angular.isDefined(ass)) {
                ass = "NONE";

            }

            //eng.assessorCode
            var email1 = eng.email1 || "";
            var email2 = eng.email2 || "";
            var email3 = eng.email3 || "";
            var data = {

                "moiNo": eng.moiNo,
                "policyNo": eng.policyNo,
                "vehicleNo": eng.vehicleNo,
                "inspectionCode": eng.inspectionCode,
                "actionCode": eng.action,
                "personCode": ass.userCode,
                "comment": eng.comments || "",
                "actionDate": moment().format("YYYY-MM-DD"),
                "sysUser": $rootScope.userId,
                "systemDate": moment().format("YYYY-MM-DD"),
                "systemTime": moment().toISOString(),
                "eMail": email1 + "," + email2 + "," + email3,
                "dateOne": moment().format("YYYY-MM-DD"),
                "dateTwo": moment().format("YYYY-MM-DD"),
                "dateThree": moment().format("YYYY-MM-DD"),
                "amountOne": 0.0,
                "amountTwo": 0.0,
                "amountThree": 0.0,
                "textOne": eng.location,
                "textTwo": eng.InformTo,
                "textThree": eng.InformWay,
                "systemDateS": moment().format("YYYY/MM/DD")
            };

            var toast = CommonService.saving();
            $http.post(RestfulAPI.list.MotorSaveEng, data, RestfulAPI.config).success(function (data) {
                self.getMotorSteps();
                console.log(data);

                CommonService.saved(toast, "");

            }).error(function (err) {

                console.log("err", err);
                CommonService.error(toast, "");

            });

        };

        $scope.remappolicy = function () {


            $scope.converNoteStatus = !$scope.converNoteStatus;

        };


    }

    function IntimationNonMotorViewController($scope, $rootScope, $http, $state, RestfulAPI, DTOptionsBuilder, $stateParams, $log, BootsrapService, CommonService, $filter) {
        RestfulAPI.loginCheck();

        $scope.converNoteStatus = false;
        $scope.autocompleteOptions = {
            componentRestrictions:
            { country: 'lk' },
            types: ['geocode']
        };

        $scope.remapStatus = false;
        $scope.saving = false;

        var self = this;

        self.pending = true;
        self.pending2 = true;

        $scope.policyVerified = true;
        self.update = false;

        $scope.changeScope = function (item) {

            $scope.showItem = item;
        };
        $scope.showItem = "NONE";
        self.getIntimationDetails = function () {

            $http.get(RestfulAPI.list.IntimationNonSearch + "?docNo=" + $stateParams.intimationID, RestfulAPI.basicConfig).success(function (data) {
                self.intimationMain = data.content[0];
                self.job = data.content[0];
                self.pending2 = false;
                getPolicy(self.intimationMain.policyNo);

                //  getAssCode();


                var checkArr = self.intimationMain.policyNo.split(" ");


                if (checkArr[0] == "COVERNOTE") {

                    $scope.converNoteStatus = true;
                    $scope.remapStatus = false;
                    console.log("this is a covernote");

                } else {

                    $scope.converNoteStatus = false;

                }


                console.log("covernote", checkArr, stat);

                console.log(self.intimationMain);
            });


            cacheFunctions();

        };

        $scope.covernote = {};
        function getPolicy(polno) {


            $http.get(RestfulAPI.list.searchNonPolicy + "?policyNo=" + polno, RestfulAPI.basicConfig).success(function (data) {
                console.log(data);
                $scope.activePolicyGeneral = data.content[0];
            }).error(function () {

            });
        }


        $scope.checkPolicy = function () {

            var polid = $scope.covernote.policy || "";

            $http.get(RestfulAPI.list.searchNonPolicy + "?policyNo=" + polid, RestfulAPI.basicConfig).success(function (data) {

                console.log(data);
                if (data.content.length == 1) {

                    swal("Policy Verified!", "", "success");
                    $scope.policyVerified = false;
                    return true;

                } else {

                    swal("Could not find Policy", "", "error");
                    $scope.policyVerified = true;
                    return false;
                }

            });
        };


        $scope.convert = function () {

            var polid = $scope.covernote.policy || "";

            $http.get(RestfulAPI.list.searchNonPolicy + "?policyNo=" + polid, RestfulAPI.basicConfig).success(function (data) {

                //console.log("data123",data);
                //console.log("data1233",self.job);
                var toast = CommonService.saving();


                if (data.content.length == 1) {
                    var polData = data.content[0];



                    $scope.policyVerified = false;
                    self.job.policyNo = $scope.covernote.policy;

                    var obj = {
                        docNo: self.job.docNo,
                        policyNo: polData.policyNo,
                        userName: $rootScope.userId

                    };
                    console.log("obj", obj);
                    $http.post(RestfulAPI.list.UpdatecovernoteDataNonMotor, obj, RestfulAPI.config).success(function (data) {

                        CommonService.saved(toast, "");

                        $scope.converNoteStatus = false;
                        $scope.remapStatus = true;

                        self.getIntimationDetails();
                    }).error(function (data) {
                        CommonService.error(toast, "");

                    });
                    return true;

                } else {

                    swal("Could not find Policy", "", "error");
                    $scope.policyVerified = true;
                    return false;
                }

            });






        };

        function getAssCode() {

            if (self.pending == false && self.pending2 == false) {



                var assessorCode = CommonService.resolveAss(self.intimationMain.assessorName);

                console.log("obj", $filter('filter')($scope.assessorsList, function (d) { return d.userCode === assessorCode; })[0]);

            }

        }

        self.getIntimationDetails();

        function cacheFunctions() {


            //cached assesorList function
            if (!angular.isDefined($rootScope.assessorList)) {
                CommonService.loadAssessors().then(function (data) {

                    var count = 0;
                    $scope.assessorsList = [];
                    data.data.content.forEach(function (item, index) {
                        $scope.assessorsList.push({
                            name: item.assessorName,
                            contact: item.contactNo,
                            display: item.assessorName + " : " + item.contactNo,
                            userCode: item.assessorCode
                        });

                        count++;

                        if (data.data.content.length == count) {
                            self.pending = false;
                            console.log("works");
                            // getAssCode();
                        }
                    });
                });
            } else {
                console.log("loaded from cache");
                $scope.assessorsList = $rootScope.assessorList;
                self.pending = false;
                //getAssCode();

            }




        }



        self.updateIntimation = function () {

            self.update = true;

            $scope.saving = true;
            var data = self.job;


            var ass = $filter('filter')($scope.assessorsList, function (d) { return d.userCode === self.job.assessorCode; })[0];

            if (!angular.isDefined(ass)) {
                ass = self.job.assessorName;

            } else {

                ass = ass.display;
            }

            data.docNo = data.docNo.trim();
            data.assessorName = ass;
            data.assessorCode = data.assessorCode == null ? "NONE" : data.assessorCode;
            data.saveFlag = 'UPDATE';
            data.systemDate = moment().format('YYYY/MM/DD');

            if (data.completeDate == null) {

                data.completeDate = "";

            }

            data.petAge = data.petAge == null ? 0 : data.petAge;
            data.petColor = data.petColor == null ? "" : data.petColor;
            data.petGender = data.petGender == null ? "" : data.petGender;
            data.petName = data.petName == null ? "" : data.petName;
            data.petRegNo = data.petRegNo == null ? "" : data.petRegNo;

            var toast = CommonService.saving(); $http.post(RestfulAPI.list.NonMotorIntimationUpdate, data, RestfulAPI.config).success(function (data) {

                console.log(data);


                self.intimationMain = data;
                self.job = data;

                $scope.showItem = "NONE";
                //self.update = false;   

                $scope.saving = false;

                CommonService.saved(toast, "");

            }).error(function (data) {


                $scope.saving = false;
                //self.update = false;  

                CommonService.error(toast);

            });


        };

        $scope.cancelIntimation = function () {

            var data = {
                "docNo": self.job.docNo.trim(),
                "userName": $rootScope.userId
            };



            swal({
                title: "Cancel Intimation?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, Cancel!",
                closeOnConfirm: false
            },
                function () {
                    canc();
                });




            function canc() {

                $http.post(RestfulAPI.list.CancelNonMotor, data, RestfulAPI.config).success(function (data) {
                    swal("Cacneled!", "", "success");


                }).error(function (err) {



                    console.log(err);
                });

            }

        };

    }



})();