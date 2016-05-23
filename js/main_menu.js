/**
 * Created by asselin on 16-05-20.
 */
angular.module('LigueDeFer').provider('MainMenuDefinition', function() {
    this.$get = [
        {
            title: "Accueil",
            controller: "BasicController",
            template: "partials/accueil.html"
        },{
            title: "Les documents",
            submenu: [
                {
                    title: "Classements",
                    document: "documents/classements.pdf"
                },{
                    title: "Horaire",
                    document: "documents/horaire.pdf"
                },{
                    title: "Points",
                    document: "documents/points.pdf"
                },{
                    title: "Tournois",
                    document: "documents/tournois.pdf"
                }
            ]
        },{
            title: "Plus de documents",
            submenu: [
                {
                    title: "Document 1",
                    document: "documents/document_1.pdf"
                },{
                    title: "Document 2",
                    document: "documents/document_2.pdf"
                },{
                    title: "Document 3",
                    document: "documents/document_3.pdf"
                },{
                    title: "Document 4",
                    document: "documents/document_4.pdf"
                }
            ]
        },{
            title: "Photos",
            images: [
                {
                    title: "Photo 1",
                    uri: "images/1.jpg"
                },{
                    title: "Photo 2",
                    uri: "images/2.jpg"
                },{
                    title: "Photo 3",
                    uri: "images/3.jpg"
                },{
                    title: "Photo 4",
                    uri: "images/4.jpg"
                },{
                    title: "Photo 5",
                    uri: "images/5.jpg"
                },{
                    title: "Photo 6",
                    uri: "images/6.jpg"
                },{
                    title: "Photo 7",
                    uri: "images/7.jpg"
                },{
                    title: "Photo 8",
                    uri: "images/8.jpg"
                },{
                    title: "Photo 9",
                    uri: "images/9.jpg"
                },{
                    title: "Photo 10",
                    uri: "images/10.jpg"
                },{
                    title: "Photo 11",
                    uri: "images/11.jpg"
                }
            ]
        }
    ];
});