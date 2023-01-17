window.addEventListener("keydown", handleKeyDown);

function handleKeyDown(event) {
    const keyPressed = event.keyCode;
    console.log(`keyPressed: ${keyPressed} ${event.code}`)

    // ignore if layer name editing
    if (namingInProgress) return;

    if (keyPressed == 46) { // Del
        if (selectionModel.enabled) {
            delete_selection_active_point_command();
        }
        else {
            delete_previous_shape_command();
        }
    }

    if (keyPressed == 107 || keyPressed == 187) {// +
        if (event.altKey) {
            palette_sequence_lenght_plus();
        } else
            grid_plus_command();
    }

    if (keyPressed == 109 || keyPressed == 189) {// -
        if (event.altKey) {
            palette_sequence_lenght_minus();
        } else
            grid_minus_command();
    }

    if (keyPressed == 111 || keyPressed == 188) {// NumpadDivide or <
        transparency_minus_command();
    }

    if (keyPressed == 106 || keyPressed == 190) {// NumpadMultiply or >
        transparency_plus_command();
    }

    if (keyPressed == 84) {// T
        transparency_max_min_command();
    }

    if (keyPressed == 70) {// F
        feel_tiles_grid_command();
    }

    if (keyPressed == 71) {// G
        grid_switch_command();
    }

    if (keyPressed == 191) {// ? slash
        help_switch_command();
    }
    if (keyPressed == 79) {// O
        observer_switch_command();
    }

    if (keyPressed == 72) {// H
        if (event.shiftKey) {
            selection_marks_switch_command();
        }
        else all_layers_visible_command(false);
    }

    if (keyPressed == 27) {// Esc
        handle_clear_command();
    }

    if (keyPressed == 69) {// E 
        if (event.target == document.body) {
            event.preventDefault();
        }
        edit_mode_switch_command();
    }

    if (keyPressed == 32) {// Space

        if (event.ctrlKey && event.target == document.body) {
            make_selection_from_layer_tiles_command();

        } else if (event.shiftKey) {
            clear_selection_command();
        }
        else {
            selection_tool_switch_command();
        }
    }

    if (keyPressed == 13) {// Enter

        if (event.ctrlKey) {
            fill_selection_tiles_command('next');

        } else if (event.altKey) {
            fill_selection_tiles_command('sequence');
        }
        else {
            apply_selection_command();
        }
    }

    if (keyPressed == 82) {// R
        random_color_switch_command();
    }

    if (keyPressed == 49) {// 1
        shape_apply_command('square');
    }

    if (keyPressed == 50) {// 2
        shape_apply_command('circle');
    }

    if (keyPressed == 51) {// 3
        shape_polygon_apply_command(3);
    }

    if (keyPressed == 52) {// 4
        shape_polygon_apply_command(4);
    }

    if (keyPressed == 53) {// 5
        shape_polygon_apply_command(5);
    }

    if (keyPressed == 54) {// 6
        shape_polygon_apply_command(6);
    }

    if (keyPressed == 55) {// 7
        shape_polygon_apply_command(7);
    }

    if (keyPressed == 56) {// 8
        shape_polygon_apply_command(8);
    }

    if (keyPressed == 57) {// 9
        shape_apply_command('circle2x');
    }

    if (keyPressed == 48) {// 0
        shape_apply_command('polyline');
    }

    if (keyPressed == 65) {// A
        if (event.ctrlKey) { select_all_command(); }
    }

    if (keyPressed == 67) {// C
        if (event.ctrlKey) {
            clipboard_copy_command();

        } else layer_clone_mode_switch_command();
    }

    if (keyPressed == 74) {// J
        selection_tool_close_path_switch_command();
    }

    if (keyPressed == 75) {// K
        layer_remove_command();
    }

    if (keyPressed == 76) {// L
        layer_add_command();
    }

    if (keyPressed == 77) {// M
        move_mode_switch_command();
    }

    if (keyPressed == 78) {// N
        move_mode_switch_command(true);
    }

    if (keyPressed == 73) {// I
        if (event.ctrlKey) {
            selection_tool_interpolation_switch_command();
        } else inverse_selection_switch_command();
    }

    if (keyPressed == 85) {// U
        reduce_selection_base_points_command();
    }

    if (keyPressed == 86) {// V

        if (event.ctrlKey) {
            clipboard_paste_command();
        } else all_layers_visible_command(true);
    }

    if (keyPressed == 87) {// W
        if (event.altKey) {
            apply_selection_color_command('next');
        } else
            apply_selection_color_command('sequence');
    }

    if (keyPressed == 68) {// D
        debug_mode_switch_command();
    }

    if (keyPressed == 88) {// X
        x_lock_command();
    }

    if (keyPressed == 89) {// Y
        y_lock_command();
    }

    if (keyPressed == 66) {// B
        // backround: black, white, custom
        if (event.ctrlKey) {//add
            background_command("add");
        }
        else if (event.shiftKey) {//remove
            background_command("remove");
        }
        else {//rotate
            background_command("rotate");
        }
    }

    if (keyPressed == 80) {// P
        hex_palette_switch_command();
    }

    if (keyPressed == 90) {// Z
        screenshot_mode_switch_command();
    }

    if (keyPressed == 81) {// Q
        save_picture_command();
    }

    if (keyPressed == 83) {// S
        save_file_command();
    }

    if (keyPressed == 38) { // ArrowUp  
        if (event.ctrlKey) {
            layer_move_up_command();
        } else palette_import_layer_colors_command();
    }

    if (keyPressed == 40) { // ArrowDown
        if (event.ctrlKey) {
            layer_move_down_command();
        } else palette_add_color_command();
    }

    if (keyPressed == 37) { // ArrowLeft
        history_back_command(event.ctrlKey ? true : false);
    }

    if (keyPressed == 39) { // ArrowRight
        history_forward_command(event.ctrlKey ? true : false);
    }

}