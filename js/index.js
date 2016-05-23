var ligueDeFer = angular.module('LigueDeFer',['ngMaterial', 'ngRoute', 'ngMessages', 'material.svgAssetsCache', 'jkuri.gallery']);

ligueDeFer.config(function($mdIconProvider, $locationProvider, $routeProvider) {
    $mdIconProvider.defaultIconSet('img/icons/sets/core-icons.svg', 24);
//    $locationProvider.html5Mode(true);

    $routeProvider.when('/', {
        templateUrl: 'partials/accueil.html',
        controller: 'BasicController',
    }).otherwise('/');
});

ligueDeFer.filter('keyboardShortcut', function($window) {
    return function (str) {
        if (!str) return;
        var keys = str.split('-');
        var isOSX = /Mac OS X/.test($window.navigator.userAgent);

        var seperator = (!isOSX || keys.length > 2) ? '+' : '';

            var abbreviations = {
            M: isOSX ? '' : 'Ctrl',
            A: isOSX ? 'Option' : 'Alt',
            S: 'Shift'
        };

        return keys.map(function (key, index) {
            var last = index == keys.length - 1;
            return last ? key : abbreviations[key];
        }).join(seperator);
    };
});



ligueDeFer.config([
    'MenuBuilderProvider',
    'MainMenuDefinitionProvider',
    function(MenuBuilder, MainMenuConfig) {
        MenuBuilder.add('MainMenu', MainMenuConfig.$get);
    }
]);


ligueDeFer.provider("MenuBuilder", [
    '$routeProvider',
    function($routeProvider) {

        var menus = {};

        this.$get = function() {
            return function(name) {
                return menus[name];
            }
        };

        this.add = function(name, definition) {
            menus[name] = menuBuilder(definition);
        }

        function menuBuilder(menuDef) {

            return build();

            function build() {
                var menu = [];
                for (var itemDef in menuDef) {
                    var item = compileItem(menuDef[itemDef], '');
                    if (item) {
                        menu.push(item);
                    }
                }
                return menu;
            }

            function compileItem(itemDef, basePath) {
                if('controller' in itemDef) {
                    return compileController(itemDef, basePath);
                } else if ('submenu' in itemDef) {
                    return compileSubmenu(itemDef, basePath);
                } else if ('images' in itemDef) {
                    return compileImages(itemDef, basePath);
                } else if ('document' in itemDef) {
                    return compileDocument(itemDef, basePath);
                }
            }

            function compileController(itemDef, basePath) {
                var path = buildPath(basePath, itemDef.title);
                var item = {
                    type: 'controller',
                    uri: path,
                    title: itemDef.title,
                    controller: itemDef.controller
                };
                registerUri(item.uri, itemDef.controller, itemDef.template, item);
                return item;
            }

            function compileSubmenu(itemDef, basePath) {
                var path = buildPath(basePath, itemDef.title);
                var item = {
                    type: 'submenu',
                    uri: path,
                    title: itemDef.title,
                    submenu: []
                };
                for (var subItemDef in itemDef.submenu) {
                    var subItem = compileItem(itemDef.submenu[subItemDef], path);
                    if (subItem)
                        item.submenu.push(subItem);
                }
                return item;
            }

            function compileImages(itemDef, basePath) {
                var item = {
                    type: 'images',
                    uri: buildPath(basePath, itemDef.title),
                    title: itemDef.title,
                    images: itemDef.images,
                }
                registerUri(item.uri, makeControllerName("images"), makePartialName("images"), item);
                return item;
            }

            function compileDocument(itemDef, basePath) {
                var item = {
                    type: 'document',
                    uri: buildPath(basePath, itemDef.title),
                    title: itemDef.title,
                    documentUri: itemDef.document,
                }
                registerUri(item.uri, makeControllerName("document"), makePartialName("document"), item);
                return item;
            }

            function makeControllerName(controllerBase) {
                return controllerBase.slice(0, 1).toUpperCase() + controllerBase.slice(1) + "Controller";
            }

            function makePartialName(controllerBase) {
                return '/partials/' + controllerBase + '.html'
            }

            function buildPath(basePath, textual) {
                return (basePath + '/' + textual.replace(/\s+/g, '-')).toLowerCase();
            }

            function registerUri(uri, controller, partial, data) {
                $routeProvider.when(uri, {
                    templateUrl: partial,
                    controller: controller,
                    resolve: {
                        itemData: function() { return data; }
                    }
                });
            }
        }
    }
]);

