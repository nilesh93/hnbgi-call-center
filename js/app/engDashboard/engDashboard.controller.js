(function () {

    'use strict';

    angular.module('coreApp')
        .controller('EngDashController', EngDashController)
        .controller('EngDashReportController', EngDashReportController)
        .controller('EngDashboardInfoController', EngDashboardInfoController);


    function EngDashController($scope, $rootScope, $http, $state, $timeout, $document, DTOptionsBuilder, RestfulAPI, BroadCastServices, ngGPlacesAPI, PlacesService, $uibModal, $log, BootsrapService, $stateParams, $filter, CommonService, ngToast, $mdDialog, $mdMedia) {

        RestfulAPI.loginCheck();

        $scope.viewIntimation = function (moi) {

            $http.get(RestfulAPI.list.IntimationSearch + "?moiNo=" + moi, RestfulAPI.basicConfig).success(function (data) {

                if (data.content.length == 1) {
                    var vehicleNumber = data.content[0].vehicleNo;

                    $state.go("intimation.view", { intimationID: moi, vehicleNo: vehicleNumber });

                } else {

                    swal("Sorry! Intimation Unavailable", "", "error");
                }
            }).error(function () {


            });
        };

        if ($rootScope.userPermission.indexOf("ENGDASH") == -1) {
            console.log("not authorized");
            $state.go("workplace");
        }

        $rootScope.$broadcast('state-changed', { state: 'ENG-DASHBOARD' });

        $timeout(function () {
            $rootScope.$broadcast('state-changed', { state: 'ENG-DASHBOARD' });
        });

        console.log("works");

        $scope.labels = ['ONSITE', 'OFFSITE', 'GE', 'DR', 'SE', 'ARI', 'SLV'];
        $scope.series = ['JS', 'JC', 'Completed'];

        $scope.data = [
            [],
            [],
            []
        ];


        $scope.labels = ['OnSite', 'OffSite', 'GE', 'DR', 'SE', 'ARI', 'SLV'];
        $scope.types = [{
            name: 'PENDING JS JOBS',
            id: 'AG'
        }, {
                name: 'PENDING JC JOBS',
                id: 'JS'
            }, {
                name: 'COMPLETED JOBS',
                id: 'JC'
            }];

        $scope.search = {};

        function initSelect(main, sub) {
            $scope.search.main = main;
            $scope.search.sub = sub;
        }

        $scope.$on('select-changed', function (event, data) {

            initSelect(data.main, data.sub);

        });

        $scope.init = function () {
            $rootScope.$broadcast('selected', { main: $scope.search.main, sub: $scope.search.sub });
        };

        $scope.jctot = 0;
        $scope.jstot = 0;
        $scope.comptot = 0;
        $scope.status = false;

        function init() {


            $http.get(RestfulAPI.list.DashboardJobSummary + "?status=AG", RestfulAPI.basicConfig).success(function (data) {


                $scope.js = data._embedded.assessorjobassignsummary;
                console.log(data);
                $scope.getTotal('js');



            }).error(function (data) {



            });

            $http.get(RestfulAPI.list.DashboardJobSummary + "?status=JS", RestfulAPI.basicConfig).success(function (data) {


                $scope.jc = data._embedded.assessorjobassignsummary;
                console.log(data);
                $scope.getTotal('jc')

            }).error(function (data) {



            });

            $http.get(RestfulAPI.list.DashboardJobSummary + "?status=JC", RestfulAPI.basicConfig).success(function (data) {


                $scope.completed = data._embedded.assessorjobassignsummary;
                console.log(data);

                $scope.getTotal('completed');

            }).error(function (data) {



            });

        }

        init();

        $scope.change = function (type) {

            $scope.status = false;
            $state.go('engDash.overall');

        };

        $scope.getTotal = function (type) {


            if (type == 'jc') {
                $scope.jc.map(function (item) {

                    $scope.jctot += parseInt(item.nop);
                    $scope.data[1].push(parseInt(item.nop));
                });
            } else if (type == 'js') {
                $scope.js.map(function (item) {

                    $scope.jstot += parseInt(item.nop);
                    $scope.data[0].push(parseInt(item.nop));
                });
            } else {
                $scope.completed.map(function (item) {

                    $scope.comptot += parseInt(item.nop);
                    $scope.data[2].push(parseInt(item.nop));
                });
            }

        };

        $scope.changeStatus = function () {

            $scope.status = true;

        };

        $scope.$on('dash-info', function (event, data) {

            $scope.status = true;
        });

    }


    function EngDashboardInfoController($scope, $rootScope, $http, $state, $timeout, $document, DTOptionsBuilder, RestfulAPI, BroadCastServices, ngGPlacesAPI, PlacesService, $uibModal, $log, BootsrapService, $stateParams, $filter, CommonService, ngToast, $mdDialog, $mdMedia) {

        var self = this;
        RestfulAPI.loginCheck();


        $rootScope.$broadcast('select-changed', { main: $stateParams.main, sub: $stateParams.sub });

        $scope.search = {};

        $scope.search.main = $stateParams.main;
        $scope.search.sub = $stateParams.sub;




        $scope.$on('selected', function (event, data) {

            init(data.main, data.sub);

        });

        $scope.init = function (main, sub) {


            init(main, sub);
        }
        $scope.labels = ['OnSite', 'OffSite', 'GE', 'DR', 'SE', 'ARI', 'SLV'];
        $scope.types = [{
            name: 'PENDING JS JOBS',
            id: 'AG'
        }, {
                name: 'PENDING JC JOBS',
                id: 'JS'
            }, {
                name: 'COMPLETED JOBS',
                id: 'JC'
            }];


        $rootScope.$broadcast('state-changed', { state: 'ENG-DASHBOARD' });
        $rootScope.$broadcast('dash-info', { state: 'dash-info' });

        function init(main, sub) {

            $scope.type = sub;
            $scope.sub = sub;

            $scope.panelHead = (main == "AG") ? 'Pending JS Jobs' : (main == 'JS') ? 'Pending JC Jobs' : 'Completed Jobs';
            $scope.panelClass = (main == "AG") ? 'panel-danger' : (main == 'JS') ? 'panel-warning' : 'panel-success';
            $scope.defaultClass = (main == "AG") ? 'danger' : (main == 'JS') ? 'warning' : 'success';
            console.log("rest", RestfulAPI.list.DashboardJobSummaryInfo + "?status=" + main + "&inspectionCode=" + sub + "&size=1000");

            $http.get(RestfulAPI.list.DashboardJobSummaryInfo + "?status=" + main + "&inspectionCode=" + sub + "&size=1000", RestfulAPI.basicConfig).success(function (data) {

                console.log("info", data);
                $scope.dashInfoList = data.content;

            }).error(function () {


            });

        }

        init($stateParams.main, $stateParams.sub);




        $scope.viewIntimation = function (moi) {

            $http.get(RestfulAPI.list.IntimationSearch + "?moiNo=" + moi, RestfulAPI.basicConfig).success(function (data) {

                if (data.content.length == 1) {
                    var vehicleNumber = data.content[0].vehicleNo;

                    $state.go("intimation.view", { intimationID: moi, vehicleNo: vehicleNumber });

                } else {

                    swal("Sorry! Intimation Unavailable", "", "error");
                }
            }).error(function () {


            });
        };

    }


    function EngDashReportController($scope, $rootScope, $http, $state, $timeout, $document, DTOptionsBuilder, RestfulAPI, BroadCastServices, ngGPlacesAPI, PlacesService, $uibModal, $log, BootsrapService, $stateParams, $filter, CommonService, ngToast, $mdDialog, $mdMedia) {

        today();
        RestfulAPI.loginCheck();

        $scope.img = [];
        $scope.viewIntimation = function (moi) {

            $http.get(RestfulAPI.list.IntimationSearch + "?moiNo=" + moi, RestfulAPI.basicConfig).success(function (data) {

                if (data.content.length == 1) {
                    var vehicleNumber = data.content[0].vehicleNo;

                    $state.go("intimation.view", { intimationID: moi, vehicleNo: vehicleNumber });

                } else {

                    swal("Sorry! Intimation Unavailable", "", "error");
                }
            }).error(function () {


            });
        };

        function today() {

            var data = {
                assignAfter: moment().format('YYYY-MM-DD'),
                assignBefore: moment().format('YYYY-MM-DD')
            };

            var dataString = RestfulAPI.setUrl(data);
            $http.get(RestfulAPI.list.DashboardJobSummaryInfo + encodeURI(dataString), RestfulAPI.basicConfig).success(function (data) {
                console.log("today", data);
                $scope.dashInfoList = data.content;

            }).error(function () {


            });

        }

        $scope.today = function () {

            today();

        };

        $scope.search = function () {

            var data = {
                assignAfter: $scope.search.from,
                assignBefore: $scope.search.to,
                size: '10000'
            };

            var dataString = RestfulAPI.setUrl(data);
            $http.get(RestfulAPI.list.DashboardJobSummaryInfo + encodeURI(dataString), RestfulAPI.basicConfig).success(function (data) {
                console.log("today", data);

                $scope.dashInfoList = data.content;

            }).error(function () {


            });


        };


        $scope.loadModal = function (moi, x) {

            getIntimationDetails(moi, x.assessorCode);
            $scope.assessor = x;

            console.log("assessor", x);
            self.policeModalInstance = BootsrapService.modal({
                url: 'pages/engDashboard/eng.moi.modal.html',
                scope: $scope
            });
        };


        //cached assesorList function
        if (!angular.isDefined($rootScope.assessorList)) {
            CommonService.loadAssessors().then(function (data) {

                $scope.assessorsList = [];
                data.data.content.forEach(function (item, index) {
                    $scope.assessorsList.push({
                        name: item.assessorName,
                        contact: item.contactNo,
                        display: item.assessorName + " : " + item.contactNo,
                        userCode: item.assessorCode
                    });
                });


            });
        } else {
            console.log("loaded from cache");
            $scope.assessorsList = $rootScope.assessorList;

        }


        function getIntimationDetails(moi, assCode) {

            var ass = $filter('filter')($scope.assessorsList, function (d) { return d.userCode === assCode; })[0];
            console.log("ass", ass);

            $scope.ass = ass;

            $http.get(RestfulAPI.list.IntimationSearch + "?moiNo=" + moi, RestfulAPI.basicConfig).success(function (data) {
                $scope.intimation = data.content[0];
                console.log($scope.intimation);

                getPolicyDetails($scope.intimation.policyNo);
                getLastIntimation($scope.intimation.policyNo, moi);
                getImages($scope.intimation.vehicleNo, moi);

                $scope.moiNum = moi;

            }).error(function (err) {
                console.log(err);
            });
        }

        function getPolicyDetails(policy) {
            $http.get(RestfulAPI.list.searchPolicy + "?policyNo=" + policy, RestfulAPI.basicConfig).success(function (data) {

                console.log("policy", data);
                $scope.policy = data.content[0];

            }).error(function (err) {
                console.log(err);
            });
        }

        function getLastIntimation(policy, moi) {
            $http.get(RestfulAPI.list.IntimationSearch + "?policyNo=" + policy, RestfulAPI.basicConfig).success(function (data) {
                console.log("aa", data);


                $scope.intiResults = data.content;

                var obj = $filter('filter')($scope.intiResults, function (d) { return d.moiNo === moi; })[0];

                var index = $scope.intiResults.indexOf(obj);

                if (index - 1 >= 0) {
                    $scope.lastAccident = $scope.intiResults[index - 1];
                } else {
                    $scope.lastAccident = false;
                }

            });
        }


        function getImages(vno, initimation) {

            //RestfulAPI.list.GetImages+$stateParams.intimationID+"&"+$stateParams.vehicleNo
            $http.get(RestfulAPI.list.GetImages + initimation + "&" + vno, RestfulAPI.basicConfig).success(function (data) {

                console.log("success", data);

            }).error(function () {

                console.log("no onnline images found");
            });

            $http.get(RestfulAPI.list.GetImagesFromVehilcle + "?vehicleNo=" + vno, RestfulAPI.basicConfig).success(function (data) {

                $scope.imgCount = 0;
                $scope.imageList = data._embedded.accidents;

                $scope.images = [];

                $scope.imageList.forEach(function (item, key) {
                    var moi = item.moiNo;

                    $http.get(item._links.accidentImages.href, RestfulAPI.basicConfig).success(function (data) {

                        var img = [];

                        data._embedded.accidentImageses.forEach(function (item, key) {

                            $scope.img.push({
                                id: $scope.imgCount++,
                                title: item.accidentId,
                                src: item.imageThumbnailUrl,
                                href: item.imageFullPath,
                                class: 'box'
                            });

                        });

                        // $scope.images.push({
                        //     moi: moi,
                        //     images: img
                        // });
                        // console.log("img123", $scope.images);

                    }).error(function () {

                        console.log("No accident Images");

                    });

                });

                console.log("images", data);
            }).error(function (data) {


                console.log("No images available");

            });
        }


        $scope.cancel = function () {

            self.policeModalInstance.dismiss('cancel');


        };

        $scope.insert = {};
        $scope.dutyUpdate = function () {
            var data = {
                jobNumber: $scope.assessor.jobNumber,
                id: $scope.assessor.id,
                dutyOfficerACR: $scope.insert.acr || 0,
                dutyOfficerComment: $scope.insert.comment || "",
                dutyOfficer: $rootScope.userId
            };

            console.log(data);
            console.log(RestfulAPI.list.DutyOfficerUpdate);

            $http.post(RestfulAPI.list.DutyOfficerUpdate, data, RestfulAPI.config).success(function (data) {
                $scope.cancel();
                console.log(data);
                swal("Successfully Updated!", "", "success");
                $scope.insert.acr = 0;
                $scope.insert.comment = "";
            }).error(function (err) {
                console.log(err);
            });
        };

    }
})();