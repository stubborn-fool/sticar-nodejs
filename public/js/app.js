$(document).ready(function() {
    $('form#addCommentForm').on('submit', function() {
        var content = $(this).find('textarea[name="content"]').val()
        var news_id = $(this).find('input[name="news_id"]').val()

        $.ajax({
            type: 'POST',
            url: '/news/comment',
            data: {
                content,
                news_id
            },
            success: function(data) {
                location.reload()
                // $('ul.list-group').append(
                //     '<li data-id="'+data._id+'" class="list-group-item justify-content-between">'+
                //         data.content+
                //         '<span class="badge badge-danger" role="button"><i class="fa fa-times"></i></span>'+
                //     '</li>'
                // )

                // $('form#addCommentForm').find('textarea[name="content"]').val('')
            }
        })

        return false
    })

    $('.list-group-item span').on('click', function() {
        var comment_id = $(this).parent().attr('data-id')
        var news_id = $('form#addCommentForm').find('input[name="news_id"]').val()

        if (confirm('Are you sure you want to delete this comment from the DB?')) {
            $.ajax({
                type: 'POST',
                url: '/news/comment/delete',
                data: {
                    comment_id,
                    news_id
                },
                success: function(data, comment_id) {
                    location.reload()
                    // $('.list-group-item').attr('data-id', comment_id).remove()
                    // $('form#addCommentForm').find('textarea[name="content"]').val('')
                }
            })

            return false
        }

        return false
    })

    $('#searchNews .list-group a').highlight($('#searchNews h3').attr('data-id'))
})