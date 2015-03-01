app.controller('overviewCtrl',['$scope','$ionicModal','ioFactory',function($scope, $ionicModal,ioFactory){
    $scope.username = '';

    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.login = modal;
      $scope.login.show();

    });


    $scope.$on('overview.update', function () {
      $scope.users = ioFactory.users();
      $scope.$apply();
    });

    $scope.$on('messages.update', function () {
        $scope.$apply();
    });

    $scope.sendLogin = function(username){
      $scope.login.hide();
      ioFactory.login(username);
    }

    $scope.getUndreadedMessages = function(userId){
        return ioFactory.messages(userId).filter(function(m){ return m.isRead === false }).length;
    };

    $scope.isMe = function(userId){
        return (userId == ioFactory.UserId());
    }
}]);
app.controller('chatCtrl',['$scope','$stateParams','ioFactory','$ionicScrollDelegate' ,function($scope,$stateParams,ioFactory, $ionicScrollDelegate){
    $scope.userId = socket.io.engine.id;
    $scope.partnerId = $stateParams.UserID;
    $scope.messages = ioFactory.messages($scope.partnerId);


    $scope.$on('messages.update', function () {
      $scope.messages = ioFactory.messages($scope.partnerId);
      setMessagesToRead();
      $ionicScrollDelegate.$getByHandle('content').scrollBottom(true);
      $scope.$apply();
    });

    var setMessagesToRead = function(){
          var unreaded = $scope.messages.filter(function(uread){ return !uread.isRead});
          for (i = 0; i < unreaded.length; i++) {
            unreaded[i].isRead = true;
          }
    };

    $scope.sendMessage = function(){
      if($scope.message != undefined || $scope.message != '')
      {
        var mess = {
          "userId" : $scope.userId,
          "text": $scope.message,
          "isRead": true
        };
        ioFactory.send($scope.partnerId, mess);
        $ionicScrollDelegate.$getByHandle('content').scrollBottom(true);
        $scope.message = '';
      }
    };

    setMessagesToRead();
    $ionicScrollDelegate.$getByHandle('content').scrollBottom(true);
}]);
