var theKey = 'b667e8eefd9f853b7357054725f24b2df91983970';
var datasetsURL = 'https://api.census.gov/data.json';

var Helper = Helper || {
    DS_LIST: 0,
    DS_VARS: 1,
    DS_DATA: 2
};

Helper.showLoading = function() {
        var loadingDiv = document.getElementById('loading');
        loadingDiv.style.display = 'block';
};

Helper.hideLoading = function() {
        var loadingDiv = document.getElementById('loading');
        loadingDiv.style.display = 'none';
};

var module = angular.module('statistics', []);

module.controller('Statistics', function($scope, $http) {
    $scope.baseURL = 'https://api.census.gov/data';
    $scope.variables = [];
    $scope.showLoading = Helper.showLoading;
    $scope.hideLoading = Helper.hideLoading;
    $scope.activeComponent = Helper.DS_LIST;
    $scope.showDatasetList = function() {
        return $scope.activeComponent === Helper.DS_LIST;
    }
    $scope.showDatasetVars = function() {
        return $scope.activeComponent === Helper.DS_VARS;
    }
    $scope.showDatasetData = function() {
        return $scope.activeComponent === Helper.DS_DATA;
    }
    
    $scope.showLoading();
    $http.get(datasetsURL/* + '?key=' + theKey*/).
        then(function(response) {
            $scope.dataset = response.data.dataset;            
            $scope.mergeStrings = function(list) {
                var result = '';
                for (var i = 0; i < list.length; i++) {
                    result += '/' + list[i];
                }
                return result;
            }
            $scope.hideLoading();
        });
    $scope.focusOnDatasets = function() {
        $scope.activeComponent = Helper.DS_LIST;
    }
    $scope.updateDetails = function(object) {
        $scope.activeComponent = Helper.DS_VARS;
        var year = object['c_vintage'];
        $scope.fullDataURL  = $scope.baseURL + (year ? '/' +  year : '') + $scope.mergeStrings(object['c_dataset']) + '/';
        //?get=ST,COUNTY,NAME,NAICS2002,NESTAB&for=COUNTY:*
        var fullURL = $scope.fullDataURL + 'variables.json';
        $scope.showLoading();
        $http.get(fullURL).then(function(response) {
            var variablesObj = response.data.variables;
            var keys = Object.keys(variablesObj);
            $scope.variables = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if ((key !== 'for') && (key !== 'in')) {
                    variablesObj[key]['name'] = key;
                    $scope.variables.push(variablesObj[key]);
                }
            }
            console.log($scope.variables);
            $scope.hideLoading();
        });
    }
});
