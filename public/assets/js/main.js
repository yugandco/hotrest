$(document).ready(function(){
    $('.delete-hotel-order').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/admin/hotel/' + id,
            success: function(response){
                alert('Deleting Hotel Booking');
                window.location.href = '/admin/hotel';
            },
            error: function(err){
                console.log(err)
            }
        })
    });
    $('.delete-rest-order').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/admin/restaurant/' + id,
            success: function(response){
                alert('Deleting Restaurant Booking');
                window.location.href = '/admin/restaurant';
            },
            error: function(err){
                console.log(err)
            }
        })
    });
});