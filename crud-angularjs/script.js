var app = angular.module("myApp",[]);

app.controller("myController", ['$scope', '$timeout', function($scope, $timeout) {

    $scope.record = {};
    $scope.editMode = 'add';  // possible values : "add", "update"

    $scope.message = {};
    $scope.message.type = "info"; // possible values : "info", "danger", "warning"... (values of Bootstrap)
    $scope.message.content = '';
    $scope.message.show = false;

    $scope.products = [
        {"id":"1","name":"Iphone","price":1000,"quantity":20},
        {"id":"2","name":"Ipad","price":2000,"quantity":23},
        {"id":"3","name":"Galaxy Note","price":3000,"quantity":27},
        {"id":"4","name":"Galaxy S3","price":4000,"quantity":21}
    ];

    function findIndex(id){
        var answer = -1;
        for(let i = 0, imax=$scope.products.length; i<imax; i++) {
            if ($scope.products[i].id == id) {
                answer = i;
                break;
            }
        }
        return answer;
    };

    $scope.delete = function(id){
        var index = findIndex(id);
        if (index != -1) {
            $scope.products.splice(index, 1);
            sendMessage('Delete OK');
        }
    };

    $scope.selectEdit = function(id){
        var index = findIndex(id);
        if (index != -1) {
            var product = $scope.products[index];
            $scope.record.id = product.id;
            $scope.record.name = product.name;
            $scope.record.price = product.price;
            $scope.record.quantity = product.quantity;
            $scope.editMode = "update";
        }

    }

    function razForm () {
        $scope.record.id = "";
        $scope.record.name = "";
        $scope.record.price = "";
        $scope.record.quantity = "";
        $scope.editMode = "add";
    }

    function checkFormFilled() {
        let flag_filled = false;
        for (const item in $scope.record) {
            $scope.record[item] =  String($scope.record[item]).trim();
            let value = $scope.record[item];
            console.log(value);
            if (value != '') {
                flag_filled = true;
                break;
            }
        }
        return flag_filled;
    }

    function sendMessage(message) {
        $scope.message.content = message;
        $scope.message.show = true;

        let self = $scope.message;

        $timeout(()=>{
            self.show = false;
        }, 2000)
    }

    $scope.add = function(){
        if(!this.saveForm.$valid) {
            console.log('formulaire invalide');
        } else {
            let max_id = 1;
            if ($scope.products.length > 0) {
                max_id += Math.max(...$scope.products.map(item => item.id));
            }
            $scope.products.push({
                id: max_id,
                name: $scope.record.name,
                price: $scope.record.price,
                quantity: $scope.record.quantity
            });
            console.log('add form OK');
            sendMessage('Insert OK');
            razForm();
        }

    };
    
    $scope.update = function(){
        let flag_filled = checkFormFilled();
        if(flag_filled && !this.saveForm.$valid) {
            console.log('formulaire invalide');
        } else {
            let index = findIndex($scope.record.id);
            $scope.products[index].name = $scope.record.name;
            $scope.products[index].price = $scope.record.price;
            $scope.products[index].quantity = $scope.record.quantity;

            sendMessage('Update OK');
            razForm();
        }
    };

    $scope.cancel = function(){
        razForm();
    };
}]);