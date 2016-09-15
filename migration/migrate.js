var fs = require('fs');
var jsonfile = require('jsonfile')
var posts = 'drop-json-here/wp_posts.json'
var postDest= 'posts.json'

var request = require('sync-request');


var postDest= 'posts.json'

jsonfile.readFile(posts, function(err, arrOfPosts) {

    var counter =0;
    arrOfPosts.forEach(function(post) {

        var url = 'http://10.2.1.166/api/get_post/?post_type=product&post_status=publish&slug=[' + post.post_name + ']&custom_fields=wpcf-youtube-url,_yoast_wpseo_metadesc,_yoast_wpseo_opengraph-description,_yoast_wpseo_google-plus-description,_yoast_wpseo_opengraph-image';
        //var url = 'https://jsonplaceholder.typicode.com/albums'
        var res = request('GET', url);

        var product = res.getBody();

        var product_id = product.post.id;
        var product_type=product.post.type;
        var product_slug = product.post.slug;
        var product_title = product.post.title;
        var product_titleMain = product.post.title_main;


        if(product.post.taxonomy_brand.length > 0){
          //
        }






    });

    });
