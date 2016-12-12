function config($stateProvider,  $urlRouterProvider,ngGPlacesAPIProvider,$httpProvider, $mdThemingProvider) {

    
    $urlRouterProvider.otherwise("/login");
    $stateProvider

        .state("login", {
        url: '/login',
        abstract:false,
        views: {
            "main": {
                templateUrl: 'pages/login/login.main.html',
                controller: 'LoginController as lc'

            } 
        }    
    }) 

        .state("engDash", {
        url: '/engineer-dashboard-main',
        abstract:true,
        views: {
            "main": {
                templateUrl: 'pages/engDashboard/eng.dashboard.main.html',
                controller: 'EngDashController as edc'

            } 
        }    
    }) 
        .state("engDash.overall", {
        url: '/engineer-dashboard',
        abstract:false,
        views: {
            "result": {
                templateUrl: 'pages/engDashboard/eng.dashboard.overall.html',
                controller: ''

            } 
        }    
    }) 
        .state("engDash.reports", {
        url: '/engineer-reports',
        abstract:false,
        views: {
            "result": {
                templateUrl: 'pages/engDashboard/eng.ass-report.html',
                controller: 'EngDashReportController'

            } 
        }    
    })
        .state("engDash.info", {
        url: '/engineer-dashboard-info/:main/:sub',
        abstract:false,
        views: {
            "result": {
                templateUrl: 'pages/engDashboard/eng.dashboard.info.html',
                controller: 'EngDashboardInfoController as edic'

            } 
        }    
    }) 



        .state("crcDash", {
        url: '/crc-dashboard-main',
        abstract:true,
        views: {
            "main": {
                templateUrl: 'pages/crc-dash/crcDash.main.html',
                controller: ''

            } 
        }    
    }) 
        .state("crcDash.dashboard", {
        url: '/crc-dashboard',
        abstract:false,
        views: {
            "result": {
                templateUrl: 'pages/crc-dash/crcDash.dashboard.html',
                controller: 'crcDashMainController as cdc'

            } 
        }    
    })
        .state("crcDash.reports", {
        url: '/crc-dashboard',
        abstract:false,
        views: {
            "result": {
                templateUrl: 'pages/crc-dash/crcDash.reports.html',
                controller: 'crcDashController as cdc'

            } 
        }    
    })
        .state("crcDash.activity", {
        url: '/crc-dashboard',
        abstract:false,
        views: {
            "result": {
                templateUrl: 'pages/crc-dash/crcDash.activity.html',
                controller: 'crcDashActivityController as cdc'

            } 
        }    
    })



        .state("covernote", {
        url: '/covernote',
        abstract:true,
        views: {
            "main": {
                templateUrl: 'pages/covernote/covernote.main.html',
                controller: ''

            } 
        }    
    }) 

        .state("covernote.motor", {
        url: '/covernote-motor',

        views: {
            "result": {
                templateUrl: 'pages/covernote/motor.sidebar.html',
                controller: 'CoverNoteController'

            } 
        }    
    })  

        .state("covernote.nonmotor", {
        url: '/covernote-motor',

        views: {
            "result": {
                templateUrl: 'pages/covernote/nonmotor.sidebar.html',
                controller: 'CoverNoteNonMotorController'

            } 
        }    
    })  

        .state("job", {
        url: '/job',
        abstract:true,
        views: {
            "main": {
                templateUrl: 'pages/jobs/job.main.html',
                controller: 'JobController as jc'

            } 
        }    
    }) 
        .state("job.search", {
        url: '/search',
        views: {
            "result": {
                templateUrl: 'pages/jobs/job.search.html'
                //controller : 'JobController'
            } 
        }    
    }) 
        .state("job.customer", {
        url: '/MotorPolicy/:polID',
        views: {
            "result": {
                templateUrl: 'pages/jobs/job.customer.html',
                controller : 'PolicyController'
            } 
        }    
    })
        .state("job.NonMotorPolicy", {
        url: '/NonMotorPolicy/:polID/:pID',
        views: {
            "result": {
                templateUrl: 'pages/jobs/job.nonMotor.policy.html',
                controller : 'NonMotorController'
            } 
        }    
    })

        .state("workplace", {
        url: '/workplace',
        views: {
            "main": {
                templateUrl: 'pages/workplace/workplace.main.html',
                controller: 'WorkPlaceController as wp'
            } 
        }    
    })

        .state("pur", {
        url: '/pur',
        abstract:true,
        views: {
            "main": {
                templateUrl: 'pages/pur/pur.main.html',
                controller: 'PurController as pc'
            } 
        }    
    })
        .state("pur.search", {
        url: '/search',
        views: {
            "result": {
                templateUrl: 'pages/pur/pur.search.html'

            } 
        }    
    })
        .state("pur.view", {
        url: '/view/:purNo/:type',

        views: {
            "result": {
                templateUrl: 'pages/pur/pur.motorView.html',
                controller: 'PurViewController as pv'

            } 
        }    
    })
        .state("pur.nonView", {
        url: '/view/:purNo',

        views: {
            "result": {
                templateUrl: 'pages/pur/pur.nonmotorview.html',
                controller: 'PurNonViewController as pv'

            } 
        }    
    })

        .state("intimation", {
        url: '/intimations',
        abstract:true,
        views: {
            "main": {
                templateUrl: 'pages/intimation/intimation.main.html',
                controller: 'IntimationController as it'
            } 
        }    
    })
        .state("intimation.view", {
        url: '/view/:intimationID/:vehicleNo',

        views: {
            "result": {
                templateUrl: 'pages/intimation/intimation.view.html',
                controller: 'IntimationViewController as iv'

            } 
        }    
    })
        .state("intimation.nonMotorView", {
        url: '/nonMotorView/:intimationID',

        views: {
            "result": {
                templateUrl: 'pages/intimation/intimation.nonMotor.view.html',
                controller: 'IntimationNonMotorViewController as iv'

            } 
        }    
    })
        .state("intimation.search", {
        url: '/search',
        views: {
            "result": {
                templateUrl: 'pages/intimation/intimation.search.html'

            } 
        }    
    }); 



    ngGPlacesAPIProvider.setDefaults({
        radius: 5000,
        sensor: false,
        latitude: null,
        longitude: null,
        types: ['police'],
        map: null,
        elem: null,
        nearbySearchKeys: [ 'formatted_address','icon','geometry','name', 'reference', 'vicinity'],
        placeDetailsKeys: ['geometry','scope','formatted_address', 'formatted_phone_number',
                           'reference', 'website'
                          ],
        nearbySearchErr: 'Unable to find nearby places',
        placeDetailsErr: 'Unable to find place details'

    });

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";



    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    /*
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};

*/

    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('blue');

}


