var CC = CC || {
    Class : {}
}

CC.Class['Profile'] = (function(){

    var postUrl = '/user/profile/save';
    var button = null;
    var utilities = CC.Class['Utilities'];
    var cords = {
        x: 0,
        y: 0,
        w: 100,
        h: 100
    }

    function getFormFields() {
        var aboutMe =  $('textarea[name=about-me]').val();
        var name    =  $('input:text[name=full-name]').val();
        var location = $('input:text[name=location]').val();
        var fieldOfStudy = $('input:text[name=field-of-study]').val();
        var highestDegree = $('select[name=highest-degree]').val();

        // Social
        var twitter = $('input:text[name=profile-twitter]').val();
        var coursera = $('input:text[name=profile-coursera]').val();
        var linkedin= $('input:text[name=profile-linkedin]').val();
        var website = $('input:text[name=profile-website]').val();
        var facebook = $('input:text[name=profile-facebook]').val();
        var gplus = $('input:text[name=profile-gplus]').val();

        return {
            aboutMe: aboutMe,
            name: name,
            location: location,
            fieldOfStudy:fieldOfStudy,
            highestDegree:highestDegree,
            twitter: twitter,
            coursera:coursera,
            linkedin: linkedin,
            website: website,
            gplus: gplus,
            facebook: facebook
        };
    }

    /**
     *
     * @param button id of the save profile button
     */
    function init( btn_id, profile_image_upload_btn_id, btn_crop ) {
        // Attach event handler
        button = $(btn_id);
        button.click( handler );

        $(profile_image_upload_btn_id).fileupload({
            maxFileSize: 1000000
        });

        // Bind fileupload plugin callbacks
        $(profile_image_upload_btn_id)
            .bind('fileuploaddone', postStep1)
            .bind('fileuploadfail', function (e, data) {
                // File upload failed. Show an error message
                utilities.notify(
                    "Error",
                    "Error uploading file. Max file size is 1mb",
                    "error"
                );
            });

        // Crop button
        $(btn_crop).click(cropButtonHandler);
    }

    function showCoords(c) {
        // variables can be accessed here as
        // c.x, c.y, c.x2, c.y2, c.w, c.h
        cords.x = c.x;
        cords.y = c.y;
        cords.w = c.w;
        cords.h = c.h;

    };

    /**
     * This function is called after the step 1 of profile image
     * upload is executed on the backend
     */
    function postStep1(e,data ){
        var result = JSON.parse(data.result);
        if(!result.success){
            utilities.notify(
                "Profile photo upload error",
                result.message,
                "error"
            )
        } else {
            // Image uploaded. Load the crop plugin
            var imgUrl = result.message.imgUrl;
            var imgDiv = "#profile-pic-crop";
            $( imgDiv ).attr(
                'src',
                imgUrl
            );
            $(imgDiv).Jcrop({
                minSize:      [100,100],
                bgColor:      'black',
                boxWidth:     400,
                bgOpacity:   .4,
                aspectRatio: 1,
                setSelect:   [0,0,100,100],
                onSelect:    showCoords,
                onChange:    showCoords
            });
            $('#crop-photo-modal').modal('show')
        }
    }

    /**
     * Handles the click event for crop button
     */
    function cropButtonHandler(){
        $.ajax({
            type:"post",
            url: "/user/profile/image/step2",
            data: JSON.stringify(cords)
        }).done(function(result){
            result = JSON.parse(result);
            if( result['success'] ){
                // Refresh the page
                location.reload(true);
            } else {
                // Show an error message
                utilities.notifyWithDelay(
                    'Error Cropping photo',
                    'Some error occurred, please try again later',
                    'error',
                    60
                );
            }
        });
    }

    /**
     * Validates the profile form fields and shows
     * the respective error messages
     * @param profile
     * @returns {boolean}
     */
    function validate( profile ){
        var validationError = false;
        // Name cannot be empty and should be
        // atleast 3 letters long
        if(utilities.isEmpty(profile.name) && profile.name.length < 3 ) {
            validationError = true;
            $('#full-name-error').show();
        } else {
            $('#full-name-error').hide();
        }
        return validationError;
    }

    /**
     * handler which is called when save profile button is clicked
     * @param event
     */
    function handler(event) {
        event.preventDefault();
        // Disable the save profile button
        button.attr('disabled',true);
        var profile = getFormFields();
        var validationError = validate(profile);

        if(!validationError) {
            // Ajax post to save the profile
            save(profile);
        } else {
            utilities.notify(
                "Profile Validation Error",
                "Please make sure to enter only valid values in the form",
                "error"
            );
        }

    }

    /**
     * Function to save the validated profile
     * @param profile
     */
    function save(profile) {
        $.ajax({
            type:"post",
            url: postUrl,
            data: JSON.stringify(profile)
        })
            .done(
                function(result) {
                    result = JSON.parse(result);
                    if( result['success'] ){
                        // Refresh the page
                        location.reload(true);
                    } else {
                        // Show an error message
                        utilities.notifyWithDelay(
                            'Error saving profile',
                            'Some error occurred, please try again later',
                            'error',
                            60
                        );
                    }
                }
            );
    }

    return {
        init: init
    };
})();

CC.Class['Profile'].init('#save-profile','#fileupload','#btn-crop');