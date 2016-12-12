(function () {
    'use strict';

    angular.module('coreApp')


        .controller('PurController', PurController)
        .controller('PurViewController', PurViewController)
        .controller('PurNonViewController', PurNonViewController);


    function PurController($scope, $rootScope, $http, $state, RestfulAPI, DTOptionsBuilder, CommonService, $timeout) {

        RestfulAPI.loginCheck();
        $rootScope.$broadcast('state-changed', { state: 'PUR' });
        $timeout(function () {
            $rootScope.$broadcast('state-changed', { state: 'PUR' });
        });


        $scope.search = {};
        $scope.bulk = {};

        $scope.searching = false;

        $scope.dtOptions = DTOptionsBuilder.newOptions().withOption("autoWidth", false);

        function init() {

            if (!angular.isDefined($rootScope.branchList)) {

                CommonService.branchList().then(function (data) {
                    //$scope.intimationActions = data._embedded.motorintimationactions;
                });

            } else {

                console.log("loaded from cache");
            }

        }

        init();

        console.log($rootScope.userPermission.indexOf("PUR"));

        if ($rootScope.userPermission.indexOf("PUR") == -1) {
            console.log("not authorized");
            $state.go("workplace");
        }

        function singleSearch() {

            var purNo = $scope.search.purNo || "";
            var informer = $scope.search.informer || "";
            var vehicleNo = $scope.search.vehicleNo || "";
            var branch = $scope.search.branch || "";
            var customer = $scope.search.customer || "";

            if (branch == 'ALL') {

                branch = "";
            }


            $scope.searching = true;



            $scope.searching = true;

            var searchMotor = {
                purNo: purNo,
                informerContact: informer,
                vehicleNo: vehicleNo,
                customerName: customer,
                branchCode: branch

            };

            var nonMotorModel = {
                purNo: purNo,
                customerContact: informer,
                customerName: customer,
                branchCode: branch


            };

            $scope.searchResult = [];
            $scope.searchResultNon = [];

            var dataString = RestfulAPI.setUrl(searchMotor);
            var dataStringNon = RestfulAPI.setUrl(nonMotorModel);


            $http.get(RestfulAPI.list.PURSearch + encodeURI(dataString), RestfulAPI.basicConfig).success(function (data) {

                $scope.searchResult = data.content;
                console.log("PUR", data);

                $scope.searching = false;

            });

            $http.get(RestfulAPI.list.PURSearchNon + encodeURI(dataStringNon), RestfulAPI.basicConfig).success(function (data) {

                $scope.searchResultNon = data.content;
                console.log("PURNON", data);

                $scope.searching = false;

            });



        }
        function bulkSearch() {

            var to = $scope.bulk.to || "";
            var from = $scope.bulk.from || "";
            var branch = $scope.bulk.branch || "";
            var status = $scope.bulk.status || "";

            if (branch == 'ALL') {

                branch = "";
            }

            if (status == 'All') {

                status = "";

            }




            $scope.searching = true;

            var nonMotorModel = {
                createdAfter: from,
                createdBefore: to,
                branchCode: branch,
                jobStatus: status
            };

            var searchMotor = {
                registeredAfter: from,
                registeredBefore: to,
                status: status,
                branchCode: branch,
                size: "500"

            };


            $scope.searching = true;
            var dataString = RestfulAPI.setUrl(searchMotor);
            var dataStringNon = RestfulAPI.setUrl(nonMotorModel);


            $http.get(RestfulAPI.list.PURBulkSearch + encodeURI(dataString), RestfulAPI.basicConfig).success(function (data) {
                $scope.searchResult = data.content;
                console.log("PUR", data);
                $scope.searching = false;

            });


            $http.get(RestfulAPI.list.PURSearchNon + encodeURI(dataStringNon), RestfulAPI.basicConfig).success(function (data) {

                $scope.searchResultNon = data.content;
                console.log("PURNON", data);

                $scope.searching = false;

            });


        }
        function todaySearch() {
            var branch = $scope.bulk.branch || "";
            var status = $scope.bulk.status || "";


            if (branch == 'ALL') {

                branch = "";
            }

            if (status == 'All') {

                status = "";

            }

            $scope.searching = true;

            var searchMotor = {
                registeredAfter: moment().format('YYYY-MM-DD'),
                registeredBefore: moment().format('YYYY-MM-DD'),
                status: status,
                branchCode: branch,
                size: "500"

            };

            var nonMotorModel = {
                createdAfter: moment().format('YYYY-MM-DD'),
                createdBefore: moment().format('YYYY-MM-DD'),
                branchCode: branch,
                jobStatus: status
            };

            var dataString = RestfulAPI.setUrl(searchMotor);
            var dataStringNon = RestfulAPI.setUrl(nonMotorModel);


            $http.get(RestfulAPI.list.PURBulkSearch + encodeURI(dataString), RestfulAPI.basicConfig).success(function (data) {
                $scope.searchResult = data.content;
                console.log("PUR", data);

                $scope.searching = false;

            });


            $http.get(RestfulAPI.list.PURSearchNon + encodeURI(dataStringNon), RestfulAPI.basicConfig).success(function (data) {

                $scope.searchResultNon = data.content;
                console.log("PURNON", data);
                $scope.searching = false;

            });

        }



        $scope.singleSearch = function () {

            $state.go("pur.search");
            $scope.searchType = 'MOTOR';

            singleSearch();
            $scope.purS = 'S';

        };

        $scope.bulkSearch = function () {

            $state.go("pur.search");
            $scope.searchType = 'MOTOR';
            bulkSearch();
            $scope.purS = 'B';


        };

        $scope.searchToday = function () {

            $scope.searchType = 'MOTOR';
            todaySearch();
            $scope.purS = 'B';

        };

        $scope.viewPur = function (purNo, type) {

            $state.go("pur.view", { purNo: purNo.trim(), type: type });

        };

        $scope.viewPurNon = function (purNo, type) {

            $state.go("pur.nonView", { purNo: purNo.trim() });

        };

    }
    function PurViewController($scope, $rootScope, $http, $state, RestfulAPI, DTOptionsBuilder, CommonService, $stateParams, BootsrapService, $filter) {

        RestfulAPI.loginCheck();
        $scope.positionsCenter = {
            latitude: 7.8757327,
            longitude: 79.5789703,
            zoom: 7

        };

        $scope.autocompleteOptions = {
            componentRestrictions:
            { country: 'lk' },
            types: ['geocode']
        };

        $scope.map = true;

        $scope.markers = [{
            latitude: 7.8757327,
            longitude: 79.5789703,
            title: '',
            id: 0
        }];

        function mapResult(result, address) {
            $scope.positionsCenter.latitude = result.geometry.location.lat();
            $scope.positionsCenter.longitude = result.geometry.location.lng();


            /*    $scope.markers.push({
                latitude:  result.geometry.location.lat(),
                longitude: result.geometry.location.lng(),
                title: address,
                id : 0
            }); */

            $scope.markers[0].latitude = result.geometry.location.lat();
            $scope.markers[0].longitude = result.geometry.location.lng();
            $scope.markers[0].title = address;


            $scope.positionsCenter.zoom = 10;
            $scope.map = true;
        }


        $scope.job = {};
        function init() {

            if ($stateParams.type == 'S') {

                $scope.branchPUR = false;

                console.log(RestfulAPI.list.PURSearch + "?purNo=" + $stateParams.purNo);
                $http.get(RestfulAPI.list.PURSearch + "?purNo=" + $stateParams.purNo, RestfulAPI.basicConfig).success(function (data) {

                    $scope.map = false;
                    $scope.purInfo = data.content[0];
                    console.log("PURInfo", data);
                    $scope.reset();

                    getLatLng($scope.purInfo.locationName);

                    console.log("result", $scope.purInfo.locationName);
                    // mapResult(result);

                    $scope.purInfo.jobCompleteDate = ($scope.purInfo.jobCompleteDate == '-') ? "" : $scope.purInfo.jobCompleteDate;
                    $scope.purInfo.jobAllocationDate = ($scope.purInfo.jobAllocationDate == '-') ? "" : moment().format('YYYY-MM-DD');

                });
            }
            else {
                $scope.branchPUR = true;

                console.log(RestfulAPI.list.PURBulkSearch + "?purNo=" + $stateParams.purNo);
                $http.get(RestfulAPI.list.PURBulkSearch + "?purNo=" + $stateParams.purNo, RestfulAPI.basicConfig).success(function (data) {

                    $scope.purInfo = data.content[0];
                    console.log("PURInfo", data);

                    $scope.purInfo.jobCompleteDate = ($scope.purInfo.jobCompleteDate == '-') ? "" : $scope.purInfo.jobCompleteDate;
                    $scope.purInfo.jobAllocationDate = ($scope.purInfo.jobAllocationDate == '-') ? "" : moment().format('YYYY-MM-DD');

                    getLatLng($scope.purInfo.locationName);
                    console.log("result", $scope.purInfo.locationName);
                    $scope.reset();

                });
            }

            //cached assesorList function
            if (!angular.isDefined($rootScope.assessorList)) {
                CommonService.loadAssessors().then(function (data) {

                    $scope.assessorsList = [];
                    data.data.content.forEach(function (item, index) {
                        $scope.assessorsList.push({
                            name: item.assessorName,
                            contact: item.contactNo,
                            display: item.assessorName + " - " + item.contactNo,
                            userCode: item.assessorCode
                        });
                    });

                    // $scope.job.assessors = $scope.assessorsList[0];
                });
            } else {
                console.log("loaded from cache");
                $scope.assessorsList = $rootScope.assessorList;
                // $scope.job.assessors = $scope.assessorsList[0];
            }

        }
        init();


        function getLatLng(address) {

            address = address || 'Colombo, Sri Lanka';
            var geocoder = new google.maps.Geocoder();
            if (geocoder) {
                geocoder.geocode({
                    'address': address
                }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        console.log("asda", results[0]);
                        //do the callback here
                        mapResult(results[0], address);
                    } else {


                        console.log("error");
                    }
                });
            }

        }





        $scope.selectAss = function (id) {

            console.log(id);
            console.log($scope.markersAsc);


            var ass = $filter('filter')($scope.assessorsList, function (d) { return d.userCode === $scope.markersAsc[id].templateParameter.userCode; })[0];
            $scope.job.assessors = ass;


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



        };


        $scope.assesorMap = function () {



            $scope.loadAcessors();

            self.policeModalInstance = BootsrapService.modal({
                url: 'pages/jobs/job.acessorModal.html',
                scope: $scope
            });

            $scope.mapLoad = "ASS";


        };


        $scope.loadAcessors = function () {



            var lat = $scope.markers[0].latitude;
            var lang = $scope.markers[0].longitude;



            $scope.positionsCenter = { latitude: lat, longitude: lang };

            $scope.markersAsc = [];
            $scope.markersAsc.push({

                latitude: lat,
                longitude: lang,
                title: "Accident Place",
                id: 0,
                icon: 'img/map/car-crash.png',
                vicinity: $scope.markers[0].title,

                templateParameter: {
                    id: 0,
                    title: "Accident Place",
                    selected: false
                }

            });



            $http.get(RestfulAPI.list.AcessorList, RestfulAPI.basicConfig).then(function (data) {

                var count = 1;

                console.log(data.data._embedded.giscordinate);

                $scope.acessorCount = data.data._embedded.giscordinate.length;
                data.data._embedded.giscordinate.forEach(function (item, index) {


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


        $scope.cancel = function () {

            self.policeModalInstance.dismiss('cancel');

            $scope.mapLoad = false;

            console.log(self.policeModalInstance);

        };


        $scope.assSelect = function (obj, event, markerInfo) {

            $scope.assessorJobList = [];
            console.log(obj);
            console.log(event);

            console.log("marker", markerInfo);
            $scope.assDefined = true;
            $scope.assessorJobListLoad = true;

            $scope.assInfo = {
                title: markerInfo.title,
                id: markerInfo.id,
                icon: markerInfo.icon,
                vicinity: markerInfo.vicinity,
                selected: markerInfo.templateParameter.selected,
                contact: markerInfo.templateParameter.contact

            };

            var assCode = markerInfo.templateParameter.userCode;

            CommonService.getAssessorDetails(assCode).then(function (data) {
                console.log("new Data", data.data._embedded);

                $scope.assessorJobList = data.data._embedded.assesorjob;
                console.log($scope.assessorJobList);

                $scope.assessorJobListLoad = false;
            });

        };







        $scope.purbupdate = function () {

            var location;

            if (angular.isDefined($scope.job.locationName.geometry)) {

                location = $scope.job.locationName.formatted_address;

            }
            else {

                location = $scope.job.locationName;
                //    swal("Accident Place not Defined Properly", "Please fill out the Nearest Town", "error");

            }





            var data = {
                purNo: $scope.purInfo.purNo,
                locationName: location || $scope.purInfo.locationName
            };

            $http.post(RestfulAPI.list.PURBUpdate, data, RestfulAPI.config).success(function (data) {

                init();
                swal("Updated", "", "success");

            }).error(function () {


            });

        };


        $scope.motorSave = function () {

            var data = $scope.purInfo;
            data.saveFlag = "INSERT";
            data.systemDateS = moment().format('YYYY/MM/DD');
            data.systemDate = moment().format('YYYY-MM-DD');

            data.jobCompleteDate = $scope.job.jobCompleteDate;

            if (angular.isDefined($scope.job.assessors.userCode)) {

                data.assessorCode = $scope.job.assessors.userCode;

            }

            if (data.branchPurNo == null) {
                data.branchPurNo = "";

            }
            console.log(data);




            var toast = CommonService.saving();

            if ($stateParams.type == 'S') {
                $http.post(RestfulAPI.list.PURSingleUpdate, data, RestfulAPI.config).success(function (data) {

                    CommonService.saved(toast, "");

                }).error(function (err) {

                    CommonService.error(toast);

                });

            } else {

                console.log("original", data);

                data.crcOfficer = $rootScope.userId;
                data.documentDate = moment().format("YYYY-MM-DD");
                data.documentTime = moment().format("YYYY-MM-DD");
                data.documentDescription = data.documentDescription || "";
                data.systemTime = data.systemDateTime;

                data.jobAllocationDate = data.jobAllocationDate == "-" ? "" : data.jobAllocationDate;
                data.jobCompleteDate = data.jobCompleteDate == "-" ? "" : data.jobCompleteDate;

                data.branchPurNo = data.purNo.trim();
                $http.post(RestfulAPI.list.PURBranchSave, data, RestfulAPI.config).success(function (data) {

                    CommonService.saved(toast, "");

                }).error(function (err) {

                    CommonService.error(toast);

                });

            }

        };

        $scope.reset = function () {

            $scope.job.assessors = {};
            $scope.job.jobCompleteDate = $scope.purInfo.jobCompleteDate;
            $scope.job.jobAllocationDate = $scope.purInfo.jobAllocationDate;

        };

    }


    function PurNonViewController($scope, $rootScope, $http, $state, RestfulAPI, DTOptionsBuilder, CommonService, $stateParams) {
        RestfulAPI.loginCheck();
        $scope.job = {};
        function init() {

            console.log(RestfulAPI.list.PURSearchNon + "?purNo=" + $stateParams.purNo);
            $http.get(RestfulAPI.list.PURSearchNon + "?purNo=" + $stateParams.purNo, RestfulAPI.basicConfig).success(function (data) {

                $scope.purInfo = data.content[0];
                console.log("PURInfo", data);



                $scope.purInfo.crcCompleteDate = ($scope.purInfo.crcCompleteDate == '-') ? "" : $scope.purInfo.crcCompleteDate;
                $scope.purInfo.crcCompleteDate = ($scope.purInfo.crcCompleteDate == null) ? "" : $scope.purInfo.crcCompleteDate;


                $scope.reset();
            });

            //cached assesorList function
            if (!angular.isDefined($rootScope.assessorList)) {
                CommonService.loadAssessors().then(function (data) {

                    $scope.assessorsList = [];
                    data.data.content.forEach(function (item, index) {
                        $scope.assessorsList.push({
                            name: item.assessorName,
                            contact: item.contactNo,
                            display: item.assessorName + " - " + item.contactNo,
                            userCode: item.assessorCode
                        });
                    });

                    // $scope.job.assessors = $scope.assessorsList[0];
                });
            } else {
                console.log("loaded from cache");
                $scope.assessorsList = $rootScope.assessorList;
                // $scope.job.assessors = $scope.assessorsList[0];
            }

        }
        init();

        $scope.nonmotorSave = function () {

            var purInfo = $scope.purInfo;

            var data = {
                purNo: purInfo.purNo,
                crcUser: $rootScope.userId,
                comments: purInfo.comments || "",
                crcCompleteDate: $scope.job.crcCompleteDate
            };

            var toast = CommonService.saving();

            $http.post(RestfulAPI.list.PURNonMotorSave, data, RestfulAPI.config).success(function (data) {

                CommonService.saved(toast, "");

            }).error(function (err) {
                console.log(err);
                CommonService.error(toast, "");
            });

        };

        $scope.reset = function () {

            $scope.job.crcCompleteDate = $scope.purInfo.crcCompleteDate;
            $scope.job.jobAllocationDate = $scope.purInfo.jobAllocationDate;

        };

    }
})();