angular
    .module('coreApp')
    .config(config)
    .run(function($rootScope, $state,$base64,CommonService,uiSelectConfig,RestfulAPI,$templateCache) {
    $rootScope.loginInd = 0;
    $rootScope.$state = $state;

    $rootScope.loginInd = 0;

    $rootScope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
        var activeDate = moment();
        for (var i = 0; i < $dates.length; i++) {
            if ($dates[i].localDateValue() <= activeDate.valueOf()) {
                $dates[i].selectable = false;        
                console.log("started");
            }

        }
    }
    $rootScope.changeStateRoot = function(){


        $state.go("engDash.reports");
        console.log("root called");
    };

    $rootScope.loginInd = 0;
    $rootScope.userId = "";
    $rootScope.auth = "";
    //$base64.encode('ANURANGA:SRILANKAN');
    console.log("auth",$rootScope.auth);

    RestfulAPI.setAuth($rootScope.auth);

    $state.go('login');

    uiSelectConfig.theme = 'select2';

    //$templateCache.removeAll();

    //userRoles Configureation


    var roles = {

        SUPERUSER:function(){
            var temp = this.CC_MGR();
            return temp.concat(['ENGDASH']);
        },
        CC_MGR:function(){
            var temp = this.CC_USER();
            return temp.concat(['CRCDASH','COVERNOTE-REMAP']);
        },
        EN_MGR:function(){

            var temp = this.NM_USER();
            return temp.concat(['ENGDASH']);
        },
        CC_USER: function(){
            var temp = this.NM_USER();
            return temp.concat(['JOB-INSERT-MOTOR','JOB-INSERT-NONMOTOR','ENG-INSERT','JOB-UPDATE-MOTOR','JOB-UPDATE-NONMOTOR','COVERNOTE-INSERT-MOTOR','COVERNOTE-INSERT-NONMOTOR','COVERNOTE-PENDING-MOTOR','COVERNOTE-PENDING-NONMOTOR','PUR-MOTOR-NORMAL','PUR-MOTOR-BRANCH','PUR-NONMOTOR','PUR-MOTOR-UPDATE','PUR-NONMOTOR-UPDATE','COVERNOTE-MAP','COVERNOTE']);
        },
        NM_EXEC:function(){
            var temp = this.NM_USER();
            return temp.concat(['PUR-LOCATION']);
        },
        NM_USER:function(){
            return ['WORKSPACE','POLICIES','INSPECTIONS','PUR'];
        },
        EN_USER:function(){

            return this.EN_MGR();
        }
    };

    $rootScope.roles = roles;

    $rootScope.userPermission = [];

    $rootScope.requestState = "workplace";
    $rootScope.requestParams = {};

    console.log("SUPERUSER",roles.SUPERUSER());
    console.log("CC_MGR",roles.CC_MGR());
    console.log("EN_MGR",roles.EN_MGR());
    console.log("CC_USER",roles.CC_USER());
    console.log("NM_EXEC",roles.NM_EXEC());
    console.log("NM_USER",roles.NM_USER());
    console.log("EN_USER",roles.EN_USER());

});