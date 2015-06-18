var wikiGame = angular.module( 'wikiGame', []);

wikiGame.controller( 'wikiCtrl', function($scope, $http) {
  $scope.wikiContent = [];

  var url = 'http://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json&origin=http://patat.github.io';

  // $http.get( url )
  //   .success( function( response ) {
  //     $scope.wikiContent = response;
  //     console.log($scope.wikiContent);
  //   } );
});

$.ajax( {
    'url': 'https://en.wikipedia.org/w/api.php',
    'data': {
        'action': 'query',
        'meta': 'userinfo',
        'format': 'json',
        'origin': 'http://patat.github.io/'
    },
    'xhrFields': {
        'withCredentials': true
    },
    'success': function( data ) {
        alert( 'Foreign user ' + data.query.userinfo.name +
            ' (ID ' + data.query.userinfo.id + ')' );
    },
    'dataType': 'json'
} );