<?php
class controller_search
{

    function search_location()
    {
        $locations = common::load_model('search_model', 'get_locations');
        echo json_encode($locations);
    }

    function search_state_null()
    {
        $search = common::load_model('search_model', 'search_state_null');
        echo json_encode($search);
    }

    function search_state()
    {
        $search = common::load_model('search_model', 'search_state', $_POST['location']);
        echo json_encode($search);
    }

    function autocomplete()
    {
        if (!empty($_POST['location']) && empty($_POST['state'])) {
            echo json_encode(common::load_model('search_model', 'select_only_location', [$_POST['complete'], $_POST['location']]));
        } else if (!empty($_POST['location']) && !empty($_POST['state'])) {
            echo json_encode(common::load_model('search_model', 'select_location_state', [$_POST['complete'], $_POST['location'], $_POST['state']]));
        } else if (empty($_POST['location']) && !empty($_POST['state'])) {
            echo json_encode(common::load_model('search_model', 'select_only_state', [$_POST['state'], $_POST['complete']]));
        } else {
            echo json_encode(common::load_model('search_model', 'select_title', $_POST['complete']));
        }
    }
}
