
/**
 * Define angular module
 */
angular.module('coreApp')
    .service('RestfulAPI', RestfulApi);

/**
 * Restful Api service list Array
 */
function RestfulApi($rootScope, $http, $state, urlConfig, $stateParams) {


    // var url = "http://192.168.5.117";
    // var url = "http://10.100.59.161";

    var url = urlConfig.url;

    var self = this;
    this.list = {
        //ANURANGA-----------------------------------------------------------
        //policy search
        searchPolicy: url + ":8080/policies/search/findPolicy",
        searchNonPolicy: url + ":8080//nmpolicies/search/findPolicy",
        //----------------------------------------------------------------------
        //policy view
        debitSearch: url + ":8080/debits/search/findByPolicyId",
        recieptSearch: url + ":8080/receipts/search/findPolicyReceipt",
        UWCreditSearch: url + ":8080/underwritingcredits/search/findByPolicyId",
        ClaimCreditSearch: url + ":8080/claimcredits/search/findByPolicyId",
        SMSSearch: url + ":8080/motorintimationsms/search/findAll",
        WarrentySearch: url + ":8080/warranties/search/findPolicyWarranty",
        ClauseSearch: url + ":8080/clauses/search/findPolicyClauses",
        ClaimDesc: url + ":8080/claimdescription",
        IntimationTypes: url + ":8080/motorintimationtypes",
        AssessorInfo: url + ":8080/assessorassigmjobtemp/search/findByDocNo",
        //-----------------------------------------------------------------------
        //intimations
        IntimationSearch: url + ":8080/motorintimations/search/findIntimations",
        IntimationNonSearch: url + ":8080/nonmotorintimations/search/findIntimations",
        InspectionTypes: url + ":8080/motorengineeringinspection/search/findengInspection",
        EngActionTypes: url + ":8080/motorengineeringactions",
        MotorIntimationActions: url + ":8080/motorintimationactions/search/findByActionStatus?actionStatus=N",
        MotorIntimationSave: url + ":8080/motorintimations/saveData",
        NonMotorIntimationSave: url + ":8080/nonmotorintimations/saveData",
        MotorEngDocs: url + ":8080/motorEngineeringDocumentses/search/",
        AllAssessors: url + ":8080/assessordetails/search/findAll",
        UpdateIntimation: url + ":8080/motorintimations/updateData",
        MotorEngSteps: url + ":8080/motorengineering/search/findIntimations",
        MotorEngInformTo: url + ":8080/motorengineeringinformto",
        MotorEngInformWay: url + ":8080/motorengineeringinformway",
        MotorSaveEng: url + ":8080/motorengineering/saveData",
        MotorDocUpload: url + ":8080/motorengineering/uploadFiles",
        CancelNonMotor: url + ":8080/nonmotorintimations/cancelData",
        IntimationDocs: url + ":8080//engineeringdocuments/search/findAll",
        UpdatecovernoteData: url + ":8080/motorintimations/updatecovernoteData",
        UpdatecovernoteDataNonMotor: url + ":8080/nonmotorintimations/updatecnData",
        //--------------------------------------------------------------------------


        //PUR----------------------------------------------------
        PURSearch: url + ":8080/motorinspection/search/findinspection",
        PURBulkSearch: url + ":8080/branchmotorinspection/search/findinspection",
        BranchList: url + ":8080/branchdetails",
        PURSearchNon: url + ":8080/nonmotorinspection/search/findInspection",
        PURSingleUpdate: url + ":8080/motorinspection/updateData",
        PURBranchSave: url + ":8080/motorinspection/saveData",
        PURNonMotorSave: url + ":8080/nonmotorinspection/updateData",
        PURBUpdate: url + ":8080/branchmotorinspection/updateData",




        //--------------------------------------------------------------------------

        //----------------------------login------------------------

        UserRoles: url + ":8080/userindentification/search/findByUserId",

        //---------------eng dashboard --------------

        DashboardJobSummary: url + ":8080/assessorjobassignsummary/search/findAssessorJobSummary",
        DashboardJobSummaryInfo: url + ":8080/assessorjobsextension/search/findJobs",
        DashboardJobReject: url + ":8080/assessorjobsextension/rejectData",
        DutyOfficerUpdate: url + ":8080/assessorjobsextension/dutyOfficerupdateData",


        //-------------------------------------------


        // ------------crc dashboard -----------------------

        crcMotorIntimations: url + ":8080/motorintimations/search/findIntimations",
        crcNonMotorIntimations: url + ":8080/nonmotorintimations/search/findIntimations",
        crcEngineering: url + ":8080/motorengineering/search/findIntimation",
        crcPur: url + ":8080/motorinspection/search/findinspection",
        crcNonMotorPur: url + ":8080/nonmotorinspection/search/findInspection",
        crcJobSummary: url + ":8080/assessorjobassignsummary/search/findAssessorJobSummaryCallCenter",
        crcAgentActivity: url + ":8080/callagentjobassignsummary/search/findAll",
        jobReject: url + ":8080/assessorjobsextension/rejectData",

        //--------------------------------------------------
        //NONMOTOR------------------------------------------------------------------
        //Policies------------------------------------------------------------------
        NonMotorClauses: url + ":8080/clausesnonmotor/search/findPolicyClauses",
        NonMotorIntimationUpdate: url + ":8080/nonmotorintimations/updateData",
        //THARINDU--------------------------------------------------------------------
        //acessorList
        AcessorList: url + ":8090/giscordinate/search/findAllCordinates",
        getAssessorDetails: url + ":8090/assesorjob/search/findByAssCode",
        //-----------------------------------------------------------------------


        //-------------accidents------------------
        AccidentSearch: url + ":8090/accidents/search/findByMoiNo",
        GetImages: url + ":8090/images/",
        GetImagesFromVehilcle: url + ":8090/accidents/search/findAllByVehicleNo"


    };


    this.setUrl = function (obj) {

        obj = this.capitalize(obj);
        console.log(obj);
        var str = "?";
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {

                if (obj[property].trim() != "")
                    str += property + "=" + obj[property] + "&";

            }
        }

        return str;
    };


    this.validateObj = function (obj) {

        obj = this.capitalize(obj);

        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {

                if (!angular.isDefined(obj[property])) {

                    return property;
                }

            }
        }

        return "true";
    };

    this.capitalize = function (obj) {

        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {


                if (angular.isDefined(obj[property])) {

                    //console.log(obj[property]);
                    if (obj[property] != null) {
                        obj[property] = obj[property] + "";
                        obj[property] = obj[property].toUpperCase();

                    }

                }

            }
        }


        return obj;
    };

    this.resetObj = function (obj) {

        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                obj[property] = "";
            }
        }
        return obj;
    };


    this.loginCheck = function () {


        if ($rootScope.loginInd != 1) {

            console.log("current name", $state.current.name);
            $rootScope.requestState = $state.current.name;
            $rootScope.requestParams = $stateParams;
            //var par =  $stateParams;
            console.log($stateParams);

            $state.go('login');
        }



    };

    this.config = {};

    this.basicConfig = {};
    this.setAuth = function () {

        self.config = {
            headers: {
                'Authorization': $rootScope.auth

            }
        };

        self.basicConfig = {
            headers: {
                'Authorization': " Basic " + $rootScope.auth

            }
        };

        console.log("set", self.basicConfig);
    };

    this.getLatLngFromAddress = function (callabck, address) {

        address = address || 'Colombo, Sri Lanka';

        var geocoder = new google.maps.Geocoder();
        if (geocoder) {
            geocoder.geocode({
                'address': address
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    console.log("asda", results[0]);
                    //do the callback here
                    callback(results[0]);
                } else {


                    console.log("error");
                }
            });
        }

    };


}