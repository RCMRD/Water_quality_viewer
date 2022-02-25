const app_control = (function() {
    var chcks;
    var update_chcks, init_all, public_interface, add_table_column,
    read_csv_file;

    /*
    VARIABLES INITIALIZATIONS
    */

    /*
    DEFINE THE FUNCTIONS
    */  
    update_chcks = function(){
        chcks = $('#chckpanel').data('checks');
        for (const value in chcks) {
            $('#chckpanel').append($('<div class="form-check">').append(
                    ($('<input>', {
                        class:"form-check-input",
                        type:"checkbox",
                        value: value,
                        id: value
                    })),
                    ($('<label>', {
                        class:"form-check-label",
                        for: value,
                        text: chcks[value]['display']
                    }))
                )
            )
        }
    }

    add_table_column = function(){
        $('.form-check').on('click', function(e){
            e.preventDefault();
            $('thead tr').append($('<th>', {
                text: e.target.id
            }));
        })
    }

    read_csv_file = function(){
        const datavals = $('#filecontent').data('filecontent');
        console.log(datavals);
        const length = datavals.length;

        for (var i in datavals) {
            $('thead th').append($('<th>', {
                text: i
            }));
            // $('#lat').append($('<td>', {
            //         text: i
            //     }));
            // $('#lon').append($('<td>',{
            //         text: i
            //     }));
        }
    }

    /*
    Initialize Functions
    */
    init_all = function(){
        update_chcks();
        add_table_column();
        read_csv_file();
    }
    /*
    PUBLIC INTERFACE
    */
    public_interface = {};

    /*
    RUN THE FUNCTIONS
    */
    $(function(){
        init_all();
        $('#qfile').on('click', function(e) {
            e.preventDefault();
            console.log(e);
            read_csv_file();
        });

    });
    return public_interface;
}());