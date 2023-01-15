window.addEventListener("keydown", handleKeyDown);

function handleKeyDown(event) {
    const keyPressed = event.keyCode;
    console.log(`keyPressed: ${keyPressed} ${event.code}`)

    // ignore if layer name editing
    if (namingInProgress) return;

    if (keyPressed == 46) { // Del
        if (selectionToolModel.enabled) {
            delete_selection_active_point_command();
        }
        else {
            delete_previous_shape_command();
        }
    }

    if (keyPressed == 107 || keyPressed == 187) {// +
        grid_plus_command();
    }

    if (keyPressed == 109 || keyPressed == 189) {// -
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

    if (keyPressed == 72) {// H
        all_layers_visible_command(false);
    }

    if (keyPressed == 27) {// Esc
        if (selectionToolModel.enabled) {
            delete_selection_points_command();
        } else {
            clear_layer_shapes_command();
        }
    }

    if (keyPressed == 69) {// E 
        if (event.target == document.body) {
            event.preventDefault();
        }
        edit_mode_switch_command();
    }

    if (keyPressed == 32) {// Space
        selection_tool_switch_command();
    }

    if (keyPressed == 13) {// Enter
        apply_selection_command(selectionToolModel.inversed);
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

    if (keyPressed == 67) {// C
        layer_clone_mode_switch_command();
    }

    if (keyPressed == 76) {// L
        layer_add_command();
    }

    if (keyPressed == 75) {// K
        layer_remove_command();
    }

    if (keyPressed == 77) {// M
        move_mode_switch_command();
    }

    if (keyPressed == 78) {// N
        move_mode_switch_command(true);
    }

    if (keyPressed == 73) {// I
        inversed_selection_switch_command();
    }

    if (keyPressed == 86) {// V
        all_layers_visible_command(true);
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

        canvas.style.background = model.background[model.backgroundIdx] ?? 'black';
        canvas.style.backgroundSize = 'contain';
        console.log(JSON.stringify(model.background));
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
        palette_import_layer_colors_command(event.ctrlKey ? true : false);
    }

    if (keyPressed == 37) { // ArrowLeft
        history_back_command();
    }

    if (keyPressed == 39) { // ArrowRight
        history_forward_command();
    }

    if (keyPressed == 40) { // ArrowDown
        palette_add_color_command();
    }
}