ligueDeFer.controller('MainCtrl', function ($scope, $mdDialog, MenuBuilder) {
    $scope.MainMenu = MenuBuilder('MainMenu');

    this.settings = {
        printLayout: true,
        showRuler: true,
        showSpellingSuggestions: true,
        presentationMode: 'edit'
    };

    this.sampleAction = function (name, ev) {
        $mdDialog.show($mdDialog.alert()
            .title(name)
            .textContent('You triggered the "' + name + '" action')
            .ok('Great')
            .targetEvent(ev)
        );
    };
});

ligueDeFer.directive('flexMenu', [
    "MenuBuilder",
    "$location",
    "$interpolate",
    function (MenuBuilder, $location, $interpolate) {

        var itemHtml0 = $interpolate('<md-menu><button ng-click="itemClicked(\'{{ uri }}\')">{{ title }}</button><md-content></md-content></md-menu>');
        var itemHtml = $interpolate('<md-button ng-click="itemClicked(\'{{ uri }}\')">{{ title }}</md-button>');
        var imagesHtml0 = $interpolate('<md-menu><button ng-click="itemClicked(\'{{ uri }}\')">{{ title }}</button><md-content></md-content></md-menu>');
        var imagesHtml = $interpolate('<md-button ng-click="itemClicked(\'{{ uri }}\')">{{ title }}</md-button>');
        var documentHtml0 = $interpolate('<md-menu><button ng-click="itemClicked(\'{{ uri }}\')">{{ title }}</button><md-content></md-content></md-menu>');
        var documentHtml = $interpolate('<md-button ng-click="itemClicked(\'{{ uri }}\')">{{ title }}</md-button>');

        return {
            restrict: 'E',
            template: "<md-menu-bar></md-menu-bar>",
            compile: compile,
            scope: {
                definition: '=',
            },
        };

        function compile(elem, attrs) {
            var html = buildMenuHtml(MenuBuilder('MainMenu'));
            console.log(html);
            angular.element(elem.children(0)).html(html);
            return link;
        }

        function link($scope, elem, attrs) {
            $scope.itemClicked = function(uri) {
                $location.path(uri);
            }
        }

        function buildMenuHtml(menu) {
            var h = '';
            for(var i in menu) {
                var item = menu[i];
                if(item.type == 'submenu') {
                    h += '<md-menu>' + buildItemHtml(item) + '</md-menu>';
                } else if(item.type == 'controller') {
                    h += buildControllerHtml0(item);
                } else if(item.type == 'images') {
                    h += buildImagesHtml0(item);
                } else if(item.type == 'document') {
                    h += buildDocumentHtml0(item);
                }

            }
            return h;
        }

        function buildItemHtml(item) {
            var h;
            if(item.type == 'submenu') {
                h = buildSubmenuHtml(item);
            } else if(item.type == 'controller') {
                h += buildControllerHtml(item);
            } else if(item.type == 'images') {
                h = buildImagesHtml(item);
            } else if(item.type == 'document') {
                h = buildDocumentHtml(item);
            }
            return h;
        }

        function buildSubmenuHtml(item) {
            return '<button ng-click="$mdOpenMenu()">' + item.title + '</button><md-menu-content>'
                + buildSubmenuItemsHtml(item.submenu) + '</md-menu-content>';
        }

        function buildSubmenuItemsHtml(menu) {
            var h = '';
            for(var i in menu) {
                var item = menu[i];
                h += '<md-menu-item>';
                h += buildItemHtml(item);
                h += '</md-menu-item>';
            }
            return h;
        }

        function buildControllerHtml0(item) {
            return itemHtml0(item);
        }

        function buildControllerHtml(item) {
            return itemHtml(item);
        }

        function buildImagesHtml0(item) {
            return imagesHtml0(item);
        }

        function buildImagesHtml(item) {
            return imagesHtml(item);
        }

        function buildDocumentHtml0(item) {
            return documentHtml0(item);
        }

        function buildDocumentHtml(item) {
            return documentHtml(item);
        }

    }

]);

ligueDeFer.controller('BasicController', function() {
    // peut pas etre plus basic...
});

ligueDeFer.controller('DocumentController', function ($scope, itemData) {
    $scope.documentUri = itemData.documentUri;
});

ligueDeFer.controller('ImagesController', function ($scope, $templateCache, itemData) {

    var images = [];
    for(i in itemData.images) {
        var img = itemData.images[i];
        images.push({
            thumb: img.uri,
            img: img.uri,
            description: img.title
        })
    }
    $scope.images = images;
});
