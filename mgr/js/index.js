

window.onload = function() {
    new Vue({
        el      : '#app',
        data    : {
            jsonData    : '',
            message     : 'Hello world'
        },
        methods : {
            blah: function() {
                alert( 'blah' );
            },
            getJsonData: function( resource ) {
                this.$http.get( './data.json' ).then( function( response ) {
                    console.log( response );
                    this.message = 'AJAX OK';
                } );
            }
        },
        components : {
            'btn' : {
                template : '<div class="btn">AA</div>',
                methods  : {
                    blah: function() {
                        alert( 'blah blah');
                    }
                }
            }
        }
    });
}